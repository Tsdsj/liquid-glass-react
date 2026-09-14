'use client';
import { forwardRef, useEffect, type HTMLAttributes, type KeyboardEvent } from 'react';
import { useFusion } from '../system/fusion.js';
import { GlassSurface, SharedSurface, type GlassSurfaceProps } from '../system/surface.js';
import { cx, useMergedRef } from '../system/utils.js';

export interface GlassToolbarProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  'aria-label': string;
}

/**
 * The toolbar itself carries no background: it is a row of *groups*, and each group is the
 * glass. Removing custom bar backgrounds, borders and darkening overlays is what lets the
 * material and the scroll edge effect do the separating.
 *
 * Roving focus covers the buttons of every group, so the whole bar is one tab stop with
 * arrow-key traversal. Complex input widgets belong outside this primitive.
 */
export const GlassToolbar = forwardRef<HTMLDivElement, GlassToolbarProps>(function GlassToolbar(
  { className, children, orientation = 'horizontal', onKeyDown, onFocusCapture, ...props }, ref,
) {
  const [root, merged] = useMergedRef<HTMLDivElement>(ref);
  const items = () => Array.from(root.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])
    .filter(b => b.closest('[role="toolbar"]') === root.current && !b.closest('[popover]') && b.getClientRects().length > 0);
  const setTabStop = (target: HTMLElement) => { for (const item of items()) item.tabIndex = item === target ? 0 : -1; };
  useEffect(() => {
    const node = root.current; if (!node) return;
    const reset = () => { const available = items(); const current = available.find(item => item === document.activeElement) ?? available.find(item => item.tabIndex === 0) ?? available[0]; if (current) setTabStop(current); };
    reset();
    const observer = new MutationObserver(reset); observer.observe(node, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled'] });
    return () => observer.disconnect();
  });
  const keyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event); if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const available = items(); const index = available.indexOf(document.activeElement as HTMLButtonElement); if (index < 0) return;
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const previous = orientation === 'horizontal' ? (rtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
    const next = orientation === 'horizontal' ? (rtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
    let target = index;
    if (event.key === next) target = (index + 1) % available.length;
    else if (event.key === previous) target = (index - 1 + available.length) % available.length;
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = available.length - 1;
    else return;
    event.preventDefault(); setTabStop(available[target]); available[target].focus();
  };
  return <div {...props} ref={merged} role="toolbar" aria-orientation={orientation}
    className={cx('lg-toolbar', className)} data-orientation={orientation} onKeyDown={keyboard}
    onFocusCapture={event => { onFocusCapture?.(event); if ((event.target as HTMLElement).tagName === 'BUTTON') setTabStop(event.target as HTMLElement); }}>
    {children}
  </div>;
});

export interface ToolbarGroupProps extends GlassSurfaceProps {
  /** Set on the single primary action so it reads as separate from the rest of the bar. */
  prominent?: boolean;
}
/**
 * One shared glass background for a set of related items — group by function and frequency,
 * not by whatever happens to fit. Items inside are `.lg-item`s on the group's material, never
 * glass of their own: glass on glass is the fastest way to lose the material entirely.
 *
 * Do not mix symbols and text in one group; a group of both reads as a single wide button.
 * Text buttons get their own container, and the primary action stands alone.
 */
export const ToolbarGroup = forwardRef<HTMLDivElement, ToolbarGroupProps>(function ToolbarGroup(
  { className, children, prominent = false, radius = 'pill', ...props }, ref,
) {
  const [root, merged] = useMergedRef<HTMLDivElement>(ref);
  const fusion = useFusion(root, { itemSelector: ':scope > .lg-content > .lg-button' });
  useEffect(() => {
    // `process` does not exist in the offline preview bundle, so it is probed, not assumed.
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') return;
    const node = root.current; if (!node) return;
    const buttons = Array.from(node.querySelectorAll<HTMLElement>(':scope > .lg-content > .lg-button'));
    if (buttons.length < 2) return;
    const icons = buttons.filter(b => b.classList.contains('lg-icon-button')).length;
    if (icons > 0 && icons < buttons.length) {
      console.warn('[liquid-glass-ui] ToolbarGroup mixes icon-only and text buttons in one shared background; a mixed group reads as a single button. Split them into separate groups.', node);
    }
  }, [root, children]);
  return <GlassSurface {...props} ref={merged} radius={radius} data-prominent={prominent ? 'true' : undefined}
    className={cx('lg-toolbar-group', className)}>
    <SharedSurface value={true}>{fusion}{children}</SharedSurface>
  </GlassSurface>;
});

export interface ToolbarSpacerProps { variant?: 'fixed' | 'flexible' }
/**
 * Separates groups. `fixed` leaves a consistent gap between two related clusters;
 * `flexible` pushes them to opposite ends of the bar. This replaces the drawn divider —
 * the gap between two glass surfaces is the separator.
 */
export function ToolbarSpacer({ variant = 'fixed' }: ToolbarSpacerProps) {
  return <span className="lg-toolbar-spacer" data-variant={variant} aria-hidden="true" />;
}
