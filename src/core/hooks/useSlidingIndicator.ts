import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from 'react';

export interface SlidingIndicatorStyle {
  transform: string;
  width: string;
  height: string;
}

/**
 * Pure geometry: places an indicator over `item` expressed relative to
 * `container`. Kept side-effect free so jsdom (whose rects are all zero) can
 * assert the numbers directly.
 */
export function computeIndicatorStyle(container: DOMRect, item: DOMRect): SlidingIndicatorStyle {
  const x = item.left - container.left;
  const y = item.top - container.top;
  return {
    transform: `translate(${x}px, ${y}px)`,
    width: `${item.width}px`,
    height: `${item.height}px`,
  };
}

function stylesEqual(a: SlidingIndicatorStyle, b: SlidingIndicatorStyle): boolean {
  return a.transform === b.transform && a.width === b.width && a.height === b.height;
}

/**
 * Measures the active item relative to its container and returns the style to
 * apply to the sliding indicator element. Recomputes after every render (the
 * active item may have changed) and on container/item resize (rAF-merged).
 *
 * The indicator only translates/resizes via CSS; when it is a GlassSurface the
 * move never changes its offset box, so no filter is rebuilt.
 */
export function useSlidingIndicator(
  containerRef: RefObject<HTMLElement | null>,
  activeItemRef: RefObject<HTMLElement | null>,
): SlidingIndicatorStyle | null {
  const [style, setStyle] = useState<SlidingIndicatorStyle | null>(null);
  const frameRef = useRef<number | null>(null);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const item = activeItemRef.current;
    if (!container || !item) {
      setStyle((current) => (current === null ? current : null));
      return;
    }

    const next = computeIndicatorStyle(
      container.getBoundingClientRect(),
      item.getBoundingClientRect(),
    );
    setStyle((current) => (current && stylesEqual(current, next) ? current : next));
  }, [containerRef, activeItemRef]);

  // The active item can change without any observable resize, so re-measure on
  // every render; the identity guards above stop this from looping.
  useLayoutEffect(() => {
    measure();
  });

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') {
      return undefined;
    }

    const schedule = () => {
      if (frameRef.current !== null) {
        return;
      }
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null;
        measure();
      });
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(container);
    const item = activeItemRef.current;
    if (item) {
      observer.observe(item);
    }

    return () => {
      observer.disconnect();
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [measure, containerRef, activeItemRef]);

  return style;
}
