import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, List, ListRow, ListSection, Text } from '@liquid-glass-ui/react';
import { Page, Section } from '../site/page.js';
import { componentDocs, groupedDocs } from '../catalog/index.js';
export function ComponentsIndex({ go }) {
    return _jsx(Page, { eyebrow: "\u7EC4\u4EF6", title: "\u7EC4\u4EF6\u76EE\u5F55", lede: `${componentDocs.length} 个组件，按所属的层分组。内容层在前，浮动的操作与导航层在后——这个顺序本身就是规则的一部分。`, children: _jsx(Section, { title: "\u6309\u5C42\u6D4F\u89C8", children: _jsx("div", { className: "catalog-groups", children: groupedDocs.map(({ group, docs }) => _jsxs(Card, { radius: 20, padding: 0, className: "catalog-card", children: [_jsxs("div", { className: "catalog-card-head", children: [_jsx(Text, { as: "h3", variant: "headline", children: group }), _jsxs(Text, { variant: "caption1", tone: "tertiary", children: [docs.length, " \u4E2A"] })] }), _jsx(List, { variant: "plain", children: _jsx(ListSection, { children: docs.map(doc => _jsx(ListRow, { label: doc.name, secondaryLabel: doc.summary, onSelect: () => go(`components/${doc.slug}`) }, doc.slug)) }) })] }, group)) }) }) });
}
