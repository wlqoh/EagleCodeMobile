import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, font, space } from '@/theme/tokens';

type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = 'Загрузка…' }: LoadingStateProps) {
  return (
    <View style={styles.root}>
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
