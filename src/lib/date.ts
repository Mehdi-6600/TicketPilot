const TEHRAN_OFFSET_MINUTES = 3 * 60 + 30;

export function nowInTehran(): Date {
  const now = new Date();
  return new Date(now.getTime() + TEHRAN_OFFSET_MINUTES * 60 * 1000);
}

export function startOfTodayTehran(): Date {
  const t = nowInTehran();
  const y = t.getUTCFullYear();
  const m = t.getUTCMonth();
  const d = t.getUTCDate();
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

// تبدیل input datetime-local (YYYY-MM-DDTHH:mm) به Date UTC
// input در timezone Tehran تفسیر میشه
export function parseTehranInput(value: string): Date {
  if (!value) return new Date();
  // YYYY-MM-DDTHH:mm
  const [datePart, timePart] = value.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = (timePart ?? "00:00").split(":").map(Number);
  const utcMs = Date.UTC(y, m - 1, d, hh, mm, 0);
  return new Date(utcMs - TEHRAN_OFFSET_MINUTES * 60 * 1000);
}

// تبدیل Date به مقدار input datetime-local در timezone Tehran
export function toTehranInputValue(date: Date): string {
  const t = new Date(date.getTime() + TEHRAN_OFFSET_MINUTES * 60 * 1000);
  const y = t.getUTCFullYear();
  const m = String(t.getUTCMonth() + 1).padStart(2, "0");
  const d = String(t.getUTCDate()).padStart(2, "0");
  const hh = String(t.getUTCHours()).padStart(2, "0");
  const mm = String(t.getUTCMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${hh}:${mm}`;
}
