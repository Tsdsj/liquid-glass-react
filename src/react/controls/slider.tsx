'use client';
import { useRef, type CSSProperties } from 'react';
import { usePull } from '../system/pull.js';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { useGlassPolicy } from '../system/provider.js';
import { cx, useControllable } from '../system/utils.js';
import { clamp } from '../../core/index.js';

export interface GlassSliderProps extends GlassSurfaceOptions {
  value?: number; defaultValue?: number; onValueChange?: (value: number) => void;
  min?: number; max?: number; step?: number; disabled?: boolean; name?: string;
  'aria-label': string;
  /** Spoken value when the bare number is ambiguous — "62 percent", "4 of 10". */
  formatValue?: (value: number) => string;
  /** Glyphs at the ends of the track, e.g. a small and a large speaker. */
  minLabel?: React.ReactNode; maxLabel?: React.ReactNode;
  className?: string;
}

/**
 * A real `<input type="range">` under a drawn track and knob. Rebuilding the input would
 * cost keyboard support, form participation and `aria-valuetext` for nothing.
 *
 * The knob is quiet at rest and **lifts into glass only while it is being manipulated** —
 * a transient control in the content layer, per the Liquid Glass rules. A knob that is
 * permanently glass is glass in the content layer.
 */
export function GlassSlider({ value, defaultValue = 50, onValueChange, min = 0, max = 100, step = 1, disabled, name, 'aria-label': label, formatValue, minLabel, maxLabel, className, ...surface }: GlassSliderProps) {
  if (![min, max, step].every(Number.isFinite) || min >= max || step <= 0) throw new RangeError('GlassSlider requires finite min < max and step > 0');
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  const safe = clamp(Number.isFinite(current) ? current : min, min, max), progress = (safe - min) / (max - min);
  const root = useRef<HTMLDivElement>(null);
  const policy = useGlassPolicy();
  // The knob keeps its glass machinery mounted so the displacement texture is not rebuilt on
  // every press; CSS decides whether that machinery is visible.
  const knob = useGlassSurface<HTMLSpanElement>({ ...surface, radius: 'pill' });
  usePull(root, {
    limit: 10, stretch: 1,
    targets: () => knob.root.current ? [knob.root.current] : [],
    // Horizontal motion is the value itself; only vertical pull stretches the knob, horizontal shows the lag.
    origin: () => { const box = knob.root.current?.getBoundingClientRect(); return box ? { x: box.left + box.width / 2, y: box.top + box.height / 2 } : null; },
    disabled: () => !!disabled,
  }, !policy.reduceMotion);
  return <div ref={root} className={cx('lg-slider', className)} data-disabled={disabled ? 'true' : 'false'} style={{ '--lg-progress': progress } as CSSProperties}>
    {minLabel && <span className="lg-slider-edge" aria-hidden="true">{minLabel}</span>}
    <span className="lg-slider-rail">
      <span className="lg-slider-track" aria-hidden="true"><span className="lg-slider-fill" /></span>
      <span ref={knob.ref} {...knob.attributes} className="lg-root lg-slider-lens" style={knob.style} aria-hidden="true">{knob.decoration}</span>
      <input type="range" aria-label={label} aria-valuetext={formatValue?.(safe)} min={min} max={max} step={step} value={safe} disabled={disabled} name={name}
        onChange={event => setCurrent(Number(event.currentTarget.value))} />
    </span>
    {maxLabel && <span className="lg-slider-edge" aria-hidden="true">{maxLabel}</span>}
  </div>;
}
