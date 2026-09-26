import { Link } from 'expo-router';
import { CalendarDays, MapPin, Trophy, UsersRound } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { disciplineLabel } from '@/core/disciplines';
import type { Competition } from '@/core/types';
import { useTheme } from '@/theme/ThemeContext';
import { Colors, font, radius, space } from '@/theme/tokens';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { formatMeters } from '@/utils/format';

const statusLabel: Record<Competition['status'], string> = {
  registration: 'Регистрация открыта',
  upcoming: 'Скоро',
  active: 'Идёт сейчас',
  finished: 'Завершено',
};

export function CompetitionCard({ competition }: { competition: Competition }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <Card style={styles.card}>
      <View style={styles.metaRow}>
        <Badge tone={competition.status === 'registration' ? 'primary' : 'default'}>
          {statusLabel[competition.status]}
        </Badge>
        <Badge tone="gold">+{formatMeters(competition.rewardMeters)}</Badge>
      </View>
      <View style={styles.disciplineRow}>
        <Badge>{disciplineLabel(competition.discipline)}</Badge>
      </View>
      <View style={styles.icon}>
        <Trophy color={colors.primary} size={22} />
      </View>
      <Text style={styles.title}>{competition.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {competition.description}
      </Text>
      <View style={styles.metaList}>
        <View style={styles.metaItem}>
          <CalendarDays color={colors.muted} size={14} />
          <Text style={styles.metaText}>
            {new Date(competition.startsAt).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
            })}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <MapPin color={colors.muted} size={14} />
          <Text style={styles.metaText} numberOfLines={1}>
            {competition.location}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <UsersRound color={colors.muted} size={14} />
          <Text style={styles.metaText}>до {competition.capacity} участников</Text>
        </View>
      </View>
      <Link href={{ pathname: '/competitions/[id]', params: { id: competition.id } }} asChild>
        <Button variant="secondary">Открыть соревнование</Button>
      </Link>
    </Card>
  );
}

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    card: {
      gap: space.sm,
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    disciplineRow: {
      flexDirection: 'row',
    },
    icon: {
      width: 44,
      height: 44,
      borderRadius: radius.md,
      backgroundColor: colors.highest,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: space.xs,
    },
    title: {
      color: colors.text,
      fontFamily: font.displayBold,
      fontSize: 17,
    },
    description: {
      color: colors.body,
      fontFamily: font.sans,
      fontSize: 13,
      lineHeight: 18,
    },
    metaList: {
      gap: space.xs + 2,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: space.xs + 2,
    },
    metaText: {
      flex: 1,
      color: colors.body,
      fontFamily: font.sans,
      fontSize: 12,
    },
  });
