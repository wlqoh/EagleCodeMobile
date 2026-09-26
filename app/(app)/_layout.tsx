import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/theme/ThemeContext';
import { font } from '@/theme/tokens';

export default function AppLayout() {
  const { user, ready } = useAuth();
  const { colors } = useTheme();

  if (!ready) {
    return null;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (user.role === 'admin') {
    return <Redirect href="/admin-only" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: font.displayBold },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="profile-edit" options={{ presentation: 'modal', title: 'Редактирование профиля' }} />
      <Stack.Screen name="competitions/[id]" options={{ title: 'Соревнование' }} />
      <Stack.Screen name="athlete/[id]" options={{ title: 'Участник' }} />
      <Stack.Screen name="results" options={{ title: 'Результаты' }} />
      <Stack.Screen name="achievements" options={{ title: 'Достижения' }} />
      <Stack.Screen name="levels" options={{ title: 'Уровни Орла' }} />
      <Stack.Screen name="cities" options={{ title: 'Рейтинг городов' }} />
      <Stack.Screen name="notifications" options={{ title: 'Уведомления' }} />
    </Stack>
  );
}
