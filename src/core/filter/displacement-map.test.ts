import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  __resetDisplacementMapCache,
  computeDisplacementPixels,
  makeDisplacementMap,
} from './displacement-map';

function channel(
  pixels: Uint8ClampedArray,
  width: number,
  x: number,
  y: number,
  offset: 0 | 1,
): number {
  return pixels[(y * width + x) * 4 + offset] ?? 0;
}

describe('computeDisplacementPixels', () => {
  it('keeps the center and pixels beyond the bezel neutral', () => {
    const width = 21;
    const pixels = computeDisplacementPixels(width, 21, 5, 4);

    expect(channel(pixels, width, 10, 10, 0)).toBe(128);
    expect(channel(pixels, width, 10, 10, 1)).toBe(128);
    expect(channel(pixels, width, 10, 6, 0)).toBe(128);
    expect(channel(pixels, width, 10, 6, 1)).toBe(128);
  });

  it('encodes inward displacement at each edge midpoint', () => {
    const width = 21;
    const height = 21;
    const pixels = computeDisplacementPixels(width, height, 5, 5);

    expect(channel(pixels, width, 0, 10, 0)).toBeGreaterThan(128);
    expect(channel(pixels, width, width - 1, 10, 0)).toBeLessThan(128);
    expect(channel(pixels, width, 10, 0, 1)).toBeGreaterThan(128);
    expect(channel(pixels, width, 10, height - 1, 1)).toBeLessThan(128);
  });
});

describe('makeDisplacementMap', () => {
  class CountingOffscreenCanvas {
    static instances = 0;

    constructor(
      public width: number,
      public height: number,
    ) {
      CountingOffscreenCanvas.instances += 1;
    }

    getContext(contextId: string) {
      if (contextId !== '2d') {
        return null;
      }

      return {
        createImageData: (width: number, height: number) => ({
          width,
          height,
          colorSpace: 'srgb',
          data: new Uint8ClampedArray(width * height * 4),
        }),
        putImageData: () => undefined,
      };
    }

    toDataURL(): string {
      return `data:image/png;base64,${this.width}x${this.height}`;
    }
  }

  beforeEach(() => {
    __resetDisplacementMapCache();
    CountingOffscreenCanvas.instances = 0;
    vi.stubGlobal('OffscreenCanvas', CountingOffscreenCanvas);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reuses the cached data URI for identical geometry', () => {
    const first = makeDisplacementMap(100, 60, 14, 12);
    const second = makeDisplacementMap(100, 60, 14, 12);

    expect(first).toBe(second);
    expect(CountingOffscreenCanvas.instances).toBe(1);
  });
});
