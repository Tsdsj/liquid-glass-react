import { describe, expect, it } from 'vitest';
import {
  addDays,
  addMonths,
  buildMonthGrid,
  clampDate,
  daysInMonth,
  formatDate,
  inRange,
  isLeapYear,
  isSameDay,
  parseDate,
} from './date';

describe('isLeapYear / daysInMonth', () => {
  it('applies the Gregorian leap rule', () => {
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2023)).toBe(false);
  });

  it('counts days per month including February', () => {
    expect(daysInMonth(2024, 1)).toBe(29);
    expect(daysInMonth(2023, 1)).toBe(28);
    expect(daysInMonth(2024, 0)).toBe(31);
    expect(daysInMonth(2024, 3)).toBe(30);
  });
});

describe('buildMonthGrid', () => {
  it('always returns 42 cells (6 weeks)', () => {
    expect(buildMonthGrid(2024, 0, 1)).toHaveLength(42);
  });

  it('aligns the first cell to weekStartsOn', () => {
    // 2024-01-01 is a Monday.
    const mondayStart = buildMonthGrid(2024, 0, 1);
    expect(isSameDay(mondayStart[0], new Date(2024, 0, 1))).toBe(true);

    const sundayStart = buildMonthGrid(2024, 0, 0);
    expect(isSameDay(sundayStart[0], new Date(2023, 11, 31))).toBe(true);
  });

  it('fills trailing cells from the next month', () => {
    const grid = buildMonthGrid(2024, 0, 1);
    expect(isSameDay(grid[41], new Date(2024, 1, 11))).toBe(true);
  });
});

describe('addDays / addMonths', () => {
  it('adds days across a month boundary', () => {
    expect(isSameDay(addDays(new Date(2024, 0, 31), 1), new Date(2024, 1, 1))).toBe(true);
  });

  it('clamps the day when the target month is shorter', () => {
    expect(isSameDay(addMonths(new Date(2024, 0, 31), 1), new Date(2024, 1, 29))).toBe(true);
    expect(isSameDay(addMonths(new Date(2023, 0, 31), 1), new Date(2023, 1, 28))).toBe(true);
  });
});

describe('format / parse round trip', () => {
  it('formats with default and custom tokens', () => {
    expect(formatDate(new Date(2024, 0, 5))).toBe('2024-01-05');
    expect(formatDate(new Date(2024, 0, 5), 'YYYY/MM/DD')).toBe('2024/01/05');
  });

  it('parses valid strings and rejects impossible or malformed ones', () => {
    expect(isSameDay(parseDate('2024-01-05')!, new Date(2024, 0, 5))).toBe(true);
    expect(parseDate('2024-02-30')).toBeNull();
    expect(parseDate('nope')).toBeNull();
  });
});

describe('comparison helpers', () => {
  it('isSameDay ignores time of day', () => {
    expect(isSameDay(new Date(2024, 0, 1, 9), new Date(2024, 0, 1, 23))).toBe(true);
    expect(isSameDay(new Date(2024, 0, 1), new Date(2024, 0, 2))).toBe(false);
  });

  it('inRange and clampDate honour min/max by day', () => {
    const min = new Date(2024, 0, 10);
    const max = new Date(2024, 0, 20);
    expect(inRange(new Date(2024, 0, 15), min, max)).toBe(true);
    expect(inRange(new Date(2024, 0, 5), min, max)).toBe(false);
    expect(isSameDay(clampDate(new Date(2024, 0, 5), min, max), min)).toBe(true);
    expect(isSameDay(clampDate(new Date(2024, 0, 25), min, max), max)).toBe(true);
  });
});
