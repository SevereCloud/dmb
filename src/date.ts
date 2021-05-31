import type { DatePickerDateFormat } from '@vkontakte/vkui';

export const getTime = (d: DatePickerDateFormat): number => {
  return new Date(d.year, d.month - 1, d.day).getTime() / 1000;
};

export const getDate = (t: number): string => {
  const date = new Date(t * 1000);

  return date.toLocaleDateString('ru', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const getDays = (date1: Date, date2: Date): number => {
  const one_day = 1000 * 60 * 60 * 24; // Get 1 day in milliseconds

  return Math.floor((date2.getTime() - date1.getTime()) / one_day);
};

export const getWeeks = (date1: Date, date2: Date): number => {
  const one_week = 1000 * 60 * 60 * 24 * 7; // Get 1 week in milliseconds

  return Math.floor((date2.getTime() - date1.getTime()) / one_week);
};

export const daysLeft = (n: number): number => {
  return getDays(new Date(), new Date(n * 1000));
};

export const getDayName = (n: number): string => {
  return numberCase(n, 'день', 'дня', 'дней');
};

export const numberCase = (
  n: number,
  nominative: string,
  genitive_singular: string,
  genitive_plural?: string,
): string => {
  if (!genitive_plural) genitive_plural = genitive_singular;

  // 11 дней - 14 дней
  if (n >= 11 && n <= 14) return genitive_plural;

  const lastDiget = n % 10;

  // ..1 день
  if (lastDiget === 1) return nominative;

  // ..2 ..3 ..4 дня
  if (lastDiget >= 2 && lastDiget <= 4) return genitive_singular;

  // ..5 ..6 ..7 ..8 ..9 ..0 дней
  return genitive_plural;
};
