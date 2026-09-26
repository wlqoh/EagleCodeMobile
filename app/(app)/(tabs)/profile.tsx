import { Link } from 'expo-router';
import { Bell, SquarePen } from 'lucide-react-native';
import { Pressable, StyleSheet, Text } from 'react-native';

import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Screen } from '@/components/ui/Screen';
import { colors, font, space } from '@/theme/tokens';

export default function ProfileScreen() {
  return (
    <Screen>
      <ScreenHeader
        eyebrow="Кабинет участника"
        title="Профиль"
        description="Прогресс по уровням Орла, метрика сезона и последние результаты."
        actions={
          <>
            <Link href="/notifications" asChild>
              <Pressable accessibilityLabel="Уведомления" style={styles.iconButton}>
                <Bell color={colors.text} size={20} />
              </Pressable>
            </Link>
            <Link href="/profile-edit" asChild>
              <Pressable accessibilityLabel="Редактировать профиль" style={styles.iconButton}>
                <SquarePen color={colors.text} size={20} />
              </Pressable>
            </Link>
          </>
        }
      />
      <Text style={styles.placeholder}>Баннер профиля, прогресс и метрики появятся в фазе 3.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.highest,
  },
  placeholder: {
    color: colors.muted,
    fontFamily: font.sans,
    fontSize: 13,
    paddingHorizontal: space.lg,
  },
});
