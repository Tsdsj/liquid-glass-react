'use client';
import { useId, useRef, type HTMLAttributes, type ReactNode, type RefAttributes, type RefObject } from 'react';
import { GlassSurface } from '../system/surface.js';
import { type GlassSurfaceOptions } from '../system/material.js';
import { splitSurface } from '../system/props.js';
import { cx, useControllable, useMeasureEffect } from '../system/utils.js';
import { usePull, elementAt } from '../system/pull.js';
import { useFusion } from '../system/fusion.js';
import { useGlassPolicy } from '../system/provider.js';

export interface GlassChoice { value: string; label: ReactNode; disabled?: boolean }

/**
 * Centre of the slot the lens belongs to, i.e. where it would sit with no pull applied: its
 * measured centre with the live offset taken back off. Used as the reference the drag is
 * measured from, so a selection change mid-drag moves the slot while the lens stays put.
 *
 * This is only exact because the lens composes its own transform with the scale applied *last*
 * (see `--lg-slot-*` in the stylesheet). The individual `scale` property applies before
 * `transform`, so it would multiply the slot offset, and the resulting error would feed back
 * into the next frame's offset — a control that shakes as long as you hold it.
 */
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
  const slot = useRef({ x: 0, y: 0 });
  // Before paint, not after: a slot written a frame late is a frame of the lens in the wrong place.
  useMeasureEffect(() => {
    const node = root.current, pill = lens.current; if (!node || !pill) return;
    const update = () => {
      const target = node.querySelector<HTMLElement>(selector);
      const first = !placed.current;
      if (first) pill.style.transition = 'none';
      if (target && target.offsetWidth) {
        const x = target.offsetLeft, y = target.offsetTop;
        /**
         * Mid-drag the slot moves out from under a lens the finger is still holding, and the
         * offset that is about to be added to it was measured against the slot it just left.
         * Adding the two would throw the lens a whole segment clear of the track until the next
         * frame corrects it. Absorb the move instead — same pixels on screen, and the offset once
         * again means what it says.
         */
        if (!first && pill.getAttribute('data-pulling') === 'true') {
          const shiftX = parseFloat(pill.style.getPropertyValue('--lg-shift-x')) || 0;
          const shiftY = parseFloat(pill.style.getPropertyValue('--lg-shift-y')) || 0;
          pill.style.setProperty('--lg-shift-x', `${(shiftX - (x - slot.current.x)).toFixed(2)}px`);
          pill.style.setProperty('--lg-shift-y', `${(shiftY - (y - slot.current.y)).toFixed(2)}px`);
        }
        slot.current = { x, y };
        pill.style.width = `${target.offsetWidth}px`;
        pill.style.height = `${target.offsetHeight}px`;
        // Custom properties, not `transform`: the stylesheet composes the slot, the drag offset
        // and the deformation into one chain, in the order that keeps them independent.
        pill.style.setProperty('--lg-slot-x', `${x}px`);
        pill.style.setProperty('--lg-slot-y', `${y}px`);
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

/** `defaultValue` and `onChange` here would mean the radio inputs the control renders, not the control. */
export interface GlassSegmentedControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'>, RefAttributes<HTMLDivElement>, GlassSurfaceOptions {
  items: GlassChoice[]; value?: string; defaultValue?: string; onValueChange?: (value: string) => void;
  'aria-label': string; name?: string; disabled?: boolean;
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
export function GlassSegmentedControl({ items, value, defaultValue, onValueChange, name, disabled, className, 'aria-label': label, ref, ...rest }: GlassSegmentedControlProps) {
  const [surface, props] = splitSurface(rest);
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
    /**
     * Only a move picks. Selecting on the press as well would mean a plain tap on another segment
     * teleports the lens under the finger — the carry has the transform transition switched off,
     * so there is nothing left to glide. Left to the label's own click, which lands after the
     * gesture has ended, the lens slides across the way the system control does.
     */
    onMove: event => pick(event),
  }, !policy.reduceMotion && !disabled);
  function pick(event: PointerEvent) {
    const hit = elementAt(event, '.lg-segment'); const input = hit?.querySelector<HTMLInputElement>('input');
    if (input && !input.disabled && input.value !== selected && root.current?.contains(input)) setSelected(input.value);
  }
  return <GlassSurface {...props} {...surface} ref={ref} radius={surface.radius ?? 'pill'} className={cx('lg-segmented', className)}>
    <div className="lg-segmented-track" ref={root} role="radiogroup" aria-label={label}>
      {fusion}<span aria-hidden="true" className="lg-selection-lens" ref={lensRef} />
      {items.map(item => <label key={item.value} className="lg-segment" data-disabled={disabled || item.disabled ? 'true' : 'false'}>
        <input type="radio" name={name ?? `segment-${id}`} value={item.value} checked={selected === item.value} disabled={disabled || item.disabled} onChange={() => setSelected(item.value)} />
        <span>{item.label}</span>
      </label>)}
    </div>
  </GlassSurface>;
}
