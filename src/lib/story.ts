import { daysLeft, getDate, getDays, numberCase } from '../date';
import type { Timer } from '../types';

export const sharedLink = (timer: Timer): string => {
  const base = 'https://vk.com/app7867602#shared&';
  const params = new URLSearchParams({
    title: timer.title,
    s: timer.start_date.toString(),
    e: timer.end_date.toString(),
  });

  return base + params.toString();
};

export const storyDefault = (timer: Timer): string => {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;

  const c = canvas.getContext('2d');
  if (!c) return '';
  c.fillStyle = '#fff';
  c.fillRect(0, 0, canvas.width, canvas.height);

  c.fillStyle = 'black';
  c.font = 'bold ' + 108 + 'px Roboto ';
  c.fillText(timer.title, 96, 300);

  c.fillStyle = '#818c99';
  c.font = 'bold ' + 48 + 'px Roboto ';
  c.fillText(getDate(timer.end_date), 96, 370);

  const now_time = new Date().getTime() / 1000;
  const n =
    now_time < timer.end_date
      ? daysLeft(timer.end_date)
      : getDays(new Date(timer.end_date * 1000), new Date());

  const desc =
    now_time < timer.end_date
      ? `${numberCase(n, 'День', 'Дня', 'Дней')} до дембеля`
      : `${numberCase(n, 'День', 'Дня', 'Дней')} после дембеля`;

  const count = n.toString();
  c.fillStyle = 'black';
  c.font = '900 ' + 336 + 'px Roboto ';
  c.fillText(
    count,
    canvas.width / 2 - c.measureText(count).width / 2,
    canvas.height / 2 + 100,
  );

  c.fillStyle = '#818c99';
  c.font = '700 ' + 72 + 'px Roboto ';
  c.fillText(
    desc,
    canvas.width / 2 - c.measureText(desc).width / 2,
    canvas.height / 2 + 200,
  );

  return canvas.toDataURL();
};
