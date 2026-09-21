'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMeasureEffect } from './utils.js';

export interface OverflowState {
  /** Put this on the row whose width decides the answer. */
  containerRef: (node: HTMLElement | null) => void;
  /** Put this on each item, in order. */
  itemRef: (index: number) => (node: HTMLElement | null) => void;
  /** Put this on the control that stands in for what does not fit. */
  triggerRef: (node: HTMLElement | null) => void;
  /** How many items, counting from the end, do not fit. 0 while everything does. */
  hidden: number;
  /**
   * True for the one render that measures. Everything is rendered during it — that is what
   * makes the measurement possible — and it happens inside a layout effect, so the row is
   * never painted in its uncollapsed state.
   */
  measuring: boolean;
}

/**
 * How many of a row's items fit in the row, measured.
 *
 * Two components need this and they need it for the same reason: the HIG says a toolbar's
 * items "automatically collapse into the system-managed overflow menu when the window shrinks"
 * and that a path control "hides names between the first and last items" when the list is too
 * long — both are statements about *measured* width, not about a number the caller picked.
 * What each of them does with the answer differs (a toolbar drops from the end, a path bar
 * collapses the middle), so this returns the count and stops there.
 *
 * The measurement is a two-pass affair and cannot honestly be anything else: the width of an
 * item that is not rendered cannot be read. So a measuring render puts every item in the row,
 * a layout effect reads them and writes the count, and the next render collapses. Because it
 * is a *layout* effect, both renders happen before the browser paints — the overflowing row
 * exists for a moment in the DOM and never on screen.
 *
 * The resize observer compares widths before asking for another pass. Without that, hiding an
 * item inside an observed element that is sized by its content resizes the element, which
 * notifies the observer, which measures again: the loop Chrome reports as "ResizeObserver loop
 * completed with undelivered notifications", and the way it presents is a row that flickers
 * between two states forever.
 */
export function useOverflow(count: number, reserve = 40): OverflowState {
  const container = useRef<HTMLElement | null>(null);
  const items = useRef<(HTMLElement | null)[]>([]);
  const trigger = useRef<HTMLElement | null>(null);
  const lastWidth = useRef(-1);
  const [hidden, setHidden] = useState(0);
  const [measuring, setMeasuring] = useState(true);

  /* A different number of items is a different question, whatever the width. */
  useMeasureEffect(() => { lastWidth.current = -1; setMeasuring(true); }, [count]);

  useMeasureEffect(() => {
    if (!measuring) return;
    const node = container.current;
    if (!node) return;
    const available = node.clientWidth;
    lastWidth.current = available;
    const style = getComputedStyle(node);
    const gap = parseFloat(style.columnGap) || 0;
    const widths = Array.from({ length: count }, (_, index) => items.current[index]?.getBoundingClientRect().width ?? 0);

    /**
     * Every child sorted into one of three piles: an item that can move, the trigger it would
     * move into, or something that is not negotiable — a path bar's root and current level, a
     * toolbar's decoration layer.
     *
     * By classification rather than by subtracting from `scrollWidth`: engines disagree about
     * whether a flex container's `scrollWidth` includes its trailing padding, and a
     * measurement that is right in one browser and a padding out in another is worse than no
     * measurement. Out-of-flow children are skipped because they take no room in the row and
     * some of them — the fusion layer under a toolbar group — are as wide as the row itself.
     */
    let fixed = 0, flowing = 0;
    for (const child of Array.from(node.children) as HTMLElement[]) {
      if (getComputedStyle(child).position === 'absolute' || getComputedStyle(child).position === 'fixed') continue;
      flowing++;
      if (items.current.includes(child)) continue;
      if (trigger.current && (child === trigger.current || child.contains(trigger.current))) continue;
      fixed += child.getBoundingClientRect().width;
    }
    const total = fixed + widths.reduce((sum, width) => sum + width, 0) + gap * Math.max(0, flowing - 1);
    /* A row that fits keeps every item and no trigger — the trigger's own width is only worth
       reserving once something is actually going into it. */
    if (total <= available + 0.5) { setHidden(0); setMeasuring(false); return; }

    const room = available - fixed - ((trigger.current?.getBoundingClientRect().width ?? 0) || reserve) - gap;
    let used = 0, shown = 0;
    for (const width of widths) {
      const next = used + width + (shown ? gap : 0);
      if (next > room) break;
      used = next; shown++;
    }
    setHidden(count - shown);
    setMeasuring(false);
  }, [measuring, count, reserve]);

  useEffect(() => {
    const node = container.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.target.clientWidth;
      if (width === lastWidth.current) return;
      lastWidth.current = width;
      setMeasuring(true);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const containerRef = useCallback((node: HTMLElement | null) => { container.current = node; }, []);
  const triggerRef = useCallback((node: HTMLElement | null) => { trigger.current = node; }, []);
  const itemRef = useCallback((index: number) => (node: HTMLElement | null) => { items.current[index] = node; }, []);

  return { containerRef, itemRef, triggerRef, hidden, measuring };
}
