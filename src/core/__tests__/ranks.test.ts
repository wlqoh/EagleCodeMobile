import { RANKS, awardRegalia, rankTone } from '../ranks';
import { seedDatabase } from '../seed';
import type { Achievement } from '../types';

describe('ranks', () => {
  it('maps rank names to the expected badge tone', () => {
    expect(rankTone('I разряд')).toBe('bronze');
    expect(rankTone('КМС')).toBe('silver');
    expect(rankTone('МС')).toBe('gold');
    expect(rankTone('МСМК')).toBe('elite');
    expect(rankTone('II юношеский')).toBe('default');
    expect(rankTone('Неизвестный разряд')).toBe('default');
  });

  it('keeps only verified awards, newest first', () => {
    const achievements: Achievement[] = [
      { id: '1', athleteId: 'a1', title: 'Старый', description: '', category: 'Награды', status: 'verified', earnedAt: '2025-01-01' },
      { id: '2', athleteId: 'a1', title: 'Новый', description: '', category: 'Награды', status: 'verified', earnedAt: '2026-01-01' },
      { id: '3', athleteId: 'a1', title: 'Не подтверждено', description: '', category: 'Награды', status: 'progress' },
      { id: '4', athleteId: 'a1', title: 'Другая категория', description: '', category: 'Уровни', status: 'verified', earnedAt: '2026-06-01' },
    ];

    expect(awardRegalia(achievements).map((item) => item.id)).toEqual(['2', '1']);
  });

  it('keeps the seed data consistent with the rank registry', () => {
    const known = new Set(RANKS.map((item) => item.name));
    for (const athlete of seedDatabase.athletes) {
      expect(known.has(athlete.sportTitle)).toBe(true);
    }
  });
});
