'use client';
import { useEffect, useRef, useState, type HTMLAttributes, type MouseEvent, type ReactNode, type RefAttributes } from 'react';
import { GlassSurface } from '../system/surface.js';
import { type GlassSurfaceOptions } from '../system/material.js';
import { splitSurface } from '../system/props.js';
import { cx } from '../system/utils.js';
import { usePull, elementAt } from '../system/pull.js';
import { useGlassPolicy, useMediaQuery } from '../system/provider.js';
import { useSelectionLens, lensOrigin, trackSpan } from '../controls/segmented.js';
import { GlassBadge } from '../controls/badge.js';

export interface TabBarItem {
  key: string;
  /** Where the section lives. Leave it out when the section has no URL: the tab becomes a button. */
  href?: string;
  label: ReactNode;
  icon?: ReactNode;
  /** Count shown on the tab. Give the badge an accessible name that says what it counts. */
  badge?: number;
  badgeLabel?: string;
  /** Intercept navigation for a client router, or handle the press when there is no `href`. */
  onSelect?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
}

/** The ref and any HTML attributes land on the `<nav>`, which is the whole bar. */
export interface TabBarProps extends Omit<HTMLAttributes<HTMLElement>, 'children'>, RefAttributes<HTMLElement>, GlassSurfaceOptions {
  items: TabBarItem[];
  /** `key` of the current section. */
  current?: string;
  /**
   * The search destination. Search gets its own tab at the trailing end, on its own glass
   * background so it reads as separate from the content sections.
   */
  search?: TabBarItem;
  'aria-label': string;
  /** Collapse to a compact pill while the user scrolls down; expands again on the way up. */
  minimizeOnScroll?: boolean;
  /**
   * Width at which the bar becomes a sidebar. The tab bar and the sidebar are one
   * navigational element that scales, not two components to keep in sync.
   */
  sidebarBreakpoint?: number;
  /** Optional heading shown above the items in sidebar form. */
  sidebarHeader?: ReactNode;
  /** Persistent accessory (a now-playing strip, a status line). Never screen-specific actions. */
  accessory?: ReactNode;
}

/**
 * The app's primary navigation: a floating capsule at the bottom on phones, the same element
 * expanded into a sidebar at regular width.
 *
 * It is a `<nav>` of links with `aria-current="page"`, **not** a tablist — these navigate
 * between sections rather than swapping panels in place. Three to five sections is the usable
 * range; anything more belongs in a sidebar. Tabs navigate, so never put actions in here.
 */
export function TabBar({
  items, current, search, 'aria-label': label, minimizeOnScroll = false,
  sidebarBreakpoint = 1024, sidebarHeader, accessory, className, ref, ...rest
}: TabBarProps) {
  const [surface, props] = splitSurface(rest);
  const policy = useGlassPolicy();
  const asSidebar = useMediaQuery(`(min-width: ${sidebarBreakpoint}px)`);
  const [minimized, setMinimized] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLSpanElement>(null);
  const activeKey = items.find(item => item.key === current)?.key ?? (search?.key === current ? current : undefined);
  useSelectionLens(list, lensRef, 'a[aria-current="page"]', [activeKey, items.length, asSidebar]);

  /**
   * Sliding the lens changes section as it crosses each one, the same way the segmented control
   * works — a lens you can drag but that decides nothing is worse than no drag at all. Only a
   * move does this: a plain press-and-release is the link's own click.
   */
  const dragged = useRef(false);
  function pick(event: PointerEvent) {
    const hit = elementAt(event, '.lg-tab-link');
    if (!hit || !list.current?.contains(hit) || hit.getAttribute('aria-current') === 'page') return;
    // Lowered around the synthetic click so the guard below only ever swallows the real one.
    dragged.current = false;
    hit.click();
    dragged.current = true;
  }
  usePull(list, {
    axis: asSidebar ? 'y' : 'x', limit: 18, stretch: .8,
    targets: () => lensRef.current ? [lensRef.current] : [],
    origin: () => lensOrigin(lensRef.current),
    range: () => trackSpan(list.current, lensRef.current, asSidebar ? 'y' : 'x'),
    // The highlight is carried only from the item it is on; see `GlassSegmentedControl`.
    grab: event => !!(event.target as HTMLElement).closest('.lg-tab-link[aria-current="page"]'),
    onMove: pick,
  }, !policy.reduceMotion);

  useEffect(() => {
    if (!minimizeOnScroll || asSidebar || policy.reduceMotion) { setMinimized(false); return; }
    let previous = window.scrollY, frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        // Only a deliberate scroll counts, so the bar does not flicker on rubber-banding.
        if (Math.abs(y - previous) > 6) { setMinimized(y > previous && y > 64); previous = y; }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, [minimizeOnScroll, asSidebar, policy.reduceMotion]);

  /* draggable={false}: a link that is also a drag target would otherwise start a native drag on
     the first pointer move, which both shows the URL ghost and cancels the gesture. */
  const link = (item: TabBarItem, kind: 'tab' | 'search') => {
    const inside = <>
      {item.icon && <span className="lg-tab-icon" aria-hidden="true">{item.icon}</span>}
      <span className="lg-tab-label">{item.label}</span>
      {item.badge !== undefined && <GlassBadge count={item.badge} aria-label={item.badgeLabel} className="lg-tab-badge" />}
    </>;
    /* `key` is deliberately not in here: React 19 warns when a props object carrying one is
       spread into JSX, and a warning printed three times per render is how a library teaches
       people to stop reading their console. It goes on the tag, below. */
    const shared = {
      className: 'lg-tab-link', 'data-kind': kind,
      'aria-current': (item.key === current ? 'page' : undefined) as 'page' | undefined,
      onClick: item.onSelect ? (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => item.onSelect!(event) : undefined,
    };
    /**
     * A section without a URL is a button, not a link to nowhere.
     *
     * `href` used to be required, which left an application that keeps its sections in state —
     * most of them — inventing an address it then had to cancel in `onSelect`. An `<a>` with no
     * `href` is not focusable and is not announced as anything; a `<button>` is both, and
     * `aria-current="page"` reads the same on it.
     */
    return item.href === undefined
      ? <button key={item.key} {...shared} type="button">{inside}</button>
      : <a key={item.key} {...shared} href={item.href} draggable={false}>{inside}</a>;
  };

  return <nav {...props} ref={ref} aria-label={label} className={cx('lg-tabbar', className)}
    data-layout={asSidebar ? 'sidebar' : 'tabbar'} data-minimized={minimized ? 'true' : undefined}>
    {asSidebar && sidebarHeader && <div className="lg-tabbar-header">{sidebarHeader}</div>}
    <GlassSurface {...surface} size={asSidebar ? 'large' : 'small'} radius={asSidebar ? 26 : 'pill'} className="lg-tabbar-group">
      {/* The drag already navigated; the click that ends it must not navigate a second time. */}
      <div className="lg-tab-links" ref={list}
        onClickCapture={event => { if (dragged.current) { dragged.current = false; event.preventDefault(); event.stopPropagation(); } }}>
        <span aria-hidden="true" className="lg-selection-lens" ref={lensRef} />
        {items.map(item => link(item, 'tab'))}
      </div>
    </GlassSurface>
    {/* Search sits on its own glass so it reads as a separate destination, not a sixth section. */}
    {search && <GlassSurface {...surface} size={asSidebar ? 'large' : 'small'} radius={asSidebar ? 26 : 'pill'} className="lg-tabbar-group lg-tabbar-search">
      <div className="lg-tab-links">{link(search, 'search')}</div>
    </GlassSurface>}
    {accessory && <div className="lg-tabbar-accessory">{accessory}</div>}
  </nav>;
}
