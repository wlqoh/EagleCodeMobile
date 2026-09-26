import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radius, space } from '@/theme/tokens';

type CardProps = PropsWithChildren<{ style?: StyleProp<ViewStyle> }>;

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    minWidth: 0,
    padding: space.xl,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 35,
    elevation: 4,
  },
});
