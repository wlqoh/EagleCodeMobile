import { BarChart3, UsersRound } from 'lucide-react-native';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { useAthletes, useCities } from '@/hooks/useData';
import { useTheme } from '@/theme/ThemeContext';
import { Colors, font, space } from '@/theme/tokens';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { formatMeters } from '@/utils/format';

export default function CitiesScreen() {
  const athletes = useAthletes();
  const cities = useCities();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  if (athletes.isError || cities.isError) {
    return (
      <Screen>
        <EmptyState
          title="Не удалось загрузить рейтинг городов"
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
        <LoadingState />
      </Screen>
    );
  }

  const ranked = cities.data
    .map((city) => ({
      ...city,
      members: athletes.data.filter((item) => item.cityId === city.id),
    }))
    .sort(
      (a, b) =>
        b.members.reduce((sum, item) => sum + item.meters, 0) -
        a.members.reduce((sum, item) => sum + item.meters, 0),
    );

  return (
    <Screen>
      <FlatList
        data={ranked}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: space.md }} />}
        refreshControl={
          <RefreshControl
            refreshing={athletes.isFetching}
            onRefresh={() => athletes.refetch()}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item, index }) => {
          const meters = item.members.reduce((sum, member) => sum + member.meters, 0);
          const average = Math.round(meters / Math.max(1, item.members.length));
          return (
            <Card style={styles.card}>
              <View style={styles.headerRow}>
                <Text style={styles.rank}>#{String(index + 1).padStart(2, '0')}</Text>
                <View style={styles.headerText}>
                  <Text style={styles.cityName}>{item.name}</Text>
                  <Text style={styles.cityDistrict}>{item.district}</Text>
                </View>
              </View>
              <Text style={styles.meters}>{formatMeters(meters)}</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <UsersRound color={colors.muted} size={14} />
                  <Text style={styles.statText}>{item.members.length} участников</Text>
                </View>
                <View style={styles.statItem}>
                  <BarChart3 color={colors.muted} size={14} />
                  <Text style={styles.statText}>{formatMeters(average)} в среднем</Text>
                </View>
              </View>
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
    padding: space.lg,
    paddingBottom: space.xxl,
  },
  card: {
    gap: space.xs + 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  rank: {
    color: colors.primary,
    fontFamily: font.monoSemiBold,
    fontSize: 14,
  },
  headerText: {
    flex: 1,
  },
  cityName: {
    color: colors.text,
    fontFamily: font.displayBold,
    fontSize: 17,
  },
  cityDistrict: {
    color: colors.muted,
    fontFamily: font.sans,
    fontSize: 12,
  },
  meters: {
    color: colors.text,
    fontFamily: font.monoSemiBold,
    fontSize: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: space.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  statText: {
    color: colors.body,
    fontFamily: font.sans,
    fontSize: 12,
  },
});
