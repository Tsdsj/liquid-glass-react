'use client';
import {
  useId, type InputHTMLAttributes, type ReactNode, type RefAttributes, type TextareaHTMLAttributes,
} from 'react';
import { cx } from '../system/utils.js';
import { Text } from '../content/text.js';
import type { ControlSize } from '../controls/button.js';

/** Everything both forms share. The ref is not here: it points at a different element in each. */
interface FieldShape {
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
  /**
   * Control height. `small` is a denser form; it does **not** shrink the text, which stays at
   * 16px or above so iOS Safari does not zoom the page when the field is focused.
   */
  controlSize?: Extract<ControlSize, 'small' | 'regular' | 'large'>;
}

/** The single-line form. `ref` lands on the `<input>`, as it always has. */
export interface SingleLineFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
  RefAttributes<HTMLInputElement>, FieldShape {
  multiline?: false;
}

/**
 * The multi-line form. A real `<textarea>`, so Enter inserts a newline, the browser's own
 * resize affordance is there, and spellcheck and dictation behave as they do everywhere else.
 */
export interface MultilineFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size' | 'rows'>,
  RefAttributes<HTMLTextAreaElement>, FieldShape {
  multiline: true;
  /** Visible lines before it scrolls. `auto` grows with the content instead. */
  rows?: number | 'auto';
}

/**
 * `multiline` is a discriminated union rather than a boolean on one shape, because the two
 * forms genuinely differ: a `<textarea>` has `rows` and no `type`, an `<input>` has `type` and
 * no `rows`, and `ref` points at a different element. Flattening them would make `ref` a union
 * on the single-line form too, which every existing caller would then have to widen.
 */
export type TextFieldProps = SingleLineFieldProps | MultilineFieldProps;

/**
 * A rounded text field with a real `<label for>`.
 *
 * The details that make a web form feel native are all here and all easy to forget:
 * `autocomplete` and `inputmode` should be set by the caller for the field's purpose,
 * the font-size stays at 16px or above so iOS Safari does not zoom on focus, and the focus
 * ring is an `outline` on the container rather than a `box-shadow`.
 */
export function TextField(props: TextFieldProps) {
  const {
    label, hint, error, leading, trailing, labelHidden = false, controlSize = 'regular',
    className, id, ...rest
  } = props;
  const generated = useId();
  const fieldId = id ?? `${generated}-field`;
  const hintId = hint ? `${generated}-hint` : undefined;
  const errorId = error ? `${generated}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

  const shared = {
    id: fieldId,
    className: 'lg-field-input',
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
  } as const;

  let control: ReactNode;
  if (rest.multiline) {
    const { multiline: _multiline, rows = 4, ref, ...textarea } = rest as MultilineFieldProps;
    control = <textarea {...textarea} {...shared} ref={ref}
      /* `auto` is `field-sizing: content` where it exists and the given rows where it does
         not — a textarea that does not grow is still a working textarea. */
      rows={rows === 'auto' ? 2 : rows}
      data-autosize={rows === 'auto' ? 'true' : undefined} />;
  } else {
    const { multiline: _multiline, type = 'text', ref, ...input } = rest as SingleLineFieldProps;
    control = <input {...input} {...shared} ref={ref} type={type} />;
  }

  return <div className={cx('lg-field', className)} data-invalid={error ? 'true' : undefined}
    data-control-size={controlSize} data-multiline={rest.multiline ? 'true' : undefined}>
    <Text as="label" variant="subhead" emphasized className={cx('lg-field-label', labelHidden && 'lg-visually-hidden')} {...{ htmlFor: fieldId }}>{label}</Text>
    <div className="lg-field-box">
      {leading && <span className="lg-field-leading" aria-hidden="true">{leading}</span>}
      {control}
      {trailing && <span className="lg-field-trailing">{trailing}</span>}
    </div>
    {error && <Text id={errorId} variant="footnote" tone="destructive" className="lg-field-message">{error}</Text>}
    {/**
      * The hint stays while the error is up.
      *
      * Hiding it used to leave `aria-describedby` pointing at an element that was no longer in
      * the document, which is a dangling IDREF — a screen reader may read the error, or read
      * nothing, depending on which one it is. And it took the wrong sentence away: the error
      * says what went wrong, the hint says what a right answer looks like, and the moment the
      * field is wrong is the moment that is most worth having on screen.
      */}
    {hint && <Text id={hintId} variant="footnote" tone="secondary" className="lg-field-message">{hint}</Text>}
  </div>;
}
