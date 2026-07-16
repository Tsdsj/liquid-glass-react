/** Strict decimal parse: trimmed text → number, or null when not a number. */
export function parseNumericInput(text: string): number | null {
  const trimmed = text.trim();
  if (trimmed === '' || !/^-?\d*\.?\d+$/.test(trimmed)) {
    return null;
  }
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

export function clampNumber(value: number, min?: number, max?: number): number {
  if (min !== undefined && value < min) {
    return min;
  }
  if (max !== undefined && value > max) {
    return max;
  }
  return value;
}

/**
 * Round to `precision` decimals, absorbing binary float drift (0.1+0.2 → 0.3,
 * 1.005 → 1.01). Shifts the decimal point in the string exponent instead of
 * multiplying, so the shift itself introduces no binary error.
 */
export function applyPrecision(value: number, precision?: number): number {
  if (precision === undefined) {
    return value;
  }
  const shifted = Math.round(Number(`${value}e${precision}`));
  return Number(`${shifted}e-${precision}`);
}

/**
 * One keyboard/stepper increment: steps from the current value (or from min ?? 0
 * when empty), then rounds and clamps. Precision falls back to the step's own
 * decimal places so 0.1 + 0.2 style drift never leaks into the field.
 */
export function stepValue(
  current: number | null,
  direction: 1 | -1,
  step: number,
  min: number | undefined,
  max: number | undefined,
  precision: number | undefined,
): number {
  const base = current ?? min ?? 0;
  const stepDecimals = `${step}`.split('.')[1]?.length ?? 0;
  const next = applyPrecision(base + direction * step, precision ?? stepDecimals);
  return clampNumber(next, min, max);
}
