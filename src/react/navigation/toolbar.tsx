'use client';
import { useCallback, useEffect, type HTMLAttributes, type KeyboardEvent, type ReactNode, type RefAttributes } from 'react';
import { useFusion } from '../system/fusion.js';
import { GlassSurface, SharedSurface, type GlassSurfaceProps } from '../system/surface.js';
import { inDevelopment, warnOnce } from '../system/warn.js';
import { cx, useMergedRef } from '../system/utils.js';
import { useOverflow } from '../system/overflow.js';
import { useGlassStrings } from '../system/strings.js';
import { LibraryIcon } from '../system/icon.js';
import { GlassButton, GlassIconButton } from '../controls/button.js';
import { GlassMenu } from '../overlays/menu.js';

export interface GlassToolbarProps extends HTMLAttributes<HTMLDivElement>, RefAttributes<HTMLDivElement> {
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
export function GlassToolbar(
  { className, children, orientation = 'horizontal', onKeyDown, onFocusCapture, ref, ...props }: GlassToolbarProps,
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
}

export interface ToolbarItem {
  key: string;
  /** The name of the action. Visible on a text item, the accessible name on an icon one. */
  label: string;
  /** A monochrome symbol. Present means an icon button; absent means a text button. */
  icon?: ReactNode;
  onSelect: () => void;
  disabled?: boolean;
  /** Shown in the overflow menu, where there is room for it. */
  shortcut?: string;
}

export interface ToolbarGroupProps extends GlassSurfaceProps {
  /** Set on the single primary action so it reads as separate from the rest of the bar. */
  prominent?: boolean;
  /**
   * The group's items as data, which is what lets the group collapse the ones that do not fit
   * into a "More" menu at its trailing end.
   *
   * Children can do everything else a group does, and cannot do this: to put a button in a
   * menu the group has to know what that button is *called*, and reading a name back out of an
   * arbitrary child is guesswork that fails silently on the day someone passes an icon with no
   * label. So the overflow lives behind the one shape that carries names.
   */
  items?: ToolbarItem[];
}
/**
 * One shared glass background for a set of related items — group by function and frequency,
 * not by whatever happens to fit. Items inside are `.lg-item`s on the group's material, never
 * glass of their own: glass on glass is the fastest way to lose the material entirely.
 *
 * Do not mix symbols and text in one group; a group of both reads as a single wide button.
 * Text buttons get their own container, and the primary action stands alone.
 */
export function ToolbarGroup(
  { className, children, prominent = false, radius = 'pill', items, ref, ...props }: ToolbarGroupProps,
) {
  const [root, merged] = useMergedRef<HTMLDivElement>(ref);
  const fusion = useFusion(root, { itemSelector: ':scope > .lg-content > .lg-button' });
  const strings = useGlassStrings();
  const { containerRef, itemRef, triggerRef, hidden, measuring } = useOverflow(items?.length ?? 0);
  useEffect(() => {
    if (!inDevelopment()) return;
    const node = root.current; if (!node) return;
    const buttons = Array.from(node.querySelectorAll<HTMLElement>(':scope > .lg-content > .lg-button'));
    if (buttons.length < 2) return;
    const icons = buttons.filter(b => b.classList.contains('lg-icon-button')).length;
    if (icons > 0 && icons < buttons.length) {
      warnOnce(node, 'mixed-group', 'ToolbarGroup mixes icon-only and text buttons in one shared background; a mixed group reads as a single button. Split them into separate groups.');
    }
  }, [root, children]);

  /**
   * The group's own row is what gets measured, and it is `.lg-content` — the element the
   * surface puts its children in. Resolved from the root here rather than exposed as a second
   * ref on `GlassSurface`: one internal element, one place that knows about it.
   */
  const attach = useCallback((node: HTMLDivElement | null) => {
    merged(node);
    containerRef(node?.querySelector<HTMLElement>(':scope > .lg-content') ?? null);
  }, [merged, containerRef]);

  const folded = items && !measuring ? items.slice(items.length - Math.min(hidden, items.length)) : [];
  const shown = items ? items.slice(0, items.length - folded.length) : [];

  return <GlassSurface {...props} ref={items ? attach : merged} radius={radius} data-prominent={prominent ? 'true' : undefined}
    data-overflow={items ? 'true' : undefined}
    className={cx('lg-toolbar-group', className)}>
    <SharedSurface value={true}>
      {fusion}
      {items
        ? <>
          {shown.map((item, index) => (item.icon
            ? <GlassIconButton key={item.key} ref={itemRef(index)} aria-label={item.label}
              disabled={item.disabled} onClick={item.onSelect}>{item.icon}</GlassIconButton>
            : <GlassButton key={item.key} ref={itemRef(index)} disabled={item.disabled}
              onClick={item.onSelect}>{item.label}</GlassButton>))}
          {folded.length > 0 && <GlassMenu
            aria-label={strings.moreToolbarItems}
            items={folded.map(item => ({
              key: item.key, label: item.label, icon: item.icon, shortcut: item.shortcut,
              disabled: item.disabled, onSelect: item.onSelect,
            }))}
            trigger={<GlassIconButton ref={triggerRef} aria-label={strings.moreToolbarItems}>
              <LibraryIcon name="ellipsis" size={18} />
            </GlassIconButton>} />}
        </>
        : children}
    </SharedSurface>
  </GlassSurface>;
}

export interface ToolbarSpacerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>, RefAttributes<HTMLSpanElement> {
  variant?: 'fixed' | 'flexible';
}
/**
 * Separates groups. `fixed` leaves a consistent gap between two related clusters;
 * `flexible` pushes them to opposite ends of the bar. This replaces the drawn divider —
 * the gap between two glass surfaces is the separator.
 */
export function ToolbarSpacer({ variant = 'fixed', className, ref, ...props }: ToolbarSpacerProps) {
  return <span {...props} ref={ref} className={cx('lg-toolbar-spacer', className)} data-variant={variant} aria-hidden="true" />;
}
