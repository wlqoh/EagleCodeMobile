export function formatMeters(value: number): string {
  return `${value.toLocaleString('ru-RU')} м`;
}

export function formatDate(value: string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(value).toLocaleDateString(
    'ru-RU',
    options ?? { day: 'numeric', month: 'long', year: 'numeric' },
  );
}
