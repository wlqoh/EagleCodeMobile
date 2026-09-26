import { Link, router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Field } from '@/components/ui/Field';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { useCities } from '@/hooks/useData';
import { clearPickedCity, usePickedCity } from '@/state/cityPick';
import { colors, font, radius, space } from '@/theme/tokens';

export default function RegisterScreen() {
  const { register } = useAuth();
  const cities = useCities();
  const pickedCityId = usePickedCity();
  const selectedCity = cities.data?.find((city) => city.id === pickedCityId);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!pickedCityId) {
      setError('Выберите населённый пункт');
      return;
    }
    if (password.length < 6) {
      setError('Пароль должен быть не короче 6 символов');
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await register({
        fullName,
        email: email.trim(),
        password,
        cityId: pickedCityId,
        organization,
      });
      clearPickedCity();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Не удалось зарегистрироваться');
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
          <Eyebrow style={styles.eyebrow}>Secure profile node</Eyebrow>
          <Text style={styles.title}>Создать профиль</Text>
          <Text style={styles.subtitle}>Начните путь в спортивном рейтинге Дагестана.</Text>
          <Card style={styles.card}>
            <Field label="ФИО" autoComplete="name" value={fullName} onChangeText={setFullName} />
            <Field
              label="Email"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <Field
              label="Организация"
              autoComplete="organization"
              value={organization}
              onChangeText={setOrganization}
            />
            <View style={styles.field}>
              <Text style={styles.label}>Населённый пункт</Text>
              <Pressable style={styles.cityButton} onPress={() => router.push('/city-picker')}>
                <Text style={selectedCity ? styles.cityValue : styles.cityPlaceholder}>
                  {selectedCity?.name ?? 'Выбрать город'}
                </Text>
                <ChevronRight color={colors.muted} size={18} />
              </Pressable>
            </View>
            <Field
              label="Пароль"
              hint="Не короче 6 символов"
              secureTextEntry
              autoComplete="new-password"
              value={password}
              onChangeText={setPassword}
            />
            {error ? (
              <Text style={styles.error} accessibilityRole="alert">
                {error}
              </Text>
            ) : null}
            <Button busy={busy} onPress={submit}>
              Создать профиль
            </Button>
          </Card>
          <Link href="/login" style={styles.link}>
            Уже есть профиль? Войти
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  field: {
    gap: space.xs + 3,
  },
  label: {
    color: '#d7ddd8',
    fontFamily: font.sansSemiBold,
    fontSize: 13,
  },
  cityButton: {
    minHeight: 44,
    paddingVertical: 9,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm + 1,
  },
  cityValue: {
    color: colors.text,
    fontFamily: font.sans,
    fontSize: 14,
  },
  cityPlaceholder: {
    color: colors.inputPlaceholder,
    fontFamily: font.sans,
    fontSize: 14,
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
