'use client';

/**
 * Focus that a surface handed out, rather than focus a reader moved.
 *
 * A focus ring answers one question: *where did the keyboard just go?* When a palette, a
 * dialog or a popover opens and puts the caret in its field, the keyboard did not go
 * anywhere — it was put there, by the same action that made the surface appear. The ring then
 * says nothing, and on a surface whose field spans its whole head it says it very loudly: the
 * command palette came up with a 2px accent ring around the entire panel, every time, before
 * the reader had touched anything.
 *
 * It cannot be fixed with `:focus-visible` alone, and that is not a bug in the selector. A
 * text field is specified to match `:focus-visible` whenever it is focused, however the focus
 * arrived — because for a field the ring is also what tells you typing will land there. That
 * is right for a field somebody clicked into and wrong for one that was focused *at* them.
 *
 * So the element that receives opening focus is marked, and the mark is dropped the moment
 * focus really moves: a Tab, a click elsewhere, anything that takes it away. From then on the
 * ring behaves exactly as it always did. The caret is what says where typing goes in the
 * meantime, which is the job it has on every platform.
 *
 * Marked rather than suppressed globally so that only the rules that opt in are affected —
 * `components.css` keys off `[data-lg-autofocus]` for the field, search and palette rings, and
 * nothing else changes. A menu item or an alert's Cancel button is still shown as focused,
 * because there the ring is the only thing saying which row Enter will fire.
 */
export function markOpenedFocus(node: Element | null | undefined) {
  if (!(node instanceof HTMLElement) || node.dataset.lgAutofocus) return;
  node.dataset.lgAutofocus = 'true';
  const clear = () => {
    delete node.dataset.lgAutofocus;
    node.removeEventListener('blur', clear);
    node.removeEventListener('keydown', onKeyDown);
  };
  /* Tab as well as blur: in a modal whose only focus stop is this field, Tab keeps focus where
     it is, so there would be no blur to notice — and a reader who pressed Tab is asking where
     the keyboard is. */
  const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Tab') clear(); };
  node.addEventListener('blur', clear);
  node.addEventListener('keydown', onKeyDown);
}

/** Mark first, then focus, so the ring never gets a frame to appear in. */
export function focusOnOpen(node: HTMLElement | null | undefined) {
  if (!node) return;
  markOpenedFocus(node);
  node.focus({ preventScroll: true });
}
