'use client';
import { useEffect, useId, useRef, useState, type InputHTMLAttributes, type ReactNode, type RefAttributes } from 'react';
import { cx, useControllable, useMergedRef } from '../system/utils.js';
import { LibraryIcon } from '../system/icon.js';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { useGlassStrings } from '../system/strings.js';

/** The ref, like every other attribute here, lands on the `<input>` — the thing worth holding. */
export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'size' | 'type'>, RefAttributes<HTMLInputElement>, GlassSurfaceOptions {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSubmitQuery?: (value: string) => void;
  'aria-label': string;
  clearLabel?: string;
  /**
   * Suggestions for what is typed so far. Pass them and the field becomes a combobox: Down
   * and Up move through the list, Enter takes the highlighted one, Escape closes it.
   *
   * Filtering is the caller's, always. Only the application knows what "matching" means for
   * its data — prefix, fuzzy, ranked, remote — and a library that guessed would be wrong
   * for most of them and impossible to override.
   */
  suggestions?: SearchSuggestion[];
  /** A suggestion was taken. The field's value follows it; this is the "go" signal. */
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
}

export interface SearchSuggestion {
  /** What goes into the field when this is taken, and what identifies it. */
  value: string;
  /** What is drawn, if it is more than the value: a match with its category, say. */
  label?: ReactNode;
  icon?: ReactNode;
}

/**
 * A capsule search field on its own glass surface — top-trailing on wide layouts, and on a
 * phone either the trailing search tab or a field that rises with the keyboard.
 *
 * `type="search"` gives the right on-screen keyboard and the platform's own clear gesture;
 * the drawn clear button is the pointer affordance on top of that. The focus ring lands on
 * the glass container via `:focus-within`, because the input's own outline is suppressed and
 * something has to replace it.
 */
export function SearchField(
  { value, defaultValue = '', onValueChange, onSubmitQuery, 'aria-label': label, clearLabel,
    suggestions, onSuggestionSelect,
    className, material, backdropTone, density, renderer, radius, refraction, size, chroma, id: providedId, ref, ...props }: SearchFieldProps,
) {
  // A caller's id has to win: it is how a `<label for>` or an `aria-controls` reaches the input.
  const strings = useGlassStrings();
  const generated = useId(); const id = providedId ?? `${generated}-search`;
  const [query, setQuery] = useControllable(value, defaultValue, onValueChange);
  const [input, mergedRef] = useMergedRef<HTMLInputElement>(ref);
  const glass = useGlassSurface<HTMLDivElement>({ material, backdropTone, density, renderer, radius: radius ?? 'pill', refraction, size, chroma });
  const form = useRef<HTMLFormElement>(null);

  /**
   * The combobox half, which only exists when there is something to suggest.
   *
   * `aria-activedescendant` rather than moving focus: focus stays in the field so typing keeps
   * working, and the highlighted option is named by id. Moving real focus into the list is the
   * common mistake — it stops the next keystroke reaching the input.
   */
  const listId = `${generated}-suggestions`;
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const list = suggestions ?? [];
  const showing = open && list.length > 0;
  // A suggestion list that changes under a highlight would leave it pointing at the wrong row.
  useEffect(() => { setActive(-1); }, [suggestions]);

  const take = (index: number) => {
    const suggestion = list[index]; if (!suggestion) return;
    setQuery(suggestion.value);
    setOpen(false); setActive(-1);
    onSuggestionSelect?.(suggestion);
    onSubmitQuery?.(suggestion.value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showing) {
      if (event.key === 'ArrowDown' && list.length) { event.preventDefault(); setOpen(true); setActive(0); }
      return;
    }
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive(index => (index + 1) % list.length); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive(index => (index - 1 + list.length) % list.length); }
    else if (event.key === 'Home') { event.preventDefault(); setActive(0); }
    else if (event.key === 'End') { event.preventDefault(); setActive(list.length - 1); }
    else if (event.key === 'Enter' && active >= 0) { event.preventDefault(); take(active); }
    /* Escape closes the list and stops there. The browser's own Escape on `type="search"`
       clears the field, and losing a query because the suggestions were open would be its
       own small disaster. */
    else if (event.key === 'Escape') { event.preventDefault(); setOpen(false); setActive(-1); }
  };

  return <form ref={form} role="search" className={cx('lg-search', className)} onSubmit={event => { event.preventDefault(); onSubmitQuery?.(query); }}>
    <div ref={glass.ref} {...glass.attributes} className="lg-root lg-search-box" style={glass.style}>
      {glass.decoration}
      <div className="lg-content">
        <LibraryIcon name="search" size={17} className="lg-search-icon" />
        <input {...props} ref={mergedRef} id={id} type="search" aria-label={label} className="lg-search-input"
          value={query}
          onChange={event => { setQuery(event.currentTarget.value); if (suggestions) setOpen(true); }}
          {...(suggestions ? {
            role: 'combobox',
            autoComplete: 'off',
            'aria-expanded': showing,
            'aria-controls': listId,
            'aria-autocomplete': 'list' as const,
            'aria-activedescendant': showing && active >= 0 ? `${listId}-${active}` : undefined,
            onKeyDown,
            onFocus: () => { if (list.length) setOpen(true); },
            /* Closed on the way out, not on blur of the input: a pointer press on an option
               blurs the field before the click lands, and closing there would eat it. */
            onBlur: event => { if (!event.currentTarget.closest('form')?.contains(event.relatedTarget as Node)) setOpen(false); },
          } : {})} />
        {query !== '' && <button type="button" className="lg-search-clear" aria-label={clearLabel ?? strings.clearSearch}
          onClick={() => { setQuery(''); input.current?.focus(); }}>
          <LibraryIcon name="clear" size={17} />
        </button>}
      </div>
    </div>
    {showing && <ul id={listId} role="listbox" aria-label={label} className="lg-search-suggestions">
      {list.map((suggestion, index) => <li
        key={suggestion.value}
        id={`${listId}-${index}`}
        role="option"
        aria-selected={index === active}
        className="lg-search-suggestion"
        /* `pointerdown`, not `click`: click fires after blur, and by then the list is gone. */
        onPointerDown={event => { event.preventDefault(); take(index); }}
        onPointerEnter={() => setActive(index)}>
        {suggestion.icon && <span className="lg-search-suggestion-icon" aria-hidden="true">{suggestion.icon}</span>}
        <span>{suggestion.label ?? suggestion.value}</span>
      </li>)}
    </ul>}
  </form>;
}
