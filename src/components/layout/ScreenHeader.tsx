import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Eyebrow } from '@/components/ui/Eyebrow';
import { colors, font, space } from '@/theme/tokens';

type ScreenHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function ScreenHeader({ eyebrow, title, description, actions }: ScreenHeaderProps) {
  return (
    <View style={styles.root}>
      <View style={styles.text}>
        <Eyebrow style={styles.eyebrow}>{eyebrow}</Eyebrow>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.md,
  },
  text: {
    flex: 1,
  },
  eyebrow: {
    marginBottom: space.sm,
  },
  title: {
    color: colors.text,
    fontFamily: font.displayBold,
    fontSize: 26,
    letterSpacing: -0.5,
  },
  description: {
    marginTop: space.xs,
    color: colors.body,
    fontFamily: font.sans,
    fontSize: 13,
    lineHeight: 19,
  },
  actions: {
    flexDirection: 'row',
    gap: space.sm,
  },
});
