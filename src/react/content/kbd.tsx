'use client';
import { type HTMLAttributes, type RefAttributes } from 'react';
import { cx } from '../system/utils.js';

/**
 * Modifier order on Apple platforms, and it is fixed: Control, Option, Shift, Command, with
 * Command last and nearest the key it modifies. Written out rather than sorted at runtime so
 * the order is visible in the source of the thing that enforces it.
 */
const MODIFIER_ORDER = ['⌃', '⌥', '⇧', '⌘'] as const;

/** The words people write, and the glyph each one is. */
const GLYPHS: Record<string, string> = {
  ctrl: '⌃', control: '⌃',
  alt: '⌥', opt: '⌥', option: '⌥',
  shift: '⇧',
  cmd: '⌘', command: '⌘', meta: '⌘', mod: '⌘',
  enter: '↩', return: '↩', esc: '⎋', escape: '⎋', tab: '⇥', delete: '⌫', backspace: '⌫',
  space: '␣', up: '↑', down: '↓', left: '←', right: '→',
};

export interface KbdProps extends Omit<HTMLAttributes<HTMLElement>, 'children'>, RefAttributes<HTMLElement> {
  /**
   * The shortcut, as `"⌘K"`, `"Cmd+Shift+P"` or `"mod k"`. Words are turned into glyphs and
   * modifiers are put in the platform's order; anything unrecognised is passed through as
   * typed, so a key this does not know about still renders.
   */
  keys: string;
  /**
   * What a screen reader hears. Defaults to the shortcut spelled out in words, because the
   * glyphs on their own are announced as anything from silence to "place of interest sign".
   */
  'aria-label'?: string;
}

/** Split on the separators people actually use, and drop the empties a trailing `+` leaves. */
const split = (keys: string) => keys.split(/[\s+-]+|(?<=[⌃⌥⇧⌘])/).map(part => part.trim()).filter(Boolean);

/** Glyph for a word, the word itself for anything unknown. Single letters are upper-cased. */
const glyph = (part: string) => GLYPHS[part.toLowerCase()] ?? (part.length === 1 ? part.toUpperCase() : part);

const SPOKEN: Record<string, string> = { '⌃': 'Control', '⌥': 'Option', '⇧': 'Shift', '⌘': 'Command', '↩': 'Return', '⎋': 'Escape', '⇥': 'Tab', '⌫': 'Delete', '␣': 'Space' };

/**
 * A keyboard shortcut, rendered the way the platform renders one.
 *
 * Two things it exists to get right, both of which were being done by hand. The **order** of
 * modifiers is not a preference — ⌃ ⌥ ⇧ ⌘, always, with Command nearest the key. And the
 * glyphs are silent or nonsensical to a screen reader, so the element carries words: "⌘K"
 * announces as "Command K" rather than as one unpronounceable character followed by a letter.
 *
 * Content layer. A shortcut hint is text about a command, not a control.
 */
export function Kbd({ keys, 'aria-label': label, className, ref, ...props }: KbdProps) {
  const parts = split(keys).map(glyph);
  const modifiers = MODIFIER_ORDER.filter(symbol => parts.includes(symbol));
  const rest = parts.filter(part => !MODIFIER_ORDER.includes(part as typeof MODIFIER_ORDER[number]));
  const ordered = [...modifiers, ...rest];
  const spoken = ordered.map(part => SPOKEN[part] ?? part).join(' ');

  return <kbd {...props} ref={ref} className={cx('lg-kbd', className)} aria-label={label ?? spoken}>
    {/* The glyphs are decoration once the element has words of its own. */}
    <span aria-hidden="true">{ordered.join('')}</span>
  </kbd>;
}
