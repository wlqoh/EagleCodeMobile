import { eagleLevels, getEagleProgress, rankAthletes } from '../eagleLevels';
import { seedDatabase } from '../seed';

describe('eagle level thresholds', () => {
  it.each([
    [0, 'I'],
    [999, 'I'],
    [1_000, 'II'],
    [5_999, 'VI'],
    [7_999, 'VIII'],
    [8_000, 'IX'],
    [9_999, 'IX'],
    [10_000, 'X'],
    [160_000, 'X'],
  ])('maps %i meters to level %s', (meters, id) => {
    expect(getEagleProgress(meters, eagleLevels).level.id).toBe(id);
  });

  it('calculates progress within the demo athlete level', () => {
    expect(getEagleProgress(5_480, eagleLevels)).toMatchObject({ progress: 48, remaining: 520 });
    expect(getEagleProgress(5_480, eagleLevels).level.id).toBe('VI');
  });

  it('calculates progress on the wide step', () => {
    const result = getEagleProgress(9_000, eagleLevels);
    expect(result.level.id).toBe('IX');
    expect(result).toMatchObject({ progress: 50, remaining: 1_000 });
  });

  it('keeps the highest level at 100 percent with no next level', () => {
    expect(getEagleProgress(10_000, eagleLevels)).toMatchObject({ progress: 100, remaining: 0, next: null });
  });

  it('is a continuous scale from I to X', () => {
    eagleLevels.forEach((level, index) => {
      expect(level.order).toBe(index + 1);
      const next = eagleLevels[index + 1];
      if (next) {
        expect(next.minMeters).toBe((level.maxMeters as number) + 1);
      } else {
        expect(level.maxMeters).toBeNull();
      }
    });
  });

  it('sorts athletes by meters without mutating the source', () => {
    const source = seedDatabase.athletes.slice(0, 3).reverse();
    const ranked = rankAthletes(source);
    expect(ranked[0].meters).toBeGreaterThanOrEqual(ranked[1].meters);
    expect(source).not.toEqual(ranked);
  });
});

describe('seed athlete levels', () => {
  it('places the demo athlete (a1) at level VI', () => {
    const demo = seedDatabase.athletes.find((item) => item.id === 'a1')!;
    expect(getEagleProgress(demo.meters, eagleLevels).level.id).toBe('VI');
  });

  it('spreads seed athletes across 6 distinct levels', () => {
    const levels = new Set(seedDatabase.athletes.map((item) => getEagleProgress(item.meters, eagleLevels).level.id));
    expect(levels.size).toBe(6);
  });
});
