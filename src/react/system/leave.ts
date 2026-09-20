'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * How long an exit plays before the element is taken out of the tree.
 *
 * It has to exist twice — once here and once as `--lg-duration-exit` — because removing a node
 * from the DOM is not something CSS can wait for, and the two numbers being different is the
 * kind of mistake that shows up as a notice that blinks out halfway through leaving.
 * `tests/core/stylesheet.test.mjs` asserts they are equal.
 */
export const EXIT_MS = 220;

/** The same arrangement for `--lg-duration-layout`, used where a layout change animates. */
export const LAYOUT_MS = 280;

/**
 * Hold a removal open long enough for the exit to play.
 *
 * "materialize, not fade" cuts both ways: a notice that appears with a spring and then simply
 * stops existing is half an animation, and the missing half is the one that tells the reader
 * the thing went away rather than that they lost track of it.
 *
 * `leaving` goes on the element as `data-leaving`, which is what the stylesheet animates;
 * `close()` is what the dismiss button and the timer call instead of the caller's own handler.
 * Under reduced motion there is no animation to wait for, so the commit happens immediately —
 * waiting out a duration with nothing moving is a delay, not an animation.
 */
/**
 * True for the length of one change of `on`, and false the rest of the time.
 *
 * For an element whose *size* is animated only when it is being shown or hidden. A transition
 * declared unconditionally would also catch every other reason the size changed — dragging a
 * split view's divider made the sidebar chase the pointer over a quarter of a second instead
 * of tracking it, and the arrow keys stopped appearing to do anything at all.
 *
 * Set during render rather than in an effect, deliberately: the attribute has to reach the DOM
 * in the same commit as the change it is describing, because a transition is decided from the
 * style the element has *after* the change. A frame later is too late and nothing animates.
 */
export function useToggling(on: boolean, duration = LAYOUT_MS) {
  const [toggling, setToggling] = useState(false);
  const previous = useRef(on);
  if (previous.current !== on) { previous.current = on; if (!toggling) setToggling(true); }
  useEffect(() => {
    if (!toggling) return;
    const timer = setTimeout(() => setToggling(false), duration);
    return () => clearTimeout(timer);
  }, [toggling, on, duration]);
  return toggling;
}

export function useLeave(reduceMotion: boolean, commit: () => void) {
  const [leaving, setLeaving] = useState(false);
  const timer = useRef(0);
  const latest = useRef(commit); latest.current = commit;
  useEffect(() => () => clearTimeout(timer.current), []);

  const close = useCallback(() => {
    if (reduceMotion) return latest.current();
    // A second press during the exit is not a second dismissal.
    if (timer.current) return;
    setLeaving(true);
    timer.current = window.setTimeout(() => { timer.current = 0; latest.current(); }, EXIT_MS);
  }, [reduceMotion]);

  return { leaving, close };
}
