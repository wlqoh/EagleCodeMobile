import { Link } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { DagestanMap } from '@/components/features/DagestanMap';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { useAthletes, useCities } from '@/hooks/useData';
import { useTheme } from '@/theme/ThemeContext';
import { Colors, font, space } from '@/theme/tokens';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { formatMeters } from '@/utils/format';

export default function MapScreen() {
  const athletes = useAthletes();
  const cities = useCities();
  const [active, setActive] = useState('c1');
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const summary = useMemo(() => {
    const city = cities.data?.find((item) => item.id === active);
    const members = athletes.data?.filter((item) => item.cityId === active) ?? [];
    return {
      city,
      members,
      meters: members.reduce((sum, item) => sum + item.meters, 0),
    };
  }, [active, athletes.data, cities.data]);

  const header = (
    <ScreenHeader
      eyebrow="42 района"
      title="Карта"
      description="Схематичная карта Дагестана с активностью по городам."
    />
  );

  if (athletes.isError || cities.isError) {
    return (
      <Screen>
        {header}
        <EmptyState
          title="Не удалось загрузить карту"
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
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={athletes.isFetching || cities.isFetching}
            onRefresh={() => {
              athletes.refetch();
              cities.refetch();
            }}
            tintColor={colors.primary}
          />
        }
      >
        {header}
        <View style={styles.mapWrap}>
          <DagestanMap
            cities={cities.data}
            athletes={athletes.data}
            activeCityId={active}
            onSelect={setActive}
          />
        </View>
        <Card style={styles.inspector}>
          <MapPin color={colors.primary} size={18} />
          <Text style={styles.eyebrow}>АКТИВНЫЙ УЗЕЛ</Text>
          <Text style={styles.cityName}>{summary.city?.name}</Text>
          <Text style={styles.cityDistrict}>{summary.city?.district}</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Участников</Text>
            <Text style={styles.statValue}>{summary.members.length}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Общая высота</Text>
            <Text style={styles.statValue}>{formatMeters(summary.meters)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Ключевые дисциплины</Text>
            <Text style={styles.statValue}>
              {summary.members.flatMap((item) => item.disciplines).slice(0, 2).join(', ') || '—'}
            </Text>
          </View>
        </Card>
        <Link href="/cities" style={styles.link}>
          Рейтинг городов →
        </Link>
      </ScrollView>
    </Screen>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
  content: {
    paddingBottom: space.xxl,
    gap: space.lg,
  },
  mapWrap: {
    paddingHorizontal: space.lg,
  },
  inspector: {
    marginHorizontal: space.lg,
    gap: space.xs + 2,
  },
  eyebrow: {
    color: colors.primary,
    fontFamily: font.monoSemiBold,
    fontSize: 10,
    letterSpacing: 0.6,
  },
  cityName: {
    color: colors.text,
    fontFamily: font.displayBold,
    fontSize: 18,
  },
  cityDistrict: {
    color: colors.muted,
    fontFamily: font.sans,
    fontSize: 12,
    marginBottom: space.xs,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: space.xs + 2,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
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
  link: {
    alignSelf: 'center',
    color: colors.primary,
    fontFamily: font.sansSemiBold,
    fontSize: 13,
  },
});
