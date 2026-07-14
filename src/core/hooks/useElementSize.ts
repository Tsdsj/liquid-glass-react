import { useEffect, useState, type RefObject } from 'react';

export interface ElementSize {
  width: number;
  height: number;
}

const ZERO_SIZE: ElementSize = { width: 0, height: 0 };

function readBorderBoxSize(element: Element): ElementSize {
  if (element instanceof HTMLElement) {
    const { offsetWidth, offsetHeight } = element;
    if (offsetWidth !== 0 || offsetHeight !== 0) {
      return { width: offsetWidth, height: offsetHeight };
    }
  }

  const rect = element.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

export function useElementSize(ref: RefObject<Element | null>): ElementSize {
  const [size, setSize] = useState<ElementSize>(ZERO_SIZE);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    let animationFrame: number | null = null;

    const scheduleUpdate = () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(() => {
        const borderBox = readBorderBoxSize(element);
        const nextSize = {
          width: Math.round(borderBox.width),
          height: Math.round(borderBox.height),
        };

        setSize((currentSize) =>
          currentSize.width === nextSize.width && currentSize.height === nextSize.height
            ? currentSize
            : nextSize,
        );
      });
    };

    const observer = new ResizeObserver(() => {
      scheduleUpdate();
    });

    observer.observe(element);
    scheduleUpdate();

    return () => {
      observer.disconnect();
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [ref]);

  return size;
}
