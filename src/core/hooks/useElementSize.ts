import { useEffect, useState, type RefObject } from 'react';

export interface ElementSize {
  width: number;
  height: number;
}

const ZERO_SIZE: ElementSize = { width: 0, height: 0 };

export function useElementSize(ref: RefObject<Element | null>): ElementSize {
  const [size, setSize] = useState<ElementSize>(ZERO_SIZE);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    let animationFrame: number | null = null;

    const scheduleUpdate = (rect: Pick<DOMRectReadOnly, 'width' | 'height'>) => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(() => {
        const nextSize = {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };

        setSize((currentSize) =>
          currentSize.width === nextSize.width && currentSize.height === nextSize.height
            ? currentSize
            : nextSize,
        );
      });
    };

    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        scheduleUpdate(entry.target.getBoundingClientRect());
      }
    });

    observer.observe(element);
    scheduleUpdate(element.getBoundingClientRect());

    return () => {
      observer.disconnect();
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [ref]);

  return size;
}
