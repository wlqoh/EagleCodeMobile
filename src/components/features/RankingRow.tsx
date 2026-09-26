import { Link } from 'expo-router';
import { Medal } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { getEagleProgress } from '@/core/eagleLevels';
import type { Athlete, City } from '@/core/types';
import { colors, font, radius, space } from '@/theme/tokens';
import { formatMeters } from '@/utils/format';

type RankingRowProps = {
  athlete: Athlete;
  city?: City;
  rank: number;
  highlighted?: boolean;
};

function rankColor(rank: number) {
  if (rank === 1) return colors.gold;
  if (rank === 2) return '#c7d0c9';
  if (rank === 3) return '#c98a56';
  return colors.muted;
}

export function RankingRow({ athlete, city, rank, highlighted = false }: RankingRowProps) {
  const { level } = getEagleProgress(athlete.meters);

  return (
    <Link href={{ pathname: '/athlete/[id]', params: { id: athlete.id } }} asChild>
      <Pressable style={StyleSheet.flatten([styles.row, highlighted && styles.highlighted])}>
        <View style={styles.rankBox}>
          {rank <= 3 ? <Medal color={rankColor(rank)} size={13} /> : null}
          <Text style={[styles.rankText, rank <= 3 && { color: rankColor(rank) }]}>
            #{String(rank).padStart(2, '0')}
          </Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{athlete.avatarInitials}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {athlete.fullName}
          </Text>
          <Text style={styles.city} numberOfLines={1}>
            {city?.name ?? ''}
          </Text>
        </View>
        <View style={styles.right}>
          <Badge tone="gold">Орёл {level.id}</Badge>
          <Text style={styles.meters}>{formatMeters(athlete.meters)}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.sm + 2,
    paddingHorizontal: space.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  highlighted: {
    backgroundColor: colors.raised,
    borderRadius: radius.md,
  },
  rankBox: {
    width: 40,
    alignItems: 'center',
    gap: 1,
  },
  rankText: {
    color: colors.muted,
    fontFamily: font.monoSemiBold,
    fontSize: 11,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.highest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.text,
    fontFamily: font.sansSemiBold,
    fontSize: 11,
  },
  info: {
    flex: 1,
    gap: 1,
  },
  name: {
    color: colors.text,
    fontFamily: font.sansSemiBold,
    fontSize: 13,
  },
  city: {
    color: colors.muted,
    fontFamily: font.sans,
    fontSize: 11,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  meters: {
    color: colors.text,
    fontFamily: font.monoSemiBold,
    fontSize: 12,
  },
});
