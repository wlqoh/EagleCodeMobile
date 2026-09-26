import { Link } from 'expo-router';
import { Medal } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EagleAvatar } from '@/components/features/EagleAvatar';
import { Badge } from '@/components/ui/Badge';
import { getEagleProgress } from '@/core/eagleLevels';
import type { Athlete, City } from '@/core/types';
import { useTheme } from '@/theme/ThemeContext';
import { ColorScheme, Colors, font, radius, space } from '@/theme/tokens';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { formatMeters } from '@/utils/format';

type RankingRowProps = {
  athlete: Athlete;
  city?: City;
  rank: number;
  highlighted?: boolean;
};

function rankColor(rank: number, colors: Colors, scheme: ColorScheme) {
  if (rank === 1) return colors.gold;
  if (rank === 2) return scheme === 'dark' ? '#c7d0c9' : '#8b959f';
  if (rank === 3) return scheme === 'dark' ? '#c98a56' : '#a3672f';
  return colors.muted;
}

export function RankingRow({ athlete, city, rank, highlighted = false }: RankingRowProps) {
  const { colors, scheme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { level } = getEagleProgress(athlete.meters);

  return (
    <Link href={{ pathname: '/athlete/[id]', params: { id: athlete.id } }} asChild>
      <Pressable style={StyleSheet.flatten([styles.row, highlighted && styles.highlighted])}>
        <View style={styles.rankBox}>
          {rank <= 3 ? <Medal color={rankColor(rank, colors, scheme)} size={13} /> : null}
          <Text style={[styles.rankText, rank <= 3 && { color: rankColor(rank, colors, scheme) }]}>
            #{String(rank).padStart(2, '0')}
          </Text>
        </View>
        <EagleAvatar meters={athlete.meters} size={32} />
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

const createStyles = (colors: Colors) =>
  StyleSheet.create({
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
