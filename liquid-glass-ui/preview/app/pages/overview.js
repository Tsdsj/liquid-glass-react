import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, GlassButton, LibraryIcon, Text } from '@liquid-glass-ui/react';
import { Page, Section } from '../site/page.js';
import { MediaViewer } from '../media-viewer.js';
import { componentDocs } from '../catalog/index.js';
import { Icon } from '../icons.js';
const PRINCIPLES = [
    {
        icon: 'layer',
        title: '材质有边界',
        body: '玻璃属于浮动的操作与导航层。正文、列表、卡片与页面背景使用实色或标准材质——如果所有东西都半透明，就没有东西在“浮起来”。',
    },
    {
        icon: 'shield',
        title: '清晰是默认值',
        body: 'Regular 优先保证可读，Clear 只用于受控的媒体背景。减少透明度、增强对比度、减少动效三项系统偏好永远优先于视觉效果。',
    },
    {
        icon: 'code',
        title: '控件是可以拖的',
        body: '分段控件、开关、滑块都 1:1 跟随指针、随拖动拉伸、松手弹簧归位。只能点击的实现，是一套界面“不像 Apple”的最明显特征。',
    },
];
export function OverviewPage({ go }) {
    return _jsxs(Page, { title: "\u8F7B\u76C8\u6709\u5F62\uFF0C\u6E05\u6670\u5982\u521D\u3002", lede: "\u4E00\u5957\u9075\u5FAA Apple \u8BBE\u8BA1\u8BED\u8A00\u7684 React \u7EC4\u4EF6\u7CFB\u7EDF\uFF1A\u5185\u5BB9\u5C42\u4E0E\u64CD\u4F5C\u5C42\u5206\u5F00\uFF0C\u6750\u8D28\u53EA\u7528\u5728\u8BE5\u7528\u7684\u5730\u65B9\uFF0C\u4EA4\u4E92\u7EC6\u8282\u6309 HIG \u5B9E\u73B0\u5230\u4F4D\u3002", children: [_jsxs("div", { className: "hero-actions", children: [_jsxs(GlassButton, { variant: "glassProminent", controlSize: "large", onClick: () => go('components'), children: ["\u6D4F\u89C8 ", componentDocs.length, " \u4E2A\u7EC4\u4EF6", _jsx(LibraryIcon, { name: "chevronForward", size: 17 })] }), _jsx(GlassButton, { variant: "gray", controlSize: "large", onClick: () => go('guides/install'), children: "\u63A5\u5165\u6307\u5357" })] }), _jsx(Section, { title: "\u4E00\u4E2A\u771F\u5B9E\u573A\u666F", description: "\u73BB\u7483\u627F\u8F7D\u64CD\u4F5C\uFF0C\u5185\u5BB9\u4FDD\u6301\u6E05\u6670\u3002\u6309\u4F4F\u5DE5\u5177\u680F\u6309\u94AE\uFF0C\u611F\u53D7\u5B83\u4ECE\u73BB\u7483\u4E2D\u6D6E\u8D77\u518D\u56DE\u5F39\u3002", children: _jsx(MediaViewer, {}) }), _jsx(Section, { title: "\u4E09\u6761\u539F\u5219", children: _jsx("div", { className: "principles", children: PRINCIPLES.map(item => _jsxs(Card, { radius: 20, padding: 20, className: "principle", children: [_jsx(Icon, { name: item.icon, size: 24 }), _jsx(Text, { as: "h3", variant: "headline", style: { marginBlockStart: 12 }, children: item.title }), _jsx(Text, { variant: "subhead", tone: "secondary", style: { marginBlockStart: 8 }, children: item.body })] }, item.title)) }) }), _jsx(Section, { title: "\u8FD9\u5957\u7CFB\u7EDF\u4E0D\u627F\u8BFA\u4EC0\u4E48", description: "\u628A\u8FB9\u754C\u5199\u6E05\u695A\uFF0C\u6BD4\u628A\u6F14\u793A\u505A\u5F97\u66F4\u70AB\u66F4\u6709\u4EF7\u503C\u3002", children: _jsx(Card, { fill: "secondary", radius: 20, padding: 20, children: _jsxs("ul", { className: "plain-list", children: [_jsx("li", { children: _jsx(Text, { as: "span", variant: "subhead", children: "\u4E0D\u662F Apple \u5B98\u65B9\u4EA7\u54C1\uFF0C\u4E0D\u5305\u542B Apple \u5B57\u4F53\u3001SF Symbols \u6216\u58C1\u7EB8\u7D20\u6750\u3002\u56FE\u6807\u5168\u90E8\u6309 24\u00D724 / 1.8 \u63CF\u8FB9\u81EA\u7ED8\u3002" }) }), _jsx("li", { children: _jsxs(Text, { as: "span", variant: "subhead", children: ["\u80CC\u666F\u8272\u8C03\u7531 ", _jsx("code", { children: "GlassBackdrop" }), " \u663E\u5F0F\u58F0\u660E\uFF0C\u4E0D\u505A DOM \u622A\u5C4F\u6216\u8DE8\u6E90\u50CF\u7D20\u91C7\u6837\u3002"] }) }), _jsx("li", { children: _jsx(Text, { as: "span", variant: "subhead", children: "\u6027\u80FD\u9875\u8BB0\u5F55\u7684\u662F rAF \u56DE\u8C03\u95F4\u9694\uFF0C\u4E0D\u662F\u5408\u6210\u5668\u5E27\u65F6\u95F4\u3001\u6389\u5E27\u7387\u6216 INP\u3002" }) }), _jsx("li", { children: _jsx(Text, { as: "span", variant: "subhead", children: "\u771F\u673A Chrome \u77E9\u9635\u4E0E\u5C4F\u5E55\u9605\u8BFB\u5668\u4EBA\u5DE5\u9A8C\u8BC1\u4ECD\u662F\u53D1\u5E03\u524D\u95E8\u69DB\uFF0C\u6CA1\u6709\u56E0\u4E3A\u7EC4\u4EF6\u53D8\u591A\u800C\u964D\u4F4E\u3002" }) })] }) }) })] });
}
