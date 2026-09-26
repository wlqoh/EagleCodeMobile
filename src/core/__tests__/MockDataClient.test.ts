import { MockDataClient } from '../MockDataClient';
import { memoryStore } from '../storage';
import type { KeyValueStore } from '../storage';

describe('MockDataClient', () => {
  let store: KeyValueStore;
  let client: MockDataClient;

  beforeEach(() => {
    store = memoryStore();
    client = new MockDataClient(store);
  });

  it('authenticates both demo roles', async () => {
    await expect(client.login({ email: 'athlete@eaglecode.ru', password: 'demo123' })).resolves.toMatchObject({ role: 'athlete' });
    await expect(client.login({ email: 'admin@eaglecode.ru', password: 'demo123' })).resolves.toMatchObject({ role: 'admin' });
  });

  it('persists a submitted application', async () => {
    const application = await client.submitApplication('a1', 'cp3');
    const restored = new MockDataClient(store);
    expect((await restored.getApplications()).find((item) => item.id === application.id)).toMatchObject({ status: 'pending' });
  });

  it('registers credentials that can be used after logout', async () => {
    await client.register({ fullName: 'Тестовый Спортсмен', email: 'new@example.ru', password: 'secret12', cityId: 'c1', organization: 'ДГТУ' });
    await expect(new MockDataClient(store).login({ email: 'new@example.ru', password: 'secret12' })).resolves.toMatchObject({ fullName: 'Тестовый Спортсмен' });
  });

  it('adds published result meters to the athlete', async () => {
    const before = await client.getAthlete('a1');
    await client.publishResult({ athleteId: 'a1', competitionId: 'cp1', place: 1, score: '9 задач · 1142', metersAwarded: 500 });
    expect((await client.getAthlete('a1')).meters).toBe(before.meters + 500);
  });

  it('removes the legacy v1 and v2 databases and writes v3 on first load', async () => {
    await store.setItem('eaglecode.mock.v1', JSON.stringify({ legacy: true }));
    await store.setItem('eaglecode.mock.v2', JSON.stringify({ legacy: true }));
    const fresh = new MockDataClient(store);
    await fresh.getCities();
    expect(await store.getItem('eaglecode.mock.v1')).toBeNull();
    expect(await store.getItem('eaglecode.mock.v2')).toBeNull();
    expect(await store.getItem('eaglecode.mock.v3')).not.toBeNull();
  });

  it('marks a notification as read and persists it', async () => {
    const [unread] = await client.getNotifications();
    expect(unread.readAt).toBeNull();

    const updated = await client.markNotificationRead(unread.id);
    expect(updated.readAt).not.toBeNull();

    const restored = new MockDataClient(store);
    const persisted = (await restored.getNotifications()).find((item) => item.id === unread.id);
    expect(persisted?.readAt).toBe(updated.readAt);
  });
});
