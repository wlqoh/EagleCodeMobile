import type { ImageSourcePropType } from 'react-native';

type EagleImageSet = { color: ImageSourcePropType; locked: ImageSourcePropType };

// Картинки по `order` уровня: 1 — Орёл I (слабейший), 10 — Орёл X (топ). Генерируются `npm run eagles`.
const eagleImages: Record<number, EagleImageSet> = {
  1: {
    color: require('../../../assets/eagles/eagle-01.webp'),
    locked: require('../../../assets/eagles/eagle-01-locked.webp'),
  },
  2: {
    color: require('../../../assets/eagles/eagle-02.webp'),
    locked: require('../../../assets/eagles/eagle-02-locked.webp'),
  },
  3: {
    color: require('../../../assets/eagles/eagle-03.webp'),
    locked: require('../../../assets/eagles/eagle-03-locked.webp'),
  },
  4: {
    color: require('../../../assets/eagles/eagle-04.webp'),
    locked: require('../../../assets/eagles/eagle-04-locked.webp'),
  },
  5: {
    color: require('../../../assets/eagles/eagle-05.webp'),
    locked: require('../../../assets/eagles/eagle-05-locked.webp'),
  },
  6: {
    color: require('../../../assets/eagles/eagle-06.webp'),
    locked: require('../../../assets/eagles/eagle-06-locked.webp'),
  },
  7: {
    color: require('../../../assets/eagles/eagle-07.webp'),
    locked: require('../../../assets/eagles/eagle-07-locked.webp'),
  },
  8: {
    color: require('../../../assets/eagles/eagle-08.webp'),
    locked: require('../../../assets/eagles/eagle-08-locked.webp'),
  },
  9: {
    color: require('../../../assets/eagles/eagle-09.webp'),
    locked: require('../../../assets/eagles/eagle-09-locked.webp'),
  },
  10: {
    color: require('../../../assets/eagles/eagle-10.webp'),
    locked: require('../../../assets/eagles/eagle-10-locked.webp'),
  },
};

export function getEagleImage(order: number, locked = false): ImageSourcePropType {
  const set = eagleImages[order] ?? eagleImages[1];
  return locked ? set.locked : set.color;
}
