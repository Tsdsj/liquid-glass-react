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
  onPress?: (event: PointerEvent) => void;
  /** Called once per frame while held, with the most recent move (before properties are written). */
  onMove?: (event: PointerEvent) => void;
  onRelease?: (info: PullRelease) => void;
}
const rubber = (d: number, limit: number) => d * limit / (limit + Math.abs(d));
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
    /** Applied offset and its smoothed velocity, so the deformation decays when the finger stops. */
    px: number; py: number; vx: number; vy: number; time: number;
    /** Last origin, to tell a moving reference point apart from a moving finger. */
    ox: number; oy: number;
  }
  let active: Active | null = null;
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
    if (active.fresh) { active.fresh = false; o.onMove?.(event); }
    const limit = o.limit ?? 12, gain = o.stretch ?? .6, axis = o.axis ?? 'both';
    const origin = o.origin?.(event) ?? { x: active.x, y: active.y };
    const free = o.range?.(event) ?? null;
    const dx = axis === 'y' ? 0 : event.clientX - origin.x, dy = axis === 'x' ? 0 : event.clientY - origin.y;
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
    active = { id: event.pointerId, x: event.clientX, y: event.clientY, targets, frame: 0, event, fresh: false, px: 0, py: 0, vx: 0, vy: 0, time: performance.now(), ox: NaN, oy: NaN };
    for (const t of targets) t.setAttribute('data-pulling', 'true');
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
