// Self-written time helpers for TimePicker (no dayjs). Time is a plain
// { hours, minutes, seconds } record or an 'HH:mm' / 'HH:mm:ss' string; there
// is no date/timezone component on purpose.

export type TimeFormat = 'HH:mm' | 'HH:mm:ss';

export interface TimeParts {
  hours: number;
  minutes: number;
  seconds: number;
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

/** Parse against a format; null when the shape or any field is out of range. */
export function parseTime(input: string, format: TimeFormat): TimeParts | null {
  const wantsSeconds = format === 'HH:mm:ss';
  const pattern = wantsSeconds ? /^(\d{2}):(\d{2}):(\d{2})$/ : /^(\d{2}):(\d{2})$/;
  const match = pattern.exec(input.trim());
  if (!match) {
    return null;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = wantsSeconds ? Number(match[3]) : 0;
  if (hours > 23 || minutes > 59 || seconds > 59) {
    return null;
  }
  return { hours, minutes, seconds };
}

export function formatTime(parts: TimeParts, format: TimeFormat): string {
  const base = `${pad2(parts.hours)}:${pad2(parts.minutes)}`;
  return format === 'HH:mm:ss' ? `${base}:${pad2(parts.seconds)}` : base;
}

/** Column values `[0, step, 2·step, …]` strictly under `cap` (e.g. 24 hours). */
export function buildTimeColumn(cap: number, step: number): number[] {
  const values: number[] = [];
  for (let value = 0; value < cap; value += step) {
    values.push(value);
  }
  return values;
}

function toSeconds(time: string): number {
  const [h = 0, m = 0, s = 0] = time.split(':').map(Number);
  return h * 3600 + m * 60 + s;
}

export function compareTime(a: string, b: string): number {
  return toSeconds(a) - toSeconds(b);
}

/** Clamp a time string into [min, max] (either bound optional), same format out. */
export function clampTime(
  value: string,
  min: string | undefined,
  max: string | undefined,
  format: TimeFormat,
): string {
  const parsed = parseTime(value, format);
  if (!parsed) {
    return value;
  }
  if (min && compareTime(value, min) < 0) {
    return min;
  }
  if (max && compareTime(value, max) > 0) {
    return max;
  }
  return value;
}
