import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { LoginInput, RegisterInput, SessionUser } from '@/core/types';
import { authEvents, dataClient, useHttpDataSource } from '@/services/client';

const SESSION_STORAGE_KEY = 'eaglecode.session.v1';

type AuthContextValue = {
  user: SessionUser | null;
  ready: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function readSession(): Promise<SessionUser | null> {
  const raw = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

async function saveSession(user: SessionUser) {
  await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
}

async function clearSession() {
  await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const stored = await readSession();
      if (cancelled) return;

      if (!stored) {
        setReady(true);
        return;
      }

      if (useHttpDataSource) {
        try {
          const current = await dataClient.getCurrentUser();
          if (!cancelled) setUser(current);
        } catch {
          await clearSession();
        }
      } else {
        setUser(stored);
      }

      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return authEvents.subscribe(() => {
      clearSession();
      setUser(null);
      queryClient.clear();
    });
  }, [queryClient]);

  const login = useCallback(async (input: LoginInput) => {
    const nextUser = await dataClient.login(input);
    await saveSession(nextUser);
    setUser(nextUser);
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const nextUser = await dataClient.register(input);
    await saveSession(nextUser);
    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    await dataClient.logout();
    await clearSession();
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo(
    () => ({ user, ready, login, register, logout }),
    [user, ready, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен вызываться внутри AuthProvider');
  }
  return context;
}
