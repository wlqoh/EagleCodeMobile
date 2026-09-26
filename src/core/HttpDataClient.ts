// Источник: EagleCode/src/services/HttpDataClient.ts (веб-версия), адаптировано — см. раздел 4.5 docs/PLAN.md:
// токены хранятся в TokenStore (expo-secure-store), событие истечения сессии — колбэк onAuthExpired вместо
// window-события, добавлен single-flight refresh (бэкенд ротирует и блэклистит refresh-токен при обновлении,
// поэтому параллельные 401 не должны запускать несколько /auth/refresh одновременно).
import type { DataClient } from './DataClient';
import type { StoredTokens, TokenStore } from './storage';
import type {
  Achievement,
  Application,
  Athlete,
  City,
  Competition,
  CompetitionInput,
  CompetitionResult,
  EagleLevel,
  LoginInput,
  MeterInput,
  MeterTransaction,
  Notification,
  RegisterInput,
  ResultInput,
  SessionUser,
} from './types';

interface AuthResponse {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
}

export class HttpDataClient implements DataClient {
  private refreshing: Promise<boolean> | null = null;

  constructor(
    private readonly baseUrl: string,
    private readonly tokens: TokenStore,
    private readonly onAuthExpired: () => void,
  ) {}

  private async getTokens(): Promise<StoredTokens | null> {
    return this.tokens.get();
  }

  private async saveTokens(tokens: StoredTokens) {
    await this.tokens.set(tokens);
  }

  private async clearTokens() {
    await this.tokens.clear();
  }

  private async refresh(): Promise<boolean> {
    if (!this.refreshing) {
      this.refreshing = this.doRefresh().finally(() => {
        this.refreshing = null;
      });
    }
    return this.refreshing;
  }

  private async doRefresh(): Promise<boolean> {
    const tokens = await this.getTokens();
    if (!tokens?.refreshToken) return false;
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    });
    if (!response.ok) return false;
    await this.saveTokens((await response.json()) as StoredTokens);
    return true;
  }

  private async request<T>(path: string, init?: RequestInit, canRetry = true): Promise<T> {
    const accessToken = (await this.getTokens())?.accessToken;
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...init?.headers,
      },
    });
    if (response.status === 401 && canRetry && (await this.refresh())) return this.request<T>(path, init, false);
    if (!response.ok) {
      if (response.status === 401) {
        await this.clearTokens();
        this.onAuthExpired();
      }
      const payload = (await response.json().catch(() => null)) as { detail?: string } | null;
      throw new Error(payload?.detail ?? `HTTP ${response.status}`);
    }
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  private async authenticate(path: string, input: LoginInput | RegisterInput) {
    const result = await this.request<AuthResponse>(path, { method: 'POST', body: JSON.stringify(input) }, false);
    await this.saveTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken });
    return result.user;
  }

  login = (input: LoginInput) => this.authenticate('/auth/login', input);
  register = (input: RegisterInput) => this.authenticate('/auth/register', input);
  getCurrentUser = () => this.request<SessionUser>('/auth/me');
  logout = async () => {
    const refreshToken = (await this.getTokens())?.refreshToken;
    try {
      if (refreshToken) await this.request<void>('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) }, false);
    } finally {
      await this.clearTokens();
    }
  };
  getAthletes = () => this.request<Athlete[]>('/athletes');
  getAthlete = (id: string) => this.request<Athlete>(`/athletes/${id}`);
  updateAthlete = (id: string, input: Partial<Athlete>) => this.request<Athlete>(`/athletes/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
  getCompetitions = () => this.request<Competition[]>('/competitions');
  getCompetition = (id: string) => this.request<Competition>(`/competitions/${id}`);
  createCompetition = (input: CompetitionInput) => this.request<Competition>('/competitions', { method: 'POST', body: JSON.stringify(input) });
  getApplications = () => this.request<Application[]>('/applications');
  submitApplication = (athleteId: string, competitionId: string) => this.request<Application>('/applications', { method: 'POST', body: JSON.stringify({ athleteId, competitionId }) });
  updateApplication = (id: string, status: Application['status']) => this.request<Application>(`/applications/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
  getResults = () => this.request<CompetitionResult[]>('/results');
  publishResult = (input: ResultInput) => this.request<CompetitionResult>('/results', { method: 'POST', body: JSON.stringify(input) });
  getTransactions = () => this.request<MeterTransaction[]>('/rating/transactions');
  addMeters = (input: MeterInput) => this.request<MeterTransaction>('/rating/meters', { method: 'POST', body: JSON.stringify(input) });
  getCities = () => this.request<City[]>('/cities');
  getAchievements = (athleteId: string) => this.request<Achievement[]>(`/athletes/${athleteId}/achievements`);
  getLevels = () => this.request<EagleLevel[]>('/levels');
  updateLevel = (id: string, input: Partial<EagleLevel>) => this.request<EagleLevel>(`/levels/${id}`, { method: 'PATCH', body: JSON.stringify(input) });
  getNotifications = () => this.request<Notification[]>('/notifications');
  markNotificationRead = (id: string) => this.request<Notification>(`/notifications/${id}`, { method: 'PATCH', body: JSON.stringify({ read: true }) });
  reset = async () => undefined;
}
