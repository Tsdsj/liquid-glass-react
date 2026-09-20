'use client';
import { useEffect, useId, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode, type RefAttributes } from 'react';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { splitSurface } from '../system/props.js';
import { Kbd } from '../content/kbd.js';
import { cx, useControllable } from '../system/utils.js';
import { triggerElement, usePopover, type Align, type OpenProps } from './anchor.js';

/**
 * What an item becomes while Option is held — Close becoming Close All, Duplicate becoming
 * Save As. It **replaces** the item it belongs to rather than appearing beside it, which is
 * what makes a long menu stay short.
 *
 * An alternate is a shorthand, never the only route to a command: nothing about holding a
 * modifier is discoverable, and a command that exists only there does not exist for anyone
 * using the keyboard by voice or one key at a time.
 */
export interface GlassMenuAlternate {
  label: string;
  onSelect: () => void;
  destructive?: boolean;
  shortcut?: string;
}

export interface GlassMenuItem {
  key: string; label: string; onSelect: () => void;
  disabled?: boolean; destructive?: boolean; shortcut?: string;
  alternate?: GlassMenuAlternate;
  /** Leading glyph. Introduce a related group with one symbol; do not decorate every row. */
  icon?: ReactNode;
  /** Checkmark for state. Reads as `aria-checked`, so it is not colour-only meaning. */
  checked?: boolean;
  separatorBefore?: boolean;
}
export interface GlassMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, RefAttributes<HTMLDivElement>, GlassSurfaceOptions, OpenProps {
  items: GlassMenuItem[]; 'aria-label': string; align?: Align;
  /** Where the menu opens relative to its trigger. `auto` flips up when there is no room below. */
  placement?: 'below' | 'above' | 'auto';
  /**
   * What a checkmark in this menu means. `multiple` (the default) is a set of independent
   * toggles, each item a `menuitemcheckbox`. `single` is one choice out of the list — a pop-up
   * button's menu — and the items become `menuitemradio`, which is what tells assistive
   * technology that picking one clears the others.
   */
  selection?: 'multiple' | 'single';
}

/**
 * A menu on large glass that morphs out of its trigger.
 *
 * The menu keyboard model is a contract, so the roles are real: Up/Down move, Home/End jump,
 * typing jumps to a matching label, Escape closes and returns focus, Tab closes. Keep groups
 * to about seven items and separate them rather than growing one long list.
 */
/**
 * The menu keyboard model, shared by every menu panel in the library.
 *
 * It is a contract rather than a convenience — Up and Down move, Home and End jump, typing
 * skips to a matching label, Escape closes and returns focus, Tab closes — so it lives in one
 * place. `ContextMenu` opens by a different route but is the same thing once it is open, and
 * two copies of this would drift.
 */
export function menuKeyboard(
  event: React.KeyboardEvent, panel: HTMLElement | null, close: () => void,
  search: { text: string; time: number } = shared,
) {
  if (event.key === 'Escape') { event.preventDefault(); close(); return; }
  if (event.key === 'Tab') { close(); return; }
  const enabled = Array.from(panel?.querySelectorAll<HTMLButtonElement>(
    '[role="menuitem"]:not(:disabled),[role="menuitemcheckbox"]:not(:disabled),[role="menuitemradio"]:not(:disabled)') ?? []);
  const index = enabled.indexOf(document.activeElement as HTMLButtonElement);
  if (!enabled.length) return;
  let next = index;
  if (event.key === 'ArrowDown') next = (index + 1) % enabled.length;
  else if (event.key === 'ArrowUp') next = (index - 1 + enabled.length) % enabled.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = enabled.length - 1;
  else if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
    const now = Date.now();
    search.text = (now - search.time > 700 ? '' : search.text) + event.key.toLocaleLowerCase();
    search.time = now;
    const match = [...enabled.slice(index + 1), ...enabled.slice(0, index + 1)]
      .find(button => button.dataset.label?.toLocaleLowerCase().startsWith(search.text));
    if (match) { event.preventDefault(); match.focus(); }
    return;
  } else return;
  event.preventDefault();
  enabled[next]?.focus();
}

/** Type-ahead state for a caller that does not keep its own. One menu is open at a time. */
const shared = { text: '', time: 0 };

/**
 * Whether Option is down right now, asked only while `active`.
 *
 * `keydown` and `keyup` both carry `altKey`, so one handler reads both edges and there is no
 * state to keep in step. The listener that matters most is the third one: a key held while the
 * window loses focus never delivers its `keyup`, and a menu left showing its alternates after
 * the user has tabbed away would run the wrong command on the next click.
 */
export function useOptionHeld(active: boolean) {
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (!active) { setHeld(false); return; }
    const sync = (event: KeyboardEvent) => setHeld(event.altKey);
    const release = () => setHeld(false);
    window.addEventListener('keydown', sync);
    window.addEventListener('keyup', sync);
    window.addEventListener('blur', release);
    return () => {
      window.removeEventListener('keydown', sync);
      window.removeEventListener('keyup', sync);
      window.removeEventListener('blur', release);
    };
  }, [active]);
  return held;
}

export function GlassMenu({ trigger, open: controlled, defaultOpen = false, onOpenChange, items, 'aria-label': label, className, style, align = 'end', placement = 'auto', selection = 'multiple', id: providedId, ref, ...rest }: GlassMenuProps) {
  const [surface, props] = splitSurface(rest);
  const generated = useId(); const id = providedId ?? generated; const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useControllable(controlled, defaultOpen, onOpenChange);
  const glass = useGlassSurface<HTMLDivElement>({ ...surface, material: 'regular', size: 'large' }, ref);
  const search = useRef({ text: '', time: 0 });
  usePopover(open, setOpen, glass.root, triggerRef, align, true, placement);
  const close = () => { setOpen(false); triggerRef.current?.focus(); };
  /* Only listened for when this menu is open and something in it has an alternate — a menu
     without one has no reason to re-render on every Option press anywhere in the window. */
  const optionHeld = useOptionHeld(open && items.some(item => item.alternate !== undefined));
  return <>
    {triggerElement(trigger, triggerRef, id, open, 'menu', setOpen)}
    <div {...props} id={id} ref={glass.ref} popover="auto" role="menu" tabIndex={-1} aria-label={label} {...glass.attributes}
      className={cx('lg-root lg-menu', className)} style={{ ...glass.style, ...style }}
      onKeyDown={event => menuKeyboard(event, glass.root.current, close, search.current)}>
      {glass.decoration}<div className="lg-content">{items.map((item, index) => {
        /* What this row is right now. An alternate replaces the item in place — same position,
           same row — which is the whole point: it is the command you were already reaching for,
           said differently. */
        const shown = optionHeld && item.alternate ? item.alternate : item;
        return <div key={item.key} role="none" style={{ '--lg-index': index } as CSSProperties}>
        {item.separatorBefore && <div role="separator" className="lg-menu-separator" />}
        <button type="button" role={item.checked === undefined ? 'menuitem' : selection === 'single' ? 'menuitemradio' : 'menuitemcheckbox'}
          aria-checked={item.checked} tabIndex={-1} className="lg-menu-item" data-label={shown.label}
            aria-keyshortcuts={shown.shortcut}
          data-alternate={shown === item ? undefined : 'true'}
          data-destructive={shown.destructive ? 'true' : 'false'} disabled={item.disabled}
          onClick={() => { close(); shown.onSelect(); }}>
          {item.icon && <span className="lg-menu-icon" aria-hidden="true">{item.icon}</span>}
          <span className="lg-menu-label">{shown.label}</span>
          {shown.shortcut && <Kbd className="lg-menu-shortcut" keys={shown.shortcut} aria-hidden="true" />}
        </button>
      </div>;
      })}</div>
    </div>
  </>;
}
