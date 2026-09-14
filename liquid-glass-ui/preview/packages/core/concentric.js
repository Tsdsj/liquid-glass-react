function nonNegative(x, name) {
    if (!Number.isFinite(x) || x < 0)
        throw new RangeError(`${name} must be finite and nonnegative`);
    return x;
}
export function concentricRadius(containerRadius, inset, options = {}) {
    nonNegative(containerRadius, 'containerRadius');
    nonNegative(inset, 'inset');
    const minimum = nonNegative(options.minimum ?? 0, 'minimum');
    const maximum = options.maximum === undefined ? Infinity : nonNegative(options.maximum, 'maximum');
    if (maximum < minimum)
        throw new RangeError('maximum must be at least minimum');
    return Math.min(maximum, Math.max(minimum, containerRadius - inset));
}
/** The padding that would make a child of `childRadius` concentric inside `containerRadius`. */
export function concentricInset(containerRadius, childRadius) {
    nonNegative(containerRadius, 'containerRadius');
    nonNegative(childRadius, 'childRadius');
    return Math.max(0, containerRadius - childRadius);
}
/** Capsule radius for a control of this height: exactly half, never a fixed guess. */
export function capsuleRadius(height) {
    return nonNegative(height, 'height') / 2;
}
