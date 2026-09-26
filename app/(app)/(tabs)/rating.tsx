import { StyleSheet, Text } from 'react-native';

import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Screen } from '@/components/ui/Screen';
import { colors, font, space } from '@/theme/tokens';

export default function RatingScreen() {
  return (
    <Screen>
      <ScreenHeader
        eyebrow="Республика Дагестан"
        title="Рейтинг"
        description="Общий зачёт участников и срез по дисциплинам."
      />
      <Text style={styles.placeholder}>Таблица рейтинга появится в фазе 3.</Text>
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
