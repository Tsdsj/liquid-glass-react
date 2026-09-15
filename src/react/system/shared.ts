'use client';
import { createContext, useContext } from 'react';
/**
 * Marks a region that already *is* a glass surface, so anything glass placed inside it renders
 * flat and borrows the surface it sits on instead of stacking a second blur and a second fill.
 *
 * Its own module so both the material engine and the surface components can read it without
 * importing each other.
 */
const SharedContext = createContext(false);
export const useSharedSurface = () => useContext(SharedContext);
export const SharedSurface = SharedContext.Provider;
