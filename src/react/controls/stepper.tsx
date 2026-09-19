'use client';
import { useCallback, useEffect, useRef, type HTMLAttributes, type PointerEvent as ReactPointerEvent, type RefAttributes } from 'react';
import { cx, useControllable } from '../system/utils.js';
import { LibraryIcon } from '../system/icon.js';
import { clamp } from '../../core/index.js';
import { useGlassStrings } from '../system/strings.js';

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
  /**
   * How much Shift multiplies a press by. The HIG's steppers page asks for a larger step over
   * a wide range; `1` turns it off for a stepper whose whole range is a handful of values.
   */
  shiftMultiplier?: number;
}

/** Hold for this long before it starts repeating, then one step every `REPEAT`. */
const HOLD = 400, REPEAT = 90;

/**
 * Two segments sharing one surface, for small integer ranges only — past a handful of taps
 * a slider or a field is the honest control. The value is always visible, either inside the
 * stepper or immediately beside it.
 */
export function GlassStepper({
  value, defaultValue = 0, onValueChange, min = -Infinity, max = Infinity, step = 1, disabled,
  'aria-label': label, formatValue, showValue = true, decrementLabel, incrementLabel,
  shiftMultiplier = 10, className, ref, ...props
}: GlassStepperProps) {
  const strings = useGlassStrings();
  if (!Number.isFinite(step) || step <= 0) throw new RangeError('GlassStepper requires step > 0');
  if (min >= max) throw new RangeError('GlassStepper requires min < max');
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  const safe = clamp(Number.isFinite(current) ? current : 0, min, max);
  const shown = formatValue ? formatValue(safe) : String(safe);

  /**
   * The repeat reads the latest value from a ref rather than from the render it started in.
   * A timer closes over the value it was created with, so a chain of them all compute
   * `safe + step` from the same starting number and the control moves exactly one step no
   * matter how long it is held.
   */
  const latest = useRef(safe); latest.current = safe;
  const bounds = useRef({ min, max, step }); bounds.current = { min, max, step };
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stop = useCallback(() => { for (const timer of timers.current) clearTimeout(timer); timers.current = []; }, []);
  useEffect(() => stop, [stop]);

  const nudge = useCallback((direction: 1 | -1, multiplier = 1) => {
    const { min: low, max: high, step: size } = bounds.current;
    const next = clamp(latest.current + direction * size * multiplier, low, high);
    if (next === latest.current) { stop(); return false; }
    latest.current = next;
    setCurrent(next);
    return true;
  }, [setCurrent, stop]);

  /**
   * Press and hold to keep going, which is what the system control does and the only reason a
   * stepper is usable over a range wider than a few values. It stops on release, on cancel,
   * and on its own once the value has reached the end — a repeat that keeps firing into a
   * clamp is a timer nobody can see still running.
   */
  const hold = (event: ReactPointerEvent<HTMLButtonElement>, direction: 1 | -1) => {
    if (event.button !== 0 || !event.isPrimary || disabled) return;
    const multiplier = event.shiftKey ? shiftMultiplier : 1;
    // The first step is the click's; this only schedules what comes after it.
    const tick = () => { if (nudge(direction, multiplier)) timers.current.push(setTimeout(tick, REPEAT)); };
    timers.current.push(setTimeout(tick, HOLD));
    const release = () => { stop(); window.removeEventListener('pointerup', release); window.removeEventListener('pointercancel', release); };
    window.addEventListener('pointerup', release); window.addEventListener('pointercancel', release);
  };

  const button = (direction: 1 | -1) => ({
    type: 'button' as const,
    className: 'lg-stepper-button',
    'aria-label': direction === -1 ? decrementLabel ?? strings.decrease : incrementLabel ?? strings.increase,
    disabled: disabled || (direction === -1 ? safe <= min : safe >= max),
    onClick: (event: { shiftKey: boolean }) => nudge(direction, event.shiftKey ? shiftMultiplier : 1),
    // Reduce Motion is about movement, not about repetition, so the hold stays either way.
    onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => hold(event, direction),
  });

  return <div {...props} ref={ref} className={cx('lg-stepper', className)} role="group" aria-label={label} data-disabled={disabled ? 'true' : undefined}>
    <button {...button(-1)}><LibraryIcon name="minus" size={18} /></button>
    {showValue && <output className="lg-stepper-value" aria-live="off">{shown}</output>}
    <button {...button(1)}><LibraryIcon name="plus" size={18} /></button>
  </div>;
}
