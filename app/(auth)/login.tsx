import { Link } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';

import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Field } from '@/components/ui/Field';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { Colors, font, space } from '@/theme/tokens';
import { useThemedStyles } from '@/theme/useThemedStyles';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('athlete@eaglecode.ru');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const styles = useThemedStyles(createStyles);

  const submit = async () => {
    setError(null);
    setBusy(true);
    try {
      await login({ email: email.trim(), password });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Не удалось войти');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Logo size={48} />
          <Eyebrow style={styles.eyebrow}>Спортивная высота // РД</Eyebrow>
          <Text style={styles.title}>Войти в EagleCode</Text>
          <Text style={styles.subtitle}>
            Используйте демо-доступ спортсмена или администратора.
          </Text>
          <Card style={styles.card}>
            <Field
              label="Email"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <Field
              label="Пароль"
              hint="Для демо: demo123"
              secureTextEntry
              autoComplete="current-password"
              value={password}
              onChangeText={setPassword}
            />
            {error ? (
              <Text style={styles.error} accessibilityRole="alert">
                {error}
              </Text>
            ) : null}
            <Button busy={busy} onPress={submit}>
              Войти в профиль
            </Button>
          </Card>
          <Link href="/register" style={styles.link}>
            Создать новый профиль
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: space.xl,
    paddingVertical: space.xxl,
    gap: space.sm,
  },
  eyebrow: {
    marginTop: space.lg,
  },
  title: {
    color: colors.text,
    fontFamily: font.displayBold,
    fontSize: 28,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.body,
    fontFamily: font.sans,
    fontSize: 13,
    lineHeight: 19,
  },
  card: {
    gap: space.md,
    marginTop: space.lg,
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
    marginTop: space.md,
  },
});
