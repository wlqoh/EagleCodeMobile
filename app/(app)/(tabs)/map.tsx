import { StyleSheet, Text } from 'react-native';

import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Screen } from '@/components/ui/Screen';
import { colors, font, space } from '@/theme/tokens';

export default function MapScreen() {
  return (
    <Screen>
      <ScreenHeader
        eyebrow="42 района"
        title="Карта"
        description="Схематичная карта Дагестана с активностью по городам."
      />
      <Text style={styles.placeholder}>SVG-карта появится в фазе 3.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    color: colors.muted,
    fontFamily: font.sans,
    fontSize: 13,
    paddingHorizontal: space.lg,
  },
});
