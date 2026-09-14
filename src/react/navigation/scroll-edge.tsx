'use client';
import { useEffect, useState, type RefObject } from 'react';
import { useGlassPolicy } from '../system/provider.js';
import { cx } from '../system/utils.js';

export interface ScrollEdgeProps {
  targetRef: RefObject<HTMLElement | null>;
  edge?: 'top' | 'bottom';
  /**
   * `soft` dissolves content progressively as it approaches the bar — the iOS default.
   * `hard` draws a uniform, more opaque boundary, which is what macOS uses for pinned column
   * headers and for controls that have no background of their own.
   */
  variant?: 'soft' | 'hard';
  /** Height of the dissolve in CSS px. Keep it consistent across the columns of a split view. */
  height?: number;
  className?: string;
}

/**
 * The scroll edge effect: what replaced opaque bar backgrounds and hairline dividers.
 *
 * It is not decoration and not a colour block — it exists only where content actually passes
 * beneath floating UI, and there is exactly one per scroll view. Use it instead of giving a
 * bar its own background: that is precisely the custom bar treatment the new design removes.
 */
export function ScrollEdge({ targetRef, edge = 'top', variant = 'soft', height = 44, className }: ScrollEdgeProps) {
  const [active, setActive] = useState(false);
  const policy = useGlassPolicy();
  useEffect(() => {
    const target = targetRef.current; if (!target) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(edge === 'top'
        ? target.scrollTop > 1
        : target.scrollTop + target.clientHeight < target.scrollHeight - 1));
    };
    const observer = new ResizeObserver(update); observer.observe(target);
    if (target.firstElementChild) observer.observe(target.firstElementChild);
    const mutation = new MutationObserver(update); mutation.observe(target, { childList: true, subtree: true, characterData: true });
    target.addEventListener('scroll', update, { passive: true }); update();
    return () => { observer.disconnect(); mutation.disconnect(); target.removeEventListener('scroll', update); cancelAnimationFrame(frame); };
  }, [targetRef, edge]);
  return <div aria-hidden="true" className={cx('lg-scroll-edge', className)} data-lg-theme={policy.resolvedTheme}
    data-edge={edge} data-variant={variant} data-active={active ? 'true' : 'false'}
    style={{ height: `${height}px` }} />;
}
