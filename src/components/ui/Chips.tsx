import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { useThemedStyles } from '@/theme/useThemedStyles';
import { Colors, font, radius } from '@/theme/tokens';

export type ChipOption = {
  key: string;
  label: string;
};

type ChipsProps = {
  options: ChipOption[];
  value: string;
  onChange: (key: string) => void;
};

export function Chips({ options, value, onChange }: ChipsProps) {
  const styles = useThemedStyles(createStyles);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {options.map((option) => {
        const active = option.key === value;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: 5,
      paddingBottom: 2,
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
