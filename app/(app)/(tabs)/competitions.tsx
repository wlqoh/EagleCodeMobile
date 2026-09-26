import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { CompetitionCard } from '@/components/features/CompetitionCard';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Chips } from '@/components/ui/Chips';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { DISCIPLINES } from '@/core/disciplines';
import type { CompetitionStatus } from '@/core/types';
import { useCompetitions } from '@/hooks/useData';
import { useTheme } from '@/theme/ThemeContext';
import { Colors, space } from '@/theme/tokens';
import { useThemedStyles } from '@/theme/useThemedStyles';

const statusOptions: { key: 'all' | CompetitionStatus; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'registration', label: 'Регистрация' },
  { key: 'upcoming', label: 'Скоро' },
  { key: 'finished', label: 'Завершённые' },
];

const disciplineOptions = [
  { key: 'all', label: 'Все дисциплины' },
  ...DISCIPLINES.map((item) => ({ key: item.name, label: item.short })),
];

export default function CompetitionsScreen() {
  const competitions = useCompetitions();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | CompetitionStatus>('all');
  const [discipline, setDiscipline] = useState('all');
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const filtered = useMemo(
    () =>
      competitions.data?.filter(
        (item) =>
          (status === 'all' || item.status === status) &&
          (discipline === 'all' || item.discipline === discipline) &&
          `${item.title} ${item.discipline}`.toLowerCase().includes(query.toLowerCase()),
      ) ?? [],
    [competitions.data, query, status, discipline],
  );

  const header = (
    <>
      <ScreenHeader
        eyebrow="Календарь"
        title="Соревнования"
        description="Открытая регистрация, ближайшие старты и завершённые события."
      />
      <View style={styles.filters}>
        <Input
          placeholder="Название, дисциплина или город…"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
        <Chips options={statusOptions.map((item) => ({ key: item.key, label: item.label }))} value={status} onChange={(key) => setStatus(key as 'all' | CompetitionStatus)} />
        <Chips options={disciplineOptions} value={discipline} onChange={setDiscipline} />
      </View>
    </>
  );

  if (competitions.isError) {
    return (
      <Screen>
        {header}
        <EmptyState
          title="Не удалось загрузить соревнования"
          actionLabel="Повторить"
          onAction={() => competitions.refetch()}
        />
      </Screen>
    );
  }

  if (!competitions.data) {
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
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: space.md }} />}
        refreshControl={
          <RefreshControl
            refreshing={competitions.isFetching}
            onRefresh={() => competitions.refetch()}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <CompetitionCard competition={item} />
          </View>
        )}
        ListEmptyComponent={<EmptyState title="Соревнования не найдены" />}
      />
    </Screen>
  );
}

const createStyles = (_colors: Colors) =>
  StyleSheet.create({
    list: {
      paddingBottom: space.xxl,
    },
    filters: {
      paddingHorizontal: space.lg,
      gap: space.sm,
      marginBottom: space.md,
    },
    cardWrap: {
      paddingHorizontal: space.lg,
    },
  });
