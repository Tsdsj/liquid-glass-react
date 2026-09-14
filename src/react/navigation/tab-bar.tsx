'use client';
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { GlassSurface } from '../system/surface.js';
import { type GlassSurfaceOptions } from '../system/material.js';
import { cx } from '../system/utils.js';
import { usePull } from '../system/pull.js';
import { useGlassPolicy, useMediaQuery } from '../system/provider.js';
import { useSelectionLens, lensOrigin } from '../controls/segmented.js';
import { GlassBadge } from '../controls/badge.js';

export interface TabBarItem {
  key: string;
  href: string;
  label: ReactNode;
  icon?: ReactNode;
  /** Count shown on the tab. Give the badge an accessible name that says what it counts. */
  badge?: number;
  badgeLabel?: string;
  /** Intercept navigation for a client router or an in-page demo. */
  onSelect?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export interface TabBarProps extends GlassSurfaceOptions {
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
  className?: string;
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
  sidebarBreakpoint = 1024, sidebarHeader, accessory, className, ...surface
}: TabBarProps) {
  const policy = useGlassPolicy();
  const asSidebar = useMediaQuery(`(min-width: ${sidebarBreakpoint}px)`);
  const [minimized, setMinimized] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLSpanElement>(null);
  const activeKey = items.find(item => item.key === current)?.key ?? (search?.key === current ? current : undefined);
  const lens = useSelectionLens(list, 'a[aria-current="page"]', [activeKey, items.length, asSidebar]);

  usePull(list, {
    axis: asSidebar ? 'y' : 'x', limit: 18, stretch: .8,
    targets: () => lensRef.current ? [lensRef.current] : [],
    origin: () => lensOrigin(lensRef.current),
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

  const link = (item: TabBarItem, kind: 'tab' | 'search') => <a key={item.key} className="lg-tab-link" data-kind={kind}
    href={item.href} aria-current={item.key === current ? 'page' : undefined}
    onClick={item.onSelect ? event => item.onSelect!(event) : undefined}>
    {item.icon && <span className="lg-tab-icon" aria-hidden="true">{item.icon}</span>}
    <span className="lg-tab-label">{item.label}</span>
    {item.badge !== undefined && <GlassBadge count={item.badge} aria-label={item.badgeLabel} className="lg-tab-badge" />}
  </a>;

  return <nav aria-label={label} className={cx('lg-tabbar', className)}
    data-layout={asSidebar ? 'sidebar' : 'tabbar'} data-minimized={minimized ? 'true' : undefined}>
    {asSidebar && sidebarHeader && <div className="lg-tabbar-header">{sidebarHeader}</div>}
    <GlassSurface {...surface} size={asSidebar ? 'large' : 'small'} radius={asSidebar ? 26 : 'pill'} className="lg-tabbar-group">
      <div className="lg-tab-links" ref={list}>
        <span aria-hidden="true" className="lg-selection-lens" ref={lensRef} style={lens} />
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
