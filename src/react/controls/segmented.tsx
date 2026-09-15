'use client';
import { useEffect, useId, useRef, type ReactNode, type RefObject } from 'react';
import { GlassSurface } from '../system/surface.js';
import { type GlassSurfaceOptions } from '../system/material.js';
import { cx, useControllable } from '../system/utils.js';
import { usePull, elementAt } from '../system/pull.js';
import { useFusion } from '../system/fusion.js';
import { useGlassPolicy } from '../system/provider.js';

export interface GlassChoice { value: string; label: ReactNode; disabled?: boolean }

/** Lens centre with its live pull offset removed: when the selection changes mid-drag the lens glides to the new slot while the offset eases to zero. */
export function lensOrigin(lens: HTMLElement | null) {
  if (!lens) return null;
  const box = lens.getBoundingClientRect();
  const shiftX = parseFloat(lens.style.getPropertyValue('--lg-shift-x')) || 0;
  const shiftY = parseFloat(lens.style.getPropertyValue('--lg-shift-y')) || 0;
  return { x: box.left + box.width / 2 - shiftX, y: box.top + box.height / 2 - shiftY };
}

/**
 * Measures the selected child and positions a single shared lens that glides between choices.
 *
 * Both axes are tracked, not just the horizontal one: the same lens has to follow a row of
 * segments and a vertical column of sidebar rows, and a column's items all share `offsetLeft`.
 *
 * The geometry is written straight to the lens element rather than returned as a style object.
 * The very first placement has to land with the transition switched off — otherwise every
 * control on the page springs open from nothing on load — and that ordering (suppress, place,
 * make the browser resolve it, restore) needs the DOM write to happen when we say it does,
 * which React state does not promise.
 */
export function useSelectionLens<T extends HTMLElement>(root: RefObject<T | null>, lens: RefObject<HTMLElement | null>, selector: string, deps: unknown[]) {
  const placed = useRef(false);
  useEffect(() => {
    const node = root.current, pill = lens.current; if (!node || !pill) return;
    const update = () => {
      const target = node.querySelector<HTMLElement>(selector);
      const first = !placed.current;
      if (first) pill.style.transition = 'none';
      if (target && target.offsetWidth) {
        pill.style.width = `${target.offsetWidth}px`;
        pill.style.height = `${target.offsetHeight}px`;
        pill.style.transform = `translate(${target.offsetLeft}px, ${target.offsetTop}px)`;
        // `--lg-lens-shown`, not `opacity`: the fusion layer also has a say in whether the lens
        // is the thing painting the pill, and an inline opacity would overrule it.
        pill.style.setProperty('--lg-lens-shown', '1');
        placed.current = true;
      } else {
        pill.style.setProperty('--lg-lens-shown', '0');
      }
      // Forces the placement to resolve while the transition is still off, so nothing animates.
      if (first) { void pill.offsetWidth; pill.style.transition = ''; }
    };
    update(); const observer = new ResizeObserver(update); observer.observe(node);
    if (typeof document !== 'undefined' && 'fonts' in document) document.fonts.ready.then(update, () => {});
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, lens, selector, ...deps]);
}

/**
 * How far the lens may be carried, measured from its resting centre, before it starts to resist:
 * exactly as far as the track lets it go without leaving either end.
 */
export function trackSpan(track: HTMLElement | null, lens: HTMLElement | null, axis: 'x' | 'y' = 'x') {
  const origin = lensOrigin(lens);
  if (!track || !lens || !origin) return null;
  const box = track.getBoundingClientRect();
  // A control that is not laid out has no span to give; rubber-band from the origin instead.
  if (!box.width || !box.height) return null;
  const span = (start: number, end: number): [number, number] => start <= end ? [start, end] : [0, 0];
  if (axis === 'y') {
    const half = lens.offsetHeight / 2;
    return { y: span(box.top + half - origin.y, box.bottom - half - origin.y) };
  }
  const half = lens.offsetWidth / 2;
  return { x: span(box.left + half - origin.x, box.right - half - origin.x) };
}

export interface GlassSegmentedControlProps extends GlassSurfaceOptions {
  items: GlassChoice[]; value?: string; defaultValue?: string; onValueChange?: (value: string) => void;
  'aria-label': string; name?: string; disabled?: boolean; className?: string;
}

/**
 * Two to five equal-width segments, text **or** icons but never both mixed. Native radio
 * inputs underneath provide form participation and arrow-key selection.
 *
 * It is a scrubber, not a row of buttons: press the selected segment and slide, and the lens
 * tracks the pointer 1:1, stretches with the drag and updates the selection *live* as it
 * crosses each segment, settling on a spring. This is the interaction most often missing
 * from imitations of the system control.
 */
export function GlassSegmentedControl({ items, value, defaultValue, onValueChange, name, disabled, className, 'aria-label': label, ...surface }: GlassSegmentedControlProps) {
  const id = useId();
  const [selected, setSelected] = useControllable(value, defaultValue ?? items.find(x => !x.disabled)?.value ?? '', onValueChange);
  const root = useRef<HTMLDivElement>(null);
  const policy = useGlassPolicy();
  const lensRef = useRef<HTMLSpanElement>(null);
  useSelectionLens(root, lensRef, '.lg-segment:has(input:checked)', [selected, items]);
  const fusion = useFusion(root, { itemSelector: '.lg-segment:not([data-disabled="true"])', lensSelector: '.lg-selection-lens' });
  usePull(root, {
    axis: 'x', limit: 18, stretch: .8,
    targets: () => lensRef.current ? [lensRef.current] : [],
    origin: () => lensOrigin(lensRef.current),
    // The lens is carried across the whole track by the finger and only resists at the ends.
    range: () => trackSpan(root.current, lensRef.current),
    disabled: event => !!disabled || !!(event.target as HTMLElement).closest('[data-disabled="true"]'),
    onPress: event => pick(event), onMove: event => pick(event),
  }, !policy.reduceMotion && !disabled);
  function pick(event: PointerEvent) {
    const hit = elementAt(event, '.lg-segment'); const input = hit?.querySelector<HTMLInputElement>('input');
    if (input && !input.disabled && input.value !== selected && root.current?.contains(input)) setSelected(input.value);
  }
  return <GlassSurface {...surface} radius={surface.radius ?? 'pill'} className={cx('lg-segmented', className)}>
    <div className="lg-segmented-track" ref={root} role="radiogroup" aria-label={label}>
      {fusion}<span aria-hidden="true" className="lg-selection-lens" ref={lensRef} />
      {items.map(item => <label key={item.value} className="lg-segment" data-disabled={disabled || item.disabled ? 'true' : 'false'}>
        <input type="radio" name={name ?? `segment-${id}`} value={item.value} checked={selected === item.value} disabled={disabled || item.disabled} onChange={() => setSelected(item.value)} />
        <span>{item.label}</span>
      </label>)}
    </div>
  </GlassSurface>;
}
