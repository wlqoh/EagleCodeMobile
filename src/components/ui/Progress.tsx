import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/theme/tokens';

type ProgressProps = {
  /** 0–100 */
  value: number;
};

export function Progress({ value }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <View
      style={styles.track}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
    >
      <View style={[styles.fill, { width: `${clamped}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    height: 7,
    overflow: 'hidden',
    backgroundColor: colors.progressTrack,
    borderWidth: 1,
    borderColor: colors.progressBorder,
    borderRadius: radius.pill,
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
});
