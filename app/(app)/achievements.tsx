import { Award, Lock, Medal, ShieldCheck } from 'lucide-react-native';
import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Chips } from '@/components/ui/Chips';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { placeholders } from '@/core/placeholders';
import type { Achievement } from '@/core/types';
import { useAchievements } from '@/hooks/useData';
import { useTheme } from '@/theme/ThemeContext';
import { Colors, font, radius, space } from '@/theme/tokens';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { formatDate } from '@/utils/format';

const statusOptions: { key: 'all' | Achievement['status']; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'verified', label: 'Подтверждённые' },
  { key: 'progress', label: 'В процессе' },
  { key: 'locked', label: 'Закрытые' },
];

export default function AchievementsScreen() {
  const { user } = useAuth();
  const achievements = useAchievements(user?.athleteId);
  const [status, setStatus] = useState<'all' | Achievement['status']>('all');
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const header = (
    <>
      <Text style={styles.intro}>
        Дипломы, спортивные рубежи и подтверждённые результаты сезона.
      </Text>
      <Card style={styles.feature}>
        <View style={styles.featureIcon}>
          <Medal color={colors.gold} size={22} />
        </View>
        <View style={styles.featureBody}>
          <Badge tone="gold">Последнее достижение</Badge>
          <Text style={styles.featureTitle}>{placeholders.achievements.featuredTitle}</Text>
          <Text style={styles.featureText}>{placeholders.achievements.featuredText}</Text>
        </View>
        <ShieldCheck color={colors.primary} size={20} />
      </Card>
      <View style={styles.chipsWrap}>
        <Chips
          options={statusOptions.map((item) => ({ key: item.key, label: item.label }))}
          value={status}
          onChange={(key) => setStatus(key as 'all' | Achievement['status'])}
        />
      </View>
    </>
  );

  if (achievements.isError) {
    return (
      <Screen>
        {header}
        <EmptyState
          title="Не удалось загрузить достижения"
          actionLabel="Повторить"
          onAction={() => achievements.refetch()}
        />
      </Screen>
    );
  }

  if (!achievements.data) {
    return (
      <Screen>
        {header}
        <LoadingState />
      </Screen>
    );
  }

  const filtered = achievements.data.filter((item) => status === 'all' || item.status === status);

  return (
    <Screen>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: space.sm }} />}
        refreshControl={
          <RefreshControl
            refreshing={achievements.isFetching}
            onRefresh={() => achievements.refetch()}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <Card style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              {item.status === 'locked' ? (
                <Lock color={colors.muted} size={18} />
              ) : (
                <Award color={colors.primary} size={18} />
              )}
            </View>
            <Badge tone={item.status === 'verified' ? 'primary' : 'default'}>{item.category}</Badge>
            <Text style={styles.achievementTitle}>{item.title}</Text>
            <Text style={styles.achievementDescription}>{item.description}</Text>
            <Text style={styles.achievementMeta}>
              {item.earnedAt
                ? formatDate(item.earnedAt)
                : item.status === 'progress'
                  ? 'Выполняется'
                  : 'Ещё не открыто'}
            </Text>
          </Card>
        )}
        ListEmptyComponent={<EmptyState title="Достижения не найдены" />}
      />
    </Screen>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
  list: {
    paddingHorizontal: space.lg,
    paddingBottom: space.xxl,
  },
  intro: {
    color: colors.body,
    fontFamily: font.sans,
    fontSize: 13,
    lineHeight: 19,
    paddingTop: space.lg,
    marginBottom: space.lg,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    marginBottom: space.md,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.badgeGoldBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureBody: {
    flex: 1,
    gap: space.xs,
  },
  featureTitle: {
    color: colors.text,
    fontFamily: font.displayBold,
    fontSize: 16,
  },
  featureText: {
    color: colors.body,
    fontFamily: font.sans,
    fontSize: 12,
    lineHeight: 17,
  },
  chipsWrap: {
    marginBottom: space.md,
  },
  achievementCard: {
    gap: space.xs + 2,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.highest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementTitle: {
    color: colors.text,
    fontFamily: font.displayBold,
    fontSize: 15,
  },
  achievementDescription: {
    color: colors.body,
    fontFamily: font.sans,
    fontSize: 12,
    lineHeight: 17,
  },
  achievementMeta: {
    color: colors.muted,
    fontFamily: font.mono,
    fontSize: 10,
  },
});
