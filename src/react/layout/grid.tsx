'use client';
import { useEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode, type RefAttributes } from 'react';
import { inDevelopment, warnOnce } from '../system/warn.js';
import { cx } from '../system/utils.js';

/** The HIG's minimum between controls, and the room a focus ring needs. */
const MIN_GAP = 8;

export interface GridProps extends HTMLAttributes<HTMLDivElement>, RefAttributes<HTMLDivElement> {
  children: ReactNode;
  /**
   * The narrowest an item may be before the grid drops a column. Columns are derived from it,
   * which is what makes the layout answer to the space it is in rather than to a guess about
   * the device.
   */
  minItemWidth?: number;
  /** A fixed column count instead. Use it only where the count is the design. */
  columns?: number;
  /**
   * Gap between items, from the spacing grid. Floored at 8 — the HIG's minimum between
   * controls, and the room a focus ring needs.
   *
   * There is deliberately no `itemPadding`. The first version of this put padding on every
   * child to make that room, which fights whatever padding the child already had and loses
   * to it: measured, `.lg-button`'s own padding won and the setting did nothing.
   */
  gap?: number;
}

/**
 * A grid of same-kind items that reflows by the space it has.
 *
 * `minItemWidth` rather than a breakpoint list: the grid is asked to fit items of a certain
 * size and works out the columns, so it is right inside a sidebar, inside a split view's
 * middle column, and full width, without any of those being enumerated anywhere.
 *
 * Content layer. Items on a grid are content; the glass belongs to whatever floats over them.
 *
 * **No virtualisation**, deliberately. It is a real need at a few thousand items and it is a
 * different component with different trade-offs — measured heights, scroll anchoring, and a
 * keyboard model that has to work with rows that do not exist yet. Doing a shallow version
 * here would make the honest one harder to add later.
 */
export function Grid({
  children, minItemWidth = 220, columns, gap = 16, className, style, ref, ...props
}: GridProps) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!inDevelopment() || gap >= MIN_GAP || !root.current) return;
    warnOnce(root.current, 'grid-gap',
      `Grid gap is ${gap}px. Under ${MIN_GAP} an item's focus ring is drawn over its neighbour, which only the people navigating by keyboard ever see.`);
  }, [gap]);
  return <div {...props} ref={node => {
    root.current = node;
    if (typeof ref === 'function') ref(node); else if (ref) ref.current = node;
  }} className={cx('lg-grid', className)} style={{
    '--lg-grid-min': `${minItemWidth}px`,
    '--lg-grid-gap': `${Math.max(MIN_GAP, gap)}px`,
    ...(columns ? { '--lg-grid-columns': String(columns) } : {}),
    ...style,
  } as CSSProperties} data-fixed={columns ? 'true' : undefined}>{children}</div>;
}
