import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/theme/ThemeContext';

export default function AuthLayout() {
  const { user, ready } = useAuth();
  const { colors } = useTheme();

  if (ready && user) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    />
  );
}
