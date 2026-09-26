import { HttpDataClient } from '../HttpDataClient';
import type { StoredTokens, TokenStore } from '../storage';

function createTokenStore(initial: StoredTokens | null): TokenStore & { current: () => StoredTokens | null } {
  let tokens = initial;
  return {
    async get() {
      return tokens;
    },
    async set(next) {
      tokens = next;
    },
    async clear() {
      tokens = null;
    },
    current: () => tokens,
  };
}

function jsonResponse(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

describe('HttpDataClient', () => {
  const baseUrl = 'https://api.example.test';

  it('sends the access token as a Bearer header', async () => {
    const tokens = createTokenStore({ accessToken: 'ACCESS1', refreshToken: 'REFRESH1' });
    const fetchMock = jest.fn(async () => jsonResponse(200, []));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const client = new HttpDataClient(baseUrl, tokens, jest.fn());
    await client.getAthletes();

    expect(fetchMock).toHaveBeenCalledWith(
      `${baseUrl}/athletes`,
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer ACCESS1' }),
      }),
    );
  });

  it('runs a single /auth/refresh for two parallel 401s', async () => {
    const tokens = createTokenStore({ accessToken: 'EXPIRED', refreshToken: 'REFRESH1' });
    let refreshCalls = 0;
    let dataCalls = 0;

    const fetchMock = jest.fn(async (url: string) => {
      if (url.endsWith('/auth/refresh')) {
        refreshCalls += 1;
        return jsonResponse(200, { accessToken: 'ACCESS2', refreshToken: 'REFRESH2' });
      }
      dataCalls += 1;
      return dataCalls <= 2 ? jsonResponse(401, { detail: 'expired' }) : jsonResponse(200, []);
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const client = new HttpDataClient(baseUrl, tokens, jest.fn());
    await Promise.all([client.getAthletes(), client.getCompetitions()]);

    expect(refreshCalls).toBe(1);
    expect(tokens.current()).toMatchObject({ accessToken: 'ACCESS2' });
  });

  it('clears tokens and calls onAuthExpired when refresh fails', async () => {
    const tokens = createTokenStore({ accessToken: 'EXPIRED', refreshToken: 'REFRESH1' });
    const onAuthExpired = jest.fn();

    const fetchMock = jest.fn(async (url: string) => {
      if (url.endsWith('/auth/refresh')) return jsonResponse(400, { detail: 'invalid refresh token' });
      return jsonResponse(401, { detail: 'expired' });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const client = new HttpDataClient(baseUrl, tokens, onAuthExpired);
    await expect(client.getAthletes()).rejects.toThrow();

    expect(onAuthExpired).toHaveBeenCalledTimes(1);
    expect(tokens.current()).toBeNull();
  });
});
