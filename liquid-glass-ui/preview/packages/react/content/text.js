'use client';
import { createElement } from 'react';
import { cx } from '../system/utils.js';
export function Text({ variant = 'body', emphasized = false, tone = 'primary', as = 'p', tabular = false, className, ...props }) {
    return createElement(as, {
        ...props,
        'data-variant': variant,
        'data-tone': tone,
        'data-emphasized': emphasized ? 'true' : undefined,
        'data-tabular': tabular ? 'true' : undefined,
        className: cx('lg-text', className),
    });
}
