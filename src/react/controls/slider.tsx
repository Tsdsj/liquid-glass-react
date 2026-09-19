'use client';
import { useEffect, type CSSProperties, type HTMLAttributes, type ReactNode, type RefAttributes } from 'react';
import { usePull } from '../system/pull.js';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { splitSurface } from '../system/props.js';
import { useGlassPolicy } from '../system/provider.js';
import { cx, useControllable, useMergedRef } from '../system/utils.js';
import { clamp } from '../../core/index.js';
import { inDevelopment, warnOnce } from '../system/warn.js';

/** `defaultValue` and `onChange` belong to the `<input type="range">` this wraps, not to the wrapper. */
export interface GlassSliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'>, RefAttributes<HTMLDivElement>, GlassSurfaceOptions {
  value?: number; defaultValue?: number; onValueChange?: (value: number) => void;
  min?: number; max?: number; step?: number; disabled?: boolean; name?: string;
  'aria-label': string;
  /** Spoken value when the bare number is ambiguous — "62 percent", "4 of 10". */
  formatValue?: (value: number) => string;
  /** Glyphs at the ends of the track, e.g. a small and a large speaker. */
  minLabel?: ReactNode; maxLabel?: ReactNode;
  /**
   * Tick marks along the track. `true` places one at every `step`; an array places them at
   * the values given. Marks say the scale is discrete, so only use them when it is — a
   * hundred ticks on a volume slider is a hatched line, not information.
   *
   * They are decoration for the eye: the value a screen reader hears comes from the input
   * and from `formatValue`, and the marks add nothing to it.
   */
  marks?: boolean | number[];
}

/**
 * A real `<input type="range">` under a drawn track and knob. Rebuilding the input would
 * cost keyboard support, form participation and `aria-valuetext` for nothing.
 *
 * The knob is quiet at rest and **lifts into glass only while it is being manipulated** —
 * a transient control in the content layer, per the Liquid Glass rules. A knob that is
 * permanently glass is glass in the content layer.
 */
export function GlassSlider({ value, defaultValue = 50, onValueChange, min = 0, max = 100, step = 1, disabled, name, 'aria-label': label, formatValue, minLabel, maxLabel, marks, className, style, ref, ...rest }: GlassSliderProps) {
  const [surface, props] = splitSurface(rest);
  if (![min, max, step].every(Number.isFinite) || min >= max || step <= 0) throw new RangeError('GlassSlider requires finite min < max and step > 0');
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  const safe = clamp(Number.isFinite(current) ? current : min, min, max), progress = (safe - min) / (max - min);
  const [root, mergedRef] = useMergedRef<HTMLDivElement>(ref);
  /**
   * `true` means one per step, which is only sane while the steps are countable. Past that
   * the ticks merge into a hatched line and stop saying anything, so it is capped and the
   * caller is told to pass the values they actually mean.
   */
  const tickValues = !marks ? null : Array.isArray(marks)
    ? marks.filter(tick => tick >= min && tick <= max)
    : (max - min) / step <= 20
      ? Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, index) => min + index * step)
      : null;
  useEffect(() => {
    if (!inDevelopment() || marks !== true || tickValues) return;
    const node = root.current; if (!node) return;
    warnOnce(node, 'slider-marks-dense',
      `marks={true} on a range of ${(max - min) / step} steps would draw them as a hatched line. Pass the values you mean — marks={[0, 25, 50, 75, 100]} — or leave them off.`);
  }, [root, marks, tickValues, min, max, step]);
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
  return <div {...props} ref={mergedRef} className={cx('lg-slider', className)} data-disabled={disabled ? 'true' : 'false'} style={{ '--lg-progress': progress, ...style } as CSSProperties}>
    {minLabel && <span className="lg-slider-edge" aria-hidden="true">{minLabel}</span>}
    <span className="lg-slider-rail">
      <span className="lg-slider-track" aria-hidden="true"><span className="lg-slider-fill" /></span>
      {tickValues && <span className="lg-slider-marks" aria-hidden="true">
        {tickValues.map(tick => <span key={tick} className="lg-slider-mark"
          data-passed={tick <= safe ? 'true' : undefined}
          style={{ '--lg-mark': (tick - min) / (max - min) } as CSSProperties} />)}
      </span>}
      <span ref={knob.ref} {...knob.attributes} className="lg-root lg-slider-lens" style={knob.style} aria-hidden="true">{knob.decoration}</span>
      <input type="range" aria-label={label} aria-valuetext={formatValue?.(safe)} min={min} max={max} step={step} value={safe} disabled={disabled} name={name}
        onChange={event => setCurrent(Number(event.currentTarget.value))} />
    </span>
    {maxLabel && <span className="lg-slider-edge" aria-hidden="true">{maxLabel}</span>}
  </div>;
}
