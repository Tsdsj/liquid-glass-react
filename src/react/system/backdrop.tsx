'use client';
import { createContext, useContext, type HTMLAttributes, type ReactNode } from 'react';
import type { BackdropTone } from '../../tokens/index.js';

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
const BackdropToneContext = createContext<BackdropTone>('mixed');
export const useBackdropTone = () => useContext(BackdropToneContext);

export interface BackdropToneProviderProps { tone: BackdropTone; children: ReactNode }
/** Context-only form, for when you do not want an extra element in the tree. */
export function BackdropToneProvider({ tone, children }: BackdropToneProviderProps) {
  return <BackdropToneContext.Provider value={tone}>{children}</BackdropToneContext.Provider>;
}

export interface GlassBackdropProps extends HTMLAttributes<HTMLDivElement> { tone: BackdropTone }
/**
 * A region whose tone is known — a photo, a video, a dark hero. Glass inside adapts to it
 * without any surface having to be told individually.
 */
export function GlassBackdrop({ tone, children, ...props }: GlassBackdropProps) {
  return <div {...props} data-lg-backdrop-tone={tone}>
    <BackdropToneContext.Provider value={tone}>{children}</BackdropToneContext.Provider>
  </div>;
}
