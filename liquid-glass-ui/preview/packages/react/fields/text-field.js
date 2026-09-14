'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useId } from 'react';
import { cx } from '../system/utils.js';
import { Text } from '../content/text.js';
/**
 * A rounded text field with a real `<label for>`.
 *
 * The details that make a web form feel native are all here and all easy to forget:
 * `autocomplete` and `inputmode` should be set by the caller for the field's purpose,
 * the font-size stays at 16px or above so iOS Safari does not zoom on focus, and the focus
 * ring is an `outline` on the container rather than a `box-shadow`.
 */
export const TextField = forwardRef(function TextField({ label, hint, error, leading, trailing, labelHidden = false, className, id, type = 'text', ...props }, ref) {
    const generated = useId();
    const fieldId = id ?? `${generated}-field`;
    const hintId = hint ? `${generated}-hint` : undefined;
    const errorId = error ? `${generated}-error` : undefined;
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;
    return _jsxs("div", { className: cx('lg-field', className), "data-invalid": error ? 'true' : undefined, children: [_jsx(Text, { as: "label", variant: "subhead", emphasized: true, className: cx('lg-field-label', labelHidden && 'lg-visually-hidden'), htmlFor: fieldId, children: label }), _jsxs("div", { className: "lg-field-box", children: [leading && _jsx("span", { className: "lg-field-leading", "aria-hidden": "true", children: leading }), _jsx("input", { ...props, ref: ref, id: fieldId, type: type, className: "lg-field-input", "aria-invalid": error ? true : undefined, "aria-describedby": describedBy }), trailing && _jsx("span", { className: "lg-field-trailing", children: trailing })] }), error && _jsx(Text, { id: errorId, variant: "footnote", tone: "destructive", className: "lg-field-message", children: error }), hint && !error && _jsx(Text, { id: hintId, variant: "footnote", tone: "secondary", className: "lg-field-message", children: hint })] });
});
