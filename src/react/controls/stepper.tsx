'use client';
import type { HTMLAttributes, RefAttributes } from 'react';
import { cx, useControllable } from '../system/utils.js';
import { LibraryIcon } from '../system/icon.js';
import { clamp } from '../../core/index.js';

export interface GlassStepperProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'>, RefAttributes<HTMLDivElement> {
  value?: number; defaultValue?: number; onValueChange?: (value: number) => void;
  min?: number; max?: number; step?: number; disabled?: boolean;
  'aria-label': string;
  /** Spoken and displayed form of the value. The number alone is rarely enough. */
  formatValue?: (value: number) => string;
  /** Render the value inside the control. Off when the value already appears next to it in a row. */
  showValue?: boolean;
  decrementLabel?: string;
  incrementLabel?: string;
}

/**
 * Two segments sharing one surface, for small integer ranges only — past a handful of taps
 * a slider or a field is the honest control. The value is always visible, either inside the
 * stepper or immediately beside it.
 */
export function GlassStepper({
  value, defaultValue = 0, onValueChange, min = -Infinity, max = Infinity, step = 1, disabled,
  'aria-label': label, formatValue, showValue = true, decrementLabel = 'Decrease', incrementLabel = 'Increase', className, ref, ...props
}: GlassStepperProps) {
  if (!Number.isFinite(step) || step <= 0) throw new RangeError('GlassStepper requires step > 0');
  if (min >= max) throw new RangeError('GlassStepper requires min < max');
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  const safe = clamp(Number.isFinite(current) ? current : 0, min, max);
  const shown = formatValue ? formatValue(safe) : String(safe);
  const nudge = (direction: 1 | -1) => setCurrent(clamp(safe + direction * step, min, max));
  return <div {...props} ref={ref} className={cx('lg-stepper', className)} role="group" aria-label={label} data-disabled={disabled ? 'true' : undefined}>
    <button type="button" className="lg-stepper-button" aria-label={decrementLabel} disabled={disabled || safe <= min} onClick={() => nudge(-1)}>
      <LibraryIcon name="minus" size={18} />
    </button>
    {showValue && <output className="lg-stepper-value" aria-live="off">{shown}</output>}
    <button type="button" className="lg-stepper-button" aria-label={incrementLabel} disabled={disabled || safe >= max} onClick={() => nudge(1)}>
      <LibraryIcon name="plus" size={18} />
    </button>
  </div>;
}
