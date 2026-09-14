'use client';
import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../system/utils.js';

export interface GlassBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** A count, or text for a status badge. Counts above `max` render as "max+". */
  count?: number;
  max?: number;
  children?: ReactNode;
  tone?: 'notification' | 'neutral' | 'accent';
  /** A bare dot, for "something changed" with no useful number. */
  dot?: boolean;
  /**
   * Badges are read out on their own, so say what the number means. Without this a screen
   * reader announces a naked "3".
   */
  'aria-label'?: string;
}

/**
 * Colour alone never carries the meaning here: the badge always contains a number or a
 * label, and the accessible name spells out what it counts.
 */
export function GlassBadge({ count, max = 99, children, tone = 'notification', dot = false, className, ...props }: GlassBadgeProps) {
  const text = dot ? null : children ?? (count === undefined ? null : count > max ? `${max}+` : String(count));
  if (!dot && (text === null || text === '')) return null;
  return <span {...props} className={cx('lg-badge', className)} data-tone={tone} data-dot={dot ? 'true' : undefined}>{text}</span>;
}
