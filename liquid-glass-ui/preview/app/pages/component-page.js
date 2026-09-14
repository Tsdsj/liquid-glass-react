import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Divider, Text } from '@liquid-glass-ui/react';
import { Demo } from '../site/demo.js';
import { CodeBlock } from '../site/code-block.js';
import { PropsTable } from '../site/props-table.js';
import { Page, Section } from '../site/page.js';
/**
 * One renderer for every component page. The pages are data, not thirty near-identical
 * files — which also means the sections cannot quietly drift apart from each other.
 */
export function ComponentPage({ doc }) {
    const Example = doc.example;
    return _jsxs(Page, { eyebrow: doc.group, title: doc.name, lede: doc.summary, children: [doc.rule && _jsxs(Card, { fill: "secondary", radius: 20, padding: 16, className: "doc-rule", children: [_jsx(Text, { variant: "footnote", emphasized: true, tone: "accent", children: "\u8BBE\u8BA1\u89C4\u5219" }), _jsx(Text, { variant: "subhead", style: { marginBlockStart: 6 }, children: doc.rule })] }), _jsx(Section, { title: "\u793A\u4F8B", children: _jsx(Demo, { backdrop: doc.backdrop, height: doc.demoHeight, label: `${doc.name} · 实时示例`, children: _jsx(Example, {}) }) }), _jsx(Section, { title: "\u7528\u6CD5", children: _jsx(CodeBlock, { code: doc.code }) }), _jsx(Section, { title: "\u5C5E\u6027", children: _jsx(PropsTable, { rows: doc.props }) }), _jsx(Section, { title: "\u65E0\u969C\u788D\u4E0E\u952E\u76D8", children: _jsx("ul", { className: "doc-a11y", children: doc.a11y.map(item => _jsx("li", { children: _jsx(Text, { as: "span", variant: "subhead", children: item }) }, item)) }) }), _jsx(Divider, { style: { marginBlock: 24 } }), _jsxs(Text, { variant: "footnote", tone: "tertiary", children: ["\u672C\u7EC4\u4EF6\u5C5E\u4E8E", doc.group, "\u3002\u73BB\u7483\u53EA\u7528\u4E8E\u6D6E\u52A8\u7684\u64CD\u4F5C\u4E0E\u5BFC\u822A\u5C42\uFF1B\u5185\u5BB9\u5C42\u4F7F\u7528\u5B9E\u8272\u6216\u6807\u51C6\u6750\u8D28\u3002"] })] });
}
