import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { colors, font, space } from '@/theme/tokens';

export default function ProfileEditScreen() {
  return (
    <Screen>
      <Text style={styles.placeholder}>Форма редактирования профиля появится в фазе 3.</Text>
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
