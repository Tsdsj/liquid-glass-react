'use client';
import {
  useEffect, useId, useMemo, useRef, useState,
  type DialogHTMLAttributes, type ReactNode, type RefAttributes,
} from 'react';
import { Kbd } from '../content/kbd.js';
import { LibraryIcon } from '../system/icon.js';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { splitSurface } from '../system/props.js';
import { useShortcut } from '../system/shortcut.js';
import { useGlassStrings } from '../system/strings.js';
import { SharedSurface } from '../system/surface.js';
import { cx, useControllable } from '../system/utils.js';
import { triggerElement, type OpenProps } from './anchor.js';
import { useModalDialog } from './modal.js';
import { focusOnOpen } from '../system/focus.js';

export interface PaletteCommand {
  id: string;
  /** What it does, as a command: a verb. "Export as PDF", not "PDF export". */
  label: string;
  /** Section heading. Commands keep the order they were given in, inside their section. */
  group?: string;
  /** A second line — where this lives, or what it will do. */
  detail?: string;
  icon?: ReactNode;
  /** Written the way `Kbd` writes one: `"mod k"`, `"⇧⌘P"`. Drawn on the trailing edge. */
  shortcut?: string;
  /**
   * Words this should match on without showing them — synonyms, an old name, a romanisation.
   * A list or one string; a string is split on whitespace, so both read the same to the filter.
   */
  keywords?: string | string[];
  /** Shown but not runnable. A command that does not apply right now still belongs in the list. */
  disabled?: boolean;
  onSelect: () => void;
}

export interface CommandPaletteProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'title' | 'children' | 'open'>, RefAttributes<HTMLDialogElement>, GlassSurfaceOptions, OpenProps {
  commands: PaletteCommand[];
  /**
   * What this palette searches. Announced rather than drawn — the field says what to type, and
   * a title bar above a search field is the one thing Spotlight has never had.
   */
  title: string;
  placeholder?: string;
  /**
   * The keys that open it, resolved exactly as `Kbd` draws them. `null` binds nothing, for an
   * application that opens the palette its own way.
   */
  shortcut?: string | null;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /**
   * How a command is matched. `false` means the list already is the answer — the caller
   * filtered, ranked, or asked a server, and this should draw what it was handed.
   *
   * The default filter exists here and deliberately not in `SearchField`, and the difference is
   * not taste: a search field's results can be anywhere and only the application knows what
   * matching means for them, while a palette is handed every command it will ever show. Nothing
   * is hidden from a function that already has the whole list.
   */
  filter?: ((command: PaletteCommand, query: string) => boolean) | false;
  /** Shown when nothing matches. Say what would match instead of apologising. */
  emptyLabel?: ReactNode;
  /** How many matches to draw. The rest are still searchable; they are just not all on screen. */
  limit?: number;
}

/** Every word of the query has to turn up somewhere in the command. Case and order do not matter. */
const defaultFilter = (command: PaletteCommand, query: string) => {
  const keywords = Array.isArray(command.keywords) ? command.keywords.join(' ') : command.keywords ?? '';
  const haystack = `${command.label} ${command.group ?? ''} ${command.detail ?? ''} ${keywords}`.toLocaleLowerCase();
  return query.toLocaleLowerCase().split(/\s+/).filter(Boolean).every(word => haystack.includes(word));
};

/**
 * One field, one list, one keystroke to get there: the way a desktop application is driven
 * once somebody knows it.
 *
 * The accessibility model is a combobox over a listbox with **virtual focus** — real focus
 * never leaves the field, and the highlighted row is named by `aria-activedescendant`. Moving
 * focus into the list instead is the usual mistake, and it breaks the one thing a palette is
 * for: the next keystroke has to keep filtering.
 *
 * It keeps nothing. No history, no recently-used ordering, nothing written anywhere — a list
 * of what somebody has been doing is not something to put on screen by default, and an
 * application that wants it can order `commands` itself and offer a way to clear it.
 */
export function CommandPalette({
  commands, title, placeholder, shortcut = 'mod k',
  query: controlledQuery, defaultQuery = '', onQueryChange,
  filter = defaultFilter, emptyLabel, limit = 50,
  trigger, open: controlledOpen, defaultOpen = false, onOpenChange,
  className, style, id: providedId, ref, ...rest
}: CommandPaletteProps) {
  const [surface, props] = splitSurface(rest);
  const strings = useGlassStrings();
  const generated = useId(); const id = providedId ?? generated;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useControllable(controlledOpen, defaultOpen, onOpenChange);
  const [query, setQuery] = useControllable(controlledQuery, defaultQuery, onQueryChange);
  const glass = useGlassSurface<HTMLDialogElement>({ ...surface, material: 'regular', size: 'large', radius: surface.radius ?? 22 }, ref);

  useModalDialog(open, glass.root, triggerRef, () => focusOnOpen(inputRef.current));

  /**
   * Two bindings, not one toggle, because they are two different shortcuts.
   *
   * The one that opens it is the application's and must not fire while a modal is up — that is
   * `useShortcut`'s rule and it is the right one. The one that closes it is scoped to this
   * dialog, which is exactly what makes it the exception: the same keys, asked for from inside
   * the thing they opened.
   */
  useShortcut(shortcut, () => setOpen(true), { enabled: !open });
  useShortcut(shortcut, () => setOpen(false), { enabled: open, scope: glass.root });

  const matches = useMemo(() => {
    const matching = filter === false || query.trim() === ''
      ? commands
      : commands.filter(command => filter(command, query));
    return matching.slice(0, limit);
  }, [commands, query, filter, limit]);

  const [active, setActive] = useState(0);
  /**
   * The highlight is reset by what the list *contains*, not by the array's identity: `commands`
   * is nearly always built inline and is therefore a new array every render, and keying on
   * identity would clear the highlight one render after every arrow press.
   */
  const listKey = matches.map(command => command.id).join(' ');
  useEffect(() => { setActive(matches.findIndex(command => !command.disabled)); }, [listKey]); // eslint-disable-line react-hooks/exhaustive-deps
  /**
   * Opening resets the highlight as well as the query — the palette keeps nothing between two
   * openings, which is what the API documentation promises and what makes ⌘K, Enter a
   * predictable pair of keystrokes.
   *
   * Clearing only the query was not enough: with the same commands on screen the list's
   * contents were unchanged, so the effect above never re-ran, and the palette came back with
   * an empty field and last time's row lit up — pointing at a different command from the one
   * under the cursor.
   */
  useEffect(() => {
    if (open) setActive(matches.findIndex(command => !command.disabled));
    else setQuery('');
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const listId = `${id}-list`;
  const optionId = (index: number) => `${listId}-${index}`;

  /** The next runnable row in a direction, wrapping. A disabled command is drawn, never landed on. */
  const step = (from: number, delta: number) => {
    if (!matches.length) return -1;
    for (let hop = 1; hop <= matches.length; hop++) {
      const index = (from + delta * hop + matches.length * hop) % matches.length;
      if (!matches[index].disabled) return index;
    }
    return -1;
  };

  const run = (index: number) => {
    const command = matches[index];
    if (!command || command.disabled) return;
    // Closed first, so focus is back where it came from before the command does anything with it.
    setOpen(false);
    command.onSelect();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive(current => step(current, 1)); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive(current => step(current, -1)); }
    else if (event.key === 'Home') { event.preventDefault(); setActive(step(-1, 1)); }
    else if (event.key === 'End') { event.preventDefault(); setActive(step(0, -1)); }
    else if (event.key === 'Enter') { event.preventDefault(); run(active); }
    /**
     * Tab has nowhere to go, and letting it try loses the keyboard altogether.
     *
     * The field is the palette's only focus stop — the rows are options, named by
     * `aria-activedescendant`, not focus stops — and everything outside a modal dialog is
     * inert. So Tab walked off the end of the dialog and landed on `<body>`: the ring went
     * out, typing stopped working, and the only way back was the mouse. Measured, not
     * reasoned about.
     *
     * Staying put is also what the reader asked for. Tab means "where is the keyboard" as much
     * as "move it", and the answer here is: still in the field, and now wearing its ring.
     */
    else if (event.key === 'Tab') event.preventDefault();
    /* Escape is left alone: it reaches the dialog, which cancels, which closes — the platform's
       own way out rather than a second one that has to be kept in step with it. */
  };

  /** Keep the highlighted row on screen without moving focus or the page. */
  useEffect(() => {
    if (!open || active < 0) return;
    glass.root.current?.querySelector(`#${CSS.escape(optionId(active))}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open, listKey]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Section headings, in the order the sections first appear. A command with no group comes
     first and without a heading — it is not "Other", it is simply the list. */
  const sections: { name?: string; entries: { command: PaletteCommand; index: number }[] }[] = [];
  matches.forEach((command, index) => {
    const last = sections[sections.length - 1];
    if (last && last.name === command.group) last.entries.push({ command, index });
    else sections.push({ name: command.group, entries: [{ command, index }] });
  });

  return <>
    {triggerElement(trigger, triggerRef, id, open, 'dialog', setOpen)}
    <dialog {...props} id={id} ref={glass.ref} aria-labelledby={`${id}-title`} {...glass.attributes}
      className={cx('lg-root lg-dialog lg-palette', className)} style={{ ...glass.style, ...style }}
      onCancel={event => { event.preventDefault(); setOpen(false); }}
      onClose={() => { if (!glass.root.current?.open) setOpen(false); }}
      /* A press on the dimmed area closes. Measured rather than inferred from the target: the
         dialog's own padding is also the dialog, and closing on a press there would mean the
         panel dismissed itself when somebody missed the field by four pixels. */
      onPointerDown={event => {
        if (event.target !== event.currentTarget) return;
        const rect = glass.root.current?.getBoundingClientRect(); if (!rect) return;
        if (event.clientX < rect.left || event.clientX > rect.right
          || event.clientY < rect.top || event.clientY > rect.bottom) setOpen(false);
      }}>
      {glass.decoration}<div className="lg-content"><SharedSurface value={true}>
        <h2 id={`${id}-title`} className="lg-visually-hidden">{title}</h2>
        <div className="lg-palette-field">
          <LibraryIcon name="search" size={18} className="lg-palette-icon" />
          <input ref={inputRef} type="text" className="lg-palette-input"
            role="combobox" aria-expanded={matches.length > 0} aria-controls={listId}
            aria-autocomplete="list" aria-label={title}
            aria-activedescendant={active >= 0 && matches.length ? optionId(active) : undefined}
            autoComplete="off" spellCheck={false}
            placeholder={placeholder ?? strings.searchCommands}
            value={query} onChange={event => setQuery(event.currentTarget.value)} onKeyDown={onKeyDown} />
        </div>
        <div id={listId} role="listbox" aria-label={title} className="lg-palette-list">
          {sections.map((section, sectionIndex) => {
            const headingId = `${listId}-section-${sectionIndex}`;
            const rows = section.entries.map(({ command, index }) => <div key={command.id}
              id={optionId(index)} role="option" className="lg-palette-option"
              aria-selected={index === active} aria-disabled={command.disabled || undefined}
              /* `pointerdown` with its default prevented, rather than `click`: the press is
                 what takes focus off the field, and a row is not focusable, so focus lands on
                 nothing at all. Most visible on the press that runs nothing — a disabled row
                 leaves the palette open, and typing would have stopped working. */
              onPointerDown={event => { event.preventDefault(); run(index); }}
              onPointerMove={() => { if (!command.disabled && index !== active) setActive(index); }}>
              {command.icon && <span className="lg-palette-option-icon" aria-hidden="true">{command.icon}</span>}
              <span className="lg-palette-option-text">
                <span className="lg-palette-option-label">{command.label}</span>
                {command.detail && <span className="lg-palette-option-detail">{command.detail}</span>}
              </span>
              {command.shortcut && <Kbd className="lg-palette-option-shortcut" keys={command.shortcut} aria-hidden="true" />}
            </div>);
            return section.name
              ? <div key={headingId} role="group" aria-labelledby={headingId}>
                <div id={headingId} role="presentation" className="lg-palette-section">{section.name}</div>
                {rows}
              </div>
              : <div key={headingId} role="presentation">{rows}</div>;
          })}
        </div>
        {matches.length === 0 && <p className="lg-palette-empty" role="status">{emptyLabel ?? strings.noResults}</p>}
      </SharedSurface></div>
    </dialog>
  </>;
}
