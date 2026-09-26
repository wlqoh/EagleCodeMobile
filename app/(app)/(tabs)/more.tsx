import { Link } from 'expo-router';
import { ChevronRight, LogOut } from 'lucide-react-native';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Href } from 'expo-router';

import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { colors, font, radius, space } from '@/theme/tokens';

const menuItems: { href: Href; label: string }[] = [
  { href: '/results', label: 'Результаты' },
  { href: '/achievements', label: 'Достижения' },
  { href: '/levels', label: 'Уровни Орла' },
  { href: '/cities', label: 'Рейтинг городов' },
  { href: '/notifications', label: 'Уведомления' },
];

export default function MoreScreen() {
  const { user, logout } = useAuth();

  const confirmLogout = () => {
    Alert.alert('Выйти из аккаунта?', undefined, [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Выйти', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <Screen>
      <ScreenHeader eyebrow={user?.fullName ?? ''} title="Ещё" />
      <View style={styles.menu}>
        {menuItems.map((item) => (
          <Link key={item.label} href={item.href} asChild>
            <Pressable style={styles.row}>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <ChevronRight color={colors.muted} size={18} />
            </Pressable>
          </Link>
        ))}
        <Pressable style={styles.row} onPress={confirmLogout}>
          <Text style={[styles.rowLabel, styles.logoutLabel]}>Выйти</Text>
          <LogOut color={colors.danger} size={18} />
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  menu: {
    marginHorizontal: space.lg,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  row: {
    minHeight: 52,
    paddingHorizontal: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  rowLabel: {
    color: colors.text,
    fontFamily: font.sansMedium,
    fontSize: 14,
  },
  logoutLabel: {
    color: colors.danger,
  },
});
