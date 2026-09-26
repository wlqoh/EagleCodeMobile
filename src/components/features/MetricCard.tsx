import { ArrowUpRight } from 'lucide-react-native';
import type { ComponentType } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import type { LucideProps } from 'lucide-react-native';

import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { colors, font, space } from '@/theme/tokens';

type MetricCardProps = {
  label: string;
  value: string;
  note: string;
  icon: ComponentType<LucideProps>;
  progress?: number;
  style?: StyleProp<ViewStyle>;
};

export function MetricCard({ label, value, note, icon: Icon, progress, style }: MetricCardProps) {
  return (
    <Card style={[styles.card, style]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <Icon color={colors.muted} size={18} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.noteRow}>
        <ArrowUpRight color={colors.primary} size={13} />
        <Text style={styles.note}>{note}</Text>
      </View>
      {progress !== undefined ? <Progress value={progress} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: space.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: colors.muted,
    fontFamily: font.sansMedium,
    fontSize: 12,
  },
  value: {
    color: colors.text,
    fontFamily: font.displayBold,
    fontSize: 24,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  note: {
    color: colors.primary,
    fontFamily: font.sansMedium,
    fontSize: 11,
  },
});
