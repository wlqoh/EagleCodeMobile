import { useMemo } from 'react';

import { useTheme } from '@/theme/ThemeContext';
import { Colors } from '@/theme/tokens';

/** Строит стили из текущей палитры темы и пересчитывает их только при смене темы. */
export function useThemedStyles<T>(factory: (colors: Colors) => T): T {
  const { colors } = useTheme();
  return useMemo(() => factory(colors), [colors, factory]);
}
