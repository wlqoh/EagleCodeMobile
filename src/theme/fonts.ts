import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Geist_600SemiBold,
  Geist_700Bold,
} from '@expo-google-fonts/geist';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_600SemiBold,
} from '@expo-google-fonts/jetbrains-mono';

/** Карта шрифтов для `useFonts` — соответствует семействам в `theme/tokens.ts`. */
export const fontsToLoad = {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Geist_600SemiBold,
  Geist_700Bold,
  JetBrainsMono_400Regular,
  JetBrainsMono_600SemiBold,
} as const;
