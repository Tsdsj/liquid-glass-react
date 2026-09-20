'use client';
import { useEffect, useRef, useState, type HTMLAttributes, type KeyboardEvent, type PointerEvent, type RefAttributes } from 'react';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { splitSurface } from '../system/props.js';
import { SharedSurface } from '../system/surface.js';
import { cx, useControllable } from '../system/utils.js';
import { inDevelopment, warnOnce } from '../system/warn.js';
import { GlassMenu, type GlassMenuItem } from '../overlays/menu.js';

export interface MenuBarMenu {
  key: string;
  /**
   * One word wherever one word will do — the titles are scanned, not read, and the bar has to
   * survive a narrow window. Title case if it takes more than one.
   */
  title: string;
  items: GlassMenuItem[];
  /**
   * What a checkmark in this menu means, exactly as on `GlassMenu`. `multiple` (the default)
   * is a set of independent toggles; `single` is one choice out of the list.
   *
   * It is per menu rather than per bar because one menu bar routinely has both: Appearance is
   * one choice out of three, and the accessibility switches are three independent ones. A menu
   * of radios announced as checkboxes tells a screen-reader user that picking another will
   * leave the first one on, which is not what happens.
   */
  selection?: 'multiple' | 'single';
  /**
   * A whole menu that does not apply right now. Still drawn: a menu bar that changes shape is
   * a menu bar nobody can learn. Same rule one level down — disable an item, never hide it.
   */
  disabled?: boolean;
}

export interface MenuBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, RefAttributes<HTMLDivElement>, GlassSurfaceOptions {
  menus: MenuBarMenu[];
  'aria-label': string;
  /** Which menu is open, if the application wants to drive it. `null` is "none". */
  open?: string | null;
  defaultOpen?: string | null;
  onOpenChange?: (key: string | null) => void;
}

/**
 * The command surface of a desktop application: a row of titles, each one a menu.
 *
 * What separates it from a row of menu buttons is what happens once one is open. The bar takes
 * over: moving the pointer across the titles walks the open menu along with it, and so do the
 * arrow keys — **one** press per menu, not close-then-open. That is the behaviour people have
 * from every Mac they have ever used, and without it a menu bar is a row of buttons that
 * happen to be next to each other.
 *
 * The rest is the same contract `GlassMenu` already keeps: Down opens, the menu keyboard model
 * takes over inside, Escape closes and hands focus back to the title. The whole bar is one tab
 * stop, so Tab crosses it rather than walking through every menu in it.
 *
 * Navigation layer, so it is glass — but only the bar. The titles are items on it.
 */
export function MenuBar({
  menus, 'aria-label': label, open: controlledOpen, defaultOpen = null, onOpenChange,
  className, style, ref, ...rest
}: MenuBarProps) {
  const [surface, props] = splitSurface(rest);
  const glass = useGlassSurface<HTMLDivElement>({ ...surface, radius: surface.radius ?? 'pill' }, ref);
  const [openKey, setOpenKey] = useControllable<string | null>(controlledOpen, defaultOpen, onOpenChange);

  /**
   * Which title Tab lands on. Follows the menu that is open, and otherwise the last one
   * touched — a menu bar you tab back into should be where you left it.
   */
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const enabled = menus.filter(menu => !menu.disabled);
  const current = openKey ?? focusKey;
  const tabStop = enabled.find(menu => menu.key === current)?.key ?? enabled[0]?.key;

  useEffect(() => {
    if (!inDevelopment()) return;
    const node = glass.root.current; if (!node) return;
    const empty = menus.find(menu => menu.items.length === 0);
    if (empty) {
      warnOnce(node, 'menubar-empty',
        `MenuBar menu "${empty.title}" has no items, so it is a title that opens nothing. Give it its commands, disabled if they do not apply, or leave the menu out.`);
    }
  }, [menus, glass.root]);

  const titleAt = (key: string) =>
    glass.root.current?.querySelector<HTMLButtonElement>(`[data-menu-key="${CSS.escape(key)}"]`) ?? null;

  const jump = (menu: MenuBarMenu | undefined) => {
    if (!menu) return;
    setFocusKey(menu.key);
    titleAt(menu.key)?.focus();
  };

  const move = (from: string | null, delta: number) => {
    if (!enabled.length) return;
    const index = enabled.findIndex(menu => menu.key === from);
    const next = enabled[(index + delta + enabled.length) % enabled.length] ?? enabled[0];
    setFocusKey(next.key);
    /* Open stays open. This is the part a row of menu buttons cannot do: the arrow key moves
       the open menu rather than closing one and opening another, so there is no frame in
       between with nothing on screen. */
    if (openKey !== null) setOpenKey(next.key); else titleAt(next.key)?.focus();
  };

  const keyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    /* The open menu's own keyboard model runs first and marks what it used — Up and Down,
       Home and End, type-ahead, Escape. Only what it left goes to the bar. */
    if (event.defaultPrevented || event.ctrlKey || event.metaKey) return;
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const forward = rtl ? 'ArrowLeft' : 'ArrowRight';
    const backward = rtl ? 'ArrowRight' : 'ArrowLeft';
    if (event.key === forward) { event.preventDefault(); move(current, 1); }
    else if (event.key === backward) { event.preventDefault(); move(current, -1); }
    else if (event.key === 'ArrowDown' && openKey === null && tabStop) { event.preventDefault(); setOpenKey(tabStop); }
    else if (event.key === 'Home' && openKey === null) { event.preventDefault(); jump(enabled[0]); }
    else if (event.key === 'End' && openKey === null) { event.preventDefault(); jump(enabled[enabled.length - 1]); }
  };

  /**
   * Where the pointer was the last time the bar heard from it.
   *
   * Not bookkeeping — it is the difference between "the pointer moved onto this title" and
   * "this title moved under the pointer". Opening a menu with the mouse leaves the cursor
   * parked on that title; walking to the next menu with the arrow keys hides one panel and
   * shows another, and the browser then re-runs its boundary logic and delivers a pointer
   * event at the cursor's unchanged position. Read as a hover, that yanks the menu straight
   * back to where the mouse happens to be sitting — press Right, watch it go right and bounce
   * back. A synthesised event repeats the last coordinates exactly, so comparing them is what
   * tells the two apart.
   */
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  /**
   * Moving the pointer onto a title while a menu is open switches to it, and only then: with
   * nothing open the pointer is passing over, not asking for anything.
   *
   * Mouse and pen only. A finger dragging across the bar is scrolling or is on its way
   * somewhere, and opening four menus on the way past is not what it asked for.
   */
  const hover = (event: PointerEvent<HTMLButtonElement>, menu: MenuBarMenu) => {
    if (event.pointerType === 'touch' || openKey === null || menu.disabled || menu.key === openKey) return;
    const previous = lastPoint.current;
    if (previous && previous.x === event.clientX && previous.y === event.clientY) return;
    setFocusKey(menu.key);
    setOpenKey(menu.key);
  };
  /* Recorded on the way up through the bar, so a title's own handler has run first and is
     still comparing against the position before this event. */
  const seen = (event: PointerEvent<HTMLDivElement>) => {
    lastPoint.current = { x: event.clientX, y: event.clientY };
  };

  return <div {...props} ref={glass.ref} {...glass.attributes} role="menubar" aria-label={label} aria-orientation="horizontal"
    className={cx('lg-root lg-menubar', className)} style={{ ...glass.style, ...style }} onKeyDown={keyboard}
    onPointerMove={seen} onPointerDown={seen}>
    {glass.decoration}
    <div className="lg-content"><SharedSurface value={true}>
      {menus.map(menu => <GlassMenu
        key={menu.key}
        aria-label={menu.title}
        items={menu.items}
        selection={menu.selection}
        align="start"
        placement="below"
        open={openKey === menu.key}
        /* Reported by the panel rather than only by the title: a press outside light-dismisses
           it in the browser, and the bar has to hear about that or it would still believe a
           menu is open and keep walking the pointer along the titles. */
        onOpenChange={next => { setFocusKey(menu.key); setOpenKey(next ? menu.key : null); }}
        trigger={<button type="button" role="menuitem" className="lg-menubar-title"
          data-menu-key={menu.key} disabled={menu.disabled}
          tabIndex={menu.key === tabStop ? 0 : -1}
          onFocus={() => setFocusKey(menu.key)}
          onPointerEnter={event => hover(event, menu)}>{menu.title}</button>} />)}
    </SharedSurface></div>
  </div>;
}
