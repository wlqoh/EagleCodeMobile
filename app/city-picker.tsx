import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { colors, font, space } from '@/theme/tokens';

/** Модальный выбор населённого пункта — используется до входа (регистрация) и в редактировании профиля. */
export default function CityPickerScreen() {
  return (
    <Screen>
      <Text style={styles.placeholder}>Список городов с поиском появится в фазе 3.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    color: colors.muted,
    fontFamily: font.sans,
    fontSize: 13,
    padding: space.lg,
  },
});
