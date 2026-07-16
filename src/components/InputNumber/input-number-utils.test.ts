import { describe, expect, it } from 'vitest';
import { applyPrecision, clampNumber, parseNumericInput, stepValue } from './input-number-utils';

describe('parseNumericInput', () => {
  it('parses plain and signed decimals', () => {
    expect(parseNumericInput('42')).toBe(42);
    expect(parseNumericInput('-3.5')).toBe(-3.5);
    expect(parseNumericInput('  7 ')).toBe(7);
  });

  it('returns null for empty or non-numeric text', () => {
    expect(parseNumericInput('')).toBeNull();
    expect(parseNumericInput('abc')).toBeNull();
    expect(parseNumericInput('1.2.3')).toBeNull();
  });
});

describe('clampNumber / applyPrecision', () => {
  it('clamps to the given bounds', () => {
    expect(clampNumber(5, 0, 10)).toBe(5);
    expect(clampNumber(-1, 0, 10)).toBe(0);
    expect(clampNumber(11, 0, 10)).toBe(10);
    expect(clampNumber(11, undefined, undefined)).toBe(11);
  });

  it('rounds to the given precision and fixes float drift', () => {
    expect(applyPrecision(1.005, 2)).toBe(1.01);
    expect(applyPrecision(1.2345, 2)).toBe(1.23);
    expect(applyPrecision(1.2345, undefined)).toBe(1.2345);
    expect(applyPrecision(0.1 + 0.2, 1)).toBe(0.3);
  });
});

describe('stepValue', () => {
  it('steps from the current value with clamping', () => {
    expect(stepValue(5, 1, 2, 0, 10, undefined)).toBe(7);
    expect(stepValue(9, 1, 2, 0, 10, undefined)).toBe(10);
    expect(stepValue(1, -1, 2, 0, 10, undefined)).toBe(0);
  });

  it('starts from min (or 0) when there is no value yet', () => {
    expect(stepValue(null, 1, 1, 5, 10, undefined)).toBe(6);
    expect(stepValue(null, 1, 1, undefined, undefined, undefined)).toBe(1);
    expect(stepValue(null, -1, 1, undefined, undefined, undefined)).toBe(-1);
  });

  it('applies precision to avoid float drift while stepping', () => {
    expect(stepValue(0.1, 1, 0.2, undefined, undefined, 1)).toBe(0.3);
  });
});
