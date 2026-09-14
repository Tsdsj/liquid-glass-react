'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useId, useRef } from 'react';
import { cx, useControllable, useMergedRef } from '../system/utils.js';
import { LibraryIcon } from '../system/icon.js';
import { useGlassSurface } from '../system/material.js';
/**
 * A capsule search field on its own glass surface — top-trailing on wide layouts, and on a
 * phone either the trailing search tab or a field that rises with the keyboard.
 *
 * `type="search"` gives the right on-screen keyboard and the platform's own clear gesture;
 * the drawn clear button is the pointer affordance on top of that. The focus ring lands on
 * the glass container via `:focus-within`, because the input's own outline is suppressed and
 * something has to replace it.
 */
export const SearchField = forwardRef(function SearchField({ value, defaultValue = '', onValueChange, onSubmitQuery, 'aria-label': label, clearLabel = 'Clear search', className, material, backdropTone, density, renderer, radius, refraction, size, chroma, ...props }, ref) {
    const id = useId();
    const [query, setQuery] = useControllable(value, defaultValue, onValueChange);
    const [input, mergedRef] = useMergedRef(ref);
    const glass = useGlassSurface({ material, backdropTone, density, renderer, radius: radius ?? 'pill', refraction, size, chroma });
    const form = useRef(null);
    return _jsx("form", { ref: form, role: "search", className: cx('lg-search', className), onSubmit: event => { event.preventDefault(); onSubmitQuery?.(query); }, children: _jsxs("div", { ref: glass.ref, ...glass.attributes, className: "lg-root lg-search-box", style: glass.style, children: [glass.decoration, _jsxs("div", { className: "lg-content", children: [_jsx(LibraryIcon, { name: "search", size: 17, className: "lg-search-icon" }), _jsx("input", { ...props, ref: mergedRef, id: `${id}-search`, type: "search", "aria-label": label, className: "lg-search-input", value: query, onChange: event => setQuery(event.currentTarget.value) }), query !== '' && _jsx("button", { type: "button", className: "lg-search-clear", "aria-label": clearLabel, onClick: () => { setQuery(''); input.current?.focus(); }, children: _jsx(LibraryIcon, { name: "clear", size: 17 }) })] })] }) });
});
