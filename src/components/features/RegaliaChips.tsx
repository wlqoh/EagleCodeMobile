import { StyleSheet, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import type { Achievement } from '@/core/types';
import { NO_RANK, awardRegalia, rankTone } from '@/core/ranks';
import { space } from '@/theme/tokens';

type Props = {
  sportTitle: string;
  achievements?: Achievement[];
};

export function RegaliaChips({ sportTitle, achievements }: Props) {
  const showRank = Boolean(sportTitle) && sportTitle !== NO_RANK;
  const awards = achievements ? awardRegalia(achievements) : [];

  if (!showRank && awards.length === 0) return null;

  return (
    <View style={styles.row}>
      {showRank ? <Badge tone={rankTone(sportTitle)}>{sportTitle}</Badge> : null}
      {awards.map((item) => (
        <Badge key={item.id} tone="primary">
          {item.title}
        </Badge>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
});
