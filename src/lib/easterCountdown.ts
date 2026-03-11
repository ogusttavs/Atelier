export interface EasterCountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isEasterDay: boolean;
  targetDate: Date;
}

function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

function isSameCalendarDate(left: Date, right: Date): boolean {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function getCurrentOrNextEaster(now: Date): Date {
  const currentYearEaster = getEasterDate(now.getFullYear());
  const easterEnd = new Date(currentYearEaster);
  easterEnd.setHours(23, 59, 59, 999);

  if (now <= easterEnd) {
    return currentYearEaster;
  }

  return getEasterDate(now.getFullYear() + 1);
}

export function getEasterCountdownState(now: Date): EasterCountdownState {
  const targetDate = getCurrentOrNextEaster(now);
  const isEasterDay = isSameCalendarDate(now, targetDate);
  const diffMs = Math.max(targetDate.getTime() - now.getTime(), 0);

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    isEasterDay,
    targetDate,
  };
}
