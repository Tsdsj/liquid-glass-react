'use client';
import { useEffect, useId, useRef, useState, type HTMLAttributes, type ReactNode, type RefAttributes } from 'react';
import { LibraryIcon } from '../system/icon.js';
import { useGlassPolicy } from '../system/provider.js';
import { cx, useControllable } from '../system/utils.js';

export interface DisclosureGroupProps extends Omit<HTMLAttributes<HTMLDetailsElement>, 'onToggle' | 'title'>,
  RefAttributes<HTMLDetailsElement> {
  /**
   * What is behind it, named. "Advanced options", not "More" — the label is the only thing
   * someone has to decide from, and a label that says nothing makes the control a lottery.
   */
  label: ReactNode;
  /** A second line under the label, for the part that does not belong in the label itself. */
  secondaryLabel?: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * A row that hides something, on a real `<details>`.
 *
 * The disclosure is native because everything that makes it work is: find-in-page opens a
 * closed `<details>` to reveal a match, the summary is already a button to assistive
 * technology, and Enter and Space already work. A `div` with an `onClick` and `aria-expanded`
 * reimplements three of those and silently drops the first.
 *
 * Content layer — a disclosure is a row of content that folds, not a floating control.
 *
 * Put the thing most people need **above** this, unfolded. A disclosure is for the minority
 * case; if the common one is inside it, everyone pays a click for it.
 */
export function DisclosureGroup({
  label, secondaryLabel, children, open: controlled, defaultOpen = false, onOpenChange,
  className, id: providedId, ref, ...props
}: DisclosureGroupProps) {
  const generated = useId(); const id = providedId ?? generated;
  const [open, setOpen] = useControllable(controlled, defaultOpen, onOpenChange);
  const details = useRef<HTMLDetailsElement>(null);
  const policy = useGlassPolicy();

  /**
   * `<details>` opens itself when the user activates the summary, and when find-in-page
   * reveals a match inside it. Both change the element without going through React, so the
   * state is read back off the element rather than assumed from the click.
   */
  useEffect(() => {
    const node = details.current; if (!node) return;
    const sync = () => setOpen(node.open);
    node.addEventListener('toggle', sync);
    return () => node.removeEventListener('toggle', sync);
  }, [setOpen]);

  // Keep the element in step when the caller drives it.
  useEffect(() => {
    const node = details.current;
    if (node && node.open !== open) node.open = open;
  }, [open]);

  /**
   * Animating to `auto` needs `interpolate-size`, which is not everywhere yet. Where it is
   * missing the content is measured once and published as a length, which is the same
   * animation by another route. Reduce Motion skips both and just shows it.
   */
  const body = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  useEffect(() => {
    if (policy.reduceMotion || typeof CSS === 'undefined' || CSS.supports('interpolate-size', 'allow-keywords')) return;
    const node = body.current; if (!node) return;
    const measure = () => setHeight(node.scrollHeight);
    measure();
    const observer = new ResizeObserver(measure); observer.observe(node);
    return () => observer.disconnect();
  }, [policy.reduceMotion, children]);

  return <details {...props} id={id} ref={node => {
    details.current = node;
    if (typeof ref === 'function') ref(node); else if (ref) ref.current = node;
  }} className={cx('lg-disclosure', className)} data-open={open ? 'true' : undefined}
    style={height === null ? props.style : { ...props.style, '--lg-disclosure-height': `${height}px` } as React.CSSProperties}>
    <summary className="lg-disclosure-summary">
      <span className="lg-disclosure-labels">
        <span className="lg-disclosure-label">{label}</span>
        {secondaryLabel && <span className="lg-disclosure-secondary">{secondaryLabel}</span>}
      </span>
      {/* Decoration: the summary is already announced as expanded or collapsed. */}
      <LibraryIcon name="chevronForward" size={15} className="lg-disclosure-chevron" aria-hidden="true" />
    </summary>
    <div ref={body} className="lg-disclosure-body">{children}</div>
  </details>;
}
