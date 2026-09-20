'use client';
import { useEffect, useId, type LabelHTMLAttributes, type ReactNode, type RefAttributes } from 'react';
import { cx, useControllable, useMergedRef } from '../system/utils.js';

/** `htmlFor` is taken back: the label owns the checkbox it renders and wires itself to it. */
export interface GlassCheckboxProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor' | 'onChange' | 'children'>,
  RefAttributes<HTMLLabelElement> {
  /** `true`, `false`, or `'mixed'` — see below; a checkbox is the only control that has three. */
  checked?: boolean | 'mixed';
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  value?: string;
  /** The text beside the box. A checkbox almost always has one; a checklist row may not. */
  label?: ReactNode;
  /** A second line under the label, for what the setting means rather than what it is called. */
  description?: ReactNode;
  /** Required when there is no visible `label` — an empty box announces as "checkbox" alone. */
  'aria-label'?: string;
}

/**
 * A small square: empty when off, a checkmark when on, a dash when mixed.
 *
 * **Content layer, not glass.** The HIG is explicit that switches, checkboxes and radio buttons
 * belong in the window *body* and not in the window frame — so this is a flat control on the
 * page, not a floating one. A checkbox rendered as glass would be a control claiming to hover
 * over the form it is part of.
 *
 * Reach for it over `GlassSwitch` when the change needs a Save button to take effect, when the
 * settings form a hierarchy (a parent governing its children is what `'mixed'` is for), or
 * simply when there are several of them: a column of checkboxes aligns and reads as a group,
 * where a column of switches reads as a control panel.
 *
 * `'mixed'` is a **display** state, never one the reader can choose. Pressing a mixed checkbox
 * turns it on, because "partly" is not something a person can mean by clicking — it is
 * something the subordinate boxes have made true.
 */
export function GlassCheckbox({
  checked, defaultChecked = false, onCheckedChange, disabled, name, value,
  label, description, 'aria-label': ariaLabel, className, ref, ...props
}: GlassCheckboxProps) {
  const id = useId();
  const mixed = checked === 'mixed';
  const [on, setOn] = useControllable(mixed ? false : checked, defaultChecked, onCheckedChange);
  const [box, mergedRef] = useMergedRef<HTMLLabelElement>(ref);

  /**
   * `indeterminate` is a property, not an attribute — there is no `indeterminate=""` for React
   * to render, so it has to be set on the element after every render that could have changed
   * it. Without this the box would look mixed (the stylesheet can see `data-state`) and
   * announce as unchecked, which is the half of the state assistive technology gets.
   */
  useEffect(() => {
    const input = box.current?.querySelector('input');
    if (input) input.indeterminate = mixed;
  }, [mixed, box]);

  return <label {...props} ref={mergedRef} htmlFor={id}
    className={cx('lg-checkbox', className)}
    data-state={mixed ? 'mixed' : on ? 'on' : 'off'} data-disabled={disabled ? 'true' : undefined}>
    <input id={id} type="checkbox" name={name} value={value} disabled={disabled}
      checked={mixed ? false : on} aria-label={ariaLabel}
      aria-describedby={description ? `${id}-description` : undefined}
      onChange={event => setOn(mixed ? true : event.currentTarget.checked)} />
    {/* Two shapes, not one shape in two colours: "avoid relying solely on different colours to
        communicate state, because not everyone can perceive the differences." */}
    <span className="lg-checkbox-box" aria-hidden="true">
      <svg viewBox="0 0 16 16" className="lg-checkbox-mark" focusable="false">
        {mixed
          ? <path d="M4 8h8" />
          : <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />}
      </svg>
    </span>
    {(label || description) && <span className="lg-checkbox-text">
      {label && <span className="lg-checkbox-label">{label}</span>}
      {description && <span className="lg-checkbox-description" id={`${id}-description`}>{description}</span>}
    </span>}
  </label>;
}
