import { BoundedCache } from './cache.js';
import { createDisplacementMap, displacementKey, type MapOptions } from './geometry.js';
export interface EncodedMap { url: string; width: number; height: number }
const maps = new BoundedCache<EncodedMap>();
let generated = 0;
let observers = 0;
export function trackObserver(delta: 1 | -1): void { observers = Math.max(0, observers + delta); }
export function getGlassDiagnostics() { return { ...maps.stats, generated, observers }; }
export function clearGlassCache(): void { maps.clear(); }
/** Call on the client only. No DOM screenshots or cross-origin pixel reads. */
export function getDisplacementTexture(options: MapOptions): EncodedMap | null {
  if (typeof document === 'undefined') return null;
  const key = displacementKey(options), hit = maps.get(key);
  if (hit) return hit;
  try {
    const map = createDisplacementMap(options);
    const canvas = document.createElement('canvas'); canvas.width = map.width; canvas.height = map.height;
    const context = canvas.getContext('2d'); if (!context) return null;
    const image = context.createImageData(map.width, map.height); image.data.set(map.data); context.putImageData(image, 0, 0);
    const value = { url: canvas.toDataURL('image/png'), width: map.cssWidth, height: map.cssHeight };
    maps.set(key, value, value.url.length * 2); generated++;
    return value;
  } catch { return null; }
}
/** Syntax detection only; never interpreted as visual correctness or certification. */
export function supportsSvgBackdrop(): boolean {
  return typeof CSS !== 'undefined' && CSS.supports('backdrop-filter', 'url("#glass-probe")');
}
