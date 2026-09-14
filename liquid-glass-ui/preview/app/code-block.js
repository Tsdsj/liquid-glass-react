import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Icon } from './icons.js';
export function CodeBlock({ code, label = '复制代码', children }) {
    const [copied, setCopied] = useState(false);
    const timer = useRef(0);
    useEffect(() => () => clearTimeout(timer.current), []);
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setCopied(false), 1600);
        }
        catch {
            setCopied(false);
        }
    };
    return _jsxs("div", { className: "code-block", children: [_jsx("pre", { children: children ?? code }), _jsxs("button", { type: "button", className: `code-copy ${copied ? 'is-copied' : ''}`, "aria-label": copied ? '已复制' : label, onClick: () => void copy(), children: [_jsx(Icon, { name: copied ? 'check' : 'copy', size: 14 }), _jsx("span", { children: copied ? '已复制' : '复制' })] })] });
}
