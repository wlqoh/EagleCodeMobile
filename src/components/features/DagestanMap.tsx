import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import type { Athlete, City } from '@/core/types';
import { useTheme } from '@/theme/ThemeContext';
import { Colors, font, radius } from '@/theme/tokens';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { formatMeters } from '@/utils/format';

const positions: [number, number][] = [
  [55, 48],
  [69, 76],
  [27, 37],
  [58, 57],
  [39, 48],
];

type DagestanMapProps = {
  cities: City[];
  athletes: Athlete[];
  activeCityId: string;
  onSelect: (id: string) => void;
};

export function DagestanMap({ cities, athletes, activeCityId, onSelect }: DagestanMapProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View
      style={styles.root}
      accessibilityRole="image"
      accessibilityLabel="Схематичная карта спортивной активности Дагестана"
    >
      <Svg viewBox="0 0 500 420" style={StyleSheet.absoluteFill}>
        <Path
          d="M310 20 395 58l18 72 52 64-31 63 17 81-83 58-74-31-71 33-76-44-18-73-52-47 33-70 7-87 88-17z"
          fill={colors.raised}
          stroke={colors.border}
          strokeWidth={1.5}
        />
        <Path
          d="M126 120 395 315M102 235l338-73M201 59l94 306"
          stroke={colors.border}
          strokeWidth={1}
          opacity={0.5}
        />
      </Svg>
      {cities.map((city, index) => {
        const meters = athletes
          .filter((item) => item.cityId === city.id)
          .reduce((sum, item) => sum + item.meters, 0);
        const active = city.id === activeCityId;
        const [left, top] = positions[index] ?? [50, 50];

        return (
          <Pressable
            key={city.id}
            onPress={() => onSelect(city.id)}
            style={[styles.node, { left: `${left}%`, top: `${top}%` }]}
          >
            <View style={[styles.dot, active && styles.dotActive]} />
            <View style={styles.label}>
              <Text style={[styles.labelName, active && styles.labelNameActive]}>{city.name}</Text>
              <Text style={styles.labelMeters}>{formatMeters(meters)}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    root: {
      width: '100%',
      aspectRatio: 500 / 420,
      backgroundColor: colors.panel,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: radius.lg,
      overflow: 'hidden',
    },
    node: {
      position: 'absolute',
      alignItems: 'center',
      transform: [{ translateX: -6 }, { translateY: -6 }],
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.muted,
      borderWidth: 2,
      borderColor: colors.bg,
    },
    dotActive: {
      backgroundColor: colors.primary,
    },
    label: {
      marginTop: 4,
      alignItems: 'center',
      width: 88,
    },
    labelName: {
      color: colors.text,
      fontFamily: font.sansSemiBold,
      fontSize: 11,
      textAlign: 'center',
    },
    labelNameActive: {
      color: colors.primary,
    },
    labelMeters: {
      color: colors.muted,
      fontFamily: font.mono,
      fontSize: 10,
    },
  });
