// Источник: EagleCode/src/services/seed.ts (веб-версия), контент переписан под спортивное программирование — расходится с вебом.
import { eagleLevels } from './eagleLevels';
import type { MockDatabase } from './types';

export const seedDatabase: MockDatabase = {
  credentials: {
    'athlete@eaglecode.ru': 'demo123',
    'admin@eaglecode.ru': 'demo123',
  },
  users: [
    { id: 'u-athlete', email: 'athlete@eaglecode.ru', fullName: 'Магомед Алиев', role: 'athlete', athleteId: 'a1' },
    { id: 'u-admin', email: 'admin@eaglecode.ru', fullName: 'Шамиль Гаджиев', role: 'admin' },
  ],
  cities: [
    { id: 'c1', name: 'Махачкала', district: 'городской округ', coordinates: [42.98, 47.5] },
    { id: 'c2', name: 'Дербент', district: 'городской округ', coordinates: [42.06, 48.29] },
    { id: 'c3', name: 'Хасавюрт', district: 'городской округ', coordinates: [43.25, 46.59] },
    { id: 'c4', name: 'Каспийск', district: 'городской округ', coordinates: [42.88, 47.64] },
    { id: 'c5', name: 'Буйнакск', district: 'городской округ', coordinates: [42.82, 47.12] },
  ],
  athletes: [
    { id: 'a2', fullName: 'Амина Гаджиева', email: 'amina@example.ru', organization: 'IT-куб Дербент', cityId: 'c2', disciplines: ['Алгоритмическое программирование', 'Продуктовое программирование'], sportTitle: 'КМС', meters: 10_400, avatarInitials: 'АГ', joinedAt: '2025-11-12' },
    { id: 'a3', fullName: 'Расул Магомедов', email: 'rasul@example.ru', organization: 'Кванториум Хасавюрт', cityId: 'c3', disciplines: ['Программирование систем информационной безопасности'], sportTitle: 'МС', meters: 8_900, avatarInitials: 'РМ', joinedAt: '2025-09-04' },
    { id: 'a4', fullName: 'Патимат Омарова', email: 'patimat@example.ru', organization: 'ДГУ', cityId: 'c1', disciplines: ['Алгоритмическое программирование'], sportTitle: 'МСМК', meters: 7_350, avatarInitials: 'ПО', joinedAt: '2026-01-18' },
    { id: 'a1', fullName: 'Магомед Алиев', email: 'athlete@eaglecode.ru', organization: 'ДГТУ', cityId: 'c1', disciplines: ['Алгоритмическое программирование', 'Продуктовое программирование'], sportTitle: 'I разряд', meters: 5_480, avatarInitials: 'МА', joinedAt: '2025-10-01' },
    { id: 'a5', fullName: 'Зарема Абдуллаева', email: 'zarema@example.ru', organization: 'Кванториум Каспийск', cityId: 'c4', disciplines: ['Программирование робототехники'], sportTitle: 'КМС', meters: 3_200, avatarInitials: 'ЗА', joinedAt: '2026-02-10' },
    { id: 'a6', fullName: 'Мурад Ахмедов', email: 'murad@example.ru', organization: 'Буйнакский политехнический колледж', cityId: 'c5', disciplines: ['Программирование беспилотных авиационных систем'], sportTitle: 'II юношеский', meters: 1_750, avatarInitials: 'МА', joinedAt: '2026-03-17' },
  ],
  competitions: [
    { id: 'cp1', title: 'Кубок Дагестана по продуктовому программированию', description: 'Командный продуктовый хакатон: команды по 3–5 человек за 30 часов делают MVP по кейсам компаний региона и защищают его перед жюри.', discipline: 'Продуктовое программирование', location: 'Махачкала, ДГТУ, коворкинг «Точка кипения»', startsAt: '2026-10-12T10:00:00', endsAt: '2026-10-13T18:00:00', registrationEndsAt: '2026-10-08T23:59:00', capacity: 120, rewardMeters: 2_500, status: 'registration', schedule: ['10:00 — открытие и выдача кейсов', '11:00 — старт разработки', '16:00 (13.10) — питчи и защита', '18:00 — награждение'] },
    { id: 'cp2', title: 'Кубок Дагестана по информационной безопасности', description: 'CTF в формате Attack-Defense: команды до 5 человек защищают свои сервисы и атакуют сервисы соперников.', discipline: 'Программирование систем информационной безопасности', location: 'Хасавюрт, технопарк «Кванториум»', startsAt: '2026-10-26T10:00:00', endsAt: '2026-10-26T19:00:00', registrationEndsAt: '2026-10-20T23:59:00', capacity: 90, rewardMeters: 1_800, status: 'upcoming', schedule: ['09:00 — проверка сети и выдача образов', '10:00 — старт игры', '18:00 — закрытие сети и подсчёт очков'] },
    { id: 'cp3', title: 'Открытые соревнования по программированию БАС «Каспийское небо»', description: 'Командные соревнования по 2 человека: программирование автономного полёта квадрокоптера по заданию на полигоне.', discipline: 'Программирование беспилотных авиационных систем', location: 'Каспийск, полигон на побережье', startsAt: '2026-11-02T09:00:00', endsAt: '2026-11-02T17:00:00', registrationEndsAt: '2026-10-28T23:59:00', capacity: 60, rewardMeters: 1_200, status: 'registration', schedule: ['09:00 — брифинг и инструктаж', '10:00 — тренировочные вылеты', '13:00 — зачётные попытки'] },
    { id: 'cp4', title: 'Первенство Дагестана по алгоритмическому программированию', description: 'Личный зачёт: 5 часов, 12 задач, система оценки ICPC.', discipline: 'Алгоритмическое программирование', location: 'Дербент, IT-куб', startsAt: '2026-09-14T10:00:00', endsAt: '2026-09-14T16:00:00', registrationEndsAt: '2026-09-01T23:59:00', capacity: 200, rewardMeters: 2_000, status: 'finished', schedule: ['10:00 — пробный тур', '11:00 — основной тур', '16:00 — заморозка и награждение'] },
    { id: 'cp5', title: 'Турнир по программированию робототехники «РобоКавказ»', description: 'Отборочный онлайн-этап в симуляторе и очный финал: программирование робота для прохождения трассы с заданиями.', discipline: 'Программирование робототехники', location: 'Онлайн · финал — Буйнакск, колледж', startsAt: '2026-11-16T10:00:00', endsAt: '2026-11-17T18:00:00', registrationEndsAt: '2026-11-10T23:59:00', capacity: 80, rewardMeters: 1_500, status: 'registration', schedule: ['10:00 (16.11) — онлайн-отбор', '10:00 (17.11) — очный финал', '17:00 — награждение'] },
  ],
  applications: [
    { id: 'ap1', athleteId: 'a1', competitionId: 'cp1', status: 'approved', createdAt: '2026-09-20T10:00:00' },
    { id: 'ap2', athleteId: 'a6', competitionId: 'cp3', status: 'pending', createdAt: '2026-09-24T11:20:00' },
    { id: 'ap3', athleteId: 'a3', competitionId: 'cp2', status: 'pending', createdAt: '2026-09-25T08:40:00' },
  ],
  results: [
    { id: 'r1', competitionId: 'cp4', athleteId: 'a1', place: 3, score: '9 задач · 1142', metersAwarded: 650, publishedAt: '2026-09-14T18:00:00' },
    { id: 'r2', competitionId: 'cp4', athleteId: 'a2', place: 1, score: '11 задач · 987', metersAwarded: 1_200, publishedAt: '2026-09-14T18:00:00' },
  ],
  transactions: [
    { id: 't1', athleteId: 'a1', amount: 650, reason: '3 место — Первенство Дагестана', protocol: 'RD-2026-0914', createdAt: '2026-09-14T18:00:00' },
    { id: 't2', athleteId: 'a1', amount: 180, reason: 'Бонус за разбор задач', protocol: 'RD-2026-0821', createdAt: '2026-08-21T15:20:00' },
  ],
  achievements: [
    { id: 'ach1', athleteId: 'a1', title: 'Первый старт', description: 'Первое подтверждённое участие в соревновании', category: 'Участие', status: 'verified', earnedAt: '2025-11-08' },
    { id: 'ach2', athleteId: 'a1', title: 'Призёр первенства РД', description: 'Бронза по алгоритмическому программированию', category: 'Награды', status: 'verified', earnedAt: '2026-09-14' },
    { id: 'ach3', athleteId: 'a1', title: 'Орёл IV', description: 'Достигнута отметка 5 000 метров', category: 'Уровни', status: 'verified', earnedAt: '2026-05-12' },
    { id: 'ach4', athleteId: 'a1', title: 'Серия из пяти стартов', description: 'Завершить пять соревнований за сезон', category: 'Сезон', status: 'progress' },
    { id: 'ach5', athleteId: 'a1', title: 'Орёл V', description: 'Набрать 14 000 метров', category: 'Уровни', status: 'locked' },
    { id: 'ach6', athleteId: 'a2', title: 'Чемпион РД · Алгоритмическое', description: 'Победа на первенстве Дагестана', category: 'Награды', status: 'verified', earnedAt: '2026-09-14' },
    { id: 'ach7', athleteId: 'a4', title: 'Полуфиналист ICPC NERC', description: 'Полуфинал Северной Евразии в составе команды ДГУ', category: 'Награды', status: 'verified', earnedAt: '2025-12-07' },
    { id: 'ach8', athleteId: 'a4', title: 'Призёр ЧР · Алгоритмическое', description: 'Призовое место Чемпионата России', category: 'Награды', status: 'verified', earnedAt: '2026-04-19' },
    { id: 'ach9', athleteId: 'a3', title: 'Чемпион РД · Инфобез', description: 'Победа в республиканском CTF', category: 'Награды', status: 'verified', earnedAt: '2026-05-24' },
    { id: 'ach10', athleteId: 'a5', title: 'Призёр первенства РД · Робототехника', description: 'Серебро республиканского первенства', category: 'Награды', status: 'verified', earnedAt: '2026-03-15' },
  ],
  levels: eagleLevels,
  notifications: [
    {
      id: 'n1',
      kind: 'application',
      title: 'Заявка одобрена',
      message: 'Решение по соревнованию «Кубок Дагестана по продуктовому программированию»: участие подтверждено.',
      readAt: null,
      createdAt: '2026-09-20T10:05:00',
    },
    {
      id: 'n2',
      kind: 'meters',
      title: 'Рейтинг обновлён',
      message: '+650 м. 3 место — Первенство Дагестана',
      readAt: '2026-09-15T09:00:00',
      createdAt: '2026-09-14T18:05:00',
    },
  ],
};
