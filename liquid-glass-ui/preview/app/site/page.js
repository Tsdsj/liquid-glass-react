import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Text } from '@liquid-glass-ui/react';
/** Page chrome. The heading is a real `h1`; `Text` never infers heading levels on its own. */
export function Page({ eyebrow, title, lede, children }) {
    return _jsxs("article", { className: "page", children: [_jsxs("header", { className: "page-head", children: [eyebrow && _jsx(Text, { variant: "subhead", emphasized: true, tone: "accent", className: "page-eyebrow", children: eyebrow }), _jsx(Text, { as: "h1", variant: "largeTitle", emphasized: true, children: title }), lede && _jsx(Text, { variant: "callout", tone: "secondary", className: "page-lede", children: lede })] }), children] });
}
export function Section({ title, description, children, id }) {
    return _jsxs("section", { className: "page-section", id: id, children: [_jsx(Text, { as: "h2", variant: "title2", emphasized: true, children: title }), description && _jsx(Text, { variant: "subhead", tone: "secondary", className: "section-lede", children: description }), children] });
}
/** A short rule quoted from the guidance, so the "why" sits next to the example. */
export function Rule({ children }) {
    return _jsx("aside", { className: "rule-note", children: _jsx(Text, { variant: "footnote", tone: "secondary", children: children }) });
}
