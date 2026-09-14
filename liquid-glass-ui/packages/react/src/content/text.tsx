'use client';
import { createElement, type ElementType, type HTMLAttributes } from 'react';
import type { TextStyle } from '@liquid-glass-ui/tokens';
import { cx } from '../system/utils.js';

export type TextTone = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'accent' | 'destructive';

export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /**
   * An iOS text style, not a size. Styles carry size, leading and tracking together and
   * scale with Dynamic Type; picking `caption2` and then overriding font-size defeats both.
   */
  variant?: TextStyle;
  /** Semibold/bold companion of the style, per the HIG "Emphasized" column. */
  emphasized?: boolean;
  tone?: TextTone;
  /**
   * The element to render. Defaults to `p` — headings are never inferred, because guessing
   * a level is how documents end up with three `h1`s and an unusable rotor. Pass `as="h2"`.
   */
  as?: ElementType;
  /** Columns of figures and timers line up only with tabular digits. */
  tabular?: boolean;
}

export function Text({ variant = 'body', emphasized = false, tone = 'primary', as = 'p', tabular = false, className, ...props }: TextProps) {
  return createElement(as, {
    ...props,
    'data-variant': variant,
    'data-tone': tone,
    'data-emphasized': emphasized ? 'true' : undefined,
    'data-tabular': tabular ? 'true' : undefined,
    className: cx('lg-text', className),
  });
}
