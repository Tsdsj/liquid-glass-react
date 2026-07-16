import { describe, expect, it } from 'vitest';
import {
  buildTimeColumn,
  clampTime,
  compareTime,
  formatTime,
  parseTime,
} from './time';

describe('parseTime', () => {
  it('parses HH:mm and HH:mm:ss', () => {
    expect(parseTime('09:30', 'HH:mm')).toEqual({ hours: 9, minutes: 30, seconds: 0 });
    expect(parseTime('23:59:58', 'HH:mm:ss')).toEqual({ hours: 23, minutes: 59, seconds: 58 });
  });

  it('rejects malformed or out-of-range strings', () => {
    expect(parseTime('24:00', 'HH:mm')).toBeNull();
    expect(parseTime('10:60', 'HH:mm')).toBeNull();
    expect(parseTime('nope', 'HH:mm')).toBeNull();
    expect(parseTime('09:30', 'HH:mm:ss')).toBeNull();
  });
});

describe('formatTime', () => {
  it('zero-pads to the requested format', () => {
    expect(formatTime({ hours: 9, minutes: 5, seconds: 0 }, 'HH:mm')).toBe('09:05');
    expect(formatTime({ hours: 9, minutes: 5, seconds: 7 }, 'HH:mm:ss')).toBe('09:05:07');
  });
});

describe('buildTimeColumn', () => {
  it('lists values under the cap on the given step', () => {
    expect(buildTimeColumn(24, 1)).toHaveLength(24);
    expect(buildTimeColumn(60, 15)).toEqual([0, 15, 30, 45]);
  });
});

describe('compareTime / clampTime', () => {
  it('orders times by total seconds', () => {
    expect(compareTime('09:00', '10:00')).toBeLessThan(0);
    expect(compareTime('10:00:05', '10:00:04')).toBeGreaterThan(0);
    expect(compareTime('08:30', '08:30')).toBe(0);
  });

  it('clamps to the min/max window', () => {
    expect(clampTime('07:00', '09:00', '18:00', 'HH:mm')).toBe('09:00');
    expect(clampTime('20:00', '09:00', '18:00', 'HH:mm')).toBe('18:00');
    expect(clampTime('12:00', '09:00', '18:00', 'HH:mm')).toBe('12:00');
    expect(clampTime('12:00', undefined, undefined, 'HH:mm')).toBe('12:00');
  });
});
