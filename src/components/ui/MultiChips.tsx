import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemedStyles } from '@/theme/useThemedStyles';
import { Colors, font, radius } from '@/theme/tokens';

import type { ChipOption } from './Chips';

type MultiChipsProps = {
  options: ChipOption[];
  values: string[];
  onChange: (values: string[]) => void;
};

export function MultiChips({ options, values, onChange }: MultiChipsProps) {
  const styles = useThemedStyles(createStyles);

  const toggle = (key: string) => {
    onChange(values.includes(key) ? values.filter((item) => item !== key) : [...values, key]);
  };

  return (
    <View style={styles.row}>
      {options.map((option) => {
        const checked = values.includes(option.key);
        return (
          <Pressable
            key={option.key}
            onPress={() => toggle(option.key)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked }}
            style={[styles.chip, checked && styles.chipActive]}
          >
            <Text style={[styles.label, checked && styles.labelActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 5,
    },
    chip: {
      minHeight: 36,
      paddingVertical: 7,
      paddingHorizontal: 11,
      backgroundColor: colors.raised,
      borderWidth: 1,
      borderColor: 'transparent',
      borderRadius: radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chipActive: {
      backgroundColor: colors.primary,
    },
    label: {
      color: colors.muted,
      fontFamily: font.sansSemiBold,
      fontSize: 12,
    },
    labelActive: {
      color: colors.onPrimary,
    },
  });
