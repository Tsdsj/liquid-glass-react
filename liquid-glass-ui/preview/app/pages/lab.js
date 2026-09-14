import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { GlassButton, GlassProvider, GlassSegmentedControl, GlassSlider, GlassSurface, GlassSwitch } from '@liquid-glass-ui/react';
import { AlpineScene, SyntheticVideo } from '../scene.js';
import { Icon } from '../icons.js';
import { Page } from '../site/page.js';
import { Text } from '@liquid-glass-ui/react';
import { CodeBlock } from '../site/code-block.js';
export const backgrounds = [['alpine', '山间场景'], ['white', '白色背景'], ['black', '黑色背景'], ['split', '明暗交界'], ['grid', '细线网格'], ['text', '滚动正文'], ['video', '合成视频']];
export function StressBackground({ kind, children }) {
    return _jsxs("div", { className: `stress-background bg-${kind}`, children: [kind === 'alpine' && _jsx(AlpineScene, {}), kind === 'video' && _jsx(SyntheticVideo, { playing: true }), kind === 'text' && _jsx("div", { className: "background-paragraphs", "aria-hidden": "true", children: Array.from({ length: 12 }, (_, i) => _jsx("p", { children: "\u6E05\u6670\u5148\u4E8E\u900F\u660E\u3002\u754C\u9762\u662F\u5185\u5BB9\u4E0E\u64CD\u4F5C\u7684\u5173\u7CFB\uFF0C\u800C\u4E0D\u662F\u4E00\u5C42\u6EE4\u955C\u3002Keep the content clear. Form follows purpose. 0123456789" }, i)) }), children] });
}
/** Drag the specimen across the background with the pointer; keyboard users can nudge it with arrow keys on the grip. */
function useDraggable(bounds) {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const start = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
    const clampOffset = (x, y) => {
        const box = bounds.current?.getBoundingClientRect();
        if (!box)
            return { x, y };
        const limitX = Math.max(0, box.width / 2 - 120), limitY = Math.max(0, box.height / 2 - 100);
        return { x: Math.max(-limitX, Math.min(limitX, x)), y: Math.max(-limitY, Math.min(limitY, y)) };
    };
    const onPointerDown = (event) => {
        if (event.target.closest('button,input,a,select,textarea,[role="slider"]'))
            return;
        if (event.button !== 0)
            return;
        event.currentTarget.setPointerCapture(event.pointerId);
        start.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y };
        setDragging(true);
    };
    const onPointerMove = (event) => {
        if (!dragging)
            return;
        setOffset(clampOffset(start.current.ox + event.clientX - start.current.x, start.current.oy + event.clientY - start.current.y));
    };
    const onPointerUp = () => setDragging(false);
    const nudge = (dx, dy) => setOffset(current => clampOffset(current.x + dx, current.y + dy));
    const reset = () => setOffset({ x: 0, y: 0 });
    return { offset, dragging, handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp }, nudge, reset };
}
export function MaterialLab() {
    const [material, setMaterial] = useState('clear');
    const [tone, setTone] = useState('dark');
    const [background, setBackground] = useState('alpine');
    const [strength, setStrength] = useState(32);
    const [renderer, setRenderer] = useState('svg');
    const [radius, setRadius] = useState(32);
    const [clicks, setClicks] = useState(0);
    const [drift, setDrift] = useState(false);
    const preview = useRef(null);
    const drag = useDraggable(preview);
    useEffect(() => { if (!drift)
        return; let frame = 0; const start = performance.now(); const tick = (now) => { const t = (now - start) / 1000; preview.current?.style.setProperty('--drift', `${Math.sin(t / 1.8) * 70}px ${Math.cos(t / 2.6) * 30}px`); frame = requestAnimationFrame(tick); }; frame = requestAnimationFrame(tick); return () => { cancelAnimationFrame(frame); preview.current?.style.removeProperty('--drift'); }; }, [drift]);
    const specimenStyle = { '--offset-x': `${drag.offset.x}px`, '--offset-y': `${drag.offset.y}px` };
    return _jsxs(Page, { eyebrow: "\u5B9E\u9A8C\u5BA4", title: "\u6750\u8D28\u5B9E\u9A8C\u53F0", lede: "\u5728\u540C\u4E00\u7EC4\u80CC\u666F\u4E2D\u89C2\u5BDF\u6298\u5C04\u3001\u6A21\u7CCA\u4E0E\u53EF\u8BFB\u6027\u3002\u62D6\u52A8\u73BB\u7483\u7A7F\u8FC7\u660E\u6697\u4EA4\u754C\uFF0C\u6309\u4F4F\u6309\u94AE\u611F\u53D7\u56DE\u5F39\u3002\u6EE4\u955C\u53C2\u6570\u4E0D\u7B49\u4E8E\u8BBE\u8BA1\u7CFB\u7EDF\u3002", children: [_jsxs("div", { className: "lab-layout", children: [_jsx("div", { className: `lab-preview ${drag.dragging ? 'is-dragging' : ''} ${drift ? 'is-drifting' : ''}`, ref: preview, children: _jsxs(StressBackground, { kind: background, children: [_jsx("div", { className: "specimen-drift", style: specimenStyle, children: _jsxs(GlassSurface, { className: "specimen", material: material, backdropTone: tone, renderer: renderer, radius: radius, refraction: strength, "data-testid": "lab-specimen", ...drag.handlers, children: [_jsxs("button", { type: "button", className: "specimen-grip", "aria-label": "\u79FB\u52A8\u73BB\u7483\u8BD5\u6837\uFF08\u65B9\u5411\u952E\u5FAE\u8C03\uFF09", onKeyDown: e => { const step = e.shiftKey ? 40 : 12; if (e.key === 'ArrowLeft') {
                                                    e.preventDefault();
                                                    drag.nudge(-step, 0);
                                                }
                                                else if (e.key === 'ArrowRight') {
                                                    e.preventDefault();
                                                    drag.nudge(step, 0);
                                                }
                                                else if (e.key === 'ArrowUp') {
                                                    e.preventDefault();
                                                    drag.nudge(0, -step);
                                                }
                                                else if (e.key === 'ArrowDown') {
                                                    e.preventDefault();
                                                    drag.nudge(0, step);
                                                }
                                                else if (e.key === 'Home') {
                                                    e.preventDefault();
                                                    drag.reset();
                                                } }, children: [_jsx("i", {}), _jsx("i", {}), _jsx("i", {})] }), _jsx("span", { className: "specimen-symbol", children: _jsx(Icon, { name: "layer", size: 28 }) }), _jsx("span", { className: "specimen-overline", children: "LIQUID / 01" }), _jsx("h2", { children: "\u6709\u539A\u5EA6\u7684\u8F7B\u76C8\u3002" }), _jsx("p", { children: "\u6298\u5C04\u7559\u5728\u8FB9\u7F18\uFF0C\u6587\u5B57\u4FDD\u6301\u6E05\u6670\u3002" }), _jsxs(GlassButton, { material: material, backdropTone: tone, onClick: () => setClicks(c => c + 1), "data-testid": "specimen-action", children: ["\u89E6\u78B0\u4E00\u4E0B ", _jsx(Icon, { name: "arrow", size: 16 })] }), _jsx("span", { role: "status", className: "specimen-status", children: clicks ? `已响应 ${clicks} 次交互` : '拖动我 · 按住看边缘折射加深' })] }) }), _jsxs("div", { className: "lab-preview-hud", children: [_jsx("span", { children: drag.offset.x || drag.offset.y ? `Δ ${Math.round(drag.offset.x)}, ${Math.round(drag.offset.y)}` : 'DRAG THE GLASS' }), (drag.offset.x || drag.offset.y) ? _jsx("button", { type: "button", onClick: drag.reset, children: "\u5F52\u4F4D" }) : null] })] }) }), _jsxs("aside", { className: "inspector", "aria-label": "\u6750\u8D28\u63A7\u5236\u9762\u677F", children: [_jsxs("div", { className: "inspector-title", children: [_jsx(Icon, { name: "tune", size: 17 }), _jsx("h2", { children: "\u6750\u8D28\u53C2\u6570" }), _jsx("span", { children: "LIVE" })] }), _jsxs("div", { className: "inspector-field", children: [_jsx("span", { className: "field-label", children: "\u6E32\u67D3\u5668" }), _jsx(GlassSegmentedControl, { "aria-label": "\u6E32\u67D3\u5668", density: "compact", value: renderer, onValueChange: v => setRenderer(v), items: [{ value: 'css', label: 'CSS' }, { value: 'svg', label: 'SVG' }, { value: 'auto', label: 'Auto' }] }), _jsx("p", { className: "field-hint", children: renderer === 'css' ? '模糊 / 底色 / 高光基线' : renderer === 'svg' ? '几何位移图折射边缘' : 'Auto 默认保守 CSS' })] }), _jsxs("div", { className: "inspector-field", children: [_jsx("span", { className: "field-label", children: "\u6750\u8D28\u9884\u8BBE" }), _jsx(GlassSegmentedControl, { "aria-label": "\u6750\u8D28\u9884\u8BBE", density: "compact", value: material, onValueChange: v => setMaterial(v), items: [{ value: 'regular', label: 'Regular' }, { value: 'clear', label: 'Clear' }] }), _jsx("p", { className: "field-hint", children: material === 'regular' ? '可读优先，适合文字较多' : '受控媒体场景，更透明' })] }), _jsxs("div", { className: "inspector-field", children: [_jsx("span", { className: "field-label", children: "\u80CC\u666F\u4E0A\u4E0B\u6587" }), _jsx(GlassSegmentedControl, { "aria-label": "\u80CC\u666F\u4E0A\u4E0B\u6587", density: "compact", value: tone, onValueChange: v => setTone(v), items: [{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }, { value: 'mixed', label: 'Mixed' }] }), _jsx("p", { className: "field-hint", children: tone === 'dark' ? '已知暗背景' : tone === 'light' ? '亮背景，叠加暗化层' : '未知背景，回退 Regular' })] }), _jsxs("div", { className: "inspector-field", children: [_jsxs("div", { className: "field-heading", children: [_jsx("span", { children: "\u6298\u5C04\u5E45\u5EA6" }), _jsxs("output", { children: [strength, " px"] })] }), _jsx(GlassSlider, { "aria-label": "\u6298\u5C04\u5E45\u5EA6", min: 0, max: 64, value: strength, onValueChange: setStrength, formatValue: v => `${v} px` })] }), _jsxs("div", { className: "inspector-field", children: [_jsxs("div", { className: "field-heading", children: [_jsx("span", { children: "\u51E0\u4F55\u5706\u89D2" }), _jsxs("output", { children: [radius, " px"] })] }), _jsx(GlassSlider, { "aria-label": "\u51E0\u4F55\u5706\u89D2", min: 8, max: 80, value: radius, onValueChange: setRadius })] }), _jsx("div", { className: "inspector-switch", children: _jsx(GlassSwitch, { "aria-label": "\u80CC\u666F\u6F02\u79FB", checked: drift, onCheckedChange: setDrift, label: "\u8BA9\u80CC\u666F\u6F02\u79FB" }) }), _jsxs("div", { className: "inspector-note", children: [_jsx(Icon, { name: "info", size: 16 }), _jsx("p", { children: "Clear + Mixed \u4F1A\u56DE\u9000\u4E3A Regular\u3002\u51CF\u5C11\u900F\u660E\u5EA6\u8BBE\u7F6E\u4F18\u5148\u4E8E\u6548\u679C\u9009\u9879\u3002" })] })] })] }), _jsx("div", { className: "background-selector", role: "group", "aria-label": "\u6D4B\u8BD5\u80CC\u666F", children: backgrounds.map(([value, label]) => _jsxs("button", { type: "button", className: background === value ? 'is-active' : '', "aria-pressed": background === value, onClick: () => setBackground(value), children: [_jsx("span", { className: `swatch bg-${value}` }), label] }, value)) }), _jsxs("section", { className: "section-block", children: [_jsxs("div", { className: "section-title", children: [_jsx("h2", { children: "\u4E09\u6761\u8DEF\u5F84\uFF0C\u540C\u4E00\u4E2A\u573A\u666F\u3002" }), _jsx("span", { children: "CSS / SVG / OPAQUE" })] }), _jsx("div", { className: "comparison-grid", children: ['css', 'svg', 'opaque'].map(mode => _jsxs("div", { className: "comparison-card", children: [_jsx(StressBackground, { kind: background === 'video' ? 'grid' : background, children: _jsx(GlassProvider, { transparency: mode === 'opaque' ? 'opaque' : 'system', children: _jsxs(GlassSurface, { renderer: mode === 'opaque' ? 'css' : mode, material: "clear", backdropTone: "dark", radius: 28, className: "comparison-specimen", children: [_jsx(Icon, { name: "layer", size: 25 }), _jsx("strong", { children: "Liquid Glass" }), _jsx("span", { children: "\u8FB9\u7F18\u3001\u5E95\u8272\u3001\u771F\u5B9E\u6587\u5B57" }), _jsx(GlassButton, { density: "compact", children: "\u6309\u4F4F\u8BD5\u8BD5" })] }) }) }), _jsxs("div", { className: "comparison-caption", children: [_jsx("strong", { children: mode === 'css' ? 'CSS 基线' : mode === 'svg' ? 'SVG 增强' : '不透明回退' }), _jsx("span", { children: mode === 'svg' ? '背景位移 · 前景不变' : mode === 'css' ? '模糊 / 底色 / 高光' : '优先保障稳定可读' })] })] }, mode)) }), _jsx("p", { className: "section-note", children: "\u8FD9\u91CC\u6BD4\u8F83\u672C\u9879\u76EE\u4E09\u79CD\u8DEF\u5F84\u3002rdev\u3001Liqui Design \u7684\u7B2C\u4E09\u65B9\u5B9E\u6D4B\u5C1A\u672A\u5B8C\u6210\uFF0C\u8BE6\u89C1 docs/competitor-evaluation.md\uFF1B\u6CA1\u6709\u7528\u6A21\u62DF\u6548\u679C\u5192\u5145\u7ADE\u54C1\u3002" })] }), _jsxs("section", { className: "code-card", children: [_jsx(Text, { variant: "footnote", emphasized: true, tone: "accent", children: "\u5F53\u524D\u914D\u7F6E" }), _jsx(CodeBlock, { code: `<GlassSurface\n  material="${material}"\n  backdropTone="${tone}"\n  renderer="${renderer}"\n  radius={${radius}}\n  refraction={${strength}}\n>\n  <h2>有厚度的轻盈。</h2>\n</GlassSurface>` })] })] });
}
