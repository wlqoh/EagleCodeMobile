import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { Logo } from '@/components/brand/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { Colors, font, space } from '@/theme/tokens';
import { useThemedStyles } from '@/theme/useThemedStyles';

export default function AdminOnlyScreen() {
  const { logout } = useAuth();
  const styles = useThemedStyles(createStyles);

  return (
    <Screen>
      <View style={styles.content}>
        <Logo size={56} />
        <Text style={styles.title}>Админ-панель доступна в веб-версии</Text>
        <Text style={styles.body}>
          Управление соревнованиями, участниками и результатами выполняется на сайте EagleCode
          Sport. Мобильное приложение — только кабинет участника.
        </Text>
        <Button variant="secondary" onPress={logout} style={styles.button}>
          Выйти
        </Button>
      </View>
    </Screen>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: space.xl,
      gap: space.md,
    },
    title: {
      color: colors.text,
      fontFamily: font.display,
      fontSize: 20,
      textAlign: 'center',
    },
    body: {
      color: colors.body,
      fontFamily: font.sans,
      fontSize: 13,
      lineHeight: 19,
      textAlign: 'center',
    },
    button: {
      marginTop: space.md,
      minWidth: 160,
    },
  });
