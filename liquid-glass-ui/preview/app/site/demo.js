import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { GlassBackdrop, GlassProvider, GlassSegmentedControl, Text } from '@liquid-glass-ui/react';
import { AlpineScene } from '../scene.js';
/**
 * The frame every live example sits in.
 *
 * A glass component that has only been looked at over one background has not been checked:
 * the material takes its colour from behind, so each example can be flipped between the app
 * background and photographic content, in either appearance.
 */
export function Demo({ children, backdrop = 'plain', height = 220, label }) {
    const [scheme, setScheme] = useState('light');
    const [surface, setSurface] = useState(backdrop === 'media' ? 'media' : 'plain');
    const showSurfaceToggle = backdrop === 'both';
    return _jsxs("figure", { className: "demo", children: [_jsxs("div", { className: "demo-toolbar", children: [label && _jsx(Text, { variant: "caption1", tone: "secondary", className: "demo-label", children: label }), _jsxs("div", { className: "demo-switches", children: [showSurfaceToggle && _jsx(GlassSegmentedControl, { "aria-label": "\u6F14\u793A\u80CC\u666F", density: "compact", value: surface, onValueChange: value => setSurface(value), items: [{ value: 'plain', label: '纯色' }, { value: 'media', label: '图像' }] }), _jsx(GlassSegmentedControl, { "aria-label": "\u6F14\u793A\u5916\u89C2", density: "compact", value: scheme, onValueChange: value => setScheme(value), items: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }] })] })] }), _jsxs("div", { className: "demo-stage", "data-scheme": scheme, "data-surface": surface, style: { minHeight: height }, children: [surface === 'media' && _jsx("div", { className: "demo-art", "aria-hidden": "true", children: _jsx(AlpineScene, {}) }), _jsx(GlassProvider, { theme: scheme, children: _jsx(GlassBackdrop, { tone: surface === 'media' ? 'dark' : 'mixed', className: "demo-content", children: children }) })] })] });
}
