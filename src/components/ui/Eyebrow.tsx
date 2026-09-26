import { PropsWithChildren } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

import { colors, font } from '@/theme/tokens';

type EyebrowProps = PropsWithChildren<{ style?: TextStyle }>;

export function Eyebrow({ children, style }: EyebrowProps) {
  return <Text style={[styles.text, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: colors.primary,
    fontFamily: font.monoSemiBold,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 1.05,
    textTransform: 'uppercase',
  },
});
