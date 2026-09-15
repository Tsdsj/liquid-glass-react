'use client';
import { useEffect, useId, useRef, type ReactNode, type RefObject } from 'react';
import { clamp } from '../../core/index.js';
import { useGlassPolicy } from './provider.js';
/**
 * Liquid droplet fusion for controls that share one surface. A decorative, aria-hidden layer sits
 * behind the pills and mirrors their live rects as solid blobs; a goo filter (blur + alpha threshold)
 * merges blobs that come close into one smooth shape, so a pill pulled toward its neighbour grows a
 * bridge and springs apart on release. Foreground text and icons are never filtered.
 */
export interface FusionOptions {
  /** Fusable items inside the surface, e.g. `':scope > .lg-content > .lg-button'`. Disabled items never fuse. */
  itemSelector: string;
  /** Selection-lens mode: the lens is the primary blob and its previous slot leaves a collapsing trail. */
  lensSelector?: string;
}
/** Goo pass tuned against 44px pills: 6px blur, then an alpha ramp steep enough to re-crisp the edge. */
const BLUR = 7, SLOPE = 22, INTERCEPT = -9;
/** The alpha threshold pushes a straight edge out by ~0.23 * blur; inset the blobs by the same amount. */
const EDGE = 1.6;
/** Pull distance (px) that fully engages a neighbour, and the widest gap that may still fuse. */
const REACH = 11, GATE = 40;
/** Neighbour lean toward the pressed pill, and its swell at full attraction. */
const LEAN = 4, SWELL = .04;
/** Release fade of a pressed pill, how long the loop outlives it, the lens trail life and the lens settle window. */
const FADE = 220, RELEASE = 320, TRAIL = 300, SETTLE = 560;
/**
 * Hand-back: the goo draws the pill while it is fusing and the element's own CSS draws it the
 * rest of the time. Switching between the two in one frame is visible as a pop, so the two
 * representations cross-fade over this window and the layer only shuts down once it is invisible.
 */
const EXIT = 200;
/** Hard cap: one pressed pill plus at most two neighbours. */
const BLOBS = 3;
interface Blob { x: number; y: number; w: number; h: number; r: number }
function paint(node: HTMLElement | null, blob: Blob | null) {
  if (!node) return;
  if (!blob || blob.w < .5 || blob.h < .5) { node.style.width = '0px'; node.style.height = '0px'; return; }
  node.style.width = `${blob.w.toFixed(2)}px`;
  node.style.height = `${blob.h.toFixed(2)}px`;
  node.style.borderRadius = `${blob.r.toFixed(2)}px`;
  node.style.transform = `translate(${blob.x.toFixed(2)}px,${blob.y.toFixed(2)}px)`;
}
export function useFusion<T extends HTMLElement>(root: RefObject<T | null>, options: FusionOptions): ReactNode {
  const policy = useGlassPolicy();
  // Reduced motion, reduced transparency (which already covers forced colours and opaque mode) always win.
  const enabled = !policy.reduceMotion && !policy.reduceTransparency && !policy.forcedColors;
  const filterId = `lg-fusion-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const layer = useRef<HTMLSpanElement>(null);
  const sheen = useRef<HTMLSpanElement>(null);
  const blobs = useRef<(HTMLSpanElement | null)[]>([]);
  const latest = useRef(options); latest.current = options;
  useEffect(() => {
    const host = root.current, box = layer.current;
    if (!host || !box || !enabled) return;
    let frame = 0, held = false, releaseAt = 0, deadline = 0, exitAt = 0, faded = false;
    let primary: HTMLElement | null = null, neighbours: HTMLElement[] = [], radius = 9999, last = 0;
    /** Smoothed attraction per neighbour, so droplets grow and melt apart with a little liquid lag. */
    const attraction = [0, 0];
    let trail: Blob | null = null, trailAt = 0, slot = '';
    const items = () => Array.from(host.querySelectorAll<HTMLElement>(latest.current.itemSelector))
      .filter(node => !node.matches(':disabled,[aria-disabled="true"],[data-disabled="true"]') && node.getClientRects().length > 0);
    const stop = () => {
      cancelAnimationFrame(frame); frame = 0; primary = null; neighbours = []; trail = null; releaseAt = 0; last = 0; exitAt = 0; faded = false;
      attraction[0] = attraction[1] = 0;
      host.removeAttribute('data-fusion');
      host.style.setProperty('--lg-fusion-fade', '0');
      if (sheen.current) sheen.current.style.opacity = '0';
      for (const node of blobs.current) paint(node, null);
    };
    const round = (w: number, h: number) => Math.min(radius, Math.min(w, h) / 2);
    /** One rAF tick: every rect is read first, then every style is written. */
    const step = () => {
      frame = requestAnimationFrame(step);
      const now = performance.now();
      const source = latest.current.lensSelector ? host.querySelector<HTMLElement>(latest.current.lensSelector) : primary;
      if (!source) { stop(); return; }
      const lens = !!latest.current.lensSelector;
      // --- reads ---
      const lb = box.getBoundingClientRect();
      const pr = source.getBoundingClientRect();
      const rects = lens ? [] : neighbours.map(node => node.getBoundingClientRect());
      const lightX = source.style.getPropertyValue('--lg-light-x') || '50%';
      const lightY = source.style.getPropertyValue('--lg-light-y') || '50%';
      // Pull's own rubber-banded offset: the pressed rect grows around the pointer, so its centre is not a reach.
      const shiftX = parseFloat(source.style.getPropertyValue('--lg-shift-x')) || 0;
      const shiftY = parseFloat(source.style.getPropertyValue('--lg-shift-y')) || 0;
      const smooth = clamp((last ? now - last : 16) / 90, 0, 1); last = now;
      if (held) { releaseAt = 0; deadline = now + SETTLE; exitAt = 0; faded = false; }
      // Everything has settled: start handing the pill back to the element's own CSS.
      if (!exitAt && (lens ? now > deadline : releaseAt && now - releaseAt > RELEASE)) exitAt = now;
      const exit = exitAt ? clamp(1 - (now - exitAt) / EXIT, 0, 1) : 1;
      const fade = (lens ? 1 : releaseAt ? clamp(1 - (now - releaseAt) / FADE, 0, 1) : 1) * exit;
      // --- geometry ---
      const px = pr.left - lb.left, py = pr.top - lb.top;
      const cx = px + pr.width / 2, cy = py + pr.height / 2;
      const shapes: (Blob | null)[] = [{ x: px + EDGE, y: py + EDGE, w: pr.width - EDGE * 2, h: pr.height - EDGE * 2, r: round(pr.width, pr.height) }];
      if (lens && trail) {
        const age = clamp((now - trailAt) / TRAIL, 0, 1), k = 1 - age;
        if (age >= 1) trail = null;
        else {
          // The old slot collapses in place while drifting after the lens; the goo dissolves it once it is small.
          const tw = trail.w * k, th = trail.h * k;
          const tcx = trail.x + trail.w / 2 + (cx - (trail.x + trail.w / 2)) * age * .7;
          const tcy = trail.y + trail.h / 2 + (cy - (trail.y + trail.h / 2)) * age * .7;
          shapes.push({ x: tcx - tw / 2, y: tcy - th / 2, w: tw, h: th, r: Math.min(tw, th) / 2 });
        }
      }
      for (let i = 0; i < rects.length; i++) {
        const n = rects[i];
        const nx = n.left - lb.left, ny = n.top - lb.top;
        const ncx = nx + n.width / 2, ncy = ny + n.height / 2;
        const dx = ncx - cx, dy = ncy - cy;
        const horizontal = Math.abs(dx) >= Math.abs(dy);
        const sign = (horizontal ? dx : dy) >= 0 ? 1 : -1;
        const reach = (horizontal ? shiftX : shiftY) * sign;
        const gap = horizontal
          ? (sign > 0 ? nx - (px + pr.width) : px - (nx + n.width))
          : (sign > 0 ? ny - (py + pr.height) : py - (ny + n.height));
        const target = gap > GATE ? 0 : clamp((reach - 1) / REACH, 0, 1) * fade;
        attraction[i] += (target - attraction[i]) * smooth;
        const d = attraction[i];
        if (d <= .02) { shapes.push(null); continue; }
        // A droplet emerges from nothing on the facing edge, then grows into the full neighbour pill.
        const emerge = Math.min(1, d * 4) * (1 + SWELL * d);
        const h0 = n.height * (.34 + .66 * d);
        const bw = Math.min(n.width, h0 + (n.width - h0) * d) * emerge, bh = h0 * emerge;
        const nearX = horizontal ? (sign > 0 ? nx + bw / 2 : nx + n.width - bw / 2) : ncx;
        const nearY = horizontal ? ncy : (sign > 0 ? ny + bh / 2 : ny + n.height - bh / 2);
        const bcx = nearX + (ncx - nearX) * d - (horizontal ? sign * LEAN * d : 0);
        const bcy = nearY + (ncy - nearY) * d - (horizontal ? 0 : sign * LEAN * d);
        shapes.push({ x: bcx - bw / 2, y: bcy - bh / 2, w: bw, h: bh, r: Math.min(bw, bh) / 2 });
      }
      // --- writes ---
      // On the host, not the layer: the element the goo is standing in for has to read it too.
      host.style.setProperty('--lg-fusion-fade', fade.toFixed(3));
      for (let i = 0; i < BLOBS; i++) paint(blobs.current[i], shapes[i] ?? null);
      const crisp = sheen.current;
      if (crisp) {
        // As the pills become one body the pressed pill's own rim would read as a seam, so it dissolves.
        crisp.style.opacity = (fade * (1 - .8 * Math.max(attraction[0], attraction[1]))).toFixed(3);
        crisp.style.width = `${pr.width.toFixed(2)}px`; crisp.style.height = `${pr.height.toFixed(2)}px`;
        crisp.style.borderRadius = `${round(pr.width, pr.height).toFixed(2)}px`;
        crisp.style.transform = `translate(${px.toFixed(2)}px,${py.toFixed(2)}px)`;
        crisp.style.setProperty('--lg-light-x', lightX); crisp.style.setProperty('--lg-light-y', lightY);
      }
      // Shut down one frame after the fade reaches zero, not on the same one: the element only
      // takes the pill back cleanly if it is already at full strength when the layer disappears.
      if (exitAt && exit <= 0) { if (faded) stop(); else faded = true; }
    };
    const start = () => { if (!frame) frame = requestAnimationFrame(step); };
    const release = () => { held = false; releaseAt = performance.now(); deadline = performance.now() + SETTLE; };
    const detach = () => { window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); };
    const up = () => { release(); detach(); };
    const down = (event: PointerEvent) => {
      if (event.button !== 0 || !event.isPrimary) return;
      const list = items();
      if (list.length < 2) return;
      if (latest.current.lensSelector) {
        if (!host.querySelector(latest.current.lensSelector)) return;
      } else {
        // itemSelector may be scoped (":scope > ..."), which closest() cannot evaluate; match by containment instead.
        const index = list.findIndex(item => item === event.target || item.contains(event.target as Node));
        if (index < 0) return;
        primary = list[index];
        neighbours = [list[index - 1], list[index + 1]].filter(Boolean);
        attraction[0] = attraction[1] = 0; last = 0;
        radius = parseFloat(getComputedStyle(primary).borderTopLeftRadius) || 9999;
      }
      held = true; releaseAt = 0; deadline = performance.now() + SETTLE;
      host.setAttribute('data-fusion', 'true');
      window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
      start();
    };
    host.addEventListener('pointerdown', down);
    // Selection lens: any slot change (drag or keyboard) leaves the old position behind as a collapsing droplet.
    let observer: MutationObserver | undefined;
    const lensNode = latest.current.lensSelector ? host.querySelector<HTMLElement>(latest.current.lensSelector) : null;
    /** The slot the lens has been assigned, as written by `useSelectionLens`. */
    const slotOf = (node: HTMLElement) => {
      const x = node.style.getPropertyValue('--lg-slot-x'), y = node.style.getPropertyValue('--lg-slot-y');
      return x || y ? `${x}|${y}` : '';
    };
    if (lensNode && typeof MutationObserver !== 'undefined') {
      slot = slotOf(lensNode);
      observer = new MutationObserver(() => {
        const previous = slot;
        if (slotOf(lensNode) === previous) return;
        slot = slotOf(lensNode);
        // The first positioning pass is the lens taking its initial slot, not a flow between slots.
        if (!previous || items().length < 2) return;
        const r = lensNode.getBoundingClientRect(), lb = box.getBoundingClientRect();
        trail = { x: r.left - lb.left, y: r.top - lb.top, w: r.width, h: r.height, r: Math.min(r.width, r.height) / 2 };
        trailAt = performance.now(); deadline = trailAt + SETTLE; exitAt = 0; faded = false;
        radius = parseFloat(getComputedStyle(lensNode).borderTopLeftRadius) || 9999;
        host.setAttribute('data-fusion', 'true');
        start();
      });
      observer.observe(lensNode, { attributes: true, attributeFilter: ['style'] });
    }
    return () => { host.removeEventListener('pointerdown', down); detach(); observer?.disconnect(); stop(); };
  }, [root, enabled]);
  if (!enabled) return null;
  return <span className="lg-fusion" aria-hidden="true" ref={layer}>
    <svg width="0" height="0" className="lg-filter-defs" focusable="false" aria-hidden="true"><defs>
      <filter id={filterId} x="-12%" y="-70%" width="124%" height="240%" colorInterpolationFilters="sRGB">
        <feGaussianBlur in="SourceGraphic" stdDeviation={BLUR} result="lg-soft" />
        <feColorMatrix in="lg-soft" type="matrix" values={`1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${SLOPE} ${INTERCEPT}`} />
      </filter>
    </defs></svg>
    <span className="lg-fusion-goo" style={{ filter: `url(#${filterId})` }}>
      {Array.from({ length: BLOBS }, (_, i) => <span key={i} className="lg-fusion-blob" ref={node => { blobs.current[i] = node; }} />)}
    </span>
    <span className="lg-fusion-sheen" ref={sheen} />
  </span>;
}
