import { useEffect, useState } from 'react';
import { computeAmbientColor, type AmbientSampleOptions } from '../utils/ambient-color';

const MAX_SAMPLE = 64;

/**
 * Internal helper hook (not exported publicly). Samples a same-origin / CORS
 * image at a known URL down to ≤64×64 and reduces it to an ambient colour for
 * `--lg-ambient`. Any failure (no CORS, decode error, no 2D context, SSR)
 * resolves to null so the caller silently keeps its manual token.
 */
export function useAmbientFromImage(
  url: string | null,
  options?: AmbientSampleOptions,
): string | null {
  const [color, setColor] = useState<string | null>(null);
  const strategy = options?.strategy;
  const alpha = options?.alpha;

  useEffect(() => {
    if (!url || typeof window === 'undefined' || typeof document === 'undefined') {
      setColor(null);
      return undefined;
    }

    let cancelled = false;
    const image = new Image();
    image.crossOrigin = 'anonymous';

    image.onload = () => {
      if (cancelled) {
        return;
      }
      try {
        const width = image.naturalWidth || image.width;
        const height = image.naturalHeight || image.height;
        if (!width || !height) {
          setColor(null);
          return;
        }
        const scale = Math.min(1, MAX_SAMPLE / Math.max(width, height));
        const sampleWidth = Math.max(1, Math.round(width * scale));
        const sampleHeight = Math.max(1, Math.round(height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = sampleWidth;
        canvas.height = sampleHeight;
        const context = canvas.getContext('2d');
        if (!context) {
          setColor(null);
          return;
        }

        context.drawImage(image, 0, 0, sampleWidth, sampleHeight);
        // Throws a SecurityError on a cross-origin-tainted canvas.
        const { data } = context.getImageData(0, 0, sampleWidth, sampleHeight);
        if (!cancelled) {
          setColor(computeAmbientColor(data, sampleWidth, sampleHeight, { strategy, alpha }));
        }
      } catch {
        if (!cancelled) {
          setColor(null);
        }
      }
    };
    image.onerror = () => {
      if (!cancelled) {
        setColor(null);
      }
    };
    image.src = url;

    return () => {
      cancelled = true;
      image.onload = null;
      image.onerror = null;
    };
  }, [url, strategy, alpha]);

  return color;
}
