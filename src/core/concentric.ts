/**
 * Concentric corner radii (WWDC25/356, SwiftUI `ConcentricRectangle`).
 *
 * A shape nested inside a rounded container must share its centre of curvature:
 * inner radius = container radius − the padding between them. Getting it wrong is
 * visible — too large reads as a *pinched* corner, too small as a *flared* one.
 * Components that also appear standalone pass a `minimum` so they keep a sane
 * radius when there is no container to be concentric with.
 */
export interface ConcentricOptions {
  /** Fallback radius when the container radius is unknown or the result would collapse. */
  minimum?: number;
  /** Upper bound, typically half the shorter side of the child. */
  maximum?: number;
}
function nonNegative(x: number, name: string): number {
  if (!Number.isFinite(x) || x < 0) throw new RangeError(`${name} must be finite and nonnegative`);
  return x;
}
export function concentricRadius(containerRadius: number, inset: number, options: ConcentricOptions = {}): number {
  nonNegative(containerRadius, 'containerRadius');
  nonNegative(inset, 'inset');
  const minimum = nonNegative(options.minimum ?? 0, 'minimum');
  const maximum = options.maximum === undefined ? Infinity : nonNegative(options.maximum, 'maximum');
  if (maximum < minimum) throw new RangeError('maximum must be at least minimum');
  return Math.min(maximum, Math.max(minimum, containerRadius - inset));
}
/** The padding that would make a child of `childRadius` concentric inside `containerRadius`. */
export function concentricInset(containerRadius: number, childRadius: number): number {
  nonNegative(containerRadius, 'containerRadius');
  nonNegative(childRadius, 'childRadius');
  return Math.max(0, containerRadius - childRadius);
}
/** Capsule radius for a control of this height: exactly half, never a fixed guess. */
export function capsuleRadius(height: number): number {
  return nonNegative(height, 'height') / 2;
}
