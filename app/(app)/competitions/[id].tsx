import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { CalendarDays, CheckCircle2, Clock3, MapPin, Tag, Trophy, UsersRound } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { requirementsFor } from '@/core/disciplines';
import { useApplications } from '@/hooks/useData';
import { dataClient } from '@/services/client';
import { useTheme } from '@/theme/ThemeContext';
import { Colors, font, radius, space } from '@/theme/tokens';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { formatDate, formatMeters } from '@/utils/format';

export default function CompetitionDetailScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const applications = useApplications();
  const queryClient = useQueryClient();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const competition = useQuery({
    queryKey: ['competition', id],
    queryFn: () => dataClient.getCompetition(id),
  });

  const apply = useMutation({
    mutationFn: () => dataClient.submitApplication(user!.athleteId!, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  });

  if (competition.isError) {
    return (
      <Screen>
        <EmptyState
          title="Не удалось загрузить соревнование"
          actionLabel="Повторить"
          onAction={() => competition.refetch()}
        />
      </Screen>
    );
  }

  if (!competition.data || !applications.data) {
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  }

  const item = competition.data;
  const application = applications.data.find(
    (entry) => entry.athleteId === user?.athleteId && entry.competitionId === id,
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>{item.description}</Text>

        <Card style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Trophy color={colors.primary} size={24} />
          </View>
          <Badge tone="primary">
            {item.status === 'registration' ? 'Регистрация открыта' : 'Соревнование'}
          </Badge>
          <View style={styles.facts}>
            <View style={styles.factRow}>
              <CalendarDays color={colors.muted} size={16} />
              <View>
                <Text style={styles.factLabel}>Дата</Text>
                <Text style={styles.factValue}>{formatDate(item.startsAt)}</Text>
              </View>
            </View>
            <View style={styles.factRow}>
              <MapPin color={colors.muted} size={16} />
              <View>
                <Text style={styles.factLabel}>Место</Text>
                <Text style={styles.factValue}>{item.location}</Text>
              </View>
            </View>
            <View style={styles.factRow}>
              <Tag color={colors.muted} size={16} />
              <View>
                <Text style={styles.factLabel}>Дисциплина</Text>
                <Text style={styles.factValue}>{item.discipline}</Text>
              </View>
            </View>
            <View style={styles.factRow}>
              <UsersRound color={colors.muted} size={16} />
              <View>
                <Text style={styles.factLabel}>Лимит</Text>
                <Text style={styles.factValue}>{item.capacity} участников</Text>
              </View>
            </View>
            <View style={styles.factRow}>
              <Trophy color={colors.muted} size={16} />
              <View>
                <Text style={styles.factLabel}>Награда</Text>
                <Text style={styles.factValue}>до {formatMeters(item.rewardMeters)}</Text>
              </View>
            </View>
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Расписание</Text>
          {item.schedule.map((line, index) => (
            <View key={line} style={styles.timelineRow}>
              <Text style={styles.timelineIndex}>{String(index + 1).padStart(2, '0')}</Text>
              <Clock3 color={colors.muted} size={14} />
              <Text style={styles.timelineText}>{line}</Text>
            </View>
          ))}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.eyebrow}>APPLICATION NODE</Text>
          <Text style={styles.sectionTitle}>Заявка на участие</Text>
          {application ? (
            <View style={styles.successBox}>
              <CheckCircle2 color={colors.primary} size={20} />
              <View style={styles.successBody}>
                <Text style={styles.successTitle}>
                  {application.status === 'approved' ? 'Заявка подтверждена' : 'Заявка отправлена'}
                </Text>
                <Text style={styles.successText}>Статус доступен в личном кабинете.</Text>
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.body}>
                Подтвердите участие. Администратор проверит профиль и разряд.
              </Text>
              <Button busy={apply.isPending} onPress={() => apply.mutate()}>
                Подать заявку
              </Button>
            </>
          )}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Требования</Text>
          {requirementsFor(item.discipline).map((requirement) => (
            <View key={requirement} style={styles.checkRow}>
              <CheckCircle2 color={colors.primary} size={14} />
              <Text style={styles.checkText}>{requirement}</Text>
            </View>
          ))}
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
  description: {
    color: colors.body,
    fontFamily: font.sans,
    fontSize: 13,
    lineHeight: 19,
  },
  heroCard: {
    gap: space.md,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.highest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  facts: {
    gap: space.sm,
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  factLabel: {
    color: colors.muted,
    fontFamily: font.sans,
    fontSize: 11,
  },
  factValue: {
    color: colors.text,
    fontFamily: font.sansSemiBold,
    fontSize: 13,
  },
  section: {
    gap: space.sm,
  },
  eyebrow: {
    color: colors.primary,
    fontFamily: font.monoSemiBold,
    fontSize: 10,
    letterSpacing: 0.6,
  },
  sectionTitle: {
    color: colors.text,
    fontFamily: font.displayBold,
    fontSize: 16,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  timelineIndex: {
    color: colors.primary,
    fontFamily: font.monoSemiBold,
    fontSize: 12,
    width: 20,
  },
  timelineText: {
    flex: 1,
    color: colors.body,
    fontFamily: font.sans,
    fontSize: 13,
  },
  body: {
    color: colors.body,
    fontFamily: font.sans,
    fontSize: 13,
    lineHeight: 19,
  },
  successBox: {
    flexDirection: 'row',
    gap: space.sm,
    padding: space.md,
    backgroundColor: colors.badgePrimaryBg,
    borderWidth: 1,
    borderColor: colors.badgePrimaryBorder,
    borderRadius: radius.md,
  },
  successBody: {
    flex: 1,
  },
  successTitle: {
    color: colors.text,
    fontFamily: font.sansSemiBold,
    fontSize: 13,
  },
  successText: {
    color: colors.muted,
    fontFamily: font.sans,
    fontSize: 12,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.xs + 2,
  },
  checkText: {
    color: colors.body,
    fontFamily: font.sans,
    fontSize: 13,
  },
});
