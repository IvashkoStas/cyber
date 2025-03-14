import { formatInTimeZone } from 'date-fns-tz';

export function getTransactionTime(createdAt: string | Date): string {
  const date = new Date(createdAt);
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

  return formatInTimeZone(date, timeZone, 'HH:mm');
}


export function getDay(d: string | Date): string {
  const date = new Date(d);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'today';
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return 'yesterday';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}
