import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';

import { placeholders } from '@/core/placeholders';
import { useTheme } from '@/theme/ThemeContext';
import { Colors, font } from '@/theme/tokens';
import { useThemedStyles } from '@/theme/useThemedStyles';

export function LineChart() {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View
      style={styles.root}
      accessibilityRole="image"
      accessibilityLabel="Динамика набора метров"
    >
      <Svg viewBox="0 0 760 240" width="100%" height={160}>
        <Defs>
          <LinearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.primary} stopOpacity={0.34} />
            <Stop offset="1" stopColor={colors.primary} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        {[40, 90, 140, 190].map((y) => (
          <Line key={y} x1={0} y1={y} x2={760} y2={y} stroke={colors.border} strokeWidth={1} />
        ))}
        <Path
          d="M0 205 C100 190 145 178 220 172 S330 132 400 126 S520 114 585 78 S690 58 760 25 L760 240 L0 240Z"
          fill="url(#chart-fill)"
        />
        <Path
          d="M0 205 C100 190 145 178 220 172 S330 132 400 126 S520 114 585 78 S690 58 760 25"
          fill="none"
          stroke={colors.primary}
          strokeWidth={2.5}
        />
        <Circle cx={585} cy={78} r={5} fill={colors.primary} />
      </Svg>
      <View style={styles.captionRow}>
        {placeholders.chart.months.map((month) => (
          <Text key={month} style={styles.caption}>
            {month}
          </Text>
        ))}
      </View>
    </View>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    root: {
      width: '100%',
    },
    captionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    caption: {
      color: colors.muted,
      fontFamily: font.mono,
      fontSize: 10,
    },
  });
