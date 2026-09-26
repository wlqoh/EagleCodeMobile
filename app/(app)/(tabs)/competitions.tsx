import { StyleSheet, Text } from 'react-native';

import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Screen } from '@/components/ui/Screen';
import { colors, font, space } from '@/theme/tokens';

export default function CompetitionsScreen() {
  return (
    <Screen>
      <ScreenHeader
        eyebrow="Календарь"
        title="Соревнования"
        description="Открытая регистрация, ближайшие старты и завершённые события."
      />
      <Text style={styles.placeholder}>Список соревнований появится в фазе 3.</Text>
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
