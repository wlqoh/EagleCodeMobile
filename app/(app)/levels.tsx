import { useQuery } from '@tanstack/react-query';
import { Bird, Lock } from 'lucide-react-native';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { getEagleProgress } from '@/core/eagleLevels';
import { useLevels } from '@/hooks/useData';
import { dataClient } from '@/services/client';
import { useTheme } from '@/theme/ThemeContext';
import { Colors, font, radius, space } from '@/theme/tokens';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { formatMeters } from '@/utils/format';

export default function LevelsScreen() {
  const { user } = useAuth();
  const levels = useLevels();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const athlete = useQuery({
    queryKey: ['athlete', user?.athleteId],
    queryFn: () => dataClient.getAthlete(user!.athleteId!),
    enabled: Boolean(user?.athleteId),
  });

  const header = (
    <Text style={styles.intro}>
      Десять ступеней спортивного развития — от первого результата до вершины Дагестана.
    </Text>
  );

  if (levels.isError || athlete.isError) {
    return (
      <Screen>
        {header}
        <EmptyState
          title="Не удалось загрузить уровни"
          actionLabel="Повторить"
          onAction={() => {
            levels.refetch();
            athlete.refetch();
          }}
        />
      </Screen>
    );
  }

  if (!levels.data || !athlete.data) {
    return (
      <Screen>
        {header}
        <LoadingState />
      </Screen>
    );
  }

  const current = getEagleProgress(athlete.data.meters, levels.data).level;

  return (
    <Screen>
      <FlatList
        data={levels.data}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: space.sm }} />}
        refreshControl={
          <RefreshControl
            refreshing={athlete.isFetching}
            onRefresh={() => athlete.refetch()}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => {
          const isCurrent = item.id === current.id;
          const isPassed = item.order < current.order;
          return (
            <Card style={[styles.card, isCurrent && styles.cardCurrent]}>
              <View style={styles.symbol}>
                <Bird color={isCurrent ? colors.onPrimary : colors.primary} size={20} />
              </View>
              <View style={styles.info}>
                <Text style={[styles.eyebrow, isCurrent && styles.textOnPrimary]}>
                  ОРЁЛ {item.id}
                </Text>
                <Text style={[styles.name, isCurrent && styles.textOnPrimary]}>{item.name}</Text>
                <Text style={[styles.range, isCurrent && styles.textOnPrimary]}>
                  {formatMeters(item.minMeters)} — {item.maxMeters ? formatMeters(item.maxMeters) : '∞'}
                </Text>
              </View>
              {isPassed ? (
                <Badge tone="primary">Пройдено</Badge>
              ) : isCurrent ? (
                <Badge tone="gold">Текущий</Badge>
              ) : (
                <Lock color={colors.muted} size={18} />
              )}
            </Card>
          );
        }}
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
    marginBottom: space.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  cardCurrent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  symbol: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.highest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 1,
  },
  eyebrow: {
    color: colors.primary,
    fontFamily: font.monoSemiBold,
    fontSize: 10,
    letterSpacing: 0.6,
  },
  name: {
    color: colors.text,
    fontFamily: font.displayBold,
    fontSize: 15,
  },
  range: {
    color: colors.muted,
    fontFamily: font.mono,
    fontSize: 11,
  },
  textOnPrimary: {
    color: colors.onPrimary,
  },
});
