'use client';
import { createContext, useContext } from 'react';

/**
 * Every string the components would otherwise invent for themselves.
 *
 * These are the labels a caller never passes because they belong to the control rather than to
 * the content: the close button on a dialog, the two arrows on a stepper. Shipping them in
 * English and leaving it there means a Chinese, Arabic or German application reads as English
 * the moment an icon-only control appears — and those labels are exactly the ones only a
 * screen-reader user hears, so the mismatch is invisible in review.
 *
 * English is the only built-in set. The library does not guess a language from `navigator` or
 * from the document: deciding what an application speaks is the application's job, and a
 * `locale="zh"` prop would quietly make translation a library responsibility that the library
 * cannot keep up with. Pass the words instead.
 */
export interface GlassStrings {
  /** Dialog close button. */
  close: string;
  /** Action sheet cancel action. */
  cancel: string;
  /** Stepper decrement arrow. */
  decrease: string;
  /** Stepper increment arrow. */
  increase: string;
  /** Search field clear button. */
  clearSearch: string;
  /**
   * The direction word in a navigation stack's back button. The visible label is the previous
   * screen's title; the spoken name is this plus that title — "Back to Settings" — because
   * the title alone does not say which way it goes.
   */
  back: string;
  /**
   * The sheet's drag handle, which is a slider over the detents. Takes the sheet's own title so
   * the label says which sheet it resizes when more than one has been open.
   */
  sheetHeight: (title: string) => string;
}

export const defaultStrings: GlassStrings = {
  close: 'Close',
  cancel: 'Cancel',
  decrease: 'Decrease',
  increase: 'Increase',
  clearSearch: 'Clear search',
  back: 'Back to',
  sheetHeight: title => `${title} height`,
};

const StringsContext = createContext<GlassStrings>(defaultStrings);
export const StringsProvider = StringsContext.Provider;

/**
 * The strings in effect here. Nested providers merge, so an application can translate once at
 * the root and a single screen can still override one word.
 */
export function useGlassStrings(): GlassStrings {
  return useContext(StringsContext);
}
