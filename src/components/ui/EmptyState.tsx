import { StyleSheet, Text, View } from 'react-native';

import { useThemedStyles } from '@/theme/useThemedStyles';
import { Colors, font, space } from '@/theme/tokens';

import { Button } from './Button';

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel && onAction ? (
        <Button variant="secondary" onPress={onAction} style={styles.action}>
          {actionLabel}
        </Button>
      ) : null}
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
      paddingHorizontal: space.xl,
    },
    title: {
      color: colors.text,
      fontFamily: font.sansSemiBold,
      fontSize: 15,
      textAlign: 'center',
    },
    description: {
      color: colors.muted,
      fontFamily: font.sans,
      fontSize: 13,
      textAlign: 'center',
    },
    action: {
      marginTop: space.sm,
    },
  });
