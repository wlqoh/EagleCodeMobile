import { PropsWithChildren, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';
import { Colors, font, radius } from '@/theme/tokens';
import { useThemedStyles } from '@/theme/useThemedStyles';
import type { BadgeTone } from '@/theme/badgeTones';

export type { BadgeTone };

type BadgeProps = PropsWithChildren<{ tone?: BadgeTone }>;

export function Badge({ children, tone = 'default' }: BadgeProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const toneConfig = useMemo(() => createToneConfig(colors), [colors]);
  const config = toneConfig[tone];
  return (
    <View style={[styles.badge, config.badge]}>
      <Text style={[styles.text, config.text]}>{children}</Text>
    </View>
  );
}

const createStyles = (_colors: Colors) =>
  StyleSheet.create({
    badge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: radius.sm - 1,
      borderWidth: 1,
    },
    text: {
      fontFamily: font.monoSemiBold,
      fontSize: 10,
      lineHeight: 13,
      letterSpacing: 0.35,
      textTransform: 'uppercase',
    },
  });

function createToneConfig(colors: Colors): Record<BadgeTone, { badge: object; text: object }> {
  return {
    default: {
      badge: { backgroundColor: colors.highest, borderColor: colors.badgeBorder },
      text: { color: colors.badgeText },
    },
    primary: {
      badge: { backgroundColor: colors.badgePrimaryBg, borderColor: colors.badgePrimaryBorder },
      text: { color: colors.primarySoft },
    },
    gold: {
      badge: { backgroundColor: colors.badgeGoldBg, borderColor: colors.badgeGoldBorder },
      text: { color: colors.badgeGoldText },
    },
    danger: {
      badge: { backgroundColor: colors.badgeDangerBg, borderColor: colors.badgeDangerBorder },
      text: { color: colors.badgeDangerText },
    },
    bronze: {
      badge: { backgroundColor: colors.badgeBronzeBg, borderColor: colors.badgeBronzeBorder },
      text: { color: colors.badgeBronzeText },
    },
    silver: {
      badge: { backgroundColor: colors.badgeSilverBg, borderColor: colors.badgeSilverBorder },
      text: { color: colors.badgeSilverText },
    },
    elite: {
      badge: { backgroundColor: colors.badgeEliteBg, borderColor: colors.badgeEliteBorder },
      text: { color: colors.badgeEliteText },
    },
  };
}
