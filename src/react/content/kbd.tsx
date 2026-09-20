'use client';
import { type HTMLAttributes, type RefAttributes } from 'react';
import { MODIFIER_ORDER, glyphFor, splitKeys, useCommandKey, type Modifier } from '../system/shortcut.js';
import { cx } from '../system/utils.js';

export interface KbdProps extends Omit<HTMLAttributes<HTMLElement>, 'children'>, RefAttributes<HTMLElement> {
  /**
   * The shortcut, as `"⌘K"`, `"Cmd+Shift+P"` or `"mod k"`. Words are turned into glyphs and
   * modifiers are put in the platform's order; anything unrecognised is passed through as
   * typed, so a key this does not know about still renders.
   *
   * `mod` is the one that is resolved rather than translated: Command on Apple hardware,
   * Control everywhere else — the same resolution `useShortcut` binds, so the hint and the
   * binding cannot say different things.
   */
  keys: string;
  /**
   * What a screen reader hears. Defaults to the shortcut spelled out in words, because the
   * glyphs on their own are announced as anything from silence to "place of interest sign".
   */
  'aria-label'?: string;
}

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
  /**
   * `mod` is the only part that changes with the machine, and deliberately so.
   *
   * The first version of this also swapped the glyphs for words away from Apple hardware —
   * "Ctrl+Alt+Delete" rather than ⌃⌥⌫ — on the reasoning that ⌃ is not printed on a PC
   * keycap. That is true and it is not this component's decision to make: a caller who wrote
   * `"ctrl alt delete"` asked for those keys, and `kbd.spec.ts` was right to fail. The defect
   * being fixed here is narrower than that, and only this: a hint that reads ⌘K while
   * `useShortcut` listens for Ctrl+K is a lie printed on the screen.
   */
  const commandKey = useCommandKey();
  const parts = splitKeys(keys).map(part => (part.toLowerCase() === 'mod'
    ? (commandKey ? '⌘' : '⌃')
    : glyphFor(part)));
  const modifiers = MODIFIER_ORDER.filter(symbol => parts.includes(symbol));
  const rest = parts.filter(part => !MODIFIER_ORDER.includes(part as Modifier));
  const ordered = [...modifiers, ...rest];
  const spoken = ordered.map(part => SPOKEN[part] ?? part).join(' ');

  return <kbd {...props} ref={ref} className={cx('lg-kbd', className)} aria-label={label ?? spoken}>
    {/* The glyphs are decoration once the element has words of its own. */}
    <span aria-hidden="true">{ordered.join('')}</span>
  </kbd>;
}
