'use client';
import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode, type RefAttributes } from 'react';
import { cx } from '../system/utils.js';
import { Text } from '../content/text.js';

/**
 * `title` is taken back from HTML: here it is the heading the bar displays, not a tooltip.
 * The ref and the remaining attributes land on the `<header>`; `children` render after it,
 * below the large title, which is the only place they make sense.
 */
export interface NavigationBarProps extends Omit<HTMLAttributes<HTMLElement>, 'title'>, RefAttributes<HTMLElement> {
  title: string;
  /** Controls at the leading edge — a back affordance, a menu. */
  leading?: ReactNode;
  /** Controls at the trailing edge. Group them by function; the primary action stands alone. */
  trailing?: ReactNode;
  /**
   * Show the large title in the content flow. Turn it off for secondary screens, which use
   * the compact title from the start.
   */
  largeTitle?: boolean;
  /** Subtitle shown under the large title only; the compact bar stays to one line. */
  subtitle?: ReactNode;
  children?: ReactNode;
}

/**
 * A large title that hands over to a compact one as it scrolls away.
 *
 * The compact title is hidden while the large title is still on screen — showing both means
 * the same words twice, which is the most common way this pattern is misread. The bar itself
 * carries no background, border or shadow of its own: separation comes from the glass of the
 * control groups inside it and from the scroll edge effect beneath.
 */
export function NavigationBar({ title, leading, trailing, largeTitle = true, subtitle, 'aria-label': label, className, children, ref, ...props }: NavigationBarProps) {
  const [compact, setCompact] = useState(!largeTitle);
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!largeTitle) { setCompact(true); return; }
    const node = sentinel.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setCompact(!entry.isIntersecting), { threshold: 0 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [largeTitle]);
  return <>
    <header {...props} ref={ref} className={cx('lg-navbar', className)} aria-label={label} data-compact={compact ? 'true' : undefined}>
      <div className="lg-navbar-leading">{leading}</div>
      {/* aria-hidden: the large title below is the real heading, so this must not duplicate it. */}
      <div className="lg-navbar-title" aria-hidden="true">{title}</div>
      <div className="lg-navbar-trailing">{trailing}</div>
    </header>
    {largeTitle && <div className="lg-largetitle">
      <Text as="h1" variant="largeTitle" emphasized>{title}</Text>
      {subtitle && <Text variant="subhead" tone="secondary">{subtitle}</Text>}
      <div ref={sentinel} className="lg-largetitle-sentinel" aria-hidden="true" />
    </div>}
    {children}
  </>;
}
