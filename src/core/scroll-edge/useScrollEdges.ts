import { useEffect, useState, type RefObject } from 'react';

export interface ScrollEdges {
  top: boolean;
  bottom: boolean;
}

const NO_EDGES: ScrollEdges = { top: false, bottom: false };

// Content within this many pixels of an edge counts as flush against it, so
// sub-pixel scroll offsets never leave a stray overlay on screen.
const EDGE_THRESHOLD = 1;

function readEdges(element: HTMLElement): ScrollEdges {
  const { scrollTop, scrollHeight, clientHeight } = element;
  return {
    top: scrollTop > EDGE_THRESHOLD,
    bottom: scrollHeight - clientHeight - scrollTop > EDGE_THRESHOLD,
  };
}

/**
 * Tracks whether an internal scroll container has content hidden above/below the
 * visible area, so a scroll-edge overlay can be mounted only on the sides that
 * need it. Coalesces scroll/resize work into a single rAF (same cadence as
 * useElementSize) and is SSR-safe (returns no edges until the ref resolves).
 */
export function useScrollEdges(ref: RefObject<HTMLElement | null>): ScrollEdges {
  const [edges, setEdges] = useState<ScrollEdges>(NO_EDGES);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return undefined;
    }

    let animationFrame: number | null = null;

    const applyEdges = () => {
      animationFrame = null;
      const next = readEdges(element);
      setEdges((current) =>
        current.top === next.top && current.bottom === next.bottom ? current : next,
      );
    };

    const scheduleMeasure = () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
      animationFrame = requestAnimationFrame(applyEdges);
    };

    element.addEventListener('scroll', scheduleMeasure, { passive: true });
    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(scheduleMeasure);
    resizeObserver?.observe(element);
    // ResizeObserver only fires on the viewport's own box; a MutationObserver
    // catches content added/removed inside it (Select options, async body
    // content) that changes scrollHeight without resizing the viewport.
    const mutationObserver =
      typeof MutationObserver === 'undefined' ? null : new MutationObserver(scheduleMeasure);
    mutationObserver?.observe(element, { childList: true, subtree: true });
    scheduleMeasure();

    return () => {
      element.removeEventListener('scroll', scheduleMeasure);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [ref]);

  return edges;
}
