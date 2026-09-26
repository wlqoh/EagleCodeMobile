import { ReactNode } from 'react';
import { StyleSheet, Text, TextInputProps, View } from 'react-native';

import { colors, font, space } from '@/theme/tokens';

import { Input } from './Input';

type FieldProps = TextInputProps & {
  label: string;
  hint?: string;
  error?: string;
  inputComponent?: ReactNode;
};

export function Field({ label, hint, error, inputComponent, ...inputProps }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {inputComponent ?? <Input {...inputProps} />}
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: space.xs + 3,
  },
  label: {
    color: '#d7ddd8',
    fontFamily: font.sansSemiBold,
    fontSize: 13,
  },
  hint: {
    color: colors.muted,
    fontFamily: font.sans,
    fontSize: 11,
  },
  error: {
    color: colors.danger,
    fontFamily: font.sans,
    fontSize: 11,
  },
});
