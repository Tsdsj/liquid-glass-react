'use client';
import { useEffect, useId, useRef, useState, type HTMLAttributes, type ReactNode, type RefAttributes } from 'react';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { splitSurface } from '../system/props.js';
import { cx } from '../system/utils.js';
import { inDevelopment, warnOnce } from '../system/warn.js';
import { menuKeyboard, type GlassMenuItem } from './menu.js';

export interface ContextMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
  RefAttributes<HTMLDivElement>, GlassSurfaceOptions {
  /**
   * The commands. Keep it short: a context menu is what is most likely wanted *here*, not a
   * catalogue of everything possible.
   */
  items: GlassMenuItem[];
  /** What the menu is for, e.g. "照片操作". */
  'aria-label': string;
  /**
   * What it is a menu *on*. Wrapped rather than cloned, because the region has to be a real
   * box: the keyboard route has no pointer position and opens at the region's centre instead.
   */
  children: ReactNode;
  /** Milliseconds of touch before it opens. */
  longPressDelay?: number;
}

/** How far a finger may wander during a long press before it is a scroll instead. */
const SLOP = 10;

/**
 * A menu on the thing itself: right-click, long-press, or the keyboard's own menu key.
 *
 * The rule that matters most is the one that is not about the menu at all: **everything in it
 * has to be reachable some other way.** A context menu is a shortcut for people who know it
 * is there, and a command that lives only inside one is a command most people will never find.
 * Development mode cannot check that, so it is said here instead.
 *
 * Three triggers, because there are three kinds of user:
 *
 * - `contextmenu` — right-click, and also what a trackpad two-finger tap produces.
 * - A long press, for touch. Cancelled by movement, because a finger that moves was scrolling,
 *   and a menu that opens mid-scroll is a menu that appears when nobody asked.
 * - **Shift+F10 and the Menu key**, which is how the platform's own context menus are opened
 *   from a keyboard. Without them the whole feature is pointer-only.
 */
export function ContextMenu({
  items, 'aria-label': label, children, longPressDelay = 500, className, style, id: providedId, ref, ...rest
}: ContextMenuProps) {
  const [surface, props] = splitSurface(rest);
  const generated = useId(); const id = providedId ?? generated;
  const region = useRef<HTMLDivElement>(null);
  const glass = useGlassSurface<HTMLDivElement>({ ...surface, material: 'regular', size: 'large' });
  const [open, setOpen] = useState(false);
  const [at, setAt] = useState<{ x: number; y: number } | null>(null);
  const restore = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!inDevelopment() || !region.current || items.length <= 12) return;
    warnOnce(region.current, 'context-menu-long',
      `ContextMenu has ${items.length} commands. A context menu is what is most likely wanted here, not everything that is possible — past about a dozen it is a list to read rather than a shortcut.`);
  }, [items.length]);

  /**
   * Open at a point, or — for the keyboard, which has no pointer — at the region's centre.
   *
   * Stored in **document** coordinates. A menu pinned to a viewport position drifts off the
   * thing it belongs to the moment anything scrolls, and something always does: right-clicking
   * moves focus, and moving focus scrolls.
   */
  const show = (point: { x: number; y: number } | null) => {
    restore.current = document.activeElement as HTMLElement | null;
    const box = region.current?.getBoundingClientRect();
    const client = point ?? (box
      ? { x: box.left + box.width / 2, y: box.top + box.height / 2 }
      : { x: 0, y: 0 });
    setAt({ x: client.x + scrollX, y: client.y + scrollY });
    setOpen(true);
  };
  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus && restore.current?.isConnected) restore.current.focus({ preventScroll: true });
  };

  /* Touch. `pointerdown` on the region, cancelled by movement or by the finger lifting early. */
  useEffect(() => {
    const node = region.current; if (!node) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let start = { x: 0, y: 0 };
    const cancel = () => { if (timer) { clearTimeout(timer); timer = null; } };
    const down = (event: PointerEvent) => {
      if (event.pointerType !== 'touch' || !event.isPrimary) return;
      start = { x: event.clientX, y: event.clientY };
      cancel();
      timer = setTimeout(() => { timer = null; show(start); }, longPressDelay);
    };
    const move = (event: PointerEvent) => {
      if (!timer) return;
      if (Math.abs(event.clientX - start.x) > SLOP || Math.abs(event.clientY - start.y) > SLOP) cancel();
    };
    node.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', cancel);
    window.addEventListener('pointercancel', cancel);
    return () => {
      cancel();
      node.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', cancel);
      window.removeEventListener('pointercancel', cancel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [longPressDelay]);

  /** Place it at the pointer, kept inside the window. */
  useEffect(() => {
    const panel = glass.root.current;
    const anchor = at;
    if (!open || !panel || !anchor) return;
    if (typeof panel.showPopover !== 'function') { setOpen(false); return; }
    if (!panel.matches(':popover-open')) panel.showPopover();
    const place = () => {
      // Back to viewport coordinates, wherever the page has scrolled to since.
      const at = { x: anchor.x - scrollX, y: anchor.y - scrollY };
      const width = panel.offsetWidth, height = panel.offsetHeight;
      /* Opens down-and-trailing from the pointer, the way a system context menu does, and
         flips rather than overflows when there is no room that way. */
      const rtl = getComputedStyle(panel).direction === 'rtl';
      const preferred = rtl ? at.x - width : at.x;
      const left = Math.max(8, Math.min(preferred, innerWidth - width - 8));
      const top = at.y + height + 8 <= innerHeight ? at.y : Math.max(8, at.y - height);
      panel.style.left = `${left}px`;
      panel.style.top = `${top}px`;
      panel.style.setProperty('--lg-origin-x', `${Math.max(0, Math.min(100, (at.x - left) / width * 100))}%`);
      panel.style.setProperty('--lg-origin-y', top >= at.y ? '0%' : '100%');
    };
    place();
    panel.querySelector<HTMLElement>('[role="menuitem"]:not(:disabled),[role="menuitemcheckbox"]:not(:disabled)')?.focus({ preventScroll: true });

    /**
     * Dismissal is ours, which is why the popover is `manual`.
     *
     * An `auto` popover light-dismisses on the pointer event that follows the one which opened
     * it — and a right-click is pointerdown → contextmenu → **pointerup**, so the menu closed
     * itself on the way up. Deferring the open by a frame appeared to fix that and did not:
     * the frame and the pointerup race, and it worked at one window height and failed at
     * another. A race that resolves differently by viewport is not a fix.
     *
     * The rule is stated instead: a press that starts outside the panel closes it, and the
     * press that opened it has already finished by the time this listener exists.
     */
    const outside = (event: PointerEvent) => {
      if (!panel.contains(event.target as Node)) close(false);
    };
    /* Scrolling moves the menu with the content rather than closing it. Closing on any scroll
       was the other half of the same bug: right-clicking moves focus, moving focus scrolls,
       and the menu dismissed itself on a scroll it had caused. */
    const follow = () => { frame ||= requestAnimationFrame(() => { frame = 0; place(); }); };
    let frame = 0;
    window.addEventListener('pointerdown', outside, true);
    window.addEventListener('resize', follow);
    window.addEventListener('scroll', follow, true);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointerdown', outside, true);
      window.removeEventListener('resize', follow);
      window.removeEventListener('scroll', follow, true);
      if (panel.matches(':popover-open')) panel.hidePopover();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, at, glass.root]);

  return <>
    <div
      {...props}
      ref={node => {
        region.current = node;
        if (typeof ref === 'function') ref(node); else if (ref) ref.current = node;
      }}
      className={cx('lg-context-region', className)}
      style={style}
      /* No `aria-haspopup` here: on a wrapper with no role it is announced by nothing. It
         belongs on the caller's own control, where there is a role to qualify — and the
         keyboard route works regardless, because the key event bubbles from whatever inside
         has focus. */
      onContextMenu={event => { event.preventDefault(); show({ x: event.clientX, y: event.clientY }); }}
      onKeyDown={event => {
        // The platform's own keyboard route into a context menu, and the only one there is.
        if (event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey)) {
          event.preventDefault();
          show(null);
        }
      }}>
      {children}
    </div>

    <div id={id} ref={glass.ref} popover="manual" role="menu" tabIndex={-1} aria-label={label}
      {...glass.attributes} className="lg-root lg-menu lg-context-menu" style={glass.style}
      onToggle={event => { if ((event as unknown as { newState: string }).newState === 'closed') setOpen(false); }}
      onKeyDown={event => menuKeyboard(event, glass.root.current, close)}>
      {glass.decoration}<div className="lg-content">
        {items.map(item => <div key={item.key} role="none">
          {item.separatorBefore && <div role="separator" className="lg-menu-separator" />}
          <button type="button" role={item.checked === undefined ? 'menuitem' : 'menuitemcheckbox'}
            aria-checked={item.checked} tabIndex={-1} className="lg-menu-item" data-label={item.label}
            data-destructive={item.destructive ? 'true' : 'false'} disabled={item.disabled}
            onClick={() => { close(); item.onSelect(); }}>
            {item.icon && <span className="lg-menu-icon" aria-hidden="true">{item.icon}</span>}
            <span className="lg-menu-label">{item.label}</span>
            {item.shortcut && <span aria-hidden="true" className="lg-menu-shortcut">{item.shortcut}</span>}
          </button>
        </div>)}
      </div>
    </div>
  </>;
}
