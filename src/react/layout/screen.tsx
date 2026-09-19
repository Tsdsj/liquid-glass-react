'use client';
import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode, type RefAttributes } from 'react';
import { ScrollEdge } from '../navigation/scroll-edge.js';
import { cx, useMergedRef } from '../system/utils.js';

export interface ScreenProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, RefAttributes<HTMLDivElement> {
  /** Floating navigation pinned to the top: a navigation bar, a toolbar. */
  top?: ReactNode;
  /** Floating navigation pinned to the bottom: a tab bar. */
  bottom?: ReactNode;
  children: ReactNode;
  /**
   * `container` makes the screen its own scroll view, the full height of the viewport — what
   * an application shell wants. `page` leaves the document scrolling and pins the bars to the
   * viewport instead, for a site that is a long document with navigation floating over it.
   */
  scroll?: 'container' | 'page';
  /**
   * The scroll edge effect under the bars. `soft` is the iOS dissolve, `hard` the macOS
   * boundary, `none` for a screen whose bars are opaque anyway.
   */
  edge?: 'soft' | 'hard' | 'none';
  /** Height of the dissolve. Keep it the same across the columns of a split view. */
  edgeHeight?: number;
  /**
   * Extra breathing room under the bottom bar, on top of the measured bar height. The default
   * is the spacing the system leaves between a tab bar and the content above it.
   */
  inset?: number;
}

/**
 * The screen: bars that float, content that runs underneath them, and one scroll edge effect.
 *
 * Three rules from the HIG's layout and scroll-views pages, made into the default rather than
 * something each application re-derives:
 *
 * - The background extends under the bars — content is continuous, and what separates the bar
 *   from it is the **scroll edge effect**, never a bar background, a border or a divider. That
 *   is exactly the custom bar treatment the current design removed.
 * - Controls stay inside the safe area, so the insets go on the **bars**, not on the content.
 *   Padding the content instead leaves a strip of blank page above a bar that is already clear
 *   of the notch.
 * - **One scroll edge effect per view.** It belongs to the scroll view, so the screen owns it;
 *   nesting another inside means two dissolves fighting over the same boundary.
 *
 * The content's padding is the measured height of each bar, not a number copied from a design:
 * a bar is as tall as its own contents, which change with the text size, and a hard-coded
 * reservation is wrong for everyone who is not using the default.
 */
export function Screen({
  top, bottom, children, scroll = 'container', edge = 'soft', edgeHeight = 44, inset = 12,
  className, style, ref, ...props
}: ScreenProps) {
  const topBar = useRef<HTMLDivElement>(null);
  const bottomBar = useRef<HTMLDivElement>(null);
  const [scroller, scrollerRef] = useMergedRef<HTMLDivElement>(undefined);
  const [bars, setBars] = useState({ top: 0, bottom: 0 });

  /**
   * Measured, and re-measured whenever a bar changes size — which is what happens at the
   * largest accessibility text sizes, when a tab bar minimizes on scroll, and when the
   * keyboard changes the viewport.
   */
  useEffect(() => {
    const nodes = [topBar.current, bottomBar.current].filter(Boolean) as HTMLElement[];
    if (!nodes.length) { setBars({ top: 0, bottom: 0 }); return; }
    const measure = () => setBars({
      top: topBar.current?.offsetHeight ?? 0,
      bottom: bottomBar.current?.offsetHeight ?? 0,
    });
    const observer = new ResizeObserver(measure);
    for (const node of nodes) observer.observe(node);
    measure();
    return () => observer.disconnect();
  }, [top, bottom]);

  const container = scroll === 'container';
  const variables = {
    '--lg-screen-top': `${bars.top}px`,
    '--lg-screen-bottom': `${bars.bottom}px`,
    '--lg-screen-inset': `${inset}px`,
  } as CSSProperties;

  return <div {...props} ref={ref} className={cx('lg-screen', className)} data-scroll={scroll}
    style={{ ...variables, ...style }}>
    {top && <div ref={topBar} className="lg-screen-bar" data-edge="top">{top}</div>}

    <div ref={container ? scrollerRef : undefined} className="lg-screen-scroll">
      {/* One per view, and it belongs to the scroll view rather than to either bar. */}
      {edge !== 'none' && top && <ScrollEdge
        targetRef={container ? scroller : undefined}
        edge="top" variant={edge} height={edgeHeight} className="lg-screen-edge" />}
      <div className="lg-screen-content">{children}</div>
    </div>

    {bottom && <div ref={bottomBar} className="lg-screen-bar" data-edge="bottom">{bottom}</div>}
  </div>;
}
