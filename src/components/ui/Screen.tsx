import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors } from '@/theme/tokens';

type ScreenProps = PropsWithChildren<{ style?: StyleProp<ViewStyle> }>;

export function Screen({ children, style }: ScreenProps) {
  return <View style={[styles.root, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
