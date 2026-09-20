'use client';
import { useEffect, useRef, type RefObject } from 'react';
/**
 * Pull / stretch choreography: while a pointer is held, the glass follows the pointer and
 * deforms along the drag; on release the CSS spring snaps it back.
 * Only custom properties are written (--lg-shift-*, --lg-stretch-*) so components decide how to use them.
 */
export interface PullRelease { dx: number; dy: number; cancelled: boolean; event: PointerEvent }
/** Travel, measured from the origin, that the offset may follow the pointer exactly. */
export interface PullRange { x?: [number, number]; y?: [number, number] }
export interface PullOptions {
  /** Max extra offset in CSS px once the pointer is past the 1:1 range (or past the origin, if there is none). */
  limit?: number;
  /** Deformation gain (0 disables stretch). */
  stretch?: number;
  axis?: 'both' | 'x' | 'y';
  /** Elements that receive the custom properties. Defaults to the source. */
  targets?: (event: PointerEvent) => HTMLElement[];
  /** Reference point the delta is measured from; defaults to the pointerdown position. Re-evaluated on every frame. */
  origin?: (event: PointerEvent) => { x: number; y: number } | null;
  /**
   * Window, measured from the origin, inside which the element tracks the pointer 1:1; outside
   * it the offset rubber-bands. A switch thumb has ~20px of travel and a segment lens has a
   * whole track, and rubber-banding every pixel of both is what makes a control feel like it is
   * merely leaning toward the finger instead of being carried by it.
   */
  range?: (event: PointerEvent) => PullRange | null;
  disabled?: (event: PointerEvent) => boolean;
  /**
   * Movement, in CSS px, before a press counts as a drag. Below it the gesture writes nothing
   * and marks nothing, so a press is only ever a press: whatever transition was running keeps
   * running, and a click stays a click.
   */
  threshold?: number;
  /**
   * Whether this press takes hold of the target at all, evaluated once when the pointer goes
   * down. A press that lands somewhere other than the thing being dragged is a click — and
   * possibly the start of a drag-select — but it is not a grab, and moving the target under the
   * finger to pretend otherwise is the most visible way one of these controls can look broken.
   * Defaults to true, which is right for a switch or a sheet: the whole control is the handle.
   */
  grab?: (event: PointerEvent) => boolean;
  onPress?: (event: PointerEvent) => void;
  /** Called once per frame while dragging, with the most recent move (before properties are written). */
  onMove?: (event: PointerEvent) => void;
  onRelease?: (info: PullRelease) => void;
}
/** Far enough that it was meant. Below this a press is a press; the system's own is about the same. */
const THRESHOLD = 4;
/** Milliseconds over which the element closes the gap the recogniser opened. */
const CATCH_UP = 50;
// `limit: 0` means "no travel at all" — without the guard that reads 0/0 and writes NaN out to CSS.
const rubber = (d: number, limit: number) => limit ? d * limit / (limit + Math.abs(d)) : 0;
/** 1:1 inside the free span, resisting past either end. */
function band(d: number, limit: number, free?: [number, number]) {
  if (!free) return rubber(d, limit);
  const [lo, hi] = free;
  if (d < lo) return lo + rubber(d - lo, limit);
  if (d > hi) return hi + rubber(d - hi, limit);
  return d;
}
/** Saturating response: proportional near zero, approaching the cap without ever sitting on it. */
const saturate = (t: number) => t / (1 + t);
/** Deformation ceiling, how strongly speed and resistance feed it, and the velocity smoothing per frame. */
const CAP = .26, FROM_SPEED = 2.4, FROM_RESIST = 3, SMOOTH = .28;
const PROPS = ['--lg-shift-x', '--lg-shift-y', '--lg-stretch-x', '--lg-stretch-y'];
export function attachPull(source: HTMLElement, getOptions: () => PullOptions = () => ({})): () => void {
  interface Active {
    id: number; x: number; y: number; targets: HTMLElement[]; frame: number;
    /** Latest move not yet consumed by the frame loop. */
    event: PointerEvent | null; fresh: boolean;
    /** Whether this press may carry its targets, decided once on the way down. */
    grab: boolean;
    /** Whether it has: false until the threshold is crossed, and nothing is written before that. */
    carrying: boolean;
    /** Where on the element it was grabbed, plus the freeze — taken out of every reading. */
    ax: number; ay: number;
    /** The travel the recogniser ate, handed back over the next few frames. */
    ex: number; ey: number;
    /** Applied offset and its smoothed velocity, so the deformation decays when the finger stops. */
    px: number; py: number; vx: number; vy: number; time: number;
    /** Last origin, to tell a moving reference point apart from a moving finger. */
    ox: number; oy: number;
  }
  let active: Active | null = null;
  const centreOf = (node: HTMLElement) => {
    const box = node.getBoundingClientRect();
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  };
  /**
   * The frame a press becomes a drag.
   *
   * `data-pulling` takes `transform` out of the target's transition list, which **cancels**
   * whatever transition is running and resolves the element to its destination. That is right
   * while the finger owns the element — it must not lag behind the pointer — and wrong in the
   * frame it takes over, where it reads as the animation being skipped. So the position is read
   * on both sides of the attribute and the difference is handed straight back as the starting
   * offset: the element carries on from exactly where it appeared, and the pointer takes it
   * from there.
   *
   * Two forced layout reads, once per gesture. The per-frame loop below still reads nothing.
   */
  const takeOver = (event: PointerEvent, o: PullOptions) => {
    if (!active) return;
    /* The first target is the one the offset is measured against. Where a control hands over
       more than one — the switch passes its thumb and its track — the rest are along for the
       ride and only the first actually uses `--lg-shift-*`. */
    const lead = active.targets[0];
    const before = centreOf(lead);
    for (const t of active.targets) t.setAttribute('data-pulling', 'true');
    // Reading the box resolves the cancelled transition, so this is the resting position.
    const after = centreOf(lead);
    // Measured now, while the offset is still unwritten: for the selection lens this reads the
    // slot centre, which is what the offset below is relative to.
    const origin = o.origin?.(event) ?? { x: active.x, y: active.y };
    const heldX = before.x - after.x, heldY = before.y - after.y;
    /**
     * Two parts, and they are different in kind.
     *
     * `ax` is permanent: where on the element the finger landed, and the freeze. It is what keeps
     * the grab point under the finger for the whole gesture instead of the element re-centring
     * on it.
     *
     * `ex` is temporary: the few pixels the pointer travelled before this was recognised as a
     * drag. Keeping it forever leaves the element trailing the finger by however fast the first
     * move happened to be — 8px for a careful drag, half a track for a flick. Dropping it in one
     * frame is a jump of the same size. So it is given back over the next few frames, and the
     * element ends up exactly where 1:1 tracking from the press would have put it.
     */
    active.ax = active.x - origin.x - heldX;
    active.ay = active.y - origin.y - heldY;
    active.ex = event.clientX - active.x;
    active.ey = event.clientY - active.y;
    active.px = heldX; active.py = heldY;
    active.vx = 0; active.vy = 0; active.time = performance.now();
    active.ox = origin.x; active.oy = origin.y;
    active.carrying = true;
  };
  const clear = (targets: HTMLElement[]) => { for (const t of targets) { for (const p of PROPS) t.style.removeProperty(p); t.removeAttribute('data-pulling'); } };
  /**
   * One frame: read the pointer, resolve the offset, write the properties. The loop runs for as
   * long as the gesture does rather than once per move, so a finger that stops moving lets the
   * stretch relax instead of freezing at whatever the last move produced.
   */
  const tick = () => {
    if (!active) return;
    active.frame = requestAnimationFrame(tick);
    const event = active.event; if (!event) return;
    const o = getOptions();
    /**
     * Nothing at all happens until the pointer has actually gone somewhere. This is the whole
     * of the fix for "the animation gets skipped when I click quickly": a press that writes no
     * offset and marks no attribute leaves a running transition running, and leaves the click
     * underneath it free to be a click.
     */
    const threshold = o.threshold ?? THRESHOLD;
    if (Math.abs(event.clientX - active.x) <= threshold && Math.abs(event.clientY - active.y) <= threshold) return;
    if (active.fresh) { active.fresh = false; o.onMove?.(event); }
    // A drag that did not start on the thing being dragged still reports (that is drag-select);
    // it just never moves it.
    if (!active.grab) return;
    if (!active.carrying) takeOver(event, o);
    const limit = o.limit ?? 12, gain = o.stretch ?? .6, axis = o.axis ?? 'both';
    const origin = o.origin?.(event) ?? { x: active.x, y: active.y };
    const free = o.range?.(event) ?? null;
    const dx = axis === 'y' ? 0 : event.clientX - origin.x - active.ax - active.ex;
    const dy = axis === 'x' ? 0 : event.clientY - origin.y - active.ay - active.ey;
    const px = band(dx, limit, free?.x), py = band(dy, limit, free?.y);
    const now = performance.now(), dt = Math.max(8, now - active.time);
    /**
     * The offset is measured from a reference point that can itself move — a selection change
     * puts the lens in a new slot, and the offset absorbs the difference in one step. That is the
     * reference frame moving, not the finger, so it must not register as speed or the glass
     * snaps taut for a frame over a gesture the user made smoothly.
     */
    const rebase = !(Math.abs(origin.x - active.ox) < .5 && Math.abs(origin.y - active.oy) < .5);
    active.ox = origin.x; active.oy = origin.y;
    if (!rebase) {
      active.vx += ((px - active.px) / dt - active.vx) * SMOOTH;
      active.vy += ((py - active.py) / dt - active.vy) * SMOOTH;
    }
    active.px = px; active.py = py; active.time = now;
    // The recogniser's toll, paid back. Framerate-independent, so it is the same on 120Hz.
    const catchUp = Math.min(1, dt / CATCH_UP);
    active.ex -= active.ex * catchUp; active.ey -= active.ey * catchUp;
    // Resistance: the part of the travel the band is holding back. Following freely does not deform.
    const rx = Math.abs(dx - px), ry = Math.abs(dy - py);
    for (const t of active.targets) {
      const w = t.offsetWidth || 1, h = t.offsetHeight || 1;
      const ex = CAP * saturate((Math.abs(active.vx) * FROM_SPEED + rx / w * FROM_RESIST) * gain);
      const ey = CAP * saturate((Math.abs(active.vy) * FROM_SPEED + ry / h * FROM_RESIST) * gain);
      t.style.setProperty('--lg-shift-x', `${px.toFixed(2)}px`); t.style.setProperty('--lg-shift-y', `${py.toFixed(2)}px`);
      t.style.setProperty('--lg-stretch-x', (1 + ex - ey * .45).toFixed(4)); t.style.setProperty('--lg-stretch-y', (1 + ey - ex * .45).toFixed(4));
    }
  };
  const move = (event: PointerEvent) => { if (active && event.pointerId === active.id) { active.event = event; active.fresh = true; } };
  const end = (event: PointerEvent, cancelled: boolean) => {
    if (!active || event.pointerId !== active.id) return;
    const info = { dx: event.clientX - active.x, dy: event.clientY - active.y, cancelled, event };
    cancelAnimationFrame(active.frame); clear(active.targets); active = null; detach();
    getOptions().onRelease?.(info);
  };
  const up = (event: PointerEvent) => end(event, false);
  const cancel = (event: PointerEvent) => end(event, true);
  /** A link or an image inside a control would otherwise start a native drag, which both shows a
      URL ghost and cancels the pointer stream the gesture is built on. */
  const suppressDrag = (event: Event) => { if (active) event.preventDefault(); };
  const detach = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', cancel); };
  const down = (event: PointerEvent) => {
    if (event.button !== 0 || !event.isPrimary || active) return;
    const o = getOptions(); if (o.disabled?.(event)) return;
    const targets = (o.targets?.(event) ?? [source]).filter(Boolean); if (!targets.length) return;
    active = {
      id: event.pointerId, x: event.clientX, y: event.clientY, targets, frame: 0, event, fresh: false,
      grab: o.grab?.(event) ?? true, carrying: false, ax: 0, ay: 0, ex: 0, ey: 0,
      px: 0, py: 0, vx: 0, vy: 0, time: performance.now(), ox: NaN, oy: NaN,
    };
    // `data-pulling` is not stamped here any more — see `takeOver`. A press that marks the
    // element as being dragged before it is being dragged is what cancelled the transition.
    o.onPress?.(event);
    window.addEventListener('pointermove', move, { passive: true }); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', cancel);
    active.frame = requestAnimationFrame(tick);
  };
  source.addEventListener('pointerdown', down);
  source.addEventListener('dragstart', suppressDrag);
  return () => {
    source.removeEventListener('pointerdown', down); source.removeEventListener('dragstart', suppressDrag);
    if (active) { cancelAnimationFrame(active.frame); clear(active.targets); active = null; } detach();
  };
}
export function usePull<T extends HTMLElement>(source: RefObject<T | null>, options: PullOptions, enabled = true) {
  const latest = useRef(options); latest.current = options;
  useEffect(() => { const node = source.current; if (!node || !enabled) return; return attachPull(node, () => latest.current); }, [source, enabled]);
}
/** Enabled segment / tab / link under the pointer at release time, for drag-to-select behaviour. */
export function elementAt(event: PointerEvent, selector: string): HTMLElement | null {
  const hit = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
  return hit?.closest<HTMLElement>(selector) ?? null;
}
