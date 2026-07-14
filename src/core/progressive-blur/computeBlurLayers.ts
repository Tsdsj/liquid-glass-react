export interface BlurLayer {
  /** backdrop-filter blur radius in px for this layer. */
  blur: number;
  /** Mask plateau start as a fraction [0,1] along the weak→strong axis. */
  maskStart: number;
  /** Mask plateau end as a fraction [0,1]. */
  maskEnd: number;
}

const MIN_LAYERS = 3;
const MAX_LAYERS = 8;

function round(value: number): number {
  return Math.round(value * 1e4) / 1e4;
}

/**
 * Splits a progressive-blur region into `layers` stacked bands. Blur grows
 * geometrically (×2) so the last layer reaches `maxBlur`; each band's opaque
 * mask plateau [maskStart, maskEnd] overlaps its neighbours by half a band so
 * the depth transitions blend instead of stepping.
 *
 * Direction-agnostic: fractions run from the weak-blur side (0) to the
 * strong-blur side (1); the consumer maps that onto a CSS gradient axis.
 */
export function computeBlurLayers(maxBlur: number, layers: number): BlurLayer[] {
  const count = Math.min(MAX_LAYERS, Math.max(MIN_LAYERS, Math.round(layers)));
  const overlap = 1 / (count * 2);
  const result: BlurLayer[] = [];

  for (let index = 0; index < count; index += 1) {
    const blur = maxBlur / 2 ** (count - 1 - index);
    const bandStart = index / count;
    const bandEnd = (index + 1) / count;
    result.push({
      blur: round(blur),
      maskStart: round(Math.max(0, bandStart - overlap)),
      maskEnd: round(Math.min(1, bandEnd + overlap)),
    });
  }

  return result;
}
