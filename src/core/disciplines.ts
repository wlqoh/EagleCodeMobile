// Справочник дисциплин спортивного программирования (официальный перечень ФСП).
// В данных и API хранится полное название (`name`); в чипах и бейджах показывается `short`.
export interface DisciplineInfo {
  name: string; // полное официальное название — то, что лежит в Athlete.disciplines / Competition.discipline
  short: string; // для чипов и бейджей
  requirements: string[]; // требования к участию, специфичные для дисциплины
}

export const DISCIPLINES: readonly DisciplineInfo[] = [
  {
    name: 'Алгоритмическое программирование',
    short: 'Алгоритмическое',
    requirements: ['Аккаунт в тестирующей системе соревнования', 'Знание одного из языков: C++, Python, Java'],
  },
  {
    name: 'Продуктовое программирование',
    short: 'Продуктовое',
    requirements: ['Заявленный состав команды', 'Репозиторий проекта (GitHub / GitVerse)'],
  },
  {
    name: 'Программирование беспилотных авиационных систем',
    short: 'БАС',
    requirements: ['Допуск к полигону или доступ к симулятору', 'Инструктаж по технике безопасности'],
  },
  {
    name: 'Программирование робототехники',
    short: 'Робототехника',
    requirements: ['Собственный комплект робота или заявка на выдачу', 'Прошивка и ПО, соответствующие регламенту'],
  },
  {
    name: 'Программирование систем информационной безопасности',
    short: 'Инфобез',
    requirements: ['Ноутбук с подготовленным окружением', 'Подписанные правила этичного поведения'],
  },
] as const;

export const COMMON_REQUIREMENTS = ['Заполненный профиль', 'Подтверждённый разряд при наличии', 'Согласие с регламентом'];

export function findDiscipline(name: string): DisciplineInfo | undefined {
  return DISCIPLINES.find((item) => item.name === name);
}

/** Короткое название; для неизвестной строки (например, старые данные из API) — сама строка. */
export function disciplineLabel(name: string): string {
  return findDiscipline(name)?.short ?? name;
}

/** Общие требования + требования дисциплины (для неизвестной — только общие). */
export function requirementsFor(name: string): string[] {
  return [...COMMON_REQUIREMENTS, ...(findDiscipline(name)?.requirements ?? [])];
}
