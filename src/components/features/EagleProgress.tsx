import { Image, StyleSheet, Text, View } from 'react-native';

import { getEagleImage } from '@/components/features/eagleImages';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { getEagleProgress } from '@/core/eagleLevels';
import type { EagleLevel } from '@/core/types';
import { Colors, font, radius, space } from '@/theme/tokens';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { formatMeters } from '@/utils/format';

type EagleProgressProps = {
  meters: number;
  levels: EagleLevel[];
  detailed?: boolean;
};

export function EagleProgress({ meters, levels, detailed = true }: EagleProgressProps) {
  const styles = useThemedStyles(createStyles);
  const { level, next, progress, remaining } = getEagleProgress(meters, levels);

  return (
    <Card style={styles.card}>
      <View style={styles.emblemRow}>
        <Image
          source={getEagleImage(level.order)}
          accessibilityRole="image"
          accessibilityLabel={`Орёл ${level.id} — ${level.name}`}
          style={styles.emblem}
        />
        <Text style={styles.emblemLabel}>ОРЁЛ</Text>
      </View>
      <Text style={styles.eyebrow}>Текущий ранг высоты</Text>
      <View style={styles.titleRow}>
        <Text style={styles.title}>
          Орёл {level.id} — {level.name}
        </Text>
        <Badge tone="gold">{progress}%</Badge>
      </View>
      <Progress value={progress} />
      <View style={styles.scaleRow}>
        <Text style={styles.scaleEdge}>{formatMeters(level.minMeters)}</Text>
        <Text style={styles.scaleCurrent}>{formatMeters(meters)}</Text>
        <Text style={styles.scaleEdge}>{next ? formatMeters(next.minMeters) : 'Вершина'}</Text>
      </View>
      {next ? (
        <Text style={styles.muted}>
          До уровня «Орёл {next.id}» осталось {formatMeters(remaining)}
        </Text>
      ) : null}
      {detailed ? (
        <View style={styles.grid}>
          {levels.map((item) => {
            const passed = item.order < level.order;
            const current = item.id === level.id;
            return (
              <View
                key={item.id}
                style={[styles.miniItem, passed && styles.miniPassed, current && styles.miniCurrent]}
              >
                <Image
                  source={getEagleImage(item.order, item.order > level.order)}
                  accessibilityRole="image"
                  accessibilityLabel={`Орёл ${item.id} — ${item.name}`}
                  style={styles.miniIcon}
                />
                <Text style={[styles.miniId, current && styles.miniTextCurrent]}>{item.id}</Text>
                <Text style={[styles.miniMeters, current && styles.miniTextCurrent]} numberOfLines={1}>
                  {formatMeters(item.minMeters)}
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}
    </Card>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
  card: {
    gap: space.sm,
  },
  emblemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  emblem: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.highest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemLabel: {
    color: colors.muted,
    fontFamily: font.monoSemiBold,
    fontSize: 11,
    letterSpacing: 1,
  },
  eyebrow: {
    color: colors.primary,
    fontFamily: font.monoSemiBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  title: {
    flex: 1,
    color: colors.text,
    fontFamily: font.displayBold,
    fontSize: 18,
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleEdge: {
    color: colors.muted,
    fontFamily: font.mono,
    fontSize: 11,
  },
  scaleCurrent: {
    color: colors.text,
    fontFamily: font.monoSemiBold,
    fontSize: 12,
  },
  muted: {
    color: colors.muted,
    fontFamily: font.sans,
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs + 2,
    marginTop: space.xs,
  },
  miniItem: {
    width: '18%',
    minWidth: 56,
    alignItems: 'center',
    gap: 2,
    paddingVertical: space.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.raised,
  },
  miniPassed: {
    borderColor: colors.badgePrimaryBorder,
  },
  miniIcon: {
    width: 18,
    height: 18,
  },
  miniCurrent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  miniId: {
    color: colors.text,
    fontFamily: font.sansSemiBold,
    fontSize: 12,
  },
  miniMeters: {
    color: colors.muted,
    fontFamily: font.mono,
    fontSize: 9,
  },
  miniTextCurrent: {
    color: colors.onPrimary,
  },
});
