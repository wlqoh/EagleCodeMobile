import { router } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Field } from '@/components/ui/Field';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { useAthlete } from '@/hooks/useData';
import { dataClient } from '@/services/client';
import { Colors, font, space } from '@/theme/tokens';
import { useThemedStyles } from '@/theme/useThemedStyles';

export default function ProfileEditScreen() {
  const { user } = useAuth();
  const athlete = useAthlete(user?.athleteId);
  const queryClient = useQueryClient();
  const styles = useThemedStyles(createStyles);

  const [syncedId, setSyncedId] = useState<string | null>(null);
  const [organization, setOrganization] = useState('');
  const [sportTitle, setSportTitle] = useState('');
  const [disciplines, setDisciplines] = useState('');

  if (athlete.data && athlete.data.id !== syncedId) {
    setSyncedId(athlete.data.id);
    setOrganization(athlete.data.organization);
    setSportTitle(athlete.data.sportTitle);
    setDisciplines(athlete.data.disciplines.join(', '));
  }

  const update = useMutation({
    mutationFn: () =>
      dataClient.updateAthlete(user!.athleteId!, {
        organization,
        sportTitle,
        disciplines: disciplines
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athlete'] });
      queryClient.invalidateQueries({ queryKey: ['athletes'] });
      router.back();
    },
  });

  if (athlete.isError) {
    return (
      <Screen>
        <EmptyState
          title="Не удалось загрузить профиль"
          actionLabel="Повторить"
          onAction={() => athlete.refetch()}
        />
      </Screen>
    );
  }

  if (!athlete.data) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Field label="Организация" value={organization} onChangeText={setOrganization} />
          <Field label="Спортивный разряд" value={sportTitle} onChangeText={setSportTitle} />
          <Field
            label="Дисциплины через запятую"
            value={disciplines}
            onChangeText={setDisciplines}
          />
          {update.isError ? (
            <Text style={styles.error}>Не удалось сохранить изменения</Text>
          ) : null}
          <Button busy={update.isPending} onPress={() => update.mutate()}>
            Сохранить изменения
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    content: {
      padding: space.lg,
      gap: space.md,
    },
    error: {
      color: colors.danger,
      fontFamily: font.sansMedium,
      fontSize: 13,
    },
  });
