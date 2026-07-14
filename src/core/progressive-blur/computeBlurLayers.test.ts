import { describe, expect, it } from 'vitest';
import { computeBlurLayers } from './computeBlurLayers';

describe('computeBlurLayers', () => {
  it('clamps the layer count into [3, 8]', () => {
    expect(computeBlurLayers(16, 1)).toHaveLength(3);
    expect(computeBlurLayers(16, 2)).toHaveLength(3);
    expect(computeBlurLayers(16, 5)).toHaveLength(5);
    expect(computeBlurLayers(16, 8)).toHaveLength(8);
    expect(computeBlurLayers(16, 20)).toHaveLength(8);
  });

  it('grows the blur radius geometrically (×2) up to maxBlur', () => {
    const blurs = computeBlurLayers(16, 5).map((layer) => layer.blur);
    expect(blurs).toEqual([1, 2, 4, 8, 16]);
  });

  it('makes the last layer reach exactly maxBlur and the blur strictly increase', () => {
    const layers = computeBlurLayers(24, 6);
    expect(layers[layers.length - 1].blur).toBe(24);
    for (let i = 1; i < layers.length; i += 1) {
      expect(layers[i].blur).toBeGreaterThan(layers[i - 1].blur);
    }
  });

  it('covers the whole [0, 1] range: first mask starts at 0, last ends at 1', () => {
    const layers = computeBlurLayers(16, 5);
    expect(layers[0].maskStart).toBe(0);
    expect(layers[layers.length - 1].maskEnd).toBe(1);
  });

  it('overlaps every adjacent band so there is no gap between depth bands', () => {
    const layers = computeBlurLayers(16, 6);
    for (let i = 0; i < layers.length - 1; i += 1) {
      expect(layers[i].maskEnd).toBeGreaterThan(layers[i + 1].maskStart);
    }
  });

  it('keeps mask endpoints within [0, 1] and ordered', () => {
    for (const layer of computeBlurLayers(16, 8)) {
      expect(layer.maskStart).toBeGreaterThanOrEqual(0);
      expect(layer.maskEnd).toBeLessThanOrEqual(1);
      expect(layer.maskEnd).toBeGreaterThan(layer.maskStart);
    }
  });
});
