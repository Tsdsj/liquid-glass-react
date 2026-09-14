'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { cx } from '../system/utils.js';
import { Text } from '../content/text.js';
/**
 * A large title that hands over to a compact one as it scrolls away.
 *
 * The compact title is hidden while the large title is still on screen — showing both means
 * the same words twice, which is the most common way this pattern is misread. The bar itself
 * carries no background, border or shadow of its own: separation comes from the glass of the
 * control groups inside it and from the scroll edge effect beneath.
 */
export function NavigationBar({ title, leading, trailing, largeTitle = true, subtitle, 'aria-label': label, className, children }) {
    const [compact, setCompact] = useState(!largeTitle);
    const sentinel = useRef(null);
    useEffect(() => {
        if (!largeTitle) {
            setCompact(true);
            return;
        }
        const node = sentinel.current;
        if (!node || typeof IntersectionObserver === 'undefined')
            return;
        const observer = new IntersectionObserver(([entry]) => setCompact(!entry.isIntersecting), { threshold: 0 });
        observer.observe(node);
        return () => observer.disconnect();
    }, [largeTitle]);
    return _jsxs(_Fragment, { children: [_jsxs("header", { className: cx('lg-navbar', className), "aria-label": label, "data-compact": compact ? 'true' : undefined, children: [_jsx("div", { className: "lg-navbar-leading", children: leading }), _jsx("div", { className: "lg-navbar-title", "aria-hidden": "true", children: title }), _jsx("div", { className: "lg-navbar-trailing", children: trailing })] }), largeTitle && _jsxs("div", { className: "lg-largetitle", children: [_jsx(Text, { as: "h1", variant: "largeTitle", emphasized: true, children: title }), subtitle && _jsx(Text, { variant: "subhead", tone: "secondary", children: subtitle }), _jsx("div", { ref: sentinel, className: "lg-largetitle-sentinel", "aria-hidden": "true" })] }), children] });
}
