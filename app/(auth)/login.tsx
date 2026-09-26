import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { colors, font, space } from '@/theme/tokens';

/**
 * Каркас экрана входа (фаза 1). Полная форма и запрос к DataClient — фаза 3.
 * Демо-кнопки ниже временно проверяют навигационные guard'ы.
 */
export default function LoginScreen() {
  const { login } = useAuth();

  return (
    <Screen>
      <View style={styles.content}>
        <Eyebrow>Eaglecode sport</Eyebrow>
        <Text style={styles.title}>Вход в кабинет участника</Text>
        <Card style={styles.card}>
          <Text style={styles.body}>
            Форма входа появится на фазе 3. Пока доступны демо-входы для проверки навигации.
          </Text>
          <Button onPress={() => login({ id: 'u-athlete', name: 'Демо-участник', role: 'athlete' })}>
            Войти как участник (демо)
          </Button>
          <Button
            variant="secondary"
            onPress={() => login({ id: 'u-admin', name: 'Демо-администратор', role: 'admin' })}
          >
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
  link: {
    alignSelf: 'center',
    color: colors.primary,
    fontFamily: font.sansSemiBold,
    fontSize: 13,
    marginTop: space.sm,
  },
});
