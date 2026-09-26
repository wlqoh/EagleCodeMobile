import { Link } from 'expo-router';
import { ChevronRight, LogOut } from 'lucide-react-native';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Href } from 'expo-router';

import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { useAthlete } from '@/hooks/useData';
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
  const athlete = useAthlete(user?.athleteId);

  const confirmLogout = () => {
    Alert.alert('Выйти из аккаунта?', undefined, [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Выйти', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <Screen>
      <ScreenHeader eyebrow="Кабинет участника" title="Ещё" />
      <Card style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{athlete.data?.avatarInitials ?? user?.fullName.slice(0, 2)}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.fullName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </Card>
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    marginHorizontal: space.lg,
    marginBottom: space.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.highest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.primary,
    fontFamily: font.displayBold,
    fontSize: 16,
    textTransform: 'uppercase',
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    color: colors.text,
    fontFamily: font.sansSemiBold,
    fontSize: 15,
  },
  userEmail: {
    color: colors.muted,
    fontFamily: font.sans,
    fontSize: 12,
  },
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
