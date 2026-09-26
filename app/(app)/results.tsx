import { Code, Medal, Trophy } from 'lucide-react-native';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { placeholders } from '@/core/placeholders';
import { useCompetitions, useResults } from '@/hooks/useData';
import { useTheme } from '@/theme/ThemeContext';
import { Colors, font, space } from '@/theme/tokens';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { formatDate, formatMeters } from '@/utils/format';

export default function ResultsScreen() {
  const { user } = useAuth();
  const results = useResults();
  const competitions = useCompetitions();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const header = (
    <>
      <Text style={styles.intro}>Опубликованные протоколы, места и начисленные метры.</Text>
      <View style={styles.summaryRow}>
        <Card style={styles.summaryTile}>
          <Trophy color={colors.primary} size={20} />
          <View>
            <Text style={styles.summaryLabel}>Стартов</Text>
            <Text style={styles.summaryValue}>{placeholders.results.starts}</Text>
          </View>
        </Card>
        <Card style={styles.summaryTile}>
          <Medal color={colors.primary} size={20} />
          <View>
            <Text style={styles.summaryLabel}>Призовых мест</Text>
            <Text style={styles.summaryValue}>{placeholders.results.podiums}</Text>
          </View>
        </Card>
        <Card style={styles.summaryTile}>
          <Code color={colors.primary} size={20} />
          <View>
            <Text style={styles.summaryLabel}>Решено задач</Text>
            <Text style={styles.summaryValue}>{placeholders.results.solved}</Text>
          </View>
        </Card>
      </View>
    </>
  );

  if (results.isError || competitions.isError) {
    return (
      <Screen>
        {header}
        <EmptyState
          title="Не удалось загрузить результаты"
          actionLabel="Повторить"
          onAction={() => {
            results.refetch();
            competitions.refetch();
          }}
        />
      </Screen>
    );
  }

  if (!results.data || !competitions.data) {
    return (
      <Screen>
        {header}
        <LoadingState />
      </Screen>
    );
  }

  const own = results.data.filter((item) => item.athleteId === user?.athleteId);

  return (
    <Screen>
      <FlatList
        data={own}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={results.isFetching}
            onRefresh={() => results.refetch()}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => {
          const competition = competitions.data.find((entry) => entry.id === item.competitionId);
          return (
            <Card style={styles.resultCard}>
              <Text style={styles.place}>#{item.place}</Text>
              <View style={styles.resultInfo}>
                <Text style={styles.competitionTitle} numberOfLines={2}>
                  {competition?.title}
                </Text>
                <Text style={styles.competitionMeta}>
                  {competition?.location} · {formatDate(item.publishedAt)}
                </Text>
              </View>
              <Badge tone="primary">{item.score}</Badge>
              <Text style={styles.metersAwarded}>+{formatMeters(item.metersAwarded)}</Text>
            </Card>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: space.sm }} />}
        ListEmptyComponent={<EmptyState title="Опубликованных результатов пока нет" />}
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
  summaryRow: {
    flexDirection: 'row',
    gap: space.sm,
    marginBottom: space.lg,
  },
  summaryTile: {
    flex: 1,
    gap: space.xs,
  },
  summaryLabel: {
    color: colors.muted,
    fontFamily: font.sans,
    fontSize: 10,
  },
  summaryValue: {
    color: colors.text,
    fontFamily: font.sansBold,
    fontSize: 15,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  place: {
    color: colors.primary,
    fontFamily: font.monoSemiBold,
    fontSize: 16,
    width: 36,
  },
  resultInfo: {
    flex: 1,
    gap: 2,
  },
  competitionTitle: {
    color: colors.text,
    fontFamily: font.sansSemiBold,
    fontSize: 13,
  },
  competitionMeta: {
    color: colors.muted,
    fontFamily: font.sans,
    fontSize: 11,
  },
  metersAwarded: {
    color: colors.primary,
    fontFamily: font.monoSemiBold,
    fontSize: 13,
  },
});
