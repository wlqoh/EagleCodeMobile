import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { asyncStorageStore } from '@/core/storage';
import { colorsByScheme, Colors, ColorScheme } from '@/theme/tokens';

export type ThemeMode = ColorScheme | 'system';

const THEME_MODE_KEY = 'eaglecode.theme-mode.v1';

type ThemeContextValue = {
  colors: Colors;
  scheme: ColorScheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system';
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useSystemColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    asyncStorageStore.getItem(THEME_MODE_KEY).then((stored) => {
      if (isThemeMode(stored)) {
        setModeState(stored);
      }
    });
  }, []);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    asyncStorageStore.setItem(THEME_MODE_KEY, next).catch(() => {});
  };

  const scheme: ColorScheme = mode === 'system' ? (systemColorScheme === 'light' ? 'light' : 'dark') : mode;

  const value = useMemo<ThemeContextValue>(
    () => ({ colors: colorsByScheme[scheme], scheme, mode, setMode }),
    [scheme, mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme должен вызываться внутри ThemeProvider');
  }
  return value;
}
