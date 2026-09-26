import { COMMON_REQUIREMENTS, DISCIPLINES, disciplineLabel, requirementsFor } from '../disciplines';
import { seedDatabase } from '../seed';

describe('disciplines', () => {
  it('returns the short label for every known discipline', () => {
    for (const discipline of DISCIPLINES) {
      expect(disciplineLabel(discipline.name)).toBe(discipline.short);
    }
  });

  it('falls back to the original string for an unknown discipline', () => {
    expect(disciplineLabel('Лёгкая атлетика')).toBe('Лёгкая атлетика');
  });

  it('combines common requirements with discipline-specific ones', () => {
    for (const discipline of DISCIPLINES) {
      expect(requirementsFor(discipline.name)).toEqual([...COMMON_REQUIREMENTS, ...discipline.requirements]);
    }
  });

  it('returns only the common requirements for an unknown discipline', () => {
    expect(requirementsFor('Лёгкая атлетика')).toEqual(COMMON_REQUIREMENTS);
  });

  it('keeps the seed data consistent with the discipline registry', () => {
    const known = new Set(DISCIPLINES.map((item) => item.name));

    for (const competition of seedDatabase.competitions) {
      expect(known.has(competition.discipline)).toBe(true);
    }
    for (const athlete of seedDatabase.athletes) {
      for (const discipline of athlete.disciplines) {
        expect(known.has(discipline)).toBe(true);
      }
    }

    const usedInCompetitions = new Set(seedDatabase.competitions.map((item) => item.discipline));
    for (const discipline of DISCIPLINES) {
      expect(usedInCompetitions.has(discipline.name)).toBe(true);
    }
  });
});
