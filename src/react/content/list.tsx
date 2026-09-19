'use client';
import { type HTMLAttributes, type LiHTMLAttributes, type MouseEvent, type ReactNode, type RefAttributes } from 'react';
import { cx } from '../system/utils.js';
import { LibraryIcon } from '../system/icon.js';
import { Text } from './text.js';

export interface ListProps extends HTMLAttributes<HTMLDivElement>, RefAttributes<HTMLDivElement> {
  /**
   * `insetGrouped` is the settings/forms style: rounded groups inset from the margins.
   * `plain` runs edge to edge for long homogeneous content.
   */
  variant?: 'insetGrouped' | 'plain';
}
/** A content-layer list. Rows are solid; the glass belongs to the bars floating above them. */
export function List({ variant = 'insetGrouped', className, ref, ...props }: ListProps) {
  return <div {...props} ref={ref} data-variant={variant} className={cx('lg-list', className)} />;
}

export interface ListSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'>, RefAttributes<HTMLElement> {
  /**
   * Title-style capitalization, not ALL CAPS — the uppercase section header was retired
   * in the iOS 26 design. Pass the words as you want them read.
   */
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}
export function ListSection({ header, footer, children, className, ref, ...props }: ListSectionProps) {
  return <section {...props} ref={ref} className={cx('lg-list-section', className)}>
    {header && <Text as="h3" variant="subhead" emphasized tone="secondary" className="lg-list-header">{header}</Text>}
    <ul className="lg-list-group" role="list">{children}</ul>
    {footer && <Text variant="footnote" tone="secondary" className="lg-list-footer">{footer}</Text>}
  </section>;
}

/**
 * Two keys are taken back from `<li>`: its `value` is the ordered-list number, and its
 * `onSelect` is the text-selection event. A row's `value` is the trailing read-out and its
 * `onSelect` is the row being chosen, which is what a caller means by either word here.
 */
export interface ListRowProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'value' | 'onSelect'>, RefAttributes<HTMLLIElement> {
  label: ReactNode;
  /** A second line under the label, for context that does not belong in the label itself. */
  secondaryLabel?: ReactNode;
  /** Trailing read-only value, e.g. the current setting. */
  value?: ReactNode;
  /** Leading glyph or avatar. Separators inset past it, as the system does. */
  leading?: ReactNode;
  /** Trailing interactive element (a switch, a stepper). Suppresses the disclosure chevron. */
  accessory?: ReactNode;
  href?: string;
  onSelect?: (event: MouseEvent<HTMLElement>) => void;
  /** Force the chevron on or off; by default it appears for navigating rows. */
  disclosure?: boolean;
  destructive?: boolean;
  disabled?: boolean;
}
/**
 * One row. Navigating rows render as a real link or button so keyboard and assistive
 * technology get the right affordance — a `div` with an onClick is not a row, it is a trap.
 * Minimum height is the 44pt hit region even when the text is a single short line.
 */
export function ListRow({ label, secondaryLabel, value, leading, accessory, href, onSelect, disclosure, destructive, disabled, className, ref, ...props }: ListRowProps) {
  const interactive = !!href || !!onSelect;
  const showChevron = disclosure ?? (interactive && !accessory);
  const body = <>
    {leading && <span className="lg-row-leading" aria-hidden="true">{leading}</span>}
    <span className="lg-row-labels">
      <Text as="span" variant="body" tone={destructive ? 'destructive' : 'primary'} className="lg-row-label">{label}</Text>
      {secondaryLabel && <Text as="span" variant="footnote" tone="secondary" className="lg-row-secondary">{secondaryLabel}</Text>}
    </span>
    {value !== undefined && <Text as="span" variant="body" tone="secondary" className="lg-row-value">{value}</Text>}
    {accessory && <span className="lg-row-accessory">{accessory}</span>}
    {showChevron && <LibraryIcon name="chevronForward" size={17} className="lg-row-chevron" />}
  </>;
  return <li {...props} ref={ref} className={cx('lg-list-row', className)} data-interactive={interactive ? 'true' : undefined} data-disabled={disabled ? 'true' : undefined}>
    {href
      ? <a className="lg-row-hit" href={href} draggable={false} onClick={onSelect} aria-disabled={disabled || undefined}>{body}</a>
      : onSelect
        ? <button className="lg-row-hit" type="button" onClick={onSelect} disabled={disabled}>{body}</button>
        : <div className="lg-row-hit">{body}</div>}
  </li>;
}
