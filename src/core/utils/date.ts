// Self-contained Gregorian date helpers — no dayjs/date-fns (AGENTS: no runtime
// deps). All comparisons work at day granularity (time of day is ignored).

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** month is 0-based (0 = January). */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function dayValue(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function isSameDay(a: Date, b: Date): boolean {
  return dayValue(a) === dayValue(b);
}

export function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

/** Adds months, clamping the day when the target month is shorter. */
export function addMonths(date: Date, amount: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const maxDay = daysInMonth(target.getFullYear(), target.getMonth());
  target.setDate(Math.min(date.getDate(), maxDay));
  return target;
}

export function inRange(date: Date, min?: Date, max?: Date): boolean {
  const value = dayValue(date);
  if (min && value < dayValue(min)) {
    return false;
  }
  if (max && value > dayValue(max)) {
    return false;
  }
  return true;
}

export function clampDate(date: Date, min?: Date, max?: Date): Date {
  if (min && dayValue(date) < dayValue(min)) {
    return min;
  }
  if (max && dayValue(date) > dayValue(max)) {
    return max;
  }
  return date;
}

/**
 * A fixed 42-cell (6 weeks × 7 days) grid for the given month, with leading and
 * trailing cells drawn from the adjacent months and the first column aligned to
 * `weekStartsOn` (0 = Sunday, 1 = Monday).
 */
export function buildMonthGrid(year: number, month: number, weekStartsOn: 0 | 1 = 1): Date[] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const offset = (firstWeekday - weekStartsOn + 7) % 7;
  const grid: Date[] = [];
  for (let i = 0; i < 42; i += 1) {
    grid.push(new Date(year, month, 1 - offset + i));
  }
  return grid;
}

export function formatDate(date: Date, format = 'YYYY-MM-DD'): string {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return format.replace('YYYY', year).replace('MM', month).replace('DD', day);
}

/**
 * Parse against a token format (default `YYYY-MM-DD`). Returns null when the
 * string doesn't match or encodes an impossible date (e.g. 2024-02-30).
 */
export function parseDate(input: string, format = 'YYYY-MM-DD'): Date | null {
  const tokens: string[] = [];
  const pattern = format.replace(/YYYY|MM|DD/g, (token) => {
    tokens.push(token);
    return token === 'YYYY' ? '(\\d{4})' : '(\\d{2})';
  });
  const match = new RegExp(`^${pattern}$`).exec(input.trim());
  if (!match) {
    return null;
  }
  let year = 1970;
  let month = 0;
  let day = 1;
  tokens.forEach((token, index) => {
    const value = Number(match[index + 1]);
    if (token === 'YYYY') {
      year = value;
    } else if (token === 'MM') {
      month = value - 1;
    } else {
      day = value;
    }
  });
  const date = new Date(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return null;
  }
  return date;
}
