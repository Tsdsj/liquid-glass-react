'use client';
import { useId, useRef, type InputHTMLAttributes, type RefAttributes } from 'react';
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
    className, material, backdropTone, density, renderer, radius, refraction, size, chroma, id: providedId, ref, ...props }: SearchFieldProps,
) {
  // A caller's id has to win: it is how a `<label for>` or an `aria-controls` reaches the input.
  const strings = useGlassStrings();
  const generated = useId(); const id = providedId ?? `${generated}-search`;
  const [query, setQuery] = useControllable(value, defaultValue, onValueChange);
  const [input, mergedRef] = useMergedRef<HTMLInputElement>(ref);
  const glass = useGlassSurface<HTMLDivElement>({ material, backdropTone, density, renderer, radius: radius ?? 'pill', refraction, size, chroma });
  const form = useRef<HTMLFormElement>(null);
  return <form ref={form} role="search" className={cx('lg-search', className)} onSubmit={event => { event.preventDefault(); onSubmitQuery?.(query); }}>
    <div ref={glass.ref} {...glass.attributes} className="lg-root lg-search-box" style={glass.style}>
      {glass.decoration}
      <div className="lg-content">
        <LibraryIcon name="search" size={17} className="lg-search-icon" />
        <input {...props} ref={mergedRef} id={id} type="search" aria-label={label} className="lg-search-input"
          value={query} onChange={event => setQuery(event.currentTarget.value)} />
        {query !== '' && <button type="button" className="lg-search-clear" aria-label={clearLabel ?? strings.clearSearch}
          onClick={() => { setQuery(''); input.current?.focus(); }}>
          <LibraryIcon name="clear" size={17} />
        </button>}
      </div>
    </div>
  </form>;
}
