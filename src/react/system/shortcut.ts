'use client';
import { useEffect, useMemo, useRef, useSyncExternalStore, type RefObject } from 'react';
import { inDevelopment } from './warn.js';

/**
 * Keyboard shortcuts: one place that knows what a written shortcut means.
 *
 * `Kbd` could already draw `"mod k"` as ⌘K, which is half of it — the half that cannot be
 * wrong in a way anybody notices. The other half is binding it, and the two have to come from
 * the same parse or the interface prints one shortcut and listens for another. That is the
 * failure this module exists to make impossible: `useShortcut` and `Kbd` read the same table
 * and resolve `mod` the same way.
 */

/** The words people write, and the glyph each one is. */
const GLYPHS: Record<string, string> = {
  ctrl: '⌃', control: '⌃',
  alt: '⌥', opt: '⌥', option: '⌥',
  shift: '⇧',
  cmd: '⌘', command: '⌘', meta: '⌘',
  enter: '↩', return: '↩', esc: '⎋', escape: '⎋', tab: '⇥', delete: '⌫', backspace: '⌫',
  space: '␣', up: '↑', down: '↓', left: '←', right: '→',
};

/**
 * Modifier order on Apple platforms, and it is fixed: Control, Option, Shift, Command, with
 * Command last and nearest the key it modifies.
 */
export const MODIFIER_ORDER = ['⌃', '⌥', '⇧', '⌘'] as const;
export type Modifier = typeof MODIFIER_ORDER[number];

/** Split on the separators people actually use, and drop the empties a trailing `+` leaves. */
export const splitKeys = (keys: string) =>
  keys.split(/[\s+-]+|(?<=[⌃⌥⇧⌘])/).map(part => part.trim()).filter(Boolean);

/** Glyph for a word, the word itself for anything unknown. Single letters are upper-cased. */
export const glyphFor = (part: string) =>
  GLYPHS[part.toLowerCase()] ?? (part.length === 1 ? part.toUpperCase() : part);

/**
 * Whether ⌘ is this machine's command modifier.
 *
 * `mod` is the whole reason this is a question: it means "the key this platform uses for
 * commands", which is Command on Apple hardware and Control everywhere else. A hint that reads
 * ⌘K on Windows while the handler waits for Ctrl+K is a lie printed on the screen, so the
 * component that draws the hint and the hook that binds it both go through here.
 *
 * Through `useSyncExternalStore` with a server snapshot of `true`: the server cannot know, and
 * an outright guess during hydration is a mismatch. React renders the server's answer first and
 * re-renders with the real one, which is the same machinery `useMediaQuery` uses.
 */
const applePlatform = () => {
  if (typeof navigator === 'undefined') return true;
  const data = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData;
  return /mac|iphone|ipad|ipod/i.test(data?.platform || navigator.platform || navigator.userAgent);
};
const neverChanges = () => () => {};
export const useCommandKey = () =>
  useSyncExternalStore(neverChanges, applePlatform, () => true);

export interface Shortcut {
  /** The non-modifier key, upper-cased for letters — compared against `event.key`. */
  key: string;
  meta: boolean; ctrl: boolean; alt: boolean; shift: boolean;
}

/** What `event.key` is for the glyphs that stand for a named key. */
const KEY_NAMES: Record<string, string> = {
  '↩': 'Enter', '⎋': 'Escape', '⇥': 'Tab', '⌫': 'Backspace', '␣': ' ',
  '↑': 'ArrowUp', '↓': 'ArrowDown', '←': 'ArrowLeft', '→': 'ArrowRight',
};

/**
 * `"mod k"` → the combination to listen for.
 *
 * `commandKey` decides what `mod` resolves to, and it is a parameter rather than something
 * this function works out for itself so that a test can ask both questions and a server render
 * cannot accidentally ask the wrong one.
 */
export function parseShortcut(keys: string, commandKey: boolean): Shortcut | null {
  const parts = splitKeys(keys).map(part => (part.toLowerCase() === 'mod'
    ? (commandKey ? '⌘' : '⌃')
    : glyphFor(part)));
  const rest = parts.filter(part => !(MODIFIER_ORDER as readonly string[]).includes(part));
  if (rest.length !== 1) return null;
  const key = KEY_NAMES[rest[0]] ?? rest[0];
  return {
    key,
    meta: parts.includes('⌘'), ctrl: parts.includes('⌃'),
    alt: parts.includes('⌥'), shift: parts.includes('⇧'),
  };
}

/**
 * Compared on `event.key`, not on `event.code`.
 *
 * `code` is the physical key and would make ⌘Z land on a different letter for anyone using a
 * layout other than QWERTY. Letters are compared case-insensitively because Shift and Option
 * both change what `key` reports — on a Mac, ⌥K is "˚".
 */
export function matchesShortcut(event: KeyboardEvent, shortcut: Shortcut): boolean {
  if (event.metaKey !== shortcut.meta || event.ctrlKey !== shortcut.ctrl) return false;
  if (event.altKey !== shortcut.alt || event.shiftKey !== shortcut.shift) return false;
  const pressed = event.key.length === 1 ? event.key.toUpperCase() : event.key;
  return pressed === shortcut.key
    // The letter under the key, for the layouts and modifiers that change what `key` reports.
    || (shortcut.key.length === 1 && event.code === `Key${shortcut.key}`);
}

/** Where a shortcut is allowed to fire from. */
export interface UseShortcutOptions {
  /** Off without unmounting — a command that is not available right now. */
  enabled?: boolean;
  /**
   * The element this shortcut belongs to. A shortcut with no scope is the application's; one
   * with a scope only fires while the event came from inside it.
   */
  scope?: RefObject<HTMLElement | null>;
  /** Let the browser's own binding through as well. Off by default. */
  passive?: boolean;
}

/**
 * The elements where a bare letter is a letter.
 *
 * A shortcut with no modifier — "/" for search, "n" for new — must not fire while somebody is
 * writing the letter n. With a modifier it may: ⌘F inside a text field is still Find.
 */
const writing = (node: EventTarget | null) => node instanceof HTMLElement
  && (node.isContentEditable || /^(input|textarea|select)$/i.test(node.tagName));

/** The modal on screen, if there is one. */
const openModal = () => document.querySelector<HTMLElement>('dialog[open], [role="dialog"][aria-modal="true"]');

/**
 * Every shortcut currently bound, so two commands cannot quietly claim the same keys.
 *
 * Development only, and a plain `Map` keyed by the combination with a count — bound and
 * unbound in pairs by the effect, so it cannot grow without bound the way a list of every
 * shortcut ever registered would.
 */
const bound = new Map<string, number>();
const describe = (shortcut: Shortcut) =>
  `${shortcut.ctrl ? '⌃' : ''}${shortcut.alt ? '⌥' : ''}${shortcut.shift ? '⇧' : ''}${shortcut.meta ? '⌘' : ''}${shortcut.key}`;

/**
 * Bind a keyboard shortcut for as long as this component is mounted.
 *
 * ```tsx
 * useShortcut('mod k', () => setPaletteOpen(true));
 * ```
 *
 * Three rules, all of them about **not** firing:
 *
 * - **A modal takes the keyboard with it.** While a dialog or an alert is open, only shortcuts
 *   scoped inside it fire; the application's own stop until it closes. Otherwise ⌘S saves the
 *   document behind the sheet that is asking whether to save it.
 * - **A bare letter is a letter while someone is typing.** No modifier and the event came from
 *   a field: it is text. With a modifier it still fires, because ⌘F in a text field is Find.
 * - **Held keys fire once.** `event.repeat` is a key still down, not a second command.
 *
 * In development it warns when two live shortcuts resolve to the same combination — which is
 * the failure you cannot see, because the one that wins is whichever mounted first.
 */
export function useShortcut(
  keys: string | null | undefined,
  handler: (event: KeyboardEvent) => void,
  { enabled = true, scope, passive = false }: UseShortcutOptions = {},
) {
  const commandKey = useCommandKey();
  const shortcut = useMemo(() => (keys ? parseShortcut(keys, commandKey) : null), [keys, commandKey]);
  const latest = useRef(handler); latest.current = handler;

  useEffect(() => {
    if (!shortcut || !enabled || typeof document === 'undefined') return;
    const combination = describe(shortcut);
    if (inDevelopment()) {
      const count = (bound.get(combination) ?? 0) + 1;
      bound.set(combination, count);
      if (count === 2) {
        console.warn(`[liquid-glass-ui] Two commands are bound to ${combination}. `
          + 'Whichever mounted first will win, which is not a decision anybody made.');
      }
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.repeat || event.defaultPrevented) return;
      if (!matchesShortcut(event, shortcut)) return;
      const bare = !shortcut.meta && !shortcut.ctrl && !shortcut.alt;
      if (bare && writing(event.target)) return;
      const modal = openModal();
      const inside = scope?.current ?? null;
      if (modal && !(inside && modal.contains(inside))) return;
      if (inside && !inside.contains(event.target as Node)) return;
      if (!passive) event.preventDefault();
      latest.current(event);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (inDevelopment()) {
        const count = (bound.get(combination) ?? 1) - 1;
        if (count > 0) bound.set(combination, count); else bound.delete(combination);
      }
    };
  }, [shortcut, enabled, scope, passive]);
}
