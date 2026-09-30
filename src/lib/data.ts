// توابع تاریخ و زمان با timezone Asia/Tehran

const TEHRAN_OFFSET_MINUTES = 3 * 60 + 30; // +03:30

export function nowInTehran(): Date {
  const now = new Date();
  return new Date(now.getTime() + TEHRAN_OFFSET_MINUTES * 60 * 1000);
}

export function startOfTodayTehran(): Date {
  const t = nowInTehran();
  const y = t.getUTCFullYear();
  const m = t.getUTCMonth();
  const d = t.getUTCDate();
  // start of day in Tehran, but returned as a real UTC Date
  const startTehranUTC = Date.UTC(y, m, d, 0, 0, 0);
  return new Date(startTehranUTC - TEHRAN_OFFSET_MINUTES * 60 * 1000);
}

export function endOfTodayTehran(): Date {
  const start = startOfTodayTehran();
  return new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
}

export function startOfTomorrowTehran(): Date {
  const start = startOfTodayTehran();
  return new Date(start.getTime() + 24 * 60 * 60 * 1000);
}

export function endOfTomorrowTehran(): Date {
  const start = startOfTomorrowTehran();
  return new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export function toPersianDate(date: Date): string {
  try {
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      timeZone: "Asia/Tehran",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

export function toPersianDateTime(date: Date): string {
  try {
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      timeZone: "Asia/Tehran",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

export function toPersianTime(date: Date): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      timeZone: "Asia/Tehran",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return date.toISOString().slice(11, 16);
  }
}
