import type { DataClient } from '@/core/DataClient';
import { HttpDataClient } from '@/core/HttpDataClient';
import { MockDataClient } from '@/core/MockDataClient';
import { asyncStorageStore, secureTokenStore } from '@/core/storage';

const source = process.env.EXPO_PUBLIC_DATA_SOURCE === 'api' ? 'api' : 'mock';
export const useHttpDataSource = source === 'api';

export const authEvents = {
  listeners: new Set<() => void>(),
  emit() {
    this.listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  },
};

export const dataClient: DataClient = useHttpDataSource
  ? new HttpDataClient(
      process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8000/api',
      secureTokenStore,
      () => authEvents.emit(),
    )
  : new MockDataClient(asyncStorageStore);
