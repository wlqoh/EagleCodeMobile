/**
 * Демо-заглушки, перенесённые 1:1 из веб-версии (EagleCode/src/pages/user/*). Не вычисляются из данных;
 * тексты адаптированы под спортивное программирование — расходятся с вебом.
 */
export const placeholders = {
  profile: {
    rank: '#04',
    season: { value: '3 240 м', note: '+18% к прошлому', progress: 72 },
    competitionsExtra: 7,
    competitionsNote: '3 призовых места',
    competitionsProgress: 64,
    achievements: { value: '18', note: '14 подтверждено', progress: 78 },
    slices: [
      ['Общий рейтинг РД', '#04 / 1 284'],
      ['Махачкала', '#03 / 612'],
      ['Алгоритмическое', '#05 / 390'],
    ] as const,
  },
  rating: [
    { label: 'Участники', value: '1 284', note: '+82 за месяц', progress: 76 },
    { label: 'Города', value: '42 / 52', note: 'охват республики', progress: 81 },
    { label: 'Стартов', value: '86', note: '12 активных', progress: 68 },
    { label: 'Начислено', value: '3.84M м', note: '+248K в сезоне', progress: 83 },
  ],
  results: { starts: '9', podiums: '3', solved: '214' },
  achievements: {
    featuredTitle: 'Бронза республики — 2026',
    featuredText: 'Результат подтверждён официальным протоколом соревнования.',
  },
  chart: { months: ['Май', 'Июнь', 'Июль', 'Август', 'Сентябрь'] },
  systemPill: '42 РАЙОНА // ONLINE',
} as const;
