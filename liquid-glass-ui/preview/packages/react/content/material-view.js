'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { cx } from '../system/utils.js';
/**
 * A *standard material* — the content layer's translucency tool, and the right answer
 * whenever the instinct is to reach for glass on something that does not float. It blurs
 * and tints, but it does not lens, does not carry a specular rim and does not flip with its
 * backdrop, because it is part of the content rather than hovering above it.
 *
 * Use vibrant label tones on top (`Text tone="secondary"`), and avoid `quaternary` on the
 * thin and ultraThin variants, where it falls below readable contrast.
 */
export const MaterialView = forwardRef(function MaterialView({ thickness = 'regular', radius = 20, className, style, children, ...props }, ref) {
    return _jsx("div", { ...props, ref: ref, className: cx('lg-material-view', className), "data-thickness": thickness, style: { borderRadius: `${radius}px`, ...style }, children: children });
});
