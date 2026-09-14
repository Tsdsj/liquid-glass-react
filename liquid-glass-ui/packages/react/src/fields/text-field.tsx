'use client';
import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../system/utils.js';
import { Text } from '../content/text.js';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** A real, visible label. A placeholder is a hint about the format, never a substitute. */
  label: ReactNode;
  /** Supporting text shown under the field. Announced with the input. */
  hint?: ReactNode;
  /**
   * Error text. Presence marks the field invalid and wires up `aria-describedby`, so the
   * meaning never rests on a red border alone.
   */
  error?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
  /** Hide the label visually but keep it for assistive technology and Voice Control. */
  labelHidden?: boolean;
}

/**
 * A rounded text field with a real `<label for>`.
 *
 * The details that make a web form feel native are all here and all easy to forget:
 * `autocomplete` and `inputmode` should be set by the caller for the field's purpose,
 * the font-size stays at 16px or above so iOS Safari does not zoom on focus, and the focus
 * ring is an `outline` on the container rather than a `box-shadow`.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, leading, trailing, labelHidden = false, className, id, type = 'text', ...props }, ref,
) {
  const generated = useId();
  const fieldId = id ?? `${generated}-field`;
  const hintId = hint ? `${generated}-hint` : undefined;
  const errorId = error ? `${generated}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;
  return <div className={cx('lg-field', className)} data-invalid={error ? 'true' : undefined}>
    <Text as="label" variant="subhead" emphasized className={cx('lg-field-label', labelHidden && 'lg-visually-hidden')} {...{ htmlFor: fieldId }}>{label}</Text>
    <div className="lg-field-box">
      {leading && <span className="lg-field-leading" aria-hidden="true">{leading}</span>}
      <input {...props} ref={ref} id={fieldId} type={type} className="lg-field-input"
        aria-invalid={error ? true : undefined} aria-describedby={describedBy} />
      {trailing && <span className="lg-field-trailing">{trailing}</span>}
    </div>
    {error && <Text id={errorId} variant="footnote" tone="destructive" className="lg-field-message">{error}</Text>}
    {hint && !error && <Text id={hintId} variant="footnote" tone="secondary" className="lg-field-message">{hint}</Text>}
  </div>;
});
