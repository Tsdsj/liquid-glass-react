'use client';
import { useMediaQuery } from './provider.js';

/**
 * The width class the layout is in.
 *
 * The HIG's layout page is unambiguous about this: decide a layout from the size class,
 * never from the device type or the orientation. A phone in landscape, a tablet in a
 * split-screen slot and a small desktop window are the same problem, and asking "is this an
 * iPad" gets all three wrong.
 *
 * On the web the two classes are a width: compact below 768px, regular at or above it.
 */
export type SizeClass = 'compact' | 'regular';

/** The breakpoint, exported so a caller can write the same query in CSS without guessing. */
export const REGULAR_MIN_WIDTH = 768;

/**
 * `'compact'` on the server, where there is no width to measure, and again for the first
 * client render before hydration; it settles on the real class immediately after. Compact is
 * the honest guess: it is the layout that fits inside the other one, so a wide window reflows
 * outwards rather than a narrow one overflowing. Anything whose server markup must not move
 * should be driven by a CSS media query instead, which resolves before the first paint.
 */
export function useSizeClass(): SizeClass {
  return useMediaQuery(`(min-width: ${REGULAR_MIN_WIDTH}px)`) ? 'regular' : 'compact';
}
