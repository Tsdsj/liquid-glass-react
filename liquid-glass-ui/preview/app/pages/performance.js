import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { GlassButton, GlassGroup, GlassProvider, GlassSurface, getGlassDiagnostics, useGlassPolicy } from '@liquid-glass-ui/react';
import { Icon } from '../icons.js';
import { Page } from '../site/page.js';
const percentile = (values, p) => [...values].sort((a, b) => a - b)[Math.min(values.length - 1, Math.floor(values.length * p))] ?? 0;
export function PerformancePage() {
    const policy = useGlassPolicy();
    const [count, setCount] = useState(8);
    const [shared, setShared] = useState(false);
    const [svg, setSvg] = useState(true);
    const [running, setRunning] = useState(false);
    const [result, setResult] = useState(null);
    const [diagnostics, setDiagnostics] = useState(getGlassDiagnostics());
    const frame = useRef(0);
    const finish = useRef(null);
    useEffect(() => { const timer = setInterval(() => setDiagnostics(getGlassDiagnostics()), 750); return () => { clearInterval(timer); cancelAnimationFrame(frame.current); finish.current?.(); }; }, []);
    const run = () => {
        cancelAnimationFrame(frame.current);
        finish.current?.();
        setRunning(true);
        setResult(null);
        const values = [];
        let previous = 0;
        let longTasks = 0;
        const observer = typeof PerformanceObserver !== 'undefined' && PerformanceObserver.supportedEntryTypes.includes('longtask') ? new PerformanceObserver(list => { longTasks += list.getEntries().length; }) : null;
        observer?.observe({ type: 'longtask', buffered: false });
        let completed = false;
        const stop = (aborted = false) => {
            if (completed)
                return;
            completed = true;
            cancelAnimationFrame(frame.current);
            observer?.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
            setRunning(false);
            setResult({ kind: 'requestAnimationFrame intervals, NOT GPU frame timings / INP', aborted, date: new Date().toISOString(), userAgent: navigator.userAgent, devicePixelRatio, hardwareConcurrency: navigator.hardwareConcurrency, viewport: [innerWidth, innerHeight], renderer: svg ? 'svg' : 'css', reducedMotion: policy.reduceMotion, mode: shared ? 'shared' : 'independent', count, samples: values.length, p50ms: +percentile(values, .5).toFixed(2), p95ms: +percentile(values, .95).toFixed(2), intervalsOver25ms: values.filter(v => v > 25).length, longTasks, diagnostics: getGlassDiagnostics() });
        };
        const onVisibility = () => { if (document.hidden)
            stop(true); };
        finish.current = () => { completed = true; observer?.disconnect(); document.removeEventListener('visibilitychange', onVisibility); };
        document.addEventListener('visibilitychange', onVisibility);
        const tick = (time) => { if (previous)
            values.push(time - previous); previous = time; if (values.length >= 180)
            stop();
        else
            frame.current = requestAnimationFrame(tick); };
        frame.current = requestAnimationFrame(tick);
    };
    const download = () => { const url = URL.createObjectURL(new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = 'glass-frame-observation.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); };
    return _jsxs(Page, { eyebrow: "\u5B9E\u9A8C\u5BA4", title: "\u6027\u80FD\u89C2\u6D4B", lede: "\u5BF9\u7167\u72EC\u7ACB\u8868\u9762\u4E0E\u5171\u4EAB\u8868\u9762\uFF0C\u8BB0\u5F55\u73AF\u5883\u4E0E\u4E3B\u7EBF\u7A0B\u5E27\u56DE\u8C03\u95F4\u9694\u3002\u8FD9\u662F\u8BCA\u65AD\u7EBF\u7D22\uFF0C\u4E0D\u662F\u771F\u673A GPU \u7ED3\u8BBA\u3002", children: [_jsxs("div", { className: "perf-controls", children: [_jsxs("label", { children: ["\u8868\u9762\u6570\u91CF", _jsxs("select", { value: count, disabled: running, onChange: e => setCount(Number(e.target.value)), children: [_jsx("option", { children: "1" }), _jsx("option", { children: "8" }), _jsx("option", { children: "24" }), _jsx("option", { children: "48" })] })] }), _jsxs("label", { children: ["\u5E03\u5C40\u7B56\u7565", _jsxs("select", { value: shared ? 'shared' : 'independent', disabled: running, onChange: e => setShared(e.target.value === 'shared'), children: [_jsx("option", { value: "independent", children: "\u72EC\u7ACB\u91C7\u6837" }), _jsx("option", { value: "shared", children: "\u5171\u4EAB\u4E00\u4E2A\u8868\u9762" })] })] }), _jsxs("label", { children: ["\u6E32\u67D3\u5668", _jsxs("select", { value: svg ? 'svg' : 'css', disabled: running, onChange: e => setSvg(e.target.value === 'svg'), children: [_jsx("option", { value: "svg", children: "SVG" }), _jsx("option", { value: "css", children: "CSS" })] })] }), _jsx(GlassButton, { variant: "glassProminent", disabled: running, onClick: run, children: running ? '采样中…' : '开始记录 180 帧回调' })] }), _jsx(GlassProvider, { renderer: svg ? 'svg' : 'css', children: _jsx("div", { className: `perf-stage ${running && !policy.reduceMotion ? 'is-running' : ''}`, children: shared ? _jsx(GlassGroup, { className: "perf-shared", children: Array.from({ length: count }, (_, i) => _jsxs(GlassButton, { children: ["\u64CD\u4F5C ", i + 1] }, i)) }) : _jsx("div", { className: "perf-items", children: Array.from({ length: count }, (_, i) => _jsxs(GlassSurface, { material: "clear", backdropTone: "dark", className: "perf-item", children: [_jsx(Icon, { name: "layer", size: 17 }), _jsxs("span", { children: ["Surface ", i + 1] })] }, i)) }) }) }), _jsxs("div", { className: "diagnostic-grid", children: [_jsxs("div", { children: [_jsx("span", { children: "\u7F13\u5B58\u6761\u76EE" }), _jsxs("strong", { children: [diagnostics.entries, " / ", diagnostics.maxEntries] })] }), _jsxs("div", { children: [_jsx("span", { children: "\u7F13\u5B58\u5B57\u7B26\u4E32\u4F30\u7B97" }), _jsxs("strong", { children: [(diagnostics.bytes / 1024).toFixed(1), " KB"] })] }), _jsxs("div", { children: [_jsx("span", { children: "\u7D2F\u8BA1\u8D34\u56FE\u751F\u6210" }), _jsx("strong", { children: diagnostics.generated })] }), _jsxs("div", { children: [_jsx("span", { children: "\u6D3B\u8DC3\u6750\u8D28\u5C3A\u5BF8\u89C2\u6D4B" }), _jsx("strong", { children: diagnostics.observers })] })] }), _jsxs("section", { className: "code-card", children: [_jsxs("div", { className: "section-title", children: [_jsx("h2", { children: "\u6D4B\u91CF\u8BB0\u5F55" }), result && _jsx(GlassButton, { density: "compact", onClick: download, children: "\u5BFC\u51FA JSON" })] }), _jsx("pre", { role: "status", children: result ? JSON.stringify(result, null, 2) : '等待采样。记录将包含 UA、DPR、视口、配置与 p50 / p95 帧回调间隔。' })] }), _jsxs("div", { className: "callout", children: [_jsx(Icon, { name: "info" }), _jsx("p", { children: "rAF \u95F4\u9694\u548C Long Tasks \u4EC5\u4F5C\u4E3A\u8BCA\u65AD\u7EBF\u7D22\u3002\u5B83\u4EEC\u4E0D\u662F\u5408\u6210\u5668\u5E27\u65F6\u95F4\u3001\u771F\u5B9E\u6389\u5E27\u7387\u3001INP \u6216\u8BBE\u5907 GPU \u6027\u80FD\u3002\u53D1\u5E03\u95E8\u69DB\u4ECD\u9700 DevTools \u5F55\u5236\u4E0E\u76EE\u6807\u8BBE\u5907\u77E9\u9635\u3002" })] })] });
}
