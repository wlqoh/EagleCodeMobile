import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';
import { Colors, font, space } from '@/theme/tokens';
import { useThemedStyles } from '@/theme/useThemedStyles';

type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = 'Загрузка…' }: LoadingStateProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.root}>
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: space.sm,
      paddingVertical: space.xxl,
    },
    label: {
      color: colors.muted,
      fontFamily: font.sans,
      fontSize: 13,
    },
  });
