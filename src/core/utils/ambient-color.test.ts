import { describe, expect, it } from 'vitest';
import { computeAmbientColor } from './ambient-color';

function uniform(width: number, height: number, rgb: [number, number, number]): Uint8ClampedArray {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    data[i * 4] = rgb[0];
    data[i * 4 + 1] = rgb[1];
    data[i * 4 + 2] = rgb[2];
    data[i * 4 + 3] = 255;
  }
  return data;
}

/** width×height with a `border`-coloured 1px ring and a `center`-coloured core. */
function bordered(
  size: number,
  center: [number, number, number],
  border: [number, number, number],
): Uint8ClampedArray {
  const data = new Uint8ClampedArray(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const isBorder = x === 0 || y === 0 || x === size - 1 || y === size - 1;
      const [r, g, b] = isBorder ? border : center;
      const i = (y * size + x) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }
  return data;
}

describe('computeAmbientColor', () => {
  it('returns the exact colour for a uniform image with the default alpha', () => {
    expect(computeAmbientColor(uniform(8, 8, [100, 150, 200]), 8, 8, { strategy: 'average' })).toBe(
      'rgb(100 150 200 / 0.16)',
    );
  });

  it('averages every pixel under the average strategy', () => {
    // 4×4: 12 border red + 4 centre blue => r = 12*200/16 = 150, b = 4*200/16 = 50.
    const data = bordered(4, [0, 0, 200], [200, 0, 0]);
    expect(computeAmbientColor(data, 4, 4, { strategy: 'average' })).toBe('rgb(150 0 50 / 0.16)');
  });

  it('weights the border more heavily under the edge strategy (avoids graying)', () => {
    const data = bordered(4, [0, 0, 200], [200, 0, 0]);
    const edge = computeAmbientColor(data, 4, 4, { strategy: 'edge' });
    // Edge weighting pulls toward the red border: more red, less blue than the average.
    expect(edge).toBe('rgb(180 0 20 / 0.16)');
  });

  it('defaults to the edge strategy', () => {
    const data = bordered(4, [0, 0, 200], [200, 0, 0]);
    expect(computeAmbientColor(data, 4, 4)).toBe(computeAmbientColor(data, 4, 4, { strategy: 'edge' }));
  });

  it('honours a custom alpha in the output format', () => {
    expect(computeAmbientColor(uniform(4, 4, [10, 20, 30]), 4, 4, { alpha: 0.5 })).toBe(
      'rgb(10 20 30 / 0.5)',
    );
  });

  it('ignores fully transparent pixels', () => {
    const data = uniform(4, 4, [80, 80, 80]);
    // Make half the pixels transparent; they must not drag the colour toward black.
    for (let i = 0; i < 8; i += 1) {
      data[i * 4 + 3] = 0;
    }
    expect(computeAmbientColor(data, 4, 4, { strategy: 'average' })).toBe('rgb(80 80 80 / 0.16)');
  });

  it('falls back to transparent for empty data', () => {
    expect(computeAmbientColor(new Uint8ClampedArray(0), 0, 0)).toBe('transparent');
  });
});
