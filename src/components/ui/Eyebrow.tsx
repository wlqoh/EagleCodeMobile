import { PropsWithChildren } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

import { useThemedStyles } from '@/theme/useThemedStyles';
import { Colors, font } from '@/theme/tokens';

type EyebrowProps = PropsWithChildren<{ style?: TextStyle }>;

export function Eyebrow({ children, style }: EyebrowProps) {
  const styles = useThemedStyles(createStyles);
  return <Text style={[styles.text, style]}>{children}</Text>;
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    text: {
      color: colors.primary,
      fontFamily: font.monoSemiBold,
      fontSize: 11,
      lineHeight: 15,
      letterSpacing: 1.05,
      textTransform: 'uppercase',
    },
  });
