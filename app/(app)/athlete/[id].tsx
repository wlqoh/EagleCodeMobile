import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EagleAvatar } from '@/components/features/EagleAvatar';
import { EagleProgress } from '@/components/features/EagleProgress';
import { RegaliaChips } from '@/components/features/RegaliaChips';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { disciplineLabel } from '@/core/disciplines';
import { useAchievements, useAthlete, useCities, useLevels } from '@/hooks/useData';
import { Colors, font, space } from '@/theme/tokens';
import { useThemedStyles } from '@/theme/useThemedStyles';

export default function AthleteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const athlete = useAthlete(id);
  const cities = useCities();
  const levels = useLevels();
  const achievements = useAchievements(id);
  const styles = useThemedStyles(createStyles);

  if (athlete.isError) {
    return (
      <Screen>
        <EmptyState
          title="Не удалось загрузить участника"
          actionLabel="Повторить"
          onAction={() => athlete.refetch()}
        />
      </Screen>
    );
  }

  if (!athlete.data || !cities.data || !levels.data) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  const profile = athlete.data;
  const city = cities.data.find((item) => item.id === profile.cityId);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.header}>
          <EagleAvatar meters={profile.meters} size={56} style={styles.avatar} />
          <Text style={styles.name}>{profile.fullName}</Text>
          <Text style={styles.subtitle}>{profile.organization}</Text>
          <RegaliaChips sportTitle={profile.sportTitle} achievements={achievements.data} />
          {city ? <Text style={styles.city}>{city.name}</Text> : null}
        </Card>

        <EagleProgress meters={profile.meters} levels={levels.data} detailed={false} />

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Дисциплины</Text>
          <View style={styles.tagList}>
            {profile.disciplines.map((item) => (
              <Badge key={item}>{disciplineLabel(item)}</Badge>
            ))}
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
  content: {
    padding: space.lg,
    gap: space.lg,
  },
  header: {
    alignItems: 'center',
    gap: space.xs,
  },
  avatar: {
    marginBottom: space.xs,
  },
  name: {
    color: colors.text,
    fontFamily: font.displayBold,
    fontSize: 20,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.body,
    fontFamily: font.sans,
    fontSize: 13,
    textAlign: 'center',
  },
  city: {
    color: colors.muted,
    fontFamily: font.sans,
    fontSize: 12,
  },
  section: {
    gap: space.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: font.displayBold,
    fontSize: 16,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
});
