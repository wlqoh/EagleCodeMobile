import type { BadgeTone } from '@/theme/badgeTones';
import type { Achievement } from './types';

export const NO_RANK = 'Без разряда';

export interface RankInfo {
  name: string;
  tone: BadgeTone;
}

// Порядок — от младшего к старшему; он же порядок чипов в редактировании профиля.
export const RANKS: readonly RankInfo[] = [
  { name: NO_RANK, tone: 'default' },
  { name: 'III юношеский', tone: 'default' },
  { name: 'II юношеский', tone: 'default' },
  { name: 'I юношеский', tone: 'default' },
  { name: 'III разряд', tone: 'bronze' },
  { name: 'II разряд', tone: 'bronze' },
  { name: 'I разряд', tone: 'bronze' },
  { name: 'КМС', tone: 'silver' },
  { name: 'МС', tone: 'gold' },
  { name: 'МСМК', tone: 'elite' },
  { name: 'ЗМС', tone: 'elite' },
];

export const AWARD_CATEGORY = 'Награды';

/** Тон чипа разряда; неизвестная строка → 'default'. */
export function rankTone(name: string): BadgeTone {
  return RANKS.find((item) => item.name === name)?.tone ?? 'default';
}

/** Подтверждённые награды: status === 'verified' && category === AWARD_CATEGORY, новые сверху (по earnedAt). */
export function awardRegalia(achievements: Achievement[]): Achievement[] {
  return achievements
    .filter((item) => item.status === 'verified' && item.category === AWARD_CATEGORY)
    .sort((a, b) => (b.earnedAt ?? '').localeCompare(a.earnedAt ?? ''));
}
