import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Text } from '@liquid-glass-ui/react';
import { useRoute, sectionOf } from './router.js';
import { Shell } from './site/shell.js';
import { Page } from './site/page.js';
import { componentDocs, findDoc, groupedDocs } from './catalog/index.js';
import { ComponentPage } from './pages/component-page.js';
import { ComponentsIndex } from './pages/components-index.js';
import { OverviewPage } from './pages/overview.js';
import { AccessibilityFoundation, ColorFoundation, LayoutFoundation, MaterialsFoundation, MotionFoundation, TypographyFoundation, } from './pages/foundations.js';
import { InstallGuide, MigrationGuide, RendererGuide, SsrGuide, ThemingGuide } from './pages/guides.js';
import { MaterialLab } from './pages/lab.js';
import { StressPage } from './pages/stress.js';
import { PerformancePage } from './pages/performance.js';
const FOUNDATIONS = [
    ['materials', '材质'], ['color', '色彩'], ['typography', '排版'],
    ['layout', '布局与形状'], ['motion', '动效与交互'], ['accessibility', '无障碍'],
];
const LABS = [['materials', '材质实验台'], ['layout', '布局夹具'], ['performance', '性能观测']];
const GUIDES = [
    ['install', '接入组件'], ['renderer', '渲染策略'], ['theming', '主题与 token'],
    ['ssr', 'SSR 与 CSP'], ['migration', '从 0.1 迁移'],
];
/** Secondary navigation for the current section, shown inside the sidebar at regular width. */
function SecondaryNav({ path, go }) {
    const section = sectionOf(path);
    const click = (target) => (event) => { event.preventDefault(); go(target); };
    const link = (target, label) => _jsx("a", { href: `#/${target}`, onClick: click(target), className: "subnav-link", "aria-current": path === target ? 'page' : undefined, children: label }, target);
    if (section === 'components')
        return _jsx("nav", { className: "subnav", "aria-label": "\u7EC4\u4EF6\u5217\u8868", children: groupedDocs.map(({ group, docs }) => _jsxs("div", { className: "subnav-group", children: [_jsx(Text, { variant: "caption1", emphasized: true, tone: "tertiary", className: "subnav-title", children: group }), docs.map(doc => link(`components/${doc.slug}`, doc.name))] }, group)) });
    if (section === 'foundations')
        return _jsx("nav", { className: "subnav", "aria-label": "\u57FA\u7840\u7AE0\u8282", children: FOUNDATIONS.map(([slug, label]) => link(`foundations/${slug}`, label)) });
    if (section === 'labs')
        return _jsx("nav", { className: "subnav", "aria-label": "\u5B9E\u9A8C\u5BA4", children: LABS.map(([slug, label]) => link(`labs/${slug}`, label)) });
    if (section === 'guides')
        return _jsx("nav", { className: "subnav", "aria-label": "\u6307\u5357", children: GUIDES.map(([slug, label]) => link(`guides/${slug}`, label)) });
    return null;
}
function NotFound({ go }) {
    return _jsx(Page, { title: "\u6CA1\u6709\u8FD9\u4E00\u9875", lede: "\u94FE\u63A5\u53EF\u80FD\u8FC7\u65F6\u4E86\uFF0C\u6216\u8005\u8FD9\u4E2A\u7EC4\u4EF6\u8FD8\u6CA1\u6709\u6587\u6863\u3002", children: _jsx("a", { href: "#/components", onClick: event => { event.preventDefault(); go('components'); }, children: _jsx(Text, { as: "span", variant: "body", tone: "accent", children: "\u56DE\u5230\u7EC4\u4EF6\u76EE\u5F55" }) }) });
}
function resolve(path, go) {
    if (path === 'overview')
        return _jsx(OverviewPage, { go: go });
    if (path === 'components')
        return _jsx(ComponentsIndex, { go: go });
    if (path.startsWith('components/')) {
        const doc = findDoc(path.slice('components/'.length));
        return doc ? _jsx(ComponentPage, { doc: doc }) : _jsx(NotFound, { go: go });
    }
    switch (path) {
        case 'foundations/materials': return _jsx(MaterialsFoundation, {});
        case 'foundations/color': return _jsx(ColorFoundation, {});
        case 'foundations/typography': return _jsx(TypographyFoundation, {});
        case 'foundations/layout': return _jsx(LayoutFoundation, {});
        case 'foundations/motion': return _jsx(MotionFoundation, {});
        case 'foundations/accessibility': return _jsx(AccessibilityFoundation, {});
        case 'labs/materials': return _jsx(MaterialLab, {});
        case 'labs/layout': return _jsx(StressPage, {});
        case 'labs/performance': return _jsx(PerformancePage, {});
        case 'guides/install': return _jsx(InstallGuide, {});
        case 'guides/renderer': return _jsx(RendererGuide, {});
        case 'guides/theming': return _jsx(ThemingGuide, {});
        case 'guides/ssr': return _jsx(SsrGuide, {});
        case 'guides/migration': return _jsx(MigrationGuide, {});
        default: return _jsx(NotFound, { go: go });
    }
}
export function App() {
    const [path, go] = useRoute();
    return _jsx(Shell, { path: path, go: go, secondaryNav: _jsx(SecondaryNav, { path: path, go: go }), children: resolve(path, go) });
}
export { componentDocs };
