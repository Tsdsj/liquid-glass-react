'use client';
import { type HTMLAttributes, type RefAttributes } from 'react';
import { GlassSegmentedControl } from './segmented.js';
import { GlassMenuButton } from '../overlays/menu-button.js';
import { useSizeClass } from '../system/size-class.js';
import { cx } from '../system/utils.js';

/**
 * One value on offer. Values, not commands — a picker reports a choice, it does not run one.
 *
 * No icon slot, deliberately: the same picker renders as a segmented control at one width and
 * as a menu at another, and a segmented control that mixes icons with text breaks the HIG's
 * rule for its own group. An option that needs a glyph to be understood needs a better label.
 */
export interface PickerOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Above this many options a segmented control stops being readable: the segments get narrower
 * than their labels, and the HIG's own limit for a segmented control is 2–5.
 */
const INLINE_MAX = 4;

/**
 * Below this many options the control stays inline whatever the width.
 *
 * A menu of two costs a press to reveal less than the two segments it replaced — the same
 * argument `GlassMenuButton` makes in development mode, and it was this component that kept
 * tripping it: eight documentation pages printed that warning on a phone, because a two-option
 * picker in a compact window collapsed into exactly the menu the rule is about. Two segments
 * fit in any layout that can hold a pop-up button naming the longer of the two labels.
 */
const ALWAYS_INLINE = 2;

export interface PickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'>,
  RefAttributes<HTMLDivElement> {
  /** What is being chosen. Shown beside the control, and is also the control's spoken name. */
  label: string;
  /** Hide the words but keep the name. For a picker whose surroundings already say what it is. */
  labelHidden?: boolean;
  options: PickerOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * How it is presented. `automatic` — the default and the one to use — decides from the option
   * count and the size class, which is the rule the HIG states for layout generally: decide by
   * how much room there is, never by what device it is.
   */
  presentation?: 'automatic' | 'inline' | 'menu';
  disabled?: boolean;
  /** Form field name. Only the inline form participates in a form; the menu form has no input. */
  name?: string;
}

/**
 * Choose one value from a small set, in whichever form fits.
 *
 * This is the part that is not a pop-up button with a label stuck on it. A picker's job is the
 * *choice*; its shape is a consequence of how many options there are and how much room the
 * layout has, and hard-coding either at every call site is how an interface ends up with a
 * five-segment control squeezed onto a phone.
 *
 * - Two options: an inline segmented control at any width.
 * - Up to four options in a regular-width layout: the same, because they are all visible at
 *   once and switching costs one press.
 * - More options, or a compact layout: a pop-up button, whose label shows the current choice.
 *
 * Both forms are single-selection and report the same thing, so the reader's mental model does
 * not change with the window. Layer follows the host: the inline form is a glass segmented
 * control, the menu form defaults to the flat grey button that belongs in a form row.
 */
export function Picker({
  label, labelHidden, options, value, defaultValue, onValueChange,
  presentation = 'automatic', disabled, name, className, ref, ...props
}: PickerProps) {
  const sizeClass = useSizeClass();
  const inline = presentation === 'inline'
    || (presentation === 'automatic'
      && (options.length <= ALWAYS_INLINE || (options.length <= INLINE_MAX && sizeClass === 'regular')));

  return <div {...props} ref={ref} className={cx('lg-picker', className)}
    data-presentation={inline ? 'inline' : 'menu'}>
    {/*
      The words are decoration here, and that is deliberate. The control carries `label` as its
      own accessible name, so announcing the span as well would read the same words twice; and
      because the name is character-for-character the visible text, Voice Control still hits the
      control when someone says it.
    */}
    {!labelHidden && <span className="lg-picker-label" aria-hidden="true">{label}</span>}
    {inline
      ? <GlassSegmentedControl aria-label={label} items={options} disabled={disabled} name={name}
        value={value} defaultValue={defaultValue} onValueChange={onValueChange} />
      : <GlassMenuButton kind="popUp" aria-label={label} options={options} variant="gray"
        disabled={disabled} value={value} defaultValue={defaultValue} onValueChange={onValueChange} />}
  </div>;
}
