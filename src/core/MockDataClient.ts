// Источник: EagleCode/src/services/MockDataClient.ts (веб-версия), адаптировано под асинхронный KeyValueStore
// (AsyncStorage вместо синхронного localStorage) — см. раздел 4.4 docs/PLAN.md.
import { rankAthletes } from './eagleLevels';
import { NO_RANK } from './ranks';
import type { DataClient } from './DataClient';
import { seedDatabase } from './seed';
import type { KeyValueStore } from './storage';
import type {
  Application,
  Athlete,
  CompetitionInput,
  EagleLevel,
  LoginInput,
  MeterInput,
  MockDatabase,
  Notification,
  RegisterInput,
  ResultInput,
  SessionUser,
} from './types';

const STORAGE_KEY = 'eaglecode.mock.v3';
/** Старые версии mock-базы: удаляются при первом запуске с новым сидом. */
const LEGACY_STORAGE_KEYS = ['eaglecode.mock.v1', 'eaglecode.mock.v2'];
const SESSION_KEY = 'eaglecode.session.v1';
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const pause = () => new Promise((resolve) => setTimeout(resolve, 80));

export class MockDataClient implements DataClient {
  private db: MockDatabase | null = null;

  constructor(
    private readonly store: KeyValueStore,
    private readonly readSession?: () => Promise<SessionUser | null>,
  ) {}

  private async defaultReadSession(): Promise<SessionUser | null> {
    const stored = await this.store.getItem(SESSION_KEY);
    return stored ? (JSON.parse(stored) as SessionUser) : null;
  }

  private async load(): Promise<MockDatabase> {
    if (this.db) return this.db;
    const stored = await this.store.getItem(STORAGE_KEY);
    const database = stored ? (JSON.parse(stored) as MockDatabase) : clone(seedDatabase);
    if (!stored) {
      await Promise.all(LEGACY_STORAGE_KEYS.map((key) => this.store.removeItem(key)));
      await this.save(database);
    }
    this.db = database;
    return database;
  }

  private async save(database: MockDatabase) {
    this.db = database;
    await this.store.setItem(STORAGE_KEY, JSON.stringify(database));
  }

  private async done<T>(value: T) {
    await pause();
    return clone(value);
  }

  async login(input: LoginInput) {
    const database = await this.load();
    const user = database.users.find((item) => item.email === input.email);
    if (!user || database.credentials[input.email] !== input.password) throw new Error('Неверный email или пароль');
    return this.done(user);
  }

  async register(input: RegisterInput) {
    const database = await this.load();
    const id = `a-${Date.now()}`;
    const athlete: Athlete = {
      id,
      fullName: input.fullName,
      email: input.email,
      cityId: input.cityId,
      organization: input.organization,
      disciplines: [],
      sportTitle: NO_RANK,
      meters: 0,
      avatarInitials: input.fullName.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
      joinedAt: new Date().toISOString(),
    };
    const user = { id: `u-${Date.now()}`, email: input.email, fullName: input.fullName, role: 'athlete' as const, athleteId: id };
    database.athletes.push(athlete);
    database.users.push(user);
    database.credentials[input.email] = input.password;
    await this.save(database);
    return this.done(user);
  }

  async getCurrentUser() {
    const session = this.readSession ? await this.readSession() : await this.defaultReadSession();
    if (!session) throw new Error('Сессия не найдена');
    return this.done(session);
  }

  async logout() {
    await pause();
  }

  async getAthletes() {
    const database = await this.load();
    return this.done(rankAthletes(database.athletes));
  }

  async getAthlete(id: string) {
    const database = await this.load();
    return this.done(this.require(database.athletes.find((item) => item.id === id)));
  }

  async updateAthlete(id: string, input: Partial<Athlete>) {
    const database = await this.load();
    const index = database.athletes.findIndex((item) => item.id === id);
    database.athletes[index] = { ...this.require(database.athletes[index]), ...input, id };
    await this.save(database);
    return this.done(database.athletes[index]);
  }

  async getCompetitions() {
    const database = await this.load();
    return this.done(database.competitions);
  }

  async getCompetition(id: string) {
    const database = await this.load();
    return this.done(this.require(database.competitions.find((item) => item.id === id)));
  }

  async createCompetition(input: CompetitionInput) {
    const database = await this.load();
    const competition = { ...input, id: `cp-${Date.now()}` };
    database.competitions.unshift(competition);
    await this.save(database);
    return this.done(competition);
  }

  async getApplications() {
    const database = await this.load();
    return this.done(database.applications);
  }

  async submitApplication(athleteId: string, competitionId: string) {
    const database = await this.load();
    const existing = database.applications.find((item) => item.athleteId === athleteId && item.competitionId === competitionId);
    if (existing) return this.done(existing);
    const application: Application = { id: `ap-${Date.now()}`, athleteId, competitionId, status: 'pending', createdAt: new Date().toISOString() };
    database.applications.unshift(application);
    await this.save(database);
    return this.done(application);
  }

  async updateApplication(id: string, status: Application['status']) {
    const database = await this.load();
    const application = this.require(database.applications.find((item) => item.id === id));
    application.status = status;
    await this.save(database);
    return this.done(application);
  }

  async getResults() {
    const database = await this.load();
    return this.done(database.results);
  }

  async publishResult(input: ResultInput) {
    const database = await this.load();
    const result = { ...input, id: `r-${Date.now()}`, publishedAt: new Date().toISOString() };
    database.results.unshift(result);
    const athlete = this.require(database.athletes.find((item) => item.id === input.athleteId));
    athlete.meters += input.metersAwarded;
    database.transactions.unshift({ id: `t-${Date.now()}`, athleteId: input.athleteId, amount: input.metersAwarded, reason: `Результат: ${result.score}`, protocol: `AUTO-${Date.now()}`, createdAt: result.publishedAt });
    await this.save(database);
    return this.done(result);
  }

  async getTransactions() {
    const database = await this.load();
    return this.done(database.transactions);
  }

  async addMeters(input: MeterInput) {
    const database = await this.load();
    const transaction = { ...input, id: `t-${Date.now()}`, createdAt: new Date().toISOString() };
    database.transactions.unshift(transaction);
    this.require(database.athletes.find((item) => item.id === input.athleteId)).meters += input.amount;
    await this.save(database);
    return this.done(transaction);
  }

  async getCities() {
    const database = await this.load();
    return this.done(database.cities);
  }

  async getAchievements(athleteId: string) {
    const database = await this.load();
    return this.done(database.achievements.filter((item) => item.athleteId === athleteId));
  }

  async getLevels() {
    const database = await this.load();
    return this.done(database.levels);
  }

  async updateLevel(id: string, input: Partial<EagleLevel>) {
    const database = await this.load();
    const index = database.levels.findIndex((item) => item.id === id);
    database.levels[index] = { ...this.require(database.levels[index]), ...input, id };
    await this.save(database);
    return this.done(database.levels[index]);
  }

  async getNotifications(): Promise<Notification[]> {
    const database = await this.load();
    const sorted = [...database.notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return this.done(sorted);
  }

  async markNotificationRead(id: string): Promise<Notification> {
    const database = await this.load();
    const notification = this.require(database.notifications.find((item) => item.id === id));
    notification.readAt = new Date().toISOString();
    await this.save(database);
    return this.done(notification);
  }

  async reset() {
    await this.store.removeItem(STORAGE_KEY);
    this.db = null;
    await pause();
  }

  private require<T>(value: T | undefined): T {
    if (!value) throw new Error('Запись не найдена');
    return value;
  }
}
