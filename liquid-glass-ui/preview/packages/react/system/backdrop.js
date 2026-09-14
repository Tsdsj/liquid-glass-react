'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
/**
 * Small Liquid Glass flips light/dark with whatever is behind it. Doing that honestly
 * needs to know the tone of the backdrop, and this library deliberately does not read it:
 * sampling would mean rasterising the page (DOM screenshots, cross-origin pixel reads),
 * which the project forbids. Instead a region declares its own tone once, and every
 * small glass surface inside inherits it.
 *
 * `mixed` is the safe default: an unknown backdrop keeps the app appearance and forces
 * `clear` back to `regular` rather than guessing.
 */
const BackdropToneContext = createContext('mixed');
export const useBackdropTone = () => useContext(BackdropToneContext);
/** Context-only form, for when you do not want an extra element in the tree. */
export function BackdropToneProvider({ tone, children }) {
    return _jsx(BackdropToneContext.Provider, { value: tone, children: children });
}
/**
 * A region whose tone is known — a photo, a video, a dark hero. Glass inside adapts to it
 * without any surface having to be told individually.
 */
export function GlassBackdrop({ tone, children, ...props }) {
    return _jsx("div", { ...props, "data-lg-backdrop-tone": tone, children: _jsx(BackdropToneContext.Provider, { value: tone, children: children }) });
}
