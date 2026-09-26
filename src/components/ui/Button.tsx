import { PropsWithChildren } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

import { colors, font, radius, space } from '@/theme/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = PropsWithChildren<{
  onPress?: () => void;
  variant?: ButtonVariant;
  busy?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}>;

export function Button({
  children,
  onPress,
  variant = 'primary',
  busy = false,
  disabled = false,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const isDisabled = disabled || busy;
  const variantStyle = variantStyles[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled, busy }}
      style={({ pressed }) => [
        styles.base,
        variantStyle.container,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={variantStyle.text.color as string} />
      ) : typeof children === 'string' ? (
        <Text style={[styles.label, variantStyle.text]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: radius.md,
    paddingVertical: space.sm + 1,
    paddingHorizontal: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
  },
  label: {
    fontFamily: font.sansBold,
    fontSize: 14,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.85,
  },
});

const variantStyles: Record<ButtonVariant, { container: object; text: { color: string } }> = {
  primary: {
    container: { backgroundColor: colors.primary },
    text: { color: colors.onPrimary },
  },
  secondary: {
    container: { backgroundColor: colors.highest, borderColor: colors.border },
    text: { color: colors.text },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: { color: colors.muted },
  },
  danger: {
    container: { backgroundColor: colors.buttonDangerBg, borderColor: colors.buttonDangerBorder },
    text: { color: colors.buttonDangerText },
  },
};
