import { Image, ImageStyle, StyleProp } from 'react-native';

import { getEagleImage } from '@/components/features/eagleImages';
import { eagleLevels, getEagleProgress } from '@/core/eagleLevels';
import { useLevels } from '@/hooks/useData';
import { useTheme } from '@/theme/ThemeContext';

type EagleAvatarProps = {
  meters: number;
  size: number;
  style?: StyleProp<ImageStyle>;
};

export function EagleAvatar({ meters, size, style }: EagleAvatarProps) {
  const { colors } = useTheme();
  const levels = useLevels();
  // До загрузки / при ошибке / пустом ответе — локальная шкала, чтобы орёл был виден сразу.
  const source = levels.data?.length ? levels.data : eagleLevels;
  const { level } = getEagleProgress(meters, source);

  return (
    <Image
      source={getEagleImage(level.order)}
      accessibilityRole="image"
      accessibilityLabel={`Орёл ${level.id} — ${level.name}`}
      style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.highest }, style]}
    />
  );
}
