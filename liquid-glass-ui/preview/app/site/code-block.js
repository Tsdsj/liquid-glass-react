import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { GlassButton, LibraryIcon } from '@liquid-glass-ui/react';
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
    return _jsxs("div", { className: "code-block", children: [_jsx("pre", { children: _jsx("code", { children: children ?? code }) }), _jsxs(GlassButton, { className: "code-copy", variant: "gray", controlSize: "small", "aria-label": copied ? '已复制' : label, onClick: () => void copy(), children: [_jsx(LibraryIcon, { name: copied ? 'checkmark' : 'plus', size: 14 }), _jsx("span", { children: copied ? '已复制' : '复制' })] })] });
}
