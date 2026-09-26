import { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { useTheme } from '@/theme/ThemeContext';
import { Colors, font, radius } from '@/theme/tokens';
import { useThemedStyles } from '@/theme/useThemedStyles';

export const Input = forwardRef<TextInput, TextInputProps>(function Input(
  { style, onFocus, onBlur, ...props },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <TextInput
      ref={ref}
      placeholderTextColor={colors.inputPlaceholder}
      style={[styles.input, focused && styles.focused, style]}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      {...props}
    />
  );
});

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    input: {
      width: '100%',
      minHeight: 44,
      paddingVertical: 9,
      paddingHorizontal: 12,
      color: colors.text,
      backgroundColor: colors.inputBg,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.sm + 1,
      fontFamily: font.sans,
      fontSize: 14,
    },
    focused: {
      borderColor: colors.primary,
    },
  });
