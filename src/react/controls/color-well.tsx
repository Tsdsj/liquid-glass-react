'use client';
import { useId, type InputHTMLAttributes, type RefAttributes } from 'react';
import { cx, useControllable } from '../system/utils.js';

/**
 * A quick pick.
 *
 * The name is required rather than optional, and that is the whole point of the type: a row of
 * coloured squares is meaning carried by colour alone, which is exactly what the HIG says not
 * to do. "Sky blue" is a name; `#0a84ff` is not one, but it is at least readable aloud and is
 * what the field falls back to.
 */
export interface ColorSwatch {
  value: string;
  label: string;
}

export interface ColorWellProps extends Omit<InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'onChange' | 'size'>, RefAttributes<HTMLInputElement> {
  /** What the colour is for. Required: a coloured square says nothing about what it colours. */
  'aria-label': string;
  /** `#rrggbb`. The element is a real colour input, so this is the format it speaks. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Offered beside the well, for the common choices. Each one needs a name. */
  swatches?: ColorSwatch[];
  /**
   * Show the hex value next to the well. On by default, because otherwise the control's entire
   * state is a colour — unreadable to anyone who cannot distinguish it, and unquotable by
   * anyone trying to describe it to someone else.
   */
  showValue?: boolean;
  disabled?: boolean;
}

/**
 * Pick a colour.
 *
 * A real `<input type="color">` under a glass-free shell, so the picker that opens is the
 * operating system's own — with its eyedropper, its recent colours and its accessibility —
 * rather than a re-implementation that has none of them. The shell exists to give it the
 * library's shape, a 44×44 hit region and a focus ring; it does not try to replace the picker.
 *
 * Content layer. A colour well is a form control sitting in what you are reading, not
 * something floating over it.
 */
export function ColorWell({
  'aria-label': label, value, defaultValue = '#0a84ff', onValueChange,
  swatches, showValue = true, disabled, className, ref, ...props
}: ColorWellProps) {
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  const valueId = useId();
  const normalised = current.toLowerCase();
  /* The hex is part of the control's description, not a replacement for whatever the caller
     already attached — a field with a hint would otherwise lose it by turning the value on. */
  const describedBy = [showValue ? valueId : null, props['aria-describedby']].filter(Boolean).join(' ') || undefined;

  return <div className={cx('lg-color-well', className)} data-disabled={disabled || undefined}>
    <span className="lg-color-well-box">
      {/*
        The input is the control, laid over its own swatch at full size rather than hidden
        behind a button: hiding it and clicking it from script is what loses the keyboard, the
        focus ring and the form. The visible swatch is `background-color` on the parent, which
        is why the input itself is transparent.
      */}
      <input {...props} ref={ref} type="color" className="lg-color-well-input"
        aria-label={label} aria-describedby={describedBy}
        disabled={disabled} value={current}
        onChange={event => setCurrent(event.target.value)} />
      <span className="lg-color-well-swatch" aria-hidden="true" style={{ background: current }} />
    </span>
    {showValue && <span className="lg-color-well-value" id={valueId}>{normalised}</span>}
    {swatches && swatches.length > 0 && <span className="lg-color-well-swatches">
      {swatches.map(swatch => {
        const chosen = swatch.value.toLowerCase() === normalised;
        return <button key={swatch.value} type="button" className="lg-color-well-quick"
          /* Pressed, not checked: these are shortcuts to a value the well already holds, not a
             second, competing control for the same choice. */
          aria-pressed={chosen} aria-label={swatch.label} disabled={disabled}
          onClick={() => setCurrent(swatch.value)}>
          <span aria-hidden="true" style={{ background: swatch.value }} />
        </button>;
      })}
    </span>}
  </div>;
}
