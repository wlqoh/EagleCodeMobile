import { Redirect } from 'expo-router';

import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';

export default function Index() {
  const { user, ready } = useAuth();

  if (!ready) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (user.role === 'admin') {
    return <Redirect href="/admin-only" />;
  }

  return <Redirect href="/profile" />;
}
