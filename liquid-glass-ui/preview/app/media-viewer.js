import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { GlassButton, GlassDialog, GlassIconButton, GlassMenu, GlassPopover, GlassSegmentedControl, GlassSlider, GlassToolbar, ToolbarGroup, ToolbarSpacer } from '@liquid-glass-ui/react';
import { Icon } from './icons.js';
import { AlpineScene, SyntheticVideo } from './scene.js';
export function MediaViewer({ compact = false }) {
    const [playing, setPlaying] = useState(false);
    const [favorite, setFavorite] = useState(false);
    const [scene, setScene] = useState(0);
    const [zoom, setZoom] = useState(false);
    const [volume, setVolume] = useState(65);
    const [exportOpen, setExportOpen] = useState(false);
    const [status, setStatus] = useState('');
    const [fileName, setFileName] = useState('alpine-study');
    const [view, setView] = useState('fit');
    const canvas = useRef(null);
    const download = () => {
        const svg = canvas.current?.querySelector('svg');
        if (!svg)
            return;
        const url = URL.createObjectURL(new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' }));
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${fileName.trim().replace(/[^\w\u4e00-\u9fa5-]/g, '_') || 'alpine-study'}.svg`;
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        setStatus('已导出原创 SVG 场景');
        setExportOpen(false);
    };
    return _jsxs("div", { className: `media-viewer ${compact ? 'is-compact' : ''}`, "data-testid": "media-viewer", children: [_jsx("div", { className: `scene-art ${zoom || view === 'fill' ? 'is-zoomed' : ''}`, ref: canvas, children: _jsx(AlpineScene, { warm: scene % 2 === 1 }) }), _jsx(SyntheticVideo, { playing: playing }), _jsxs("div", { className: "media-topline", children: [_jsxs("span", { className: "scene-identity", children: [_jsx("span", { className: "scene-dot" }), " FIELD NOTES ", _jsx("span", { className: "muted-divider", children: "/" }), " 0", scene % 2 + 1] }), _jsx(GlassIconButton, { material: "clear", backdropTone: "light", "aria-label": zoom ? '还原场景大小' : '放大场景', onClick: () => setZoom(!zoom), children: _jsx(Icon, { name: zoom ? 'shrink' : 'expand' }) })] }), _jsxs("div", { className: "scene-caption", children: [_jsx("span", { className: "eyebrow", children: "A STUDY IN STILLNESS" }), _jsx("h2", { children: scene % 2 ? '暮色，留在湖面。' : '山间，有回响。' }), _jsx("p", { children: "\u539F\u521B\u77E2\u91CF\u573A\u666F \u00B7 \u65E0\u5916\u90E8\u56FE\u7247\u4F9D\u8D56" })] }), _jsx("div", { className: "media-control-wrap", children: _jsxs(GlassToolbar, { "aria-label": "\u5A92\u4F53\u67E5\u770B\u5668\u64CD\u4F5C", className: "media-toolbar", children: [_jsxs(ToolbarGroup, { material: "clear", backdropTone: "dark", density: compact ? 'compact' : 'comfortable', children: [_jsx(GlassIconButton, { "aria-label": "\u4E0A\u4E00\u573A\u666F", onClick: () => { setScene(x => x + 1); setPlaying(false); }, children: _jsx(Icon, { name: "previous" }) }), _jsx(GlassIconButton, { "aria-label": playing ? '暂停动态背景' : '播放动态背景', "aria-pressed": playing, onClick: () => setPlaying(!playing), children: _jsx(Icon, { name: playing ? 'pause' : 'play' }) }), _jsx(GlassIconButton, { "aria-label": "\u4E0B\u4E00\u573A\u666F", onClick: () => { setScene(x => x + 1); setPlaying(false); }, children: _jsx(Icon, { name: "next" }) })] }), _jsx(ToolbarSpacer, {}), _jsxs(ToolbarGroup, { material: "clear", backdropTone: "dark", density: compact ? 'compact' : 'comfortable', children: [_jsx(GlassIconButton, { "aria-label": favorite ? '取消收藏' : '收藏场景', "aria-pressed": favorite, onClick: () => setFavorite(!favorite), children: _jsx(Icon, { name: "heart", style: favorite ? { fill: 'currentColor' } : undefined }) }), _jsxs(GlassPopover, { title: "\u67E5\u770B\u8BBE\u7F6E", description: "\u73BB\u7483\u627F\u8F7D\u64CD\u4F5C\uFF0C\u5185\u5BB9\u4FDD\u6301\u6E05\u6670\u3002", trigger: _jsx(GlassIconButton, { "aria-label": "\u6253\u5F00\u67E5\u770B\u8BBE\u7F6E", children: _jsx(Icon, { name: "tune" }) }), children: [_jsx("label", { className: "field-label", children: "\u663E\u793A\u65B9\u5F0F" }), _jsx(GlassSegmentedControl, { "aria-label": "\u663E\u793A\u65B9\u5F0F", value: view, onValueChange: setView, density: "compact", items: [{ value: 'fit', label: '适应' }, { value: 'fill', label: '填充' }] }), _jsxs("div", { className: "field-heading", children: [_jsx("span", { children: "\u97F3\u91CF\uFF08\u754C\u9762\u6F14\u793A\uFF09" }), _jsxs("output", { children: [volume, "%"] })] }), _jsx(GlassSlider, { "aria-label": "\u97F3\u91CF", value: volume, onValueChange: setVolume, formatValue: v => `${v}%` }), _jsx("p", { className: "micro-note", children: "\u52A8\u6001\u80CC\u666F\u662F\u672C\u5730\u5408\u6210\u89C6\u9891\uFF0C\u65E0\u97F3\u8F68\u3002" })] }), _jsx(GlassMenu, { "aria-label": "\u5A92\u4F53\u66F4\u591A\u64CD\u4F5C", trigger: _jsx(GlassIconButton, { "aria-label": "\u66F4\u591A\u5A92\u4F53\u64CD\u4F5C", children: _jsx(Icon, { name: "more" }) }), items: [
                                        { key: 'export', label: '导出原创场景', onSelect: () => setExportOpen(true) },
                                        { key: 'favorite', label: favorite ? '取消收藏' : '收藏此场景', onSelect: () => setFavorite(!favorite) },
                                        { key: 'reset', label: '重置查看器', separatorBefore: true, onSelect: () => { setScene(0); setZoom(false); setPlaying(false); setFavorite(false); setStatus('查看器已重置'); } },
                                    ] })] })] }) }), _jsx("span", { className: "media-footnote", children: playing ? 'LIVE · 合成视频测试' : '1200 × 720 · VECTOR' }), _jsx("span", { role: "status", className: "sr-only", children: status }), _jsx(GlassDialog, { title: "\u5BFC\u51FA\u8FD9\u4E00\u523B", description: "\u5BFC\u51FA\u7684\u662F\u9879\u76EE\u9644\u5E26\u7684\u539F\u521B SVG \u573A\u666F\uFF0C\u53EF\u7EE7\u7EED\u7F16\u8F91\u6216\u7528\u4E8E\u6D4B\u8BD5\u80CC\u666F\u3002", open: exportOpen, onOpenChange: setExportOpen, children: _jsxs("form", { onSubmit: event => { event.preventDefault(); download(); }, children: [_jsx("label", { className: "field-label", htmlFor: "export-name", children: "\u6587\u4EF6\u540D\u79F0" }), _jsx("input", { id: "export-name", className: "text-input", value: fileName, onChange: event => setFileName(event.target.value) }), _jsx("p", { className: "micro-note", children: "\u683C\u5F0F\uFF1ASVG \u00B7 \u65E0\u9700\u7F51\u7EDC \u00B7 \u4E0D\u5305\u542B\u5DE5\u5177\u680F" }), _jsxs("div", { className: "dialog-actions", children: [_jsx(GlassButton, { onClick: () => setExportOpen(false), children: "\u53D6\u6D88" }), _jsxs(GlassButton, { type: "submit", variant: "glassProminent", children: [_jsx(Icon, { name: "download", size: 16 }), "\u5BFC\u51FA SVG"] })] })] }) })] });
}
