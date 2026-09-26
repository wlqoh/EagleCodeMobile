# План: аватарки-орлы по уровню метров

> Самодостаточный план для репозитория `EagleCodeMobile` (Expo SDK 57, Expo Router, TanStack Query).
> Выполняется без доступа к истории обсуждения: все решения и данные — ниже.
> Предполагается, что изменения из `SPORT_PROGRAMMING_PLAN.md` уже в рабочем дереве (ключ mock-базы `eaglecode.mock.v2`).

## 0. Цель

Сейчас аватарка участника — кружок с инициалами (`athlete.avatarInitials`). Нужно заменить её **картинкой орла**,
которая зависит от уровня участника по метрам (очкам). Есть 10 картинок: орёл №1 — топовый (10 000+ м),
орёл №10 — слабейший (0–999 м). Для этого шкала «Орёл I–X» перестраивается под новые пороги, а картинки
привязываются к уровням.

## 1. Принятые решения (итог интервью)

| # | Вопрос | Решение |
|---|---|---|
| 1 | Связь с существующей шкалой «Орёл I–X» | **Заменить пороги** существующих уровней на новую шкалу; картинка привязывается к уровню. Одна система: орёл на аватарке = уровень в «Прогрессе орла» и на экране «Уровни». |
| 2 | Промежуточные пороги | **Шаг 1 000, одна широкая ступень**: 0 · 1 000 · 2 000 · 3 000 · 4 000 · 5 000 · 6 000 · 7 000 · 8 000 · 10 000 (уровень IX = 8 000–9 999). |
| 3 | Направление нумерации | **Как сейчас: Орёл I = слабый, Орёл X = топ.** Файлы из архива переименовываются при импорте в обратном порядке (`10_Small` → I, `1_Garpiy` → X). Логика `order`/прогресса не меняется. |
| 4 | Названия уровней | **Остаются текущие** («Первый взлёт» … «Вершина Дагестана»). Вид орла в UI **нигде не пишем**. |
| 5 | Где меняем пороги | **Только мобилка**: `src/core/eagleLevels.ts` + mock-база. Веб, Django и контракт API (`types.ts`, `DataClient`, `HttpDataClient`) не трогаем. Уровни по-прежнему берутся из `getLevels()`. В api-режиме сервер отдаёт старые пороги — орлы назначаются по ним, пока бэкенд не обновят (см. §9). |
| 6 | Сохранённая mock-база | Ключ **`eaglecode.mock.v2` → `eaglecode.mock.v3`**, `v2` добавить в `LEGACY_STORAGE_KEYS` (удаляются при старте). |
| 7 | Вид аватарки | **Орёл полностью заменяет инициалы** — круглая картинка без бейджей и номеров. |
| 8 | Где показываем | **4 аватарки** (`RankingRow`, вкладка «Профиль», `athlete/[id]`, шапка «Ещё») **+ экран «Уровни»** (картинка вместо иконки `Bird` у каждого уровня). В карточке `EagleProgress` иконка `Bird` **остаётся**. |
| 9 | Недостигнутые уровни на экране «Уровни» | **Ч/б версия картинки** (генерируется заранее скриптом, CSS-фильтру `grayscale` не доверяем) + существующая иконка замка справа. |
| 10 | Кадрирование | **Вся картинка целиком**, в UI — круглая маска (`borderRadius = size / 2`). Без кропа. |
| 11 | Формат ассетов | **WebP 256×256, quality 85.** Цветные + ч/б, всего 20 файлов (~0,35 МБ). |
| 12 | Генерация ассетов | **Скрипт в репо** `scripts/build-eagle-avatars.mjs` на **`sharp`** (devDependency), команда `npm run eagles -- <папка>`. Исходники (19 МБ PNG) **не коммитим**. |
| 13 | Рендер и структура кода | Общий компонент **`EagleAvatar`** на встроенном `Image` из `react-native` (без `expo-image`, без пересборки dev-клиента) + реестр картинок **`eagleImages.ts`**. |
| 14 | Пока уровни не загружены | `EagleAvatar` сам вызывает `useLevels()`; до загрузки (или при ошибке / пустом списке) считает уровень по **локальной константе `eagleLevels`**. Орёл виден сразу, без мигания. |
| 15 | Демо-данные | **Пересчитать метры 6 спортсменов** в `seed.ts` под новую шкалу, сохранив порядок рейтинга (см. §3.3). |
| 16 | Тесты | **Логика + рендер-тест компонента**: обновить `eagleLevels.test.ts`, новый тест реестра картинок, RNTL-тест `EagleAvatar`, обновить тест ключа mock-базы. |

### Мелкие решения, принятые по умолчанию

- **«Ещё» (`more.tsx`), пока `athlete` не загружен**: нейтральный пустой круг 48 px (`colors.highest`), а не инициалы и не
  орёл уровня I (иначе мелькнёт неверный орёл). После загрузки — `EagleAvatar`.
- **Экран «Уровни»**: картинка — круг 40 px (размер старого квадрата `symbol`), вместо `borderRadius: radius.md`.
  Пройденные и текущий уровень — цветные, будущие — ч/б. Бейджи «Пройдено / Текущий» и замок остаются.
- **Доступность**: `accessibilityRole="image"`, `accessibilityLabel="Орёл {id} — {name}"`.
- **Фон под картинкой** (пока грузится): `colors.highest`, как у нынешних аватарок.
- Поле `avatarInitials` **остаётся** в типе `Athlete`, сиде и `MockDataClient.register` (контракт API не меняем),
  просто больше не рендерится. Неиспользуемые стили `avatar*Text` удалить.

### Вне объёма (сознательно)

- Веб-фронтенд (`../EagleCode/src/domain/eagleLevels.ts`) и Django (данные уровней, `GET/PATCH /levels`).
- Названия видов орлов в UI, поле `species` в `EagleLevel`.
- Бейдж с номером уровня на аватарке, загрузка своих фото пользователем.
- Картинка орла в `EagleProgress` (остаётся `Bird`).
- `expo-image`.

## 2. Исходные картинки и маппинг

Исходники: архив `орлы.zip` → папка с 10 PNG 1254×1254, без альфа-канала (у каждой свой фон, пиксель-арт,
орнаментальный круг). Номер в имени файла: **1 = топ, 10 = слабейший**.

| Файл-исходник | Вид (справочно, в UI не выводится) | `order` | `id` | Название уровня | Пороги, м | Выходные файлы |
|---|---|---|---|---|---|---|
| `10_Small.png` | Малый подорлик | 1 | I | Первый взлёт | 0 – 999 | `eagle-01.webp`, `eagle-01-locked.webp` |
| `9_Indian.png` | Индийский орёл | 2 | II | Уверенный старт | 1 000 – 1 999 | `eagle-02*.webp` |
| `8_Steppe.png` | Степной орёл | 3 | III | Спортивный характер | 2 000 – 2 999 | `eagle-03*.webp` |
| `7_White.png` | Белоголовый орлан | 4 | IV | Сильное крыло | 3 000 – 3 999 | `eagle-04*.webp` |
| `6_Klin.png` | Клинохвостый орёл | 5 | V | Мастер высоты | 4 000 – 4 999 | `eagle-05*.webp` |
| `5_Berkut.png` | Беркут | 6 | VI | Лидер района | 5 000 – 5 999 | `eagle-06*.webp` |
| `4_philipin.png` | Филиппинский орёл | 7 | VII | Чемпион республики | 6 000 – 6 999 | `eagle-07*.webp` |
| `3_Fight.png` | Боевой орёл | 8 | VIII | Наставник | 7 000 – 7 999 | `eagle-08*.webp` |
| `2_Venci.png` | Венценосный орёл | 9 | IX | Легенда спорта | 8 000 – 9 999 | `eagle-09*.webp` |
| `1_Garpiy.png` | Гарпия | 10 | X | Вершина Дагестана | 10 000 + | `eagle-10*.webp` |

Формула: `order = 11 − <номер в имени файла>`. Выходная папка: `assets/eagles/`.

## 3. Изменения в данных

### 3.1 `src/core/eagleLevels.ts`

Заменить массив (названия и `id` не меняются, только пороги) и шапку-комментарий:

```ts
// Источник: EagleCode/src/domain/eagleLevels.ts (веб-версия). Пороги изменены под аватарки-орлов —
// расходится с вебом и сервером, см. EAGLE_AVATARS_PLAN.md, §9.
export const eagleLevels: EagleLevel[] = [
  { id: 'I', order: 1, name: 'Первый взлёт', minMeters: 0, maxMeters: 999 },
  { id: 'II', order: 2, name: 'Уверенный старт', minMeters: 1_000, maxMeters: 1_999 },
  { id: 'III', order: 3, name: 'Спортивный характер', minMeters: 2_000, maxMeters: 2_999 },
  { id: 'IV', order: 4, name: 'Сильное крыло', minMeters: 3_000, maxMeters: 3_999 },
  { id: 'V', order: 5, name: 'Мастер высоты', minMeters: 4_000, maxMeters: 4_999 },
  { id: 'VI', order: 6, name: 'Лидер района', minMeters: 5_000, maxMeters: 5_999 },
  { id: 'VII', order: 7, name: 'Чемпион республики', minMeters: 6_000, maxMeters: 6_999 },
  { id: 'VIII', order: 8, name: 'Наставник', minMeters: 7_000, maxMeters: 7_999 },
  { id: 'IX', order: 9, name: 'Легенда спорта', minMeters: 8_000, maxMeters: 9_999 },
  { id: 'X', order: 10, name: 'Вершина Дагестана', minMeters: 10_000, maxMeters: null },
];
```

`getEagleProgress` и `rankAthletes` не меняются. `seed.ts` уже использует `levels: eagleLevels` — сид подхватит пороги сам.

### 3.2 `src/core/MockDataClient.ts`

```ts
const STORAGE_KEY = 'eaglecode.mock.v3';
/** Старые версии mock-базы: удаляются при первом запуске с новым сидом. */
const LEGACY_STORAGE_KEYS = ['eaglecode.mock.v1', 'eaglecode.mock.v2'];
```

### 3.3 `src/core/seed.ts` — метры спортсменов

Порядок в рейтинге сохраняется (a2 > a3 > a4 > a1 > a5 > a6). Остальные поля не трогать.

| id | Имя | Было | Стало | Уровень |
|---|---|---|---|---|
| a2 | Амина Гаджиева | 15 840 | **10 400** | X |
| a3 | Расул Магомедов | 15 120 | **8 900** | IX |
| a4 | Патимат Омарова | 14 460 | **7 350** | VIII |
| a1 | Магомед Алиев (демо `athlete@eaglecode.ru`) | 12 480 | **5 480** | VI (48 %, до VII — 520 м) |
| a5 | Зарема Абдуллаева | 9 880 | **3 200** | IV |
| a6 | Мурад Ахмедов | 7 320 | **1 750** | II |

Проверено: транзакции (`transactions`) и результаты (`results`) в сиде не складываются в итоговые метры — это
просто история, их менять не нужно. Хардкод этих чисел в `app/` и `src/` (кроме сида) отсутствует; перед правкой
перепроверить: `grep -rn "15[ _]\?840\|12[ _]\?480" app src`.

`src/core/placeholders.ts` **не трогать** (числа там намеренно захардкожены, к метрам спортсменов не относятся).

## 4. Ассеты

### 4.1 Зависимость и npm-скрипт

```bash
npm install --save-dev sharp
```

(`sharp` — инструмент сборки ассетов, в бандл приложения не попадает, поэтому `npm`, а не `npx expo install`.)

В `package.json` → `scripts`:

```json
"eagles": "node scripts/build-eagle-avatars.mjs"
```

### 4.2 `scripts/build-eagle-avatars.mjs`

Требования:

- Аргумент — путь к папке с исходниками (`npm run eagles -- ~/Downloads/орлы`). Без аргумента — ошибка с подсказкой.
- Берёт файлы `^(\d+)_.*\.png$`, `order = 11 − номер`. Проверяет, что найдено **ровно 10** файлов с номерами 1…10, иначе
  падает с понятной ошибкой (какого номера не хватает / какой лишний).
- Для каждого пишет в `assets/eagles/` (создать папку, если нет):
  - `eagle-NN.webp` — `resize(256, 256)` + `webp({ quality: 85 })`;
  - `eagle-NN-locked.webp` — то же + `.grayscale()`.
  - `NN` — `order` с ведущим нулём (`01`…`10`).
- Печатает таблицу «исходник → выходной файл → размер в КБ».

Набросок:

```js
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SIZE = 256;
const QUALITY = 85;
const OUT_DIR = path.resolve('assets/eagles');

const sourceDir = process.argv[2];
if (!sourceDir) {
  console.error('Использование: npm run eagles -- <папка с PNG орлов>');
  process.exit(1);
}

const files = (await readdir(sourceDir))
  .map((name) => ({ name, match: name.match(/^(\d+)_.*\.png$/i) }))
  .filter((item) => item.match);
const numbers = files.map((item) => Number(item.match[1])).sort((a, b) => a - b);
if (numbers.join() !== '1,2,3,4,5,6,7,8,9,10') {
  console.error(`Ожидались файлы 1_…png … 10_…png, найдено: ${numbers.join(', ')}`);
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });
for (const { name, match } of files) {
  const order = String(11 - Number(match[1])).padStart(2, '0');
  const input = sharp(path.join(sourceDir, name)).resize(SIZE, SIZE);
  await input.clone().webp({ quality: QUALITY }).toFile(path.join(OUT_DIR, `eagle-${order}.webp`));
  await input.clone().grayscale().webp({ quality: QUALITY }).toFile(path.join(OUT_DIR, `eagle-${order}-locked.webp`));
  console.log(`${name} → eagle-${order}.webp / eagle-${order}-locked.webp`);
}
```

### 4.3 Запуск и коммит

```bash
unzip ~/Downloads/орлы.zip -d ~/Downloads   # если папка ещё не распакована
npm run eagles -- ~/Downloads/орлы
```

Коммитим 20 файлов `assets/eagles/*.webp` (ожидаемо ~0,35 МБ суммарно; если сильно больше 1 МБ — снизить `quality`).
Исходные PNG в репозиторий не кладём.

## 5. Код

### 5.1 Реестр картинок — `src/components/features/eagleImages.ts`

```ts
import type { ImageSourcePropType } from 'react-native';

type EagleImageSet = { color: ImageSourcePropType; locked: ImageSourcePropType };

// Картинки по `order` уровня: 1 — Орёл I (слабейший), 10 — Орёл X (топ). Генерируются `npm run eagles`.
const eagleImages: Record<number, EagleImageSet> = {
  1: { color: require('../../../assets/eagles/eagle-01.webp'), locked: require('../../../assets/eagles/eagle-01-locked.webp') },
  // … 2–9 …
  10: { color: require('../../../assets/eagles/eagle-10.webp'), locked: require('../../../assets/eagles/eagle-10-locked.webp') },
};

export function getEagleImage(order: number, locked = false): ImageSourcePropType {
  const set = eagleImages[order] ?? eagleImages[1];
  return locked ? set.locked : set.color;
}
```

- `require` со статической строкой обязателен для Metro. Если `npm run lint` ругается на `require`
  (`@typescript-eslint/no-require-imports`), перейти на `import eagle01 from '…/eagle-01.webp'`; если `tsc` не знает
  модуль `*.webp` — проверить, что `expo-env.d.ts` подключает `expo/types`, иначе добавить `declare module '*.webp'`.
- Фолбэк на `order` 1 — на случай, если сервер вернёт уровень с неизвестным `order`.

### 5.2 Компонент — `src/components/features/EagleAvatar.tsx`

```tsx
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
```

Экспортировать из `src/components/features/` так же, как соседние компоненты (прямой импорт по пути, barrel у
`features` нет). Стиль — через `useTheme()`, как в остальных компонентах (есть светлая и тёмная темы).

### 5.3 Места использования

| Файл | Сейчас | Стало |
|---|---|---|
| `src/components/features/RankingRow.tsx` | `View` 32 px + `avatarInitials` | `<EagleAvatar meters={athlete.meters} size={32} />`. Удалить стили `avatar`, `avatarText`. Существующий `getEagleProgress(athlete.meters)` для подписи уровня оставить как есть. |
| `app/(app)/(tabs)/profile.tsx` | `avatarHero` 56 px + инициалы | `<EagleAvatar meters={profile.meters} size={56} />`. Удалить `avatarHero`, `avatarHeroText`. |
| `app/(app)/athlete/[id].tsx` | `avatar` 56 px + инициалы | `<EagleAvatar meters={profile.meters} size={56} />`. Удалить `avatar`, `avatarText`. |
| `app/(app)/(tabs)/more.tsx` | `avatar` 48 px, инициалы с фолбэком на имя | Если `athlete.data` есть — `<EagleAvatar meters={athlete.data.meters} size={48} />`, иначе пустой круг 48 px (`colors.highest`). Удалить `avatarText`. |
| `app/(app)/levels.tsx` | `symbol` 40 px, `radius.md`, иконка `Bird` | `<Image source={getEagleImage(item.order, item.order > current.order)} />` круг 40 px (`borderRadius: 20`) вместо `View`+`Bird`. Импорт `Bird` удалить, если больше не используется. Замок и бейджи справа — без изменений. |

Если после замены в каком-то из файлов перестал использоваться импорт (`Text`, `Bird`, стили) — удалить.
`EagleProgress.tsx` **не трогать**.

## 6. Тесты

### 6.1 `src/core/__tests__/eagleLevels.test.ts` (переписать)

- Граничные значения → `level.id`: `0→I`, `999→I`, `1_000→II`, `5_999→VI`, `7_999→VIII`, `8_000→IX`, `9_999→IX`,
  `10_000→X`, `160_000→X` (через `it.each`).
- Прогресс: `getEagleProgress(5_480)` → `{ progress: 48, remaining: 520 }`, уровень `VI`.
- Широкая ступень: `getEagleProgress(9_000)` → уровень `IX`, `progress: 50`, `remaining: 1_000`.
- Вершина: `getEagleProgress(10_000)` → `{ progress: 100, remaining: 0, next: null }`.
- Шкала непрерывна: для каждого уровня кроме последнего `next.minMeters === current.maxMeters + 1`; у последнего `maxMeters === null`; `order` = 1…10.
- Существующий тест `rankAthletes` оставить.

### 6.2 Сид (в `eagleLevels.test.ts` или `MockDataClient.test.ts`)

- Демо-спортсмен `a1` → уровень `VI`.
- Спортсмены сида дают **6 разных уровней** (`new Set(...).size === 6`).

### 6.3 `src/core/__tests__/MockDataClient.test.ts`

Тест миграции ключа: положить `eaglecode.mock.v1` **и** `eaglecode.mock.v2`, после загрузки оба `null`,
`eaglecode.mock.v3` не `null`.

### 6.4 `src/components/features/__tests__/eagleImages.test.ts` (новый)

- Для каждого `order` 1…10 `getEagleImage(order)` и `getEagleImage(order, true)` определены и отличаются друг от друга.
- Все 10 цветных источников различны.
- Неизвестный `order` (0, 11) → то же, что `getEagleImage(1)`.

### 6.5 `src/components/features/__tests__/EagleAvatar.test.tsx` (новый, RNTL)

- `jest.mock('@/hooks/useData', …)`: `useLevels` возвращает `{ data: undefined }` → для `meters: 5_480` у `Image`
  `source` равен `getEagleImage(6)`, `accessibilityLabel` = `Орёл VI — Лидер района` (фолбэк на локальную шкалу).
- `useLevels` возвращает `{ data: [] }` → тоже локальная шкала, без падения.
- `useLevels` возвращает кастомные уровни (например, старая серверная шкала с `IV` на 5 000–13 999) → выбирается
  картинка по ним (`getEagleImage(4)`).
- `size` пробрасывается в `width/height/borderRadius`.
- Обернуть в провайдер темы, если `useTheme()` без него падает (посмотреть, как это сделано в существующих тестах;
  если нет — замокать `@/theme/ThemeContext`).

Импорт `.webp` в jest: пресет `jest-expo`/`react-native` уже трансформирует картинки (включая `webp`) в заглушки.
Если нет — добавить в `jest.config.js` → `moduleNameMapper` правило `'\\.(webp)$'` на файл-заглушку.

## 7. Порядок выполнения

1. `npm install --save-dev sharp`, скрипт `scripts/build-eagle-avatars.mjs`, npm-скрипт `eagles` (§4).
2. `npm run eagles -- ~/Downloads/орлы`, проверить 20 файлов в `assets/eagles/` и их вес.
3. `src/core/eagleLevels.ts` — новые пороги (§3.1).
4. `src/core/MockDataClient.ts` — ключ `v3` (§3.2).
5. `src/core/seed.ts` — метры (§3.3).
6. `eagleImages.ts` + `EagleAvatar.tsx` (§5.1–5.2).
7. Замена в 5 местах (§5.3).
8. Тесты (§6).
9. `npm run typecheck && npm run lint && npm test` — всё зелёное.

## 8. Ручная проверка (mock-режим)

`npm start`, войти `athlete@eaglecode.ru` / `demo123`. Ключ `v3` сбросит старую mock-базу автоматически.

- **Рейтинг**: 6 разных орлов по порядку (X, IX, VIII, VI, IV, II), кружки 32 px без искажений.
- **Профиль**: орёл VI (Беркут) 56 px; «Прогресс орла» — «Орёл VI — Лидер района», 48 %, «до уровня Орёл VII осталось 520 м».
- **Чужой профиль** (тап по строке рейтинга): орёл соответствует метрам.
- **Ещё**: орёл 48 px в шапке, без мелькания инициалов.
- **Уровни Орла**: I–VI цветные (VI — текущий), VII–X ч/б с замком.
- Обе темы (светлая/тёмная): фон под картинкой и маска выглядят нормально.
- iOS и Android: WebP отображается.

## 9. TODO вне этой задачи (веб и сервер)

После этой задачи мобилка расходится с вебом и сервером по порогам уровней:

- `../EagleCode/src/domain/eagleLevels.ts` — те же пороги, что в §3.1.
- Django: обновить данные уровней (миграция данных / фикстура / `seed_demo.py`), чтобы `GET /levels` отдавал новую шкалу.
- Пока сервер не обновлён, в api-режиме орлы назначаются по старой серверной шкале (0–150 000) — код мобилки
  от этого не ломается, `EagleAvatar` просто использует пришедшие пороги.
