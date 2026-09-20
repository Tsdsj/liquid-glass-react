'use client';
import { useId, type HTMLAttributes, type ReactNode, type RefAttributes } from 'react';
import { inDevelopment } from '../system/warn.js';
import { cx, useControllable } from '../system/utils.js';

export interface RadioOption {
  value: string;
  label: ReactNode;
  /** A second line saying what the choice means. Read out with the option, not after it. */
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLFieldSetElement>, 'onChange' | 'defaultValue'>,
  RefAttributes<HTMLFieldSetElement> {
  /**
   * What the set of options is about. Visible by default, because a group of radio buttons
   * without one is a list of answers to an unasked question.
   */
  label: ReactNode;
  labelHidden?: boolean;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** `vertical` — the default — is the form layout. `horizontal` needs short labels. */
  orientation?: 'vertical' | 'horizontal';
  /** Shared `name` for the inputs. Generated when it is not given. */
  name?: string;
}

/** Past this, the HIG says to use a pop-up button instead. */
const CROWDED = 5;

/**
 * Two to five mutually exclusive choices, each with its own label.
 *
 * **Content layer**, like every other control that belongs in the window body rather than the
 * window frame. The circle fills when chosen; nothing here is glass.
 *
 * It is built on real `<input type="radio">` elements sharing a `name`, which is not an
 * implementation detail but the entire keyboard model: the browser makes the group **one** tab
 * stop, moves the selection with the arrow keys, wraps at the ends, and skips the disabled
 * options — the roving-tabindex behaviour a hand-written version has to reimplement and
 * usually gets subtly wrong. Nothing here overrides any of it.
 *
 * When to use something else, from the HIG's own list: more than about five options is a
 * `Picker`; a single on/off is a `GlassCheckbox`, because the presence of a checkmark reads
 * faster than one of two filled circles; several choices at once is a column of checkboxes.
 */
export function RadioGroup({
  label, labelHidden = false, options, value, defaultValue, onValueChange,
  orientation = 'vertical', name, className, ref, ...props
}: RadioGroupProps) {
  const generated = useId();
  const group = name ?? generated;
  const first = options.find(option => !option.disabled)?.value ?? '';
  const [selected, setSelected] = useControllable(value, defaultValue ?? first, onValueChange);

  if (inDevelopment() && options.length > CROWDED) {
    console.warn(`[liquid-glass-ui] RadioGroup has ${options.length} options. `
      + 'Past about five, a long column of radio buttons takes a lot of room and is a lot to '
      + 'read; the HIG points at a pop-up button — this library\'s Picker — instead.');
  }

  return <fieldset {...props} ref={ref} className={cx('lg-radio-group', className)}
    data-orientation={orientation}>
    {/* A real `<legend>`: it is what names the group to a screen reader, and `aria-label` on a
        fieldset is not announced consistently. Hidden visually when the surrounding form
        already asks the question. */}
    <legend className={cx('lg-radio-legend', labelHidden && 'lg-visually-hidden')}>{label}</legend>
    {options.map(option => {
      const id = `${group}-${option.value}`;
      return <label key={option.value} htmlFor={id} className="lg-radio"
        data-state={selected === option.value ? 'on' : 'off'}
        data-disabled={option.disabled ? 'true' : undefined}>
        <input id={id} type="radio" name={group} value={option.value}
          checked={selected === option.value} disabled={option.disabled}
          aria-describedby={option.description ? `${id}-description` : undefined}
          onChange={() => setSelected(option.value)} />
        <span className="lg-radio-dot" aria-hidden="true" />
        <span className="lg-radio-text">
          <span className="lg-radio-label">{option.label}</span>
          {option.description && <span className="lg-radio-description" id={`${id}-description`}>{option.description}</span>}
        </span>
      </label>;
    })}
  </fieldset>;
}
