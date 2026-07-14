export interface AmbientSampleOptions {
  /** 'average' = whole-image mean; 'edge' = border-weighted (default; means gray out). */
  strategy?: 'average' | 'edge';
  /** Output alpha — --lg-ambient wants a low value. Default 0.16. */
  alpha?: number;
}

const DEFAULT_ALPHA = 0.16;

function edgeWeight(x: number, y: number, width: number, height: number): number {
  const nx = width <= 1 ? 0 : Math.abs(x / (width - 1) - 0.5) * 2;
  const ny = height <= 1 ? 0 : Math.abs(y / (height - 1) - 0.5) * 2;
  return Math.max(nx, ny);
}

/**
 * Reduces raw RGBA pixels to a single low-alpha ambient colour string for
 * `--lg-ambient`. The edge strategy weights border pixels (what visually
 * surrounds the glass) so the result doesn't average toward mud.
 */
export function computeAmbientColor(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  options?: AmbientSampleOptions,
): string {
  const alpha = options?.alpha ?? DEFAULT_ALPHA;
  const strategy = options?.strategy ?? 'edge';

  if (width <= 0 || height <= 0 || data.length < 4) {
    return 'transparent';
  }

  let rSum = 0;
  let gSum = 0;
  let bSum = 0;
  let totalWeight = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const pixelAlpha = data[index + 3] / 255;
      if (pixelAlpha === 0) {
        continue;
      }
      const weight =
        pixelAlpha * (strategy === 'edge' ? edgeWeight(x, y, width, height) : 1);
      if (weight === 0) {
        continue;
      }
      rSum += data[index] * weight;
      gSum += data[index + 1] * weight;
      bSum += data[index + 2] * weight;
      totalWeight += weight;
    }
  }

  if (totalWeight === 0) {
    return 'transparent';
  }

  const r = Math.round(rSum / totalWeight);
  const g = Math.round(gSum / totalWeight);
  const b = Math.round(bSum / totalWeight);
  return `rgb(${r} ${g} ${b} / ${alpha})`;
}
