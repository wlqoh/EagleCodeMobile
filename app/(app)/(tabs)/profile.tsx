import { Link } from 'expo-router';
import { Activity, Award, Bell, Medal, SquarePen, Trophy } from 'lucide-react-native';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EagleProgress } from '@/components/features/EagleProgress';
import { LineChart } from '@/components/features/LineChart';
import { MetricCard } from '@/components/features/MetricCard';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { placeholders } from '@/core/placeholders';
import { useAthlete, useLevels, useNotifications, useResults } from '@/hooks/useData';
import { colors, font, space } from '@/theme/tokens';
import { formatMeters } from '@/utils/format';

export default function ProfileScreen() {
  const { user } = useAuth();
  const athlete = useAthlete(user?.athleteId);
  const levels = useLevels();
  const results = useResults();
  const notifications = useNotifications();

  const unreadCount = notifications.data?.filter((item) => !item.readAt).length ?? 0;
  const refreshing = athlete.isFetching || levels.isFetching || results.isFetching;

  const onRefresh = () => {
    athlete.refetch();
    levels.refetch();
    results.refetch();
    notifications.refetch();
  };

  const header = (
    <ScreenHeader
      eyebrow="Кабинет участника"
      title="Профиль"
      description="Прогресс по уровням Орла, метрика сезона и последние результаты."
      actions={
        <>
          <Link href="/notifications" asChild>
            <Pressable accessibilityLabel="Уведомления" style={styles.iconButton}>
              <Bell color={colors.text} size={20} />
              {unreadCount > 0 ? <View style={styles.badgeDot} /> : null}
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
  );

  if (athlete.isError) {
    return (
      <Screen>
        {header}
        <EmptyState
          title="Не удалось загрузить профиль"
          description={athlete.error instanceof Error ? athlete.error.message : undefined}
          actionLabel="Повторить"
          onAction={() => athlete.refetch()}
        />
      </Screen>
    );
  }

  if (!athlete.data || !levels.data || !results.data) {
    return (
      <Screen>
        {header}
        <LoadingState />
      </Screen>
    );
  }

  const profile = athlete.data;
  const ownResults = results.data.filter((result) => result.athleteId === profile.id);
  const { profile: profilePlaceholders } = placeholders;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {header}

        <Card style={styles.banner}>
          <View style={styles.avatarHero}>
            <Text style={styles.avatarHeroText}>{profile.avatarInitials}</Text>
          </View>
          <View style={styles.bannerTitleRow}>
            <Text style={styles.bannerName}>{profile.fullName}</Text>
            <Text style={styles.verifiedLabel}>ПРОФИЛЬ ПОДТВЕРЖДЁН</Text>
          </View>
          <Text style={styles.bannerSubtitle}>
            {profile.sportTitle} · {profile.organization}
          </Text>
          <View style={styles.tagList}>
            {profile.disciplines.map((item) => (
              <Badge key={item}>{item}</Badge>
            ))}
          </View>
          <View style={styles.bannerQuick}>
            <View style={styles.bannerQuickItem}>
              <Text style={styles.quickLabel}>Рейтинг РД</Text>
              <Text style={styles.quickValue}>{profilePlaceholders.rank}</Text>
            </View>
            <View style={styles.bannerQuickItem}>
              <Text style={styles.quickLabel}>Высота</Text>
              <Text style={styles.quickValue}>{formatMeters(profile.meters)}</Text>
            </View>
          </View>
        </Card>

        <EagleProgress meters={profile.meters} levels={levels.data} />

        <View style={styles.metricGrid}>
          <MetricCard
            label="Набрано за сезон"
            value={profilePlaceholders.season.value}
            note={profilePlaceholders.season.note}
            icon={Activity}
            progress={profilePlaceholders.season.progress}
            style={styles.metricItem}
          />
          <MetricCard
            label="Соревнования"
            value={String(ownResults.length + profilePlaceholders.competitionsExtra)}
            note={profilePlaceholders.competitionsNote}
            icon={Trophy}
            progress={profilePlaceholders.competitionsProgress}
            style={styles.metricItem}
          />
          <MetricCard
            label="Достижения"
            value={profilePlaceholders.achievements.value}
            note={profilePlaceholders.achievements.note}
            icon={Award}
            progress={profilePlaceholders.achievements.progress}
            style={styles.metricItem}
          />
        </View>

        <Card style={styles.section}>
          <Text style={styles.eyebrowSmall}>FLIGHT PATH // 2026</Text>
          <Text style={styles.sectionTitle}>Мой рост и набор высоты</Text>
          <LineChart />
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Срезы рейтинга</Text>
          {profilePlaceholders.slices.map(([label, value]) => (
            <View style={styles.statRow} key={label}>
              <Text style={styles.statLabel}>{label}</Text>
              <Text style={styles.statValue}>{value}</Text>
            </View>
          ))}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Последние результаты</Text>
          {ownResults.length ? (
            ownResults.map((result) => (
              <View style={styles.activityRow} key={result.id}>
                <View style={styles.activityIcon}>
                  <Medal color={colors.primary} size={16} />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityPlace}>{result.place} место</Text>
                  <Text style={styles.activityScore}>{result.score}</Text>
                </View>
                <Text style={styles.activityMeters}>+{formatMeters(result.metersAwarded)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.muted}>Опубликованных результатов пока нет.</Text>
          )}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Дисциплины</Text>
          <View style={styles.tagList}>
            {profile.disciplines.map((item) => (
              <Badge key={item} tone="primary">
                {item}
              </Badge>
            ))}
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: space.xxl,
    gap: space.lg,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.highest,
  },
  badgeDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.highest,
  },
  banner: {
    marginHorizontal: space.lg,
    gap: space.sm,
  },
  avatarHero: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.highest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarHeroText: {
    color: colors.primary,
    fontFamily: font.displayBold,
    fontSize: 20,
  },
  bannerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  bannerName: {
    color: colors.text,
    fontFamily: font.displayBold,
    fontSize: 20,
  },
  verifiedLabel: {
    color: colors.primary,
    fontFamily: font.monoSemiBold,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  bannerSubtitle: {
    color: colors.body,
    fontFamily: font.sans,
    fontSize: 13,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  bannerQuick: {
    flexDirection: 'row',
    gap: space.xl,
    marginTop: space.xs,
  },
  bannerQuickItem: {
    gap: 2,
  },
  quickLabel: {
    color: colors.muted,
    fontFamily: font.sans,
    fontSize: 11,
  },
  quickValue: {
    color: colors.text,
    fontFamily: font.sansBold,
    fontSize: 16,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: space.md,
    paddingHorizontal: space.lg,
  },
  metricItem: {
    width: '48%',
  },
  section: {
    marginHorizontal: space.lg,
    gap: space.sm,
  },
  eyebrowSmall: {
    color: colors.primary,
    fontFamily: font.monoSemiBold,
    fontSize: 10,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: font.displayBold,
    fontSize: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: space.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  statLabel: {
    color: colors.body,
    fontFamily: font.sans,
    fontSize: 13,
  },
  statValue: {
    color: colors.text,
    fontFamily: font.sansSemiBold,
    fontSize: 13,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.highest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityPlace: {
    color: colors.text,
    fontFamily: font.sansSemiBold,
    fontSize: 13,
  },
  activityScore: {
    color: colors.muted,
    fontFamily: font.mono,
    fontSize: 11,
  },
  activityMeters: {
    color: colors.primary,
    fontFamily: font.monoSemiBold,
    fontSize: 13,
  },
  muted: {
    color: colors.muted,
    fontFamily: font.sans,
    fontSize: 13,
  },
});
