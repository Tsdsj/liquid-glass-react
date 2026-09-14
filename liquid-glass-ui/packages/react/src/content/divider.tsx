'use client';
import type { HTMLAttributes } from 'react';
import { cx } from '../system/utils.js';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Leading inset, to line the rule up with text rather than the container edge. */
  inset?: number;
}
/**
 * A separator in the content layer. Bars and toolbars do not need one: their separation
 * comes from the glass and the scroll edge effect, not from a drawn line.
 */
export function Divider({ orientation = 'horizontal', inset = 0, className, style, ...props }: DividerProps) {
  return <div {...props} role="separator" aria-orientation={orientation} data-orientation={orientation}
    className={cx('lg-divider', className)}
    style={{ [orientation === 'horizontal' ? 'marginInlineStart' : 'marginBlockStart']: inset ? `${inset}px` : undefined, ...style }} />;
}
