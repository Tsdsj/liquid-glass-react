'use client';
import { useId, type FormHTMLAttributes, type HTMLAttributes, type ReactNode, type RefAttributes } from 'react';
import { Text } from '../content/text.js';
import { cx } from '../system/utils.js';

export interface FormProps extends FormHTMLAttributes<HTMLFormElement>, RefAttributes<HTMLFormElement> {
  children: ReactNode;
}

/**
 * A settings form: grouped sections of labelled rows.
 *
 * A real `<form>`, so Enter submits, the browser can autofill it, and a submit button means
 * what it says. Content layer — a form is what you are reading, not something floating over it.
 */
export function Form({ children, className, ref, ...props }: FormProps) {
  return <form {...props} ref={ref} className={cx('lg-form', className)}>{children}</form>;
}

export interface FormSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'>, RefAttributes<HTMLElement> {
  /**
   * Title case, not ALL CAPS — the uppercase section header went with the iOS 26 design.
   * Rendered as a real heading, so it is a landmark a screen reader can jump between.
   */
  header?: ReactNode;
  /** Explanation under the group. Attached to the section, so it is read with it. */
  footer?: ReactNode;
  children: ReactNode;
}

export function FormSection({ header, footer, children, className, ref, ...props }: FormSectionProps) {
  const generated = useId();
  const headerId = header ? `${generated}-header` : undefined;
  const footerId = footer ? `${generated}-footer` : undefined;
  return <section {...props} ref={ref} className={cx('lg-form-section', className)}
    aria-labelledby={headerId} aria-describedby={footerId}>
    {header && <Text as="h3" id={headerId} variant="subhead" emphasized tone="secondary" className="lg-form-header">{header}</Text>}
    <div className="lg-form-group">{children}</div>
    {footer && <Text id={footerId} variant="footnote" tone="secondary" className="lg-form-footer">{footer}</Text>}
  </section>;
}

export interface FormRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, RefAttributes<HTMLDivElement> {
  /**
   * What the control is for. Pass a string and the row wires it up as a real `<label for>`
   * around the control — which is also what gives the label a 44pt hit region of its own.
   */
  label: ReactNode;
  /** A second line under the label. */
  description?: ReactNode;
  /**
   * The error for this row. It goes under the control and is connected with
   * `aria-describedby`, so it is heard rather than only seen in red.
   */
  error?: ReactNode;
  /** The control. A field, a switch, a stepper, a menu button. */
  children: ReactNode;
  /**
   * `inline` puts the control on the same line as the label, which is right for a switch or a
   * short value. `stacked` puts it underneath, which is what a text field needs at any width
   * the label might wrap at.
   */
  layout?: 'inline' | 'stacked';
}

/**
 * One labelled row.
 *
 * The title is a `<span>`, not a `<label>`, and that is deliberate. The obvious version wraps
 * the control in a `<label>` so the words are part of its hit region — which is how a settings
 * row behaves and was the first thing tried here. It does not work, for two reasons that both
 * point the same way:
 *
 * - Every control in this library already carries its own accessible name; `GlassSwitch`,
 *   `GlassStepper` and `GlassSlider` all require `aria-label`, and `TextField` takes a real
 *   `label`. Wrapping them adds a second name rather than the first one.
 * - `GlassSwitch` and `TextField` render a `<label>` of their own. A `<label>` inside a
 *   `<label>` is invalid, and the browser's answer is that the outer one stops working:
 *   measured, clicking the row's words did nothing at all.
 *
 * So the row lays out and groups, and naming stays where it already was. Where the words
 * should also be a hit region, give the control `labelHidden` and let it own them.
 */
export function FormRow({
  label, description, error, children, layout = 'inline', className, ref, ...props
}: FormRowProps) {
  const generated = useId();
  const errorId = error ? `${generated}-error` : undefined;
  return <div {...props} ref={ref} className={cx('lg-form-row', className)}
    data-layout={layout} data-invalid={error ? 'true' : undefined}>
    <div className="lg-form-row-label">
      <span className="lg-form-row-labels">
        <Text as="span" variant="body" className="lg-form-row-title">{label}</Text>
        {description && <Text as="span" variant="footnote" tone="secondary">{description}</Text>}
      </span>
      <span className="lg-form-row-control" aria-describedby={errorId}>{children}</span>
    </div>
    {error && <Text id={errorId} variant="footnote" tone="destructive" className="lg-form-row-error">{error}</Text>}
  </div>;
}
