'use client';
import { useEffect, useRef, type HTMLAttributes, type RefAttributes } from 'react';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { splitSurface } from '../system/props.js';
import { attachPull } from '../system/pull.js';
import { inDevelopment, warnOnce } from '../system/warn.js';
import { cx, useControllable } from '../system/utils.js';

export interface PageControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>,
  RefAttributes<HTMLDivElement>, GlassSurfaceOptions {
  count: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** What the pages are. Required: a row of dots says nothing about what it is counting. */
  'aria-label': string;
  /** How each page is named, for the dot's own label. Defaults to "n / total". */
  formatPage?: (page: number, count: number) => string;
  orientation?: 'horizontal' | 'vertical';
}

/** Past this many, a reader cannot count the dots and the control stops being a position. */
const LEGIBLE = 10;

/**
 * Where you are in an **ordered** set of pages.
 *
 * Order is the whole premise: a page control says "third of five", which is only meaningful
 * if there is a first and a last. A set of unordered destinations is a tab bar, and using
 * this for one tells the reader there is a sequence when there is not.
 *
 * Draggable along its own capsule, because that is how the system one works — a row of dots
 * you can only tap is the same tell as a segmented control you can only click. Each dot is
 * also a real button, so the pointer gesture is an addition to the keyboard path rather than
 * a replacement for it.
 */
export function PageControl({
  count, page: controlled, defaultPage = 0, onPageChange, 'aria-label': label, formatPage,
  orientation = 'horizontal', className, style, ref, ...rest
}: PageControlProps) {
  const [surface, props] = splitSurface(rest);
  const [current, setCurrent] = useControllable(controlled, defaultPage, onPageChange);
  const glass = useGlassSurface<HTMLDivElement>({ ...surface, radius: 'pill' }, ref);
  const clamped = Math.min(Math.max(Math.round(current), 0), Math.max(0, count - 1));

  useEffect(() => {
    if (!inDevelopment() || !glass.root.current || count <= LEGIBLE) return;
    warnOnce(glass.root.current, 'page-control-too-many',
      `PageControl has ${count} pages. Past about ${LEGIBLE} the dots stop being countable, so they no longer say where you are — show a "${clamped + 1} / ${count}" label instead.`);
  }, [count, clamped, glass.root]);

  /**
   * Drag along the capsule. The page is whichever dot the finger is over, resolved from the
   * track geometry rather than by hit-testing — the dots are far smaller than a finger, and a
   * drag that only changed page when it happened to be exactly over one would feel broken.
   */
  const latest = useRef({ count, setCurrent }); latest.current = { count, setCurrent };
  useEffect(() => {
    const node = glass.root.current; if (!node) return;
    const pick = (event: PointerEvent) => {
      const { count: total, setCurrent: set } = latest.current;
      if (total < 2) return;
      const box = node.getBoundingClientRect();
      const along = orientation === 'vertical'
        ? (event.clientY - box.top) / box.height
        : getComputedStyle(node).direction === 'rtl'
          ? (box.right - event.clientX) / box.width
          : (event.clientX - box.left) / box.width;
      set(Math.min(total - 1, Math.max(0, Math.round(along * (total - 1)))));
    };
    /* `limit: 0` and no targets: this borrows the gesture plumbing — one primary pointer, a
       frame loop, clean release and cancel — without the deformation. There is nothing here
       to stretch, so Reduce Motion has nothing to turn off. */
    return attachPull(node, () => ({
      limit: 0, stretch: 0,
      axis: orientation === 'vertical' ? 'y' : 'x',
      targets: () => [node],
      onPress: pick,
      onMove: pick,
    }));
  }, [glass.root, orientation]);

  if (count < 1) return null;
  const name = (index: number) => formatPage?.(index, count) ?? `${index + 1} / ${count}`;

  return <div {...props} ref={glass.ref} {...glass.attributes}
    className={cx('lg-root lg-page-control', className)} style={{ ...glass.style, ...style }}
    data-orientation={orientation} role="tablist" aria-label={label} aria-orientation={orientation}>
    {glass.decoration}
    <div className="lg-content">
      {Array.from({ length: count }, (_, index) => <button
        key={index} type="button" role="tab" className="lg-page-dot"
        aria-selected={index === clamped} aria-label={name(index)}
        /* One tab stop for the whole control, as a tab list is: the arrow keys move within it
           and Tab moves past it. */
        tabIndex={index === clamped ? 0 : -1}
        onClick={() => setCurrent(index)}
        onKeyDown={event => {
          const forward = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
          const back = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
          let next = clamped;
          if (event.key === forward) next = Math.min(count - 1, clamped + 1);
          else if (event.key === back) next = Math.max(0, clamped - 1);
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = count - 1;
          else return;
          event.preventDefault();
          setCurrent(next);
          // Focus follows selection here: there is nothing to preview, only a position.
          (event.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
        }}>
        <span aria-hidden="true" />
      </button>)}
    </div>
  </div>;
}
