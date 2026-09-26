import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useThemedStyles } from '@/theme/useThemedStyles';
import { Colors } from '@/theme/tokens';

type ScreenProps = PropsWithChildren<{ style?: StyleProp<ViewStyle> }>;

export function Screen({ children, style }: ScreenProps) {
  const styles = useThemedStyles(createStyles);
  return <View style={[styles.root, style]}>{children}</View>;
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.bg,
    },
  });
