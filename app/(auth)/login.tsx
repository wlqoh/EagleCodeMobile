import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { colors, font, space } from '@/theme/tokens';

/**
 * Каркас экрана входа (фаза 1–2). Форма с полями и валидацией — фаза 3.
 * Демо-кнопки ниже входят через реальный DataClient учётными данными из sid-БД.
 */
export default function LoginScreen() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const loginAs = async (email: string) => {
    setError(null);
    setBusy(true);
    try {
      await login({ email, password: 'demo123' });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Не удалось войти');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <View style={styles.content}>
        <Eyebrow>Eaglecode sport</Eyebrow>
        <Text style={styles.title}>Вход в кабинет участника</Text>
        <Card style={styles.card}>
          <Text style={styles.body}>
            Форма входа с полями появится на фазе 3. Кнопки ниже уже входят через DataClient.
          </Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button busy={busy} onPress={() => loginAs('athlete@eaglecode.ru')}>
            Войти как участник (демо)
          </Button>
          <Button variant="secondary" busy={busy} onPress={() => loginAs('admin@eaglecode.ru')}>
            Войти как администратор (демо)
          </Button>
        </Card>
        <Link href="/register" style={styles.link}>
          Создать новый профиль
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: space.xl,
    gap: space.md,
  },
  title: {
    color: colors.text,
    fontFamily: font.displayBold,
    fontSize: 28,
    letterSpacing: -0.5,
  },
  card: {
    gap: space.md,
    marginTop: space.lg,
  },
  body: {
    color: colors.body,
    fontFamily: font.sans,
    fontSize: 13,
    lineHeight: 19,
  },
  error: {
    color: colors.danger,
    fontFamily: font.sansMedium,
    fontSize: 13,
  },
  link: {
    alignSelf: 'center',
    color: colors.primary,
    fontFamily: font.sansSemiBold,
    fontSize: 13,
    marginTop: space.sm,
  },
});
