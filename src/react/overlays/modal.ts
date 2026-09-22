'use client';
import { useEffect, useRef, type RefObject } from 'react';
import { lockScroll } from './anchor.js';
import { markOpenedFocus } from '../system/focus.js';

/**
 * A native modal `<dialog>`, driven by controlled React state.
 *
 * Four overlays in this library are the same dialog with different contents, and the part they
 * share is not styling — it is the sequence that makes a modal a modal: remember what had
 * focus, `showModal()` so the browser owns the top layer and the focus containment, lock the
 * page behind it, and on the way out close, unlock, and put focus back where it came from.
 * Written four times it drifts four ways, and the half anybody notices is the last step: a
 * dialog that closes and leaves focus on `<body>` drops a keyboard user at the top of the page.
 *
 * `onOpen` is for whatever each overlay does once it is up — an alert moving focus to the safe
 * action, a sheet painting its first detent. Held in a ref rather than taken as a dependency so
 * that it can close over fresh state without re-running the effect, which would close and
 * reopen the dialog mid-interaction.
 */
export function useModalDialog(
  open: boolean,
  node: RefObject<HTMLDialogElement | null>,
  trigger: RefObject<HTMLButtonElement | null>,
  onOpen?: (dialog: HTMLDialogElement) => void,
) {
  const latest = useRef(onOpen); latest.current = onOpen;
  const restore = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const dialog = node.current; if (!dialog) return;
    if (!open) { if (dialog.open) dialog.close(); return; }
    restore.current = document.activeElement as HTMLElement | null;
    if (!dialog.open) dialog.showModal();
    latest.current?.(dialog);
    /* `showModal()` gives focus to the dialog's first control on its own, so a dialog holding
       a text field comes up with that field's ring already lit. Same rule as the overlays that
       place focus themselves — see `markOpenedFocus`. */
    if (dialog.contains(document.activeElement)) markOpenedFocus(document.activeElement);
    const unlock = lockScroll();
    return () => {
      if (dialog.open) dialog.close();
      unlock();
      /* The trigger if there was one, otherwise whatever had focus when this opened — a
         palette opened by a keyboard shortcut has no trigger at all. */
      const target = trigger.current ?? restore.current;
      if (target?.isConnected) target.focus({ preventScroll: true });
    };
  }, [open, node, trigger]);
}
