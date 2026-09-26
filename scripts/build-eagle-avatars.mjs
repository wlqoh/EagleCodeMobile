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

const entries = await readdir(sourceDir);
const files = entries
  .map((name) => ({ name, match: name.match(/^(\d+)_.*\.png$/i) }))
  .filter((item) => item.match);

const numbers = files.map((item) => Number(item.match[1])).sort((a, b) => a - b);
const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const missing = expected.filter((n) => !numbers.includes(n));
const extra = numbers.filter((n) => !expected.includes(n));
if (numbers.length !== 10 || missing.length || extra.length) {
  console.error(
    `Ожидались файлы 1_…png … 10_…png (ровно 10 штук), найдено: ${numbers.join(', ') || 'ничего'}.` +
      (missing.length ? ` Не хватает: ${missing.join(', ')}.` : '') +
      (extra.length ? ` Лишние номера: ${extra.join(', ')}.` : ''),
  );
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });

const rows = [];
for (const { name, match } of files) {
  const order = String(11 - Number(match[1])).padStart(2, '0');
  const input = sharp(path.join(sourceDir, name)).resize(SIZE, SIZE);

  const colorPath = path.join(OUT_DIR, `eagle-${order}.webp`);
  const lockedPath = path.join(OUT_DIR, `eagle-${order}-locked.webp`);

  const colorInfo = await input.clone().webp({ quality: QUALITY }).toFile(colorPath);
  const lockedInfo = await input.clone().grayscale().webp({ quality: QUALITY }).toFile(lockedPath);

  rows.push([name, `eagle-${order}.webp`, `${(colorInfo.size / 1024).toFixed(1)} КБ`]);
  rows.push([name, `eagle-${order}-locked.webp`, `${(lockedInfo.size / 1024).toFixed(1)} КБ`]);
}

console.log('Исходник → выходной файл → размер');
for (const [source, output, size] of rows) {
  console.log(`${source} → ${output} → ${size}`);
}
