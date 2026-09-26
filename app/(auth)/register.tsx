import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Screen } from '@/components/ui/Screen';
import { colors, font, space } from '@/theme/tokens';

/** Каркас экрана регистрации (фаза 1). Форма и выбор города через city-picker — фаза 3. */
export default function RegisterScreen() {
  return (
    <Screen>
      <View style={styles.content}>
        <Eyebrow>Eaglecode sport</Eyebrow>
        <Text style={styles.title}>Регистрация участника</Text>
        <Card>
          <Text style={styles.body}>
            Форма регистрации с выбором населённого пункта появится на фазе 3.
          </Text>
        </Card>
        <Link href="/login" style={styles.link}>
          Уже есть профиль? Войти
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
