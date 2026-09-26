import { useMemo, useState } from 'react';
import { BarChart3, MapPin, Trophy, UsersRound } from 'lucide-react-native';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { LineChart } from '@/components/features/LineChart';
import { MetricCard } from '@/components/features/MetricCard';
import { RankingRow } from '@/components/features/RankingRow';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { Chips } from '@/components/ui/Chips';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { DISCIPLINES } from '@/core/disciplines';
import { placeholders } from '@/core/placeholders';
import type { Athlete } from '@/core/types';
import { useAthletes, useCities } from '@/hooks/useData';
import { useTheme } from '@/theme/ThemeContext';
import { Colors, space } from '@/theme/tokens';
import { useThemedStyles } from '@/theme/useThemedStyles';

const metricIcons = [UsersRound, MapPin, Trophy, BarChart3];

export default function RatingScreen() {
  const { user } = useAuth();
  const athletes = useAthletes();
  const cities = useCities();
  const [query, setQuery] = useState('');
  const [discipline, setDiscipline] = useState('Все');
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const disciplineOptions = useMemo(
    () => [{ key: 'Все', label: 'Все' }, ...DISCIPLINES.map((item) => ({ key: item.name, label: item.short }))],
    [],
  );

  const filtered = useMemo(() => {
    const ranked = [...(athletes.data ?? [])].sort((a, b) => b.meters - a.meters);
    return ranked
      .map((athlete, index) => ({ athlete, rank: index + 1 }))
      .filter(
        ({ athlete }) =>
          (discipline === 'Все' || athlete.disciplines.includes(discipline)) &&
          `${athlete.fullName} ${athlete.organization}`.toLowerCase().includes(query.toLowerCase()),
      );
  }, [athletes.data, discipline, query]);

  const header = (
    <>
      <ScreenHeader
        eyebrow="Республика Дагестан"
        title="Рейтинг"
        description="Общий зачёт участников и срез по дисциплинам."
      />
      <View style={styles.metricGrid}>
        {placeholders.rating.map((metric, index) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            note={metric.note}
            icon={metricIcons[index] ?? BarChart3}
            progress={metric.progress}
            style={styles.metricItem}
          />
        ))}
      </View>
      <Card style={styles.chartCard}>
        <LineChart />
      </Card>
      <View style={styles.filters}>
        <Input
          placeholder="Имя или организация…"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
        <Chips options={disciplineOptions} value={discipline} onChange={setDiscipline} />
      </View>
    </>
  );

  if (athletes.isError || cities.isError) {
    return (
      <Screen>
        {header}
        <EmptyState
          title="Не удалось загрузить рейтинг"
          actionLabel="Повторить"
          onAction={() => {
            athletes.refetch();
            cities.refetch();
          }}
        />
      </Screen>
    );
  }

  if (!athletes.data || !cities.data) {
    return (
      <Screen>
        {header}
        <LoadingState />
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={filtered}
        keyExtractor={({ athlete }) => athlete.id}
        ListHeaderComponent={header}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={athletes.isFetching}
            onRefresh={() => athletes.refetch()}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }: { item: { athlete: Athlete; rank: number } }) => (
          <RankingRow
            athlete={item.athlete}
            rank={item.rank}
            city={cities.data.find((city) => city.id === item.athlete.cityId)}
            highlighted={item.athlete.id === user?.athleteId}
          />
        )}
        ListEmptyComponent={<EmptyState title="Участники не найдены" />}
      />
    </Screen>
  );
}

const createStyles = (_colors: Colors) =>
  StyleSheet.create({
    list: {
      paddingBottom: space.xxl,
    },
    metricGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      rowGap: space.md,
      paddingHorizontal: space.lg,
      marginBottom: space.lg,
    },
    metricItem: {
      width: '48%',
    },
    chartCard: {
      marginHorizontal: space.lg,
      marginBottom: space.lg,
    },
    filters: {
      paddingHorizontal: space.lg,
      gap: space.sm,
      marginBottom: space.sm,
    },
  });
