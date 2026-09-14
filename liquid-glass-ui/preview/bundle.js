/* Offline preview. React / ReactDOM 19.1.1: MIT, see vendor/LICENSE-React.txt. */
(()=>{'use strict';const modules={
"app/app.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentDocs = void 0;
exports.App = App;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@liquid-glass-ui/react");
const router_js_1 = require("./router.js");
const shell_js_1 = require("./site/shell.js");
const page_js_1 = require("./site/page.js");
const index_js_1 = require("./catalog/index.js");
Object.defineProperty(exports, "componentDocs", { enumerable: true, get: function () { return index_js_1.componentDocs; } });
const component_page_js_1 = require("./pages/component-page.js");
const components_index_js_1 = require("./pages/components-index.js");
const overview_js_1 = require("./pages/overview.js");
const foundations_js_1 = require("./pages/foundations.js");
const guides_js_1 = require("./pages/guides.js");
const lab_js_1 = require("./pages/lab.js");
const stress_js_1 = require("./pages/stress.js");
const performance_js_1 = require("./pages/performance.js");
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
    const section = (0, router_js_1.sectionOf)(path);
    const click = (target) => (event) => { event.preventDefault(); go(target); };
    const link = (target, label) => (0, jsx_runtime_1.jsx)("a", { href: `#/${target}`, onClick: click(target), className: "subnav-link", "aria-current": path === target ? 'page' : undefined, children: label }, target);
    if (section === 'components')
        return (0, jsx_runtime_1.jsx)("nav", { className: "subnav", "aria-label": "\u7EC4\u4EF6\u5217\u8868", children: index_js_1.groupedDocs.map(({ group, docs }) => (0, jsx_runtime_1.jsxs)("div", { className: "subnav-group", children: [(0, jsx_runtime_1.jsx)(react_1.Text, { variant: "caption1", emphasized: true, tone: "tertiary", className: "subnav-title", children: group }), docs.map(doc => link(`components/${doc.slug}`, doc.name))] }, group)) });
    if (section === 'foundations')
        return (0, jsx_runtime_1.jsx)("nav", { className: "subnav", "aria-label": "\u57FA\u7840\u7AE0\u8282", children: FOUNDATIONS.map(([slug, label]) => link(`foundations/${slug}`, label)) });
    if (section === 'labs')
        return (0, jsx_runtime_1.jsx)("nav", { className: "subnav", "aria-label": "\u5B9E\u9A8C\u5BA4", children: LABS.map(([slug, label]) => link(`labs/${slug}`, label)) });
    if (section === 'guides')
        return (0, jsx_runtime_1.jsx)("nav", { className: "subnav", "aria-label": "\u6307\u5357", children: GUIDES.map(([slug, label]) => link(`guides/${slug}`, label)) });
    return null;
}
function NotFound({ go }) {
    return (0, jsx_runtime_1.jsx)(page_js_1.Page, { title: "\u6CA1\u6709\u8FD9\u4E00\u9875", lede: "\u94FE\u63A5\u53EF\u80FD\u8FC7\u65F6\u4E86\uFF0C\u6216\u8005\u8FD9\u4E2A\u7EC4\u4EF6\u8FD8\u6CA1\u6709\u6587\u6863\u3002", children: (0, jsx_runtime_1.jsx)("a", { href: "#/components", onClick: event => { event.preventDefault(); go('components'); }, children: (0, jsx_runtime_1.jsx)(react_1.Text, { as: "span", variant: "body", tone: "accent", children: "\u56DE\u5230\u7EC4\u4EF6\u76EE\u5F55" }) }) });
}
function resolve(path, go) {
    if (path === 'overview')
        return (0, jsx_runtime_1.jsx)(overview_js_1.OverviewPage, { go: go });
    if (path === 'components')
        return (0, jsx_runtime_1.jsx)(components_index_js_1.ComponentsIndex, { go: go });
    if (path.startsWith('components/')) {
        const doc = (0, index_js_1.findDoc)(path.slice('components/'.length));
        return doc ? (0, jsx_runtime_1.jsx)(component_page_js_1.ComponentPage, { doc: doc }) : (0, jsx_runtime_1.jsx)(NotFound, { go: go });
    }
    switch (path) {
        case 'foundations/materials': return (0, jsx_runtime_1.jsx)(foundations_js_1.MaterialsFoundation, {});
        case 'foundations/color': return (0, jsx_runtime_1.jsx)(foundations_js_1.ColorFoundation, {});
        case 'foundations/typography': return (0, jsx_runtime_1.jsx)(foundations_js_1.TypographyFoundation, {});
        case 'foundations/layout': return (0, jsx_runtime_1.jsx)(foundations_js_1.LayoutFoundation, {});
        case 'foundations/motion': return (0, jsx_runtime_1.jsx)(foundations_js_1.MotionFoundation, {});
        case 'foundations/accessibility': return (0, jsx_runtime_1.jsx)(foundations_js_1.AccessibilityFoundation, {});
        case 'labs/materials': return (0, jsx_runtime_1.jsx)(lab_js_1.MaterialLab, {});
        case 'labs/layout': return (0, jsx_runtime_1.jsx)(stress_js_1.StressPage, {});
        case 'labs/performance': return (0, jsx_runtime_1.jsx)(performance_js_1.PerformancePage, {});
        case 'guides/install': return (0, jsx_runtime_1.jsx)(guides_js_1.InstallGuide, {});
        case 'guides/renderer': return (0, jsx_runtime_1.jsx)(guides_js_1.RendererGuide, {});
        case 'guides/theming': return (0, jsx_runtime_1.jsx)(guides_js_1.ThemingGuide, {});
        case 'guides/ssr': return (0, jsx_runtime_1.jsx)(guides_js_1.SsrGuide, {});
        case 'guides/migration': return (0, jsx_runtime_1.jsx)(guides_js_1.MigrationGuide, {});
        default: return (0, jsx_runtime_1.jsx)(NotFound, { go: go });
    }
}
function App() {
    const [path, go] = (0, router_js_1.useRoute)();
    return (0, jsx_runtime_1.jsx)(shell_js_1.Shell, { path: path, go: go, secondaryNav: (0, jsx_runtime_1.jsx)(SecondaryNav, { path: path, go: go }), children: resolve(path, go) });
}

},
"app/catalog/content.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentDocs = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@liquid-glass-ui/react");
exports.contentDocs = [
    {
        slug: 'text', name: 'Text', group: '内容层',
        summary: '按 iOS 文本样式排版，并随 Dynamic Type 缩放。',
        rule: '用内建文本样式，不要只靠字号堆层级。11pt（caption2）是可读文本的下限，任何界面文字都不应低于它。',
        demoHeight: 300,
        example: () => (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: 10, textAlign: 'start' }, children: [(0, jsx_runtime_1.jsx)(react_2.Text, { as: "h3", variant: "largeTitle", emphasized: true, children: "Large Title" }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "title2", emphasized: true, children: "Title 2" }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "headline", children: "Headline \u4F1A\u7528 semibold" }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "body", children: "Body 17/22\uFF0C\u662F\u6B63\u6587\u7684\u57FA\u51C6\u6837\u5F0F\u3002" }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "subhead", tone: "secondary", children: "Subhead \u5E38\u7528\u4E8E\u6B21\u7EA7\u8BF4\u660E" }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "footnote", tone: "secondary", children: "Footnote 13/18" }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "caption2", tone: "tertiary", children: "Caption 2 \u2014 11pt\uFF0C\u53EF\u8BFB\u4E0B\u9650" }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "body", tabular: true, children: "1,204 \u00B7 09:41 \u00B7 62%" })] }),
        code: `<Text as="h1" variant="largeTitle" emphasized>标题</Text>
<Text variant="body">正文</Text>
<Text variant="footnote" tone="secondary">次要说明</Text>
<Text variant="body" tabular>09:41</Text>`,
        props: [
            { name: 'variant', type: 'TextStyle', default: "'body'", description: '文本样式，同时决定字号、行高与字距。' },
            { name: 'emphasized', type: 'boolean', default: 'false', description: '对应 HIG 的 Emphasized 列（semibold / bold）。' },
            { name: 'tone', type: "'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'accent' | 'destructive'", default: "'primary'", description: '语义标签色，不是自定义色值。' },
            { name: 'as', type: 'ElementType', default: "'p'", description: '渲染的元素。标题层级不会被推断，需要显式传 as="h2"。' },
            { name: 'tabular', type: 'boolean', default: 'false', description: '等宽数字，用于表格与计时。' },
        ],
        a11y: [
            '标题层级必须显式指定：组件不会替你猜 h1/h2，避免一页出现多个 h1。',
            '所有字号来自 --lg-text-* token，根节点 data-lg-text-size="ax5" 时整体放大到 AX5 仍需不截断。',
            'CJK 语境下自动关闭为拉丁文设计的负字距。',
        ],
    },
    {
        slug: 'card', name: 'Card · Concentric', group: '内容层',
        summary: '内容层容器，以及与它同心的嵌套圆角。',
        rule: '玻璃只属于浮动的操作与导航层。卡片、列表、页面背景使用实色分组背景——满屏半透明卡片是最常见的“不像 Apple”的写法。',
        demoHeight: 240,
        example: () => (0, jsx_runtime_1.jsxs)(react_2.Card, { radius: 26, padding: 16, raised: true, style: { width: 280 }, children: [(0, jsx_runtime_1.jsx)(react_2.Concentric, { minimum: 12, style: { height: 96, background: 'var(--lg-fill-tertiary)', display: 'grid', placeItems: 'center' }, children: (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "caption1", tone: "secondary", children: "\u534A\u5F84 26 \u2212 \u5185\u8FB9\u8DDD 16 = 14" }) }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "headline", style: { marginBlockStart: 12 }, children: "\u540C\u5FC3\u5706\u89D2" }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "footnote", tone: "secondary", children: "\u5185\u5706\u89D2\u8FC7\u5927\u4F1A\u201C\u6390\u89D2\u201D\uFF0C\u8FC7\u5C0F\u4F1A\u201C\u5587\u53ED\u53E3\u201D\u3002" })] }),
        code: `<Card radius={26} padding={16}>
  <Concentric minimum={12}>
    <img src="…" alt="" />
  </Concentric>
</Card>`,
        props: [
            { name: 'radius', type: 'number', default: '26', description: '容器圆角，同时作为同心子元素的计算基准。' },
            { name: 'padding', type: 'number', default: '16', description: '内边距，同时是同心子元素要减去的 inset。' },
            { name: 'fill', type: "'grouped' | 'plain' | 'secondary'", default: "'grouped'", description: '底色层级。' },
            { name: 'raised', type: 'boolean', default: 'false', description: '轻微投影。内容层的投影要克制，它不是玻璃的抬升。' },
            { name: 'minimum', type: 'number', default: '0', description: 'Concentric：独立出现时的兜底圆角。' },
        ],
        a11y: ['Card 是纯容器，不带 role；语义由内部元素承担。'],
    },
    {
        slug: 'list', name: 'List', group: '内容层',
        summary: 'Inset grouped 列表：更高的行、更大的分组圆角、标题式分区头。',
        rule: '分区标题用标题式大小写，不再用全大写。行高不低于 44pt，导航行必须是真实的链接或按钮。',
        demoHeight: 340,
        example: function ListExample() {
            const [wifi, setWifi] = (0, react_1.useState)(true);
            return (0, jsx_runtime_1.jsxs)(react_2.List, { style: { width: 320 }, children: [(0, jsx_runtime_1.jsxs)(react_2.ListSection, { header: "\u663E\u793A\u4E0E\u4EAE\u5EA6", footer: "\u8FD9\u4E9B\u8BBE\u7F6E\u53EA\u5F71\u54CD\u672C\u6B21\u6F14\u793A\u3002", children: [(0, jsx_runtime_1.jsx)(react_2.ListRow, { label: "\u5916\u89C2", value: "\u6D45\u8272", href: "#/components/list" }), (0, jsx_runtime_1.jsx)(react_2.ListRow, { label: "\u6587\u5B57\u5927\u5C0F", secondaryLabel: "\u5F71\u54CD\u5168\u7AD9\u6392\u7248", value: "\u6807\u51C6", href: "#/components/list" })] }), (0, jsx_runtime_1.jsxs)(react_2.ListSection, { header: "\u7F51\u7EDC", children: [(0, jsx_runtime_1.jsx)(react_2.ListRow, { label: "Wi\u2011Fi", leading: (0, jsx_runtime_1.jsx)(react_2.LibraryIcon, { name: "search", size: 20 }), accessory: (0, jsx_runtime_1.jsx)(react_2.GlassSwitch, { "aria-label": "Wi\u2011Fi", checked: wifi, onCheckedChange: setWifi }) }), (0, jsx_runtime_1.jsx)(react_2.ListRow, { label: "\u79FB\u9664\u6B64\u7F51\u7EDC", destructive: true, onSelect: () => { }, disclosure: false })] })] });
        },
        code: `<List>
  <ListSection header="显示与亮度" footer="说明文字">
    <ListRow label="外观" value="浅色" href="/appearance" />
    <ListRow label="Wi‑Fi" accessory={<GlassSwitch aria-label="Wi‑Fi" />} />
    <ListRow label="移除此网络" destructive onSelect={remove} />
  </ListSection>
</List>`,
        props: [
            { name: 'variant', type: "'insetGrouped' | 'plain'", default: "'insetGrouped'", description: 'List：分组内嵌或通栏。' },
            { name: 'header / footer', type: 'ReactNode', description: 'ListSection：标题式大小写的分区头与脚注。' },
            { name: 'label', type: 'ReactNode', required: true, description: 'ListRow：主标签。' },
            { name: 'secondaryLabel', type: 'ReactNode', description: '第二行补充信息。' },
            { name: 'value', type: 'ReactNode', description: '行尾只读值。' },
            { name: 'accessory', type: 'ReactNode', description: '行尾交互元素；出现时自动隐藏 chevron。' },
            { name: 'href / onSelect', type: 'string | (event) => void', description: '任一存在即渲染为真实链接或按钮。' },
            { name: 'destructive', type: 'boolean', default: 'false', description: '红色标签，需搭配确认或撤销。' },
        ],
        a11y: [
            '分组是 ul[role=list]，每行是 li；可导航行渲染成 <a> 或 <button>，不是挂了 onClick 的 div。',
            '分隔线从标签起始处内缩，不穿过前导图标。',
            'chevron 在 RTL 下镜像；媒体控件与时钟类图标不镜像。',
        ],
    },
    {
        slug: 'material-view', name: 'MaterialView', group: '内容层',
        summary: '标准材质（ultraThin / thin / regular / thick），内容层需要半透明时用它，而不是玻璃。',
        rule: '标准材质会模糊和着色，但不折射、不带高光边、不随背景翻转——因为它是内容的一部分，而不是浮在内容之上。',
        backdrop: 'media', demoHeight: 260,
        example: () => (0, jsx_runtime_1.jsx)("div", { style: { display: 'grid', gap: 10, width: 260 }, children: ['ultraThin', 'thin', 'regular', 'thick'].map(thickness => (0, jsx_runtime_1.jsxs)(react_2.MaterialView, { thickness: thickness, radius: 14, style: { padding: 12 }, children: [(0, jsx_runtime_1.jsx)(react_2.Text, { variant: "subhead", emphasized: true, children: thickness }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "caption1", tone: "secondary", children: "\u8D8A\u539A\u5BF9\u6BD4\u8D8A\u9AD8\uFF0C\u8D8A\u8584\u4FDD\u7559\u8D8A\u591A\u4E0A\u4E0B\u6587" })] }, thickness)) }),
        code: `<MaterialView thickness="regular" radius={14}>
  <Text variant="body">在照片上仍然可读的说明文字</Text>
</MaterialView>`,
        props: [
            { name: 'thickness', type: "'ultraThin' | 'thin' | 'regular' | 'thick'", default: "'regular'", description: '按用途选择，而不是按它在当前背景上呈现的颜色。' },
            { name: 'radius', type: 'number', default: '20', description: '圆角。' },
        ],
        a11y: ['thin / ultraThin 上不要用 quaternary 标签色，对比度不足。', '减少透明度时自动退化为实色底。'],
    },
    {
        slug: 'divider', name: 'Divider', group: '内容层',
        summary: '内容层分隔线。',
        rule: '工具栏和导航栏不需要它：分隔来自玻璃与滚动边缘效果，而不是画一条线。',
        demoHeight: 150,
        example: () => (0, jsx_runtime_1.jsxs)("div", { style: { width: 260 }, children: [(0, jsx_runtime_1.jsx)(react_2.Text, { variant: "body", children: "\u4E0A\u4E00\u6BB5" }), (0, jsx_runtime_1.jsx)(react_2.Divider, { style: { marginBlock: 12 } }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "body", children: "\u4E0B\u4E00\u6BB5" }), (0, jsx_runtime_1.jsx)(react_2.Divider, { inset: 32, style: { marginBlock: 12 } }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "footnote", tone: "secondary", children: "\u5E26 inset\uFF0C\u4E0E\u6587\u5B57\u8D77\u59CB\u4F4D\u7F6E\u5BF9\u9F50" })] }),
        code: `<Divider />
<Divider inset={32} />
<Divider orientation="vertical" />`,
        props: [
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: '方向。' },
            { name: 'inset', type: 'number', default: '0', description: '起始侧内缩，用逻辑属性，RTL 下自动翻转。' },
        ],
        a11y: ['渲染为 role="separator" 并带 aria-orientation。'],
    },
];

},
"app/catalog/controls.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controlDocs = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@liquid-glass-ui/react");
const icons_js_1 = require("../icons.js");
exports.controlDocs = [
    {
        slug: 'button', name: 'GlassButton', group: '控件',
        summary: '七种样式，从浮动玻璃到内容层的扁平按钮。',
        rule: '区分首选项的是样式而不是尺寸，一个视图里最多一个 prominent。tint 只加在这一个主操作的背景上，标签保持白色——如果什么都被着色，就什么都不突出。',
        backdrop: 'both', demoHeight: 260,
        example: function ButtonExample() {
            const [count, setCount] = (0, react_1.useState)(0);
            return (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: 12, justifyItems: 'center' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }, children: [(0, jsx_runtime_1.jsx)(react_2.GlassButton, { onClick: () => setCount(n => n + 1), children: "Glass" }), (0, jsx_runtime_1.jsx)(react_2.GlassButton, { variant: "glassProminent", onClick: () => setCount(n => n + 1), children: "\u4E3B\u64CD\u4F5C" }), (0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { "aria-label": "\u6536\u85CF", onClick: () => setCount(n => n + 1), children: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "heart" }) })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }, children: [(0, jsx_runtime_1.jsx)(react_2.GlassButton, { variant: "plain", children: "Plain" }), (0, jsx_runtime_1.jsx)(react_2.GlassButton, { variant: "gray", children: "Gray" }), (0, jsx_runtime_1.jsx)(react_2.GlassButton, { variant: "tinted", children: "Tinted" }), (0, jsx_runtime_1.jsx)(react_2.GlassButton, { variant: "destructive", children: "\u5220\u9664" })] }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }, children: [(0, jsx_runtime_1.jsx)(react_2.GlassButton, { controlSize: "small", children: "Small" }), (0, jsx_runtime_1.jsx)(react_2.GlassButton, { controlSize: "large", children: "Large" }), (0, jsx_runtime_1.jsx)(react_2.GlassButton, { disabled: true, children: "\u4E0D\u53EF\u7528" }), (0, jsx_runtime_1.jsx)(react_2.GlassButton, { loading: true, children: "\u5904\u7406\u4E2D" })] }), (0, jsx_runtime_1.jsxs)(react_2.Text, { variant: "caption1", tone: "secondary", role: "status", children: ["\u6309\u4E0B\u8BA1\u6570\uFF1A", count] })] });
        },
        code: `<GlassButton>Glass</GlassButton>
<GlassButton variant="glassProminent">Done</GlassButton>
<GlassButton variant="destructive">删除</GlassButton>
<GlassIconButton aria-label="收藏"><HeartIcon /></GlassIconButton>`,
        props: [
            { name: 'variant', type: "'glass' | 'glassProminent' | 'plain' | 'gray' | 'tinted' | 'destructive' | 'destructiveProminent'", default: "'glass'", description: '样式。glass 系列属于浮动操作层，其余属于内容层。' },
            { name: 'controlSize', type: "'small' | 'regular' | 'large' | 'extraLarge'", default: "'regular'", description: '视觉高度；与选择玻璃厚度的 size 不是一回事。' },
            { name: 'size', type: "'small' | 'large'", default: "'small'", description: '玻璃厚度。大玻璃更厚且不随背景翻转。' },
            { name: 'loading', type: 'boolean', default: 'false', description: '同时禁用并置 aria-busy。' },
            { name: 'chroma', type: 'boolean', default: 'false', description: '色散折射。成本约为三倍，只用于少数非固定元素。' },
            { name: 'independent', type: 'boolean', default: 'false', description: '在共享表面内仍保留自己的玻璃——这是“玻璃叠玻璃”，慎用。' },
        ],
        a11y: [
            '默认 type="button"，不会意外提交表单。',
            'Enter / Space 触发与指针相同的按压编排（Chrome 下 Enter 不会置 :active）。',
            '粗指针设备上即使视觉更小，命中区也补足到 44×44。',
            '图标按钮的 aria-label 是必填类型。',
        ],
    },
    {
        slug: 'segmented-control', name: 'GlassSegmentedControl', group: '控件',
        summary: '2–5 个等宽分段，可以按住选中项拖动切换。',
        rule: '它是一个可拖动的控件而不是一排按钮：按住选中分段滑动，透镜 1:1 跟随指针、随拖动拉伸、跨过分段时即时切换，松手后弹簧归位。只能点击的实现是“不像 Apple”的最明显特征。',
        demoHeight: 200,
        example: function SegmentedExample() {
            const [value, setValue] = (0, react_1.useState)('week');
            return (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: 12, justifyItems: 'center' }, children: [(0, jsx_runtime_1.jsx)(react_2.GlassSegmentedControl, { "aria-label": "\u65F6\u95F4\u8303\u56F4", value: value, onValueChange: setValue, items: [{ value: 'day', label: '日' }, { value: 'week', label: '周' }, { value: 'month', label: '月' }, { value: 'year', label: '年', disabled: true }] }), (0, jsx_runtime_1.jsxs)(react_2.Text, { variant: "caption1", tone: "secondary", children: ["\u6309\u4F4F\u9009\u4E2D\u9879\u5DE6\u53F3\u62D6\u52A8\u8BD5\u8BD5 \u00B7 \u5F53\u524D\uFF1A", value] })] });
        },
        code: `<GlassSegmentedControl
  aria-label="时间范围"
  value={range}
  onValueChange={setRange}
  items={[
    { value: 'day', label: '日' },
    { value: 'week', label: '周' },
    { value: 'month', label: '月' },
  ]}
/>`,
        props: [
            { name: 'items', type: 'GlassChoice[]', required: true, description: '2–5 项。文字或图标，不要混用。' },
            { name: 'value / defaultValue', type: 'string', description: '受控或非受控选中值。' },
            { name: 'onValueChange', type: '(value: string) => void', description: '拖动过程中即时触发，不等到松手。' },
            { name: 'name', type: 'string', description: '原生 radio 的 name，用于表单提交。' },
            { name: 'aria-label', type: 'string', required: true, description: 'radiogroup 的可访问名称。' },
        ],
        a11y: [
            '底层是原生 radio：参与表单提交，方向键切换由浏览器提供。',
            'touch-action: pan-y —— 横向拖动归控件，纵向滚动仍归页面。',
            '减少动效时关闭拖拽与弹簧，仅保留点击选择。',
        ],
    },
    {
        slug: 'switch', name: 'GlassSwitch', group: '控件',
        summary: '胶囊开关，打开态为系统绿，可以把旋钮“甩”过去。',
        rule: '标签描述的是打开后的状态（“Wi‑Fi”，不是“启用 Wi‑Fi”）。旋钮在静止时是安静的，只有被操作时才发生变化。',
        demoHeight: 180,
        example: function SwitchExample() {
            const [on, setOn] = (0, react_1.useState)(true);
            const [off, setOff] = (0, react_1.useState)(false);
            return (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: 14, justifyItems: 'start' }, children: [(0, jsx_runtime_1.jsx)(react_2.GlassSwitch, { "aria-label": "Wi\u2011Fi", label: "Wi\u2011Fi", checked: on, onCheckedChange: setOn }), (0, jsx_runtime_1.jsx)(react_2.GlassSwitch, { "aria-label": "\u4F4E\u6570\u636E\u6A21\u5F0F", label: "\u4F4E\u6570\u636E\u6A21\u5F0F", checked: off, onCheckedChange: setOff }), (0, jsx_runtime_1.jsx)(react_2.GlassSwitch, { "aria-label": "\u4E0D\u53EF\u7528\u5F00\u5173", label: "\u4E0D\u53EF\u7528", disabled: true }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "caption1", tone: "secondary", children: "\u6309\u4F4F\u65CB\u94AE\u5411\u4EFB\u4E00\u4FA7\u7529\u52A8\u8BD5\u8BD5" })] });
        },
        code: `<GlassSwitch aria-label="Wi‑Fi" label="Wi‑Fi"
  checked={enabled} onCheckedChange={setEnabled} />`,
        props: [
            { name: 'checked / defaultChecked', type: 'boolean', description: '受控或非受控状态。' },
            { name: 'onCheckedChange', type: '(checked: boolean) => void', description: '点击或拖动释放时触发。' },
            { name: 'label', type: 'string', description: '可见文字标签。' },
            { name: 'aria-label', type: 'string', required: true, description: '描述打开后的状态。' },
        ],
        a11y: [
            '底层是 input[type=checkbox][role=switch]，Space 切换。',
            '明确的拖动会抑制 label 产生的合成 click，避免切换两次。',
        ],
    },
    {
        slug: 'slider', name: 'GlassSlider', group: '控件',
        summary: '原生 range 之上的轨道与旋钮；旋钮只在被拖动时抬升为玻璃。',
        rule: '内容层里的旋钮属于“瞬时控件”：被操作时才变成玻璃，静止时保持安静。永远是玻璃的旋钮，就是内容层里的玻璃。',
        demoHeight: 200,
        example: function SliderExample() {
            const [volume, setVolume] = (0, react_1.useState)(62);
            return (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: 14, width: 300 }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [(0, jsx_runtime_1.jsx)(react_2.Text, { variant: "subhead", children: "\u97F3\u91CF" }), (0, jsx_runtime_1.jsxs)(react_2.Text, { variant: "subhead", tone: "secondary", tabular: true, children: [volume, "%"] })] }), (0, jsx_runtime_1.jsx)(react_2.GlassSlider, { "aria-label": "\u97F3\u91CF", value: volume, onValueChange: setVolume, formatValue: v => `${v} 百分比`, minLabel: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "volume", size: 16 }), maxLabel: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "volume", size: 20 }) }), (0, jsx_runtime_1.jsx)(react_2.GlassSlider, { "aria-label": "\u4E0D\u53EF\u7528\u6ED1\u5757", defaultValue: 30, disabled: true })] });
        },
        code: `<GlassSlider
  aria-label="音量"
  value={volume}
  onValueChange={setVolume}
  formatValue={v => \`\${v} 百分比\`}
/>`,
        props: [
            { name: 'value / defaultValue', type: 'number', default: '50', description: '受控或非受控值。' },
            { name: 'min / max / step', type: 'number', default: '0 / 100 / 1', description: '取值范围，min 必须小于 max。' },
            { name: 'formatValue', type: '(value: number) => string', description: '朗读用的 aria-valuetext；数字本身往往不够。' },
            { name: 'minLabel / maxLabel', type: 'ReactNode', description: '轨道两端的提示图形。' },
            { name: 'aria-label', type: 'string', required: true, description: '可访问名称。' },
        ],
        a11y: [
            '底层是原生 input[type=range]：键盘、表单、aria-valuetext 全部免费获得。',
            '旋钮尺寸变化时不会重建几何贴图。',
        ],
    },
    {
        slug: 'stepper', name: 'GlassStepper', group: '控件',
        summary: '共享一个表面的加减两段，用于很小的整数范围。',
        rule: '只适合几下点击能到位的范围；再大就应该用滑块或输入框。值必须始终可见。',
        demoHeight: 170,
        example: function StepperExample() {
            const [count, setCount] = (0, react_1.useState)(2);
            return (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: 12, justifyItems: 'center' }, children: [(0, jsx_runtime_1.jsx)(react_2.GlassStepper, { "aria-label": "\u4EFD\u6570", value: count, onValueChange: setCount, min: 1, max: 9, decrementLabel: "\u51CF\u5C11\u4EFD\u6570", incrementLabel: "\u589E\u52A0\u4EFD\u6570" }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "caption1", tone: "secondary", children: "\u5230\u8FBE\u8FB9\u754C\u65F6\u5BF9\u5E94\u6309\u94AE\u81EA\u52A8\u7981\u7528" })] });
        },
        code: `<GlassStepper aria-label="份数"
  value={count} onValueChange={setCount} min={1} max={9}
  decrementLabel="减少份数" incrementLabel="增加份数" />`,
        props: [
            { name: 'value / defaultValue', type: 'number', default: '0', description: '当前值。' },
            { name: 'min / max / step', type: 'number', default: '-∞ / ∞ / 1', description: '范围与步长。' },
            { name: 'showValue', type: 'boolean', default: 'true', description: '值已在旁边显示时可以关掉。' },
            { name: 'decrementLabel / incrementLabel', type: 'string', description: '两个按钮各自的可访问名称。' },
        ],
        a11y: ['渲染为 role="group" 加两个具名按钮，而不是一个 spinbutton。', '两个按钮各自满足 44×44。'],
    },
    {
        slug: 'progress', name: 'GlassProgress', group: '控件',
        summary: '确定进度条与不确定指示器。',
        rule: '知道时长就用确定进度——不确定的转圈除了“还活着”之外什么都没告诉用户。永远不要阻塞界面。',
        demoHeight: 190,
        example: function ProgressExample() {
            const [value, setValue] = (0, react_1.useState)(38);
            return (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: 16, width: 280 }, children: [(0, jsx_runtime_1.jsx)(react_2.GlassProgress, { "aria-label": "\u5BFC\u51FA\u8FDB\u5EA6", value: value }), (0, jsx_runtime_1.jsx)(react_2.GlassSlider, { "aria-label": "\u8C03\u6574\u6F14\u793A\u8FDB\u5EA6", value: value, onValueChange: setValue }), (0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', gap: 12, alignItems: 'center' }, children: (0, jsx_runtime_1.jsx)(react_2.GlassProgress, { "aria-label": "\u4E0D\u786E\u5B9A\u8FDB\u5EA6" }) }), (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: 12, alignItems: 'center' }, children: [(0, jsx_runtime_1.jsx)(react_2.GlassProgress, { "aria-label": "\u8F7D\u5165\u4E2D", variant: "circular" }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "footnote", tone: "secondary", children: "\u4E0D\u786E\u5B9A\u7684\u5706\u73AF" })] })] });
        },
        code: `<GlassProgress aria-label="导出进度" value={done} total={total} />
<GlassProgress aria-label="载入中" variant="circular" />`,
        props: [
            { name: 'value', type: 'number', description: '省略即为不确定状态；一旦知道时长就应传入。' },
            { name: 'total', type: 'number', default: '100', description: '分母。' },
            { name: 'variant', type: "'bar' | 'circular'", default: "'bar'", description: '已知任务用条，短暂等待用圆环。' },
        ],
        a11y: ['role="progressbar"，确定状态下带 aria-valuenow / min / max。', '减少动效时不确定指示器停止运动，改为静态轨道。'],
    },
    {
        slug: 'badge', name: 'GlassBadge', group: '控件',
        summary: '计数或状态标记。',
        rule: '颜色不能单独承载含义：徽标里始终有数字或文字，可访问名称说明它在计数什么。',
        demoHeight: 150,
        example: () => (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: 16, alignItems: 'center' }, children: [(0, jsx_runtime_1.jsx)(react_2.GlassBadge, { count: 3, "aria-label": "3 \u6761\u672A\u8BFB\u6D88\u606F" }), (0, jsx_runtime_1.jsx)(react_2.GlassBadge, { count: 128, max: 99, "aria-label": "128 \u6761\u672A\u8BFB\u6D88\u606F" }), (0, jsx_runtime_1.jsx)(react_2.GlassBadge, { tone: "neutral", children: "Beta" }), (0, jsx_runtime_1.jsx)(react_2.GlassBadge, { tone: "accent", children: "New" }), (0, jsx_runtime_1.jsx)(react_2.GlassBadge, { dot: true, "aria-label": "\u6709\u66F4\u65B0" })] }),
        code: `<GlassBadge count={3} aria-label="3 条未读消息" />
<GlassBadge count={128} max={99} aria-label="128 条未读消息" />
<GlassBadge dot aria-label="有更新" />`,
        props: [
            { name: 'count', type: 'number', description: '计数；超过 max 显示为 “max+”。' },
            { name: 'max', type: 'number', default: '99', description: '折叠阈值。' },
            { name: 'tone', type: "'notification' | 'neutral' | 'accent'", default: "'notification'", description: '色调。' },
            { name: 'dot', type: 'boolean', default: 'false', description: '没有有意义数字时的小圆点。' },
            { name: 'aria-label', type: 'string', description: '说明数字的含义；否则屏幕阅读器只会念一个孤零零的数字。' },
        ],
        a11y: ['没有内容时不渲染，避免出现一个空的装饰圆。'],
    },
];

},
"app/catalog/fields.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldDocs = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@liquid-glass-ui/react");
exports.fieldDocs = [
    {
        slug: 'text-field', name: 'TextField', group: '输入',
        summary: '带真实 label 的圆角输入框，错误信息与字段关联。',
        rule: 'placeholder 是格式提示，不是标签的替代品。错误要说清发生了什么以及怎么修，不能只靠一个红框——只有颜色承载含义就过不了对比度这一关。',
        demoHeight: 300,
        example: function TextFieldExample() {
            const [email, setEmail] = (0, react_1.useState)('');
            const invalid = email.length > 0 && !email.includes('@');
            return (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: 16, width: 300 }, children: [(0, jsx_runtime_1.jsx)(react_2.TextField, { label: "\u5DE5\u4F5C\u533A\u540D\u79F0", defaultValue: "\u6211\u7684\u7075\u611F\u7A7A\u95F4", autoComplete: "off" }), (0, jsx_runtime_1.jsx)(react_2.TextField, { label: "\u7535\u5B50\u90AE\u4EF6", type: "email", inputMode: "email", autoComplete: "email", placeholder: "name@example.com", value: email, onChange: event => setEmail(event.target.value), hint: "\u53EA\u7528\u4E8E\u672C\u6B21\u6F14\u793A\uFF0C\u4E0D\u4F1A\u53D1\u9001\u5230\u4EFB\u4F55\u670D\u52A1\u3002", error: invalid ? '电子邮件需要包含 @。' : undefined }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "caption1", tone: "secondary", children: "\u8F93\u5165\u4E0D\u542B @ \u7684\u5185\u5BB9\u4F1A\u89E6\u53D1\u9519\u8BEF\u72B6\u6001" })] });
        },
        code: `<TextField
  label="电子邮件"
  type="email"
  inputMode="email"
  autoComplete="email"
  hint="我们不会公开你的邮箱。"
  error={invalid ? '电子邮件需要包含 @。' : undefined}
/>`,
        props: [
            { name: 'label', type: 'ReactNode', required: true, description: '可见标签，通过 <label for> 关联。' },
            { name: 'hint', type: 'ReactNode', description: '辅助说明，随输入框一起朗读。' },
            { name: 'error', type: 'ReactNode', description: '存在即标记 aria-invalid 并接上 aria-describedby。' },
            { name: 'labelHidden', type: 'boolean', default: 'false', description: '视觉隐藏但保留给辅助技术与语音控制。' },
            { name: 'leading / trailing', type: 'ReactNode', description: '前后附加元素。' },
        ],
        a11y: [
            '字号不低于 16px，否则 iOS Safari 聚焦时会缩放整页。',
            '焦点环画在容器上（:focus-within 的 outline），而不是 box-shadow —— box-shadow 是玻璃自己的。',
            'autocomplete 与 inputmode 由调用方按字段用途传入，这是表单“像原生”的大部分来源。',
        ],
    },
    {
        slug: 'search-field', name: 'SearchField', group: '输入',
        summary: '独立玻璃表面上的胶囊搜索框，带清除按钮。',
        rule: '搜索在 iPad 与 Mac 上位于工具栏右上；在 iPhone 上是尾部独立的搜索标签，或随键盘升起的输入框。',
        backdrop: 'both', demoHeight: 200,
        example: function SearchExample() {
            const [query, setQuery] = (0, react_1.useState)('');
            const [submitted, setSubmitted] = (0, react_1.useState)('');
            return (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: 12, width: 320 }, children: [(0, jsx_runtime_1.jsx)(react_2.SearchField, { "aria-label": "\u641C\u7D22\u7EC4\u4EF6", placeholder: "\u641C\u7D22\u7EC4\u4EF6\u2026", value: query, onValueChange: setQuery, onSubmitQuery: setSubmitted, clearLabel: "\u6E05\u9664\u641C\u7D22" }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "caption1", tone: "secondary", children: submitted ? `已提交：${submitted}` : '输入后回车提交，右侧出现清除按钮' })] });
        },
        code: `<SearchField
  aria-label="搜索组件"
  placeholder="搜索组件…"
  value={query}
  onValueChange={setQuery}
  onSubmitQuery={runSearch}
/>`,
        props: [
            { name: 'value / defaultValue', type: 'string', description: '受控或非受控查询串。' },
            { name: 'onValueChange', type: '(value: string) => void', description: '每次输入变化。' },
            { name: 'onSubmitQuery', type: '(value: string) => void', description: '回车提交。' },
            { name: 'clearLabel', type: 'string', default: "'Clear search'", description: '清除按钮的可访问名称。' },
            { name: 'aria-label', type: 'string', required: true, description: '输入框的可访问名称。' },
        ],
        a11y: [
            '外层是 role="search" 的 form，输入框为 type="search"，移动端键盘与平台自带清除手势因此正确。',
            '焦点环落在玻璃容器上，输入框自身的 outline 被替代而不是被删掉。',
        ],
    },
];

},
"app/catalog/index.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDoc = exports.groupedDocs = exports.groupOrder = exports.componentDocs = void 0;
exports.searchDocs = searchDocs;
const content_js_1 = require("./content.js");
const controls_js_1 = require("./controls.js");
const fields_js_1 = require("./fields.js");
const navigation_js_1 = require("./navigation.js");
const overlays_js_1 = require("./overlays.js");
/** Ordered by layer: content first, then the floating control and navigation layer. */
exports.componentDocs = [
    ...content_js_1.contentDocs, ...controls_js_1.controlDocs, ...fields_js_1.fieldDocs, ...navigation_js_1.navigationDocs, ...overlays_js_1.overlayDocs,
];
exports.groupOrder = ['内容层', '控件', '输入', '导航', '浮层'];
exports.groupedDocs = exports.groupOrder
    .map(group => ({ group, docs: exports.componentDocs.filter(doc => doc.group === group) }))
    .filter(entry => entry.docs.length > 0);
const findDoc = (slug) => exports.componentDocs.find(doc => doc.slug === slug);
exports.findDoc = findDoc;
/** Substring match over name, slug and summary — enough for a catalogue this size. */
function searchDocs(query) {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle)
        return [];
    return exports.componentDocs.filter(doc => doc.name.toLocaleLowerCase().includes(needle)
        || doc.slug.includes(needle)
        || doc.summary.toLocaleLowerCase().includes(needle)
        || doc.group.includes(needle));
}

},
"app/catalog/navigation.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.navigationDocs = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@liquid-glass-ui/react");
const icons_js_1 = require("../icons.js");
const stop = (event) => event.preventDefault();
exports.navigationDocs = [
    {
        slug: 'toolbar', name: 'GlassToolbar', group: '导航',
        summary: '工具栏本身没有背景；每个 ToolbarGroup 才是玻璃。',
        rule: '相关项共享一个背景，按功能和使用频率分组。不要把图标和文字放进同一个分组——那会读成一个很宽的按钮。主操作单独成组并着色。',
        backdrop: 'both', demoHeight: 200,
        example: function ToolbarExample() {
            const [saved, setSaved] = (0, react_1.useState)(false);
            return (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: 12, justifyItems: 'center' }, children: [(0, jsx_runtime_1.jsxs)(react_2.GlassToolbar, { "aria-label": "\u7F16\u8F91\u5DE5\u5177\u680F", children: [(0, jsx_runtime_1.jsxs)(react_2.ToolbarGroup, { children: [(0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { "aria-label": "\u7F51\u683C", children: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "grid" }) }), (0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { "aria-label": "\u56FE\u5C42", children: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "layer" }) }), (0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { "aria-label": "\u8C03\u6574", children: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "tune" }) })] }), (0, jsx_runtime_1.jsx)(react_2.ToolbarSpacer, {}), (0, jsx_runtime_1.jsx)(react_2.ToolbarGroup, { prominent: true, children: (0, jsx_runtime_1.jsx)(react_2.GlassButton, { variant: "glassProminent", onClick: () => setSaved(true), children: "\u5B8C\u6210" }) })] }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "caption1", tone: "secondary", role: "status", children: saved ? '已保存' : 'Tab 进入，方向键在整条工具栏内移动' })] });
        },
        code: `<GlassToolbar aria-label="编辑工具栏">
  <ToolbarGroup>
    <GlassIconButton aria-label="网格"><GridIcon /></GlassIconButton>
    <GlassIconButton aria-label="图层"><LayerIcon /></GlassIconButton>
  </ToolbarGroup>
  <ToolbarSpacer variant="flexible" />
  <ToolbarGroup prominent>
    <GlassButton variant="glassProminent">完成</GlassButton>
  </ToolbarGroup>
</GlassToolbar>`,
        props: [
            { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: '方向，决定方向键的轴。' },
            { name: 'aria-label', type: 'string', required: true, description: 'toolbar 的可访问名称。' },
            { name: 'prominent', type: 'boolean', default: 'false', description: 'ToolbarGroup：标记唯一的主操作分组。' },
            { name: 'variant', type: "'fixed' | 'flexible'", default: "'fixed'", description: 'ToolbarSpacer：固定间距或把两组推到两端。' },
        ],
        a11y: [
            '整条工具栏是一个 Tab 停靠点，方向键跨分组移动（roving tabindex）。',
            'RTL 下左右方向键自动对调。',
            '开发模式下同组混排图标与文字会给出一次 console 警告。',
        ],
    },
    {
        slug: 'tab-bar', name: 'TabBar', group: '导航',
        summary: '手机上是底部浮动胶囊，宽屏时同一个元素展开为侧边栏。',
        rule: '它是一组 <nav> 里的链接，不是 tablist —— 这些是在 app 的分区之间导航，而不是原地换面板。3–5 个分区；搜索在尾部单独成一块玻璃。标签用于导航，不要往里放操作。',
        backdrop: 'both', demoHeight: 260,
        example: function TabBarExample() {
            const [current, setCurrent] = (0, react_1.useState)('home');
            const items = [
                { key: 'home', href: '#/components/tab-bar', label: '首页', icon: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "grid", size: 18 }) },
                { key: 'library', href: '#/components/tab-bar', label: '资料库', icon: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "layer", size: 18 }), badge: 3, badgeLabel: '3 个新项目' },
                { key: 'settings', href: '#/components/tab-bar', label: '设置', icon: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "tune", size: 18 }) },
            ].map(item => ({ ...item, onSelect: (event) => { event.preventDefault(); setCurrent(item.key); } }));
            return (0, jsx_runtime_1.jsxs)("div", { className: "demo-tabbar-frame", children: [(0, jsx_runtime_1.jsx)(react_2.TabBar, { "aria-label": "\u793A\u4F8B\u5BFC\u822A", items: items, current: current, sidebarBreakpoint: 99999, search: { key: 'search', href: '#/components/tab-bar', label: '搜索', icon: (0, jsx_runtime_1.jsx)(react_2.LibraryIcon, { name: "search", size: 18 }), onSelect: (event) => { event.preventDefault(); setCurrent('search'); } } }), (0, jsx_runtime_1.jsxs)(react_2.Text, { variant: "caption1", tone: "secondary", children: ["\u5F53\u524D\uFF1A", current, " \u00B7 \u6309\u4F4F\u9009\u4E2D\u9879\u62D6\u52A8\u53EF\u4EE5\u5207\u6362"] })] });
        },
        code: `<TabBar
  aria-label="主导航"
  current={section}
  items={[
    { key: 'home', href: '/', label: '首页', icon: <HomeIcon /> },
    { key: 'library', href: '/library', label: '资料库', badge: 3, badgeLabel: '3 个新项目' },
  ]}
  search={{ key: 'search', href: '/search', label: '搜索', icon: <SearchIcon /> }}
  minimizeOnScroll
  sidebarBreakpoint={1024}
/>`,
        props: [
            { name: 'items', type: 'TabBarItem[]', required: true, description: '3–5 个分区。' },
            { name: 'current', type: 'string', description: '当前分区的 key，用于 aria-current。' },
            { name: 'search', type: 'TabBarItem', description: '尾部独立的搜索目的地，单独一块玻璃。' },
            { name: 'minimizeOnScroll', type: 'boolean', default: 'false', description: '向下滚动时收起，向上滚动恢复。' },
            { name: 'sidebarBreakpoint', type: 'number', default: '1024', description: '变形为侧边栏的宽度阈值。' },
            { name: 'accessory', type: 'ReactNode', description: '常驻附件（如正在播放），不要放页面专属操作。' },
        ],
        a11y: [
            '<nav> + 真实链接 + aria-current="page"，不是 tablist。',
            '底部留出 env(safe-area-inset-bottom)，不会压在 home indicator 上。',
            '徽标需要 badgeLabel，否则只会念出一个数字。',
        ],
    },
    {
        slug: 'sidebar', name: 'Sidebar', group: '导航',
        summary: '内嵌浮动的大玻璃侧栏，内容从它下方穿过。',
        rule: '大玻璃更厚、阴影更深、折射更强，并且不随背景翻转明暗——这么大的表面如果跟着内容翻转会没法读。胶囊圆角只适合短的横向控件，所以大表面用固定圆角。',
        backdrop: 'both', demoHeight: 300,
        example: () => (0, jsx_runtime_1.jsx)(react_2.Sidebar, { "aria-label": "\u793A\u4F8B\u4FA7\u680F", style: { width: 220, position: 'static' }, header: (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "subhead", emphasized: true, children: "\u8D44\u6599\u5E93" }), footer: (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "caption1", tone: "secondary", children: "12 \u4E2A\u9879\u76EE" }), children: (0, jsx_runtime_1.jsx)("div", { style: { display: 'grid', gap: 4 }, children: ['全部', '最近', '收藏', '归档'].map((label, index) => (0, jsx_runtime_1.jsx)("a", { href: "#/components/sidebar", onClick: stop, className: "demo-sidebar-row", "aria-current": index === 1 ? 'page' : undefined, children: label }, label)) }) }),
        code: `<Sidebar aria-label="资料库"
  header={<Text variant="subhead" emphasized>资料库</Text>}>
  <nav>…</nav>
</Sidebar>`,
        props: [
            { name: 'aria-label', type: 'string', required: true, description: '侧栏的可访问名称。' },
            { name: 'side', type: "'leading' | 'trailing'", default: "'leading'", description: 'trailing 表示这是一个检查器而不是导航。' },
            { name: 'header / footer', type: 'ReactNode', description: '不随内容滚动的固定区域。' },
        ],
        a11y: ['渲染为 <aside>；正文区域可滚动且 overscroll-behavior: contain。'],
    },
    {
        slug: 'tabs', name: 'GlassTabs', group: '导航',
        summary: '页内标签页：真正会换面板的那一种。',
        rule: '这和 app 的 TabBar 不是一回事。tablist 告诉辅助技术“内容会就地替换”，用它来做页面级导航会误导用户。',
        demoHeight: 240,
        example: () => (0, jsx_runtime_1.jsx)(react_2.GlassTabs, { "aria-label": "\u7EC4\u4EF6\u8D44\u6599", items: [
                { value: 'design', label: '设计', content: (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "body", children: "\u6709\u8FB9\u754C\u7684\u89C6\u89C9\u7CFB\u7EDF\uFF0C\u6BD4\u4E00\u7EC4\u6CA1\u6709\u4E0A\u9650\u7684\u7279\u6548\u53C2\u6570\u66F4\u6709\u4EF7\u503C\u3002" }) },
                { value: 'code', label: '实现', content: (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "body", children: "CSS backdrop-filter + SVG \u4F4D\u79FB\u6298\u5C04 + \u539F\u751F\u4EA4\u4E92\u8BED\u4E49\u3002" }) },
                { value: 'test', label: '测试', content: (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "body", children: "\u51E0\u4F55\u5355\u6D4B\u3001\u771F\u5B9E\u6D4F\u89C8\u5668\u4EA4\u4E92\u3001\u53EF\u590D\u73B0\u7684\u6D4B\u91CF\u8BB0\u5F55\u3002" }) },
            ] }),
        code: `<GlassTabs aria-label="组件资料" items={[
  { value: 'design', label: '设计', content: <DesignNotes /> },
  { value: 'code', label: '实现', content: <CodeNotes /> },
]} />`,
        props: [
            { name: 'items', type: 'GlassTab[]', required: true, description: '每项包含 value、label 与 content。' },
            { name: 'value / defaultValue', type: 'string', description: '受控或非受控选中项。' },
            { name: 'aria-label', type: 'string', required: true, description: 'tablist 的可访问名称。' },
        ],
        a11y: [
            'role="tablist" / "tab" / "tabpanel" 与 aria-controls 完整配对。',
            '方向键切换并即时激活；面板可聚焦，便于键盘用户直接进入内容。',
            '和分段控件一样可以按住拖动切换。',
        ],
    },
    {
        slug: 'navigation-bar', name: 'NavigationBar', group: '导航',
        summary: '大标题滚动出视野后，交棒给紧凑标题。',
        rule: '大标题还在屏幕上时，紧凑标题必须隐藏——否则同一句话出现两次。导航栏自己没有背景、边框和阴影：分隔来自分组的玻璃和滚动边缘效果。',
        demoHeight: 260,
        example: () => (0, jsx_runtime_1.jsxs)("div", { className: "demo-navbar-frame", children: [(0, jsx_runtime_1.jsxs)("div", { className: "demo-navbar-row", children: [(0, jsx_runtime_1.jsx)(react_2.Text, { variant: "caption1", tone: "secondary", children: "\u6EDA\u52A8\u524D\uFF1A\u7D27\u51D1\u6807\u9898\u9690\u85CF" }), (0, jsx_runtime_1.jsxs)("div", { className: "demo-navbar-mock", "data-compact": "false", children: [(0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { "aria-label": "\u8FD4\u56DE", variant: "plain", controlSize: "small", children: (0, jsx_runtime_1.jsx)(react_2.LibraryIcon, { name: "chevronForward", size: 18, style: { transform: 'scaleX(-1)' } }) }), (0, jsx_runtime_1.jsx)("span", { className: "demo-navbar-title", children: "\u5730\u6807" }), (0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { "aria-label": "\u66F4\u591A", variant: "plain", controlSize: "small", children: (0, jsx_runtime_1.jsx)(react_2.LibraryIcon, { name: "ellipsis", size: 18 }) })] }), (0, jsx_runtime_1.jsx)(react_2.Text, { as: "h3", variant: "largeTitle", emphasized: true, children: "\u5730\u6807" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "demo-navbar-row", children: [(0, jsx_runtime_1.jsx)(react_2.Text, { variant: "caption1", tone: "secondary", children: "\u6EDA\u52A8\u540E\uFF1A\u5927\u6807\u9898\u79BB\u573A\uFF0C\u7D27\u51D1\u6807\u9898\u63A5\u624B" }), (0, jsx_runtime_1.jsxs)("div", { className: "demo-navbar-mock", "data-compact": "true", children: [(0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { "aria-label": "\u8FD4\u56DE", variant: "plain", controlSize: "small", children: (0, jsx_runtime_1.jsx)(react_2.LibraryIcon, { name: "chevronForward", size: 18, style: { transform: 'scaleX(-1)' } }) }), (0, jsx_runtime_1.jsx)("span", { className: "demo-navbar-title", children: "\u5730\u6807" }), (0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { "aria-label": "\u66F4\u591A", variant: "plain", controlSize: "small", children: (0, jsx_runtime_1.jsx)(react_2.LibraryIcon, { name: "ellipsis", size: 18 }) })] })] })] }),
        code: `<NavigationBar
  title="地标"
  subtitle="12 个收藏"
  leading={<GlassIconButton aria-label="返回"><ChevronIcon /></GlassIconButton>}
  trailing={<ToolbarGroup><GlassIconButton aria-label="更多"><MoreIcon /></GlassIconButton></ToolbarGroup>}
/>`,
        props: [
            { name: 'title', type: 'string', required: true, description: '标题文字，大标题与紧凑标题共用。' },
            { name: 'largeTitle', type: 'boolean', default: 'true', description: '次级页面可以关掉，直接使用紧凑标题。' },
            { name: 'subtitle', type: 'ReactNode', description: '只出现在大标题下方，紧凑栏保持单行。' },
            { name: 'leading / trailing', type: 'ReactNode', description: '两端的控件分组。' },
        ],
        a11y: [
            '紧凑标题是 aria-hidden：真正的标题是下方那个 h1，两者不能重复朗读。',
            '顶部留出 env(safe-area-inset-top)。',
        ],
    },
    {
        slug: 'scroll-edge', name: 'ScrollEdge', group: '导航',
        summary: '取代不透明栏背景与分隔线的滚动边缘效果。',
        rule: '它不是装饰：只有内容真的从浮动 UI 下方穿过时才存在，且一个滚动视图只用一个。soft 是 iOS 默认的渐进溶解，hard 是 macOS 固定表头那种均匀边界。',
        demoHeight: 280,
        example: function ScrollEdgeExample() {
            const soft = (0, react_1.useRef)(null);
            return (0, jsx_runtime_1.jsxs)("div", { className: "demo-scroll-fixture", children: [(0, jsx_runtime_1.jsx)(react_2.ScrollEdge, { targetRef: soft, variant: "soft" }), (0, jsx_runtime_1.jsx)("div", { className: "demo-scroll-body", ref: soft, tabIndex: 0, "aria-label": "\u6EDA\u52A8\u6B63\u6587\u6F14\u793A", children: Array.from({ length: 8 }, (_, i) => (0, jsx_runtime_1.jsxs)(react_2.Text, { variant: "body", style: { marginBlockEnd: 12 }, children: ["\u7B2C ", i + 1, " \u6BB5\u3002\u6B63\u6587\u4E0D\u9700\u8981\u73BB\u7483\u5316\u3002\u9605\u8BFB\u9700\u8981\u7A33\u5B9A\u7684\u5E95\u8272\u3001\u5408\u9002\u7684\u884C\u957F\u548C\u6E05\u6670\u7684\u5C42\u7EA7\uFF1B\u6EDA\u52A8\u8FB9\u7F18\u53EA\u8868\u8FBE\u5185\u5BB9\u4E0E\u64CD\u4F5C\u5C42\u7684\u5173\u7CFB\u3002"] }, i)) }), (0, jsx_runtime_1.jsx)(react_2.ScrollEdge, { targetRef: soft, edge: "bottom", variant: "soft" })] });
        },
        code: `const scroller = useRef<HTMLDivElement>(null);

<ScrollEdge targetRef={scroller} variant="soft" />
<div ref={scroller} className="scroller">…</div>
<ScrollEdge targetRef={scroller} edge="bottom" />`,
        props: [
            { name: 'targetRef', type: 'RefObject<HTMLElement>', required: true, description: '被观察的滚动容器。' },
            { name: 'edge', type: "'top' | 'bottom'", default: "'top'", description: '作用在哪一侧。' },
            { name: 'variant', type: "'soft' | 'hard'", default: "'soft'", description: '渐进溶解或均匀边界。' },
            { name: 'height', type: 'number', default: '44', description: '溶解区高度；分栏视图中各栏应保持一致。' },
        ],
        a11y: ['纯装饰，aria-hidden；只在内容确实交叠时出现（data-active）。', '减少透明度时退化为实色边界。'],
    },
];

},
"app/catalog/overlays.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overlayDocs = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@liquid-glass-ui/react");
exports.overlayDocs = [
    {
        slug: 'popover', name: 'GlassPopover', group: '浮层',
        summary: '锚定在触发控件上的非模态面板，使用大玻璃。',
        rule: '菜单、浮层、操作表与对话框都从打开它们的控件里“长出来”，并保持锚定。在手机上这种模式应改为 sheet —— 带箭头指向控件是 iPad 和 Mac 的习惯。',
        demoHeight: 200,
        example: function PopoverExample() {
            const [view, setView] = (0, react_1.useState)('fit');
            const [volume, setVolume] = (0, react_1.useState)(65);
            return (0, jsx_runtime_1.jsxs)(react_2.GlassPopover, { title: "\u67E5\u770B\u8BBE\u7F6E", description: "Escape \u5173\u95ED\u5E76\u628A\u7126\u70B9\u8FD8\u7ED9\u89E6\u53D1\u5668\u3002", trigger: (0, jsx_runtime_1.jsx)(react_2.GlassButton, { children: "\u6253\u5F00\u6D6E\u5C42" }), children: [(0, jsx_runtime_1.jsx)(react_2.Text, { variant: "subhead", emphasized: true, style: { marginBlockEnd: 8 }, children: "\u663E\u793A\u65B9\u5F0F" }), (0, jsx_runtime_1.jsx)(react_2.GlassSegmentedControl, { "aria-label": "\u663E\u793A\u65B9\u5F0F", density: "compact", value: view, onValueChange: setView, items: [{ value: 'fit', label: '适应' }, { value: 'fill', label: '填充' }] }), (0, jsx_runtime_1.jsxs)(react_2.Text, { variant: "subhead", emphasized: true, style: { margin: '16px 0 8px' }, children: ["\u97F3\u91CF ", volume, "%"] }), (0, jsx_runtime_1.jsx)(react_2.GlassSlider, { "aria-label": "\u97F3\u91CF", value: volume, onValueChange: setVolume })] });
        },
        code: `<GlassPopover
  title="查看设置"
  description="Escape 关闭并返回触发器。"
  trigger={<GlassButton>打开浮层</GlassButton>}
>
  …
</GlassPopover>`,
        props: [
            { name: 'trigger', type: 'ReactElement', description: '你自己的按钮；组件只补上 aria-haspopup / expanded / controls。' },
            { name: 'title', type: 'string', required: true, description: '面板标题，作为 aria-labelledby。' },
            { name: 'align', type: "'start' | 'center' | 'end'", default: "'end'", description: '相对触发器的对齐方式。' },
            { name: 'open / defaultOpen / onOpenChange', type: 'boolean / (open) => void', description: '受控或非受控开合。' },
        ],
        a11y: [
            '使用原生 popover 顶层，自带轻量关闭；Escape 关闭并把焦点还给触发器。',
            '打开时焦点移到面板内第一个可聚焦元素。',
            '视口内自动避让，并把触发器中心投影为 transform-origin，所以是“长出来”的。',
        ],
    },
    {
        slug: 'menu', name: 'GlassMenu', group: '浮层',
        summary: '从触发器变形出来的菜单，支持图标、勾选状态与快捷键。',
        rule: '菜单的键盘模型是一份契约：上下移动、Home/End 跳转、键入跳到匹配项、Escape 关闭并回焦、Tab 关闭。每组保持在七项左右，用分隔线分组而不是无限拉长。',
        demoHeight: 190,
        example: function MenuExample() {
            const [status, setStatus] = (0, react_1.useState)('尚未选择');
            const [pinned, setPinned] = (0, react_1.useState)(true);
            return (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: 12, justifyItems: 'center' }, children: [(0, jsx_runtime_1.jsx)(react_2.GlassMenu, { "aria-label": "\u793A\u4F8B\u83DC\u5355", trigger: (0, jsx_runtime_1.jsxs)(react_2.GlassButton, { children: ["\u6253\u5F00\u83DC\u5355", (0, jsx_runtime_1.jsx)(react_2.LibraryIcon, { name: "chevronDown", size: 16 })] }), items: [
                            { key: 'open', label: '打开', icon: (0, jsx_runtime_1.jsx)(react_2.LibraryIcon, { name: "chevronForward", size: 16 }), shortcut: '⌘O', onSelect: () => setStatus('打开') },
                            { key: 'pin', label: '置顶', checked: pinned, onSelect: () => { setPinned(!pinned); setStatus(pinned ? '取消置顶' : '已置顶'); } },
                            { key: 'disabled', label: '不可用项', disabled: true, onSelect: () => { } },
                            { key: 'delete', label: '删除', destructive: true, separatorBefore: true, onSelect: () => setStatus('删除') },
                        ] }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "caption1", tone: "secondary", role: "status", children: status })] });
        },
        code: `<GlassMenu aria-label="更多操作"
  trigger={<GlassIconButton aria-label="更多"><MoreIcon /></GlassIconButton>}
  items={[
    { key: 'open', label: '打开', shortcut: '⌘O', onSelect: open },
    { key: 'pin', label: '置顶', checked: pinned, onSelect: togglePin },
    { key: 'delete', label: '删除', destructive: true, separatorBefore: true, onSelect: remove },
  ]}
/>`,
        props: [
            { name: 'items', type: 'GlassMenuItem[]', required: true, description: '每项含 key、label 与 onSelect。' },
            { name: 'icon', type: 'ReactNode', description: '标准动作才配图标；不要逐行装饰。' },
            { name: 'checked', type: 'boolean', description: '存在时角色变为 menuitemcheckbox 并带 aria-checked。' },
            { name: 'shortcut', type: 'string', description: '快捷键提示，装饰性地展示。' },
            { name: 'destructive', type: 'boolean', description: '红色；破坏性操作仍需确认或撤销。' },
        ],
        a11y: ['菜单项是真实 <button>，键盘模型需要可聚焦元素。', '键入查找有 700ms 的输入窗口。'],
    },
    {
        slug: 'sheet', name: 'GlassSheet', group: '浮层',
        summary: '带停靠高度的 sheet，可以拖动，满高时变为不透明。',
        rule: '拖动才是重点：sheet 1:1 跟随手指，松手后弹簧停在最近的停靠点，中途可以被打断。满高时它不再假装漂浮——变成不透明并贴住屏幕边缘。',
        demoHeight: 180,
        example: function SheetExample() {
            const [open, setOpen] = (0, react_1.useState)(false);
            return (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: 12, justifyItems: 'center' }, children: [(0, jsx_runtime_1.jsx)(react_2.GlassSheet, { title: "\u5206\u4EAB\u8FD9\u4E00\u523B", description: "\u6309\u4F4F\u9876\u90E8\u7684\u624B\u67C4\u4E0A\u4E0B\u62D6\u52A8\uFF0C\u8BD5\u8BD5\u4E24\u4E2A\u505C\u9760\u9AD8\u5EA6\u3002", open: open, onOpenChange: setOpen, detents: ['medium', 'large'], trigger: (0, jsx_runtime_1.jsx)(react_2.GlassButton, { children: "\u6253\u5F00 Sheet" }), children: (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: 12, marginBlockStart: 12 }, children: [(0, jsx_runtime_1.jsx)(react_2.TextField, { label: "\u5907\u6CE8", placeholder: "\u60F3\u8BF4\u70B9\u4EC0\u4E48" }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "footnote", tone: "secondary", children: "\u62D6\u5230\u9876\u90E8\u65F6\u80CC\u666F\u4F1A\u53D8\u6210\u4E0D\u900F\u660E\u5E76\u8D34\u4F4F\u8FB9\u7F18\u3002" }), (0, jsx_runtime_1.jsx)(react_2.GlassButton, { variant: "glassProminent", onClick: () => setOpen(false), children: "\u5B8C\u6210" })] }) }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "caption1", tone: "secondary", children: "\u624B\u67C4\u652F\u6301\u952E\u76D8\uFF1A\u4E0A\u4E0B\u65B9\u5411\u952E\u5207\u6362\u505C\u9760\u9AD8\u5EA6" })] });
        },
        code: `<GlassSheet
  title="分享这一刻"
  detents={['medium', 'large']}
  trigger={<GlassButton>分享</GlassButton>}
>
  …
</GlassSheet>`,
        props: [
            { name: 'detents', type: "SheetDetent[]", default: "['medium', 'large']", description: '停靠高度，从小到大。' },
            { name: 'defaultDetent', type: 'SheetDetent', description: '初始停靠高度。' },
            { name: 'grabber', type: 'boolean', default: 'true', description: '拖动手柄。只有单一停靠高度时才关掉。' },
            { name: 'title', type: 'string', required: true, description: '标题，作为 aria-labelledby。' },
        ],
        a11y: [
            '基于原生 <dialog>：焦点约束、顶层与 Escape 都来自平台。',
            '手柄是 role="slider"，方向键在停靠点之间移动，最低点再向下即关闭。',
            '只动 transform，不动 height，拖动全程留在合成器上。',
            '减少动效时直接跳到目标高度，不做弹簧。',
        ],
    },
    {
        slug: 'alert', name: 'GlassAlert', group: '浮层',
        summary: '简短且不可回避的决定，最多三个操作。',
        rule: '标题加粗且左对齐——居中的提示文字是上一代设计。破坏性操作要么配这个（红色操作 + 焦点落在取消上），要么配一个即时可用的撤销；日常信息两者都不需要。',
        demoHeight: 180,
        example: function AlertExample() {
            const [result, setResult] = (0, react_1.useState)('尚未决定');
            return (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: 12, justifyItems: 'center' }, children: [(0, jsx_runtime_1.jsx)(react_2.GlassAlert, { title: "\u5220\u9664\u8FD9\u4E2A\u5DE5\u4F5C\u533A\uFF1F", message: "\u5DE5\u4F5C\u533A\u5185\u7684 12 \u4E2A\u9879\u76EE\u4F1A\u4E00\u5E76\u79FB\u9664\uFF0C\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\u3002", trigger: (0, jsx_runtime_1.jsx)(react_2.GlassButton, { variant: "destructive", children: "\u5220\u9664\u5DE5\u4F5C\u533A" }), actions: [
                            { key: 'cancel', label: '取消', role: 'cancel', onSelect: () => setResult('已取消') },
                            { key: 'delete', label: '删除', role: 'destructive', onSelect: () => setResult('已删除（仅本地状态）') },
                        ] }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "caption1", tone: "secondary", role: "status", children: result })] });
        },
        code: `<GlassAlert
  title="删除这个工作区？"
  message="工作区内的 12 个项目会一并移除，此操作不可撤销。"
  trigger={<GlassButton variant="destructive">删除</GlassButton>}
  actions={[
    { key: 'cancel', label: '取消', role: 'cancel' },
    { key: 'delete', label: '删除', role: 'destructive', onSelect: remove },
  ]}
/>`,
        props: [
            { name: 'title', type: 'string', required: true, description: '加粗左对齐的标题。' },
            { name: 'message', type: 'string', description: '一两句话说清发生了什么、接下来会怎样。' },
            { name: 'actions', type: 'AlertAction[]', required: true, description: '最多三个；更长的列表用操作表。' },
            { name: 'role', type: "'default' | 'cancel' | 'destructive'", default: "'default'", description: 'AlertAction：决定配色与初始焦点。' },
        ],
        a11y: [
            'role="alertdialog"；存在破坏性操作时初始焦点落在取消上。',
            'Escape 等同于执行取消操作，而不是静默关闭。',
            '三个操作时改为纵向堆叠，避免标签被挤扁。',
        ],
    },
    {
        slug: 'action-sheet', name: 'GlassActionSheet', group: '浮层',
        summary: '从来源控件弹出的一小组选择。',
        rule: '破坏性选项排在列表底部并标红，取消与其余项分开，界面其他部分保持可交互——这是一组选项，不是一个模态任务。',
        demoHeight: 180,
        example: function ActionSheetExample() {
            const [result, setResult] = (0, react_1.useState)('尚未选择');
            return (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: 12, justifyItems: 'center' }, children: [(0, jsx_runtime_1.jsx)(react_2.GlassActionSheet, { "aria-label": "\u9879\u76EE\u64CD\u4F5C", title: "\u8FD9\u4E00\u5F20\u7167\u7247", message: "\u9009\u62E9\u8981\u6267\u884C\u7684\u64CD\u4F5C\u3002", trigger: (0, jsx_runtime_1.jsx)(react_2.GlassButton, { children: "\u6253\u5F00\u64CD\u4F5C\u8868" }), actions: [
                            { key: 'share', label: '分享', onSelect: () => setResult('分享') },
                            { key: 'duplicate', label: '创建副本', onSelect: () => setResult('创建副本') },
                            { key: 'delete', label: '删除照片', destructive: true, onSelect: () => setResult('删除') },
                        ], cancelLabel: "\u53D6\u6D88", onCancel: () => setResult('已取消') }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "caption1", tone: "secondary", role: "status", children: result })] });
        },
        code: `<GlassActionSheet
  aria-label="项目操作"
  trigger={<GlassIconButton aria-label="更多"><MoreIcon /></GlassIconButton>}
  actions={[
    { key: 'share', label: '分享', onSelect: share },
    { key: 'delete', label: '删除照片', destructive: true, onSelect: remove },
  ]}
  onCancel={dismiss}
/>`,
        props: [
            { name: 'actions', type: 'ActionSheetItem[]', required: true, description: '大约六项以内；更长就该是菜单或列表页。' },
            { name: 'title / message', type: 'string', description: '说明这些选择作用于什么。' },
            { name: 'cancelLabel', type: 'string', default: "'Cancel'", description: '取消按钮文字。' },
            { name: 'aria-label', type: 'string', required: true, description: '可访问名称。' },
        ],
        a11y: [
            '破坏性项会被自动排到最后，误触更可能落在可恢复的选项上。',
            '窄屏锚定在底部，宽屏保持贴着来源控件。',
        ],
    },
    {
        slug: 'dialog', name: 'GlassDialog', group: '浮层',
        summary: '大玻璃上的模态任务，基于原生 dialog。',
        rule: '打断主流程的任务要配一层变暗；并行任务只需要玻璃的分隔，不需要变暗。',
        demoHeight: 180,
        example: function DialogExample() {
            const [name, setName] = (0, react_1.useState)('我的灵感空间');
            return (0, jsx_runtime_1.jsx)(react_2.GlassDialog, { title: "\u521B\u5EFA\u4E00\u4E2A\u5DE5\u4F5C\u533A", description: "\u8FD9\u4E2A\u793A\u4F8B\u9A8C\u8BC1\u7126\u70B9\u3001\u952E\u76D8\u548C\u8868\u5355\uFF0C\u4E0D\u4F1A\u63D0\u4EA4\u5230\u4EFB\u4F55\u5916\u90E8\u670D\u52A1\u3002", trigger: (0, jsx_runtime_1.jsx)(react_2.GlassButton, { children: "\u6253\u5F00\u5BF9\u8BDD\u6846" }), closeLabel: "\u5173\u95ED\u5BF9\u8BDD\u6846", children: (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: 16 }, children: [(0, jsx_runtime_1.jsx)(react_2.TextField, { label: "\u5DE5\u4F5C\u533A\u540D\u79F0", value: name, onChange: event => setName(event.target.value) }), (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "footnote", tone: "secondary", children: "Tab \u5728\u5BF9\u8BDD\u6846\u5185\u5FAA\u73AF\uFF0CEscape \u5173\u95ED\u5E76\u628A\u7126\u70B9\u8FD8\u7ED9\u89E6\u53D1\u5668\u3002" })] }) });
        },
        code: `<GlassDialog
  title="创建一个工作区"
  description="…"
  trigger={<GlassButton>新建</GlassButton>}
>
  <form>…</form>
</GlassDialog>`,
        props: [
            { name: 'title / description', type: 'string', required: true, description: '分别接到 aria-labelledby 与 aria-describedby。' },
            { name: 'dismissOnBackdrop', type: 'boolean', default: 'true', description: '点击背景关闭；按下与抬起都在外部才算数。' },
            { name: 'closeLabel', type: 'string', default: "'Close'", description: '关闭按钮的可访问名称。' },
        ],
        a11y: ['原生 <dialog> + showModal：焦点约束、背景 inert、顶层都由平台提供。', '打开时锁滚动，关闭后把焦点还给触发器。'],
    },
    {
        slug: 'toast', name: 'ToastProvider · useToast', group: '浮层',
        summary: '轻量提示，承载可撤销操作的 Undo。',
        rule: '不可逆的操作用 alert 或操作表确认；可逆的直接执行，然后在这里给一个撤销。每次删除都要停下来问一遍，界面会变得很累；两者都不给，则会变得不可信。',
        demoHeight: 170,
        example: function ToastExample() {
            const toast = (0, react_2.useToast)();
            const [items, setItems] = (0, react_1.useState)(['草稿 A', '草稿 B', '草稿 C']);
            const remove = () => {
                const removed = items.at(-1);
                if (!removed)
                    return;
                setItems(list => list.slice(0, -1));
                toast({ message: `已删除「${removed}」`, action: { label: '撤销', onSelect: () => setItems(list => [...list, removed]) } });
            };
            return (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: 12, justifyItems: 'center' }, children: [(0, jsx_runtime_1.jsx)(react_2.GlassButton, { variant: "destructive", onClick: remove, disabled: items.length === 0, children: "\u5220\u9664\u6700\u540E\u4E00\u9879" }), (0, jsx_runtime_1.jsxs)(react_2.Text, { variant: "caption1", tone: "secondary", children: ["\u5269\u4F59\uFF1A", items.join('、') || '（空）'] })] });
        },
        code: `// 应用根部
<ToastProvider><App /></ToastProvider>

// 任意组件里
const toast = useToast();
toast({
  message: '已删除「草稿 A」',
  action: { label: '撤销', onSelect: restore },
});`,
        props: [
            { name: 'message', type: 'string', required: true, description: '陈述已经发生的事。' },
            { name: 'action', type: '{ label: string; onSelect: () => void }', description: '撤销入口——它让可逆操作可以跳过确认对话框。' },
            { name: 'duration', type: 'number', default: '6000', description: '停留毫秒数。撤销需要足够时间读完并够到。' },
            { name: 'limit', type: 'number', default: '3', description: 'ToastProvider：最多同时堆叠几条。' },
        ],
        a11y: [
            'role="status" + aria-live="polite"：报告已发生的事，不打断当前操作。',
            '鼠标悬停或键盘聚焦时暂停计时，避免撤销窗口在伸手过去的路上消失。',
        ],
    },
];

},
"app/catalog/types.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

},
"app/code-block.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeBlock = CodeBlock;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const icons_js_1 = require("./icons.js");
function CodeBlock({ code, label = '复制代码', children }) {
    const [copied, setCopied] = (0, react_1.useState)(false);
    const timer = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(() => () => clearTimeout(timer.current), []);
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
    return (0, jsx_runtime_1.jsxs)("div", { className: "code-block", children: [(0, jsx_runtime_1.jsx)("pre", { children: children ?? code }), (0, jsx_runtime_1.jsxs)("button", { type: "button", className: `code-copy ${copied ? 'is-copied' : ''}`, "aria-label": copied ? '已复制' : label, onClick: () => void copy(), children: [(0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: copied ? 'check' : 'copy', size: 14 }), (0, jsx_runtime_1.jsx)("span", { children: copied ? '已复制' : '复制' })] })] });
}

},
"app/components-page.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentsPage = ComponentsPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@liquid-glass-ui/react");
const icons_js_1 = require("./icons.js");
function Sample({ number, title, description, children }) {
    return (0, jsx_runtime_1.jsxs)("section", { className: "component-sample", children: [(0, jsx_runtime_1.jsxs)("div", { className: "sample-heading", children: [(0, jsx_runtime_1.jsx)("span", { children: number }), (0, jsx_runtime_1.jsx)("h2", { children: title })] }), (0, jsx_runtime_1.jsx)("div", { className: "sample-stage", children: children }), (0, jsx_runtime_1.jsx)("p", { children: description })] });
}
function ComponentsPage() {
    const [pressed, setPressed] = (0, react_1.useState)(0);
    const [segment, setSegment] = (0, react_1.useState)('day');
    const [volume, setVolume] = (0, react_1.useState)(42);
    const [checked, setChecked] = (0, react_1.useState)(false);
    const [menuStatus, setMenuStatus] = (0, react_1.useState)('尚未选择');
    const [demoNav, setDemoNav] = (0, react_1.useState)('组件');
    const scroll = (0, react_1.useRef)(null);
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "page-heading", children: [(0, jsx_runtime_1.jsx)("span", { className: "eyebrow", children: "02 / COMPONENTS" }), (0, jsx_runtime_1.jsx)("h1", { children: "\u4E0D\u662F\u6EE4\u955C\u5408\u96C6\u3002\u662F\u7EC4\u4EF6\u3002" }), (0, jsx_runtime_1.jsx)("p", { children: "\u771F\u5B9E\u6309\u94AE\u3001\u539F\u751F\u8868\u5355\u3001\u952E\u76D8\u5BFC\u822A\u3001\u9876\u5C42\u5F39\u51FA\u754C\u9762\uFF0C\u4EE5\u53CA\u4E00\u81F4\u7684\u6750\u8D28\u7B56\u7565\u3002" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "component-grid", children: [(0, jsx_runtime_1.jsxs)(Sample, { number: "01", title: "\u6309\u94AE\u4E0E\u56FE\u6807\u6309\u94AE", description: "\u9ED8\u8BA4 type=button\uFF1B\u7981\u7528\u3001\u52A0\u8F7D\u3001\u7126\u70B9\u4E0E\u6309\u4E0B\u72B6\u6001\u3002", children: [(0, jsx_runtime_1.jsxs)("div", { className: "sample-row", children: [(0, jsx_runtime_1.jsx)(react_2.GlassButton, { onClick: () => setPressed(n => n + 1), children: "\u9ED8\u8BA4\u6309\u94AE" }), (0, jsx_runtime_1.jsxs)(react_2.GlassButton, { variant: "primary", onClick: () => setPressed(n => n + 1), children: ["\u4E3B\u8981\u64CD\u4F5C", (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "arrow", size: 16 })] }), (0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { "aria-label": "\u793A\u4F8B\u6536\u85CF", onClick: () => setPressed(n => n + 1), children: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "heart" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "sample-row", children: [(0, jsx_runtime_1.jsx)(react_2.GlassButton, { disabled: true, children: "\u4E0D\u53EF\u64CD\u4F5C" }), (0, jsx_runtime_1.jsx)(react_2.GlassButton, { loading: true, children: "\u5904\u7406\u4E2D" }), (0, jsx_runtime_1.jsx)(react_2.GlassButton, { variant: "danger", onClick: () => setPressed(0), children: "\u91CD\u7F6E\u8BA1\u6570" })] }), (0, jsx_runtime_1.jsxs)("output", { role: "status", children: ["\u4EA4\u4E92\u8BA1\u6570\uFF1A", pressed] })] }), (0, jsx_runtime_1.jsx)(Sample, { number: "02", title: "\u5171\u4EAB\u8868\u9762\u5DE5\u5177\u680F", description: "\u53EA\u6709\u5916\u5C42\u91C7\u6837\u80CC\u666F\u3002Tab \u8FDB\u5165\uFF0C\u65B9\u5411\u952E\u5207\u6362\uFF0CHome / End \u5B9A\u4F4D\u3002", children: (0, jsx_runtime_1.jsxs)(react_2.GlassToolbar, { "aria-label": "\u793A\u4F8B\u7F16\u8F91\u5DE5\u5177\u680F", children: [(0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { "aria-label": "\u5DE5\u5177\u4E00", children: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "grid" }) }), (0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { "aria-label": "\u5DE5\u5177\u4E8C", children: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "layer" }) }), (0, jsx_runtime_1.jsx)(react_2.GlassToolbarSeparator, {}), (0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { "aria-label": "\u4E0D\u53EF\u7528\u5DE5\u5177", disabled: true, children: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "tune" }) }), (0, jsx_runtime_1.jsx)(react_2.GlassButton, { onClick: () => setMenuStatus('工作区已保存'), children: "\u4FDD\u5B58" })] }) }), (0, jsx_runtime_1.jsxs)(Sample, { number: "03", title: "\u5206\u6BB5\u9009\u62E9", description: "\u539F\u751F radio\uFF0C\u53C2\u4E0E\u8868\u5355\uFF1B\u9009\u4E2D\u900F\u955C\u7684\u4F4D\u7F6E\u8FC7\u6E21\u4E0D\u7B49\u4E8E\u5149\u5B66\u878D\u5408\u3002", children: [(0, jsx_runtime_1.jsx)(react_2.GlassSegmentedControl, { "aria-label": "\u65F6\u95F4\u8303\u56F4", value: segment, onValueChange: setSegment, items: [{ value: 'day', label: '日' }, { value: 'week', label: '周' }, { value: 'month', label: '月' }, { value: 'year', label: '年', disabled: true }] }), (0, jsx_runtime_1.jsxs)("output", { children: ["\u5DF2\u9009\u62E9\uFF1A", segment] })] }), (0, jsx_runtime_1.jsxs)(Sample, { number: "04", title: "\u6ED1\u5757\u4E0E\u5F00\u5173", description: "\u539F\u751F range / checkbox\u3002\u6ED1\u5757\u79FB\u52A8\u65F6\u4E0D\u91CD\u5EFA\u51E0\u4F55\u8D34\u56FE\u3002", children: [(0, jsx_runtime_1.jsxs)("div", { className: "full-width", children: [(0, jsx_runtime_1.jsxs)("div", { className: "field-heading", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u97F3\u91CF" }), (0, jsx_runtime_1.jsxs)("output", { "data-testid": "gallery-volume", children: [volume, "%"] })] }), (0, jsx_runtime_1.jsx)(react_2.GlassSlider, { "aria-label": "\u793A\u4F8B\u97F3\u91CF", value: volume, onValueChange: setVolume })] }), (0, jsx_runtime_1.jsx)(react_2.GlassSwitch, { "aria-label": "\u81EA\u52A8\u64AD\u653E", checked: checked, onCheckedChange: setChecked, label: "\u81EA\u52A8\u64AD\u653E" }), (0, jsx_runtime_1.jsx)("output", { children: checked ? '已启用' : '已关闭' })] }), (0, jsx_runtime_1.jsxs)(Sample, { number: "05", title: "Popover \u4E0E\u83DC\u5355", description: "\u951A\u5B9A\u89E6\u53D1\u5668\u3001\u89C6\u53E3\u907F\u8BA9\u3001\u5916\u90E8\u70B9\u51FB\u5173\u95ED\u3002\u83DC\u5355\u652F\u6301\u65B9\u5411\u952E\u4E0E\u952E\u5165\u67E5\u627E\u3002", children: [(0, jsx_runtime_1.jsxs)("div", { className: "sample-row", children: [(0, jsx_runtime_1.jsxs)(react_2.GlassPopover, { title: "\u663E\u793A\u8BBE\u7F6E", description: "\u8FD9\u662F\u975E\u6A21\u6001\u5F39\u51FA\u5C42\uFF1BEscape \u5173\u95ED\u5E76\u8FD4\u56DE\u89E6\u53D1\u5668\u3002", trigger: (0, jsx_runtime_1.jsx)(react_2.GlassButton, { children: "\u6253\u5F00\u5F39\u51FA\u5C42" }), children: [(0, jsx_runtime_1.jsx)("label", { className: "field-label", htmlFor: "popover-name", children: "\u754C\u9762\u540D\u79F0" }), (0, jsx_runtime_1.jsx)("input", { className: "text-input", id: "popover-name", defaultValue: "Liquid Workspace" })] }), (0, jsx_runtime_1.jsx)(react_2.GlassMenu, { "aria-label": "\u793A\u4F8B\u83DC\u5355", trigger: (0, jsx_runtime_1.jsxs)(react_2.GlassButton, { children: ["\u6253\u5F00\u83DC\u5355", (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "more", size: 16 })] }), items: [{ key: 'a', label: 'Alpha', onSelect: () => setMenuStatus('Alpha 已执行') }, { key: 'b', label: 'Beta', disabled: true, onSelect: () => { } }, { key: 'c', label: 'Charlie', onSelect: () => setMenuStatus('Charlie 已执行') }, { key: 'd', label: '删除测试项', destructive: true, separatorBefore: true, onSelect: () => setMenuStatus('测试项已移除（本地状态）') }] })] }), (0, jsx_runtime_1.jsx)("output", { role: "status", "data-testid": "menu-status", children: menuStatus })] }), (0, jsx_runtime_1.jsx)(Sample, { number: "06", title: "\u6A21\u6001\u5BF9\u8BDD\u6846", description: "\u539F\u751F dialog \u7BA1\u7406\u7126\u70B9\u7EA6\u675F\u4E0E\u80CC\u666F inert\uFF1B\u5305\u542B\u6807\u9898\u3001\u63CF\u8FF0\u4E0E\u6EDA\u52A8\u9501\u3002", children: (0, jsx_runtime_1.jsx)(react_2.GlassDialog, { title: "\u521B\u5EFA\u4E00\u4E2A\u5DE5\u4F5C\u533A", description: "\u8FD9\u4E2A\u793A\u4F8B\u9A8C\u8BC1\u7126\u70B9\u3001\u952E\u76D8\u548C\u8868\u5355\uFF1B\u4E0D\u4F1A\u63D0\u4EA4\u5230\u5916\u90E8\u670D\u52A1\u3002", trigger: (0, jsx_runtime_1.jsxs)(react_2.GlassButton, { children: ["\u6253\u5F00\u5BF9\u8BDD\u6846", (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "expand", size: 16 })] }), children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: e => { e.preventDefault(); setMenuStatus('工作区设置已在本地更新'); }, children: [(0, jsx_runtime_1.jsx)("label", { className: "field-label", htmlFor: "workspace-name", children: "\u5DE5\u4F5C\u533A\u540D\u79F0" }), (0, jsx_runtime_1.jsx)("input", { className: "text-input", id: "workspace-name", defaultValue: "\u6211\u7684\u7075\u611F\u7A7A\u95F4" }), (0, jsx_runtime_1.jsx)("p", { className: "micro-note", children: "\u6309 Tab \u5FAA\u73AF\u64CD\u4F5C\uFF0C\u6309 Escape \u5173\u95ED\u3002" }), (0, jsx_runtime_1.jsx)(react_2.GlassButton, { variant: "primary", type: "submit", children: "\u4FDD\u5B58\u5230\u672C\u5730\u72B6\u6001" })] }) }) }), (0, jsx_runtime_1.jsx)(Sample, { number: "07", title: "\u9875\u5185\u6807\u7B7E\u9875", description: "role=tab / tabpanel\uFF0C\u4E0D\u5192\u5145\u9875\u9762\u5BFC\u822A\u3002\u65B9\u5411\u952E\u81EA\u52A8\u6FC0\u6D3B\u6807\u7B7E\u3002", children: (0, jsx_runtime_1.jsx)(react_2.GlassTabs, { "aria-label": "\u7EC4\u4EF6\u8D44\u6599", items: [{ value: 'design', label: '设计', content: (0, jsx_runtime_1.jsx)("p", { children: "\u4E00\u4E2A\u6709\u8FB9\u754C\u7684\u89C6\u89C9\u7CFB\u7EDF\uFF0C\u6BD4\u4E00\u7EC4\u65E0\u4E0A\u9650\u7684\u7279\u6548\u53C2\u6570\u66F4\u6709\u4EF7\u503C\u3002" }) }, { value: 'code', label: '实现', content: (0, jsx_runtime_1.jsx)("code", { children: "CSS + SVG + React + Native Chrome" }) }, { value: 'test', label: '测试', content: (0, jsx_runtime_1.jsx)("p", { children: "\u51E0\u4F55\u6D4B\u8BD5\u3001\u771F\u5B9E\u6D4F\u89C8\u5668\u4EA4\u4E92\u3001\u50CF\u7D20\u5DEE\u5F02\u9A8C\u8BC1\u4E0E\u53EF\u590D\u73B0\u6D4B\u91CF\u3002" }) }] }) }), (0, jsx_runtime_1.jsxs)(Sample, { number: "08", title: "\u5BFC\u822A\u4E0E\u5171\u4EAB\u5206\u7EC4", description: "\u5BFC\u822A\u4F7F\u7528\u771F\u5B9E\u94FE\u63A5\uFF1B\u5206\u7EC4\u5171\u4EAB\u6750\u8D28\uFF0C\u4E0D\u627F\u8BFA\u539F\u751F\u7EA7\u6DB2\u6EF4\u878D\u5408\u3002", children: [(0, jsx_runtime_1.jsx)(react_2.GlassNavBar, { "aria-label": "\u793A\u4F8B\u9875\u9762\u5BFC\u822A", items: ['概览', '组件', '文档'].map(name => ({ href: `#demo-${name}`, label: name, current: demoNav === name, onSelect: event => { event.preventDefault(); setDemoNav(name); } })) }), (0, jsx_runtime_1.jsxs)("output", { children: ["\u793A\u4F8B\u5BFC\u822A\uFF1A", demoNav, "\uFF08\u4E0D\u6539\u53D8\u7AD9\u70B9\u8DEF\u7531\uFF09"] }), (0, jsx_runtime_1.jsxs)(react_2.GlassGroup, { children: [(0, jsx_runtime_1.jsx)(react_2.GlassButton, { onClick: () => setPressed(n => n + 1), children: "\u5DE6\u4FA7\u64CD\u4F5C" }), (0, jsx_runtime_1.jsx)(react_2.GlassButton, { onClick: () => setPressed(n => n + 1), children: "\u53F3\u4FA7\u64CD\u4F5C" })] })] })] }), (0, jsx_runtime_1.jsxs)("section", { className: "section-block", children: [(0, jsx_runtime_1.jsxs)("div", { className: "section-title", children: [(0, jsx_runtime_1.jsx)("h2", { children: "ScrollEdge\uFF1A\u4EC5\u5728\u5185\u5BB9\u4EA4\u53E0\u65F6\u51FA\u73B0\u3002" }), (0, jsx_runtime_1.jsx)("span", { children: "09 / SCROLL CONTEXT" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "reading-fixture", children: [(0, jsx_runtime_1.jsx)(react_2.ScrollEdge, { targetRef: scroll }), (0, jsx_runtime_1.jsx)("div", { className: "reading-scroll", ref: scroll, tabIndex: 0, "aria-label": "\u6EDA\u52A8\u6B63\u6587\u6D4B\u8BD5", "data-testid": "reading-scroll", children: (0, jsx_runtime_1.jsxs)("article", { children: [(0, jsx_runtime_1.jsx)("h3", { children: "\u8BA9\u5185\u5BB9\u4FDD\u7559\u81EA\u5DF1\u7684\u6750\u8D28\u3002" }), Array.from({ length: 8 }, (_, i) => (0, jsx_runtime_1.jsxs)("p", { children: ["\u7B2C ", i + 1, " \u6BB5\u3002\u9875\u9762\u6B63\u6587\u4E0D\u9700\u8981\u73BB\u7483\u5316\u3002\u9605\u8BFB\u9700\u8981\u7A33\u5B9A\u7684\u5E95\u8272\u3001\u6070\u5F53\u7684\u884C\u957F\u4E0E\u6E05\u6670\u7684\u5C42\u7EA7\u3002\u6EDA\u52A8\u8FB9\u7F18\u53EA\u8D1F\u8D23\u8868\u8FBE\u5185\u5BB9\u4E0E\u64CD\u4F5C\u5C42\u7684\u5173\u7CFB\uFF0C\u4E0D\u628A\u6574\u7BC7\u6587\u7AE0\u8986\u76D6\u5728\u6A21\u7CCA\u4E4B\u4E0B\u3002"] }, i))] }) }), (0, jsx_runtime_1.jsx)(react_2.ScrollEdge, { targetRef: scroll, edge: "bottom" })] })] }), (0, jsx_runtime_1.jsxs)(react_2.GlassSurface, { className: "component-summary", children: [(0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "shield", size: 22 }), (0, jsx_runtime_1.jsx)("p", { children: "\u6240\u6709\u7EC4\u4EF6\u90FD\u9075\u5FAA Provider \u7684\u4E3B\u9898\u3001\u52A8\u6548\u4E0E\u900F\u660E\u5EA6\u504F\u597D\u3002\u771F\u5B9E\u5C4F\u5E55\u9605\u8BFB\u5668\u4E0E Google Chrome \u771F\u673A\u8BA4\u8BC1\u4ECD\u5C5E\u4E8E\u53D1\u5E03\u524D\u4EBA\u5DE5\u95E8\u69DB\u3002" })] })] });
}

},
"app/icons.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Icon = Icon;
const jsx_runtime_1 = require("react/jsx-runtime");
const paths = {
    play: 'M8 5l11 7-11 7z', pause: 'M8 5v14M16 5v14',
    next: 'M5 5l10 7-10 7zM19 5v14', previous: 'M19 5L9 12l10 7zM5 5v14',
    heart: 'M20.5 4.8a5.5 5.5 0 0 0-7.8 0L12 5.5l-.7-.7a5.5 5.5 0 0 0-7.8 7.8L12 21l8.5-8.4a5.5 5.5 0 0 0 0-7.8z',
    volume: 'M11 5L6 9H2v6h4l5 4zM16 8a6 6 0 0 1 0 8M19 4a11 11 0 0 1 0 16',
    tune: 'M4 7h16M4 17h16M8 4v6M16 14v6',
    more: 'M5 12h.01M12 12h.01M19 12h.01',
    arrow: 'M5 12h14M13 6l6 6-6 6',
    sun: 'M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
    moon: 'M20 14.4A8.5 8.5 0 0 1 9.6 4a8.5 8.5 0 1 0 10.4 10.4z',
    code: 'M8 6l-6 6 6 6M16 6l6 6-6 6M14 3l-4 18',
    grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    check: 'M5 12l4 4L19 6', close: 'M6 6l12 12M18 6L6 18',
    copy: 'M9 9h11v11H9zM15 5V3H3v12h2',
    download: 'M12 3v12M7 10l5 5 5-5M4 16v5h16v-5',
    expand: 'M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5',
    shrink: 'M3 8h5V3M16 3v5h5M21 16h-5v5M8 21v-5H3',
    layer: 'M12 3l10 6-10 6L2 9zM2 13l10 6 10-6M2 17l10 6 10-6',
    info: 'M12 11v6M12 7h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
    shield: 'M12 2l9 4v6c0 6-9 10-9 10S3 18 3 12V6zM8 12l3 3 5-6',
};
function Icon({ name, size = 20, style }) {
    return (0, jsx_runtime_1.jsx)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: name === 'more' ? 3.5 : 1.65, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", focusable: "false", style: style, children: (0, jsx_runtime_1.jsx)("path", { d: paths[name] ?? paths.layer }) });
}

},
"app/lab.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backgrounds = void 0;
exports.StressBackground = StressBackground;
exports.MaterialLab = MaterialLab;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@liquid-glass-ui/react");
const scene_js_1 = require("./scene.js");
const icons_js_1 = require("./icons.js");
const code_block_js_1 = require("./code-block.js");
exports.backgrounds = [['alpine', '山间场景'], ['white', '白色背景'], ['black', '黑色背景'], ['split', '明暗交界'], ['grid', '细线网格'], ['text', '滚动正文'], ['video', '合成视频']];
function StressBackground({ kind, children }) {
    return (0, jsx_runtime_1.jsxs)("div", { className: `stress-background bg-${kind}`, children: [kind === 'alpine' && (0, jsx_runtime_1.jsx)(scene_js_1.AlpineScene, {}), kind === 'video' && (0, jsx_runtime_1.jsx)(scene_js_1.SyntheticVideo, { playing: true }), kind === 'text' && (0, jsx_runtime_1.jsx)("div", { className: "background-paragraphs", "aria-hidden": "true", children: Array.from({ length: 12 }, (_, i) => (0, jsx_runtime_1.jsx)("p", { children: "\u6E05\u6670\u5148\u4E8E\u900F\u660E\u3002\u754C\u9762\u662F\u5185\u5BB9\u4E0E\u64CD\u4F5C\u7684\u5173\u7CFB\uFF0C\u800C\u4E0D\u662F\u4E00\u5C42\u6EE4\u955C\u3002Keep the content clear. Form follows purpose. 0123456789" }, i)) }), children] });
}
/** Drag the specimen across the background with the pointer; keyboard users can nudge it with arrow keys on the grip. */
function useDraggable(bounds) {
    const [offset, setOffset] = (0, react_1.useState)({ x: 0, y: 0 });
    const [dragging, setDragging] = (0, react_1.useState)(false);
    const start = (0, react_1.useRef)({ x: 0, y: 0, ox: 0, oy: 0 });
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
function MaterialLab() {
    const [material, setMaterial] = (0, react_1.useState)('clear');
    const [tone, setTone] = (0, react_1.useState)('dark');
    const [background, setBackground] = (0, react_1.useState)('alpine');
    const [strength, setStrength] = (0, react_1.useState)(32);
    const [renderer, setRenderer] = (0, react_1.useState)('svg');
    const [radius, setRadius] = (0, react_1.useState)(32);
    const [clicks, setClicks] = (0, react_1.useState)(0);
    const [drift, setDrift] = (0, react_1.useState)(false);
    const preview = (0, react_1.useRef)(null);
    const drag = useDraggable(preview);
    (0, react_1.useEffect)(() => {
        if (!drift)
            return;
        let frame = 0;
        const start = performance.now();
        const tick = (now) => { const t = (now - start) / 1000; preview.current?.style.setProperty('--drift', `${Math.sin(t / 1.8) * 70}px ${Math.cos(t / 2.6) * 30}px`); frame = requestAnimationFrame(tick); };
        frame = requestAnimationFrame(tick);
        return () => { cancelAnimationFrame(frame); preview.current?.style.removeProperty('--drift'); };
    }, [drift]);
    const specimenStyle = { '--offset-x': `${drag.offset.x}px`, '--offset-y': `${drag.offset.y}px` };
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "page-heading", children: [(0, jsx_runtime_1.jsx)("span", { className: "eyebrow", children: "01 / MATERIAL LAB" }), (0, jsx_runtime_1.jsx)("h1", { children: "\u6750\u8D28\uFF0C\u9010\u5C42\u62C6\u89E3\u3002" }), (0, jsx_runtime_1.jsx)("p", { children: "\u5728\u540C\u4E00\u7EC4\u80CC\u666F\u4E2D\u89C2\u5BDF\u6298\u5C04\u3001\u6A21\u7CCA\u4E0E\u53EF\u8BFB\u6027\u3002\u62D6\u52A8\u73BB\u7483\u7A7F\u8FC7\u660E\u6697\u8FB9\u754C\uFF0C\u6309\u4F4F\u6309\u94AE\u611F\u53D7\u56DE\u5F39\u3002\u4E0D\u628A\u6EE4\u955C\u53C2\u6570\u8BEF\u5F53\u4F5C\u8BBE\u8BA1\u7CFB\u7EDF\u3002" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "lab-layout", children: [(0, jsx_runtime_1.jsx)("div", { className: `lab-preview ${drag.dragging ? 'is-dragging' : ''} ${drift ? 'is-drifting' : ''}`, ref: preview, children: (0, jsx_runtime_1.jsxs)(StressBackground, { kind: background, children: [(0, jsx_runtime_1.jsx)("div", { className: "specimen-drift", style: specimenStyle, children: (0, jsx_runtime_1.jsxs)(react_2.GlassSurface, { className: "specimen", material: material, backdropTone: tone, renderer: renderer, radius: radius, refraction: strength, "data-testid": "lab-specimen", ...drag.handlers, children: [(0, jsx_runtime_1.jsxs)("button", { type: "button", className: "specimen-grip", "aria-label": "\u79FB\u52A8\u73BB\u7483\u8BD5\u6837\uFF08\u65B9\u5411\u952E\u5FAE\u8C03\uFF09", onKeyDown: e => {
                                                    const step = e.shiftKey ? 40 : 12;
                                                    if (e.key === 'ArrowLeft') {
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
                                                    }
                                                }, children: [(0, jsx_runtime_1.jsx)("i", {}), (0, jsx_runtime_1.jsx)("i", {}), (0, jsx_runtime_1.jsx)("i", {})] }), (0, jsx_runtime_1.jsx)("span", { className: "specimen-symbol", children: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "layer", size: 28 }) }), (0, jsx_runtime_1.jsx)("span", { className: "specimen-overline", children: "LIQUID / 01" }), (0, jsx_runtime_1.jsx)("h2", { children: "\u6709\u539A\u5EA6\u7684\u8F7B\u76C8\u3002" }), (0, jsx_runtime_1.jsx)("p", { children: "\u6298\u5C04\u7559\u5728\u8FB9\u7F18\uFF0C\u6587\u5B57\u4FDD\u6301\u6E05\u6670\u3002" }), (0, jsx_runtime_1.jsxs)(react_2.GlassButton, { material: material, backdropTone: tone, onClick: () => setClicks(c => c + 1), "data-testid": "specimen-action", children: ["\u89E6\u78B0\u4E00\u4E0B ", (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "arrow", size: 16 })] }), (0, jsx_runtime_1.jsx)("span", { role: "status", className: "specimen-status", children: clicks ? `已响应 ${clicks} 次交互` : '拖动我 · 按住看边缘折射加深' })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "lab-preview-hud", children: [(0, jsx_runtime_1.jsx)("span", { children: drag.offset.x || drag.offset.y ? `Δ ${Math.round(drag.offset.x)}, ${Math.round(drag.offset.y)}` : 'DRAG THE GLASS' }), (drag.offset.x || drag.offset.y) ? (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: drag.reset, children: "\u5F52\u4F4D" }) : null] })] }) }), (0, jsx_runtime_1.jsxs)("aside", { className: "inspector", "aria-label": "\u6750\u8D28\u63A7\u5236\u9762\u677F", children: [(0, jsx_runtime_1.jsxs)("div", { className: "inspector-title", children: [(0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "tune", size: 17 }), (0, jsx_runtime_1.jsx)("h2", { children: "\u6750\u8D28\u53C2\u6570" }), (0, jsx_runtime_1.jsx)("span", { children: "LIVE" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "inspector-field", children: [(0, jsx_runtime_1.jsx)("span", { className: "field-label", children: "\u6E32\u67D3\u5668" }), (0, jsx_runtime_1.jsx)(react_2.GlassSegmentedControl, { "aria-label": "\u6E32\u67D3\u5668", density: "compact", value: renderer, onValueChange: v => setRenderer(v), items: [{ value: 'css', label: 'CSS' }, { value: 'svg', label: 'SVG' }, { value: 'auto', label: 'Auto' }] }), (0, jsx_runtime_1.jsx)("p", { className: "field-hint", children: renderer === 'css' ? '模糊 / 底色 / 高光基线' : renderer === 'svg' ? '几何位移图折射边缘' : 'Auto 默认保守 CSS' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "inspector-field", children: [(0, jsx_runtime_1.jsx)("span", { className: "field-label", children: "\u6750\u8D28\u9884\u8BBE" }), (0, jsx_runtime_1.jsx)(react_2.GlassSegmentedControl, { "aria-label": "\u6750\u8D28\u9884\u8BBE", density: "compact", value: material, onValueChange: v => setMaterial(v), items: [{ value: 'regular', label: 'Regular' }, { value: 'clear', label: 'Clear' }] }), (0, jsx_runtime_1.jsx)("p", { className: "field-hint", children: material === 'regular' ? '可读优先，适合文字较多' : '受控媒体场景，更透明' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "inspector-field", children: [(0, jsx_runtime_1.jsx)("span", { className: "field-label", children: "\u80CC\u666F\u4E0A\u4E0B\u6587" }), (0, jsx_runtime_1.jsx)(react_2.GlassSegmentedControl, { "aria-label": "\u80CC\u666F\u4E0A\u4E0B\u6587", density: "compact", value: tone, onValueChange: v => setTone(v), items: [{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }, { value: 'mixed', label: 'Mixed' }] }), (0, jsx_runtime_1.jsx)("p", { className: "field-hint", children: tone === 'dark' ? '已知暗背景' : tone === 'light' ? '亮背景，叠加暗化层' : '未知背景，回退 Regular' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "inspector-field", children: [(0, jsx_runtime_1.jsxs)("div", { className: "field-heading", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u6298\u5C04\u5E45\u5EA6" }), (0, jsx_runtime_1.jsxs)("output", { children: [strength, " px"] })] }), (0, jsx_runtime_1.jsx)(react_2.GlassSlider, { "aria-label": "\u6298\u5C04\u5E45\u5EA6", min: 0, max: 64, value: strength, onValueChange: setStrength, formatValue: v => `${v} px` })] }), (0, jsx_runtime_1.jsxs)("div", { className: "inspector-field", children: [(0, jsx_runtime_1.jsxs)("div", { className: "field-heading", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u51E0\u4F55\u5706\u89D2" }), (0, jsx_runtime_1.jsxs)("output", { children: [radius, " px"] })] }), (0, jsx_runtime_1.jsx)(react_2.GlassSlider, { "aria-label": "\u51E0\u4F55\u5706\u89D2", min: 8, max: 80, value: radius, onValueChange: setRadius })] }), (0, jsx_runtime_1.jsx)("div", { className: "inspector-switch", children: (0, jsx_runtime_1.jsx)(react_2.GlassSwitch, { "aria-label": "\u80CC\u666F\u6F02\u79FB", checked: drift, onCheckedChange: setDrift, label: "\u8BA9\u80CC\u666F\u6F02\u79FB" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "inspector-note", children: [(0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "info", size: 16 }), (0, jsx_runtime_1.jsx)("p", { children: "Clear + Mixed \u4F1A\u56DE\u9000\u4E3A Regular\u3002\u51CF\u5C11\u900F\u660E\u5EA6\u8BBE\u7F6E\u4F18\u5148\u4E8E\u6548\u679C\u9009\u9879\u3002" })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "background-selector", role: "group", "aria-label": "\u6D4B\u8BD5\u80CC\u666F", children: exports.backgrounds.map(([value, label]) => (0, jsx_runtime_1.jsxs)("button", { type: "button", className: background === value ? 'is-active' : '', "aria-pressed": background === value, onClick: () => setBackground(value), children: [(0, jsx_runtime_1.jsx)("span", { className: `swatch bg-${value}` }), label] }, value)) }), (0, jsx_runtime_1.jsxs)("section", { className: "section-block", children: [(0, jsx_runtime_1.jsxs)("div", { className: "section-title", children: [(0, jsx_runtime_1.jsx)("h2", { children: "\u4E09\u6761\u8DEF\u5F84\uFF0C\u540C\u4E00\u4E2A\u573A\u666F\u3002" }), (0, jsx_runtime_1.jsx)("span", { children: "CSS / SVG / OPAQUE" })] }), (0, jsx_runtime_1.jsx)("div", { className: "comparison-grid", children: ['css', 'svg', 'opaque'].map(mode => (0, jsx_runtime_1.jsxs)("div", { className: "comparison-card", children: [(0, jsx_runtime_1.jsx)(StressBackground, { kind: background === 'video' ? 'grid' : background, children: (0, jsx_runtime_1.jsx)(react_2.GlassProvider, { transparency: mode === 'opaque' ? 'opaque' : 'system', children: (0, jsx_runtime_1.jsxs)(react_2.GlassSurface, { renderer: mode === 'opaque' ? 'css' : mode, material: "clear", backdropTone: "dark", radius: 28, className: "comparison-specimen", children: [(0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "layer", size: 25 }), (0, jsx_runtime_1.jsx)("strong", { children: "Liquid Glass" }), (0, jsx_runtime_1.jsx)("span", { children: "\u8FB9\u7F18\u3001\u5E95\u8272\u3001\u771F\u5B9E\u6587\u5B57" }), (0, jsx_runtime_1.jsx)(react_2.GlassButton, { density: "compact", children: "\u6309\u4F4F\u8BD5\u8BD5" })] }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "comparison-caption", children: [(0, jsx_runtime_1.jsx)("strong", { children: mode === 'css' ? 'CSS 基线' : mode === 'svg' ? 'SVG 增强' : '不透明回退' }), (0, jsx_runtime_1.jsx)("span", { children: mode === 'svg' ? '背景位移 · 前景不变' : mode === 'css' ? '模糊 / 底色 / 高光' : '优先保障稳定可读' })] })] }, mode)) }), (0, jsx_runtime_1.jsx)("p", { className: "section-note", children: "\u8FD9\u91CC\u6BD4\u8F83\u672C\u9879\u76EE\u4E09\u79CD\u8DEF\u5F84\u3002rdev\u3001Liqui Design \u7684\u7B2C\u4E09\u65B9\u5B9E\u6D4B\u5C1A\u672A\u5B8C\u6210\uFF0C\u8BE6\u89C1 docs/competitor-evaluation.md\uFF1B\u6CA1\u6709\u7528\u6A21\u62DF\u6548\u679C\u5192\u5145\u7ADE\u54C1\u3002" })] }), (0, jsx_runtime_1.jsxs)("section", { className: "code-card", children: [(0, jsx_runtime_1.jsx)("span", { className: "eyebrow", children: "CURRENT CONFIGURATION" }), (0, jsx_runtime_1.jsx)(code_block_js_1.CodeBlock, { code: `<GlassSurface\n  material="${material}"\n  backdropTone="${tone}"\n  renderer="${renderer}"\n  radius={${radius}}\n  refraction={${strength}}\n>\n  <h2>有厚度的轻盈。</h2>\n</GlassSurface>` })] })] });
}

},
"app/main.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = require("react-dom/client");
const app_js_1 = require("./app.js");
const container = document.getElementById('root');
if (!container)
    throw new Error('Missing #root container');
(0, client_1.createRoot)(container).render((0, jsx_runtime_1.jsx)(react_1.StrictMode, { children: (0, jsx_runtime_1.jsx)(app_js_1.App, {}) }));

},
"app/media-viewer.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaViewer = MediaViewer;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@liquid-glass-ui/react");
const icons_js_1 = require("./icons.js");
const scene_js_1 = require("./scene.js");
function MediaViewer({ compact = false }) {
    const [playing, setPlaying] = (0, react_1.useState)(false);
    const [favorite, setFavorite] = (0, react_1.useState)(false);
    const [scene, setScene] = (0, react_1.useState)(0);
    const [zoom, setZoom] = (0, react_1.useState)(false);
    const [volume, setVolume] = (0, react_1.useState)(65);
    const [exportOpen, setExportOpen] = (0, react_1.useState)(false);
    const [status, setStatus] = (0, react_1.useState)('');
    const [fileName, setFileName] = (0, react_1.useState)('alpine-study');
    const [view, setView] = (0, react_1.useState)('fit');
    const canvas = (0, react_1.useRef)(null);
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
    return (0, jsx_runtime_1.jsxs)("div", { className: `media-viewer ${compact ? 'is-compact' : ''}`, "data-testid": "media-viewer", children: [(0, jsx_runtime_1.jsx)("div", { className: `scene-art ${zoom || view === 'fill' ? 'is-zoomed' : ''}`, ref: canvas, children: (0, jsx_runtime_1.jsx)(scene_js_1.AlpineScene, { warm: scene % 2 === 1 }) }), (0, jsx_runtime_1.jsx)(scene_js_1.SyntheticVideo, { playing: playing }), (0, jsx_runtime_1.jsxs)("div", { className: "media-topline", children: [(0, jsx_runtime_1.jsxs)("span", { className: "scene-identity", children: [(0, jsx_runtime_1.jsx)("span", { className: "scene-dot" }), " FIELD NOTES ", (0, jsx_runtime_1.jsx)("span", { className: "muted-divider", children: "/" }), " 0", scene % 2 + 1] }), (0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { material: "clear", backdropTone: "light", "aria-label": zoom ? '还原场景大小' : '放大场景', onClick: () => setZoom(!zoom), children: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: zoom ? 'shrink' : 'expand' }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "scene-caption", children: [(0, jsx_runtime_1.jsx)("span", { className: "eyebrow", children: "A STUDY IN STILLNESS" }), (0, jsx_runtime_1.jsx)("h2", { children: scene % 2 ? '暮色，留在湖面。' : '山间，有回响。' }), (0, jsx_runtime_1.jsx)("p", { children: "\u539F\u521B\u77E2\u91CF\u573A\u666F \u00B7 \u65E0\u5916\u90E8\u56FE\u7247\u4F9D\u8D56" })] }), (0, jsx_runtime_1.jsx)("div", { className: "media-control-wrap", children: (0, jsx_runtime_1.jsxs)(react_2.GlassToolbar, { "aria-label": "\u5A92\u4F53\u67E5\u770B\u5668\u64CD\u4F5C", className: "media-toolbar", children: [(0, jsx_runtime_1.jsxs)(react_2.ToolbarGroup, { material: "clear", backdropTone: "dark", density: compact ? 'compact' : 'comfortable', children: [(0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { "aria-label": "\u4E0A\u4E00\u573A\u666F", onClick: () => { setScene(x => x + 1); setPlaying(false); }, children: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "previous" }) }), (0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { "aria-label": playing ? '暂停动态背景' : '播放动态背景', "aria-pressed": playing, onClick: () => setPlaying(!playing), children: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: playing ? 'pause' : 'play' }) }), (0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { "aria-label": "\u4E0B\u4E00\u573A\u666F", onClick: () => { setScene(x => x + 1); setPlaying(false); }, children: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "next" }) })] }), (0, jsx_runtime_1.jsx)(react_2.ToolbarSpacer, {}), (0, jsx_runtime_1.jsxs)(react_2.ToolbarGroup, { material: "clear", backdropTone: "dark", density: compact ? 'compact' : 'comfortable', children: [(0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { "aria-label": favorite ? '取消收藏' : '收藏场景', "aria-pressed": favorite, onClick: () => setFavorite(!favorite), children: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "heart", style: favorite ? { fill: 'currentColor' } : undefined }) }), (0, jsx_runtime_1.jsxs)(react_2.GlassPopover, { title: "\u67E5\u770B\u8BBE\u7F6E", description: "\u73BB\u7483\u627F\u8F7D\u64CD\u4F5C\uFF0C\u5185\u5BB9\u4FDD\u6301\u6E05\u6670\u3002", trigger: (0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { "aria-label": "\u6253\u5F00\u67E5\u770B\u8BBE\u7F6E", children: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "tune" }) }), children: [(0, jsx_runtime_1.jsx)("label", { className: "field-label", children: "\u663E\u793A\u65B9\u5F0F" }), (0, jsx_runtime_1.jsx)(react_2.GlassSegmentedControl, { "aria-label": "\u663E\u793A\u65B9\u5F0F", value: view, onValueChange: setView, density: "compact", items: [{ value: 'fit', label: '适应' }, { value: 'fill', label: '填充' }] }), (0, jsx_runtime_1.jsxs)("div", { className: "field-heading", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u97F3\u91CF\uFF08\u754C\u9762\u6F14\u793A\uFF09" }), (0, jsx_runtime_1.jsxs)("output", { children: [volume, "%"] })] }), (0, jsx_runtime_1.jsx)(react_2.GlassSlider, { "aria-label": "\u97F3\u91CF", value: volume, onValueChange: setVolume, formatValue: v => `${v}%` }), (0, jsx_runtime_1.jsx)("p", { className: "micro-note", children: "\u52A8\u6001\u80CC\u666F\u662F\u672C\u5730\u5408\u6210\u89C6\u9891\uFF0C\u65E0\u97F3\u8F68\u3002" })] }), (0, jsx_runtime_1.jsx)(react_2.GlassMenu, { "aria-label": "\u5A92\u4F53\u66F4\u591A\u64CD\u4F5C", trigger: (0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { "aria-label": "\u66F4\u591A\u5A92\u4F53\u64CD\u4F5C", children: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "more" }) }), items: [
                                        { key: 'export', label: '导出原创场景', onSelect: () => setExportOpen(true) },
                                        { key: 'favorite', label: favorite ? '取消收藏' : '收藏此场景', onSelect: () => setFavorite(!favorite) },
                                        { key: 'reset', label: '重置查看器', separatorBefore: true, onSelect: () => { setScene(0); setZoom(false); setPlaying(false); setFavorite(false); setStatus('查看器已重置'); } },
                                    ] })] })] }) }), (0, jsx_runtime_1.jsx)("span", { className: "media-footnote", children: playing ? 'LIVE · 合成视频测试' : '1200 × 720 · VECTOR' }), (0, jsx_runtime_1.jsx)("span", { role: "status", className: "sr-only", children: status }), (0, jsx_runtime_1.jsx)(react_2.GlassDialog, { title: "\u5BFC\u51FA\u8FD9\u4E00\u523B", description: "\u5BFC\u51FA\u7684\u662F\u9879\u76EE\u9644\u5E26\u7684\u539F\u521B SVG \u573A\u666F\uFF0C\u53EF\u7EE7\u7EED\u7F16\u8F91\u6216\u7528\u4E8E\u6D4B\u8BD5\u80CC\u666F\u3002", open: exportOpen, onOpenChange: setExportOpen, children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: event => { event.preventDefault(); download(); }, children: [(0, jsx_runtime_1.jsx)("label", { className: "field-label", htmlFor: "export-name", children: "\u6587\u4EF6\u540D\u79F0" }), (0, jsx_runtime_1.jsx)("input", { id: "export-name", className: "text-input", value: fileName, onChange: event => setFileName(event.target.value) }), (0, jsx_runtime_1.jsx)("p", { className: "micro-note", children: "\u683C\u5F0F\uFF1ASVG \u00B7 \u65E0\u9700\u7F51\u7EDC \u00B7 \u4E0D\u5305\u542B\u5DE5\u5177\u680F" }), (0, jsx_runtime_1.jsxs)("div", { className: "dialog-actions", children: [(0, jsx_runtime_1.jsx)(react_2.GlassButton, { onClick: () => setExportOpen(false), children: "\u53D6\u6D88" }), (0, jsx_runtime_1.jsxs)(react_2.GlassButton, { type: "submit", variant: "glassProminent", children: [(0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "download", size: 16 }), "\u5BFC\u51FA SVG"] })] })] }) })] });
}

},
"app/pages/component-page.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentPage = ComponentPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@liquid-glass-ui/react");
const demo_js_1 = require("../site/demo.js");
const code_block_js_1 = require("../site/code-block.js");
const props_table_js_1 = require("../site/props-table.js");
const page_js_1 = require("../site/page.js");
/**
 * One renderer for every component page. The pages are data, not thirty near-identical
 * files — which also means the sections cannot quietly drift apart from each other.
 */
function ComponentPage({ doc }) {
    const Example = doc.example;
    return (0, jsx_runtime_1.jsxs)(page_js_1.Page, { eyebrow: doc.group, title: doc.name, lede: doc.summary, children: [doc.rule && (0, jsx_runtime_1.jsxs)(react_1.Card, { fill: "secondary", radius: 20, padding: 16, className: "doc-rule", children: [(0, jsx_runtime_1.jsx)(react_1.Text, { variant: "footnote", emphasized: true, tone: "accent", children: "\u8BBE\u8BA1\u89C4\u5219" }), (0, jsx_runtime_1.jsx)(react_1.Text, { variant: "subhead", style: { marginBlockStart: 6 }, children: doc.rule })] }), (0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u793A\u4F8B", children: (0, jsx_runtime_1.jsx)(demo_js_1.Demo, { backdrop: doc.backdrop, height: doc.demoHeight, label: `${doc.name} · 实时示例`, children: (0, jsx_runtime_1.jsx)(Example, {}) }) }), (0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u7528\u6CD5", children: (0, jsx_runtime_1.jsx)(code_block_js_1.CodeBlock, { code: doc.code }) }), (0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u5C5E\u6027", children: (0, jsx_runtime_1.jsx)(props_table_js_1.PropsTable, { rows: doc.props }) }), (0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u65E0\u969C\u788D\u4E0E\u952E\u76D8", children: (0, jsx_runtime_1.jsx)("ul", { className: "doc-a11y", children: doc.a11y.map(item => (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(react_1.Text, { as: "span", variant: "subhead", children: item }) }, item)) }) }), (0, jsx_runtime_1.jsx)(react_1.Divider, { style: { marginBlock: 24 } }), (0, jsx_runtime_1.jsxs)(react_1.Text, { variant: "footnote", tone: "tertiary", children: ["\u672C\u7EC4\u4EF6\u5C5E\u4E8E", doc.group, "\u3002\u73BB\u7483\u53EA\u7528\u4E8E\u6D6E\u52A8\u7684\u64CD\u4F5C\u4E0E\u5BFC\u822A\u5C42\uFF1B\u5185\u5BB9\u5C42\u4F7F\u7528\u5B9E\u8272\u6216\u6807\u51C6\u6750\u8D28\u3002"] })] });
}

},
"app/pages/components-index.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentsIndex = ComponentsIndex;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@liquid-glass-ui/react");
const page_js_1 = require("../site/page.js");
const index_js_1 = require("../catalog/index.js");
function ComponentsIndex({ go }) {
    return (0, jsx_runtime_1.jsx)(page_js_1.Page, { eyebrow: "\u7EC4\u4EF6", title: "\u7EC4\u4EF6\u76EE\u5F55", lede: `${index_js_1.componentDocs.length} 个组件，按所属的层分组。内容层在前，浮动的操作与导航层在后——这个顺序本身就是规则的一部分。`, children: (0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u6309\u5C42\u6D4F\u89C8", children: (0, jsx_runtime_1.jsx)("div", { className: "catalog-groups", children: index_js_1.groupedDocs.map(({ group, docs }) => (0, jsx_runtime_1.jsxs)(react_1.Card, { radius: 20, padding: 0, className: "catalog-card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "catalog-card-head", children: [(0, jsx_runtime_1.jsx)(react_1.Text, { as: "h3", variant: "headline", children: group }), (0, jsx_runtime_1.jsxs)(react_1.Text, { variant: "caption1", tone: "tertiary", children: [docs.length, " \u4E2A"] })] }), (0, jsx_runtime_1.jsx)(react_1.List, { variant: "plain", children: (0, jsx_runtime_1.jsx)(react_1.ListSection, { children: docs.map(doc => (0, jsx_runtime_1.jsx)(react_1.ListRow, { label: doc.name, secondaryLabel: doc.summary, onSelect: () => go(`components/${doc.slug}`) }, doc.slug)) }) })] }, group)) }) }) });
}

},
"app/pages/foundations.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialsFoundation = MaterialsFoundation;
exports.ColorFoundation = ColorFoundation;
exports.TypographyFoundation = TypographyFoundation;
exports.LayoutFoundation = LayoutFoundation;
exports.MotionFoundation = MotionFoundation;
exports.AccessibilityFoundation = AccessibilityFoundation;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@liquid-glass-ui/react");
const page_js_1 = require("../site/page.js");
const demo_js_1 = require("../site/demo.js");
const code_block_js_1 = require("../site/code-block.js");
const SYSTEM_COLORS = ['red', 'orange', 'yellow', 'green', 'mint', 'teal', 'cyan', 'blue', 'indigo', 'purple', 'pink', 'brown'];
const SEMANTIC = [
    ['--lg-label', '主要文字'], ['--lg-label-secondary', '次要文字'], ['--lg-label-tertiary', '第三级文字'],
    ['--lg-separator', '分隔线'], ['--lg-fill', '填充'], ['--lg-bg-grouped-2', '分组背景'],
];
const TEXT_STYLES = [
    ['largeTitle', 34, 41], ['title1', 28, 34], ['title2', 22, 28], ['title3', 20, 25],
    ['headline', 17, 22], ['body', 17, 22], ['callout', 16, 21], ['subhead', 15, 20],
    ['footnote', 13, 18], ['caption1', 12, 16], ['caption2', 11, 13],
];
function MaterialsFoundation() {
    return (0, jsx_runtime_1.jsxs)(page_js_1.Page, { eyebrow: "\u57FA\u7840", title: "\u6750\u8D28", lede: "Liquid Glass \u662F\u4E00\u79CD\u4F1A\u5F2F\u6298\u5149\u7EBF\u7684\u6750\u8D28\uFF0C\u6784\u6210\u6D6E\u5728\u5185\u5BB9\u4E4B\u4E0A\u7684\u64CD\u4F5C\u4E0E\u5BFC\u822A\u5C42\u3002\u5B83\u4ECE\u80CC\u540E\u53D6\u8272\uFF0C\u81EA\u5DF1\u6CA1\u6709\u989C\u8272\u3002", children: [(0, jsx_runtime_1.jsx)(page_js_1.Rule, { children: "\u73BB\u7483\u53EA\u5C5E\u4E8E\u5BFC\u822A\u4E0E\u64CD\u4F5C\u5C42\uFF0C\u7EDD\u4E0D\u8FDB\u5165\u5185\u5BB9\u5C42\uFF0C\u7EDD\u4E0D\u73BB\u7483\u53E0\u73BB\u7483\uFF0C\u4E5F\u4E0D\u8981\u5230\u5904\u90FD\u662F\u3002\u9ED8\u8BA4\u7528 Regular\uFF1BClear \u53EA\u7528\u4E8E\u5A92\u4F53\u80CC\u666F\uFF0C\u4E14\u8981\u914D\u4E00\u5C42\u53D8\u6697\u3002\u4E24\u8005\u4E0D\u5728\u540C\u4E00\u754C\u9762\u91CC\u6DF7\u7528\u3002" }), (0, jsx_runtime_1.jsxs)(page_js_1.Section, { title: "\u5C0F\u73BB\u7483\u4E0E\u5927\u73BB\u7483", description: "\u5C3A\u5BF8\u4F1A\u6539\u53D8\u6750\u8D28\u672C\u8EAB\u7684\u884C\u4E3A\uFF0C\u8FD9\u4E0D\u662F\u540C\u4E00\u4E2A\u6548\u679C\u7684\u4E24\u79CD\u5927\u5C0F\u3002", children: [(0, jsx_runtime_1.jsx)(demo_js_1.Demo, { backdrop: "both", height: 240, label: "\u5C0F\u73BB\u7483\u968F\u80CC\u666F\u7FFB\u8F6C\uFF0C\u5927\u73BB\u7483\u4E0D\u7FFB\u8F6C", children: (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: 16, justifyItems: 'center' }, children: [(0, jsx_runtime_1.jsx)(react_1.GlassButton, { children: "\u5C0F\u73BB\u7483 \u00B7 \u968F\u80CC\u666F\u7FFB\u8F6C\u660E\u6697" }), (0, jsx_runtime_1.jsxs)(react_1.GlassSurface, { size: "large", radius: 20, style: { width: 260, padding: 16 }, children: [(0, jsx_runtime_1.jsx)(react_1.Text, { variant: "subhead", emphasized: true, children: "\u5927\u73BB\u7483" }), (0, jsx_runtime_1.jsx)(react_1.Text, { variant: "caption1", tone: "secondary", children: "\u66F4\u539A\u3001\u66F4\u4E0D\u900F\u660E\u3001\u9634\u5F71\u66F4\u6DF1\uFF0C\u5E76\u4E14\u4E0D\u968F\u5185\u5BB9\u7FFB\u8F6C\u2014\u2014\u90A3\u4E48\u5927\u7684\u8868\u9762\u7FFB\u6765\u7FFB\u53BB\u4F1A\u6CA1\u6CD5\u8BFB\u3002" })] })] }) }), (0, jsx_runtime_1.jsx)(code_block_js_1.CodeBlock, { code: `<GlassButton>小玻璃</GlassButton>
<GlassSurface size="large" radius={20}>大玻璃</GlassSurface>` })] }), (0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u5149\u662F\u88AB\u6298\u5C04\u7684\uFF0C\u4E0D\u662F\u753B\u4E0A\u53BB\u7684", description: "\u6750\u8D28\u7531\u6298\u5C04\u52A0\u4E00\u6761\u7CBE\u786E\u7684\u53D1\u4E1D\u8FB9\u5B9A\u4E49\uFF0C\u5185\u90E8\u4FDD\u6301\u5E72\u51C0\u3002\u6574\u9762\u626B\u8FC7\u7684\u6E10\u53D8\u3001\u7B2C\u4E8C\u5C42\u659C\u9762\u3001\u8FC7\u7C97\u7684\u4EAE\u63CF\u8FB9\uFF0C\u4F1A\u628A\u5B83\u53D8\u6210 2008 \u5E74\u7684\u5149\u6CFD\u5851\u6599\u6309\u94AE\u2014\u2014\u800C\u4E14\u5728\u7EAF\u8272\u80CC\u666F\u4E0A\u6700\u96BE\u770B\uFF0C\u56E0\u4E3A\u90A3\u91CC\u6839\u672C\u6CA1\u6709\u4E1C\u897F\u53EF\u6298\u5C04\u3002", children: (0, jsx_runtime_1.jsx)(demo_js_1.Demo, { height: 200, label: "\u6307\u9488\u9A71\u52A8\u7684\u884C\u8FDB\u9AD8\u5149", children: (0, jsx_runtime_1.jsx)(react_1.GlassButton, { controlSize: "large", children: "\u628A\u6307\u9488\u79FB\u8FC7\u6765\uFF0C\u770B\u9AD8\u5149\u7ED5\u8F6E\u5ED3\u8D70" }) }) }), (0, jsx_runtime_1.jsxs)(page_js_1.Section, { title: "\u80CC\u666F\u8272\u8C03\u662F\u58F0\u660E\u7684\uFF0C\u4E0D\u662F\u91C7\u6837\u7684", children: [(0, jsx_runtime_1.jsx)(react_1.Text, { variant: "subhead", tone: "secondary", children: "\u5C0F\u73BB\u7483\u9700\u8981\u77E5\u9053\u80CC\u540E\u662F\u6DF1\u662F\u6D45\u624D\u80FD\u7FFB\u8F6C\u3002\u8FD9\u4E2A\u5E93\u4E0D\u53BB\u8BFB\u53D6\u9875\u9762\u50CF\u7D20\u2014\u2014\u90A3\u610F\u5473\u7740 DOM \u622A\u5C4F\u548C\u8DE8\u6E90\u50CF\u7D20\u8BFB\u53D6\u3002\u6539\u4E3A\u7531\u533A\u57DF\u663E\u5F0F\u58F0\u660E\uFF0C\u5185\u90E8\u7684\u73BB\u7483\u7EE7\u627F\u5B83\u3002" }), (0, jsx_runtime_1.jsx)(code_block_js_1.CodeBlock, { code: `<GlassBackdrop tone="dark">
  <video … />
  <GlassToolbar aria-label="播放控制">…</GlassToolbar>
</GlassBackdrop>` })] })] });
}
function ColorFoundation() {
    return (0, jsx_runtime_1.jsxs)(page_js_1.Page, { eyebrow: "\u57FA\u7840", title: "\u8272\u5F69", lede: "\u7CFB\u7EDF\u8272\u52A0\u8BED\u4E49\u8272\u9636\u3002accent \u53EA\u6709\u4E00\u4E2A\uFF0C\u7559\u7ED9\u4E3B\u64CD\u4F5C\u4E0E\u9009\u4E2D\u6001\uFF1B\u54C1\u724C\u8272\u653E\u5728\u5185\u5BB9\u5C42\u3002", children: [(0, jsx_runtime_1.jsx)(page_js_1.Rule, { children: "\u975E\u6E38\u620F\u7C7B\u5E94\u7528\u8981\u514B\u5236\u7528\u8272\uFF1A\u989C\u8272\u652F\u6301\u6C9F\u901A\uFF0C\u800C\u4E0D\u662F\u88C5\u9970\u3002\u4E0D\u8981\u7528\u540C\u4E00\u4E2A\u989C\u8272\u540C\u65F6\u8868\u793A\u53EF\u4EA4\u4E92\u548C\u4E0D\u53EF\u4EA4\u4E92\u7684\u5143\u7D20\uFF0C\u4E5F\u4E0D\u8981\u8BA9\u989C\u8272\u6210\u4E3A\u552F\u4E00\u7684\u4FE1\u606F\u8F7D\u4F53\u3002" }), (0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u7CFB\u7EDF\u8272", description: "\u6BCF\u4E2A\u90FD\u6709\u6D45\u8272\u3001\u6DF1\u8272\u4E0E\u589E\u5F3A\u5BF9\u6BD4\u5EA6\u4E09\u5957\u53D6\u503C\u3002", children: (0, jsx_runtime_1.jsx)("div", { className: "swatch-grid", children: SYSTEM_COLORS.map(name => (0, jsx_runtime_1.jsxs)("div", { className: "swatch-cell", children: [(0, jsx_runtime_1.jsx)("span", { className: "swatch-chip", style: { background: `var(--lg-${name})` } }), (0, jsx_runtime_1.jsx)(react_1.Text, { variant: "caption1", tone: "secondary", children: name })] }, name)) }) }), (0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u8BED\u4E49\u8272", description: "\u6C38\u8FDC\u7528\u8BED\u4E49 token\uFF0C\u4E0D\u8981\u5199\u6B7B\u7070\u5EA6\u503C\uFF0C\u4E5F\u4E0D\u8981\u6539\u53D8\u4E00\u4E2A\u8BED\u4E49\u8272\u7684\u542B\u4E49\u3002", children: (0, jsx_runtime_1.jsx)(react_1.Card, { fill: "secondary", radius: 20, padding: 16, children: (0, jsx_runtime_1.jsx)("ul", { className: "plain-list", children: SEMANTIC.map(([token, label]) => (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: [(0, jsx_runtime_1.jsx)("code", { children: token }), " \u2014 ", label] }) }, token)) }) }) }), (0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u73BB\u7483\u4E0A\u7684\u8272\u5F69", description: "\u73BB\u7483\u6CA1\u6709\u56FA\u6709\u989C\u8272\u3002\u7740\u8272\u53EA\u52A0\u5728\u552F\u4E00\u90A3\u4E2A\u4E3B\u64CD\u4F5C\u7684\u80CC\u666F\u4E0A\uFF0C\u6807\u7B7E\u4FDD\u6301\u767D\u8272\uFF1B\u680F\u4E0A\u7684\u7B26\u53F7\u4E0E\u6587\u5B57\u9ED8\u8BA4\u5355\u8272\u3002", children: (0, jsx_runtime_1.jsx)(demo_js_1.Demo, { backdrop: "both", height: 180, children: (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }, children: [(0, jsx_runtime_1.jsx)(react_1.GlassButton, { children: "\u53D6\u6D88" }), (0, jsx_runtime_1.jsx)(react_1.GlassButton, { children: "\u5B58\u50A8\u526F\u672C" }), (0, jsx_runtime_1.jsx)(react_1.GlassButton, { variant: "glassProminent", children: "\u5B8C\u6210" })] }) }) })] });
}
function TypographyFoundation() {
    return (0, jsx_runtime_1.jsxs)(page_js_1.Page, { eyebrow: "\u57FA\u7840", title: "\u6392\u7248", lede: "iOS \u6587\u672C\u6837\u5F0F\uFF1A\u5B57\u53F7\u3001\u884C\u9AD8\u4E0E\u5B57\u8DDD\u4E00\u8D77\u7531\u6837\u5F0F\u51B3\u5B9A\uFF0C\u5E76\u968F Dynamic Type \u7F29\u653E\u3002", children: [(0, jsx_runtime_1.jsx)(page_js_1.Rule, { children: "\u7528\u5185\u5EFA\u6587\u672C\u6837\u5F0F\u5EFA\u7ACB\u5C42\u7EA7\uFF0C\u9760\u5B57\u91CD\u3001\u5B57\u53F7\u4E0E\u989C\u8272\u533A\u5206\uFF0C\u800C\u4E0D\u662F\u9760\u88C5\u9970\u300211pt \u662F\u53EF\u8BFB\u6587\u672C\u7684\u4E0B\u9650\u3002\u5206\u533A\u6807\u9898\u4F7F\u7528\u6807\u9898\u5F0F\u5927\u5C0F\u5199\uFF0C\u4E0D\u518D\u7528\u5168\u5927\u5199\u3002" }), (0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u6587\u672C\u6837\u5F0F\u8868", description: "\u7528\u53F3\u4E0A\u89D2\u7684\u663E\u793A\u504F\u597D\u628A\u6587\u5B57\u5927\u5C0F\u5207\u5230 AX3\uFF0C\u68C0\u67E5\u8FD9\u4E00\u9875\u662F\u5426\u8FD8\u80FD\u6B63\u5E38\u56DE\u6D41\u3002", children: (0, jsx_runtime_1.jsx)(react_1.Card, { radius: 20, padding: 20, children: (0, jsx_runtime_1.jsx)("div", { className: "type-specimens", children: TEXT_STYLES.map(([style, size, leading]) => (0, jsx_runtime_1.jsxs)("div", { className: "type-row", children: [(0, jsx_runtime_1.jsx)(react_1.Text, { as: "span", variant: style, className: "type-sample", children: style }), (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "caption1", tone: "tertiary", tabular: true, children: [size, " / ", leading] })] }, style)) }) }) }), (0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u4E24\u4E2A Web \u7AEF\u7684\u786C\u7EA6\u675F", children: (0, jsx_runtime_1.jsx)(react_1.Card, { fill: "secondary", radius: 20, padding: 20, children: (0, jsx_runtime_1.jsxs)("ul", { className: "plain-list", children: [(0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: ["SF \u5B57\u4F53\u4E0D\u80FD\u81EA\u6258\u7BA1\u5230\u7F51\u9875\u4E0A\uFF0C\u8BB8\u53EF\u53EA\u8986\u76D6 Apple \u5E73\u53F0\u5E94\u7528\u3002", (0, jsx_runtime_1.jsx)("code", { children: "-apple-system" }), " \u53EA\u5728 Apple \u8BBE\u5907\u4E0A\u89E3\u6790\u4E3A SF\uFF0C\u5176\u4ED6\u5E73\u53F0\u4F1A\u843D\u5230 Segoe UI / Roboto\uFF0C\u5B57\u5F62\u5EA6\u91CF\u4E0D\u540C\u2014\u2014\u6240\u4EE5\u5B57\u53F7\u7528 px \u5B9A\u6B7B\uFF0C\u5E76\u5728 Windows / Android \u4E0A\u590D\u6838\u884C\u957F\u3002"] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(react_1.Text, { as: "span", variant: "subhead", children: "\u8D1F\u5B57\u8DDD\u662F\u4E3A\u62C9\u4E01\u6587\u8BBE\u8BA1\u7684\u3002CJK \u8BED\u5883\u4E0B\u7EC4\u4EF6\u4F1A\u81EA\u52A8\u5173\u95ED\u5B83\u3002" }) })] }) }) })] });
}
function LayoutFoundation() {
    return (0, jsx_runtime_1.jsxs)(page_js_1.Page, { eyebrow: "\u57FA\u7840", title: "\u5E03\u5C40\u4E0E\u5F62\u72B6", lede: "4pt \u6805\u683C\u300144pt \u547D\u4E2D\u533A\uFF0C\u4EE5\u53CA\u4E09\u7C7B\u5F62\u72B6\uFF1A\u56FA\u5B9A\u3001\u80F6\u56CA\u3001\u540C\u5FC3\u3002", children: [(0, jsx_runtime_1.jsx)(page_js_1.Rule, { children: "\u5D4C\u5957\u5728\u5706\u89D2\u5BB9\u5668\u91CC\u7684\u5F62\u72B6\u5FC5\u987B\u540C\u5FC3\uFF1A\u5185\u5706\u89D2 = \u5BB9\u5668\u5706\u89D2 \u2212 \u4E24\u8005\u4E4B\u95F4\u7684\u5185\u8FB9\u8DDD\u3002\u5185\u5706\u89D2\u8FC7\u5927\u4F1A\u201C\u6390\u89D2\u201D\uFF0C\u8FC7\u5C0F\u4F1A\u201C\u5587\u53ED\u53E3\u201D\u3002\u4E5F\u4F1A\u540C\u65F6\u72EC\u7ACB\u51FA\u73B0\u7684\u7EC4\u4EF6\u8981\u7ED9\u4E00\u4E2A\u515C\u5E95\u6700\u5C0F\u5706\u89D2\u3002" }), (0, jsx_runtime_1.jsxs)(page_js_1.Section, { title: "\u540C\u5FC3\u5706\u89D2", children: [(0, jsx_runtime_1.jsx)(demo_js_1.Demo, { height: 240, children: (0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }, children: [(0, jsx_runtime_1.jsxs)(react_1.Card, { radius: 26, padding: 12, style: { width: 150 }, children: [(0, jsx_runtime_1.jsx)(react_1.Concentric, { minimum: 8, style: { height: 90, background: 'var(--lg-fill-tertiary)', display: 'grid', placeItems: 'center' }, children: (0, jsx_runtime_1.jsx)(react_1.Text, { variant: "caption1", tone: "secondary", children: "26 \u2212 12 = 14" }) }), (0, jsx_runtime_1.jsx)(react_1.Text, { variant: "caption1", tone: "secondary", style: { marginBlockStart: 8 }, children: "\u540C\u5FC3 \u2713" })] }), (0, jsx_runtime_1.jsxs)(react_1.Card, { radius: 26, padding: 12, style: { width: 150 }, children: [(0, jsx_runtime_1.jsx)("div", { style: { height: 90, borderRadius: 4, background: 'var(--lg-fill-tertiary)', display: 'grid', placeItems: 'center' }, children: (0, jsx_runtime_1.jsx)(react_1.Text, { variant: "caption1", tone: "secondary", children: "\u56FA\u5B9A 4px" }) }), (0, jsx_runtime_1.jsx)(react_1.Text, { variant: "caption1", tone: "destructive", style: { marginBlockStart: 8 }, children: "\u5587\u53ED\u53E3 \u2717" })] })] }) }), (0, jsx_runtime_1.jsx)(code_block_js_1.CodeBlock, { code: `<Card radius={26} padding={12}>
  <Concentric minimum={8}>…</Concentric>
</Card>

// 或者在 JS 里计算
concentricRadius(26, 12, { minimum: 8 }); // 14` })] }), (0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u5C3A\u5BF8\u4E0E\u95F4\u8DDD", children: (0, jsx_runtime_1.jsx)(react_1.Card, { fill: "secondary", radius: 20, padding: 20, children: (0, jsx_runtime_1.jsxs)("ul", { className: "plain-list", children: [(0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(react_1.Text, { as: "span", variant: "subhead", children: "\u547D\u4E2D\u533A\u4E0D\u5C0F\u4E8E 44\u00D744pt\uFF1B\u63A7\u4EF6\u4E4B\u95F4\u81F3\u5C11 8pt\u3002\u89C6\u89C9\u53EF\u4EE5\u66F4\u5C0F\uFF0C\u547D\u4E2D\u533A\u4E0D\u884C\u2014\u2014\u7C97\u6307\u9488\u8BBE\u5907\u4E0A\u7EC4\u4EF6\u4F1A\u7528\u4F2A\u5143\u7D20\u628A\u547D\u4E2D\u533A\u8865\u56DE\u6765\u3002" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(react_1.Text, { as: "span", variant: "subhead", children: "\u9875\u8FB9\u8DDD\uFF1A\u7D27\u51D1\u5BBD\u5EA6 16pt\uFF0C\u5E38\u89C4\u5BBD\u5EA6 20pt\u3002\u53EF\u8BFB\u6B63\u6587\u5BBD\u5EA6\u7EA6 672pt\u3002" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(react_1.Text, { as: "span", variant: "subhead", children: "\u5E03\u5C40\u7531\u5C3A\u5BF8\u7C7B\uFF08\u65AD\u70B9\uFF09\u9A71\u52A8\uFF0C\u800C\u4E0D\u662F\u8BBE\u5907\u578B\u53F7\u6216\u65B9\u5411\u3002\u6807\u7B7E\u680F\u4E0E\u4FA7\u8FB9\u680F\u662F\u540C\u4E00\u4E2A\u5BFC\u822A\u5143\u7D20\u7684\u4E24\u79CD\u5F62\u6001\u3002" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: ["\u5168\u9AD8\u5E03\u5C40\u7528 ", (0, jsx_runtime_1.jsx)("code", { children: "100dvh" }), " \u800C\u4E0D\u662F ", (0, jsx_runtime_1.jsx)("code", { children: "100vh" }), "\uFF0C\u56FA\u5B9A\u680F\u8981\u52A0 ", (0, jsx_runtime_1.jsx)("code", { children: "env(safe-area-inset-*)" }), "\u3002"] }) })] }) }) })] });
}
function MotionFoundation() {
    return (0, jsx_runtime_1.jsxs)(page_js_1.Page, { eyebrow: "\u57FA\u7840", title: "\u52A8\u6548\u4E0E\u4EA4\u4E92", lede: "\u52A8\u6548\u5FC5\u987B\u4F20\u8FBE\u4FE1\u606F\uFF1A\u72B6\u6001\u3001\u53CD\u9988\u3001\u7A7A\u95F4\u5173\u7CFB\u6216\u64CD\u4F5C\u7ED3\u679C\u3002\u8BF4\u4E0D\u6E05\u5B83\u544A\u8BC9\u4E86\u7528\u6237\u4EC0\u4E48\uFF0C\u5C31\u5E94\u8BE5\u5220\u6389\u3002", children: [(0, jsx_runtime_1.jsx)(page_js_1.Rule, { children: "\u5728\u6309\u4E0B\u65F6\u54CD\u5E94\uFF0C\u800C\u4E0D\u662F\u62AC\u8D77\u65F6\uFF1B\u62D6\u52A8\u8FC7\u7A0B\u4E2D\u63D0\u4F9B 1:1 \u7684\u8FDE\u7EED\u53CD\u9988\uFF1B\u4EFB\u4F55\u52A8\u753B\u90FD\u53EF\u4EE5\u88AB\u4E2D\u9014\u6293\u4F4F\u5E76\u6539\u53D8\u65B9\u5411\u3002\u83DC\u5355\u3001sheet\u3001\u5BF9\u8BDD\u6846\u4ECE\u6253\u5F00\u5B83\u4EEC\u7684\u63A7\u4EF6\u91CC\u957F\u51FA\u6765\u3002" }), (0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u53EF\u62D6\u52A8\u7684\u63A7\u4EF6", description: "\u8FD9\u4E09\u4E2A\u63A7\u4EF6\u90FD\u662F\u62D6\u62FD\u76EE\u6807\u3002\u53EA\u80FD\u70B9\u51FB\u7684\u7248\u672C\uFF0C\u662F\u754C\u9762\u201C\u4E0D\u50CF Apple\u201D\u7684\u6700\u5E38\u89C1\u7834\u7EFD\u3002", children: (0, jsx_runtime_1.jsx)(demo_js_1.Demo, { height: 220, children: (0, jsx_runtime_1.jsxs)("div", { style: { display: 'grid', gap: 18, width: 300 }, children: [(0, jsx_runtime_1.jsx)(react_1.GlassSegmentedControl, { "aria-label": "\u62D6\u52A8\u6F14\u793A", defaultValue: "b", items: [{ value: 'a', label: '按住' }, { value: 'b', label: '选中项' }, { value: 'c', label: '滑动' }] }), (0, jsx_runtime_1.jsx)(react_1.Text, { variant: "caption1", tone: "secondary", children: "\u6309\u4F4F\u9009\u4E2D\u5206\u6BB5\u5DE6\u53F3\u62D6\u52A8\uFF1A\u900F\u955C\u8DDF\u968F\u6307\u9488\u3001\u62C9\u4F38\uFF0C\u5E76\u5728\u8DE8\u8FC7\u5206\u6BB5\u65F6\u5373\u65F6\u5207\u6362\u3002" })] }) }) }), (0, jsx_runtime_1.jsxs)(page_js_1.Section, { title: "\u66F2\u7EBF\u4E0E\u65F6\u957F", children: [(0, jsx_runtime_1.jsx)(code_block_js_1.CodeBlock, { code: `--lg-duration-press: 90ms;    /* 按下：立刻 */
--lg-duration-release: 220ms; /* 松开 */
--lg-duration-spring: 520ms;  /* 弹簧总时长 */
--lg-spring: linear(0, … 1.072 31.5%, … 1);  /* 阻尼振子采样 */
--lg-press-scale: 1.06;       /* 独立玻璃朝指针放大 */` }), (0, jsx_runtime_1.jsxs)(react_1.Text, { variant: "subhead", tone: "secondary", style: { marginBlockStart: 12 }, children: ["\u53EA\u52A8 ", (0, jsx_runtime_1.jsx)("code", { children: "transform" }), " \u4E0E ", (0, jsx_runtime_1.jsx)("code", { children: "opacity" }), "\u3002\u6C38\u8FDC\u4E0D\u8981\u52A8\u753B ", (0, jsx_runtime_1.jsx)("code", { children: "backdrop-filter" }), "\u3001", (0, jsx_runtime_1.jsx)("code", { children: "blur()" }), "\u3001", (0, jsx_runtime_1.jsx)("code", { children: "box-shadow" }), " \u6216 ", (0, jsx_runtime_1.jsx)("code", { children: "width" }), "\u3002"] })] })] });
}
function AccessibilityFoundation() {
    return (0, jsx_runtime_1.jsxs)(page_js_1.Page, { eyebrow: "\u57FA\u7840", title: "\u65E0\u969C\u788D", lede: "\u7CFB\u7EDF\u7EC4\u4EF6\u4F1A\u81EA\u52A8\u5904\u7406\u8FD9\u4E9B\uFF1B\u81EA\u5B9A\u4E49\u73BB\u7483\u5FC5\u987B\u81EA\u5DF1\u5B9E\u73B0\u540C\u6837\u7684\u884C\u4E3A\u3002", children: [(0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u56DB\u6761\u5FC5\u987B\u652F\u6301\u7684\u504F\u597D", description: "\u53F3\u4E0A\u89D2\u7684\u663E\u793A\u504F\u597D\u53EF\u4EE5\u9010\u6761\u6253\u5F00\u9A8C\u8BC1\uFF0C\u5B83\u4EEC\u53E0\u52A0\u5728\u7CFB\u7EDF\u8BBE\u7F6E\u4E4B\u4E0A\u800C\u4E0D\u662F\u66FF\u4EE3\u3002", children: (0, jsx_runtime_1.jsx)(react_1.Card, { fill: "secondary", radius: 20, padding: 20, children: (0, jsx_runtime_1.jsxs)("ul", { className: "plain-list", children: [(0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: [(0, jsx_runtime_1.jsx)("strong", { children: "\u51CF\u5C11\u900F\u660E\u5EA6" }), " \u2014 \u6750\u8D28\u53D8\u5F97\u66F4\u5B9E\u3001\u906E\u6321\u66F4\u591A\uFF1B\u80CC\u666F\u6EE4\u955C\u6574\u4F53\u5173\u95ED\u3002"] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: [(0, jsx_runtime_1.jsx)("strong", { children: "\u589E\u5F3A\u5BF9\u6BD4\u5EA6" }), " \u2014 \u6750\u8D28\u53D8\u4E3A\u63A5\u8FD1\u9ED1\u767D\uFF0C\u5E76\u52A0\u4E0A\u4E00\u6761\u5BF9\u6BD4\u8FB9\u6846\uFF1B\u6298\u5C04\u4E0E\u884C\u8FDB\u9AD8\u5149\u8BA9\u4F4D\u4E8E\u53EF\u8BFB\u6027\u3002"] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: [(0, jsx_runtime_1.jsx)("strong", { children: "\u51CF\u5C11\u52A8\u6548" }), " \u2014 \u5173\u95ED\u5F39\u6027\u3001\u4F4D\u79FB\u3001\u53D8\u5F62\u4E0E\u62D6\u52A8\u62C9\u4F38\uFF1B\u4E0D\u786E\u5B9A\u8FDB\u5EA6\u6761\u505C\u6B62\u8FD0\u52A8\u3002"] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: [(0, jsx_runtime_1.jsx)("strong", { children: "\u5F3A\u5236\u989C\u8272" }), " \u2014 \u4EA4\u7ED9\u7CFB\u7EDF\u8C03\u8272\u677F\uFF0C\u88C5\u9970\u5C42\u6574\u4F53\u9690\u85CF\u3002"] }) })] }) }) }), (0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u5176\u4F59\u7684\u5E95\u7EBF", children: (0, jsx_runtime_1.jsx)(react_1.Card, { radius: 20, padding: 20, children: (0, jsx_runtime_1.jsxs)("ul", { className: "plain-list", children: [(0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(react_1.Text, { as: "span", variant: "subhead", children: "\u6BCF\u4E2A\u53EF\u4EA4\u4E92\u5143\u7D20\u90FD\u6709 44\u00D744 \u547D\u4E2D\u533A\u3001\u53EF\u8BBF\u95EE\u540D\u79F0\u4E0E\u6B63\u786E\u7684\u89D2\u8272\uFF1B\u7EAF\u56FE\u6807\u6309\u94AE\u7684 aria-label \u662F\u5FC5\u586B\u7C7B\u578B\u3002" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(react_1.Text, { as: "span", variant: "subhead", children: "\u989C\u8272\u4E0D\u662F\u552F\u4E00\u4FE1\u53F7\uFF1B\u6B63\u6587\u5BF9\u6BD4\u5EA6\u4E0D\u4F4E\u4E8E 4.5:1\uFF0C\u5927\u5B57\u4E0E\u63A7\u4EF6\u4E0D\u4F4E\u4E8E 3:1\u3002" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: ["\u7126\u70B9\u73AF\u7528 ", (0, jsx_runtime_1.jsx)("code", { children: "outline" }), " + ", (0, jsx_runtime_1.jsx)("code", { children: "outline-offset" }), "\uFF0C\u4E0D\u7528 ", (0, jsx_runtime_1.jsx)("code", { children: "box-shadow" }), "\u2014\u2014\u90A3\u662F\u73BB\u7483\u81EA\u5DF1\u7684\u3002\u6CA1\u6709\u66FF\u4EE3\u5C31\u4E0D\u8981\u5199 ", (0, jsx_runtime_1.jsx)("code", { children: "outline: none" }), "\u3002"] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(react_1.Text, { as: "span", variant: "subhead", children: "Dynamic Type \u8981\u80FD\u56DE\u6D41\u5230 AX5\uFF0C\u4E0D\u622A\u65AD\u3001\u4E0D\u6EA2\u51FA\u3002" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(react_1.Text, { as: "span", variant: "subhead", children: "RTL \u7528\u903B\u8F91\u5C5E\u6027\uFF1B\u65B9\u5411\u6027\u56FE\u6807\u955C\u50CF\uFF0C\u5A92\u4F53\u63A7\u4EF6\u4E0E\u65F6\u949F\u4E0D\u955C\u50CF\u3002" }) })] }) }) })] });
}

},
"app/pages/guides.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallGuide = InstallGuide;
exports.RendererGuide = RendererGuide;
exports.ThemingGuide = ThemingGuide;
exports.SsrGuide = SsrGuide;
exports.MigrationGuide = MigrationGuide;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@liquid-glass-ui/react");
const page_js_1 = require("../site/page.js");
const code_block_js_1 = require("../site/code-block.js");
function InstallGuide() {
    return (0, jsx_runtime_1.jsxs)(page_js_1.Page, { eyebrow: "\u6307\u5357", title: "\u63A5\u5165\u7EC4\u4EF6", lede: "\u4E09\u4E2A\u672C\u5730\u5DE5\u4F5C\u533A\u5305\uFF0C\u5C1A\u672A\u53D1\u5E03\u5230 npm\u3002", children: [(0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u5F00\u53D1\u6E90\u7801", children: (0, jsx_runtime_1.jsx)(code_block_js_1.CodeBlock, { code: `npm install
npm run dev
# http://127.0.0.1:5173` }) }), (0, jsx_runtime_1.jsxs)(page_js_1.Section, { title: "\u5728\u5E94\u7528\u91CC\u4F7F\u7528", children: [(0, jsx_runtime_1.jsx)(code_block_js_1.CodeBlock, { code: `import {
  GlassProvider, GlassToolbar, ToolbarGroup, GlassButton, ToastProvider,
} from '@liquid-glass-ui/react';

<GlassProvider theme="system">
  <ToastProvider>
    <GlassToolbar aria-label="图片操作">
      <ToolbarGroup>
        <GlassButton>查看原图</GlassButton>
      </ToolbarGroup>
      <ToolbarSpacer />
      <ToolbarGroup prominent>
        <GlassButton variant="glassProminent">导出</GlassButton>
      </ToolbarGroup>
    </GlassToolbar>
  </ToastProvider>
</GlassProvider>` }), (0, jsx_runtime_1.jsxs)(react_1.Text, { variant: "subhead", tone: "secondary", children: [(0, jsx_runtime_1.jsx)("code", { children: "tokens.css" }), " \u5FC5\u987B\u5728 ", (0, jsx_runtime_1.jsx)("code", { children: "styles.css" }), " \u4E4B\u524D\u5F15\u5165\u4E00\u6B21\u3002\u7EC4\u4EF6 CSS \u5168\u90E8\u5728 ", (0, jsx_runtime_1.jsx)("code", { children: ".lg-*" }), " \u547D\u540D\u7A7A\u95F4\u4E0B\uFF0C\u4E0D\u4F9D\u8D56 Tailwind\u3002"] })] }), (0, jsx_runtime_1.jsxs)(page_js_1.Section, { title: "\u79BB\u7EBF\u9884\u89C8", children: [(0, jsx_runtime_1.jsx)(code_block_js_1.CodeBlock, { code: `node scripts/serve-preview.mjs
# http://127.0.0.1:4173` }), (0, jsx_runtime_1.jsxs)(react_1.Text, { variant: "subhead", tone: "secondary", children: ["\u53EA\u7528 Node \u6807\u51C6\u5E93\uFF0C\u9ED8\u8BA4\u53EA\u76D1\u542C\u672C\u673A\u3002", (0, jsx_runtime_1.jsx)("code", { children: "preview/" }), " \u662F\u7531\u540C\u4E00\u4EFD\u7EC4\u4EF6\u6E90\u7801\u8F6C\u8BD1\u51FA\u6765\u7684\u68C0\u67E5\u7248\uFF0C\u8FD0\u884C\u65F6\u7248\u672C\u4E0E npm \u5F00\u53D1\u4F9D\u8D56\u5206\u5F00\u8BB0\u5F55\uFF1B\u6E90\u7801\u6539\u52A8\u540E\u9700\u8981\u91CD\u65B0\u6267\u884C ", (0, jsx_runtime_1.jsx)("code", { children: "npm run preview:rebuild" }), "\u3002"] })] })] });
}
function RendererGuide() {
    return (0, jsx_runtime_1.jsxs)(page_js_1.Page, { eyebrow: "\u6307\u5357", title: "\u6E32\u67D3\u7B56\u7565", lede: "CSS \u57FA\u7EBF\u3001SVG \u6298\u5C04\u589E\u5F3A\uFF0C\u4EE5\u53CA\u4E0D\u900F\u660E\u56DE\u9000\u3002", children: [(0, jsx_runtime_1.jsxs)(page_js_1.Rule, { children: ["\u8BED\u6CD5\u652F\u6301\u68C0\u6D4B\u4E0D\u80FD\u8BC1\u660E\u6298\u5C04\u5728\u89C6\u89C9\u4E0A\u662F\u6B63\u786E\u7684\u3002", (0, jsx_runtime_1.jsx)("code", { children: "auto" }), " \u9ED8\u8BA4\u8D70\u4FDD\u5B88\u7684 CSS \u8DEF\u5F84\uFF0C\u53EA\u6709\u5728\u4F60\u81EA\u5DF1\u7684 Chrome / GPU \u77E9\u9635\u4E0A\u9A8C\u8BC1\u8FC7\u4E4B\u540E\uFF0C\u624D\u5E94\u8BE5\u663E\u5F0F\u5F00\u542F SVG\u3002"] }), (0, jsx_runtime_1.jsxs)(page_js_1.Section, { title: "\u4E09\u6761\u8DEF\u5F84", children: [(0, jsx_runtime_1.jsx)(react_1.Card, { fill: "secondary", radius: 20, padding: 20, children: (0, jsx_runtime_1.jsxs)("ul", { className: "plain-list", children: [(0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: [(0, jsx_runtime_1.jsx)("code", { children: "renderer=\"css\"" }), " \u2014 \u80CC\u666F\u6A21\u7CCA\u3001\u5E95\u8272\u3001\u884C\u8FDB\u9AD8\u5149\u3002\u6240\u6709\u6D4F\u89C8\u5668\u90FD\u80FD\u8DD1\u3002"] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: [(0, jsx_runtime_1.jsx)("code", { children: "renderer=\"svg\"" }), " \u2014 \u989D\u5916\u53E0\u52A0\u51E0\u4F55\u4F4D\u79FB\u8D34\u56FE\uFF0C\u8BA9\u8FB9\u7F18\u771F\u6B63\u6298\u5C04\u80CC\u666F\u3002\u524D\u666F\u6587\u5B57\u6C38\u8FDC\u4E0D\u8FDB\u6EE4\u955C\u3002"] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: [(0, jsx_runtime_1.jsx)("code", { children: "transparency=\"opaque\"" }), " \u2014 \u5173\u95ED\u5168\u90E8\u80CC\u666F\u6EE4\u955C\uFF0C\u4F18\u5148\u4FDD\u8BC1\u7A33\u5B9A\u53EF\u8BFB\u3002"] }) })] }) }), (0, jsx_runtime_1.jsx)(code_block_js_1.CodeBlock, { code: `<GlassProvider renderer="auto" enableSvgAuto={false}>…</GlassProvider>

// 验证过目标环境之后
<GlassProvider renderer="svg">…</GlassProvider>` })] }), (0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u6027\u80FD\u9884\u7B97", children: (0, jsx_runtime_1.jsx)(react_1.Card, { radius: 20, padding: 20, children: (0, jsx_runtime_1.jsxs)("ul", { className: "plain-list", children: [(0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: ["\u5355\u4E2A\u89C6\u56FE\u91CC\u7684\u6298\u5C04\u5143\u7D20\u63A7\u5236\u5728 20 \u4E2A\u4EE5\u5185\u3002", (0, jsx_runtime_1.jsx)("code", { children: "backdrop-filter" }), " \u4F1A\u5F3A\u5236\u5408\u6210\u5C42\uFF0C\u5E76\u5728\u80CC\u666F\u53D8\u5316\u65F6\u91CD\u7B97\u3002"] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: ["\u4E0D\u8981\u7ED9\u6240\u6709\u73BB\u7483\u52A0 ", (0, jsx_runtime_1.jsx)("code", { children: "will-change: transform" }), "\u3002\u53EA\u63D0\u5347\u6B63\u5728\u8FD0\u52A8\u7684\u90A3\u4E00\u4E2A\uFF0C\u5168\u91CF\u63D0\u5347\u53CD\u800C\u66F4\u6162\u3002"] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: ["\u8272\u6563\uFF08", (0, jsx_runtime_1.jsx)("code", { children: "chroma" }), "\uFF09\u6210\u672C\u7EA6\u4E09\u500D\uFF0C\u53EA\u7528\u4E8E\u5C11\u91CF\u975E\u56FA\u5B9A\u5143\u7D20\u2014\u2014\u56FA\u5B9A\u680F\u6BCF\u5E27\u90FD\u5728\u91CD\u7ED8\u3002"] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: ["\u4E0D\u8981\u5728 ", (0, jsx_runtime_1.jsx)("code", { children: "pointermove" }), " \u91CC\u8BFB\u5E03\u5C40\u3002\u624B\u52BF\u5F00\u59CB\u65F6\u6D4B\u4E00\u6B21\uFF0C\u5199\u5165\u5408\u5E76\u5230\u4E00\u4E2A rAF\u3002"] }) })] }) }) })] });
}
function ThemingGuide() {
    return (0, jsx_runtime_1.jsxs)(page_js_1.Page, { eyebrow: "\u6307\u5357", title: "\u4E3B\u9898\u4E0E token", lede: "\u6362\u54C1\u724C\u8272\u53EA\u9700\u8981\u6539\u4E00\u5BF9 token\uFF0C\u5176\u4F59\u4E0D\u7F16\u7801\u4EFB\u4F55\u989C\u8272\u3002", children: [(0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u6362 accent", children: (0, jsx_runtime_1.jsx)(code_block_js_1.CodeBlock, { code: `:root, [data-lg-theme="light"] { --lg-accent: #6d28d9; }
[data-lg-theme="dark"]        { --lg-accent: #8b5cf6; }
/* 标签色保持白色即可；开关打开态按 HIG 固定为系统绿。 */` }) }), (0, jsx_runtime_1.jsxs)(page_js_1.Section, { title: "\u4E3B\u9898\u662F\u6309\u5143\u7D20\u58F0\u660E\u7684", children: [(0, jsx_runtime_1.jsxs)(react_1.Text, { variant: "subhead", tone: "secondary", children: ["provider \u4F1A\u5728\u6BCF\u4E2A\u8868\u9762\u4E0A\u5199 ", (0, jsx_runtime_1.jsx)("code", { children: "data-lg-theme" }), "\uFF0C\u6240\u4EE5\u6D45\u8272\u9875\u9762\u91CC\u53EF\u4EE5\u653E\u4E00\u6761\u6DF1\u8272\u5DE5\u5177\u680F\u3002\u8FD9\u4E5F\u662F\u4E3A\u4EC0\u4E48 token \u7528\u663E\u5F0F\u7684\u5C5E\u6027\u9009\u62E9\u5668\u5206\u7EC4\uFF0C\u800C\u4E0D\u662F ", (0, jsx_runtime_1.jsx)("code", { children: "light-dark()" }), "\u3002"] }), (0, jsx_runtime_1.jsx)(code_block_js_1.CodeBlock, { code: `<GlassProvider theme="system">
  <GlassBackdrop tone="dark">
    {/* 小玻璃在这里会翻转为深色外观 */}
    <GlassToolbar aria-label="播放控制">…</GlassToolbar>
  </GlassBackdrop>
</GlassProvider>` })] }), (0, jsx_runtime_1.jsxs)(page_js_1.Section, { title: "\u9996\u5C4F\u4E0D\u95EA\u70C1", children: [(0, jsx_runtime_1.jsxs)(react_1.Text, { variant: "subhead", tone: "secondary", children: ["\u4E3B\u9898\u5FC5\u987B\u5728\u9996\u6B21\u7ED8\u5236\u4E4B\u524D\u5E94\u7528\u3002\u5728 ", (0, jsx_runtime_1.jsx)("code", { children: "<head>" }), " \u91CC\u653E\u4E00\u6BB5\u5185\u8054\u811A\u672C\u8BFB\u53D6\u504F\u597D\u5E76\u5199\u5230 ", (0, jsx_runtime_1.jsx)("code", { children: "<html>" }), " \u4E0A\u2014\u2014\u7B49\u5230 React \u6302\u8F7D\u540E\u518D\u8BFB\uFF0C\u5C31\u4F1A\u5148\u95EA\u4E00\u4E0B\u9519\u8BEF\u7684\u4E3B\u9898\uFF0C\u7CFB\u7EDF\u6DF1\u8272\u6A21\u5F0F\u7684\u7528\u6237\u8FD8\u4F1A\u5148\u770B\u5230\u6D45\u8272\u3002"] }), (0, jsx_runtime_1.jsx)(code_block_js_1.CodeBlock, { code: `<script>
  var stored = localStorage.getItem('theme') || 'system';
  var dark = stored === 'dark' ||
    (stored === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-lg-theme', dark ? 'dark' : 'light');
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
</script>` })] }), (0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "Dynamic Type", children: (0, jsx_runtime_1.jsx)(code_block_js_1.CodeBlock, { code: `document.documentElement.dataset.lgTextSize = 'ax3';
// xs | s | m | l | xl | xxl | xxxl | ax1 … ax5` }) })] });
}
function SsrGuide() {
    return (0, jsx_runtime_1.jsxs)(page_js_1.Page, { eyebrow: "\u6307\u5357", title: "SSR \u4E0E CSP", lede: "\u51E0\u4F55\u5185\u6838\u5728\u5BFC\u5165\u65F6\u4E0D\u78B0\u4EFB\u4F55\u6D4F\u89C8\u5668\u5168\u5C40\u5BF9\u8C61\u3002", children: [(0, jsx_runtime_1.jsxs)(page_js_1.Section, { title: "\u670D\u52A1\u7AEF\u6E32\u67D3", children: [(0, jsx_runtime_1.jsx)(react_1.Card, { fill: "secondary", radius: 20, padding: 20, children: (0, jsx_runtime_1.jsxs)("ul", { className: "plain-list", children: [(0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: ["\u6A21\u5757\u521D\u59CB\u5316\u4E0D\u8BBF\u95EE ", (0, jsx_runtime_1.jsx)("code", { children: "document" }), " / ", (0, jsx_runtime_1.jsx)("code", { children: "window" }), " / ", (0, jsx_runtime_1.jsx)("code", { children: "canvas" }), "\uFF1B\u8D34\u56FE\u751F\u6210\u53EA\u53D1\u751F\u5728\u5BA2\u6237\u7AEF\u6548\u679C\u91CC\u3002"] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: [(0, jsx_runtime_1.jsx)("code", { children: "theme=\"system\"" }), " \u670D\u52A1\u7AEF\u5148\u8F93\u51FA\u7A33\u5B9A\u7684\u6D45\u8272\u6807\u8BB0\uFF0C\u5BA2\u6237\u7AEF\u518D\u54CD\u5E94\u7CFB\u7EDF\u67E5\u8BE2\u3002\u771F\u6B63\u8981\u6C42\u9996\u5C4F\u65E0\u95EA\u70C1\u7684\u5E94\u7528\uFF0C\u5E94\u4ECE cookie \u6216\u670D\u52A1\u7AEF\u8BBE\u7F6E\u4F20\u5165\u786E\u5B9A\u7684 theme\u3002"] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(react_1.Text, { as: "span", variant: "subhead", children: "\u9ED8\u8BA4\u6253\u5F00\u7684 dialog \u5728\u670D\u52A1\u7AEF\u53EA\u8F93\u51FA\u5B89\u5168\u6807\u8BB0\uFF1B\u771F\u6B63\u6253\u5F00\u662F\u5BA2\u6237\u7AEF\u526F\u4F5C\u7528\u3002" }) })] }) }), (0, jsx_runtime_1.jsx)(code_block_js_1.CodeBlock, { code: `npm run test:ssr` })] }), (0, jsx_runtime_1.jsxs)(page_js_1.Section, { title: "\u5185\u5BB9\u5B89\u5168\u7B56\u7565", children: [(0, jsx_runtime_1.jsxs)(react_1.Text, { variant: "subhead", tone: "secondary", children: ["\u4F4D\u79FB\u8D34\u56FE\u901A\u8FC7 ", (0, jsx_runtime_1.jsx)("code", { children: "canvas.toDataURL()" }), " \u751F\u6210\u5E76\u4EE5 ", (0, jsx_runtime_1.jsx)("code", { children: "data:" }), " URL \u5582\u7ED9 ", (0, jsx_runtime_1.jsx)("code", { children: "feImage" }), "\uFF0C\u4E0D\u9700\u8981 ", (0, jsx_runtime_1.jsx)("code", { children: "unsafe-eval" }), "\u3002\u9644\u5E26\u7684\u9884\u89C8\u670D\u52A1\u5668\u5C31\u5E26\u7740\u9650\u5236\u6027 CSP \u8FD0\u884C\uFF0C\u5E76\u6709\u5BF9\u5E94\u7684\u56DE\u5F52\u7528\u4F8B\u3002"] }), (0, jsx_runtime_1.jsx)(code_block_js_1.CodeBlock, { code: `npm run test:csp` })] })] });
}
function MigrationGuide() {
    return (0, jsx_runtime_1.jsxs)(page_js_1.Page, { eyebrow: "\u6307\u5357", title: "\u4ECE 0.1 \u8FC1\u79FB\u5230 0.2", lede: "\u8FD9\u662F\u4E00\u6B21\u7834\u574F\u6027\u91CD\u6784\uFF1A\u5185\u5BB9\u5C42\u4E0E\u64CD\u4F5C\u5C42\u88AB\u5F7B\u5E95\u5206\u5F00\u3002", children: [(0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u6539\u540D", children: (0, jsx_runtime_1.jsx)(react_1.Card, { radius: 20, padding: 20, children: (0, jsx_runtime_1.jsxs)("ul", { className: "plain-list", children: [(0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: [(0, jsx_runtime_1.jsx)("code", { children: "variant=\"primary\"" }), " \u2192 ", (0, jsx_runtime_1.jsx)("code", { children: "\"glassProminent\"" }), "\uFF1B", (0, jsx_runtime_1.jsx)("code", { children: "\"ghost\"" }), " \u2192 ", (0, jsx_runtime_1.jsx)("code", { children: "\"plain\"" }), "\uFF1B", (0, jsx_runtime_1.jsx)("code", { children: "\"danger\"" }), " \u2192 ", (0, jsx_runtime_1.jsx)("code", { children: "\"destructive\"" }), "\uFF1B", (0, jsx_runtime_1.jsx)("code", { children: "\"default\"" }), " \u2192 ", (0, jsx_runtime_1.jsx)("code", { children: "\"glass\"" }), "\u3002"] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: [(0, jsx_runtime_1.jsx)("code", { children: "GlassToolbarSeparator" }), " \u2192 ", (0, jsx_runtime_1.jsx)("code", { children: "ToolbarSpacer" }), "\u3002\u4E24\u5757\u73BB\u7483\u4E4B\u95F4\u7684\u95F4\u9699\u5C31\u662F\u5206\u9694\u7B26\uFF0C\u4E0D\u518D\u753B\u7EBF\u3002"] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: [(0, jsx_runtime_1.jsx)("code", { children: "GlassNavBar" }), " \u2192 ", (0, jsx_runtime_1.jsx)("code", { children: "TabBar" }), "\uFF08\u5BBD\u5C4F\u81EA\u52A8\u53D8\u5F62\u4E3A\u4FA7\u8FB9\u680F\uFF09\u3002"] }) })] }) }) }), (0, jsx_runtime_1.jsxs)(page_js_1.Section, { title: "\u7ED3\u6784\u53D8\u5316", children: [(0, jsx_runtime_1.jsx)(react_1.Card, { fill: "secondary", radius: 20, padding: 20, children: (0, jsx_runtime_1.jsxs)("ul", { className: "plain-list", children: [(0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: [(0, jsx_runtime_1.jsx)("code", { children: "GlassToolbar" }), " \u81EA\u5DF1\u4E0D\u518D\u662F\u73BB\u7483\u3002\u628A\u5B50\u9879\u5305\u8FDB\u4E00\u4E2A\u6216\u591A\u4E2A ", (0, jsx_runtime_1.jsx)("code", { children: "ToolbarGroup" }), "\uFF0C\u6750\u8D28\u76F8\u5173\u7684 props \u79FB\u5230\u5206\u7EC4\u4E0A\u3002"] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: ["\u5185\u5BB9\u5C42\u5BB9\u5668\u6362\u6210 ", (0, jsx_runtime_1.jsx)("code", { children: "Card" }), " / ", (0, jsx_runtime_1.jsx)("code", { children: "List" }), " / ", (0, jsx_runtime_1.jsx)("code", { children: "MaterialView" }), "\u3002", (0, jsx_runtime_1.jsx)("code", { children: "GlassSurface" }), " \u4ECD\u7136\u5B58\u5728\uFF0C\u4F46\u5B83\u8868\u793A\u7684\u662F\u6D6E\u52A8\u7684\u64CD\u4F5C\u9762\u3002"] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: ["\u65B0\u589E ", (0, jsx_runtime_1.jsx)("code", { children: "size=\"large\"" }), " \u7528\u4E8E\u4FA7\u8FB9\u680F\u3001\u83DC\u5355\u3001sheet \u4E0E\u63D0\u793A\u6846\uFF1B\u6D6E\u5C42\u7EC4\u4EF6\u5DF2\u7ECF\u81EA\u52A8\u4F7F\u7528\u5B83\u3002"] }) })] }) }), (0, jsx_runtime_1.jsx)(code_block_js_1.CodeBlock, { code: `// 0.1
<GlassToolbar aria-label="操作" material="clear" backdropTone="dark">
  <GlassIconButton aria-label="上一个"><Prev/></GlassIconButton>
  <GlassToolbarSeparator/>
  <GlassButton>保存</GlassButton>
</GlassToolbar>

// 0.2 —— 图标与文字不共享同一块背景
<GlassToolbar aria-label="操作">
  <ToolbarGroup material="clear" backdropTone="dark">
    <GlassIconButton aria-label="上一个"><Prev/></GlassIconButton>
  </ToolbarGroup>
  <ToolbarSpacer/>
  <ToolbarGroup prominent>
    <GlassButton variant="glassProminent">保存</GlassButton>
  </ToolbarGroup>
</GlassToolbar>` })] }), (0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u65B0\u589E\u80FD\u529B", children: (0, jsx_runtime_1.jsx)(react_1.Card, { radius: 20, padding: 20, children: (0, jsx_runtime_1.jsxs)("ul", { className: "plain-list", children: [(0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: ["\u5B8C\u6574\u8BED\u4E49\u8272\u4E0E iOS \u6587\u672C\u6837\u5F0F token\uFF0C\u914D Dynamic Type \u7F29\u653E\uFF08", (0, jsx_runtime_1.jsx)("code", { children: "data-lg-text-size" }), "\uFF09\u3002"] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: [(0, jsx_runtime_1.jsx)("code", { children: "prefers-contrast: more" }), " \u652F\u6301\uFF0C\u4EE5\u53CA provider \u4E0A\u7684 ", (0, jsx_runtime_1.jsx)("code", { children: "contrast" }), " \u9009\u9879\u3002"] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: ["\u540C\u5FC3\u5706\u89D2\uFF1A", (0, jsx_runtime_1.jsx)("code", { children: "Card" }), " + ", (0, jsx_runtime_1.jsx)("code", { children: "Concentric" }), "\uFF0C\u6216 ", (0, jsx_runtime_1.jsx)("code", { children: "concentricRadius()" }), "\u3002"] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(react_1.Text, { as: "span", variant: "subhead", children: "\u65B0\u7EC4\u4EF6\uFF1ATabBar\u3001Sidebar\u3001NavigationBar\u3001Sheet\u3001Alert\u3001ActionSheet\u3001Toast\u3001List\u3001TextField\u3001SearchField\u3001Stepper\u3001Progress\u3001Badge\u3002" }) })] }) }) })] });
}

},
"app/pages/lab.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.backgrounds = void 0;
exports.StressBackground = StressBackground;
exports.MaterialLab = MaterialLab;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@liquid-glass-ui/react");
const scene_js_1 = require("../scene.js");
const icons_js_1 = require("../icons.js");
const page_js_1 = require("../site/page.js");
const react_3 = require("@liquid-glass-ui/react");
const code_block_js_1 = require("../site/code-block.js");
exports.backgrounds = [['alpine', '山间场景'], ['white', '白色背景'], ['black', '黑色背景'], ['split', '明暗交界'], ['grid', '细线网格'], ['text', '滚动正文'], ['video', '合成视频']];
function StressBackground({ kind, children }) {
    return (0, jsx_runtime_1.jsxs)("div", { className: `stress-background bg-${kind}`, children: [kind === 'alpine' && (0, jsx_runtime_1.jsx)(scene_js_1.AlpineScene, {}), kind === 'video' && (0, jsx_runtime_1.jsx)(scene_js_1.SyntheticVideo, { playing: true }), kind === 'text' && (0, jsx_runtime_1.jsx)("div", { className: "background-paragraphs", "aria-hidden": "true", children: Array.from({ length: 12 }, (_, i) => (0, jsx_runtime_1.jsx)("p", { children: "\u6E05\u6670\u5148\u4E8E\u900F\u660E\u3002\u754C\u9762\u662F\u5185\u5BB9\u4E0E\u64CD\u4F5C\u7684\u5173\u7CFB\uFF0C\u800C\u4E0D\u662F\u4E00\u5C42\u6EE4\u955C\u3002Keep the content clear. Form follows purpose. 0123456789" }, i)) }), children] });
}
/** Drag the specimen across the background with the pointer; keyboard users can nudge it with arrow keys on the grip. */
function useDraggable(bounds) {
    const [offset, setOffset] = (0, react_1.useState)({ x: 0, y: 0 });
    const [dragging, setDragging] = (0, react_1.useState)(false);
    const start = (0, react_1.useRef)({ x: 0, y: 0, ox: 0, oy: 0 });
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
function MaterialLab() {
    const [material, setMaterial] = (0, react_1.useState)('clear');
    const [tone, setTone] = (0, react_1.useState)('dark');
    const [background, setBackground] = (0, react_1.useState)('alpine');
    const [strength, setStrength] = (0, react_1.useState)(32);
    const [renderer, setRenderer] = (0, react_1.useState)('svg');
    const [radius, setRadius] = (0, react_1.useState)(32);
    const [clicks, setClicks] = (0, react_1.useState)(0);
    const [drift, setDrift] = (0, react_1.useState)(false);
    const preview = (0, react_1.useRef)(null);
    const drag = useDraggable(preview);
    (0, react_1.useEffect)(() => {
        if (!drift)
            return;
        let frame = 0;
        const start = performance.now();
        const tick = (now) => { const t = (now - start) / 1000; preview.current?.style.setProperty('--drift', `${Math.sin(t / 1.8) * 70}px ${Math.cos(t / 2.6) * 30}px`); frame = requestAnimationFrame(tick); };
        frame = requestAnimationFrame(tick);
        return () => { cancelAnimationFrame(frame); preview.current?.style.removeProperty('--drift'); };
    }, [drift]);
    const specimenStyle = { '--offset-x': `${drag.offset.x}px`, '--offset-y': `${drag.offset.y}px` };
    return (0, jsx_runtime_1.jsxs)(page_js_1.Page, { eyebrow: "\u5B9E\u9A8C\u5BA4", title: "\u6750\u8D28\u5B9E\u9A8C\u53F0", lede: "\u5728\u540C\u4E00\u7EC4\u80CC\u666F\u4E2D\u89C2\u5BDF\u6298\u5C04\u3001\u6A21\u7CCA\u4E0E\u53EF\u8BFB\u6027\u3002\u62D6\u52A8\u73BB\u7483\u7A7F\u8FC7\u660E\u6697\u4EA4\u754C\uFF0C\u6309\u4F4F\u6309\u94AE\u611F\u53D7\u56DE\u5F39\u3002\u6EE4\u955C\u53C2\u6570\u4E0D\u7B49\u4E8E\u8BBE\u8BA1\u7CFB\u7EDF\u3002", children: [(0, jsx_runtime_1.jsxs)("div", { className: "lab-layout", children: [(0, jsx_runtime_1.jsx)("div", { className: `lab-preview ${drag.dragging ? 'is-dragging' : ''} ${drift ? 'is-drifting' : ''}`, ref: preview, children: (0, jsx_runtime_1.jsxs)(StressBackground, { kind: background, children: [(0, jsx_runtime_1.jsx)("div", { className: "specimen-drift", style: specimenStyle, children: (0, jsx_runtime_1.jsxs)(react_2.GlassSurface, { className: "specimen", material: material, backdropTone: tone, renderer: renderer, radius: radius, refraction: strength, "data-testid": "lab-specimen", ...drag.handlers, children: [(0, jsx_runtime_1.jsxs)("button", { type: "button", className: "specimen-grip", "aria-label": "\u79FB\u52A8\u73BB\u7483\u8BD5\u6837\uFF08\u65B9\u5411\u952E\u5FAE\u8C03\uFF09", onKeyDown: e => {
                                                    const step = e.shiftKey ? 40 : 12;
                                                    if (e.key === 'ArrowLeft') {
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
                                                    }
                                                }, children: [(0, jsx_runtime_1.jsx)("i", {}), (0, jsx_runtime_1.jsx)("i", {}), (0, jsx_runtime_1.jsx)("i", {})] }), (0, jsx_runtime_1.jsx)("span", { className: "specimen-symbol", children: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "layer", size: 28 }) }), (0, jsx_runtime_1.jsx)("span", { className: "specimen-overline", children: "LIQUID / 01" }), (0, jsx_runtime_1.jsx)("h2", { children: "\u6709\u539A\u5EA6\u7684\u8F7B\u76C8\u3002" }), (0, jsx_runtime_1.jsx)("p", { children: "\u6298\u5C04\u7559\u5728\u8FB9\u7F18\uFF0C\u6587\u5B57\u4FDD\u6301\u6E05\u6670\u3002" }), (0, jsx_runtime_1.jsxs)(react_2.GlassButton, { material: material, backdropTone: tone, onClick: () => setClicks(c => c + 1), "data-testid": "specimen-action", children: ["\u89E6\u78B0\u4E00\u4E0B ", (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "arrow", size: 16 })] }), (0, jsx_runtime_1.jsx)("span", { role: "status", className: "specimen-status", children: clicks ? `已响应 ${clicks} 次交互` : '拖动我 · 按住看边缘折射加深' })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "lab-preview-hud", children: [(0, jsx_runtime_1.jsx)("span", { children: drag.offset.x || drag.offset.y ? `Δ ${Math.round(drag.offset.x)}, ${Math.round(drag.offset.y)}` : 'DRAG THE GLASS' }), (drag.offset.x || drag.offset.y) ? (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: drag.reset, children: "\u5F52\u4F4D" }) : null] })] }) }), (0, jsx_runtime_1.jsxs)("aside", { className: "inspector", "aria-label": "\u6750\u8D28\u63A7\u5236\u9762\u677F", children: [(0, jsx_runtime_1.jsxs)("div", { className: "inspector-title", children: [(0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "tune", size: 17 }), (0, jsx_runtime_1.jsx)("h2", { children: "\u6750\u8D28\u53C2\u6570" }), (0, jsx_runtime_1.jsx)("span", { children: "LIVE" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "inspector-field", children: [(0, jsx_runtime_1.jsx)("span", { className: "field-label", children: "\u6E32\u67D3\u5668" }), (0, jsx_runtime_1.jsx)(react_2.GlassSegmentedControl, { "aria-label": "\u6E32\u67D3\u5668", density: "compact", value: renderer, onValueChange: v => setRenderer(v), items: [{ value: 'css', label: 'CSS' }, { value: 'svg', label: 'SVG' }, { value: 'auto', label: 'Auto' }] }), (0, jsx_runtime_1.jsx)("p", { className: "field-hint", children: renderer === 'css' ? '模糊 / 底色 / 高光基线' : renderer === 'svg' ? '几何位移图折射边缘' : 'Auto 默认保守 CSS' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "inspector-field", children: [(0, jsx_runtime_1.jsx)("span", { className: "field-label", children: "\u6750\u8D28\u9884\u8BBE" }), (0, jsx_runtime_1.jsx)(react_2.GlassSegmentedControl, { "aria-label": "\u6750\u8D28\u9884\u8BBE", density: "compact", value: material, onValueChange: v => setMaterial(v), items: [{ value: 'regular', label: 'Regular' }, { value: 'clear', label: 'Clear' }] }), (0, jsx_runtime_1.jsx)("p", { className: "field-hint", children: material === 'regular' ? '可读优先，适合文字较多' : '受控媒体场景，更透明' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "inspector-field", children: [(0, jsx_runtime_1.jsx)("span", { className: "field-label", children: "\u80CC\u666F\u4E0A\u4E0B\u6587" }), (0, jsx_runtime_1.jsx)(react_2.GlassSegmentedControl, { "aria-label": "\u80CC\u666F\u4E0A\u4E0B\u6587", density: "compact", value: tone, onValueChange: v => setTone(v), items: [{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }, { value: 'mixed', label: 'Mixed' }] }), (0, jsx_runtime_1.jsx)("p", { className: "field-hint", children: tone === 'dark' ? '已知暗背景' : tone === 'light' ? '亮背景，叠加暗化层' : '未知背景，回退 Regular' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "inspector-field", children: [(0, jsx_runtime_1.jsxs)("div", { className: "field-heading", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u6298\u5C04\u5E45\u5EA6" }), (0, jsx_runtime_1.jsxs)("output", { children: [strength, " px"] })] }), (0, jsx_runtime_1.jsx)(react_2.GlassSlider, { "aria-label": "\u6298\u5C04\u5E45\u5EA6", min: 0, max: 64, value: strength, onValueChange: setStrength, formatValue: v => `${v} px` })] }), (0, jsx_runtime_1.jsxs)("div", { className: "inspector-field", children: [(0, jsx_runtime_1.jsxs)("div", { className: "field-heading", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u51E0\u4F55\u5706\u89D2" }), (0, jsx_runtime_1.jsxs)("output", { children: [radius, " px"] })] }), (0, jsx_runtime_1.jsx)(react_2.GlassSlider, { "aria-label": "\u51E0\u4F55\u5706\u89D2", min: 8, max: 80, value: radius, onValueChange: setRadius })] }), (0, jsx_runtime_1.jsx)("div", { className: "inspector-switch", children: (0, jsx_runtime_1.jsx)(react_2.GlassSwitch, { "aria-label": "\u80CC\u666F\u6F02\u79FB", checked: drift, onCheckedChange: setDrift, label: "\u8BA9\u80CC\u666F\u6F02\u79FB" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "inspector-note", children: [(0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "info", size: 16 }), (0, jsx_runtime_1.jsx)("p", { children: "Clear + Mixed \u4F1A\u56DE\u9000\u4E3A Regular\u3002\u51CF\u5C11\u900F\u660E\u5EA6\u8BBE\u7F6E\u4F18\u5148\u4E8E\u6548\u679C\u9009\u9879\u3002" })] })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "background-selector", role: "group", "aria-label": "\u6D4B\u8BD5\u80CC\u666F", children: exports.backgrounds.map(([value, label]) => (0, jsx_runtime_1.jsxs)("button", { type: "button", className: background === value ? 'is-active' : '', "aria-pressed": background === value, onClick: () => setBackground(value), children: [(0, jsx_runtime_1.jsx)("span", { className: `swatch bg-${value}` }), label] }, value)) }), (0, jsx_runtime_1.jsxs)("section", { className: "section-block", children: [(0, jsx_runtime_1.jsxs)("div", { className: "section-title", children: [(0, jsx_runtime_1.jsx)("h2", { children: "\u4E09\u6761\u8DEF\u5F84\uFF0C\u540C\u4E00\u4E2A\u573A\u666F\u3002" }), (0, jsx_runtime_1.jsx)("span", { children: "CSS / SVG / OPAQUE" })] }), (0, jsx_runtime_1.jsx)("div", { className: "comparison-grid", children: ['css', 'svg', 'opaque'].map(mode => (0, jsx_runtime_1.jsxs)("div", { className: "comparison-card", children: [(0, jsx_runtime_1.jsx)(StressBackground, { kind: background === 'video' ? 'grid' : background, children: (0, jsx_runtime_1.jsx)(react_2.GlassProvider, { transparency: mode === 'opaque' ? 'opaque' : 'system', children: (0, jsx_runtime_1.jsxs)(react_2.GlassSurface, { renderer: mode === 'opaque' ? 'css' : mode, material: "clear", backdropTone: "dark", radius: 28, className: "comparison-specimen", children: [(0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "layer", size: 25 }), (0, jsx_runtime_1.jsx)("strong", { children: "Liquid Glass" }), (0, jsx_runtime_1.jsx)("span", { children: "\u8FB9\u7F18\u3001\u5E95\u8272\u3001\u771F\u5B9E\u6587\u5B57" }), (0, jsx_runtime_1.jsx)(react_2.GlassButton, { density: "compact", children: "\u6309\u4F4F\u8BD5\u8BD5" })] }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "comparison-caption", children: [(0, jsx_runtime_1.jsx)("strong", { children: mode === 'css' ? 'CSS 基线' : mode === 'svg' ? 'SVG 增强' : '不透明回退' }), (0, jsx_runtime_1.jsx)("span", { children: mode === 'svg' ? '背景位移 · 前景不变' : mode === 'css' ? '模糊 / 底色 / 高光' : '优先保障稳定可读' })] })] }, mode)) }), (0, jsx_runtime_1.jsx)("p", { className: "section-note", children: "\u8FD9\u91CC\u6BD4\u8F83\u672C\u9879\u76EE\u4E09\u79CD\u8DEF\u5F84\u3002rdev\u3001Liqui Design \u7684\u7B2C\u4E09\u65B9\u5B9E\u6D4B\u5C1A\u672A\u5B8C\u6210\uFF0C\u8BE6\u89C1 docs/competitor-evaluation.md\uFF1B\u6CA1\u6709\u7528\u6A21\u62DF\u6548\u679C\u5192\u5145\u7ADE\u54C1\u3002" })] }), (0, jsx_runtime_1.jsxs)("section", { className: "code-card", children: [(0, jsx_runtime_1.jsx)(react_3.Text, { variant: "footnote", emphasized: true, tone: "accent", children: "\u5F53\u524D\u914D\u7F6E" }), (0, jsx_runtime_1.jsx)(code_block_js_1.CodeBlock, { code: `<GlassSurface\n  material="${material}"\n  backdropTone="${tone}"\n  renderer="${renderer}"\n  radius={${radius}}\n  refraction={${strength}}\n>\n  <h2>有厚度的轻盈。</h2>\n</GlassSurface>` })] })] });
}

},
"app/pages/overview.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverviewPage = OverviewPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@liquid-glass-ui/react");
const page_js_1 = require("../site/page.js");
const media_viewer_js_1 = require("../media-viewer.js");
const index_js_1 = require("../catalog/index.js");
const icons_js_1 = require("../icons.js");
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
function OverviewPage({ go }) {
    return (0, jsx_runtime_1.jsxs)(page_js_1.Page, { title: "\u8F7B\u76C8\u6709\u5F62\uFF0C\u6E05\u6670\u5982\u521D\u3002", lede: "\u4E00\u5957\u9075\u5FAA Apple \u8BBE\u8BA1\u8BED\u8A00\u7684 React \u7EC4\u4EF6\u7CFB\u7EDF\uFF1A\u5185\u5BB9\u5C42\u4E0E\u64CD\u4F5C\u5C42\u5206\u5F00\uFF0C\u6750\u8D28\u53EA\u7528\u5728\u8BE5\u7528\u7684\u5730\u65B9\uFF0C\u4EA4\u4E92\u7EC6\u8282\u6309 HIG \u5B9E\u73B0\u5230\u4F4D\u3002", children: [(0, jsx_runtime_1.jsxs)("div", { className: "hero-actions", children: [(0, jsx_runtime_1.jsxs)(react_1.GlassButton, { variant: "glassProminent", controlSize: "large", onClick: () => go('components'), children: ["\u6D4F\u89C8 ", index_js_1.componentDocs.length, " \u4E2A\u7EC4\u4EF6", (0, jsx_runtime_1.jsx)(react_1.LibraryIcon, { name: "chevronForward", size: 17 })] }), (0, jsx_runtime_1.jsx)(react_1.GlassButton, { variant: "gray", controlSize: "large", onClick: () => go('guides/install'), children: "\u63A5\u5165\u6307\u5357" })] }), (0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u4E00\u4E2A\u771F\u5B9E\u573A\u666F", description: "\u73BB\u7483\u627F\u8F7D\u64CD\u4F5C\uFF0C\u5185\u5BB9\u4FDD\u6301\u6E05\u6670\u3002\u6309\u4F4F\u5DE5\u5177\u680F\u6309\u94AE\uFF0C\u611F\u53D7\u5B83\u4ECE\u73BB\u7483\u4E2D\u6D6E\u8D77\u518D\u56DE\u5F39\u3002", children: (0, jsx_runtime_1.jsx)(media_viewer_js_1.MediaViewer, {}) }), (0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u4E09\u6761\u539F\u5219", children: (0, jsx_runtime_1.jsx)("div", { className: "principles", children: PRINCIPLES.map(item => (0, jsx_runtime_1.jsxs)(react_1.Card, { radius: 20, padding: 20, className: "principle", children: [(0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: item.icon, size: 24 }), (0, jsx_runtime_1.jsx)(react_1.Text, { as: "h3", variant: "headline", style: { marginBlockStart: 12 }, children: item.title }), (0, jsx_runtime_1.jsx)(react_1.Text, { variant: "subhead", tone: "secondary", style: { marginBlockStart: 8 }, children: item.body })] }, item.title)) }) }), (0, jsx_runtime_1.jsx)(page_js_1.Section, { title: "\u8FD9\u5957\u7CFB\u7EDF\u4E0D\u627F\u8BFA\u4EC0\u4E48", description: "\u628A\u8FB9\u754C\u5199\u6E05\u695A\uFF0C\u6BD4\u628A\u6F14\u793A\u505A\u5F97\u66F4\u70AB\u66F4\u6709\u4EF7\u503C\u3002", children: (0, jsx_runtime_1.jsx)(react_1.Card, { fill: "secondary", radius: 20, padding: 20, children: (0, jsx_runtime_1.jsxs)("ul", { className: "plain-list", children: [(0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(react_1.Text, { as: "span", variant: "subhead", children: "\u4E0D\u662F Apple \u5B98\u65B9\u4EA7\u54C1\uFF0C\u4E0D\u5305\u542B Apple \u5B57\u4F53\u3001SF Symbols \u6216\u58C1\u7EB8\u7D20\u6750\u3002\u56FE\u6807\u5168\u90E8\u6309 24\u00D724 / 1.8 \u63CF\u8FB9\u81EA\u7ED8\u3002" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)(react_1.Text, { as: "span", variant: "subhead", children: ["\u80CC\u666F\u8272\u8C03\u7531 ", (0, jsx_runtime_1.jsx)("code", { children: "GlassBackdrop" }), " \u663E\u5F0F\u58F0\u660E\uFF0C\u4E0D\u505A DOM \u622A\u5C4F\u6216\u8DE8\u6E90\u50CF\u7D20\u91C7\u6837\u3002"] }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(react_1.Text, { as: "span", variant: "subhead", children: "\u6027\u80FD\u9875\u8BB0\u5F55\u7684\u662F rAF \u56DE\u8C03\u95F4\u9694\uFF0C\u4E0D\u662F\u5408\u6210\u5668\u5E27\u65F6\u95F4\u3001\u6389\u5E27\u7387\u6216 INP\u3002" }) }), (0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)(react_1.Text, { as: "span", variant: "subhead", children: "\u771F\u673A Chrome \u77E9\u9635\u4E0E\u5C4F\u5E55\u9605\u8BFB\u5668\u4EBA\u5DE5\u9A8C\u8BC1\u4ECD\u662F\u53D1\u5E03\u524D\u95E8\u69DB\uFF0C\u6CA1\u6709\u56E0\u4E3A\u7EC4\u4EF6\u53D8\u591A\u800C\u964D\u4F4E\u3002" }) })] }) }) })] });
}

},
"app/pages/performance.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformancePage = PerformancePage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@liquid-glass-ui/react");
const icons_js_1 = require("../icons.js");
const page_js_1 = require("../site/page.js");
const percentile = (values, p) => [...values].sort((a, b) => a - b)[Math.min(values.length - 1, Math.floor(values.length * p))] ?? 0;
function PerformancePage() {
    const policy = (0, react_2.useGlassPolicy)();
    const [count, setCount] = (0, react_1.useState)(8);
    const [shared, setShared] = (0, react_1.useState)(false);
    const [svg, setSvg] = (0, react_1.useState)(true);
    const [running, setRunning] = (0, react_1.useState)(false);
    const [result, setResult] = (0, react_1.useState)(null);
    const [diagnostics, setDiagnostics] = (0, react_1.useState)((0, react_2.getGlassDiagnostics)());
    const frame = (0, react_1.useRef)(0);
    const finish = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => { const timer = setInterval(() => setDiagnostics((0, react_2.getGlassDiagnostics)()), 750); return () => { clearInterval(timer); cancelAnimationFrame(frame.current); finish.current?.(); }; }, []);
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
            setResult({ kind: 'requestAnimationFrame intervals, NOT GPU frame timings / INP', aborted, date: new Date().toISOString(), userAgent: navigator.userAgent, devicePixelRatio, hardwareConcurrency: navigator.hardwareConcurrency, viewport: [innerWidth, innerHeight], renderer: svg ? 'svg' : 'css', reducedMotion: policy.reduceMotion, mode: shared ? 'shared' : 'independent', count, samples: values.length, p50ms: +percentile(values, .5).toFixed(2), p95ms: +percentile(values, .95).toFixed(2), intervalsOver25ms: values.filter(v => v > 25).length, longTasks, diagnostics: (0, react_2.getGlassDiagnostics)() });
        };
        const onVisibility = () => {
            if (document.hidden)
                stop(true);
        };
        finish.current = () => { completed = true; observer?.disconnect(); document.removeEventListener('visibilitychange', onVisibility); };
        document.addEventListener('visibilitychange', onVisibility);
        const tick = (time) => {
            if (previous)
                values.push(time - previous);
            previous = time;
            if (values.length >= 180)
                stop();
            else
                frame.current = requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
    };
    const download = () => { const url = URL.createObjectURL(new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = 'glass-frame-observation.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); };
    return (0, jsx_runtime_1.jsxs)(page_js_1.Page, { eyebrow: "\u5B9E\u9A8C\u5BA4", title: "\u6027\u80FD\u89C2\u6D4B", lede: "\u5BF9\u7167\u72EC\u7ACB\u8868\u9762\u4E0E\u5171\u4EAB\u8868\u9762\uFF0C\u8BB0\u5F55\u73AF\u5883\u4E0E\u4E3B\u7EBF\u7A0B\u5E27\u56DE\u8C03\u95F4\u9694\u3002\u8FD9\u662F\u8BCA\u65AD\u7EBF\u7D22\uFF0C\u4E0D\u662F\u771F\u673A GPU \u7ED3\u8BBA\u3002", children: [(0, jsx_runtime_1.jsxs)("div", { className: "perf-controls", children: [(0, jsx_runtime_1.jsxs)("label", { children: ["\u8868\u9762\u6570\u91CF", (0, jsx_runtime_1.jsxs)("select", { value: count, disabled: running, onChange: e => setCount(Number(e.target.value)), children: [(0, jsx_runtime_1.jsx)("option", { children: "1" }), (0, jsx_runtime_1.jsx)("option", { children: "8" }), (0, jsx_runtime_1.jsx)("option", { children: "24" }), (0, jsx_runtime_1.jsx)("option", { children: "48" })] })] }), (0, jsx_runtime_1.jsxs)("label", { children: ["\u5E03\u5C40\u7B56\u7565", (0, jsx_runtime_1.jsxs)("select", { value: shared ? 'shared' : 'independent', disabled: running, onChange: e => setShared(e.target.value === 'shared'), children: [(0, jsx_runtime_1.jsx)("option", { value: "independent", children: "\u72EC\u7ACB\u91C7\u6837" }), (0, jsx_runtime_1.jsx)("option", { value: "shared", children: "\u5171\u4EAB\u4E00\u4E2A\u8868\u9762" })] })] }), (0, jsx_runtime_1.jsxs)("label", { children: ["\u6E32\u67D3\u5668", (0, jsx_runtime_1.jsxs)("select", { value: svg ? 'svg' : 'css', disabled: running, onChange: e => setSvg(e.target.value === 'svg'), children: [(0, jsx_runtime_1.jsx)("option", { value: "svg", children: "SVG" }), (0, jsx_runtime_1.jsx)("option", { value: "css", children: "CSS" })] })] }), (0, jsx_runtime_1.jsx)(react_2.GlassButton, { variant: "glassProminent", disabled: running, onClick: run, children: running ? '采样中…' : '开始记录 180 帧回调' })] }), (0, jsx_runtime_1.jsx)(react_2.GlassProvider, { renderer: svg ? 'svg' : 'css', children: (0, jsx_runtime_1.jsx)("div", { className: `perf-stage ${running && !policy.reduceMotion ? 'is-running' : ''}`, children: shared ? (0, jsx_runtime_1.jsx)(react_2.GlassGroup, { className: "perf-shared", children: Array.from({ length: count }, (_, i) => (0, jsx_runtime_1.jsxs)(react_2.GlassButton, { children: ["\u64CD\u4F5C ", i + 1] }, i)) }) : (0, jsx_runtime_1.jsx)("div", { className: "perf-items", children: Array.from({ length: count }, (_, i) => (0, jsx_runtime_1.jsxs)(react_2.GlassSurface, { material: "clear", backdropTone: "dark", className: "perf-item", children: [(0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "layer", size: 17 }), (0, jsx_runtime_1.jsxs)("span", { children: ["Surface ", i + 1] })] }, i)) }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "diagnostic-grid", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { children: "\u7F13\u5B58\u6761\u76EE" }), (0, jsx_runtime_1.jsxs)("strong", { children: [diagnostics.entries, " / ", diagnostics.maxEntries] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { children: "\u7F13\u5B58\u5B57\u7B26\u4E32\u4F30\u7B97" }), (0, jsx_runtime_1.jsxs)("strong", { children: [(diagnostics.bytes / 1024).toFixed(1), " KB"] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { children: "\u7D2F\u8BA1\u8D34\u56FE\u751F\u6210" }), (0, jsx_runtime_1.jsx)("strong", { children: diagnostics.generated })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { children: "\u6D3B\u8DC3\u6750\u8D28\u5C3A\u5BF8\u89C2\u6D4B" }), (0, jsx_runtime_1.jsx)("strong", { children: diagnostics.observers })] })] }), (0, jsx_runtime_1.jsxs)("section", { className: "code-card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "section-title", children: [(0, jsx_runtime_1.jsx)("h2", { children: "\u6D4B\u91CF\u8BB0\u5F55" }), result && (0, jsx_runtime_1.jsx)(react_2.GlassButton, { density: "compact", onClick: download, children: "\u5BFC\u51FA JSON" })] }), (0, jsx_runtime_1.jsx)("pre", { role: "status", children: result ? JSON.stringify(result, null, 2) : '等待采样。记录将包含 UA、DPR、视口、配置与 p50 / p95 帧回调间隔。' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "callout", children: [(0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "info" }), (0, jsx_runtime_1.jsx)("p", { children: "rAF \u95F4\u9694\u548C Long Tasks \u4EC5\u4F5C\u4E3A\u8BCA\u65AD\u7EBF\u7D22\u3002\u5B83\u4EEC\u4E0D\u662F\u5408\u6210\u5668\u5E27\u65F6\u95F4\u3001\u771F\u5B9E\u6389\u5E27\u7387\u3001INP \u6216\u8BBE\u5907 GPU \u6027\u80FD\u3002\u53D1\u5E03\u95E8\u69DB\u4ECD\u9700 DevTools \u5F55\u5236\u4E0E\u76EE\u6807\u8BBE\u5907\u77E9\u9635\u3002" })] })] });
}

},
"app/pages/stress.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StressPage = StressPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@liquid-glass-ui/react");
const lab_js_1 = require("./lab.js");
const icons_js_1 = require("../icons.js");
const page_js_1 = require("../site/page.js");
const fixtures = [
    { name: '常规布局', description: '无额外合成属性的对照。', style: {} },
    { name: '祖先 opacity', description: '祖先透明度可能改变背景采样边界。', style: { opacity: .88 } },
    { name: '祖先 filter', description: '需要观察背景是否被局限到祖先内。', style: { filter: 'contrast(1.03)' } },
    { name: '祖先 mask', description: '遮罩与裁剪是专项回归场景。', style: { maskImage: 'linear-gradient(black 85%,transparent)' } },
    { name: '祖先 transform', description: '形成堆叠上下文不等于所有采样边界。', style: { transform: 'translateZ(0)' } },
    { name: '嵌套共享表面', description: '内层按钮没有独立 backdrop-filter。', style: {} },
];
function StressPage() {
    const [opaque, setOpaque] = (0, react_1.useState)(false);
    const [rtl, setRtl] = (0, react_1.useState)(false);
    return (0, jsx_runtime_1.jsxs)(page_js_1.Page, { eyebrow: "\u5B9E\u9A8C\u5BA4", title: "\u5E03\u5C40\u5939\u5177", lede: "\u628A\u9AD8\u98CE\u9669\u5E03\u5C40\u4FDD\u7559\u6210\u53EF\u91CD\u590D\u7684\u573A\u666F\uFF1A\u7956\u5148 opacity / filter / mask / transform \u4F1A\u6539\u53D8\u80CC\u666F\u91C7\u6837\u8FB9\u754C\u3002\u4E0D\u9760\u968F\u624B\u52A0 z-index \u6216 will-change \u6253\u8865\u4E01\u3002", children: [(0, jsx_runtime_1.jsxs)("div", { className: "page-controls", children: [(0, jsx_runtime_1.jsx)(react_2.GlassSwitch, { "aria-label": "\u538B\u529B\u6D4B\u8BD5\u4F7F\u7528\u4E0D\u900F\u660E\u6750\u8D28", checked: opaque, onCheckedChange: setOpaque, label: "\u4E0D\u900F\u660E\u56DE\u9000" }), (0, jsx_runtime_1.jsx)(react_2.GlassSwitch, { "aria-label": "\u957F\u6807\u7B7E\u538B\u529B", checked: rtl, onCheckedChange: setRtl, label: "\u4E2D\u6587\u957F\u6807\u7B7E" })] }), (0, jsx_runtime_1.jsx)(react_2.GlassProvider, { transparency: opaque ? 'opaque' : 'system', children: (0, jsx_runtime_1.jsx)("div", { className: "stress-grid", children: fixtures.map((fixture, index) => (0, jsx_runtime_1.jsxs)("section", { className: "stress-card", children: [(0, jsx_runtime_1.jsx)(lab_js_1.StressBackground, { kind: "grid", children: (0, jsx_runtime_1.jsxs)("div", { className: "fixture-ancestor", style: fixture.style, children: [index === 5 ? (0, jsx_runtime_1.jsx)(react_2.GlassToolbar, { "aria-label": "\u5D4C\u5957\u5171\u4EAB\u6D4B\u8BD5", children: (0, jsx_runtime_1.jsxs)(react_2.ToolbarGroup, { renderer: "svg", children: [(0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { "aria-label": "\u5D4C\u5957\u5DE5\u5177\u4E00", children: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "layer" }) }), (0, jsx_runtime_1.jsx)(react_2.GlassButton, { children: rtl ? '这是一个包含很长中文标签的操作' : '共享表面' })] }) }) : (0, jsx_runtime_1.jsxs)(react_2.GlassSurface, { renderer: "svg", material: "clear", backdropTone: "dark", className: "fixture-glass", children: [(0, jsx_runtime_1.jsx)("strong", { children: rtl ? '需要验证换行与放大后的中文文本内容' : '背景折射测试' }), (0, jsx_runtime_1.jsx)("span", { children: "Foreground remains DOM." })] }), (0, jsx_runtime_1.jsx)(react_2.GlassPopover, { title: `顶层弹出层：${fixture.name}`, description: "\u68C0\u67E5\u5B83\u662F\u5426\u4ECD\u951A\u5B9A\u3001\u53EF\u89C1\u3001\u53EF\u805A\u7126\uFF0C\u4EE5\u53CA\u5982\u4F55\u91C7\u6837\u9875\u9762\u80CC\u666F\u3002", trigger: (0, jsx_runtime_1.jsx)(react_2.GlassButton, { renderer: "css", children: "\u6D4B\u8BD5\u9876\u5C42\u5F39\u51FA\u5C42" }), children: (0, jsx_runtime_1.jsx)(react_2.GlassButton, { children: "\u53EF\u805A\u7126\u64CD\u4F5C" }) })] }) }), (0, jsx_runtime_1.jsx)("h2", { children: fixture.name }), (0, jsx_runtime_1.jsx)("p", { children: fixture.description })] }, fixture.name)) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "callout", children: [(0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "info" }), (0, jsx_runtime_1.jsx)("p", { children: "\u8FD9\u662F\u89C2\u5BDF\u4E0E\u56DE\u5F52\u5939\u5177\uFF0C\u4E0D\u4EE3\u8868\u6BCF\u79CD\u5E03\u5C40\u90FD\u80FD\u5B9E\u73B0\u540C\u6837\u7684\u6298\u5C04\u3002\u5916\u5C42 filter / opacity / mask \u573A\u666F\u5E94\u6309\u5B9E\u9645\u6548\u679C\u51B3\u5B9A\u662F\u5426\u56DE\u9000 CSS\u3002" })] })] });
}

},
"app/performance.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformancePage = PerformancePage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@liquid-glass-ui/react");
const icons_js_1 = require("./icons.js");
const percentile = (values, p) => [...values].sort((a, b) => a - b)[Math.min(values.length - 1, Math.floor(values.length * p))] ?? 0;
function PerformancePage() {
    const policy = (0, react_2.useGlassPolicy)();
    const [count, setCount] = (0, react_1.useState)(8);
    const [shared, setShared] = (0, react_1.useState)(false);
    const [svg, setSvg] = (0, react_1.useState)(true);
    const [running, setRunning] = (0, react_1.useState)(false);
    const [result, setResult] = (0, react_1.useState)(null);
    const [diagnostics, setDiagnostics] = (0, react_1.useState)((0, react_2.getGlassDiagnostics)());
    const frame = (0, react_1.useRef)(0);
    const finish = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => { const timer = setInterval(() => setDiagnostics((0, react_2.getGlassDiagnostics)()), 750); return () => { clearInterval(timer); cancelAnimationFrame(frame.current); finish.current?.(); }; }, []);
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
            setResult({ kind: 'requestAnimationFrame intervals, NOT GPU frame timings / INP', aborted, date: new Date().toISOString(), userAgent: navigator.userAgent, devicePixelRatio, hardwareConcurrency: navigator.hardwareConcurrency, viewport: [innerWidth, innerHeight], renderer: svg ? 'svg' : 'css', reducedMotion: policy.reduceMotion, mode: shared ? 'shared' : 'independent', count, samples: values.length, p50ms: +percentile(values, .5).toFixed(2), p95ms: +percentile(values, .95).toFixed(2), intervalsOver25ms: values.filter(v => v > 25).length, longTasks, diagnostics: (0, react_2.getGlassDiagnostics)() });
        };
        const onVisibility = () => {
            if (document.hidden)
                stop(true);
        };
        finish.current = () => { completed = true; observer?.disconnect(); document.removeEventListener('visibilitychange', onVisibility); };
        document.addEventListener('visibilitychange', onVisibility);
        const tick = (time) => {
            if (previous)
                values.push(time - previous);
            previous = time;
            if (values.length >= 180)
                stop();
            else
                frame.current = requestAnimationFrame(tick);
        };
        frame.current = requestAnimationFrame(tick);
    };
    const download = () => { const url = URL.createObjectURL(new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = 'glass-frame-observation.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); };
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "page-heading", children: [(0, jsx_runtime_1.jsx)("span", { className: "eyebrow", children: "04 / PERFORMANCE OBSERVATORY" }), (0, jsx_runtime_1.jsx)("h1", { children: "\u6D4B\u91CF\uFF0C\u4E0D\u9760\u611F\u89C9\u3002" }), (0, jsx_runtime_1.jsx)("p", { children: "\u5BF9\u7167\u72EC\u7ACB\u8868\u9762\u4E0E\u5171\u4EAB\u8868\u9762\uFF0C\u8BB0\u5F55\u73AF\u5883\u4E0E\u4E3B\u7EBF\u7A0B\u5E27\u56DE\u8C03\u95F4\u9694\u3002\u4E0D\u5C06\u65E0\u5934\u73AF\u5883\u5305\u88C5\u6210\u771F\u673A GPU \u7ED3\u8BBA\u3002" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "perf-controls", children: [(0, jsx_runtime_1.jsxs)("label", { children: ["\u8868\u9762\u6570\u91CF", (0, jsx_runtime_1.jsxs)("select", { value: count, disabled: running, onChange: e => setCount(Number(e.target.value)), children: [(0, jsx_runtime_1.jsx)("option", { children: "1" }), (0, jsx_runtime_1.jsx)("option", { children: "8" }), (0, jsx_runtime_1.jsx)("option", { children: "24" }), (0, jsx_runtime_1.jsx)("option", { children: "48" })] })] }), (0, jsx_runtime_1.jsxs)("label", { children: ["\u5E03\u5C40\u7B56\u7565", (0, jsx_runtime_1.jsxs)("select", { value: shared ? 'shared' : 'independent', disabled: running, onChange: e => setShared(e.target.value === 'shared'), children: [(0, jsx_runtime_1.jsx)("option", { value: "independent", children: "\u72EC\u7ACB\u91C7\u6837" }), (0, jsx_runtime_1.jsx)("option", { value: "shared", children: "\u5171\u4EAB\u4E00\u4E2A\u8868\u9762" })] })] }), (0, jsx_runtime_1.jsxs)("label", { children: ["\u6E32\u67D3\u5668", (0, jsx_runtime_1.jsxs)("select", { value: svg ? 'svg' : 'css', disabled: running, onChange: e => setSvg(e.target.value === 'svg'), children: [(0, jsx_runtime_1.jsx)("option", { value: "svg", children: "SVG" }), (0, jsx_runtime_1.jsx)("option", { value: "css", children: "CSS" })] })] }), (0, jsx_runtime_1.jsx)(react_2.GlassButton, { variant: "primary", disabled: running, onClick: run, children: running ? '采样中…' : '开始记录 180 帧回调' })] }), (0, jsx_runtime_1.jsx)(react_2.GlassProvider, { renderer: svg ? 'svg' : 'css', children: (0, jsx_runtime_1.jsx)("div", { className: `perf-stage ${running && !policy.reduceMotion ? 'is-running' : ''}`, children: shared ? (0, jsx_runtime_1.jsx)(react_2.GlassGroup, { className: "perf-shared", children: Array.from({ length: count }, (_, i) => (0, jsx_runtime_1.jsxs)(react_2.GlassButton, { children: ["\u64CD\u4F5C ", i + 1] }, i)) }) : (0, jsx_runtime_1.jsx)("div", { className: "perf-items", children: Array.from({ length: count }, (_, i) => (0, jsx_runtime_1.jsxs)(react_2.GlassSurface, { material: "clear", backdropTone: "dark", className: "perf-item", children: [(0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "layer", size: 17 }), (0, jsx_runtime_1.jsxs)("span", { children: ["Surface ", i + 1] })] }, i)) }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "diagnostic-grid", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { children: "\u7F13\u5B58\u6761\u76EE" }), (0, jsx_runtime_1.jsxs)("strong", { children: [diagnostics.entries, " / ", diagnostics.maxEntries] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { children: "\u7F13\u5B58\u5B57\u7B26\u4E32\u4F30\u7B97" }), (0, jsx_runtime_1.jsxs)("strong", { children: [(diagnostics.bytes / 1024).toFixed(1), " KB"] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { children: "\u7D2F\u8BA1\u8D34\u56FE\u751F\u6210" }), (0, jsx_runtime_1.jsx)("strong", { children: diagnostics.generated })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("span", { children: "\u6D3B\u8DC3\u6750\u8D28\u5C3A\u5BF8\u89C2\u6D4B" }), (0, jsx_runtime_1.jsx)("strong", { children: diagnostics.observers })] })] }), (0, jsx_runtime_1.jsxs)("section", { className: "code-card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "section-title", children: [(0, jsx_runtime_1.jsx)("h2", { children: "\u6D4B\u91CF\u8BB0\u5F55" }), result && (0, jsx_runtime_1.jsx)(react_2.GlassButton, { density: "compact", onClick: download, children: "\u5BFC\u51FA JSON" })] }), (0, jsx_runtime_1.jsx)("pre", { role: "status", children: result ? JSON.stringify(result, null, 2) : '等待采样。记录将包含 UA、DPR、视口、配置与 p50 / p95 帧回调间隔。' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "callout", children: [(0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "info" }), (0, jsx_runtime_1.jsx)("p", { children: "rAF \u95F4\u9694\u548C Long Tasks \u4EC5\u4F5C\u4E3A\u8BCA\u65AD\u7EBF\u7D22\u3002\u5B83\u4EEC\u4E0D\u662F\u5408\u6210\u5668\u5E27\u65F6\u95F4\u3001\u771F\u5B9E\u6389\u5E27\u7387\u3001INP \u6216\u8BBE\u5907 GPU \u6027\u80FD\u3002\u53D1\u5E03\u95E8\u69DB\u4ECD\u9700 DevTools \u5F55\u5236\u4E0E\u76EE\u6807\u8BBE\u5907\u77E9\u9635\u3002" })] })] });
}

},
"app/router.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sectionOf = exports.normalize = void 0;
exports.useRoute = useRoute;
const react_1 = require("react");
const normalize = (hash) => {
    const raw = hash.replace(/^#\/?/, '').trim();
    return raw === '' ? 'overview' : raw.replace(/\/+$/, '');
};
exports.normalize = normalize;
/** Minimal hash router. A real app would use its own; this keeps the demo dependency-free. */
function useRoute() {
    const [path, setPath] = (0, react_1.useState)(() => (typeof location === 'undefined' ? 'overview' : (0, exports.normalize)(location.hash)));
    (0, react_1.useEffect)(() => {
        const update = () => { setPath((0, exports.normalize)(location.hash)); window.scrollTo({ top: 0 }); };
        window.addEventListener('hashchange', update);
        return () => window.removeEventListener('hashchange', update);
    }, []);
    const go = (next) => { location.hash = `#/${next}`; };
    return [path, go];
}
const sectionOf = (path) => {
    if (path.startsWith('components'))
        return 'components';
    if (path.startsWith('foundations'))
        return 'foundations';
    if (path.startsWith('labs'))
        return 'labs';
    if (path.startsWith('guides'))
        return 'guides';
    return 'overview';
};
exports.sectionOf = sectionOf;

},
"app/scene.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlpineScene = AlpineScene;
exports.SyntheticVideo = SyntheticVideo;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
/** Original vector study, included as source; no Apple imagery or font assets. */
function AlpineScene({ warm = false, className = '' }) {
    const id = (0, react_1.useId)().replace(/[^a-zA-Z0-9]/g, '');
    return (0, jsx_runtime_1.jsxs)("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 1200 720", preserveAspectRatio: "xMidYMid slice", role: "img", "aria-label": "\u539F\u521B\u6E56\u6CCA\u4E0E\u5C71\u8109\u77E2\u91CF\u573A\u666F", children: [(0, jsx_runtime_1.jsxs)("defs", { children: [(0, jsx_runtime_1.jsxs)("linearGradient", { id: `${id}-sky`, x2: "0", y2: "1", children: [(0, jsx_runtime_1.jsx)("stop", { stopColor: warm ? '#cad3cb' : '#cddcdc' }), (0, jsx_runtime_1.jsx)("stop", { offset: ".58", stopColor: warm ? '#f7d2b7' : '#ede8d4' }), (0, jsx_runtime_1.jsx)("stop", { offset: "1", stopColor: "#c8d5c9" })] }), (0, jsx_runtime_1.jsxs)("linearGradient", { id: `${id}-water`, x2: "0", y2: "1", children: [(0, jsx_runtime_1.jsx)("stop", { stopColor: "#abbfb2" }), (0, jsx_runtime_1.jsx)("stop", { offset: ".42", stopColor: "#608e82" }), (0, jsx_runtime_1.jsx)("stop", { offset: "1", stopColor: "#164c49" })] }), (0, jsx_runtime_1.jsxs)("linearGradient", { id: `${id}-mountain`, x2: "1", y2: "1", children: [(0, jsx_runtime_1.jsx)("stop", { stopColor: "#74938d" }), (0, jsx_runtime_1.jsx)("stop", { offset: "1", stopColor: "#294f4c" })] }), (0, jsx_runtime_1.jsxs)("linearGradient", { id: `${id}-rock`, x2: "1", y2: "1", children: [(0, jsx_runtime_1.jsx)("stop", { stopColor: "#b9c7ba" }), (0, jsx_runtime_1.jsx)("stop", { offset: ".6", stopColor: "#608276" }), (0, jsx_runtime_1.jsx)("stop", { offset: "1", stopColor: "#366159" })] }), (0, jsx_runtime_1.jsxs)("linearGradient", { id: `${id}-mist`, x2: "0", y2: "1", children: [(0, jsx_runtime_1.jsx)("stop", { stopColor: "#f0e9d6", stopOpacity: "0" }), (0, jsx_runtime_1.jsx)("stop", { offset: ".7", stopColor: "#e1e2cb", stopOpacity: ".44" }), (0, jsx_runtime_1.jsx)("stop", { offset: "1", stopColor: "#e1e2cb", stopOpacity: "0" })] }), (0, jsx_runtime_1.jsxs)("radialGradient", { id: `${id}-sun`, children: [(0, jsx_runtime_1.jsx)("stop", { stopColor: "#fff7df", stopOpacity: ".8" }), (0, jsx_runtime_1.jsx)("stop", { offset: "1", stopColor: "#fff7df", stopOpacity: "0" })] })] }), (0, jsx_runtime_1.jsx)("rect", { width: "1200", height: "720", fill: `url(#${id}-sky)` }), (0, jsx_runtime_1.jsx)("ellipse", { cx: "820", cy: "182", rx: "380", ry: "270", fill: `url(#${id}-sun)` }), (0, jsx_runtime_1.jsx)("path", { d: "M-20 392L80 296 132 332 232 216 303 259 371 207 488 306 543 282 649 346 721 306 822 351 898 293 955 306 1100 236 1220 299V467H-20Z", fill: "#a8b9ad" }), (0, jsx_runtime_1.jsx)("path", { d: "M-30 399L82 320 139 352 233 237 297 280 353 240 480 355 547 320 623 369 731 332 811 389 960 323 1199 336V464H-30Z", fill: "#849f94" }), (0, jsx_runtime_1.jsx)("path", { d: "M-40 5L40 14 172 129 220 187 294 235 307 272 420 360 423 411 498 455H-40Z", fill: `url(#${id}-mountain)` }), (0, jsx_runtime_1.jsx)("path", { d: "M-20 33L152 144 210 220 278 255 316 331 382 374 339 394 278 376 242 310 191 277 128 206 72 183 30 118Z", fill: "#91a399", opacity: ".54" }), (0, jsx_runtime_1.jsx)("path", { d: "M8 31L99 155 114 237 174 266 202 352 253 373 280 430 18 445Z", fill: "#325852", opacity: ".6" }), (0, jsx_runtime_1.jsx)("path", { d: "M739 434L789 348 883 307 927 233 976 246 1009 196 1064 94 1131 77 1230 146V474Z", fill: `url(#${id}-rock)` }), (0, jsx_runtime_1.jsx)("path", { d: "M912 352L952 247 979 278 1038 197 1074 98 1122 86 1104 161 1130 206 1110 271 1174 235 1210 285 1200 380Z", fill: "#d6d7c1", opacity: ".66" }), (0, jsx_runtime_1.jsx)("path", { d: "M1067 107L1043 221 996 283 982 348 919 405 1107 420 1210 348 1134 302 1161 226 1107 209 1139 115Z", fill: "#4e7567", opacity: ".6" }), (0, jsx_runtime_1.jsx)("rect", { y: "438", width: "1200", height: "282", fill: `url(#${id}-water)` }), (0, jsx_runtime_1.jsx)("path", { d: "M0 441L300 451 503 473 480 512 350 548 274 605 164 621 113 696 0 720Z", fill: "#2c6258", opacity: ".33" }), (0, jsx_runtime_1.jsx)("path", { d: "M762 443L820 474 899 524 966 545 1037 592 1091 700 1200 720V444Z", fill: "#ccceb2", opacity: ".16" }), (0, jsx_runtime_1.jsx)("g", { stroke: "#dfe6d2", strokeWidth: "1", opacity: ".18", children: (0, jsx_runtime_1.jsx)("path", { d: "M275 484H773M440 493H984M107 513H691M612 528H1140M297 548H600M629 574H888M141 610H377M451 640H898M789 682H1200" }) }), (0, jsx_runtime_1.jsx)("path", { d: "M0 426Q94 405 172 429T315 439L450 448 0 471Z", fill: "#245348" }), (0, jsx_runtime_1.jsx)("path", { d: "M1200 399Q1165 410 1129 409T1016 429L831 444 1200 467Z", fill: "#385f4c" }), (0, jsx_runtime_1.jsx)("g", { fill: "#3a604d", children: (0, jsx_runtime_1.jsx)("path", { d: "M1026 435l10-40 10 40h-20M1064 430l14-64 14 64h-28M1114 422l15-72 15 72h-30M1155 419l13-59 13 59h-26M1178 415l18-85 18 85h-36" }) }), (0, jsx_runtime_1.jsx)("rect", { y: "357", width: "1200", height: "147", fill: `url(#${id}-mist)` }), (0, jsx_runtime_1.jsx)("path", { d: "M0 694L53 677 118 689 141 681 215 708 235 720H0Z", fill: "#173f38" }), (0, jsx_runtime_1.jsx)("path", { d: "M837 720L960 696 1021 708 1064 682 1128 699 1200 658V720Z", fill: "#204c3e" })] });
}
/** Synthetic live video fixture, not a codec or device-GPU performance claim. */
function SyntheticVideo({ playing }) {
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!playing || !ref.current)
            return;
        const video = ref.current;
        const canvas = document.createElement('canvas');
        canvas.width = 960;
        canvas.height = 540;
        const ctx = canvas.getContext('2d');
        if (!ctx || !canvas.captureStream)
            return;
        let frame = 0, start = performance.now();
        const draw = (now) => {
            const phase = (now - start) / 1000;
            const gradient = ctx.createLinearGradient(0, 0, 960, 540);
            gradient.addColorStop(0, '#193f39');
            gradient.addColorStop(.5 + Math.sin(phase / 3) * .2, '#b6c3a8');
            gradient.addColorStop(1, '#648c78');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 960, 540);
            for (let i = 0; i < 15; i++) {
                ctx.fillStyle = `rgba(249,243,210,${.05 + (i % 3) * .025})`;
                ctx.beginPath();
                ctx.ellipse(100 + i * 75 + Math.sin(phase + i) * 80, 80 + (i % 4) * 120, 160, 60, phase / 12, 0, Math.PI * 2);
                ctx.fill();
            }
            frame = requestAnimationFrame(draw);
        };
        draw(start);
        const stream = canvas.captureStream(30);
        video.srcObject = stream;
        void video.play().catch(() => { });
        return () => { cancelAnimationFrame(frame); video.pause(); stream.getTracks().forEach(track => track.stop()); video.srcObject = null; };
    }, [playing]);
    return playing ? (0, jsx_runtime_1.jsx)("video", { ref: ref, muted: true, autoPlay: true, playsInline: true, className: "synthetic-video", "aria-label": "\u5408\u6210\u52A8\u6001\u56FE\u6848\u89C6\u9891\u6D4B\u8BD5\u80CC\u666F" }) : null;
}

},
"app/site/code-block.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeBlock = CodeBlock;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@liquid-glass-ui/react");
function CodeBlock({ code, label = '复制代码', children }) {
    const [copied, setCopied] = (0, react_1.useState)(false);
    const timer = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(() => () => clearTimeout(timer.current), []);
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
    return (0, jsx_runtime_1.jsxs)("div", { className: "code-block", children: [(0, jsx_runtime_1.jsx)("pre", { children: (0, jsx_runtime_1.jsx)("code", { children: children ?? code }) }), (0, jsx_runtime_1.jsxs)(react_2.GlassButton, { className: "code-copy", variant: "gray", controlSize: "small", "aria-label": copied ? '已复制' : label, onClick: () => void copy(), children: [(0, jsx_runtime_1.jsx)(react_2.LibraryIcon, { name: copied ? 'checkmark' : 'plus', size: 14 }), (0, jsx_runtime_1.jsx)("span", { children: copied ? '已复制' : '复制' })] })] });
}

},
"app/site/demo.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Demo = Demo;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@liquid-glass-ui/react");
const scene_js_1 = require("../scene.js");
/**
 * The frame every live example sits in.
 *
 * A glass component that has only been looked at over one background has not been checked:
 * the material takes its colour from behind, so each example can be flipped between the app
 * background and photographic content, in either appearance.
 */
function Demo({ children, backdrop = 'plain', height = 220, label }) {
    const [scheme, setScheme] = (0, react_1.useState)('light');
    const [surface, setSurface] = (0, react_1.useState)(backdrop === 'media' ? 'media' : 'plain');
    const showSurfaceToggle = backdrop === 'both';
    return (0, jsx_runtime_1.jsxs)("figure", { className: "demo", children: [(0, jsx_runtime_1.jsxs)("div", { className: "demo-toolbar", children: [label && (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "caption1", tone: "secondary", className: "demo-label", children: label }), (0, jsx_runtime_1.jsxs)("div", { className: "demo-switches", children: [showSurfaceToggle && (0, jsx_runtime_1.jsx)(react_2.GlassSegmentedControl, { "aria-label": "\u6F14\u793A\u80CC\u666F", density: "compact", value: surface, onValueChange: value => setSurface(value), items: [{ value: 'plain', label: '纯色' }, { value: 'media', label: '图像' }] }), (0, jsx_runtime_1.jsx)(react_2.GlassSegmentedControl, { "aria-label": "\u6F14\u793A\u5916\u89C2", density: "compact", value: scheme, onValueChange: value => setScheme(value), items: [{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "demo-stage", "data-scheme": scheme, "data-surface": surface, style: { minHeight: height }, children: [surface === 'media' && (0, jsx_runtime_1.jsx)("div", { className: "demo-art", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)(scene_js_1.AlpineScene, {}) }), (0, jsx_runtime_1.jsx)(react_2.GlassProvider, { theme: scheme, children: (0, jsx_runtime_1.jsx)(react_2.GlassBackdrop, { tone: surface === 'media' ? 'dark' : 'mixed', className: "demo-content", children: children }) })] })] });
}

},
"app/site/page.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = Page;
exports.Section = Section;
exports.Rule = Rule;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@liquid-glass-ui/react");
/** Page chrome. The heading is a real `h1`; `Text` never infers heading levels on its own. */
function Page({ eyebrow, title, lede, children }) {
    return (0, jsx_runtime_1.jsxs)("article", { className: "page", children: [(0, jsx_runtime_1.jsxs)("header", { className: "page-head", children: [eyebrow && (0, jsx_runtime_1.jsx)(react_1.Text, { variant: "subhead", emphasized: true, tone: "accent", className: "page-eyebrow", children: eyebrow }), (0, jsx_runtime_1.jsx)(react_1.Text, { as: "h1", variant: "largeTitle", emphasized: true, children: title }), lede && (0, jsx_runtime_1.jsx)(react_1.Text, { variant: "callout", tone: "secondary", className: "page-lede", children: lede })] }), children] });
}
function Section({ title, description, children, id }) {
    return (0, jsx_runtime_1.jsxs)("section", { className: "page-section", id: id, children: [(0, jsx_runtime_1.jsx)(react_1.Text, { as: "h2", variant: "title2", emphasized: true, children: title }), description && (0, jsx_runtime_1.jsx)(react_1.Text, { variant: "subhead", tone: "secondary", className: "section-lede", children: description }), children] });
}
/** A short rule quoted from the guidance, so the "why" sits next to the example. */
function Rule({ children }) {
    return (0, jsx_runtime_1.jsx)("aside", { className: "rule-note", children: (0, jsx_runtime_1.jsx)(react_1.Text, { variant: "footnote", tone: "secondary", children: children }) });
}

},
"app/site/preferences.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferencesButton = PreferencesButton;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@liquid-glass-ui/react");
const icons_js_1 = require("../icons.js");
/**
 * The switches this site uses to exercise its own accessibility paths.
 *
 * These are demo overrides layered *on top of* the OS settings, never replacements: a user
 * who has asked the system for reduced transparency keeps it whatever these say.
 */
function PreferencesButton({ value, onChange }) {
    const set = (key, next) => onChange({ ...value, [key]: next });
    return (0, jsx_runtime_1.jsxs)(react_1.GlassPopover, { title: "\u663E\u793A\u504F\u597D", description: "\u8FD9\u4E9B\u5F00\u5173\u53E0\u52A0\u5728\u7CFB\u7EDF\u8BBE\u7F6E\u4E4B\u4E0A\uFF0C\u4E0D\u4F1A\u8986\u76D6\u7CFB\u7EDF\u7684\u51CF\u5C11\u900F\u660E\u5EA6\u6216\u51CF\u5C11\u52A8\u6548\u3002", align: "end", trigger: (0, jsx_runtime_1.jsx)(react_1.GlassIconButton, { "aria-label": "\u6253\u5F00\u663E\u793A\u504F\u597D", variant: "plain", children: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "tune", size: 18 }) }), children: [(0, jsx_runtime_1.jsxs)("div", { className: "pref-group", children: [(0, jsx_runtime_1.jsx)(react_1.Text, { variant: "subhead", emphasized: true, children: "\u5916\u89C2" }), (0, jsx_runtime_1.jsx)(react_1.GlassSegmentedControl, { "aria-label": "\u5916\u89C2", density: "compact", value: value.theme, onValueChange: next => set('theme', next), items: [{ value: 'system', label: '跟随系统' }, { value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "pref-group", children: [(0, jsx_runtime_1.jsx)(react_1.Text, { variant: "subhead", emphasized: true, children: "\u6587\u5B57\u5927\u5C0F" }), (0, jsx_runtime_1.jsx)(react_1.GlassSegmentedControl, { "aria-label": "\u6587\u5B57\u5927\u5C0F", density: "compact", value: value.textSize, onValueChange: next => set('textSize', next), items: [{ value: 'm', label: '小' }, { value: 'l', label: '标准' }, { value: 'xxl', label: '大' }, { value: 'ax3', label: 'AX3' }] }), (0, jsx_runtime_1.jsx)(react_1.Text, { variant: "caption1", tone: "secondary", children: "Dynamic Type \u7684 Web \u7B49\u4EF7\u7269\u3002AX3 \u7528\u6765\u68C0\u67E5\u5E03\u5C40\u662F\u5426\u8FD8\u80FD\u56DE\u6D41\u3002" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "pref-rows", children: [(0, jsx_runtime_1.jsxs)("label", { className: "pref-row", children: [(0, jsx_runtime_1.jsx)(react_1.Text, { as: "span", variant: "subhead", children: "\u51CF\u5C11\u900F\u660E\u5EA6" }), (0, jsx_runtime_1.jsx)(react_1.GlassSwitch, { "aria-label": "\u51CF\u5C11\u900F\u660E\u5EA6", checked: value.opaque, onCheckedChange: next => set('opaque', next) })] }), (0, jsx_runtime_1.jsxs)("label", { className: "pref-row", children: [(0, jsx_runtime_1.jsx)(react_1.Text, { as: "span", variant: "subhead", children: "\u51CF\u5C11\u52A8\u6548" }), (0, jsx_runtime_1.jsx)(react_1.GlassSwitch, { "aria-label": "\u51CF\u5C11\u52A8\u6548", checked: value.reducedMotion, onCheckedChange: next => set('reducedMotion', next) })] }), (0, jsx_runtime_1.jsxs)("label", { className: "pref-row", children: [(0, jsx_runtime_1.jsx)(react_1.Text, { as: "span", variant: "subhead", children: "\u589E\u5F3A\u5BF9\u6BD4\u5EA6" }), (0, jsx_runtime_1.jsx)(react_1.GlassSwitch, { "aria-label": "\u589E\u5F3A\u5BF9\u6BD4\u5EA6", checked: value.moreContrast, onCheckedChange: next => set('moreContrast', next) })] })] })] });
}

},
"app/site/props-table.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropsTable = PropsTable;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@liquid-glass-ui/react");
/**
 * Hand-authored rows mirroring the TypeScript interfaces. Deliberately not generated at
 * runtime: reflection would ship the type metadata to every visitor and still could not
 * explain *why* a prop exists, which is the part worth reading.
 */
function PropsTable({ rows }) {
    if (rows.length === 0)
        return null;
    return (0, jsx_runtime_1.jsx)("div", { className: "props-table-wrap", children: (0, jsx_runtime_1.jsxs)("table", { className: "props-table", children: [(0, jsx_runtime_1.jsx)("caption", { className: "lg-visually-hidden", children: "\u7EC4\u4EF6\u5C5E\u6027" }), (0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { scope: "col", children: "\u5C5E\u6027" }), (0, jsx_runtime_1.jsx)("th", { scope: "col", children: "\u7C7B\u578B" }), (0, jsx_runtime_1.jsx)("th", { scope: "col", children: "\u9ED8\u8BA4\u503C" }), (0, jsx_runtime_1.jsx)("th", { scope: "col", children: "\u8BF4\u660E" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: rows.map(row => (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsxs)("th", { scope: "row", children: [(0, jsx_runtime_1.jsx)("code", { children: row.name }), row.required && (0, jsx_runtime_1.jsx)(react_1.Text, { as: "span", variant: "caption2", tone: "destructive", className: "props-required", children: "\u5FC5\u586B" })] }), (0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("code", { className: "props-type", children: row.type }) }), (0, jsx_runtime_1.jsx)("td", { children: row.default ? (0, jsx_runtime_1.jsx)("code", { children: row.default }) : (0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", children: "\u2014" }) }), (0, jsx_runtime_1.jsx)("td", { children: row.description })] }, row.name)) })] }) });
}

},
"app/site/search.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentSearch = ComponentSearch;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@liquid-glass-ui/react");
const index_js_1 = require("../catalog/index.js");
/** Command-palette style component search. ⌘K / Ctrl-K opens it; Escape closes and restores focus. */
function ComponentSearch({ onNavigate }) {
    const [open, setOpen] = (0, react_1.useState)(false);
    const [query, setQuery] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        const onKey = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                setOpen(true);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);
    const results = (0, index_js_1.searchDocs)(query);
    return (0, jsx_runtime_1.jsxs)(react_2.GlassDialog, { title: "\u641C\u7D22\u7EC4\u4EF6", description: "\u8F93\u5165\u7EC4\u4EF6\u540D\u3001\u5206\u7EC4\u6216\u7528\u9014\u3002\u6309 Escape \u5173\u95ED\u3002", open: open, onOpenChange: next => {
            setOpen(next);
            if (!next)
                setQuery('');
        }, closeLabel: "\u5173\u95ED\u641C\u7D22", trigger: (0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { "aria-label": "\u641C\u7D22\u7EC4\u4EF6\uFF08\u2318K\uFF09", variant: "plain", children: (0, jsx_runtime_1.jsx)(react_2.LibraryIcon, { name: "search", size: 18 }) }), children: [(0, jsx_runtime_1.jsx)(react_2.SearchField, { "aria-label": "\u641C\u7D22\u7EC4\u4EF6", placeholder: "\u6309\u94AE\u3001\u5217\u8868\u3001sheet\u2026", value: query, onValueChange: setQuery, autoFocus: true }), (0, jsx_runtime_1.jsxs)("div", { className: "search-results", children: [query && results.length === 0 && (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "subhead", tone: "secondary", children: "\u6CA1\u6709\u5339\u914D\u7684\u7EC4\u4EF6\u3002\u8BD5\u8BD5\u300C\u6309\u94AE\u300D\u300C\u5217\u8868\u300D\u6216\u300C\u73BB\u7483\u300D\u3002" }), results.length > 0 && (0, jsx_runtime_1.jsx)(react_2.List, { children: (0, jsx_runtime_1.jsx)(react_2.ListSection, { header: `${results.length} 个结果`, children: results.slice(0, 8).map(doc => (0, jsx_runtime_1.jsx)(react_2.ListRow, { label: doc.name, secondaryLabel: doc.summary, value: doc.group, onSelect: () => { setOpen(false); setQuery(''); onNavigate(`components/${doc.slug}`); } }, doc.slug)) }) }), !query && (0, jsx_runtime_1.jsx)(react_2.Text, { variant: "subhead", tone: "secondary", children: "\u63D0\u793A\uFF1A\u968F\u65F6\u6309 \u2318K \u6253\u5F00\u8FD9\u4E2A\u9762\u677F\u3002" })] })] });
}

},
"app/site/shell.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shell = Shell;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@liquid-glass-ui/react");
const icons_js_1 = require("../icons.js");
const preferences_js_1 = require("./preferences.js");
const search_js_1 = require("./search.js");
const router_js_1 = require("../router.js");
const SECTIONS = [
    { key: 'overview', path: 'overview', label: '概览', icon: 'grid' },
    { key: 'foundations', path: 'foundations/materials', label: '基础', icon: 'layer' },
    { key: 'components', path: 'components', label: '组件', icon: 'code' },
    { key: 'labs', path: 'labs/materials', label: '实验室', icon: 'tune' },
    { key: 'guides', path: 'guides/install', label: '指南', icon: 'shield' },
];
const STORAGE = { theme: 'lg-docs-theme', textSize: 'lg-docs-text-size' };
const readStored = (key, fallback) => {
    try {
        return localStorage.getItem(key) ?? fallback;
    }
    catch {
        return fallback;
    }
};
function Shell({ path, go, secondaryNav, children }) {
    const [preferences, setPreferences] = (0, react_1.useState)(() => ({
        theme: readStored(STORAGE.theme, 'system'),
        textSize: readStored(STORAGE.textSize, 'l'),
        opaque: false, reducedMotion: false, moreContrast: false,
    }));
    // Written straight onto <html> so the inline boot script and React agree on one source of truth.
    (0, react_1.useEffect)(() => {
        const root = document.documentElement;
        const dark = preferences.theme === 'dark'
            || (preferences.theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
        root.dataset.appTheme = dark ? 'dark' : 'light';
        root.setAttribute('data-lg-theme', dark ? 'dark' : 'light');
        root.style.colorScheme = dark ? 'dark' : 'light';
        root.dataset.lgTextSize = preferences.textSize;
        try {
            localStorage.setItem(STORAGE.theme, preferences.theme);
            localStorage.setItem(STORAGE.textSize, preferences.textSize);
        }
        catch { /* private mode: the session still works, it just will not be remembered */ }
    }, [preferences.theme, preferences.textSize]);
    // Following the system means re-resolving when the system changes, not only on first load.
    (0, react_1.useEffect)(() => {
        if (preferences.theme !== 'system')
            return;
        const media = matchMedia('(prefers-color-scheme: dark)');
        const sync = () => setPreferences(current => ({ ...current }));
        media.addEventListener('change', sync);
        return () => media.removeEventListener('change', sync);
    }, [preferences.theme]);
    const section = (0, router_js_1.sectionOf)(path);
    const navigate = (target) => (event) => { event.preventDefault(); go(target); };
    return (0, jsx_runtime_1.jsx)(react_2.GlassProvider, { theme: preferences.theme, transparency: preferences.opaque ? 'opaque' : 'system', motion: preferences.reducedMotion ? 'reduced' : 'system', contrast: preferences.moreContrast ? 'more' : 'system', children: (0, jsx_runtime_1.jsx)(react_2.ToastProvider, { children: (0, jsx_runtime_1.jsxs)("div", { className: "app-shell", children: [(0, jsx_runtime_1.jsx)("a", { className: "skip-link", href: "#main", onClick: event => { event.preventDefault(); document.getElementById('main')?.focus(); }, children: "\u8DF3\u5230\u4E3B\u8981\u5185\u5BB9" }), (0, jsx_runtime_1.jsx)(react_2.TabBar, { "aria-label": "\u4E3B\u5BFC\u822A", current: section, minimizeOnScroll: true, sidebarBreakpoint: 1024, sidebarHeader: (0, jsx_runtime_1.jsxs)("a", { className: "wordmark", href: "#/overview", onClick: navigate('overview'), children: [(0, jsx_runtime_1.jsxs)("span", { className: "wordmark-mark", "aria-hidden": "true", children: [(0, jsx_runtime_1.jsx)("i", {}), (0, jsx_runtime_1.jsx)("i", {})] }), (0, jsx_runtime_1.jsx)(react_2.Text, { as: "span", variant: "headline", emphasized: true, children: "Liquid Glass UI" })] }), accessory: secondaryNav, items: SECTIONS.map(item => ({
                            key: item.key, href: `#/${item.path}`, label: item.label,
                            icon: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: item.icon, size: 18 }), onSelect: navigate(item.path),
                        })) }), (0, jsx_runtime_1.jsxs)("div", { className: "app-main", children: [(0, jsx_runtime_1.jsx)("header", { className: "app-bar", children: (0, jsx_runtime_1.jsxs)(react_2.ToolbarGroup, { children: [(0, jsx_runtime_1.jsx)(search_js_1.ComponentSearch, { onNavigate: go }), (0, jsx_runtime_1.jsx)(preferences_js_1.PreferencesButton, { value: preferences, onChange: setPreferences })] }) }), (0, jsx_runtime_1.jsx)("main", { id: "main", tabIndex: -1, className: "app-content", children: (0, jsx_runtime_1.jsx)("div", { className: "page-enter", children: children }, path) }), (0, jsx_runtime_1.jsxs)("footer", { className: "app-footer", children: [(0, jsx_runtime_1.jsx)(react_2.Text, { variant: "caption1", tone: "tertiary", children: "Liquid Glass UI 0.2.0-alpha.1 \u00B7 \u72EC\u7ACB\u8BBE\u8BA1\u7814\u7A76\uFF0C\u975E Apple \u5B98\u65B9\u4EA7\u54C1\uFF0C\u4E0D\u542B Apple \u5B57\u4F53\u3001SF Symbols \u6216\u58C1\u7EB8\u7D20\u6750\u3002" }), (0, jsx_runtime_1.jsxs)("a", { className: "app-footer-link", href: "#/guides/install", onClick: navigate('guides/install'), children: [(0, jsx_runtime_1.jsx)(react_2.Text, { as: "span", variant: "caption1", children: "\u5F00\u59CB\u63A5\u5165" }), (0, jsx_runtime_1.jsx)(react_2.LibraryIcon, { name: "chevronForward", size: 14 })] })] })] })] }) }) });
}

},
"app/stress.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StressPage = StressPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = require("@liquid-glass-ui/react");
const lab_js_1 = require("./lab.js");
const icons_js_1 = require("./icons.js");
const fixtures = [
    { name: '常规布局', description: '无额外合成属性的对照。', style: {} },
    { name: '祖先 opacity', description: '祖先透明度可能改变背景采样边界。', style: { opacity: .88 } },
    { name: '祖先 filter', description: '需要观察背景是否被局限到祖先内。', style: { filter: 'contrast(1.03)' } },
    { name: '祖先 mask', description: '遮罩与裁剪是专项回归场景。', style: { maskImage: 'linear-gradient(black 85%,transparent)' } },
    { name: '祖先 transform', description: '形成堆叠上下文不等于所有采样边界。', style: { transform: 'translateZ(0)' } },
    { name: '嵌套共享表面', description: '内层按钮没有独立 backdrop-filter。', style: {} },
];
function StressPage() {
    const [opaque, setOpaque] = (0, react_1.useState)(false);
    const [rtl, setRtl] = (0, react_1.useState)(false);
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "page-heading", children: [(0, jsx_runtime_1.jsx)("span", { className: "eyebrow", children: "03 / LAYOUT FIXTURES" }), (0, jsx_runtime_1.jsx)("h1", { children: "\u597D\u770B\u4E4B\u5916\uFF0C\u4E5F\u8981\u7ECF\u5F97\u8D77\u53D8\u5316\u3002" }), (0, jsx_runtime_1.jsx)("p", { children: "\u5C06\u9AD8\u98CE\u9669\u5E03\u5C40\u4FDD\u7559\u4E3A\u53EF\u91CD\u590D\u7684\u573A\u666F\uFF1B\u4E0D\u4F9D\u9760\u968F\u610F\u589E\u52A0 z-index \u6216 will-change \u4FEE\u8865\u3002" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "page-controls", children: [(0, jsx_runtime_1.jsx)(react_2.GlassSwitch, { "aria-label": "\u538B\u529B\u6D4B\u8BD5\u4F7F\u7528\u4E0D\u900F\u660E\u6750\u8D28", checked: opaque, onCheckedChange: setOpaque, label: "\u4E0D\u900F\u660E\u56DE\u9000" }), (0, jsx_runtime_1.jsx)(react_2.GlassSwitch, { "aria-label": "\u957F\u6807\u7B7E\u538B\u529B", checked: rtl, onCheckedChange: setRtl, label: "\u4E2D\u6587\u957F\u6807\u7B7E" })] }), (0, jsx_runtime_1.jsx)(react_2.GlassProvider, { transparency: opaque ? 'opaque' : 'system', children: (0, jsx_runtime_1.jsx)("div", { className: "stress-grid", children: fixtures.map((fixture, index) => (0, jsx_runtime_1.jsxs)("section", { className: "stress-card", children: [(0, jsx_runtime_1.jsx)(lab_js_1.StressBackground, { kind: "grid", children: (0, jsx_runtime_1.jsxs)("div", { className: "fixture-ancestor", style: fixture.style, children: [index === 5 ? (0, jsx_runtime_1.jsxs)(react_2.GlassToolbar, { "aria-label": "\u5D4C\u5957\u5171\u4EAB\u6D4B\u8BD5", renderer: "svg", children: [(0, jsx_runtime_1.jsx)(react_2.GlassIconButton, { "aria-label": "\u5D4C\u5957\u5DE5\u5177\u4E00", children: (0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "layer" }) }), (0, jsx_runtime_1.jsx)(react_2.GlassButton, { children: rtl ? '这是一个包含很长中文标签的操作' : '共享表面' })] }) : (0, jsx_runtime_1.jsxs)(react_2.GlassSurface, { renderer: "svg", material: "clear", backdropTone: "dark", className: "fixture-glass", children: [(0, jsx_runtime_1.jsx)("strong", { children: rtl ? '需要验证换行与放大后的中文文本内容' : '背景折射测试' }), (0, jsx_runtime_1.jsx)("span", { children: "Foreground remains DOM." })] }), (0, jsx_runtime_1.jsx)(react_2.GlassPopover, { title: `顶层弹出层：${fixture.name}`, description: "\u68C0\u67E5\u5B83\u662F\u5426\u4ECD\u951A\u5B9A\u3001\u53EF\u89C1\u3001\u53EF\u805A\u7126\uFF0C\u4EE5\u53CA\u5982\u4F55\u91C7\u6837\u9875\u9762\u80CC\u666F\u3002", trigger: (0, jsx_runtime_1.jsx)(react_2.GlassButton, { renderer: "css", children: "\u6D4B\u8BD5\u9876\u5C42\u5F39\u51FA\u5C42" }), children: (0, jsx_runtime_1.jsx)(react_2.GlassButton, { children: "\u53EF\u805A\u7126\u64CD\u4F5C" }) })] }) }), (0, jsx_runtime_1.jsx)("h2", { children: fixture.name }), (0, jsx_runtime_1.jsx)("p", { children: fixture.description })] }, fixture.name)) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "callout", children: [(0, jsx_runtime_1.jsx)(icons_js_1.Icon, { name: "info" }), (0, jsx_runtime_1.jsx)("p", { children: "\u8FD9\u662F\u89C2\u5BDF\u4E0E\u56DE\u5F52\u5939\u5177\uFF0C\u4E0D\u4EE3\u8868\u6BCF\u79CD\u5E03\u5C40\u90FD\u80FD\u5B9E\u73B0\u540C\u6837\u7684\u6298\u5C04\u3002\u5916\u5C42 filter / opacity / mask \u573A\u666F\u5E94\u6309\u5B9E\u9645\u6548\u679C\u51B3\u5B9A\u662F\u5426\u56DE\u9000 CSS\u3002" })] })] });
}

},
"packages/core/browser.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackObserver = trackObserver;
exports.getGlassDiagnostics = getGlassDiagnostics;
exports.clearGlassCache = clearGlassCache;
exports.getDisplacementTexture = getDisplacementTexture;
exports.supportsSvgBackdrop = supportsSvgBackdrop;
const cache_js_1 = require("./cache.js");
const geometry_js_1 = require("./geometry.js");
const maps = new cache_js_1.BoundedCache();
let generated = 0;
let observers = 0;
function trackObserver(delta) { observers = Math.max(0, observers + delta); }
function getGlassDiagnostics() { return { ...maps.stats, generated, observers }; }
function clearGlassCache() { maps.clear(); }
/** Call on the client only. No DOM screenshots or cross-origin pixel reads. */
function getDisplacementTexture(options) {
    if (typeof document === 'undefined')
        return null;
    const key = (0, geometry_js_1.displacementKey)(options), hit = maps.get(key);
    if (hit)
        return hit;
    try {
        const map = (0, geometry_js_1.createDisplacementMap)(options);
        const canvas = document.createElement('canvas');
        canvas.width = map.width;
        canvas.height = map.height;
        const context = canvas.getContext('2d');
        if (!context)
            return null;
        const image = context.createImageData(map.width, map.height);
        image.data.set(map.data);
        context.putImageData(image, 0, 0);
        const value = { url: canvas.toDataURL('image/png'), width: map.cssWidth, height: map.cssHeight };
        maps.set(key, value, value.url.length * 2);
        generated++;
        return value;
    }
    catch {
        return null;
    }
}
/** Syntax detection only; never interpreted as visual correctness or certification. */
function supportsSvgBackdrop() {
    return typeof CSS !== 'undefined' && CSS.supports('backdrop-filter', 'url("#glass-probe")');
}

},
"packages/core/cache.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoundedCache = void 0;
/** Bounded LRU, accounting an explicit approximate retained-byte budget. */
class BoundedCache {
    maxEntries;
    maxBytes;
    entries = new Map();
    bytes = 0;
    constructor(maxEntries = 24, maxBytes = 8 * 1024 * 1024) {
        this.maxEntries = maxEntries;
        this.maxBytes = maxBytes;
        if (!Number.isFinite(maxEntries) || !Number.isFinite(maxBytes) || maxEntries < 1 || maxBytes < 1)
            throw new RangeError('Cache limits must be positive');
    }
    get(key) {
        const entry = this.entries.get(key);
        if (!entry)
            return undefined;
        this.entries.delete(key);
        this.entries.set(key, entry);
        return entry.value;
    }
    set(key, value, bytes) {
        if (!Number.isFinite(bytes) || bytes < 0)
            throw new RangeError('bytes must be finite and nonnegative');
        this.delete(key);
        if (bytes > this.maxBytes)
            return;
        this.entries.set(key, { value, bytes });
        this.bytes += bytes;
        while (this.entries.size > this.maxEntries || this.bytes > this.maxBytes)
            this.delete(this.entries.keys().next().value);
    }
    delete(key) {
        const old = this.entries.get(key);
        if (old)
            this.bytes -= old.bytes;
        this.entries.delete(key);
    }
    clear() { this.entries.clear(); this.bytes = 0; }
    get stats() {
        return { entries: this.entries.size, bytes: this.bytes, maxEntries: this.maxEntries, maxBytes: this.maxBytes };
    }
}
exports.BoundedCache = BoundedCache;

},
"packages/core/concentric.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.concentricRadius = concentricRadius;
exports.concentricInset = concentricInset;
exports.capsuleRadius = capsuleRadius;
function nonNegative(x, name) {
    if (!Number.isFinite(x) || x < 0)
        throw new RangeError(`${name} must be finite and nonnegative`);
    return x;
}
function concentricRadius(containerRadius, inset, options = {}) {
    nonNegative(containerRadius, 'containerRadius');
    nonNegative(inset, 'inset');
    const minimum = nonNegative(options.minimum ?? 0, 'minimum');
    const maximum = options.maximum === undefined ? Infinity : nonNegative(options.maximum, 'maximum');
    if (maximum < minimum)
        throw new RangeError('maximum must be at least minimum');
    return Math.min(maximum, Math.max(minimum, containerRadius - inset));
}
/** The padding that would make a child of `childRadius` concentric inside `containerRadius`. */
function concentricInset(containerRadius, childRadius) {
    nonNegative(containerRadius, 'containerRadius');
    nonNegative(childRadius, 'childRadius');
    return Math.max(0, containerRadius - childRadius);
}
/** Capsule radius for a control of this height: exactly half, never a fixed guess. */
function capsuleRadius(height) {
    return nonNegative(height, 'height') / 2;
}

},
"packages/core/geometry.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clamp = void 0;
exports.roundedRectDistance = roundedRectDistance;
exports.normalizedMapOptions = normalizedMapOptions;
exports.displacementKey = displacementKey;
exports.createDisplacementMap = createDisplacementMap;
exports.smoothUnion = smoothUnion;
const clamp = (x, low, high) => Math.max(low, Math.min(high, x));
exports.clamp = clamp;
function positive(x, name) {
    if (!Number.isFinite(x) || x <= 0 || x > 16384)
        throw new RangeError(`${name} must be finite, positive and at most 16384 CSS pixels`);
    return x;
}
/** Signed distance, negative inside a rounded rectangle, in CSS pixels. */
function roundedRectDistance(x, y, w, h, r) {
    const radius = (0, exports.clamp)(r, 0, Math.min(w, h) / 2);
    const qx = Math.abs(x - w / 2) - (w / 2 - radius);
    const qy = Math.abs(y - h / 2) - (h / 2 - radius);
    return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - radius;
}
function normalizedMapOptions(options) {
    const width = Math.round(positive(options.width, 'width') * 2) / 2;
    const height = Math.round(positive(options.height, 'height') * 2) / 2;
    const radius = options.radius ?? 18;
    const edge = options.edge ?? 16;
    if (!Number.isFinite(radius) || !Number.isFinite(edge))
        throw new RangeError('radius and edge must be finite');
    if (!Number.isFinite(options.maxResolution ?? 256))
        throw new RangeError('resolution must be finite');
    return { width: Math.max(.5, width), height: Math.max(.5, height), radius: (0, exports.clamp)(radius, 0, Math.min(width, height) / 2),
        edge: (0, exports.clamp)(edge, 1, Math.min(width, height) / 2 || 1), maxResolution: (0, exports.clamp)(Math.floor(options.maxResolution ?? 256), 16, 512) };
}
function displacementKey(options) {
    const o = normalizedMapOptions(options);
    return [o.width, o.height, o.radius, o.edge, o.maxResolution].join(':');
}
function createDisplacementMap(options) {
    const o = normalizedMapOptions(options);
    const ratio = Math.min(1, o.maxResolution / Math.max(o.width, o.height), Math.sqrt(131072 / (o.width * o.height)));
    const width = Math.max(1, Math.floor(o.width * ratio));
    const height = Math.max(1, Math.floor(o.height * ratio));
    const data = new Uint8ClampedArray(width * height * 4);
    const distance = (x, y) => roundedRectDistance(x, y, o.width, o.height, o.radius);
    for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
            const px = (x + .5) / width * o.width, py = (y + .5) / height * o.height;
            const d = distance(px, py), i = (y * width + x) * 4;
            data[i] = 128;
            data[i + 1] = 128;
            data[i + 2] = 128;
            data[i + 3] = 255;
            if (d > 0 || d < -o.edge)
                continue;
            const nx = distance(px + .25, py) - distance(px - .25, py);
            const ny = distance(px, py + .25) - distance(px, py - .25);
            const length = Math.hypot(nx, ny) || 1;
            const weight = Math.pow(1 - (0, exports.clamp)(-d / o.edge, 0, 1), 2);
            data[i] = Math.round(127.5 + nx / length * weight * 127.5);
            data[i + 1] = Math.round(127.5 + ny / length * weight * 127.5);
        }
    return { width, height, cssWidth: o.width, cssHeight: o.height, data };
}
/**
 * Polynomial smooth minimum of two signed distances: the union of two shapes with a liquid
 * fillet of blend radius `k` (CSS px) where they meet. Pure maths used to reason about droplet
 * fusion; the render path is an SVG goo filter, never a per-frame rasterisation.
 */
function smoothUnion(d1, d2, k) {
    if (!Number.isFinite(d1) || !Number.isFinite(d2))
        throw new RangeError('distances must be finite');
    if (!Number.isFinite(k) || k <= 0)
        return Math.min(d1, d2);
    const h = (0, exports.clamp)(.5 + .5 * (d2 - d1) / k, 0, 1);
    return d2 + (d1 - d2) * h - k * h * (1 - h);
}

},
"packages/core/index.js": function(module,exports,require){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./geometry.js"), exports);
__exportStar(require("./cache.js"), exports);
__exportStar(require("./browser.js"), exports);
__exportStar(require("./spring.js"), exports);
__exportStar(require("./concentric.js"), exports);

},
"packages/core/spring.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSpring = void 0;
exports.advanceSpring = advanceSpring;
exports.springAtRest = springAtRest;
exports.createSpring = createSpring;
exports.defaultSpring = { stiffness: 320, damping: 22, precision: .05, restVelocity: .5 };
function finite(x, name) {
    if (!Number.isFinite(x))
        throw new RangeError(`${name} must be finite`);
    return x;
}
/**
 * Advance one step. `dt` is seconds and is clamped to 32ms so a backgrounded tab
 * resuming cannot integrate a single huge step and fling the value.
 */
function advanceSpring(state, target, dt, config = {}) {
    const { stiffness, damping } = { ...exports.defaultSpring, ...config };
    finite(state.value, 'value');
    finite(state.velocity, 'velocity');
    finite(target, 'target');
    if (!Number.isFinite(stiffness) || stiffness <= 0)
        throw new RangeError('stiffness must be positive and finite');
    if (!Number.isFinite(damping) || damping < 0)
        throw new RangeError('damping must be nonnegative and finite');
    const step = Math.max(0, Math.min(.032, Number.isFinite(dt) ? dt : .016));
    const acceleration = (target - state.value) * stiffness - state.velocity * damping;
    const velocity = state.velocity + acceleration * step;
    return { value: state.value + velocity * step, velocity };
}
/** True once the spring is close enough to its target to snap and stop the loop. */
function springAtRest(state, target, config = {}) {
    const { precision, restVelocity } = { ...exports.defaultSpring, ...config };
    return Math.abs(target - state.value) < precision && Math.abs(state.velocity) < restVelocity;
}
/**
 * rAF-driven spring. `apply` receives every intermediate value. Call on the client
 * only; without `requestAnimationFrame` it degrades to an immediate jump so SSR and
 * reduced-motion paths stay correct.
 */
function createSpring(initial, apply, config = {}) {
    let state = { value: finite(initial, 'initial'), velocity: 0 };
    let target = initial, frame = 0, last = 0;
    const animated = typeof requestAnimationFrame === 'function';
    const stop = () => {
        if (frame)
            cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
    };
    const step = (now) => {
        const dt = last ? (now - last) / 1000 : .016;
        last = now;
        state = advanceSpring(state, target, dt, config);
        if (springAtRest(state, target, config)) {
            state = { value: target, velocity: 0 };
            apply(state.value);
            stop();
            return;
        }
        apply(state.value);
        frame = requestAnimationFrame(step);
    };
    return {
        to(next) {
            target = finite(next, 'target');
            if (!animated) {
                state = { value: target, velocity: 0 };
                apply(target);
                return;
            }
            if (!frame) {
                last = 0;
                frame = requestAnimationFrame(step);
            }
        },
        set(value) { stop(); state = { value: finite(value, 'value'), velocity: 0 }; target = state.value; apply(state.value); },
        stop,
        get value() { return state.value; },
    };
}

},
"packages/react/button.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlassIconButton = exports.GlassButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_js_1 = require("./material.js");
const surface_js_1 = require("./surface.js");
const utils_js_1 = require("./utils.js");
exports.GlassButton = (0, react_1.forwardRef)(function GlassButton({ material, backdropTone, density, renderer, radius = 'pill', refraction, className, style, children, variant = 'default', loading = false, disabled, independent = false, type = 'button', ...props }, ref) {
    const shared = (0, surface_js_1.useSharedSurface)();
    const glass = (0, material_js_1.useGlassSurface)({ material, backdropTone, density, renderer, radius, refraction }, ref, (shared && !independent) || variant === 'ghost', true);
    return (0, jsx_runtime_1.jsxs)("button", { ...props, ref: glass.ref, type: type, disabled: disabled || loading, "aria-busy": loading || undefined, ...glass.attributes, "data-variant": variant, className: (0, utils_js_1.cx)('lg-root lg-button', className), style: { ...glass.style, ...style }, children: [glass.decoration, (0, jsx_runtime_1.jsxs)("span", { className: "lg-content", children: [loading && (0, jsx_runtime_1.jsx)("span", { className: "lg-spinner", "aria-hidden": "true" }), children] })] });
});
exports.GlassIconButton = (0, react_1.forwardRef)(function GlassIconButton({ className, ...props }, ref) {
    return (0, jsx_runtime_1.jsx)(exports.GlassButton, { ...props, ref: ref, className: (0, utils_js_1.cx)('lg-icon-button', className) });
});

},
"packages/react/content/card.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Concentric = exports.Card = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const utils_js_1 = require("../system/utils.js");
/**
 * A content-layer container. Deliberately not glass: Liquid Glass belongs to the floating
 * control and navigation layer, and a page full of translucent cards is the single most
 * common way an interface stops looking like Apple's. Cards use solid grouped backgrounds
 * so the material above them has something to refract.
 */
exports.Card = (0, react_1.forwardRef)(function Card({ radius = 26, padding = 16, fill = 'grouped', raised = false, className, style, children, ...props }, ref) {
    return (0, jsx_runtime_1.jsx)("div", { ...props, ref: ref, className: (0, utils_js_1.cx)('lg-card', className), "data-fill": fill, "data-raised": raised ? 'true' : undefined, style: { '--lg-radius-container': `${radius}px`, '--lg-concentric-inset': `${padding}px`, padding: `${padding}px`, borderRadius: `${radius}px`, ...style }, children: children });
});
/**
 * Gives a nested element a radius concentric with its container: container radius minus the
 * padding between them, so both corners share a centre of curvature. Getting this wrong is
 * visible — too large reads as a pinched corner, too small as a flared one. Resolved in CSS
 * from the container's own custom properties, so it survives a retune of the radius scale.
 */
exports.Concentric = (0, react_1.forwardRef)(function Concentric({ minimum = 0, className, style, children, ...props }, ref) {
    return (0, jsx_runtime_1.jsx)("div", { ...props, ref: ref, className: (0, utils_js_1.cx)('lg-concentric', className), style: { '--lg-concentric-min': `${minimum}px`, ...style }, children: children });
});

},
"packages/react/content/divider.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Divider = Divider;
const jsx_runtime_1 = require("react/jsx-runtime");
const utils_js_1 = require("../system/utils.js");
/**
 * A separator in the content layer. Bars and toolbars do not need one: their separation
 * comes from the glass and the scroll edge effect, not from a drawn line.
 */
function Divider({ orientation = 'horizontal', inset = 0, className, style, ...props }) {
    return (0, jsx_runtime_1.jsx)("div", { ...props, role: "separator", "aria-orientation": orientation, "data-orientation": orientation, className: (0, utils_js_1.cx)('lg-divider', className), style: { [orientation === 'horizontal' ? 'marginInlineStart' : 'marginBlockStart']: inset ? `${inset}px` : undefined, ...style } });
}

},
"packages/react/content/list.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = List;
exports.ListSection = ListSection;
exports.ListRow = ListRow;
const jsx_runtime_1 = require("react/jsx-runtime");
const utils_js_1 = require("../system/utils.js");
const icon_js_1 = require("../system/icon.js");
const text_js_1 = require("./text.js");
/** A content-layer list. Rows are solid; the glass belongs to the bars floating above them. */
function List({ variant = 'insetGrouped', className, ...props }) {
    return (0, jsx_runtime_1.jsx)("div", { ...props, "data-variant": variant, className: (0, utils_js_1.cx)('lg-list', className) });
}
function ListSection({ header, footer, children, className, ...props }) {
    return (0, jsx_runtime_1.jsxs)("section", { ...props, className: (0, utils_js_1.cx)('lg-list-section', className), children: [header && (0, jsx_runtime_1.jsx)(text_js_1.Text, { as: "h3", variant: "subhead", emphasized: true, tone: "secondary", className: "lg-list-header", children: header }), (0, jsx_runtime_1.jsx)("ul", { className: "lg-list-group", role: "list", children: children }), footer && (0, jsx_runtime_1.jsx)(text_js_1.Text, { variant: "footnote", tone: "secondary", className: "lg-list-footer", children: footer })] });
}
/**
 * One row. Navigating rows render as a real link or button so keyboard and assistive
 * technology get the right affordance — a `div` with an onClick is not a row, it is a trap.
 * Minimum height is the 44pt hit region even when the text is a single short line.
 */
function ListRow({ label, secondaryLabel, value, leading, accessory, href, onSelect, disclosure, destructive, disabled, className }) {
    const interactive = !!href || !!onSelect;
    const showChevron = disclosure ?? (interactive && !accessory);
    const body = (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [leading && (0, jsx_runtime_1.jsx)("span", { className: "lg-row-leading", "aria-hidden": "true", children: leading }), (0, jsx_runtime_1.jsxs)("span", { className: "lg-row-labels", children: [(0, jsx_runtime_1.jsx)(text_js_1.Text, { as: "span", variant: "body", tone: destructive ? 'destructive' : 'primary', className: "lg-row-label", children: label }), secondaryLabel && (0, jsx_runtime_1.jsx)(text_js_1.Text, { as: "span", variant: "footnote", tone: "secondary", className: "lg-row-secondary", children: secondaryLabel })] }), value !== undefined && (0, jsx_runtime_1.jsx)(text_js_1.Text, { as: "span", variant: "body", tone: "secondary", className: "lg-row-value", children: value }), accessory && (0, jsx_runtime_1.jsx)("span", { className: "lg-row-accessory", children: accessory }), showChevron && (0, jsx_runtime_1.jsx)(icon_js_1.LibraryIcon, { name: "chevronForward", size: 17, className: "lg-row-chevron" })] });
    return (0, jsx_runtime_1.jsx)("li", { className: (0, utils_js_1.cx)('lg-list-row', className), "data-interactive": interactive ? 'true' : undefined, "data-disabled": disabled ? 'true' : undefined, children: href
            ? (0, jsx_runtime_1.jsx)("a", { className: "lg-row-hit", href: href, onClick: onSelect, "aria-disabled": disabled || undefined, children: body })
            : onSelect
                ? (0, jsx_runtime_1.jsx)("button", { className: "lg-row-hit", type: "button", onClick: onSelect, disabled: disabled, children: body })
                : (0, jsx_runtime_1.jsx)("div", { className: "lg-row-hit", children: body }) });
}

},
"packages/react/content/material-view.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialView = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const utils_js_1 = require("../system/utils.js");
/**
 * A *standard material* — the content layer's translucency tool, and the right answer
 * whenever the instinct is to reach for glass on something that does not float. It blurs
 * and tints, but it does not lens, does not carry a specular rim and does not flip with its
 * backdrop, because it is part of the content rather than hovering above it.
 *
 * Use vibrant label tones on top (`Text tone="secondary"`), and avoid `quaternary` on the
 * thin and ultraThin variants, where it falls below readable contrast.
 */
exports.MaterialView = (0, react_1.forwardRef)(function MaterialView({ thickness = 'regular', radius = 20, className, style, children, ...props }, ref) {
    return (0, jsx_runtime_1.jsx)("div", { ...props, ref: ref, className: (0, utils_js_1.cx)('lg-material-view', className), "data-thickness": thickness, style: { borderRadius: `${radius}px`, ...style }, children: children });
});

},
"packages/react/content/text.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = Text;
const react_1 = require("react");
const utils_js_1 = require("../system/utils.js");
function Text({ variant = 'body', emphasized = false, tone = 'primary', as = 'p', tabular = false, className, ...props }) {
    return (0, react_1.createElement)(as, {
        ...props,
        'data-variant': variant,
        'data-tone': tone,
        'data-emphasized': emphasized ? 'true' : undefined,
        'data-tabular': tabular ? 'true' : undefined,
        className: (0, utils_js_1.cx)('lg-text', className),
    });
}

},
"packages/react/controls/badge.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlassBadge = GlassBadge;
const jsx_runtime_1 = require("react/jsx-runtime");
const utils_js_1 = require("../system/utils.js");
/**
 * Colour alone never carries the meaning here: the badge always contains a number or a
 * label, and the accessible name spells out what it counts.
 */
function GlassBadge({ count, max = 99, children, tone = 'notification', dot = false, className, ...props }) {
    const text = dot ? null : children ?? (count === undefined ? null : count > max ? `${max}+` : String(count));
    if (!dot && (text === null || text === ''))
        return null;
    return (0, jsx_runtime_1.jsx)("span", { ...props, className: (0, utils_js_1.cx)('lg-badge', className), "data-tone": tone, "data-dot": dot ? 'true' : undefined, children: text });
}

},
"packages/react/controls/button.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlassIconButton = exports.GlassButton = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_js_1 = require("../system/material.js");
const surface_js_1 = require("../system/surface.js");
const utils_js_1 = require("../system/utils.js");
const GLASSY = new Set(['glass', 'glassProminent']);
exports.GlassButton = (0, react_1.forwardRef)(function GlassButton({ material, backdropTone, density, renderer, radius = 'pill', refraction, size, chroma, className, style, children, variant = 'glass', controlSize = 'regular', loading = false, disabled, independent = false, type = 'button', ...props }, ref) {
    const shared = (0, surface_js_1.useSharedSurface)();
    // Flat variants never grow their own glass, and inside a shared surface neither does anything
    // else: the group is the glass, the children are items on it.
    const flat = !GLASSY.has(variant);
    const glass = (0, material_js_1.useGlassSurface)({ material, backdropTone, density, renderer, radius, refraction, size, chroma }, ref, (shared && !independent) || flat, true);
    return (0, jsx_runtime_1.jsxs)("button", { ...props, ref: glass.ref, type: type, disabled: disabled || loading, "aria-busy": loading || undefined, ...glass.attributes, "data-variant": variant, "data-control-size": controlSize, className: (0, utils_js_1.cx)('lg-root lg-button', className), style: { ...glass.style, ...style }, children: [glass.decoration, (0, jsx_runtime_1.jsxs)("span", { className: "lg-content", children: [loading && (0, jsx_runtime_1.jsx)("span", { className: "lg-spinner", "aria-hidden": "true" }), children] })] });
});
exports.GlassIconButton = (0, react_1.forwardRef)(function GlassIconButton({ className, ...props }, ref) {
    return (0, jsx_runtime_1.jsx)(exports.GlassButton, { ...props, ref: ref, className: (0, utils_js_1.cx)('lg-icon-button', className) });
});

},
"packages/react/controls/progress.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlassProgress = GlassProgress;
const jsx_runtime_1 = require("react/jsx-runtime");
const utils_js_1 = require("../system/utils.js");
const core_1 = require("@liquid-glass-ui/core");
/**
 * Determinate whenever the duration is known — an indeterminate spinner tells the user
 * nothing except that the app is still alive. Never blocks the interface: show content as
 * soon as any of it exists, and prefer a skeleton that matches the final layout over a
 * spinner in the middle of an empty page.
 */
function GlassProgress({ value, total = 100, 'aria-label': label, variant = 'bar', className }) {
    if (!Number.isFinite(total) || total <= 0)
        throw new RangeError('GlassProgress requires total > 0');
    const determinate = Number.isFinite(value);
    const fraction = determinate ? (0, core_1.clamp)(value / total, 0, 1) : 0;
    const aria = determinate
        ? { 'aria-valuenow': Math.round(fraction * 100), 'aria-valuemin': 0, 'aria-valuemax': 100 }
        : {};
    return (0, jsx_runtime_1.jsx)("div", { role: "progressbar", "aria-label": label, ...aria, className: (0, utils_js_1.cx)('lg-progress', className), "data-variant": variant, "data-determinate": determinate ? 'true' : 'false', style: { '--lg-progress': fraction }, children: variant === 'bar'
            ? (0, jsx_runtime_1.jsx)("span", { className: "lg-progress-track", children: (0, jsx_runtime_1.jsx)("span", { className: "lg-progress-fill" }) })
            : (0, jsx_runtime_1.jsx)("span", { className: "lg-progress-ring" }) });
}

},
"packages/react/controls/segmented.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lensOrigin = lensOrigin;
exports.useSelectionLens = useSelectionLens;
exports.GlassSegmentedControl = GlassSegmentedControl;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const surface_js_1 = require("../system/surface.js");
const utils_js_1 = require("../system/utils.js");
const pull_js_1 = require("../system/pull.js");
const fusion_js_1 = require("../system/fusion.js");
const provider_js_1 = require("../system/provider.js");
/** Lens centre with its live pull offset removed: when the selection changes mid-drag the lens glides to the new slot while the offset eases to zero. */
function lensOrigin(lens) {
    if (!lens)
        return null;
    const box = lens.getBoundingClientRect();
    const shift = parseFloat(lens.style.getPropertyValue('--lg-shift-x')) || 0;
    return { x: box.left + box.width / 2 - shift, y: box.top + box.height / 2 };
}
/** Measures the selected child and positions a single shared lens that glides between choices. */
function useSelectionLens(root, selector, deps) {
    const [lens, setLens] = (0, react_1.useState)({ opacity: 0 });
    (0, react_1.useEffect)(() => {
        const node = root.current;
        if (!node)
            return;
        const update = () => {
            const target = node.querySelector(selector);
            if (target)
                setLens({ width: target.offsetWidth, height: target.offsetHeight, transform: `translateX(${target.offsetLeft}px)`, opacity: 1 });
            else
                setLens({ opacity: 0 });
        };
        update();
        const observer = new ResizeObserver(update);
        observer.observe(node);
        if (typeof document !== 'undefined' && 'fonts' in document)
            document.fonts.ready.then(update, () => { });
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [root, selector, ...deps]);
    return lens;
}
/**
 * Two to five equal-width segments, text **or** icons but never both mixed. Native radio
 * inputs underneath provide form participation and arrow-key selection.
 *
 * It is a scrubber, not a row of buttons: press the selected segment and slide, and the lens
 * tracks the pointer 1:1, stretches with the drag and updates the selection *live* as it
 * crosses each segment, settling on a spring. This is the interaction most often missing
 * from imitations of the system control.
 */
function GlassSegmentedControl({ items, value, defaultValue, onValueChange, name, disabled, className, 'aria-label': label, ...surface }) {
    const id = (0, react_1.useId)();
    const [selected, setSelected] = (0, utils_js_1.useControllable)(value, defaultValue ?? items.find(x => !x.disabled)?.value ?? '', onValueChange);
    const root = (0, react_1.useRef)(null);
    const policy = (0, provider_js_1.useGlassPolicy)();
    const lens = useSelectionLens(root, '.lg-segment:has(input:checked)', [selected, items]);
    const lensRef = (0, react_1.useRef)(null);
    const fusion = (0, fusion_js_1.useFusion)(root, { itemSelector: '.lg-segment:not([data-disabled="true"])', lensSelector: '.lg-selection-lens' });
    (0, pull_js_1.usePull)(root, {
        axis: 'x', limit: 18, stretch: .8,
        targets: () => lensRef.current ? [lensRef.current] : [],
        origin: () => lensOrigin(lensRef.current),
        disabled: event => !!disabled || !!event.target.closest('[data-disabled="true"]'),
        onPress: event => pick(event), onMove: event => pick(event),
    }, !policy.reduceMotion && !disabled);
    function pick(event) {
        const hit = (0, pull_js_1.elementAt)(event, '.lg-segment');
        const input = hit?.querySelector('input');
        if (input && !input.disabled && input.value !== selected && root.current?.contains(input))
            setSelected(input.value);
    }
    return (0, jsx_runtime_1.jsx)(surface_js_1.GlassSurface, { ...surface, radius: surface.radius ?? 'pill', className: (0, utils_js_1.cx)('lg-segmented', className), children: (0, jsx_runtime_1.jsxs)("div", { className: "lg-segmented-track", ref: root, role: "radiogroup", "aria-label": label, children: [fusion, (0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", className: "lg-selection-lens", ref: lensRef, style: lens }), items.map(item => (0, jsx_runtime_1.jsxs)("label", { className: "lg-segment", "data-disabled": disabled || item.disabled ? 'true' : 'false', children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", name: name ?? `segment-${id}`, value: item.value, checked: selected === item.value, disabled: disabled || item.disabled, onChange: () => setSelected(item.value) }), (0, jsx_runtime_1.jsx)("span", { children: item.label })] }, item.value))] }) });
}

},
"packages/react/controls/slider.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlassSlider = GlassSlider;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const pull_js_1 = require("../system/pull.js");
const material_js_1 = require("../system/material.js");
const provider_js_1 = require("../system/provider.js");
const utils_js_1 = require("../system/utils.js");
const core_1 = require("@liquid-glass-ui/core");
/**
 * A real `<input type="range">` under a drawn track and knob. Rebuilding the input would
 * cost keyboard support, form participation and `aria-valuetext` for nothing.
 *
 * The knob is quiet at rest and **lifts into glass only while it is being manipulated** —
 * a transient control in the content layer, per the Liquid Glass rules. A knob that is
 * permanently glass is glass in the content layer.
 */
function GlassSlider({ value, defaultValue = 50, onValueChange, min = 0, max = 100, step = 1, disabled, name, 'aria-label': label, formatValue, minLabel, maxLabel, className, ...surface }) {
    if (![min, max, step].every(Number.isFinite) || min >= max || step <= 0)
        throw new RangeError('GlassSlider requires finite min < max and step > 0');
    const [current, setCurrent] = (0, utils_js_1.useControllable)(value, defaultValue, onValueChange);
    const safe = (0, core_1.clamp)(Number.isFinite(current) ? current : min, min, max), progress = (safe - min) / (max - min);
    const root = (0, react_1.useRef)(null);
    const policy = (0, provider_js_1.useGlassPolicy)();
    // The knob keeps its glass machinery mounted so the displacement texture is not rebuilt on
    // every press; CSS decides whether that machinery is visible.
    const knob = (0, material_js_1.useGlassSurface)({ ...surface, radius: 'pill' });
    (0, pull_js_1.usePull)(root, {
        limit: 10, stretch: 1,
        targets: () => knob.root.current ? [knob.root.current] : [],
        // Horizontal motion is the value itself; only vertical pull stretches the knob, horizontal shows the lag.
        origin: () => { const box = knob.root.current?.getBoundingClientRect(); return box ? { x: box.left + box.width / 2, y: box.top + box.height / 2 } : null; },
        disabled: () => !!disabled,
    }, !policy.reduceMotion);
    return (0, jsx_runtime_1.jsxs)("div", { ref: root, className: (0, utils_js_1.cx)('lg-slider', className), "data-disabled": disabled ? 'true' : 'false', style: { '--lg-progress': progress }, children: [minLabel && (0, jsx_runtime_1.jsx)("span", { className: "lg-slider-edge", "aria-hidden": "true", children: minLabel }), (0, jsx_runtime_1.jsxs)("span", { className: "lg-slider-rail", children: [(0, jsx_runtime_1.jsx)("span", { className: "lg-slider-track", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)("span", { className: "lg-slider-fill" }) }), (0, jsx_runtime_1.jsx)("span", { ref: knob.ref, ...knob.attributes, className: "lg-root lg-slider-lens", style: knob.style, "aria-hidden": "true", children: knob.decoration }), (0, jsx_runtime_1.jsx)("input", { type: "range", "aria-label": label, "aria-valuetext": formatValue?.(safe), min: min, max: max, step: step, value: safe, disabled: disabled, name: name, onChange: event => setCurrent(Number(event.currentTarget.value)) })] }), maxLabel && (0, jsx_runtime_1.jsx)("span", { className: "lg-slider-edge", "aria-hidden": "true", children: maxLabel })] });
}

},
"packages/react/controls/stepper.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlassStepper = GlassStepper;
const jsx_runtime_1 = require("react/jsx-runtime");
const utils_js_1 = require("../system/utils.js");
const icon_js_1 = require("../system/icon.js");
const core_1 = require("@liquid-glass-ui/core");
/**
 * Two segments sharing one surface, for small integer ranges only — past a handful of taps
 * a slider or a field is the honest control. The value is always visible, either inside the
 * stepper or immediately beside it.
 */
function GlassStepper({ value, defaultValue = 0, onValueChange, min = -Infinity, max = Infinity, step = 1, disabled, 'aria-label': label, formatValue, showValue = true, decrementLabel = 'Decrease', incrementLabel = 'Increase', className, }) {
    if (!Number.isFinite(step) || step <= 0)
        throw new RangeError('GlassStepper requires step > 0');
    if (min >= max)
        throw new RangeError('GlassStepper requires min < max');
    const [current, setCurrent] = (0, utils_js_1.useControllable)(value, defaultValue, onValueChange);
    const safe = (0, core_1.clamp)(Number.isFinite(current) ? current : 0, min, max);
    const shown = formatValue ? formatValue(safe) : String(safe);
    const nudge = (direction) => setCurrent((0, core_1.clamp)(safe + direction * step, min, max));
    return (0, jsx_runtime_1.jsxs)("div", { className: (0, utils_js_1.cx)('lg-stepper', className), role: "group", "aria-label": label, "data-disabled": disabled ? 'true' : undefined, children: [(0, jsx_runtime_1.jsx)("button", { type: "button", className: "lg-stepper-button", "aria-label": decrementLabel, disabled: disabled || safe <= min, onClick: () => nudge(-1), children: (0, jsx_runtime_1.jsx)(icon_js_1.LibraryIcon, { name: "minus", size: 18 }) }), showValue && (0, jsx_runtime_1.jsx)("output", { className: "lg-stepper-value", "aria-live": "off", children: shown }), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "lg-stepper-button", "aria-label": incrementLabel, disabled: disabled || safe >= max, onClick: () => nudge(1), children: (0, jsx_runtime_1.jsx)(icon_js_1.LibraryIcon, { name: "plus", size: 18 }) })] });
}

},
"packages/react/controls/switch.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlassSwitch = GlassSwitch;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const pull_js_1 = require("../system/pull.js");
const material_js_1 = require("../system/material.js");
const utils_js_1 = require("../system/utils.js");
/**
 * A capsule toggle, green when on, over a real `<input type="checkbox" role="switch">`.
 *
 * It is a drag target as well as a tap target: throw the knob and it lands on the nearer
 * side, tracking the pointer 1:1 and stretching along the drag before it springs. A
 * click-only switch is one of the clearest tells that an interface is not Apple's.
 */
function GlassSwitch({ checked, defaultChecked = false, onCheckedChange, disabled, name, 'aria-label': label, label: visibleLabel, className, ...surface }) {
    const id = (0, react_1.useId)();
    const [active, setActive] = (0, utils_js_1.useControllable)(checked, defaultChecked, onCheckedChange);
    const glass = (0, material_js_1.useGlassSurface)({ ...surface, radius: 'pill' });
    const thumb = (0, react_1.useRef)(null);
    const dragged = (0, react_1.useRef)(false);
    const labelRef = (0, react_1.useRef)(null);
    (0, pull_js_1.usePull)(labelRef, {
        axis: 'x', limit: 14, stretch: 1.2,
        targets: () => [thumb.current, glass.root.current].filter(Boolean),
        disabled: () => !!disabled,
        onRelease: ({ dx, cancelled }) => {
            if (cancelled || Math.abs(dx) < 6) {
                dragged.current = false;
                return;
            }
            // A deliberate drag decides by direction and suppresses the label's synthetic click.
            dragged.current = true;
            const next = dx > 0;
            if (next !== active)
                setActive(next);
        },
    }, !glass.policy.reduceMotion);
    return (0, jsx_runtime_1.jsxs)("label", { ref: labelRef, className: (0, utils_js_1.cx)('lg-switch', className), "data-disabled": disabled ? 'true' : 'false', htmlFor: id, onClickCapture: event => {
            if (dragged.current) {
                dragged.current = false;
                event.preventDefault();
                event.stopPropagation();
            }
        }, children: [(0, jsx_runtime_1.jsx)("input", { id: id, type: "checkbox", role: "switch", "aria-label": label, name: name, checked: active, disabled: disabled, onChange: event => setActive(event.currentTarget.checked) }), (0, jsx_runtime_1.jsxs)("span", { ref: glass.ref, ...glass.attributes, className: "lg-root lg-switch-track", "data-checked": active ? 'true' : 'false', style: glass.style, "aria-hidden": "true", children: [glass.decoration, (0, jsx_runtime_1.jsx)("span", { className: "lg-switch-thumb", ref: thumb })] }), visibleLabel && (0, jsx_runtime_1.jsx)("span", { className: "lg-switch-label", children: visibleLabel })] });
}

},
"packages/react/controls.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlassSlider = GlassSlider;
exports.GlassSwitch = GlassSwitch;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const pull_js_1 = require("./pull.js");
const surface_js_1 = require("./surface.js");
const material_js_1 = require("./material.js");
const provider_js_1 = require("./provider.js");
const utils_js_1 = require("./utils.js");
const core_1 = require("@liquid-glass-ui/core");
function GlassSlider({ value, defaultValue = 50, onValueChange, min = 0, max = 100, step = 1, disabled, name, 'aria-label': label, formatValue, className, ...surface }) {
    if (![min, max, step].every(Number.isFinite) || min >= max || step <= 0)
        throw new RangeError('GlassSlider requires finite min < max and step > 0');
    const [current, setCurrent] = (0, utils_js_1.useControllable)(value, defaultValue, onValueChange);
    const safe = (0, core_1.clamp)(Number.isFinite(current) ? current : min, min, max), progress = (safe - min) / (max - min);
    const root = (0, react_1.useRef)(null);
    const lens = (0, react_1.useRef)(null);
    const glassPolicy = (0, provider_js_1.useGlassPolicy)();
    (0, pull_js_1.usePull)(root, {
        limit: 10, stretch: 1,
        targets: () => lens.current ? [lens.current] : [],
        // Horizontal motion is the value itself; only vertical pull stretches the lens, horizontal shows the lag.
        origin: () => { const box = lens.current?.getBoundingClientRect(); return box ? { x: box.left + box.width / 2, y: box.top + box.height / 2 } : null; },
        disabled: () => !!disabled,
    }, !glassPolicy.reduceMotion);
    return (0, jsx_runtime_1.jsxs)("div", { ref: root, className: (0, utils_js_1.cx)('lg-slider', className), "data-disabled": disabled ? 'true' : 'false', style: { '--lg-progress': progress }, children: [(0, jsx_runtime_1.jsx)("span", { className: "lg-slider-track", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)("span", { className: "lg-slider-fill" }) }), (0, jsx_runtime_1.jsx)(surface_js_1.GlassSurface, { ...surface, ref: lens, radius: "pill", className: "lg-slider-lens", "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("input", { type: "range", "aria-label": label, "aria-valuetext": formatValue?.(safe), min: min, max: max, step: step, value: safe, disabled: disabled, name: name, onChange: event => setCurrent(Number(event.currentTarget.value)) })] });
}
function GlassSwitch({ checked, defaultChecked = false, onCheckedChange, disabled, name, 'aria-label': label, label: visibleLabel, className, ...surface }) {
    const id = (0, react_1.useId)();
    const [active, setActive] = (0, utils_js_1.useControllable)(checked, defaultChecked, onCheckedChange);
    const glass = (0, material_js_1.useGlassSurface)({ ...surface, radius: 'pill' });
    const thumb = (0, react_1.useRef)(null);
    const dragged = (0, react_1.useRef)(false);
    const labelRef = (0, react_1.useRef)(null);
    (0, pull_js_1.usePull)(labelRef, {
        axis: 'x', limit: 14, stretch: 1.2,
        targets: () => [thumb.current, glass.root.current].filter(Boolean),
        disabled: () => !!disabled,
        onRelease: ({ dx, cancelled }) => {
            if (cancelled || Math.abs(dx) < 6) {
                dragged.current = false;
                return;
            }
            // A deliberate drag decides by direction and suppresses the label's synthetic click.
            dragged.current = true;
            const next = dx > 0;
            if (next !== active)
                setActive(next);
        },
    }, !glass.policy.reduceMotion);
    return (0, jsx_runtime_1.jsxs)("label", { ref: labelRef, className: (0, utils_js_1.cx)('lg-switch', className), "data-disabled": disabled ? 'true' : 'false', htmlFor: id, onClickCapture: event => {
            if (dragged.current) {
                dragged.current = false;
                event.preventDefault();
                event.stopPropagation();
            }
        }, children: [(0, jsx_runtime_1.jsx)("input", { id: id, type: "checkbox", role: "switch", "aria-label": label, name: name, checked: active, disabled: disabled, onChange: event => setActive(event.currentTarget.checked) }), (0, jsx_runtime_1.jsxs)("span", { ref: glass.ref, ...glass.attributes, className: "lg-root lg-switch-track", "data-checked": active ? 'true' : 'false', style: glass.style, "aria-hidden": "true", children: [glass.decoration, (0, jsx_runtime_1.jsx)("span", { className: "lg-switch-thumb", ref: thumb })] }), visibleLabel && (0, jsx_runtime_1.jsx)("span", { className: "lg-switch-label", children: visibleLabel })] });
}

},
"packages/react/fields/search-field.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchField = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const utils_js_1 = require("../system/utils.js");
const icon_js_1 = require("../system/icon.js");
const material_js_1 = require("../system/material.js");
/**
 * A capsule search field on its own glass surface — top-trailing on wide layouts, and on a
 * phone either the trailing search tab or a field that rises with the keyboard.
 *
 * `type="search"` gives the right on-screen keyboard and the platform's own clear gesture;
 * the drawn clear button is the pointer affordance on top of that. The focus ring lands on
 * the glass container via `:focus-within`, because the input's own outline is suppressed and
 * something has to replace it.
 */
exports.SearchField = (0, react_1.forwardRef)(function SearchField({ value, defaultValue = '', onValueChange, onSubmitQuery, 'aria-label': label, clearLabel = 'Clear search', className, material, backdropTone, density, renderer, radius, refraction, size, chroma, ...props }, ref) {
    const id = (0, react_1.useId)();
    const [query, setQuery] = (0, utils_js_1.useControllable)(value, defaultValue, onValueChange);
    const [input, mergedRef] = (0, utils_js_1.useMergedRef)(ref);
    const glass = (0, material_js_1.useGlassSurface)({ material, backdropTone, density, renderer, radius: radius ?? 'pill', refraction, size, chroma });
    const form = (0, react_1.useRef)(null);
    return (0, jsx_runtime_1.jsx)("form", { ref: form, role: "search", className: (0, utils_js_1.cx)('lg-search', className), onSubmit: event => { event.preventDefault(); onSubmitQuery?.(query); }, children: (0, jsx_runtime_1.jsxs)("div", { ref: glass.ref, ...glass.attributes, className: "lg-root lg-search-box", style: glass.style, children: [glass.decoration, (0, jsx_runtime_1.jsxs)("div", { className: "lg-content", children: [(0, jsx_runtime_1.jsx)(icon_js_1.LibraryIcon, { name: "search", size: 17, className: "lg-search-icon" }), (0, jsx_runtime_1.jsx)("input", { ...props, ref: mergedRef, id: `${id}-search`, type: "search", "aria-label": label, className: "lg-search-input", value: query, onChange: event => setQuery(event.currentTarget.value) }), query !== '' && (0, jsx_runtime_1.jsx)("button", { type: "button", className: "lg-search-clear", "aria-label": clearLabel, onClick: () => { setQuery(''); input.current?.focus(); }, children: (0, jsx_runtime_1.jsx)(icon_js_1.LibraryIcon, { name: "clear", size: 17 }) })] })] }) });
});

},
"packages/react/fields/text-field.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextField = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const utils_js_1 = require("../system/utils.js");
const text_js_1 = require("../content/text.js");
/**
 * A rounded text field with a real `<label for>`.
 *
 * The details that make a web form feel native are all here and all easy to forget:
 * `autocomplete` and `inputmode` should be set by the caller for the field's purpose,
 * the font-size stays at 16px or above so iOS Safari does not zoom on focus, and the focus
 * ring is an `outline` on the container rather than a `box-shadow`.
 */
exports.TextField = (0, react_1.forwardRef)(function TextField({ label, hint, error, leading, trailing, labelHidden = false, className, id, type = 'text', ...props }, ref) {
    const generated = (0, react_1.useId)();
    const fieldId = id ?? `${generated}-field`;
    const hintId = hint ? `${generated}-hint` : undefined;
    const errorId = error ? `${generated}-error` : undefined;
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;
    return (0, jsx_runtime_1.jsxs)("div", { className: (0, utils_js_1.cx)('lg-field', className), "data-invalid": error ? 'true' : undefined, children: [(0, jsx_runtime_1.jsx)(text_js_1.Text, { as: "label", variant: "subhead", emphasized: true, className: (0, utils_js_1.cx)('lg-field-label', labelHidden && 'lg-visually-hidden'), htmlFor: fieldId, children: label }), (0, jsx_runtime_1.jsxs)("div", { className: "lg-field-box", children: [leading && (0, jsx_runtime_1.jsx)("span", { className: "lg-field-leading", "aria-hidden": "true", children: leading }), (0, jsx_runtime_1.jsx)("input", { ...props, ref: ref, id: fieldId, type: type, className: "lg-field-input", "aria-invalid": error ? true : undefined, "aria-describedby": describedBy }), trailing && (0, jsx_runtime_1.jsx)("span", { className: "lg-field-trailing", children: trailing })] }), error && (0, jsx_runtime_1.jsx)(text_js_1.Text, { id: errorId, variant: "footnote", tone: "destructive", className: "lg-field-message", children: error }), hint && !error && (0, jsx_runtime_1.jsx)(text_js_1.Text, { id: hintId, variant: "footnote", tone: "secondary", className: "lg-field-message", children: hint })] });
});

},
"packages/react/fusion.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFusion = useFusion;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const core_1 = require("@liquid-glass-ui/core");
const provider_js_1 = require("./provider.js");
/** Goo pass tuned against 44px pills: 6px blur, then an alpha ramp steep enough to re-crisp the edge. */
const BLUR = 7, SLOPE = 22, INTERCEPT = -9;
/** The alpha threshold pushes a straight edge out by ~0.23 * blur; inset the blobs by the same amount. */
const EDGE = 1.6;
/** Pull distance (px) that fully engages a neighbour, and the widest gap that may still fuse. */
const REACH = 11, GATE = 40;
/** Neighbour lean toward the pressed pill, and its swell at full attraction. */
const LEAN = 4, SWELL = .04;
/** Release fade of a pressed pill, how long the loop outlives it, the lens trail life and the lens settle window. */
const FADE = 220, RELEASE = 320, TRAIL = 300, SETTLE = 560;
/** Hard cap: one pressed pill plus at most two neighbours. */
const BLOBS = 3;
function paint(node, blob) {
    if (!node)
        return;
    if (!blob || blob.w < .5 || blob.h < .5) {
        node.style.width = '0px';
        node.style.height = '0px';
        return;
    }
    node.style.width = `${blob.w.toFixed(2)}px`;
    node.style.height = `${blob.h.toFixed(2)}px`;
    node.style.borderRadius = `${blob.r.toFixed(2)}px`;
    node.style.transform = `translate(${blob.x.toFixed(2)}px,${blob.y.toFixed(2)}px)`;
}
function useFusion(root, options) {
    const policy = (0, provider_js_1.useGlassPolicy)();
    // Reduced motion, reduced transparency (which already covers forced colours and opaque mode) always win.
    const enabled = !policy.reduceMotion && !policy.reduceTransparency && !policy.forcedColors;
    const filterId = `lg-fusion-${(0, react_1.useId)().replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const layer = (0, react_1.useRef)(null);
    const sheen = (0, react_1.useRef)(null);
    const blobs = (0, react_1.useRef)([]);
    const latest = (0, react_1.useRef)(options);
    latest.current = options;
    (0, react_1.useEffect)(() => {
        const host = root.current, box = layer.current;
        if (!host || !box || !enabled)
            return;
        let frame = 0, held = false, releaseAt = 0, deadline = 0;
        let primary = null, neighbours = [], radius = 9999, last = 0;
        /** Smoothed attraction per neighbour, so droplets grow and melt apart with a little liquid lag. */
        const attraction = [0, 0];
        let trail = null, trailAt = 0, transform = '';
        const items = () => Array.from(host.querySelectorAll(latest.current.itemSelector))
            .filter(node => !node.matches(':disabled,[aria-disabled="true"],[data-disabled="true"]') && node.getClientRects().length > 0);
        const stop = () => {
            cancelAnimationFrame(frame);
            frame = 0;
            primary = null;
            neighbours = [];
            trail = null;
            releaseAt = 0;
            last = 0;
            attraction[0] = attraction[1] = 0;
            host.removeAttribute('data-fusion');
            box.style.setProperty('--lg-fusion-fade', '0');
            if (sheen.current)
                sheen.current.style.opacity = '0';
            for (const node of blobs.current)
                paint(node, null);
        };
        const round = (w, h) => Math.min(radius, Math.min(w, h) / 2);
        /** One rAF tick: every rect is read first, then every style is written. */
        const step = () => {
            frame = requestAnimationFrame(step);
            const now = performance.now();
            const source = latest.current.lensSelector ? host.querySelector(latest.current.lensSelector) : primary;
            if (!source) {
                stop();
                return;
            }
            const lens = !!latest.current.lensSelector;
            // --- reads ---
            const lb = box.getBoundingClientRect();
            const pr = source.getBoundingClientRect();
            const rects = lens ? [] : neighbours.map(node => node.getBoundingClientRect());
            const lightX = source.style.getPropertyValue('--lg-light-x') || '50%';
            const lightY = source.style.getPropertyValue('--lg-light-y') || '50%';
            // Pull's own rubber-banded offset: the pressed rect grows around the pointer, so its centre is not a reach.
            const shiftX = parseFloat(source.style.getPropertyValue('--lg-shift-x')) || 0;
            const shiftY = parseFloat(source.style.getPropertyValue('--lg-shift-y')) || 0;
            const smooth = (0, core_1.clamp)((last ? now - last : 16) / 90, 0, 1);
            last = now;
            if (held) {
                releaseAt = 0;
                deadline = now + SETTLE;
            }
            const fade = lens ? 1 : releaseAt ? (0, core_1.clamp)(1 - (now - releaseAt) / FADE, 0, 1) : 1;
            // --- geometry ---
            const px = pr.left - lb.left, py = pr.top - lb.top;
            const cx = px + pr.width / 2, cy = py + pr.height / 2;
            const shapes = [{ x: px + EDGE, y: py + EDGE, w: pr.width - EDGE * 2, h: pr.height - EDGE * 2, r: round(pr.width, pr.height) }];
            if (lens && trail) {
                const age = (0, core_1.clamp)((now - trailAt) / TRAIL, 0, 1), k = 1 - age;
                if (age >= 1)
                    trail = null;
                else {
                    // The old slot collapses in place while drifting after the lens; the goo dissolves it once it is small.
                    const tw = trail.w * k, th = trail.h * k;
                    const tcx = trail.x + trail.w / 2 + (cx - (trail.x + trail.w / 2)) * age * .7;
                    const tcy = trail.y + trail.h / 2 + (cy - (trail.y + trail.h / 2)) * age * .7;
                    shapes.push({ x: tcx - tw / 2, y: tcy - th / 2, w: tw, h: th, r: Math.min(tw, th) / 2 });
                }
            }
            for (let i = 0; i < rects.length; i++) {
                const n = rects[i];
                const nx = n.left - lb.left, ny = n.top - lb.top;
                const ncx = nx + n.width / 2, ncy = ny + n.height / 2;
                const dx = ncx - cx, dy = ncy - cy;
                const horizontal = Math.abs(dx) >= Math.abs(dy);
                const sign = (horizontal ? dx : dy) >= 0 ? 1 : -1;
                const reach = (horizontal ? shiftX : shiftY) * sign;
                const gap = horizontal
                    ? (sign > 0 ? nx - (px + pr.width) : px - (nx + n.width))
                    : (sign > 0 ? ny - (py + pr.height) : py - (ny + n.height));
                const target = gap > GATE ? 0 : (0, core_1.clamp)((reach - 1) / REACH, 0, 1) * fade;
                attraction[i] += (target - attraction[i]) * smooth;
                const d = attraction[i];
                if (d <= .02) {
                    shapes.push(null);
                    continue;
                }
                // A droplet emerges from nothing on the facing edge, then grows into the full neighbour pill.
                const emerge = Math.min(1, d * 4) * (1 + SWELL * d);
                const h0 = n.height * (.34 + .66 * d);
                const bw = Math.min(n.width, h0 + (n.width - h0) * d) * emerge, bh = h0 * emerge;
                const nearX = horizontal ? (sign > 0 ? nx + bw / 2 : nx + n.width - bw / 2) : ncx;
                const nearY = horizontal ? ncy : (sign > 0 ? ny + bh / 2 : ny + n.height - bh / 2);
                const bcx = nearX + (ncx - nearX) * d - (horizontal ? sign * LEAN * d : 0);
                const bcy = nearY + (ncy - nearY) * d - (horizontal ? 0 : sign * LEAN * d);
                shapes.push({ x: bcx - bw / 2, y: bcy - bh / 2, w: bw, h: bh, r: Math.min(bw, bh) / 2 });
            }
            // --- writes ---
            box.style.setProperty('--lg-fusion-fade', fade.toFixed(3));
            for (let i = 0; i < BLOBS; i++)
                paint(blobs.current[i], shapes[i] ?? null);
            const crisp = sheen.current;
            if (crisp) {
                // As the pills become one body the pressed pill's own rim would read as a seam, so it dissolves.
                crisp.style.opacity = (fade * (1 - .8 * Math.max(attraction[0], attraction[1]))).toFixed(3);
                crisp.style.width = `${pr.width.toFixed(2)}px`;
                crisp.style.height = `${pr.height.toFixed(2)}px`;
                crisp.style.borderRadius = `${round(pr.width, pr.height).toFixed(2)}px`;
                crisp.style.transform = `translate(${px.toFixed(2)}px,${py.toFixed(2)}px)`;
                crisp.style.setProperty('--lg-light-x', lightX);
                crisp.style.setProperty('--lg-light-y', lightY);
            }
            if (lens ? now > deadline : releaseAt && now - releaseAt > RELEASE)
                stop();
        };
        const start = () => {
            if (!frame)
                frame = requestAnimationFrame(step);
        };
        const release = () => { held = false; releaseAt = performance.now(); deadline = performance.now() + SETTLE; };
        const detach = () => { window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); };
        const up = () => { release(); detach(); };
        const down = (event) => {
            if (event.button !== 0 || !event.isPrimary)
                return;
            const list = items();
            if (list.length < 2)
                return;
            if (latest.current.lensSelector) {
                if (!host.querySelector(latest.current.lensSelector))
                    return;
            }
            else {
                // itemSelector may be scoped (":scope > ..."), which closest() cannot evaluate; match by containment instead.
                const index = list.findIndex(item => item === event.target || item.contains(event.target));
                if (index < 0)
                    return;
                primary = list[index];
                neighbours = [list[index - 1], list[index + 1]].filter(Boolean);
                attraction[0] = attraction[1] = 0;
                last = 0;
                radius = parseFloat(getComputedStyle(primary).borderTopLeftRadius) || 9999;
            }
            held = true;
            releaseAt = 0;
            deadline = performance.now() + SETTLE;
            host.setAttribute('data-fusion', 'true');
            window.addEventListener('pointerup', up);
            window.addEventListener('pointercancel', up);
            start();
        };
        host.addEventListener('pointerdown', down);
        // Selection lens: any slot change (drag or keyboard) leaves the old position behind as a collapsing droplet.
        let observer;
        const lensNode = latest.current.lensSelector ? host.querySelector(latest.current.lensSelector) : null;
        if (lensNode && typeof MutationObserver !== 'undefined') {
            transform = lensNode.style.transform;
            observer = new MutationObserver(() => {
                const previous = transform;
                if (lensNode.style.transform === previous)
                    return;
                transform = lensNode.style.transform;
                // The first positioning pass is the lens taking its initial slot, not a flow between slots.
                if (!previous || items().length < 2)
                    return;
                const r = lensNode.getBoundingClientRect(), lb = box.getBoundingClientRect();
                trail = { x: r.left - lb.left, y: r.top - lb.top, w: r.width, h: r.height, r: Math.min(r.width, r.height) / 2 };
                trailAt = performance.now();
                deadline = trailAt + SETTLE;
                radius = parseFloat(getComputedStyle(lensNode).borderTopLeftRadius) || 9999;
                host.setAttribute('data-fusion', 'true');
                start();
            });
            observer.observe(lensNode, { attributes: true, attributeFilter: ['style'] });
        }
        return () => { host.removeEventListener('pointerdown', down); detach(); observer?.disconnect(); stop(); };
    }, [root, enabled]);
    if (!enabled)
        return null;
    return (0, jsx_runtime_1.jsxs)("span", { className: "lg-fusion", "aria-hidden": "true", ref: layer, children: [(0, jsx_runtime_1.jsx)("svg", { width: "0", height: "0", className: "lg-filter-defs", focusable: "false", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)("defs", { children: (0, jsx_runtime_1.jsxs)("filter", { id: filterId, x: "-12%", y: "-70%", width: "124%", height: "240%", colorInterpolationFilters: "sRGB", children: [(0, jsx_runtime_1.jsx)("feGaussianBlur", { in: "SourceGraphic", stdDeviation: BLUR, result: "lg-soft" }), (0, jsx_runtime_1.jsx)("feColorMatrix", { in: "lg-soft", type: "matrix", values: `1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${SLOPE} ${INTERCEPT}` })] }) }) }), (0, jsx_runtime_1.jsx)("span", { className: "lg-fusion-goo", style: { filter: `url(#${filterId})` }, children: Array.from({ length: BLOBS }, (_, i) => (0, jsx_runtime_1.jsx)("span", { className: "lg-fusion-blob", ref: node => { blobs.current[i] = node; } }, i)) }), (0, jsx_runtime_1.jsx)("span", { className: "lg-fusion-sheen", ref: sheen })] });
}

},
"packages/react/index.js": function(module,exports,require){
'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSpring = exports.springAtRest = exports.advanceSpring = exports.createSpring = exports.capsuleRadius = exports.concentricInset = exports.concentricRadius = exports.clearGlassCache = exports.getGlassDiagnostics = exports.LibraryIcon = exports.elementAt = exports.attachPull = exports.usePull = exports.useFusion = void 0;
/* System — policy, the material itself, and the primitives every layer shares. */
__exportStar(require("./system/provider.js"), exports);
__exportStar(require("./system/backdrop.js"), exports);
__exportStar(require("./system/material.js"), exports);
__exportStar(require("./system/surface.js"), exports);
var fusion_js_1 = require("./system/fusion.js");
Object.defineProperty(exports, "useFusion", { enumerable: true, get: function () { return fusion_js_1.useFusion; } });
var pull_js_1 = require("./system/pull.js");
Object.defineProperty(exports, "usePull", { enumerable: true, get: function () { return pull_js_1.usePull; } });
Object.defineProperty(exports, "attachPull", { enumerable: true, get: function () { return pull_js_1.attachPull; } });
Object.defineProperty(exports, "elementAt", { enumerable: true, get: function () { return pull_js_1.elementAt; } });
var icon_js_1 = require("./system/icon.js");
Object.defineProperty(exports, "LibraryIcon", { enumerable: true, get: function () { return icon_js_1.LibraryIcon; } });
/* Content layer — solid surfaces and standard materials, never Liquid Glass. */
__exportStar(require("./content/text.js"), exports);
__exportStar(require("./content/card.js"), exports);
__exportStar(require("./content/list.js"), exports);
__exportStar(require("./content/material-view.js"), exports);
__exportStar(require("./content/divider.js"), exports);
/* Controls */
__exportStar(require("./controls/button.js"), exports);
__exportStar(require("./controls/segmented.js"), exports);
__exportStar(require("./controls/slider.js"), exports);
__exportStar(require("./controls/switch.js"), exports);
__exportStar(require("./controls/stepper.js"), exports);
__exportStar(require("./controls/progress.js"), exports);
__exportStar(require("./controls/badge.js"), exports);
/* Fields */
__exportStar(require("./fields/text-field.js"), exports);
__exportStar(require("./fields/search-field.js"), exports);
/* Navigation */
__exportStar(require("./navigation/toolbar.js"), exports);
__exportStar(require("./navigation/tab-bar.js"), exports);
__exportStar(require("./navigation/sidebar.js"), exports);
__exportStar(require("./navigation/nav-bar.js"), exports);
__exportStar(require("./navigation/tabs.js"), exports);
__exportStar(require("./navigation/scroll-edge.js"), exports);
/* Overlays */
__exportStar(require("./overlays/anchor.js"), exports);
__exportStar(require("./overlays/popover.js"), exports);
__exportStar(require("./overlays/menu.js"), exports);
__exportStar(require("./overlays/dialog.js"), exports);
__exportStar(require("./overlays/sheet.js"), exports);
__exportStar(require("./overlays/alert.js"), exports);
__exportStar(require("./overlays/action-sheet.js"), exports);
__exportStar(require("./overlays/toast.js"), exports);
var core_1 = require("@liquid-glass-ui/core");
Object.defineProperty(exports, "getGlassDiagnostics", { enumerable: true, get: function () { return core_1.getGlassDiagnostics; } });
Object.defineProperty(exports, "clearGlassCache", { enumerable: true, get: function () { return core_1.clearGlassCache; } });
Object.defineProperty(exports, "concentricRadius", { enumerable: true, get: function () { return core_1.concentricRadius; } });
Object.defineProperty(exports, "concentricInset", { enumerable: true, get: function () { return core_1.concentricInset; } });
Object.defineProperty(exports, "capsuleRadius", { enumerable: true, get: function () { return core_1.capsuleRadius; } });
Object.defineProperty(exports, "createSpring", { enumerable: true, get: function () { return core_1.createSpring; } });
Object.defineProperty(exports, "advanceSpring", { enumerable: true, get: function () { return core_1.advanceSpring; } });
Object.defineProperty(exports, "springAtRest", { enumerable: true, get: function () { return core_1.springAtRest; } });
Object.defineProperty(exports, "defaultSpring", { enumerable: true, get: function () { return core_1.defaultSpring; } });

},
"packages/react/material.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGlassSurface = useGlassSurface;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const core_1 = require("@liquid-glass-ui/core");
const tokens_1 = require("@liquid-glass-ui/tokens");
const provider_js_1 = require("./provider.js");
const utils_js_1 = require("./utils.js");
const pull_js_1 = require("./pull.js");
function useGlassSurface(options, externalRef, shared = false, pressable = false) {
    const policy = (0, provider_js_1.useGlassPolicy)();
    const [root, ref] = (0, utils_js_1.useMergedRef)(externalRef);
    const id = `lg-${(0, react_1.useId)().replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const [texture, setTexture] = (0, react_1.useState)(null);
    const [capable, setCapable] = (0, react_1.useState)(false);
    const frame = (0, react_1.useRef)(0);
    const displacement = (0, react_1.useRef)(null);
    const refractionAnim = (0, react_1.useRef)(0);
    const requestedMaterial = options.material ?? policy.material;
    const tone = options.backdropTone ?? 'mixed';
    // Unknown backgrounds deliberately use regular, not an unverified auto-contrast heuristic.
    const material = requestedMaterial === 'clear' && tone === 'mixed' ? 'regular' : requestedMaterial;
    const density = options.density ?? policy.density;
    const radius = options.radius ?? tokens_1.densityTokens[density].radius;
    const renderer = options.renderer ?? policy.renderer;
    const wantsSvg = !shared && !policy.reduceTransparency && (renderer === 'svg' || (renderer === 'auto' && policy.enableSvgAuto));
    const spec = tokens_1.materialTokens[material];
    const strength = Number.isFinite(options.refraction) ? (0, core_1.clamp)(options.refraction, 0, 64) : spec.refraction;
    (0, react_1.useEffect)(() => { setCapable((0, core_1.supportsSvgBackdrop)()); }, []);
    (0, react_1.useEffect)(() => {
        const element = root.current;
        if (!element || !wantsSvg || !capable || typeof ResizeObserver === 'undefined') {
            setTexture(null);
            return;
        }
        let queued = 0;
        const update = () => {
            cancelAnimationFrame(queued);
            queued = requestAnimationFrame(() => {
                const width = element.offsetWidth, height = element.offsetHeight;
                if (!width || !height) {
                    setTexture(null);
                    return;
                }
                const r = radius === 'pill' ? Math.min(width, height) / 2 : Math.min(Math.max(0, radius), Math.min(width, height) / 2);
                const next = (0, core_1.getDisplacementTexture)({ width, height, radius: r, edge: spec.edge, maxResolution: policy.quality === 'high' ? 512 : 256 });
                setTexture(previous => previous?.url === next?.url && previous?.width === next?.width && previous?.height === next?.height ? previous : next);
            });
        };
        const observer = new ResizeObserver(update);
        observer.observe(element);
        (0, core_1.trackObserver)(1);
        update();
        return () => { observer.disconnect(); (0, core_1.trackObserver)(-1); cancelAnimationFrame(queued); };
    }, [root, wantsSvg, capable, radius, spec.edge, policy.quality]);
    (0, react_1.useEffect)(() => {
        const node = root.current;
        if (!node || policy.reduceMotion)
            return;
        const setLight = (clientX, clientY) => {
            const box = node.getBoundingClientRect();
            if (!box.width || !box.height)
                return;
            node.style.setProperty('--lg-light-x', `${(0, core_1.clamp)((clientX - box.left) / box.width * 100, 0, 100)}%`);
            node.style.setProperty('--lg-light-y', `${(0, core_1.clamp)((clientY - box.top) / box.height * 100, 0, 100)}%`);
        };
        // The glow enters where the pointer enters, follows it 1:1, and fades out where it left. Position is never reset.
        const onEnter = (event) => {
            if (event.pointerType !== 'mouse')
                return;
            cancelAnimationFrame(frame.current);
            setLight(event.clientX, event.clientY);
            node.setAttribute('data-lit', 'true');
        };
        const onMove = (event) => {
            if (event.pointerType !== 'mouse')
                return;
            cancelAnimationFrame(frame.current);
            frame.current = requestAnimationFrame(() => setLight(event.clientX, event.clientY));
        };
        const onLeave = () => { cancelAnimationFrame(frame.current); node.removeAttribute('data-lit'); };
        // Press origin for every pointer type: the glass swells toward the exact touch / click point.
        const onDown = (event) => { cancelAnimationFrame(frame.current); setLight(event.clientX, event.clientY); };
        // Keyboard activation gets the same press choreography as a pointer (Enter does not set :active in Chrome).
        const onKeyDown = (event) => {
            if ((event.key === 'Enter' || event.key === ' ') && event.target === node && !event.repeat)
                node.setAttribute('data-pressed', 'true');
        };
        const onKeyUp = () => node.removeAttribute('data-pressed');
        node.addEventListener('pointerenter', onEnter);
        node.addEventListener('pointermove', onMove);
        node.addEventListener('pointerleave', onLeave);
        node.addEventListener('pointerdown', onDown);
        node.addEventListener('keydown', onKeyDown);
        node.addEventListener('keyup', onKeyUp);
        node.addEventListener('blur', onKeyUp);
        const detachPull = pressable ? (0, pull_js_1.attachPull)(node, () => ({ disabled: () => node.matches(':disabled,[aria-disabled="true"]') })) : undefined;
        return () => {
            node.removeEventListener('pointerenter', onEnter);
            node.removeEventListener('pointermove', onMove);
            node.removeEventListener('pointerleave', onLeave);
            node.removeEventListener('pointerdown', onDown);
            node.removeEventListener('keydown', onKeyDown);
            node.removeEventListener('keyup', onKeyUp);
            node.removeEventListener('blur', onKeyUp);
            node.removeAttribute('data-pressed');
            node.removeAttribute('data-lit');
            cancelAnimationFrame(frame.current);
            detachPull?.();
        };
    }, [root, policy.reduceMotion, pressable]);
    const active = wantsSvg && capable && texture;
    // Press-time lensing: while the glass is held the edge refraction deepens (like pressing into a droplet) and springs back on release.
    // Only the filter's scale attribute changes; the geometry map is never regenerated.
    (0, react_1.useEffect)(() => {
        const node = root.current;
        if (!node || !active || policy.reduceMotion)
            return;
        let value = strength, velocity = 0, target = strength, last = 0;
        const apply = () => displacement.current?.setAttribute('scale', value.toFixed(2));
        const step = (now) => {
            const dt = Math.min(.032, last ? (now - last) / 1000 : .016);
            last = now;
            // Critically-ish damped spring (stiffness 320, damping 22) with a little overshoot on release.
            const accel = (target - value) * 320 - velocity * 22;
            velocity += accel * dt;
            value += velocity * dt;
            if (Math.abs(target - value) < .05 && Math.abs(velocity) < .5) {
                value = target;
                velocity = 0;
                apply();
                refractionAnim.current = 0;
                return;
            }
            apply();
            refractionAnim.current = requestAnimationFrame(step);
        };
        const go = (next) => {
            target = next;
            if (!refractionAnim.current) {
                last = 0;
                refractionAnim.current = requestAnimationFrame(step);
            }
        };
        const pressed = () => go(Math.min(64, strength * 1.6 + 6));
        const released = () => go(strength);
        const onKey = (event) => {
            if ((event.key === 'Enter' || event.key === ' ') && !event.repeat)
                pressed();
        };
        node.addEventListener('pointerdown', pressed);
        node.addEventListener('keydown', onKey);
        node.addEventListener('keyup', released);
        node.addEventListener('blur', released);
        window.addEventListener('pointerup', released);
        window.addEventListener('pointercancel', released);
        apply();
        return () => {
            cancelAnimationFrame(refractionAnim.current);
            refractionAnim.current = 0;
            node.removeEventListener('pointerdown', pressed);
            node.removeEventListener('keydown', onKey);
            node.removeEventListener('keyup', released);
            node.removeEventListener('blur', released);
            window.removeEventListener('pointerup', released);
            window.removeEventListener('pointercancel', released);
        };
    }, [root, active, strength, policy.reduceMotion]);
    const resolvedRenderer = shared ? 'shared' : policy.reduceTransparency ? 'opaque' : active ? 'svg' : 'css';
    const style = {
        '--lg-radius': radius === 'pill' ? '9999px' : `${Math.max(0, Number.isFinite(radius) ? radius : 18)}px`,
        '--lg-control-height': `${tokens_1.densityTokens[density].controlHeight}px`,
        '--lg-blur': `${spec.blur}px`,
        '--lg-backdrop': active ? `url("#${id}") saturate(${spec.saturation})` : `blur(${spec.blur}px) saturate(${spec.saturation})`,
    };
    const attributes = {
        'data-lg-theme': policy.resolvedTheme, 'data-material': material, 'data-backdrop-tone': tone,
        'data-density': density, 'data-renderer': resolvedRenderer,
        'data-reduced-motion': policy.reduceMotion ? 'true' : 'false',
        'data-transparency': policy.reduceTransparency ? 'opaque' : 'normal',
        'data-forced-colors': policy.forcedColors ? 'true' : 'false',
    };
    const decoration = shared ? null : (0, jsx_runtime_1.jsxs)("span", { className: "lg-decoration", "aria-hidden": "true", children: [active && (0, jsx_runtime_1.jsx)("svg", { width: "0", height: "0", className: "lg-filter-defs", focusable: "false", children: (0, jsx_runtime_1.jsx)("defs", { children: (0, jsx_runtime_1.jsxs)("filter", { id: id, x: -80, y: -80, width: texture.width + 160, height: texture.height + 160, filterUnits: "userSpaceOnUse", primitiveUnits: "userSpaceOnUse", colorInterpolationFilters: "sRGB", children: [(0, jsx_runtime_1.jsx)("feGaussianBlur", { in: "SourceGraphic", stdDeviation: spec.blur / 2, result: "softened" }), (0, jsx_runtime_1.jsx)("feImage", { href: texture.url, x: "0", y: "0", width: texture.width, height: texture.height, preserveAspectRatio: "none", result: "geometry" }), (0, jsx_runtime_1.jsx)("feDisplacementMap", { ref: displacement, in: "softened", in2: "geometry", scale: strength, xChannelSelector: "R", yChannelSelector: "G" })] }) }) }), (0, jsx_runtime_1.jsx)("span", { className: "lg-backdrop" }), (0, jsx_runtime_1.jsx)("span", { className: "lg-tint" }), (0, jsx_runtime_1.jsx)("span", { className: "lg-rim" }), (0, jsx_runtime_1.jsx)("span", { className: "lg-shine" }), (0, jsx_runtime_1.jsx)("span", { className: "lg-glow" })] });
    return { ref, root, style, attributes, decoration, policy };
}

},
"packages/react/navigation/nav-bar.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavigationBar = NavigationBar;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const utils_js_1 = require("../system/utils.js");
const text_js_1 = require("../content/text.js");
/**
 * A large title that hands over to a compact one as it scrolls away.
 *
 * The compact title is hidden while the large title is still on screen — showing both means
 * the same words twice, which is the most common way this pattern is misread. The bar itself
 * carries no background, border or shadow of its own: separation comes from the glass of the
 * control groups inside it and from the scroll edge effect beneath.
 */
function NavigationBar({ title, leading, trailing, largeTitle = true, subtitle, 'aria-label': label, className, children }) {
    const [compact, setCompact] = (0, react_1.useState)(!largeTitle);
    const sentinel = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!largeTitle) {
            setCompact(true);
            return;
        }
        const node = sentinel.current;
        if (!node || typeof IntersectionObserver === 'undefined')
            return;
        const observer = new IntersectionObserver(([entry]) => setCompact(!entry.isIntersecting), { threshold: 0 });
        observer.observe(node);
        return () => observer.disconnect();
    }, [largeTitle]);
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("header", { className: (0, utils_js_1.cx)('lg-navbar', className), "aria-label": label, "data-compact": compact ? 'true' : undefined, children: [(0, jsx_runtime_1.jsx)("div", { className: "lg-navbar-leading", children: leading }), (0, jsx_runtime_1.jsx)("div", { className: "lg-navbar-title", "aria-hidden": "true", children: title }), (0, jsx_runtime_1.jsx)("div", { className: "lg-navbar-trailing", children: trailing })] }), largeTitle && (0, jsx_runtime_1.jsxs)("div", { className: "lg-largetitle", children: [(0, jsx_runtime_1.jsx)(text_js_1.Text, { as: "h1", variant: "largeTitle", emphasized: true, children: title }), subtitle && (0, jsx_runtime_1.jsx)(text_js_1.Text, { variant: "subhead", tone: "secondary", children: subtitle }), (0, jsx_runtime_1.jsx)("div", { ref: sentinel, className: "lg-largetitle-sentinel", "aria-hidden": "true" })] }), children] });
}

},
"packages/react/navigation/scroll-edge.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollEdge = ScrollEdge;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const provider_js_1 = require("../system/provider.js");
const utils_js_1 = require("../system/utils.js");
/**
 * The scroll edge effect: what replaced opaque bar backgrounds and hairline dividers.
 *
 * It is not decoration and not a colour block — it exists only where content actually passes
 * beneath floating UI, and there is exactly one per scroll view. Use it instead of giving a
 * bar its own background: that is precisely the custom bar treatment the new design removes.
 */
function ScrollEdge({ targetRef, edge = 'top', variant = 'soft', height = 44, className }) {
    const [active, setActive] = (0, react_1.useState)(false);
    const policy = (0, provider_js_1.useGlassPolicy)();
    (0, react_1.useEffect)(() => {
        const target = targetRef.current;
        if (!target)
            return;
        let frame = 0;
        const update = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => setActive(edge === 'top'
                ? target.scrollTop > 1
                : target.scrollTop + target.clientHeight < target.scrollHeight - 1));
        };
        const observer = new ResizeObserver(update);
        observer.observe(target);
        if (target.firstElementChild)
            observer.observe(target.firstElementChild);
        const mutation = new MutationObserver(update);
        mutation.observe(target, { childList: true, subtree: true, characterData: true });
        target.addEventListener('scroll', update, { passive: true });
        update();
        return () => { observer.disconnect(); mutation.disconnect(); target.removeEventListener('scroll', update); cancelAnimationFrame(frame); };
    }, [targetRef, edge]);
    return (0, jsx_runtime_1.jsx)("div", { "aria-hidden": "true", className: (0, utils_js_1.cx)('lg-scroll-edge', className), "data-lg-theme": policy.resolvedTheme, "data-edge": edge, "data-variant": variant, "data-active": active ? 'true' : 'false', style: { height: `${height}px` } });
}

},
"packages/react/navigation/sidebar.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const surface_js_1 = require("../system/surface.js");
const utils_js_1 = require("../system/utils.js");
/**
 * An inset, floating sidebar on large glass. Content scrolls *beneath* it rather than being
 * pushed aside, which is why it needs the thicker, non-flipping large material: a surface
 * this big that flipped light/dark as content passed under it would be unreadable.
 *
 * A capsule radius would make a 260x600 panel a lozenge, so large surfaces take a fixed
 * radius. Anything nested inside should be concentric with it.
 */
exports.Sidebar = (0, react_1.forwardRef)(function Sidebar({ 'aria-label': label, header, footer, children, side = 'leading', className, material, backdropTone, density, renderer, radius, refraction, chroma, ...props }, ref) {
    return (0, jsx_runtime_1.jsx)("aside", { ...props, ref: ref, "aria-label": label, className: (0, utils_js_1.cx)('lg-sidebar', className), "data-side": side, children: (0, jsx_runtime_1.jsxs)(surface_js_1.GlassSurface, { material: material, backdropTone: backdropTone, density: density, renderer: renderer, refraction: refraction, chroma: chroma, size: "large", radius: radius ?? 26, className: "lg-sidebar-surface", children: [header && (0, jsx_runtime_1.jsx)("div", { className: "lg-sidebar-header", children: header }), (0, jsx_runtime_1.jsx)("div", { className: "lg-sidebar-body", children: children }), footer && (0, jsx_runtime_1.jsx)("div", { className: "lg-sidebar-footer", children: footer })] }) });
});

},
"packages/react/navigation/tab-bar.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabBar = TabBar;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const surface_js_1 = require("../system/surface.js");
const utils_js_1 = require("../system/utils.js");
const pull_js_1 = require("../system/pull.js");
const provider_js_1 = require("../system/provider.js");
const segmented_js_1 = require("../controls/segmented.js");
const badge_js_1 = require("../controls/badge.js");
/**
 * The app's primary navigation: a floating capsule at the bottom on phones, the same element
 * expanded into a sidebar at regular width.
 *
 * It is a `<nav>` of links with `aria-current="page"`, **not** a tablist — these navigate
 * between sections rather than swapping panels in place. Three to five sections is the usable
 * range; anything more belongs in a sidebar. Tabs navigate, so never put actions in here.
 */
function TabBar({ items, current, search, 'aria-label': label, minimizeOnScroll = false, sidebarBreakpoint = 1024, sidebarHeader, accessory, className, ...surface }) {
    const policy = (0, provider_js_1.useGlassPolicy)();
    const asSidebar = (0, provider_js_1.useMediaQuery)(`(min-width: ${sidebarBreakpoint}px)`);
    const [minimized, setMinimized] = (0, react_1.useState)(false);
    const list = (0, react_1.useRef)(null);
    const lensRef = (0, react_1.useRef)(null);
    const activeKey = items.find(item => item.key === current)?.key ?? (search?.key === current ? current : undefined);
    const lens = (0, segmented_js_1.useSelectionLens)(list, 'a[aria-current="page"]', [activeKey, items.length, asSidebar]);
    (0, pull_js_1.usePull)(list, {
        axis: asSidebar ? 'y' : 'x', limit: 18, stretch: .8,
        targets: () => lensRef.current ? [lensRef.current] : [],
        origin: () => (0, segmented_js_1.lensOrigin)(lensRef.current),
    }, !policy.reduceMotion);
    (0, react_1.useEffect)(() => {
        if (!minimizeOnScroll || asSidebar || policy.reduceMotion) {
            setMinimized(false);
            return;
        }
        let previous = window.scrollY, frame = 0;
        const onScroll = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const y = window.scrollY;
                // Only a deliberate scroll counts, so the bar does not flicker on rubber-banding.
                if (Math.abs(y - previous) > 6) {
                    setMinimized(y > previous && y > 64);
                    previous = y;
                }
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
    }, [minimizeOnScroll, asSidebar, policy.reduceMotion]);
    const link = (item, kind) => (0, jsx_runtime_1.jsxs)("a", { className: "lg-tab-link", "data-kind": kind, href: item.href, "aria-current": item.key === current ? 'page' : undefined, onClick: item.onSelect ? event => item.onSelect(event) : undefined, children: [item.icon && (0, jsx_runtime_1.jsx)("span", { className: "lg-tab-icon", "aria-hidden": "true", children: item.icon }), (0, jsx_runtime_1.jsx)("span", { className: "lg-tab-label", children: item.label }), item.badge !== undefined && (0, jsx_runtime_1.jsx)(badge_js_1.GlassBadge, { count: item.badge, "aria-label": item.badgeLabel, className: "lg-tab-badge" })] }, item.key);
    return (0, jsx_runtime_1.jsxs)("nav", { "aria-label": label, className: (0, utils_js_1.cx)('lg-tabbar', className), "data-layout": asSidebar ? 'sidebar' : 'tabbar', "data-minimized": minimized ? 'true' : undefined, children: [asSidebar && sidebarHeader && (0, jsx_runtime_1.jsx)("div", { className: "lg-tabbar-header", children: sidebarHeader }), (0, jsx_runtime_1.jsx)(surface_js_1.GlassSurface, { ...surface, size: asSidebar ? 'large' : 'small', radius: asSidebar ? 26 : 'pill', className: "lg-tabbar-group", children: (0, jsx_runtime_1.jsxs)("div", { className: "lg-tab-links", ref: list, children: [(0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", className: "lg-selection-lens", ref: lensRef, style: lens }), items.map(item => link(item, 'tab'))] }) }), search && (0, jsx_runtime_1.jsx)(surface_js_1.GlassSurface, { ...surface, size: asSidebar ? 'large' : 'small', radius: asSidebar ? 26 : 'pill', className: "lg-tabbar-group lg-tabbar-search", children: (0, jsx_runtime_1.jsx)("div", { className: "lg-tab-links", children: link(search, 'search') }) }), accessory && (0, jsx_runtime_1.jsx)("div", { className: "lg-tabbar-accessory", children: accessory })] });
}

},
"packages/react/navigation/tabs.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlassTabs = GlassTabs;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const surface_js_1 = require("../system/surface.js");
const utils_js_1 = require("../system/utils.js");
const pull_js_1 = require("../system/pull.js");
const provider_js_1 = require("../system/provider.js");
const segmented_js_1 = require("../controls/segmented.js");
/**
 * In-page tabs that swap content — `role="tablist"` with real panels. This is deliberately
 * not the app's tab bar: navigating between sections of the app is a `<nav>` of links
 * (`TabBar`), because a tablist tells assistive technology the content is swapping in place.
 */
function GlassTabs({ items, value, defaultValue, onValueChange, 'aria-label': label, className, ...surface }) {
    const id = (0, react_1.useId)();
    const [selected, setSelected] = (0, utils_js_1.useControllable)(value, defaultValue ?? items.find(x => !x.disabled)?.value ?? '', onValueChange);
    const refs = (0, react_1.useRef)([]);
    const list = (0, react_1.useRef)(null);
    const policy = (0, provider_js_1.useGlassPolicy)();
    const lens = (0, segmented_js_1.useSelectionLens)(list, '.lg-tab[aria-selected="true"]', [selected, items]);
    const lensRef = (0, react_1.useRef)(null);
    (0, pull_js_1.usePull)(list, {
        axis: 'x', limit: 18, stretch: .8,
        targets: () => lensRef.current ? [lensRef.current] : [],
        origin: () => (0, segmented_js_1.lensOrigin)(lensRef.current),
        disabled: event => !!event.target.closest('button:disabled'),
        onPress: event => pick(event), onMove: event => pick(event),
        onRelease: ({ event, cancelled }) => {
            if (!cancelled)
                (0, pull_js_1.elementAt)(event, '.lg-tab')?.focus({ preventScroll: true });
        },
    }, !policy.reduceMotion);
    function pick(event) {
        const hit = (0, pull_js_1.elementAt)(event, '.lg-tab');
        const index = refs.current.indexOf(hit);
        if (hit && !hit.disabled && index >= 0 && items[index].value !== selected)
            setSelected(items[index].value);
    }
    return (0, jsx_runtime_1.jsxs)("div", { className: (0, utils_js_1.cx)('lg-tabs', className), children: [(0, jsx_runtime_1.jsx)(surface_js_1.GlassSurface, { ...surface, className: "lg-tabs-surface", radius: "pill", children: (0, jsx_runtime_1.jsxs)("div", { className: "lg-tab-list", role: "tablist", "aria-label": label, ref: list, children: [(0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", className: "lg-selection-lens", ref: lensRef, style: lens }), items.map((item, index) => (0, jsx_runtime_1.jsx)("button", { ref: node => { refs.current[index] = node; }, type: "button", role: "tab", id: `${id}-tab-${index}`, "aria-controls": `${id}-panel-${index}`, "aria-selected": selected === item.value, tabIndex: selected === item.value ? 0 : -1, disabled: item.disabled, className: "lg-tab", onClick: () => setSelected(item.value), onKeyDown: event => {
                                const enabled = items.map((x, i) => x.disabled ? -1 : i).filter(i => i >= 0);
                                const current = enabled.indexOf(index);
                                let next;
                                const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
                                if (event.key === (rtl ? 'ArrowLeft' : 'ArrowRight'))
                                    next = enabled[(current + 1) % enabled.length];
                                else if (event.key === (rtl ? 'ArrowRight' : 'ArrowLeft'))
                                    next = enabled[(current - 1 + enabled.length) % enabled.length];
                                else if (event.key === 'Home')
                                    next = enabled[0];
                                else if (event.key === 'End')
                                    next = enabled.at(-1);
                                else
                                    return;
                                event.preventDefault();
                                setSelected(items[next].value);
                                refs.current[next]?.focus();
                            }, children: item.label }, item.value))] }) }), items.map((item, index) => (0, jsx_runtime_1.jsx)("div", { role: "tabpanel", id: `${id}-panel-${index}`, "aria-labelledby": `${id}-tab-${index}`, hidden: selected !== item.value, tabIndex: 0, className: "lg-tab-panel", children: item.content }, item.value))] });
}

},
"packages/react/navigation/toolbar.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolbarGroup = exports.GlassToolbar = void 0;
exports.ToolbarSpacer = ToolbarSpacer;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const fusion_js_1 = require("../system/fusion.js");
const surface_js_1 = require("../system/surface.js");
const utils_js_1 = require("../system/utils.js");
/**
 * The toolbar itself carries no background: it is a row of *groups*, and each group is the
 * glass. Removing custom bar backgrounds, borders and darkening overlays is what lets the
 * material and the scroll edge effect do the separating.
 *
 * Roving focus covers the buttons of every group, so the whole bar is one tab stop with
 * arrow-key traversal. Complex input widgets belong outside this primitive.
 */
exports.GlassToolbar = (0, react_1.forwardRef)(function GlassToolbar({ className, children, orientation = 'horizontal', onKeyDown, onFocusCapture, ...props }, ref) {
    const [root, merged] = (0, utils_js_1.useMergedRef)(ref);
    const items = () => Array.from(root.current?.querySelectorAll('button:not(:disabled)') ?? [])
        .filter(b => b.closest('[role="toolbar"]') === root.current && !b.closest('[popover]') && b.getClientRects().length > 0);
    const setTabStop = (target) => {
        for (const item of items())
            item.tabIndex = item === target ? 0 : -1;
    };
    (0, react_1.useEffect)(() => {
        const node = root.current;
        if (!node)
            return;
        const reset = () => {
            const available = items();
            const current = available.find(item => item === document.activeElement) ?? available.find(item => item.tabIndex === 0) ?? available[0];
            if (current)
                setTabStop(current);
        };
        reset();
        const observer = new MutationObserver(reset);
        observer.observe(node, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled'] });
        return () => observer.disconnect();
    });
    const keyboard = (event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey)
            return;
        const available = items();
        const index = available.indexOf(document.activeElement);
        if (index < 0)
            return;
        const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
        const previous = orientation === 'horizontal' ? (rtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
        const next = orientation === 'horizontal' ? (rtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
        let target = index;
        if (event.key === next)
            target = (index + 1) % available.length;
        else if (event.key === previous)
            target = (index - 1 + available.length) % available.length;
        else if (event.key === 'Home')
            target = 0;
        else if (event.key === 'End')
            target = available.length - 1;
        else
            return;
        event.preventDefault();
        setTabStop(available[target]);
        available[target].focus();
    };
    return (0, jsx_runtime_1.jsx)("div", { ...props, ref: merged, role: "toolbar", "aria-orientation": orientation, className: (0, utils_js_1.cx)('lg-toolbar', className), "data-orientation": orientation, onKeyDown: keyboard, onFocusCapture: event => {
            onFocusCapture?.(event);
            if (event.target.tagName === 'BUTTON')
                setTabStop(event.target);
        }, children: children });
});
/**
 * One shared glass background for a set of related items — group by function and frequency,
 * not by whatever happens to fit. Items inside are `.lg-item`s on the group's material, never
 * glass of their own: glass on glass is the fastest way to lose the material entirely.
 *
 * Do not mix symbols and text in one group; a group of both reads as a single wide button.
 * Text buttons get their own container, and the primary action stands alone.
 */
exports.ToolbarGroup = (0, react_1.forwardRef)(function ToolbarGroup({ className, children, prominent = false, radius = 'pill', ...props }, ref) {
    const [root, merged] = (0, utils_js_1.useMergedRef)(ref);
    const fusion = (0, fusion_js_1.useFusion)(root, { itemSelector: ':scope > .lg-content > .lg-button' });
    (0, react_1.useEffect)(() => {
        // `process` does not exist in the offline preview bundle, so it is probed, not assumed.
        if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production')
            return;
        const node = root.current;
        if (!node)
            return;
        const buttons = Array.from(node.querySelectorAll(':scope > .lg-content > .lg-button'));
        if (buttons.length < 2)
            return;
        const icons = buttons.filter(b => b.classList.contains('lg-icon-button')).length;
        if (icons > 0 && icons < buttons.length) {
            console.warn('[liquid-glass-ui] ToolbarGroup mixes icon-only and text buttons in one shared background; a mixed group reads as a single button. Split them into separate groups.', node);
        }
    }, [root, children]);
    return (0, jsx_runtime_1.jsx)(surface_js_1.GlassSurface, { ...props, ref: merged, radius: radius, "data-prominent": prominent ? 'true' : undefined, className: (0, utils_js_1.cx)('lg-toolbar-group', className), children: (0, jsx_runtime_1.jsxs)(surface_js_1.SharedSurface, { value: true, children: [fusion, children] }) });
});
/**
 * Separates groups. `fixed` leaves a consistent gap between two related clusters;
 * `flexible` pushes them to opposite ends of the bar. This replaces the drawn divider —
 * the gap between two glass surfaces is the separator.
 */
function ToolbarSpacer({ variant = 'fixed' }) {
    return (0, jsx_runtime_1.jsx)("span", { className: "lg-toolbar-spacer", "data-variant": variant, "aria-hidden": "true" });
}

},
"packages/react/overlays/action-sheet.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlassActionSheet = GlassActionSheet;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_js_1 = require("../system/material.js");
const provider_js_1 = require("../system/provider.js");
const utils_js_1 = require("../system/utils.js");
const anchor_js_1 = require("./anchor.js");
/**
 * A short list of choices that springs from the control that triggered it. Destructive
 * choices sit at the bottom of the list in red, and Cancel is separated from the rest so it
 * cannot be hit by accident.
 *
 * The rest of the interface stays interactive: this is a set of options, not a modal task.
 * On a phone it anchors to the bottom of the screen; on wider layouts it stays attached to
 * its source control.
 */
function GlassActionSheet({ trigger, open: controlled, defaultOpen = false, onOpenChange, title, message, actions, cancelLabel = 'Cancel', onCancel, 'aria-label': label, align = 'center', className, ...surface }) {
    const id = (0, react_1.useId)();
    const triggerRef = (0, react_1.useRef)(null);
    const [open, setOpen] = (0, utils_js_1.useControllable)(controlled, defaultOpen, onOpenChange);
    const wide = (0, provider_js_1.useMediaQuery)('(min-width: 768px)');
    const glass = (0, material_js_1.useGlassSurface)({ ...surface, material: 'regular', size: 'large' });
    (0, anchor_js_1.usePopover)(open, setOpen, glass.root, triggerRef, align, true, wide ? 'auto' : 'above');
    const close = () => { setOpen(false); triggerRef.current?.focus(); };
    // Destructive choices are ordered last so a mis-tap lands on something recoverable.
    const ordered = [...actions].sort((a, b) => Number(!!a.destructive) - Number(!!b.destructive));
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, anchor_js_1.triggerElement)(trigger, triggerRef, id, open, 'menu', setOpen), (0, jsx_runtime_1.jsxs)("div", { id: id, ref: glass.ref, popover: "auto", role: "menu", tabIndex: -1, "aria-label": label, ...glass.attributes, className: (0, utils_js_1.cx)('lg-root lg-action-sheet', className), style: glass.style, "data-anchor": wide ? 'source' : 'bottom', onKeyDown: event => {
                    if (event.key === 'Escape') {
                        event.preventDefault();
                        close();
                        onCancel?.();
                        return;
                    }
                    if (event.key === 'Tab') {
                        close();
                        return;
                    }
                    const enabled = Array.from(glass.root.current?.querySelectorAll('[role="menuitem"]:not(:disabled)') ?? []);
                    const index = enabled.indexOf(document.activeElement);
                    if (!enabled.length)
                        return;
                    let next = index;
                    if (event.key === 'ArrowDown')
                        next = (index + 1) % enabled.length;
                    else if (event.key === 'ArrowUp')
                        next = (index - 1 + enabled.length) % enabled.length;
                    else if (event.key === 'Home')
                        next = 0;
                    else if (event.key === 'End')
                        next = enabled.length - 1;
                    else
                        return;
                    event.preventDefault();
                    enabled[next]?.focus();
                }, children: [glass.decoration, (0, jsx_runtime_1.jsxs)("div", { className: "lg-content", children: [(title || message) && (0, jsx_runtime_1.jsxs)("div", { className: "lg-sheet-heading", role: "none", children: [title && (0, jsx_runtime_1.jsx)("p", { className: "lg-overlay-title", children: title }), message && (0, jsx_runtime_1.jsx)("p", { className: "lg-overlay-description", children: message })] }), (0, jsx_runtime_1.jsx)("div", { className: "lg-action-list", role: "none", children: ordered.map(action => (0, jsx_runtime_1.jsxs)("button", { type: "button", role: "menuitem", tabIndex: -1, className: "lg-action-item", "data-destructive": action.destructive ? 'true' : undefined, disabled: action.disabled, onClick: () => { close(); action.onSelect?.(); }, children: [action.icon && (0, jsx_runtime_1.jsx)("span", { className: "lg-action-icon", "aria-hidden": "true", children: action.icon }), action.label] }, action.key)) }), (0, jsx_runtime_1.jsx)("button", { type: "button", role: "menuitem", tabIndex: -1, className: "lg-action-cancel", onClick: () => { close(); onCancel?.(); }, children: cancelLabel })] })] })] });
}

},
"packages/react/overlays/alert.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlassAlert = GlassAlert;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_js_1 = require("../system/material.js");
const button_js_1 = require("../controls/button.js");
const surface_js_1 = require("../system/surface.js");
const utils_js_1 = require("../system/utils.js");
const anchor_js_1 = require("./anchor.js");
/**
 * A short, unavoidable decision. The title is bold and **left-aligned** — centred alert text
 * is the old design — and there are at most three actions.
 *
 * Reserve alerts for things the user must act on. A destructive action needs either this
 * (with a red action and Cancel focused) or an immediate Undo; routine information needs
 * neither, and marketing never belongs here.
 */
function GlassAlert({ trigger, open: controlled, defaultOpen = false, onOpenChange, title, message, actions, className, ...surface }) {
    if (actions.length === 0)
        throw new Error('GlassAlert requires at least one action');
    if (actions.length > 3)
        throw new RangeError('GlassAlert supports at most three actions; use an action sheet for longer lists');
    const id = (0, react_1.useId)();
    const triggerRef = (0, react_1.useRef)(null);
    const restoreRef = (0, react_1.useRef)(null);
    const [open, setOpen] = (0, utils_js_1.useControllable)(controlled, defaultOpen, onOpenChange);
    const glass = (0, material_js_1.useGlassSurface)({ ...surface, material: 'regular', size: 'large', radius: surface.radius ?? 26 });
    const hasDestructive = actions.some(action => action.role === 'destructive');
    (0, react_1.useEffect)(() => {
        const node = glass.root.current;
        if (!node)
            return;
        if (!open) {
            if (node.open)
                node.close();
            return;
        }
        restoreRef.current = document.activeElement;
        if (!node.open)
            node.showModal();
        // When something irreversible is on offer, the safe option is the one under the user's hands.
        const preferred = node.querySelector(hasDestructive ? '[data-role="cancel"]' : '[data-role="default"]')
            ?? node.querySelector('.lg-alert-action');
        preferred?.focus({ preventScroll: true });
        const unlock = (0, anchor_js_1.lockScroll)();
        return () => {
            if (node.open)
                node.close();
            unlock();
            const target = triggerRef.current ?? restoreRef.current;
            if (target?.isConnected)
                target.focus({ preventScroll: true });
        };
    }, [open, glass.root, hasDestructive]);
    const run = (action) => { setOpen(false); action.onSelect?.(); };
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, anchor_js_1.triggerElement)(trigger, triggerRef, id, open, 'dialog', setOpen), (0, jsx_runtime_1.jsxs)("dialog", { id: id, ref: glass.ref, role: "alertdialog", "aria-labelledby": `${id}-title`, "aria-describedby": message ? `${id}-msg` : undefined, ...glass.attributes, className: (0, utils_js_1.cx)('lg-root lg-dialog lg-alert', className), style: glass.style, onCancel: event => {
                    event.preventDefault();
                    // Escape means "get me out", so it runs the cancel action rather than silently closing.
                    const cancel = actions.find(action => action.role === 'cancel');
                    setOpen(false);
                    cancel?.onSelect?.();
                }, children: [glass.decoration, (0, jsx_runtime_1.jsx)("div", { className: "lg-content", children: (0, jsx_runtime_1.jsxs)(surface_js_1.SharedSurface, { value: true, children: [(0, jsx_runtime_1.jsx)("h2", { id: `${id}-title`, className: "lg-overlay-title lg-alert-title", children: title }), message && (0, jsx_runtime_1.jsx)("p", { id: `${id}-msg`, className: "lg-overlay-description lg-alert-message", children: message }), (0, jsx_runtime_1.jsx)("div", { className: "lg-alert-actions", "data-count": actions.length, children: actions.map(action => (0, jsx_runtime_1.jsx)(button_js_1.GlassButton, { className: "lg-alert-action", "data-role": action.role ?? 'default', variant: action.role === 'destructive' ? 'destructive' : action.role === 'cancel' ? 'gray' : 'tinted', independent: true, onClick: () => run(action), children: action.label }, action.key)) })] }) })] })] });
}

},
"packages/react/overlays/anchor.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerElement = triggerElement;
exports.usePopover = usePopover;
exports.lockScroll = lockScroll;
const react_1 = require("react");
const utils_js_1 = require("../system/utils.js");
/** Wires the caller's own button up as the opener without taking its props away from it. */
function triggerElement(trigger, ref, id, open, kind, setOpen) {
    if (!trigger)
        return null;
    return (0, react_1.cloneElement)(trigger, {
        'aria-haspopup': kind, 'aria-expanded': open, 'aria-controls': id,
        ref: node => {
            const originalCleanup = (0, utils_js_1.assignRef)(trigger.props.ref, node), localCleanup = (0, utils_js_1.assignRef)(ref, node);
            return () => {
                if (typeof originalCleanup === 'function')
                    originalCleanup();
                else
                    (0, utils_js_1.assignRef)(trigger.props.ref, null);
                if (typeof localCleanup === 'function')
                    localCleanup();
                else
                    (0, utils_js_1.assignRef)(ref, null);
            };
        },
        onClick: event => {
            trigger.props.onClick?.(event);
            if (!event.defaultPrevented)
                setOpen(!open);
        },
    });
}
/**
 * Native top-layer popover with controlled React state and bounded anchor positioning.
 *
 * The panel grows out of the control that opened it and stays anchored to it — menus,
 * popovers and action sheets morph from their source rather than appearing from nowhere,
 * so the origin is projected onto the panel box every time it is repositioned.
 */
function usePopover(open, setOpen, panel, trigger, align, menu, placement = 'auto') {
    const onChange = (0, react_1.useRef)(setOpen);
    onChange.current = setOpen;
    (0, react_1.useEffect)(() => {
        const node = panel.current;
        if (!node)
            return;
        const toggled = (event) => onChange.current(event.newState === 'open');
        node.addEventListener('toggle', toggled);
        return () => node.removeEventListener('toggle', toggled);
    }, [panel]);
    (0, react_1.useEffect)(() => {
        const node = panel.current;
        if (!node)
            return;
        if (!open) {
            if (node.matches(':popover-open'))
                node.hidePopover();
            return;
        }
        if (typeof node.showPopover !== 'function') {
            onChange.current(false);
            return;
        }
        if (!node.matches(':popover-open'))
            node.showPopover();
        let frame = 0;
        const position = () => {
            const rect = trigger.current?.getBoundingClientRect();
            if (!rect) {
                node.style.left = `${Math.max(16, (innerWidth - node.offsetWidth) / 2)}px`;
                node.style.top = '96px';
                return;
            }
            const width = node.offsetWidth, height = node.offsetHeight;
            const x = align === 'end' ? rect.right - width : align === 'center' ? rect.left + (rect.width - width) / 2 : rect.left;
            const below = rect.bottom + 10, above = rect.top - height - 10;
            const fitsBelow = below + height <= innerHeight - 16;
            const top = placement === 'above' ? Math.max(16, above)
                : placement === 'below' ? below
                    : fitsBelow ? below : Math.max(16, above);
            const left = Math.max(16, Math.min(x, innerWidth - width - 16));
            const resolvedTop = Math.min(top, Math.max(16, innerHeight - height - 16));
            node.style.left = `${left}px`;
            node.style.top = `${resolvedTop}px`;
            // Grow out of the trigger: the transform origin is the trigger centre projected onto the panel box.
            const originX = Math.max(0, Math.min(100, (rect.left + rect.width / 2 - left) / width * 100));
            node.style.setProperty('--lg-origin-x', `${originX}%`);
            node.style.setProperty('--lg-origin-y', resolvedTop >= rect.bottom ? '0%' : '100%');
        };
        const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(position); };
        position();
        const first = menu ? node.querySelector('[role="menuitem"]:not(:disabled)') : (0, utils_js_1.focusable)(node)[0];
        (first ?? node).focus({ preventScroll: true });
        const resize = new ResizeObserver(schedule);
        resize.observe(node);
        if (trigger.current)
            resize.observe(trigger.current);
        window.addEventListener('resize', schedule);
        window.addEventListener('scroll', schedule, true);
        return () => { resize.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('resize', schedule); window.removeEventListener('scroll', schedule, true); };
    }, [open, panel, trigger, align, menu, placement]);
}
let scrollLocks = 0;
let previousOverflow = '';
/** Reference-counted, so nested modals do not release the page scroll too early. */
function lockScroll() {
    if (scrollLocks++ === 0) {
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    }
    return () => {
        if (--scrollLocks === 0)
            document.body.style.overflow = previousOverflow;
    };
}

},
"packages/react/overlays/dialog.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlassDialog = GlassDialog;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_js_1 = require("../system/material.js");
const button_js_1 = require("../controls/button.js");
const surface_js_1 = require("../system/surface.js");
const icon_js_1 = require("../system/icon.js");
const utils_js_1 = require("../system/utils.js");
const anchor_js_1 = require("./anchor.js");
/**
 * A modal task on large glass, built on the native `<dialog>` so focus containment, the
 * top layer and Escape come from the platform rather than from a hand-rolled focus trap.
 *
 * Titles are bold and left-aligned, and the task is paired with a dimming layer because it
 * interrupts the main flow — parallel tasks get glass separation without the dim.
 */
function GlassDialog({ trigger, open: controlled, defaultOpen = false, onOpenChange, title, description, children, className, closeLabel = 'Close', dismissOnBackdrop = true, ...surface }) {
    const id = (0, react_1.useId)();
    const triggerRef = (0, react_1.useRef)(null);
    const restoreRef = (0, react_1.useRef)(null);
    const downOutside = (0, react_1.useRef)(false);
    const [open, setOpen] = (0, utils_js_1.useControllable)(controlled, defaultOpen, onOpenChange);
    const glass = (0, material_js_1.useGlassSurface)({ ...surface, material: 'regular', size: 'large', radius: surface.radius ?? 28 });
    (0, react_1.useEffect)(() => {
        const node = glass.root.current;
        if (!node)
            return;
        if (!open) {
            if (node.open)
                node.close();
            return;
        }
        restoreRef.current = document.activeElement;
        if (!node.open)
            node.showModal();
        const unlock = (0, anchor_js_1.lockScroll)();
        return () => {
            if (node.open)
                node.close();
            unlock();
            const target = triggerRef.current ?? restoreRef.current;
            if (target?.isConnected)
                target.focus({ preventScroll: true });
        };
    }, [open, glass.root]);
    const outside = (0, react_1.useCallback)((x, y) => {
        const rect = glass.root.current?.getBoundingClientRect();
        return !!rect && (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom);
    }, [glass.root]);
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, anchor_js_1.triggerElement)(trigger, triggerRef, id, open, 'dialog', setOpen), (0, jsx_runtime_1.jsxs)("dialog", { id: id, ref: glass.ref, "aria-labelledby": `${id}-title`, "aria-describedby": `${id}-desc`, ...glass.attributes, className: (0, utils_js_1.cx)('lg-root lg-dialog', className), style: glass.style, onCancel: event => { event.preventDefault(); setOpen(false); }, onClose: () => {
                    if (!glass.root.current?.open)
                        setOpen(false);
                }, onPointerDown: event => { downOutside.current = event.target === event.currentTarget && outside(event.clientX, event.clientY); }, onClick: event => {
                    if (dismissOnBackdrop && downOutside.current && event.target === event.currentTarget && outside(event.clientX, event.clientY))
                        setOpen(false);
                    downOutside.current = false;
                }, children: [glass.decoration, (0, jsx_runtime_1.jsx)("div", { className: "lg-content", children: (0, jsx_runtime_1.jsxs)(surface_js_1.SharedSurface, { value: true, children: [(0, jsx_runtime_1.jsx)("h2", { id: `${id}-title`, className: "lg-overlay-title", children: title }), (0, jsx_runtime_1.jsx)("p", { id: `${id}-desc`, className: "lg-overlay-description", children: description }), (0, jsx_runtime_1.jsx)("div", { className: "lg-dialog-body", children: children }), (0, jsx_runtime_1.jsx)(button_js_1.GlassIconButton, { className: "lg-dialog-close", "aria-label": closeLabel, variant: "plain", onClick: () => setOpen(false), children: (0, jsx_runtime_1.jsx)(icon_js_1.LibraryIcon, { name: "close", size: 18 }) })] }) })] })] });
}

},
"packages/react/overlays/menu.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlassMenu = GlassMenu;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_js_1 = require("../system/material.js");
const utils_js_1 = require("../system/utils.js");
const anchor_js_1 = require("./anchor.js");
/**
 * A menu on large glass that morphs out of its trigger.
 *
 * The menu keyboard model is a contract, so the roles are real: Up/Down move, Home/End jump,
 * typing jumps to a matching label, Escape closes and returns focus, Tab closes. Keep groups
 * to about seven items and separate them rather than growing one long list.
 */
function GlassMenu({ trigger, open: controlled, defaultOpen = false, onOpenChange, items, 'aria-label': label, className, align = 'end', ...surface }) {
    const id = (0, react_1.useId)();
    const triggerRef = (0, react_1.useRef)(null);
    const [open, setOpen] = (0, utils_js_1.useControllable)(controlled, defaultOpen, onOpenChange);
    const glass = (0, material_js_1.useGlassSurface)({ ...surface, material: 'regular', size: 'large' });
    const search = (0, react_1.useRef)({ text: '', time: 0 });
    (0, anchor_js_1.usePopover)(open, setOpen, glass.root, triggerRef, align, true);
    const close = () => { setOpen(false); triggerRef.current?.focus(); };
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, anchor_js_1.triggerElement)(trigger, triggerRef, id, open, 'menu', setOpen), (0, jsx_runtime_1.jsxs)("div", { id: id, ref: glass.ref, popover: "auto", role: "menu", tabIndex: -1, "aria-label": label, ...glass.attributes, className: (0, utils_js_1.cx)('lg-root lg-menu', className), style: glass.style, onKeyDown: event => {
                    if (event.key === 'Escape') {
                        event.preventDefault();
                        close();
                        return;
                    }
                    if (event.key === 'Tab') {
                        close();
                        return;
                    }
                    const enabled = Array.from(glass.root.current?.querySelectorAll('[role="menuitem"]:not(:disabled),[role="menuitemcheckbox"]:not(:disabled)') ?? []);
                    const index = enabled.indexOf(document.activeElement);
                    if (!enabled.length)
                        return;
                    let next = index;
                    if (event.key === 'ArrowDown')
                        next = (index + 1) % enabled.length;
                    else if (event.key === 'ArrowUp')
                        next = (index - 1 + enabled.length) % enabled.length;
                    else if (event.key === 'Home')
                        next = 0;
                    else if (event.key === 'End')
                        next = enabled.length - 1;
                    else if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
                        const now = Date.now();
                        search.current.text = (now - search.current.time > 700 ? '' : search.current.text) + event.key.toLocaleLowerCase();
                        search.current.time = now;
                        const match = [...enabled.slice(index + 1), ...enabled.slice(0, index + 1)].find(button => button.dataset.label?.toLocaleLowerCase().startsWith(search.current.text));
                        if (match) {
                            event.preventDefault();
                            match.focus();
                        }
                        return;
                    }
                    else
                        return;
                    event.preventDefault();
                    enabled[next]?.focus();
                }, children: [glass.decoration, (0, jsx_runtime_1.jsx)("div", { className: "lg-content", children: items.map((item, index) => (0, jsx_runtime_1.jsxs)("div", { role: "none", style: { '--lg-index': index }, children: [item.separatorBefore && (0, jsx_runtime_1.jsx)("div", { role: "separator", className: "lg-menu-separator" }), (0, jsx_runtime_1.jsxs)("button", { type: "button", role: item.checked === undefined ? 'menuitem' : 'menuitemcheckbox', "aria-checked": item.checked, tabIndex: -1, className: "lg-menu-item", "data-label": item.label, "data-destructive": item.destructive ? 'true' : 'false', disabled: item.disabled, onClick: () => { close(); item.onSelect(); }, children: [item.icon && (0, jsx_runtime_1.jsx)("span", { className: "lg-menu-icon", "aria-hidden": "true", children: item.icon }), (0, jsx_runtime_1.jsx)("span", { className: "lg-menu-label", children: item.label }), item.shortcut && (0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", className: "lg-menu-shortcut", children: item.shortcut })] })] }, item.key)) })] })] });
}

},
"packages/react/overlays/popover.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlassPopover = GlassPopover;
exports.GlassMenuDescription = GlassMenuDescription;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_js_1 = require("../system/material.js");
const surface_js_1 = require("../system/surface.js");
const utils_js_1 = require("../system/utils.js");
const anchor_js_1 = require("./anchor.js");
/**
 * A non-modal panel anchored to the control that opened it, on large glass. Escape closes it
 * and returns focus to the trigger; a click outside light-dismisses it.
 *
 * On a phone this pattern should become a sheet instead — a popover with an arrow pointing at
 * a control is an iPad and Mac idiom.
 */
function GlassPopover({ trigger, open: controlled, defaultOpen = false, onOpenChange, title, description, children, align = 'end', className, ...surface }) {
    const id = (0, react_1.useId)();
    const triggerRef = (0, react_1.useRef)(null);
    const [open, setOpen] = (0, utils_js_1.useControllable)(controlled, defaultOpen, onOpenChange);
    const glass = (0, material_js_1.useGlassSurface)({ ...surface, material: 'regular', size: 'large' });
    (0, anchor_js_1.usePopover)(open, setOpen, glass.root, triggerRef, align, false);
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, anchor_js_1.triggerElement)(trigger, triggerRef, id, open, 'dialog', setOpen), (0, jsx_runtime_1.jsxs)("div", { popover: "auto", id: id, ref: glass.ref, role: "dialog", tabIndex: -1, "aria-labelledby": `${id}-title`, "aria-describedby": description ? `${id}-desc` : undefined, ...glass.attributes, className: (0, utils_js_1.cx)('lg-root lg-popover', className), style: glass.style, onKeyDown: event => {
                    if (event.key === 'Escape') {
                        event.preventDefault();
                        setOpen(false);
                        triggerRef.current?.focus();
                    }
                }, children: [glass.decoration, (0, jsx_runtime_1.jsx)("div", { className: "lg-content", children: (0, jsx_runtime_1.jsxs)(surface_js_1.SharedSurface, { value: true, children: [(0, jsx_runtime_1.jsx)("h3", { id: `${id}-title`, className: "lg-overlay-title", children: title }), description && (0, jsx_runtime_1.jsx)("p", { id: `${id}-desc`, className: "lg-overlay-description", children: description }), children] }) })] })] });
}
function GlassMenuDescription(props) {
    return (0, jsx_runtime_1.jsx)("p", { ...props, className: (0, utils_js_1.cx)('lg-overlay-description', props.className) });
}

},
"packages/react/overlays/sheet.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlassSheet = GlassSheet;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const core_1 = require("@liquid-glass-ui/core");
const material_js_1 = require("../system/material.js");
const provider_js_1 = require("../system/provider.js");
const surface_js_1 = require("../system/surface.js");
const utils_js_1 = require("../system/utils.js");
const anchor_js_1 = require("./anchor.js");
/** Fraction of the viewport each detent occupies. `large` stops just short of the top. */
const DETENT_FRACTION = { medium: .5, large: .94 };
/** At or above this fraction the sheet is effectively full height: opaque, anchored to the edge. */
const FULL = .9;
/**
 * A sheet that is inset from the display edge on glass and grows as it is dragged up,
 * becoming **opaque and anchored to the edge at full height** — translucency at full height
 * would just be a blurry app behind a wall of text.
 *
 * The drag is the point: the sheet tracks the finger 1:1 and settles on a spring at the
 * nearest detent, and it is interruptible mid-flight. Only `transform` moves, never `height`,
 * so the drag stays on the compositor.
 */
function GlassSheet({ trigger, open: controlled, defaultOpen = false, onOpenChange, title, description, children, detents = ['medium', 'large'], defaultDetent, onDetentChange, grabber = true, className, ...surface }) {
    if (detents.length === 0)
        throw new Error('GlassSheet requires at least one detent');
    const id = (0, react_1.useId)();
    const triggerRef = (0, react_1.useRef)(null);
    const restoreRef = (0, react_1.useRef)(null);
    const [open, setOpen] = (0, utils_js_1.useControllable)(controlled, defaultOpen, onOpenChange);
    const [detent, setDetent] = (0, utils_js_1.useControllable)(undefined, defaultDetent ?? detents[0], onDetentChange);
    const policy = (0, provider_js_1.useGlassPolicy)();
    const glass = (0, material_js_1.useGlassSurface)({ ...surface, material: 'regular', size: 'large', radius: surface.radius ?? 38 });
    const fractions = detents.map(name => DETENT_FRACTION[name]);
    const [full, setFull] = (0, react_1.useState)(DETENT_FRACTION[detent] >= FULL);
    const spring = (0, react_1.useRef)(null);
    /** One writer for the visible fraction, so the drag and the spring cannot fight each other. */
    const paint = (0, react_1.useCallback)((fraction) => {
        const node = glass.root.current;
        if (!node)
            return;
        node.style.setProperty('--lg-sheet-offset', `${((1 - fraction) * 100).toFixed(3)}%`);
        setFull(fraction >= FULL);
    }, [glass.root]);
    (0, react_1.useEffect)(() => {
        const node = glass.root.current;
        if (!node)
            return;
        if (!open) {
            if (node.open)
                node.close();
            return;
        }
        restoreRef.current = document.activeElement;
        if (!node.open)
            node.showModal();
        paint(DETENT_FRACTION[detent]);
        const unlock = (0, anchor_js_1.lockScroll)();
        return () => {
            if (node.open)
                node.close();
            unlock();
            const target = triggerRef.current ?? restoreRef.current;
            if (target?.isConnected)
                target.focus({ preventScroll: true });
        };
        // `detent` is intentionally not a dependency: re-running this on every detent change would
        // close and reopen the dialog mid-drag.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, glass.root, paint]);
    (0, react_1.useEffect)(() => {
        if (open)
            paint(DETENT_FRACTION[detent]);
    }, [detent, open, paint]);
    (0, react_1.useEffect)(() => {
        const node = glass.root.current;
        if (!node || !open)
            return;
        const handle = node.querySelector('.lg-sheet-grabber');
        if (!handle)
            return;
        let active = false, startY = 0, startFraction = 0, height = 1, pointer = -1, frame = 0, latest = 0;
        const settle = (fraction) => {
            // Nearest detent wins; below the smallest one the gesture is a dismissal.
            if (fraction < fractions[0] * .6) {
                setOpen(false);
                return;
            }
            const nearest = fractions.reduce((best, value) => Math.abs(value - fraction) < Math.abs(best - fraction) ? value : best, fractions[0]);
            const name = detents[fractions.indexOf(nearest)];
            if (policy.reduceMotion) {
                paint(nearest);
                setDetent(name);
                return;
            }
            spring.current?.stop();
            const animation = (0, core_1.createSpring)(fraction, paint, { stiffness: 260, damping: 26 });
            spring.current = animation;
            animation.to(nearest);
            setDetent(name);
        };
        const move = (event) => {
            if (!active || event.pointerId !== pointer)
                return;
            latest = startFraction + (startY - event.clientY) / height;
            cancelAnimationFrame(frame);
            // Rubber-band past the top so the sheet never detaches from the finger.
            frame = requestAnimationFrame(() => paint(Math.min(1, Math.max(.04, latest > 1 ? 1 + (latest - 1) * .2 : latest))));
        };
        const end = () => {
            if (!active)
                return;
            active = false;
            pointer = -1;
            cancelAnimationFrame(frame);
            node.removeAttribute('data-dragging');
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', end);
            window.removeEventListener('pointercancel', end);
            settle(Math.min(1, Math.max(.04, latest)));
        };
        const down = (event) => {
            if (event.button !== 0 || !event.isPrimary)
                return;
            spring.current?.stop();
            // Measured once at gesture start; reading layout inside pointermove is what drops frames.
            height = window.innerHeight || 1;
            const offset = parseFloat(getComputedStyle(node).getPropertyValue('--lg-sheet-offset')) || 0;
            startFraction = 1 - offset / 100;
            latest = startFraction;
            startY = event.clientY;
            active = true;
            pointer = event.pointerId;
            node.setAttribute('data-dragging', 'true');
            window.addEventListener('pointermove', move, { passive: true });
            window.addEventListener('pointerup', end);
            window.addEventListener('pointercancel', end);
        };
        handle.addEventListener('pointerdown', down);
        return () => { handle.removeEventListener('pointerdown', down); end(); spring.current?.stop(); };
    }, [open, glass.root, detents.join(), policy.reduceMotion, paint, setDetent, setOpen]);
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, anchor_js_1.triggerElement)(trigger, triggerRef, id, open, 'dialog', setOpen), (0, jsx_runtime_1.jsxs)("dialog", { id: id, ref: glass.ref, "aria-labelledby": `${id}-title`, "aria-describedby": description ? `${id}-desc` : undefined, ...glass.attributes, className: (0, utils_js_1.cx)('lg-root lg-sheet', className), "data-full": full ? 'true' : undefined, style: { '--lg-sheet-offset': `${(1 - DETENT_FRACTION[detent]) * 100}%`, ...glass.style }, onCancel: event => { event.preventDefault(); setOpen(false); }, onClose: () => {
                    if (!glass.root.current?.open)
                        setOpen(false);
                }, children: [glass.decoration, (0, jsx_runtime_1.jsx)("div", { className: "lg-content", children: (0, jsx_runtime_1.jsxs)(surface_js_1.SharedSurface, { value: true, children: [grabber && detents.length > 1 && (0, jsx_runtime_1.jsx)("div", { className: "lg-sheet-grabber", role: "slider", tabIndex: 0, "aria-label": `${title} height`, "aria-valuetext": detent, "aria-valuenow": fractions.indexOf(DETENT_FRACTION[detent]), "aria-valuemin": 0, "aria-valuemax": detents.length - 1, onKeyDown: event => {
                                        const index = detents.indexOf(detent);
                                        if (event.key === 'ArrowUp' && index < detents.length - 1) {
                                            event.preventDefault();
                                            setDetent(detents[index + 1]);
                                        }
                                        else if (event.key === 'ArrowDown') {
                                            event.preventDefault();
                                            if (index > 0)
                                                setDetent(detents[index - 1]);
                                            else
                                                setOpen(false);
                                        }
                                    }, children: (0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "lg-sheet-scroll", children: [(0, jsx_runtime_1.jsx)("h2", { id: `${id}-title`, className: "lg-overlay-title", children: title }), description && (0, jsx_runtime_1.jsx)("p", { id: `${id}-desc`, className: "lg-overlay-description", children: description }), children] })] }) })] })] });
}

},
"packages/react/overlays/toast.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToast = useToast;
exports.ToastProvider = ToastProvider;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_js_1 = require("../system/material.js");
const surface_js_1 = require("../system/surface.js");
const button_js_1 = require("../controls/button.js");
const utils_js_1 = require("../system/utils.js");
const ToastContext = (0, react_1.createContext)(null);
/**
 * The counterpart to confirmation dialogs.
 *
 * Irreversible actions get an alert or an action sheet; **reversible** ones should just
 * happen, with an Undo here. Making every delete stop and ask is how an interface becomes
 * tiring, and offering neither is how it becomes untrustworthy.
 */
function useToast() {
    const show = (0, react_1.useContext)(ToastContext);
    if (!show)
        throw new Error('useToast must be used inside a <ToastProvider>');
    return show;
}
function ToastProvider({ children, limit = 3 }) {
    const [toasts, setToasts] = (0, react_1.useState)([]);
    const nextId = (0, react_1.useRef)(0);
    const dismiss = (0, react_1.useCallback)((id) => setToasts(list => list.filter(toast => toast.id !== id)), []);
    const show = (0, react_1.useCallback)((options) => {
        const record = { id: nextId.current++, message: options.message, duration: options.duration ?? 6000, action: options.action };
        setToasts(list => [...list, record].slice(-limit));
    }, [limit]);
    return (0, jsx_runtime_1.jsxs)(ToastContext.Provider, { value: show, children: [children, (0, jsx_runtime_1.jsx)("div", { className: "lg-toast-region", role: "status", "aria-live": "polite", "aria-relevant": "additions", children: toasts.map(toast => (0, jsx_runtime_1.jsx)(Toast, { toast: toast, onDismiss: () => dismiss(toast.id) }, toast.id)) })] });
}
function Toast({ toast, onDismiss }) {
    const glass = (0, material_js_1.useGlassSurface)({ material: 'regular', size: 'large', radius: 'pill' });
    const [paused, setPaused] = (0, react_1.useState)(false);
    const dismissRef = (0, react_1.useRef)(onDismiss);
    dismissRef.current = onDismiss;
    (0, react_1.useEffect)(() => {
        if (paused || toast.duration === Infinity)
            return;
        const timer = setTimeout(() => dismissRef.current(), toast.duration);
        return () => clearTimeout(timer);
    }, [paused, toast.duration]);
    return (0, jsx_runtime_1.jsxs)("div", { ref: glass.ref, ...glass.attributes, className: (0, utils_js_1.cx)('lg-root lg-toast'), style: glass.style,
        // Hovering or focusing holds the toast so the undo window is not lost while reaching for it.
        onPointerEnter: () => setPaused(true), onPointerLeave: () => setPaused(false), onFocusCapture: () => setPaused(true), onBlurCapture: () => setPaused(false), children: [glass.decoration, (0, jsx_runtime_1.jsx)("div", { className: "lg-content", children: (0, jsx_runtime_1.jsxs)(surface_js_1.SharedSurface, { value: true, children: [(0, jsx_runtime_1.jsx)("span", { className: "lg-toast-message", children: toast.message }), toast.action && (0, jsx_runtime_1.jsx)(button_js_1.GlassButton, { className: "lg-toast-action", controlSize: "small", onClick: () => { toast.action.onSelect(); onDismiss(); }, children: toast.action.label })] }) })] });
}

},
"packages/react/overlays.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlassPopover = GlassPopover;
exports.GlassMenu = GlassMenu;
exports.GlassDialog = GlassDialog;
exports.GlassMenuDescription = GlassMenuDescription;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_js_1 = require("./material.js");
const button_js_1 = require("./button.js");
const surface_js_1 = require("./surface.js");
const utils_js_1 = require("./utils.js");
function triggerElement(trigger, ref, id, open, kind, setOpen) {
    if (!trigger)
        return null;
    return (0, react_1.cloneElement)(trigger, {
        'aria-haspopup': kind, 'aria-expanded': open, 'aria-controls': id,
        ref: node => {
            const originalCleanup = (0, utils_js_1.assignRef)(trigger.props.ref, node), localCleanup = (0, utils_js_1.assignRef)(ref, node);
            return () => {
                if (typeof originalCleanup === 'function')
                    originalCleanup();
                else
                    (0, utils_js_1.assignRef)(trigger.props.ref, null);
                if (typeof localCleanup === 'function')
                    localCleanup();
                else
                    (0, utils_js_1.assignRef)(ref, null);
            };
        },
        onClick: event => {
            trigger.props.onClick?.(event);
            if (!event.defaultPrevented)
                setOpen(!open);
        },
    });
}
/** Native top-layer popover with controlled React state and bounded anchor positioning. */
function usePopover(open, setOpen, panel, trigger, align, menu) {
    const onChange = (0, react_1.useRef)(setOpen);
    onChange.current = setOpen;
    (0, react_1.useEffect)(() => {
        const node = panel.current;
        if (!node)
            return;
        const toggled = (event) => {
            const state = event.newState;
            onChange.current(state === 'open');
        };
        node.addEventListener('toggle', toggled);
        return () => node.removeEventListener('toggle', toggled);
    }, [panel]);
    (0, react_1.useEffect)(() => {
        const node = panel.current;
        if (!node)
            return;
        if (!open) {
            if (node.matches(':popover-open'))
                node.hidePopover();
            return;
        }
        if (typeof node.showPopover !== 'function') {
            onChange.current(false);
            return;
        }
        if (!node.matches(':popover-open'))
            node.showPopover();
        let frame = 0;
        const position = () => {
            const rect = trigger.current?.getBoundingClientRect();
            if (!rect) {
                node.style.left = `${Math.max(16, (innerWidth - node.offsetWidth) / 2)}px`;
                node.style.top = '96px';
                return;
            }
            const width = node.offsetWidth, height = node.offsetHeight;
            const x = align === 'end' ? rect.right - width : align === 'center' ? rect.left + (rect.width - width) / 2 : rect.left;
            const below = rect.bottom + 10;
            const top = below + height <= innerHeight - 16 ? below : Math.max(16, rect.top - height - 10);
            const left = Math.max(16, Math.min(x, innerWidth - width - 16)), resolvedTop = Math.min(top, Math.max(16, innerHeight - height - 16));
            node.style.left = `${left}px`;
            node.style.top = `${resolvedTop}px`;
            // Grow out of the trigger: the transform origin is the trigger centre projected onto the panel box.
            const originX = Math.max(0, Math.min(100, (rect.left + rect.width / 2 - left) / width * 100));
            node.style.setProperty('--lg-origin-x', `${originX}%`);
            node.style.setProperty('--lg-origin-y', resolvedTop >= rect.bottom ? '0%' : '100%');
        };
        const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(position); };
        position();
        const first = menu ? node.querySelector('[role="menuitem"]:not(:disabled)') : (0, utils_js_1.focusable)(node)[0];
        (first ?? node).focus({ preventScroll: true });
        const resize = new ResizeObserver(schedule);
        resize.observe(node);
        if (trigger.current)
            resize.observe(trigger.current);
        window.addEventListener('resize', schedule);
        window.addEventListener('scroll', schedule, true);
        return () => { resize.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('resize', schedule); window.removeEventListener('scroll', schedule, true); };
    }, [open, panel, trigger, align, menu]);
}
function GlassPopover({ trigger, open: controlled, defaultOpen = false, onOpenChange, title, description, children, align = 'end', className, ...surface }) {
    const id = (0, react_1.useId)();
    const triggerRef = (0, react_1.useRef)(null);
    const [open, setOpen] = (0, utils_js_1.useControllable)(controlled, defaultOpen, onOpenChange);
    const glass = (0, material_js_1.useGlassSurface)({ ...surface, material: 'regular' });
    usePopover(open, setOpen, glass.root, triggerRef, align, false);
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [triggerElement(trigger, triggerRef, id, open, 'dialog', setOpen), (0, jsx_runtime_1.jsxs)("div", { popover: "auto", id: id, ref: glass.ref, role: "dialog", tabIndex: -1, "aria-labelledby": `${id}-title`, "aria-describedby": description ? `${id}-desc` : undefined, ...glass.attributes, className: (0, utils_js_1.cx)('lg-root lg-popover', className), style: glass.style, onKeyDown: event => {
                    if (event.key === 'Escape') {
                        event.preventDefault();
                        setOpen(false);
                        triggerRef.current?.focus();
                    }
                }, children: [glass.decoration, (0, jsx_runtime_1.jsx)("div", { className: "lg-content", children: (0, jsx_runtime_1.jsxs)(surface_js_1.SharedSurface, { value: true, children: [(0, jsx_runtime_1.jsx)("h3", { id: `${id}-title`, className: "lg-overlay-title", children: title }), description && (0, jsx_runtime_1.jsx)("p", { id: `${id}-desc`, className: "lg-overlay-description", children: description }), children] }) })] })] });
}
function GlassMenu({ trigger, open: controlled, defaultOpen = false, onOpenChange, items, 'aria-label': label, className, align = 'end', ...surface }) {
    const id = (0, react_1.useId)();
    const triggerRef = (0, react_1.useRef)(null);
    const [open, setOpen] = (0, utils_js_1.useControllable)(controlled, defaultOpen, onOpenChange);
    const glass = (0, material_js_1.useGlassSurface)({ ...surface, material: 'regular' });
    const search = (0, react_1.useRef)({ text: '', time: 0 });
    usePopover(open, setOpen, glass.root, triggerRef, align, true);
    const close = () => { setOpen(false); triggerRef.current?.focus(); };
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [triggerElement(trigger, triggerRef, id, open, 'menu', setOpen), (0, jsx_runtime_1.jsxs)("div", { id: id, ref: glass.ref, popover: "auto", role: "menu", tabIndex: -1, "aria-label": label, ...glass.attributes, className: (0, utils_js_1.cx)('lg-root lg-menu', className), style: glass.style, onKeyDown: event => {
                    if (event.key === 'Escape') {
                        event.preventDefault();
                        close();
                        return;
                    }
                    if (event.key === 'Tab') {
                        close();
                        return;
                    }
                    const enabled = Array.from(glass.root.current?.querySelectorAll('[role="menuitem"]:not(:disabled)') ?? []);
                    const index = enabled.indexOf(document.activeElement);
                    if (!enabled.length)
                        return;
                    let next = index;
                    if (event.key === 'ArrowDown')
                        next = (index + 1) % enabled.length;
                    else if (event.key === 'ArrowUp')
                        next = (index - 1 + enabled.length) % enabled.length;
                    else if (event.key === 'Home')
                        next = 0;
                    else if (event.key === 'End')
                        next = enabled.length - 1;
                    else if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
                        const now = Date.now();
                        search.current.text = (now - search.current.time > 700 ? '' : search.current.text) + event.key.toLocaleLowerCase();
                        search.current.time = now;
                        const match = [...enabled.slice(index + 1), ...enabled.slice(0, index + 1)].find(button => button.dataset.label?.toLocaleLowerCase().startsWith(search.current.text));
                        if (match) {
                            event.preventDefault();
                            match.focus();
                        }
                        return;
                    }
                    else
                        return;
                    event.preventDefault();
                    enabled[next]?.focus();
                }, children: [glass.decoration, (0, jsx_runtime_1.jsx)("div", { className: "lg-content", children: items.map((item, index) => (0, jsx_runtime_1.jsxs)("div", { role: "none", style: { '--lg-index': index }, children: [item.separatorBefore && (0, jsx_runtime_1.jsx)("div", { role: "separator", className: "lg-menu-separator" }), (0, jsx_runtime_1.jsxs)("button", { type: "button", role: "menuitem", tabIndex: -1, className: "lg-menu-item", "data-label": item.label, "data-destructive": item.destructive ? 'true' : 'false', disabled: item.disabled, onClick: () => { close(); item.onSelect(); }, children: [item.label, item.shortcut && (0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", className: "lg-menu-shortcut", children: item.shortcut })] })] }, item.key)) })] })] });
}
let scrollLocks = 0;
let previousOverflow = '';
function lockScroll() {
    if (scrollLocks++ === 0) {
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
    }
    return () => {
        if (--scrollLocks === 0)
            document.body.style.overflow = previousOverflow;
    };
}
function GlassDialog({ trigger, open: controlled, defaultOpen = false, onOpenChange, title, description, children, className, closeLabel = '关闭对话框', dismissOnBackdrop = true, ...surface }) {
    const id = (0, react_1.useId)();
    const triggerRef = (0, react_1.useRef)(null);
    const restoreRef = (0, react_1.useRef)(null);
    const downOutside = (0, react_1.useRef)(false);
    const [open, setOpen] = (0, utils_js_1.useControllable)(controlled, defaultOpen, onOpenChange);
    const glass = (0, material_js_1.useGlassSurface)({ ...surface, material: 'regular', radius: surface.radius ?? 28 });
    (0, react_1.useEffect)(() => {
        const node = glass.root.current;
        if (!node)
            return;
        if (!open) {
            if (node.open)
                node.close();
            return;
        }
        restoreRef.current = document.activeElement;
        if (!node.open)
            node.showModal();
        const unlock = lockScroll();
        return () => {
            if (node.open)
                node.close();
            unlock();
            const target = triggerRef.current ?? restoreRef.current;
            if (target?.isConnected)
                target.focus({ preventScroll: true });
        };
    }, [open, glass.root]);
    const outside = (0, react_1.useCallback)((x, y) => { const rect = glass.root.current?.getBoundingClientRect(); return !!rect && (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom); }, [glass.root]);
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [triggerElement(trigger, triggerRef, id, open, 'dialog', setOpen), (0, jsx_runtime_1.jsxs)("dialog", { id: id, ref: glass.ref, "aria-labelledby": `${id}-title`, "aria-describedby": `${id}-desc`, ...glass.attributes, className: (0, utils_js_1.cx)('lg-root lg-dialog', className), style: glass.style, onCancel: event => { event.preventDefault(); setOpen(false); }, onClose: () => {
                    if (!glass.root.current?.open)
                        setOpen(false);
                }, onPointerDown: event => { downOutside.current = event.target === event.currentTarget && outside(event.clientX, event.clientY); }, onClick: event => {
                    if (dismissOnBackdrop && downOutside.current && event.target === event.currentTarget && outside(event.clientX, event.clientY))
                        setOpen(false);
                    downOutside.current = false;
                }, children: [glass.decoration, (0, jsx_runtime_1.jsx)("div", { className: "lg-content", children: (0, jsx_runtime_1.jsxs)(surface_js_1.SharedSurface, { value: true, children: [(0, jsx_runtime_1.jsx)("h2", { id: `${id}-title`, className: "lg-overlay-title", children: title }), (0, jsx_runtime_1.jsx)("p", { id: `${id}-desc`, className: "lg-overlay-description", children: description }), (0, jsx_runtime_1.jsx)("div", { className: "lg-dialog-body", children: children }), (0, jsx_runtime_1.jsx)(button_js_1.GlassIconButton, { className: "lg-dialog-close", "aria-label": closeLabel, variant: "ghost", onClick: () => setOpen(false), children: (0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", children: "\u00D7" }) })] }) })] })] });
}
function GlassMenuDescription(props) { return (0, jsx_runtime_1.jsx)("p", { ...props, className: (0, utils_js_1.cx)('lg-overlay-description', props.className) }); }

},
"packages/react/provider.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGlassPolicy = void 0;
exports.useMediaQuery = useMediaQuery;
exports.GlassProvider = GlassProvider;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const tokens_1 = require("@liquid-glass-ui/tokens");
const initial = { ...tokens_1.defaultPolicy, resolvedTheme: 'light', reduceTransparency: false, reduceMotion: false, forcedColors: false, enableSvgAuto: false };
const PolicyContext = (0, react_1.createContext)(initial);
function useMediaQuery(query) {
    const store = (0, react_1.useMemo)(() => ({
        subscribe(callback) {
            const media = window.matchMedia(query);
            media.addEventListener('change', callback);
            return () => media.removeEventListener('change', callback);
        },
        getSnapshot: () => typeof window !== 'undefined' && window.matchMedia(query).matches,
        getServerSnapshot: () => false,
    }), [query]);
    return (0, react_1.useSyncExternalStore)(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}
function GlassProvider({ children, ...overrides }) {
    const parent = (0, react_1.useContext)(PolicyContext);
    const dark = useMediaQuery('(prefers-color-scheme: dark)');
    const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    const reduceTransparency = useMediaQuery('(prefers-reduced-transparency: reduce)');
    const forcedColors = useMediaQuery('(forced-colors: active)');
    const defined = Object.fromEntries(Object.entries(overrides).filter(([, v]) => v !== undefined));
    const merged = { ...parent, ...defined };
    const value = {
        ...merged,
        resolvedTheme: merged.theme === 'system' ? (dark ? 'dark' : 'light') : merged.theme,
        reduceMotion: parent.reduceMotion || reduceMotion || merged.motion !== 'system',
        reduceTransparency: parent.reduceTransparency || reduceTransparency || forcedColors || merged.transparency !== 'system',
        forcedColors: parent.forcedColors || forcedColors,
    };
    return (0, jsx_runtime_1.jsx)(PolicyContext.Provider, { value: value, children: children });
}
const useGlassPolicy = () => (0, react_1.useContext)(PolicyContext);
exports.useGlassPolicy = useGlassPolicy;

},
"packages/react/pull.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachPull = attachPull;
exports.usePull = usePull;
exports.elementAt = elementAt;
const react_1 = require("react");
const rubber = (d, limit) => d * limit / (limit + Math.abs(d));
const PROPS = ['--lg-shift-x', '--lg-shift-y', '--lg-stretch-x', '--lg-stretch-y'];
function attachPull(source, getOptions = () => ({})) {
    let active = null;
    const clear = (targets) => {
        for (const t of targets) {
            for (const p of PROPS)
                t.style.removeProperty(p);
            t.removeAttribute('data-pulling');
        }
    };
    const move = (event) => {
        if (!active || event.pointerId !== active.id)
            return;
        cancelAnimationFrame(active.frame);
        active.frame = requestAnimationFrame(() => {
            if (!active)
                return;
            const o = getOptions();
            o.onMove?.(event);
            const limit = o.limit ?? 12, gain = o.stretch ?? .6, axis = o.axis ?? 'both';
            const origin = o.origin?.(event) ?? { x: active.x, y: active.y };
            const dx = axis === 'y' ? 0 : event.clientX - origin.x, dy = axis === 'x' ? 0 : event.clientY - origin.y;
            const px = rubber(dx, limit), py = rubber(dy, limit);
            for (const t of active.targets) {
                const w = t.offsetWidth || 1, h = t.offsetHeight || 1;
                const ex = Math.min(.22, Math.abs(px) / w * gain * 4), ey = Math.min(.22, Math.abs(py) / h * gain * 4);
                t.style.setProperty('--lg-shift-x', `${px.toFixed(2)}px`);
                t.style.setProperty('--lg-shift-y', `${py.toFixed(2)}px`);
                t.style.setProperty('--lg-stretch-x', (1 + ex - ey * .45).toFixed(4));
                t.style.setProperty('--lg-stretch-y', (1 + ey - ex * .45).toFixed(4));
            }
        });
    };
    const end = (event, cancelled) => {
        if (!active || event.pointerId !== active.id)
            return;
        const info = { dx: event.clientX - active.x, dy: event.clientY - active.y, cancelled, event };
        cancelAnimationFrame(active.frame);
        clear(active.targets);
        active = null;
        detach();
        getOptions().onRelease?.(info);
    };
    const up = (event) => end(event, false);
    const cancel = (event) => end(event, true);
    const detach = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', cancel); };
    const down = (event) => {
        if (event.button !== 0 || !event.isPrimary || active)
            return;
        const o = getOptions();
        if (o.disabled?.(event))
            return;
        const targets = (o.targets?.(event) ?? [source]).filter(Boolean);
        if (!targets.length)
            return;
        active = { id: event.pointerId, x: event.clientX, y: event.clientY, targets, frame: 0 };
        for (const t of targets)
            t.setAttribute('data-pulling', 'true');
        o.onPress?.(event);
        window.addEventListener('pointermove', move, { passive: true });
        window.addEventListener('pointerup', up);
        window.addEventListener('pointercancel', cancel);
    };
    source.addEventListener('pointerdown', down);
    return () => {
        source.removeEventListener('pointerdown', down);
        if (active) {
            cancelAnimationFrame(active.frame);
            clear(active.targets);
            active = null;
        }
        detach();
    };
}
function usePull(source, options, enabled = true) {
    const latest = (0, react_1.useRef)(options);
    latest.current = options;
    (0, react_1.useEffect)(() => {
        const node = source.current;
        if (!node || !enabled)
            return;
        return attachPull(node, () => latest.current);
    }, [source, enabled]);
}
/** Enabled segment / tab / link under the pointer at release time, for drag-to-select behaviour. */
function elementAt(event, selector) {
    const hit = document.elementFromPoint(event.clientX, event.clientY);
    return hit?.closest(selector) ?? null;
}

},
"packages/react/scroll-edge.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollEdge = ScrollEdge;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const provider_js_1 = require("./provider.js");
const utils_js_1 = require("./utils.js");
function ScrollEdge({ targetRef, edge = 'top', variant = 'fade', className }) {
    const [active, setActive] = (0, react_1.useState)(false);
    const policy = (0, provider_js_1.useGlassPolicy)();
    (0, react_1.useEffect)(() => {
        const target = targetRef.current;
        if (!target)
            return;
        let frame = 0;
        const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => setActive(edge === 'top' ? target.scrollTop > 1 : target.scrollTop + target.clientHeight < target.scrollHeight - 1)); };
        const observer = new ResizeObserver(update);
        observer.observe(target);
        if (target.firstElementChild)
            observer.observe(target.firstElementChild);
        const mutation = new MutationObserver(update);
        mutation.observe(target, { childList: true, subtree: true, characterData: true });
        target.addEventListener('scroll', update, { passive: true });
        update();
        return () => { observer.disconnect(); mutation.disconnect(); target.removeEventListener('scroll', update); cancelAnimationFrame(frame); };
    }, [targetRef, edge]);
    return (0, jsx_runtime_1.jsx)("div", { "aria-hidden": "true", className: (0, utils_js_1.cx)('lg-scroll-edge', className), "data-lg-theme": policy.resolvedTheme, "data-edge": edge, "data-variant": variant, "data-active": active ? 'true' : 'false' });
}

},
"packages/react/selection.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSelectionLens = useSelectionLens;
exports.GlassSegmentedControl = GlassSegmentedControl;
exports.GlassTabs = GlassTabs;
exports.GlassNavBar = GlassNavBar;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const surface_js_1 = require("./surface.js");
const utils_js_1 = require("./utils.js");
const pull_js_1 = require("./pull.js");
const fusion_js_1 = require("./fusion.js");
const provider_js_1 = require("./provider.js");
/** Lens centre with its live pull offset removed: when the selection changes mid-drag the lens glides to the new slot while the offset eases to zero. */
function lensOrigin(lens) {
    if (!lens)
        return null;
    const box = lens.getBoundingClientRect();
    const shift = parseFloat(lens.style.getPropertyValue('--lg-shift-x')) || 0;
    return { x: box.left + box.width / 2 - shift, y: box.top + box.height / 2 };
}
/** Measures the selected child and positions a single shared lens that glides between choices. */
function useSelectionLens(root, selector, deps) {
    const [lens, setLens] = (0, react_1.useState)({ opacity: 0 });
    (0, react_1.useEffect)(() => {
        const node = root.current;
        if (!node)
            return;
        const update = () => {
            const target = node.querySelector(selector);
            if (target)
                setLens({ width: target.offsetWidth, height: target.offsetHeight, transform: `translateX(${target.offsetLeft}px)`, opacity: 1 });
            else
                setLens({ opacity: 0 });
        };
        update();
        const observer = new ResizeObserver(update);
        observer.observe(node);
        if (typeof document !== 'undefined' && 'fonts' in document)
            document.fonts.ready.then(update, () => { });
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [root, selector, ...deps]);
    return lens;
}
/** Native radio inputs provide form participation and arrow-key selection. */
function GlassSegmentedControl({ items, value, defaultValue, onValueChange, name, disabled, className, 'aria-label': label, ...surface }) {
    const id = (0, react_1.useId)();
    const [selected, setSelected] = (0, utils_js_1.useControllable)(value, defaultValue ?? items.find(x => !x.disabled)?.value ?? '', onValueChange);
    const root = (0, react_1.useRef)(null);
    const policy = (0, provider_js_1.useGlassPolicy)();
    const lens = useSelectionLens(root, '.lg-segment:has(input:checked)', [selected, items]);
    const lensRef = (0, react_1.useRef)(null);
    const fusion = (0, fusion_js_1.useFusion)(root, { itemSelector: '.lg-segment:not([data-disabled="true"])', lensSelector: '.lg-selection-lens' });
    (0, pull_js_1.usePull)(root, {
        axis: 'x', limit: 18, stretch: .8,
        targets: () => lensRef.current ? [lensRef.current] : [],
        origin: () => lensOrigin(lensRef.current),
        disabled: event => !!disabled || !!event.target.closest('[data-disabled="true"]'),
        // The lens follows the pointer and the selection switches live as it crosses each segment.
        onPress: event => pick(event), onMove: event => pick(event),
    }, !policy.reduceMotion && !disabled);
    function pick(event) {
        const hit = (0, pull_js_1.elementAt)(event, '.lg-segment');
        const input = hit?.querySelector('input');
        if (input && !input.disabled && input.value !== selected && root.current?.contains(input))
            setSelected(input.value);
    }
    return (0, jsx_runtime_1.jsx)(surface_js_1.GlassSurface, { ...surface, radius: surface.radius ?? 'pill', className: (0, utils_js_1.cx)('lg-segmented', className), children: (0, jsx_runtime_1.jsxs)("div", { className: "lg-segmented-track", ref: root, role: "radiogroup", "aria-label": label, children: [fusion, (0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", className: "lg-selection-lens", ref: lensRef, style: lens }), items.map(item => (0, jsx_runtime_1.jsxs)("label", { className: "lg-segment", "data-disabled": disabled || item.disabled ? 'true' : 'false', children: [(0, jsx_runtime_1.jsx)("input", { type: "radio", name: name ?? `segment-${id}`, value: item.value, checked: selected === item.value, disabled: disabled || item.disabled, onChange: () => setSelected(item.value) }), (0, jsx_runtime_1.jsx)("span", { children: item.label })] }, item.value))] }) });
}
function GlassTabs({ items, value, defaultValue, onValueChange, 'aria-label': label, className, ...surface }) {
    const id = (0, react_1.useId)();
    const [selected, setSelected] = (0, utils_js_1.useControllable)(value, defaultValue ?? items.find(x => !x.disabled)?.value ?? '', onValueChange);
    const refs = (0, react_1.useRef)([]);
    const list = (0, react_1.useRef)(null);
    const policy = (0, provider_js_1.useGlassPolicy)();
    const lens = useSelectionLens(list, '.lg-tab[aria-selected="true"]', [selected, items]);
    const lensRef = (0, react_1.useRef)(null);
    (0, pull_js_1.usePull)(list, {
        axis: 'x', limit: 18, stretch: .8,
        targets: () => lensRef.current ? [lensRef.current] : [],
        origin: () => lensOrigin(lensRef.current),
        disabled: event => !!event.target.closest('button:disabled'),
        onPress: event => pick(event), onMove: event => pick(event),
        onRelease: ({ event, cancelled }) => {
            if (!cancelled)
                (0, pull_js_1.elementAt)(event, '.lg-tab')?.focus({ preventScroll: true });
        },
    }, !policy.reduceMotion);
    function pick(event) {
        const hit = (0, pull_js_1.elementAt)(event, '.lg-tab');
        const index = refs.current.indexOf(hit);
        if (hit && !hit.disabled && index >= 0 && items[index].value !== selected)
            setSelected(items[index].value);
    }
    return (0, jsx_runtime_1.jsxs)("div", { className: (0, utils_js_1.cx)('lg-tabs', className), children: [(0, jsx_runtime_1.jsx)(surface_js_1.GlassSurface, { ...surface, className: "lg-tabs-surface", radius: "pill", children: (0, jsx_runtime_1.jsxs)("div", { className: "lg-tab-list", role: "tablist", "aria-label": label, ref: list, children: [(0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", className: "lg-selection-lens", ref: lensRef, style: lens }), items.map((item, index) => (0, jsx_runtime_1.jsx)("button", { ref: node => { refs.current[index] = node; }, type: "button", role: "tab", id: `${id}-tab-${index}`, "aria-controls": `${id}-panel-${index}`, "aria-selected": selected === item.value, tabIndex: selected === item.value ? 0 : -1, disabled: item.disabled, className: "lg-tab", onClick: () => setSelected(item.value), onKeyDown: event => {
                                const enabled = items.map((x, i) => x.disabled ? -1 : i).filter(i => i >= 0);
                                const current = enabled.indexOf(index);
                                let next;
                                const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
                                if (event.key === (rtl ? 'ArrowLeft' : 'ArrowRight'))
                                    next = enabled[(current + 1) % enabled.length];
                                else if (event.key === (rtl ? 'ArrowRight' : 'ArrowLeft'))
                                    next = enabled[(current - 1 + enabled.length) % enabled.length];
                                else if (event.key === 'Home')
                                    next = enabled[0];
                                else if (event.key === 'End')
                                    next = enabled.at(-1);
                                else
                                    return;
                                event.preventDefault();
                                setSelected(items[next].value);
                                refs.current[next]?.focus();
                            }, children: item.label }, item.value))] }) }), items.map((item, index) => (0, jsx_runtime_1.jsx)("div", { role: "tabpanel", id: `${id}-panel-${index}`, "aria-labelledby": `${id}-tab-${index}`, hidden: selected !== item.value, tabIndex: 0, className: "lg-tab-panel", children: item.content }, item.value))] });
}
function GlassNavBar({ items, 'aria-label': label, className, material, backdropTone, density, renderer, radius, refraction, ...props }) {
    const list = (0, react_1.useRef)(null);
    const policy = (0, provider_js_1.useGlassPolicy)();
    const currentKey = items.find(item => item.current)?.href;
    const lens = useSelectionLens(list, 'a[aria-current="page"]', [currentKey, items.length]);
    const lensRef = (0, react_1.useRef)(null);
    (0, pull_js_1.usePull)(list, {
        axis: 'x', limit: 18, stretch: .8,
        targets: () => lensRef.current ? [lensRef.current] : [],
        origin: () => lensOrigin(lensRef.current),
    }, !policy.reduceMotion);
    return (0, jsx_runtime_1.jsx)("nav", { ...props, "aria-label": label, className: (0, utils_js_1.cx)('lg-nav', className), children: (0, jsx_runtime_1.jsx)(surface_js_1.GlassSurface, { material: material, backdropTone: backdropTone, density: density, renderer: renderer, radius: radius ?? 'pill', refraction: refraction, children: (0, jsx_runtime_1.jsx)(surface_js_1.SharedSurface, { value: true, children: (0, jsx_runtime_1.jsxs)("div", { className: "lg-nav-items", ref: list, children: [(0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", className: "lg-selection-lens", ref: lensRef, style: lens }), items.map(item => (0, jsx_runtime_1.jsx)("a", { href: item.href, "aria-current": item.current ? 'page' : undefined, onClick: item.onSelect ? event => item.onSelect(event) : undefined, children: item.label }, item.href))] }) }) }) });
}

},
"packages/react/surface.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlassGroup = exports.GlassSurface = exports.SharedSurface = exports.useSharedSurface = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_js_1 = require("./material.js");
const fusion_js_1 = require("./fusion.js");
const utils_js_1 = require("./utils.js");
const SharedContext = (0, react_1.createContext)(false);
const useSharedSurface = () => (0, react_1.useContext)(SharedContext);
exports.useSharedSurface = useSharedSurface;
exports.SharedSurface = SharedContext.Provider;
exports.GlassSurface = (0, react_1.forwardRef)(function GlassSurface({ material, backdropTone, density, renderer, radius, refraction, className, style, children, ...props }, ref) {
    const glass = (0, material_js_1.useGlassSurface)({ material, backdropTone, density, renderer, radius, refraction }, ref);
    return (0, jsx_runtime_1.jsxs)("div", { ...props, ref: glass.ref, ...glass.attributes, className: (0, utils_js_1.cx)('lg-root lg-surface', className), style: { ...glass.style, ...style }, children: [glass.decoration, (0, jsx_runtime_1.jsx)("div", { className: "lg-content", children: children })] });
});
exports.GlassGroup = (0, react_1.forwardRef)(function GlassGroup({ children, className, ...props }, ref) {
    const [root, merged] = (0, utils_js_1.useMergedRef)(ref);
    const fusion = (0, fusion_js_1.useFusion)(root, { itemSelector: ':scope > .lg-content > .lg-button' });
    return (0, jsx_runtime_1.jsx)(exports.GlassSurface, { ...props, ref: merged, className: (0, utils_js_1.cx)('lg-group', className), children: (0, jsx_runtime_1.jsxs)(exports.SharedSurface, { value: true, children: [fusion, children] }) });
});

},
"packages/react/system/backdrop.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBackdropTone = void 0;
exports.BackdropToneProvider = BackdropToneProvider;
exports.GlassBackdrop = GlassBackdrop;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
/**
 * Small Liquid Glass flips light/dark with whatever is behind it. Doing that honestly
 * needs to know the tone of the backdrop, and this library deliberately does not read it:
 * sampling would mean rasterising the page (DOM screenshots, cross-origin pixel reads),
 * which the project forbids. Instead a region declares its own tone once, and every
 * small glass surface inside inherits it.
 *
 * `mixed` is the safe default: an unknown backdrop keeps the app appearance and forces
 * `clear` back to `regular` rather than guessing.
 */
const BackdropToneContext = (0, react_1.createContext)('mixed');
const useBackdropTone = () => (0, react_1.useContext)(BackdropToneContext);
exports.useBackdropTone = useBackdropTone;
/** Context-only form, for when you do not want an extra element in the tree. */
function BackdropToneProvider({ tone, children }) {
    return (0, jsx_runtime_1.jsx)(BackdropToneContext.Provider, { value: tone, children: children });
}
/**
 * A region whose tone is known — a photo, a video, a dark hero. Glass inside adapts to it
 * without any surface having to be told individually.
 */
function GlassBackdrop({ tone, children, ...props }) {
    return (0, jsx_runtime_1.jsx)("div", { ...props, "data-lg-backdrop-tone": tone, children: (0, jsx_runtime_1.jsx)(BackdropToneContext.Provider, { value: tone, children: children }) });
}

},
"packages/react/system/fusion.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFusion = useFusion;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const core_1 = require("@liquid-glass-ui/core");
const provider_js_1 = require("./provider.js");
/** Goo pass tuned against 44px pills: 6px blur, then an alpha ramp steep enough to re-crisp the edge. */
const BLUR = 7, SLOPE = 22, INTERCEPT = -9;
/** The alpha threshold pushes a straight edge out by ~0.23 * blur; inset the blobs by the same amount. */
const EDGE = 1.6;
/** Pull distance (px) that fully engages a neighbour, and the widest gap that may still fuse. */
const REACH = 11, GATE = 40;
/** Neighbour lean toward the pressed pill, and its swell at full attraction. */
const LEAN = 4, SWELL = .04;
/** Release fade of a pressed pill, how long the loop outlives it, the lens trail life and the lens settle window. */
const FADE = 220, RELEASE = 320, TRAIL = 300, SETTLE = 560;
/** Hard cap: one pressed pill plus at most two neighbours. */
const BLOBS = 3;
function paint(node, blob) {
    if (!node)
        return;
    if (!blob || blob.w < .5 || blob.h < .5) {
        node.style.width = '0px';
        node.style.height = '0px';
        return;
    }
    node.style.width = `${blob.w.toFixed(2)}px`;
    node.style.height = `${blob.h.toFixed(2)}px`;
    node.style.borderRadius = `${blob.r.toFixed(2)}px`;
    node.style.transform = `translate(${blob.x.toFixed(2)}px,${blob.y.toFixed(2)}px)`;
}
function useFusion(root, options) {
    const policy = (0, provider_js_1.useGlassPolicy)();
    // Reduced motion, reduced transparency (which already covers forced colours and opaque mode) always win.
    const enabled = !policy.reduceMotion && !policy.reduceTransparency && !policy.forcedColors;
    const filterId = `lg-fusion-${(0, react_1.useId)().replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const layer = (0, react_1.useRef)(null);
    const sheen = (0, react_1.useRef)(null);
    const blobs = (0, react_1.useRef)([]);
    const latest = (0, react_1.useRef)(options);
    latest.current = options;
    (0, react_1.useEffect)(() => {
        const host = root.current, box = layer.current;
        if (!host || !box || !enabled)
            return;
        let frame = 0, held = false, releaseAt = 0, deadline = 0;
        let primary = null, neighbours = [], radius = 9999, last = 0;
        /** Smoothed attraction per neighbour, so droplets grow and melt apart with a little liquid lag. */
        const attraction = [0, 0];
        let trail = null, trailAt = 0, transform = '';
        const items = () => Array.from(host.querySelectorAll(latest.current.itemSelector))
            .filter(node => !node.matches(':disabled,[aria-disabled="true"],[data-disabled="true"]') && node.getClientRects().length > 0);
        const stop = () => {
            cancelAnimationFrame(frame);
            frame = 0;
            primary = null;
            neighbours = [];
            trail = null;
            releaseAt = 0;
            last = 0;
            attraction[0] = attraction[1] = 0;
            host.removeAttribute('data-fusion');
            box.style.setProperty('--lg-fusion-fade', '0');
            if (sheen.current)
                sheen.current.style.opacity = '0';
            for (const node of blobs.current)
                paint(node, null);
        };
        const round = (w, h) => Math.min(radius, Math.min(w, h) / 2);
        /** One rAF tick: every rect is read first, then every style is written. */
        const step = () => {
            frame = requestAnimationFrame(step);
            const now = performance.now();
            const source = latest.current.lensSelector ? host.querySelector(latest.current.lensSelector) : primary;
            if (!source) {
                stop();
                return;
            }
            const lens = !!latest.current.lensSelector;
            // --- reads ---
            const lb = box.getBoundingClientRect();
            const pr = source.getBoundingClientRect();
            const rects = lens ? [] : neighbours.map(node => node.getBoundingClientRect());
            const lightX = source.style.getPropertyValue('--lg-light-x') || '50%';
            const lightY = source.style.getPropertyValue('--lg-light-y') || '50%';
            // Pull's own rubber-banded offset: the pressed rect grows around the pointer, so its centre is not a reach.
            const shiftX = parseFloat(source.style.getPropertyValue('--lg-shift-x')) || 0;
            const shiftY = parseFloat(source.style.getPropertyValue('--lg-shift-y')) || 0;
            const smooth = (0, core_1.clamp)((last ? now - last : 16) / 90, 0, 1);
            last = now;
            if (held) {
                releaseAt = 0;
                deadline = now + SETTLE;
            }
            const fade = lens ? 1 : releaseAt ? (0, core_1.clamp)(1 - (now - releaseAt) / FADE, 0, 1) : 1;
            // --- geometry ---
            const px = pr.left - lb.left, py = pr.top - lb.top;
            const cx = px + pr.width / 2, cy = py + pr.height / 2;
            const shapes = [{ x: px + EDGE, y: py + EDGE, w: pr.width - EDGE * 2, h: pr.height - EDGE * 2, r: round(pr.width, pr.height) }];
            if (lens && trail) {
                const age = (0, core_1.clamp)((now - trailAt) / TRAIL, 0, 1), k = 1 - age;
                if (age >= 1)
                    trail = null;
                else {
                    // The old slot collapses in place while drifting after the lens; the goo dissolves it once it is small.
                    const tw = trail.w * k, th = trail.h * k;
                    const tcx = trail.x + trail.w / 2 + (cx - (trail.x + trail.w / 2)) * age * .7;
                    const tcy = trail.y + trail.h / 2 + (cy - (trail.y + trail.h / 2)) * age * .7;
                    shapes.push({ x: tcx - tw / 2, y: tcy - th / 2, w: tw, h: th, r: Math.min(tw, th) / 2 });
                }
            }
            for (let i = 0; i < rects.length; i++) {
                const n = rects[i];
                const nx = n.left - lb.left, ny = n.top - lb.top;
                const ncx = nx + n.width / 2, ncy = ny + n.height / 2;
                const dx = ncx - cx, dy = ncy - cy;
                const horizontal = Math.abs(dx) >= Math.abs(dy);
                const sign = (horizontal ? dx : dy) >= 0 ? 1 : -1;
                const reach = (horizontal ? shiftX : shiftY) * sign;
                const gap = horizontal
                    ? (sign > 0 ? nx - (px + pr.width) : px - (nx + n.width))
                    : (sign > 0 ? ny - (py + pr.height) : py - (ny + n.height));
                const target = gap > GATE ? 0 : (0, core_1.clamp)((reach - 1) / REACH, 0, 1) * fade;
                attraction[i] += (target - attraction[i]) * smooth;
                const d = attraction[i];
                if (d <= .02) {
                    shapes.push(null);
                    continue;
                }
                // A droplet emerges from nothing on the facing edge, then grows into the full neighbour pill.
                const emerge = Math.min(1, d * 4) * (1 + SWELL * d);
                const h0 = n.height * (.34 + .66 * d);
                const bw = Math.min(n.width, h0 + (n.width - h0) * d) * emerge, bh = h0 * emerge;
                const nearX = horizontal ? (sign > 0 ? nx + bw / 2 : nx + n.width - bw / 2) : ncx;
                const nearY = horizontal ? ncy : (sign > 0 ? ny + bh / 2 : ny + n.height - bh / 2);
                const bcx = nearX + (ncx - nearX) * d - (horizontal ? sign * LEAN * d : 0);
                const bcy = nearY + (ncy - nearY) * d - (horizontal ? 0 : sign * LEAN * d);
                shapes.push({ x: bcx - bw / 2, y: bcy - bh / 2, w: bw, h: bh, r: Math.min(bw, bh) / 2 });
            }
            // --- writes ---
            box.style.setProperty('--lg-fusion-fade', fade.toFixed(3));
            for (let i = 0; i < BLOBS; i++)
                paint(blobs.current[i], shapes[i] ?? null);
            const crisp = sheen.current;
            if (crisp) {
                // As the pills become one body the pressed pill's own rim would read as a seam, so it dissolves.
                crisp.style.opacity = (fade * (1 - .8 * Math.max(attraction[0], attraction[1]))).toFixed(3);
                crisp.style.width = `${pr.width.toFixed(2)}px`;
                crisp.style.height = `${pr.height.toFixed(2)}px`;
                crisp.style.borderRadius = `${round(pr.width, pr.height).toFixed(2)}px`;
                crisp.style.transform = `translate(${px.toFixed(2)}px,${py.toFixed(2)}px)`;
                crisp.style.setProperty('--lg-light-x', lightX);
                crisp.style.setProperty('--lg-light-y', lightY);
            }
            if (lens ? now > deadline : releaseAt && now - releaseAt > RELEASE)
                stop();
        };
        const start = () => {
            if (!frame)
                frame = requestAnimationFrame(step);
        };
        const release = () => { held = false; releaseAt = performance.now(); deadline = performance.now() + SETTLE; };
        const detach = () => { window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); };
        const up = () => { release(); detach(); };
        const down = (event) => {
            if (event.button !== 0 || !event.isPrimary)
                return;
            const list = items();
            if (list.length < 2)
                return;
            if (latest.current.lensSelector) {
                if (!host.querySelector(latest.current.lensSelector))
                    return;
            }
            else {
                // itemSelector may be scoped (":scope > ..."), which closest() cannot evaluate; match by containment instead.
                const index = list.findIndex(item => item === event.target || item.contains(event.target));
                if (index < 0)
                    return;
                primary = list[index];
                neighbours = [list[index - 1], list[index + 1]].filter(Boolean);
                attraction[0] = attraction[1] = 0;
                last = 0;
                radius = parseFloat(getComputedStyle(primary).borderTopLeftRadius) || 9999;
            }
            held = true;
            releaseAt = 0;
            deadline = performance.now() + SETTLE;
            host.setAttribute('data-fusion', 'true');
            window.addEventListener('pointerup', up);
            window.addEventListener('pointercancel', up);
            start();
        };
        host.addEventListener('pointerdown', down);
        // Selection lens: any slot change (drag or keyboard) leaves the old position behind as a collapsing droplet.
        let observer;
        const lensNode = latest.current.lensSelector ? host.querySelector(latest.current.lensSelector) : null;
        if (lensNode && typeof MutationObserver !== 'undefined') {
            transform = lensNode.style.transform;
            observer = new MutationObserver(() => {
                const previous = transform;
                if (lensNode.style.transform === previous)
                    return;
                transform = lensNode.style.transform;
                // The first positioning pass is the lens taking its initial slot, not a flow between slots.
                if (!previous || items().length < 2)
                    return;
                const r = lensNode.getBoundingClientRect(), lb = box.getBoundingClientRect();
                trail = { x: r.left - lb.left, y: r.top - lb.top, w: r.width, h: r.height, r: Math.min(r.width, r.height) / 2 };
                trailAt = performance.now();
                deadline = trailAt + SETTLE;
                radius = parseFloat(getComputedStyle(lensNode).borderTopLeftRadius) || 9999;
                host.setAttribute('data-fusion', 'true');
                start();
            });
            observer.observe(lensNode, { attributes: true, attributeFilter: ['style'] });
        }
        return () => { host.removeEventListener('pointerdown', down); detach(); observer?.disconnect(); stop(); };
    }, [root, enabled]);
    if (!enabled)
        return null;
    return (0, jsx_runtime_1.jsxs)("span", { className: "lg-fusion", "aria-hidden": "true", ref: layer, children: [(0, jsx_runtime_1.jsx)("svg", { width: "0", height: "0", className: "lg-filter-defs", focusable: "false", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)("defs", { children: (0, jsx_runtime_1.jsxs)("filter", { id: filterId, x: "-12%", y: "-70%", width: "124%", height: "240%", colorInterpolationFilters: "sRGB", children: [(0, jsx_runtime_1.jsx)("feGaussianBlur", { in: "SourceGraphic", stdDeviation: BLUR, result: "lg-soft" }), (0, jsx_runtime_1.jsx)("feColorMatrix", { in: "lg-soft", type: "matrix", values: `1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${SLOPE} ${INTERCEPT}` })] }) }) }), (0, jsx_runtime_1.jsx)("span", { className: "lg-fusion-goo", style: { filter: `url(#${filterId})` }, children: Array.from({ length: BLOBS }, (_, i) => (0, jsx_runtime_1.jsx)("span", { className: "lg-fusion-blob", ref: node => { blobs.current[i] = node; } }, i)) }), (0, jsx_runtime_1.jsx)("span", { className: "lg-fusion-sheen", ref: sheen })] });
}

},
"packages/react/system/icon.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryIcon = LibraryIcon;
const jsx_runtime_1 = require("react/jsx-runtime");
const paths = {
    chevronForward: 'M9 5l7 7-7 7',
    chevronDown: 'M5 9l7 7 7-7',
    checkmark: 'M5 12.5l4.5 4.5L19 7',
    close: 'M6 6l12 12M18 6L6 18',
    search: 'M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM15.4 15.4L20 20',
    clear: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18zM9 9l6 6M15 9l-6 6',
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14',
    grabber: 'M5 12h14',
    ellipsis: 'M5 12h.01M12 12h.01M19 12h.01',
};
/** Decorative by default: the accessible name belongs on the control, not the glyph. */
function LibraryIcon({ name, size = 20, ...props }) {
    return (0, jsx_runtime_1.jsx)("svg", { ...props, width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: name === 'ellipsis' ? 3.4 : 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", focusable: "false", children: (0, jsx_runtime_1.jsx)("path", { d: paths[name] }) });
}

},
"packages/react/system/material.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGlassSurface = useGlassSurface;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const core_1 = require("@liquid-glass-ui/core");
const tokens_1 = require("@liquid-glass-ui/tokens");
const provider_js_1 = require("./provider.js");
const backdrop_js_1 = require("./backdrop.js");
const utils_js_1 = require("./utils.js");
const pull_js_1 = require("./pull.js");
/** Chromatic spread: red bends least, blue most, matching normal glass dispersion. */
const CHROMA_SPREAD = [1.09, 1, .91];
function useGlassSurface(options, externalRef, shared = false, pressable = false) {
    const policy = (0, provider_js_1.useGlassPolicy)();
    const inheritedTone = (0, backdrop_js_1.useBackdropTone)();
    const [root, ref] = (0, utils_js_1.useMergedRef)(externalRef);
    const id = `lg-${(0, react_1.useId)().replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const [texture, setTexture] = (0, react_1.useState)(null);
    const [capable, setCapable] = (0, react_1.useState)(false);
    const frame = (0, react_1.useRef)(0);
    const displacement = (0, react_1.useRef)([]);
    const requestedMaterial = options.material ?? policy.material;
    const tone = options.backdropTone ?? inheritedTone;
    const size = options.size ?? 'small';
    // Unknown backgrounds deliberately use regular, not an unverified auto-contrast heuristic.
    const material = requestedMaterial === 'clear' && tone === 'mixed' ? 'regular' : requestedMaterial;
    const density = options.density ?? policy.density;
    const radius = options.radius ?? tokens_1.densityTokens[density].radius;
    const renderer = options.renderer ?? policy.renderer;
    const chroma = !!options.chroma && !policy.reduceTransparency;
    const wantsSvg = !shared && !policy.reduceTransparency && (renderer === 'svg' || (renderer === 'auto' && policy.enableSvgAuto));
    const spec = tokens_1.materialTokens[material][size];
    const strength = Number.isFinite(options.refraction) ? (0, core_1.clamp)(options.refraction, 0, 64) : spec.refraction;
    /**
     * Small glass flips light/dark with what is behind it — that is what makes a tab bar
     * legible over a photo. Large glass keeps the app appearance: flipping a sidebar or a
     * sheet as content scrolls under it is distracting (WWDC25/219).
     */
    const appearance = size === 'small' && tone !== 'mixed' ? tone : policy.resolvedTheme;
    (0, react_1.useEffect)(() => { setCapable((0, core_1.supportsSvgBackdrop)()); }, []);
    (0, react_1.useEffect)(() => {
        const element = root.current;
        if (!element || !wantsSvg || !capable || typeof ResizeObserver === 'undefined') {
            setTexture(null);
            return;
        }
        let queued = 0;
        const update = () => {
            cancelAnimationFrame(queued);
            queued = requestAnimationFrame(() => {
                const width = element.offsetWidth, height = element.offsetHeight;
                if (!width || !height) {
                    setTexture(null);
                    return;
                }
                const r = radius === 'pill' ? Math.min(width, height) / 2 : Math.min(Math.max(0, radius), Math.min(width, height) / 2);
                const next = (0, core_1.getDisplacementTexture)({ width, height, radius: r, edge: spec.edge, maxResolution: policy.quality === 'high' ? 512 : 256 });
                setTexture(previous => previous?.url === next?.url && previous?.width === next?.width && previous?.height === next?.height ? previous : next);
            });
        };
        const observer = new ResizeObserver(update);
        observer.observe(element);
        (0, core_1.trackObserver)(1);
        update();
        return () => { observer.disconnect(); (0, core_1.trackObserver)(-1); cancelAnimationFrame(queued); };
    }, [root, wantsSvg, capable, radius, spec.edge, policy.quality]);
    (0, react_1.useEffect)(() => {
        const node = root.current;
        if (!node || policy.reduceMotion)
            return;
        /**
         * One pointer position drives two things: the interactive glow that pools under the
         * finger, and the angle of the virtual light source. The specular rim travels around
         * the silhouette instead of sitting on one edge — the highlight is refraction, not a
         * gradient painted across the face.
         */
        const setLight = (clientX, clientY) => {
            const box = node.getBoundingClientRect();
            if (!box.width || !box.height)
                return;
            const x = (0, core_1.clamp)((clientX - box.left) / box.width * 100, 0, 100);
            const y = (0, core_1.clamp)((clientY - box.top) / box.height * 100, 0, 100);
            node.style.setProperty('--lg-light-x', `${x}%`);
            node.style.setProperty('--lg-light-y', `${y}%`);
            // CSS conic angles start at 12 o'clock and run clockwise; screen y grows downward.
            const angle = 90 + Math.atan2(clientY - (box.top + box.height / 2), clientX - (box.left + box.width / 2)) * 180 / Math.PI;
            node.style.setProperty('--lg-light-angle', `${angle.toFixed(1)}deg`);
        };
        // The glow enters where the pointer enters, follows it 1:1, and fades out where it left. Position is never reset.
        const onEnter = (event) => {
            if (event.pointerType !== 'mouse')
                return;
            cancelAnimationFrame(frame.current);
            setLight(event.clientX, event.clientY);
            node.setAttribute('data-lit', 'true');
        };
        const onMove = (event) => {
            if (event.pointerType !== 'mouse')
                return;
            cancelAnimationFrame(frame.current);
            frame.current = requestAnimationFrame(() => setLight(event.clientX, event.clientY));
        };
        const onLeave = () => { cancelAnimationFrame(frame.current); node.removeAttribute('data-lit'); };
        // Press origin for every pointer type: the glass swells toward the exact touch / click point.
        const onDown = (event) => { cancelAnimationFrame(frame.current); setLight(event.clientX, event.clientY); };
        // Keyboard activation gets the same press choreography as a pointer (Enter does not set :active in Chrome).
        const onKeyDown = (event) => {
            if ((event.key === 'Enter' || event.key === ' ') && event.target === node && !event.repeat)
                node.setAttribute('data-pressed', 'true');
        };
        const onKeyUp = () => node.removeAttribute('data-pressed');
        node.addEventListener('pointerenter', onEnter);
        node.addEventListener('pointermove', onMove);
        node.addEventListener('pointerleave', onLeave);
        node.addEventListener('pointerdown', onDown);
        node.addEventListener('keydown', onKeyDown);
        node.addEventListener('keyup', onKeyUp);
        node.addEventListener('blur', onKeyUp);
        const detachPull = pressable ? (0, pull_js_1.attachPull)(node, () => ({ disabled: () => node.matches(':disabled,[aria-disabled="true"]') })) : undefined;
        return () => {
            node.removeEventListener('pointerenter', onEnter);
            node.removeEventListener('pointermove', onMove);
            node.removeEventListener('pointerleave', onLeave);
            node.removeEventListener('pointerdown', onDown);
            node.removeEventListener('keydown', onKeyDown);
            node.removeEventListener('keyup', onKeyUp);
            node.removeEventListener('blur', onKeyUp);
            node.removeAttribute('data-pressed');
            node.removeAttribute('data-lit');
            cancelAnimationFrame(frame.current);
            detachPull?.();
        };
    }, [root, policy.reduceMotion, pressable]);
    const active = wantsSvg && capable && texture;
    /**
     * Press-time lensing: while the glass is held the edge refraction deepens, like pressing
     * into a droplet, and springs back on release. Only the filter's scale attribute changes;
     * the geometry map is never regenerated.
     */
    (0, react_1.useEffect)(() => {
        const node = root.current;
        if (!node || !active || policy.reduceMotion)
            return;
        const spring = (0, core_1.createSpring)(strength, value => {
            const maps = displacement.current;
            for (let i = 0; i < maps.length; i++)
                maps[i]?.setAttribute('scale', (value * (chroma ? CHROMA_SPREAD[i] ?? 1 : 1)).toFixed(2));
        });
        const pressed = () => spring.to(Math.min(64, strength * 1.6 + 6));
        const released = () => spring.to(strength);
        const onKey = (event) => {
            if ((event.key === 'Enter' || event.key === ' ') && !event.repeat)
                pressed();
        };
        node.addEventListener('pointerdown', pressed);
        node.addEventListener('keydown', onKey);
        node.addEventListener('keyup', released);
        node.addEventListener('blur', released);
        window.addEventListener('pointerup', released);
        window.addEventListener('pointercancel', released);
        spring.set(strength);
        return () => {
            spring.stop();
            node.removeEventListener('pointerdown', pressed);
            node.removeEventListener('keydown', onKey);
            node.removeEventListener('keyup', released);
            node.removeEventListener('blur', released);
            window.removeEventListener('pointerup', released);
            window.removeEventListener('pointercancel', released);
        };
    }, [root, active, strength, chroma, policy.reduceMotion]);
    const resolvedRenderer = shared ? 'shared' : policy.reduceTransparency ? 'opaque' : active ? 'svg' : 'css';
    const style = {
        '--lg-radius': radius === 'pill' ? '9999px' : `${Math.max(0, Number.isFinite(radius) ? radius : 18)}px`,
        '--lg-control-height': `${tokens_1.densityTokens[density].controlHeight}px`,
        '--lg-blur': `${spec.blur}px`,
        '--lg-backdrop': active
            ? `url("#${id}") saturate(${spec.saturation}) contrast(var(--lg-glass-contrast,1))`
            : `blur(${spec.blur}px) saturate(${spec.saturation}) contrast(var(--lg-glass-contrast,1))`,
    };
    const attributes = {
        'data-lg-theme': appearance, 'data-material': material, 'data-backdrop-tone': tone,
        'data-density': density, 'data-renderer': resolvedRenderer, 'data-glass-size': size,
        'data-reduced-motion': policy.reduceMotion ? 'true' : 'false',
        'data-transparency': policy.reduceTransparency ? 'opaque' : 'normal',
        'data-forced-colors': policy.forcedColors ? 'true' : 'false',
        ...(policy.increaseContrast ? { 'data-lg-contrast': 'more' } : {}),
    };
    const channels = chroma ? CHROMA_SPREAD : [1];
    const filter = active && (0, jsx_runtime_1.jsx)("svg", { width: "0", height: "0", className: "lg-filter-defs", focusable: "false", "aria-hidden": "true", children: (0, jsx_runtime_1.jsx)("defs", { children: (0, jsx_runtime_1.jsxs)("filter", { id: id, x: -80, y: -80, width: texture.width + 160, height: texture.height + 160, filterUnits: "userSpaceOnUse", primitiveUnits: "userSpaceOnUse", colorInterpolationFilters: "sRGB", children: [(0, jsx_runtime_1.jsx)("feGaussianBlur", { in: "SourceGraphic", stdDeviation: spec.blur / 2, result: "softened" }), (0, jsx_runtime_1.jsx)("feImage", { href: texture.url, x: "0", y: "0", width: texture.width, height: texture.height, preserveAspectRatio: "none", result: "geometry" }), channels.map((spread, index) => (0, jsx_runtime_1.jsx)("feDisplacementMap", { ref: node => { displacement.current[index] = node; }, in: "softened", in2: "geometry", scale: strength * spread, xChannelSelector: "R", yChannelSelector: "G", result: chroma ? `bent-${index}` : undefined }, index)), chroma && (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("feColorMatrix", { in: "bent-0", type: "matrix", values: "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0", result: "channel-r" }), (0, jsx_runtime_1.jsx)("feColorMatrix", { in: "bent-1", type: "matrix", values: "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0", result: "channel-g" }), (0, jsx_runtime_1.jsx)("feColorMatrix", { in: "bent-2", type: "matrix", values: "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0", result: "channel-b" }), (0, jsx_runtime_1.jsx)("feBlend", { in: "channel-r", in2: "channel-g", mode: "screen", result: "channel-rg" }), (0, jsx_runtime_1.jsx)("feBlend", { in: "channel-rg", in2: "channel-b", mode: "screen" })] })] }) }) });
    const decoration = shared ? null : (0, jsx_runtime_1.jsxs)("span", { className: "lg-decoration", "aria-hidden": "true", children: [filter, (0, jsx_runtime_1.jsx)("span", { className: "lg-backdrop" }), (0, jsx_runtime_1.jsx)("span", { className: "lg-tint" }), (0, jsx_runtime_1.jsx)("span", { className: "lg-rim" }), (0, jsx_runtime_1.jsx)("span", { className: "lg-glow" })] });
    return { ref, root, style, attributes, decoration, policy, appearance, size };
}

},
"packages/react/system/provider.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGlassPolicy = void 0;
exports.useMediaQuery = useMediaQuery;
exports.GlassProvider = GlassProvider;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const tokens_1 = require("@liquid-glass-ui/tokens");
const initial = { ...tokens_1.defaultPolicy, resolvedTheme: 'light', reduceTransparency: false, reduceMotion: false, increaseContrast: false, forcedColors: false, enableSvgAuto: false };
const PolicyContext = (0, react_1.createContext)(initial);
function useMediaQuery(query) {
    const store = (0, react_1.useMemo)(() => ({
        subscribe(callback) {
            const media = window.matchMedia(query);
            media.addEventListener('change', callback);
            return () => media.removeEventListener('change', callback);
        },
        getSnapshot: () => typeof window !== 'undefined' && window.matchMedia(query).matches,
        getServerSnapshot: () => false,
    }), [query]);
    return (0, react_1.useSyncExternalStore)(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}
function GlassProvider({ children, ...overrides }) {
    const parent = (0, react_1.useContext)(PolicyContext);
    const dark = useMediaQuery('(prefers-color-scheme: dark)');
    const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    const reduceTransparency = useMediaQuery('(prefers-reduced-transparency: reduce)');
    const increaseContrast = useMediaQuery('(prefers-contrast: more)');
    const forcedColors = useMediaQuery('(forced-colors: active)');
    const defined = Object.fromEntries(Object.entries(overrides).filter(([, v]) => v !== undefined));
    const merged = { ...parent, ...defined };
    const value = {
        ...merged,
        resolvedTheme: merged.theme === 'system' ? (dark ? 'dark' : 'light') : merged.theme,
        reduceMotion: parent.reduceMotion || reduceMotion || merged.motion !== 'system',
        reduceTransparency: parent.reduceTransparency || reduceTransparency || forcedColors || merged.transparency !== 'system',
        // Increase Contrast and forced colours both mean "stop relying on translucency for legibility".
        increaseContrast: parent.increaseContrast || increaseContrast || forcedColors || merged.contrast !== 'system',
        forcedColors: parent.forcedColors || forcedColors,
    };
    return (0, jsx_runtime_1.jsx)(PolicyContext.Provider, { value: value, children: children });
}
const useGlassPolicy = () => (0, react_1.useContext)(PolicyContext);
exports.useGlassPolicy = useGlassPolicy;

},
"packages/react/system/pull.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachPull = attachPull;
exports.usePull = usePull;
exports.elementAt = elementAt;
const react_1 = require("react");
const rubber = (d, limit) => d * limit / (limit + Math.abs(d));
const PROPS = ['--lg-shift-x', '--lg-shift-y', '--lg-stretch-x', '--lg-stretch-y'];
function attachPull(source, getOptions = () => ({})) {
    let active = null;
    const clear = (targets) => {
        for (const t of targets) {
            for (const p of PROPS)
                t.style.removeProperty(p);
            t.removeAttribute('data-pulling');
        }
    };
    const move = (event) => {
        if (!active || event.pointerId !== active.id)
            return;
        cancelAnimationFrame(active.frame);
        active.frame = requestAnimationFrame(() => {
            if (!active)
                return;
            const o = getOptions();
            o.onMove?.(event);
            const limit = o.limit ?? 12, gain = o.stretch ?? .6, axis = o.axis ?? 'both';
            const origin = o.origin?.(event) ?? { x: active.x, y: active.y };
            const dx = axis === 'y' ? 0 : event.clientX - origin.x, dy = axis === 'x' ? 0 : event.clientY - origin.y;
            const px = rubber(dx, limit), py = rubber(dy, limit);
            for (const t of active.targets) {
                const w = t.offsetWidth || 1, h = t.offsetHeight || 1;
                const ex = Math.min(.22, Math.abs(px) / w * gain * 4), ey = Math.min(.22, Math.abs(py) / h * gain * 4);
                t.style.setProperty('--lg-shift-x', `${px.toFixed(2)}px`);
                t.style.setProperty('--lg-shift-y', `${py.toFixed(2)}px`);
                t.style.setProperty('--lg-stretch-x', (1 + ex - ey * .45).toFixed(4));
                t.style.setProperty('--lg-stretch-y', (1 + ey - ex * .45).toFixed(4));
            }
        });
    };
    const end = (event, cancelled) => {
        if (!active || event.pointerId !== active.id)
            return;
        const info = { dx: event.clientX - active.x, dy: event.clientY - active.y, cancelled, event };
        cancelAnimationFrame(active.frame);
        clear(active.targets);
        active = null;
        detach();
        getOptions().onRelease?.(info);
    };
    const up = (event) => end(event, false);
    const cancel = (event) => end(event, true);
    const detach = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', cancel); };
    const down = (event) => {
        if (event.button !== 0 || !event.isPrimary || active)
            return;
        const o = getOptions();
        if (o.disabled?.(event))
            return;
        const targets = (o.targets?.(event) ?? [source]).filter(Boolean);
        if (!targets.length)
            return;
        active = { id: event.pointerId, x: event.clientX, y: event.clientY, targets, frame: 0 };
        for (const t of targets)
            t.setAttribute('data-pulling', 'true');
        o.onPress?.(event);
        window.addEventListener('pointermove', move, { passive: true });
        window.addEventListener('pointerup', up);
        window.addEventListener('pointercancel', cancel);
    };
    source.addEventListener('pointerdown', down);
    return () => {
        source.removeEventListener('pointerdown', down);
        if (active) {
            cancelAnimationFrame(active.frame);
            clear(active.targets);
            active = null;
        }
        detach();
    };
}
function usePull(source, options, enabled = true) {
    const latest = (0, react_1.useRef)(options);
    latest.current = options;
    (0, react_1.useEffect)(() => {
        const node = source.current;
        if (!node || !enabled)
            return;
        return attachPull(node, () => latest.current);
    }, [source, enabled]);
}
/** Enabled segment / tab / link under the pointer at release time, for drag-to-select behaviour. */
function elementAt(event, selector) {
    const hit = document.elementFromPoint(event.clientX, event.clientY);
    return hit?.closest(selector) ?? null;
}

},
"packages/react/system/surface.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlassGroup = exports.GlassSurface = exports.SharedSurface = exports.useSharedSurface = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_js_1 = require("./material.js");
const fusion_js_1 = require("./fusion.js");
const utils_js_1 = require("./utils.js");
const SharedContext = (0, react_1.createContext)(false);
const useSharedSurface = () => (0, react_1.useContext)(SharedContext);
exports.useSharedSurface = useSharedSurface;
exports.SharedSurface = SharedContext.Provider;
/**
 * A floating Liquid Glass surface. This belongs to the navigation / control layer — bars,
 * groups, overlays. It is not a card: content-layer containers use `Card`, `List` or
 * `MaterialView`, which do not sample the backdrop at all.
 */
exports.GlassSurface = (0, react_1.forwardRef)(function GlassSurface({ material, backdropTone, density, renderer, radius, refraction, size, chroma, className, style, children, ...props }, ref) {
    const glass = (0, material_js_1.useGlassSurface)({ material, backdropTone, density, renderer, radius, refraction, size, chroma }, ref);
    return (0, jsx_runtime_1.jsxs)("div", { ...props, ref: glass.ref, ...glass.attributes, className: (0, utils_js_1.cx)('lg-root lg-surface', className), style: { ...glass.style, ...style }, children: [glass.decoration, (0, jsx_runtime_1.jsx)("div", { className: "lg-content", children: children })] });
});
exports.GlassGroup = (0, react_1.forwardRef)(function GlassGroup({ children, className, ...props }, ref) {
    const [root, merged] = (0, utils_js_1.useMergedRef)(ref);
    const fusion = (0, fusion_js_1.useFusion)(root, { itemSelector: ':scope > .lg-content > .lg-button' });
    return (0, jsx_runtime_1.jsx)(exports.GlassSurface, { ...props, ref: merged, className: (0, utils_js_1.cx)('lg-group', className), children: (0, jsx_runtime_1.jsxs)(exports.SharedSurface, { value: true, children: [fusion, children] }) });
});

},
"packages/react/system/utils.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cx = void 0;
exports.assignRef = assignRef;
exports.useMergedRef = useMergedRef;
exports.useControllable = useControllable;
exports.focusable = focusable;
const react_1 = require("react");
const cx = (...values) => values.filter(Boolean).join(' ');
exports.cx = cx;
function assignRef(ref, value) {
    if (typeof ref === 'function')
        return ref(value);
    else if (ref)
        ref.current = value;
}
function useMergedRef(external) {
    const ref = (0, react_1.useRef)(null);
    const callback = (0, react_1.useCallback)((node) => {
        ref.current = node;
        const cleanup = assignRef(external, node);
        // React 19 callback refs may return cleanup; do not discard consumer cleanups.
        return () => {
            ref.current = null;
            if (typeof cleanup === 'function')
                cleanup();
            else
                assignRef(external, null);
        };
    }, [external]);
    return [ref, callback];
}
function useControllable(value, defaultValue, onChange) {
    const [internal, setInternal] = (0, react_1.useState)(defaultValue);
    const current = value === undefined ? internal : value;
    const set = (0, react_1.useCallback)((next) => {
        if (value === undefined)
            setInternal(next);
        if (!Object.is(next, current))
            onChange?.(next);
    }, [value, current, onChange]);
    return [current, set];
}
function focusable(root) {
    return Array.from(root.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]'))
        .filter(el => !el.hidden && !el.closest('[inert]') && el.getClientRects().length > 0 && el.getAttribute('aria-disabled') !== 'true');
}

},
"packages/react/toolbar.js": function(module,exports,require){
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlassToolbar = void 0;
exports.GlassToolbarSeparator = GlassToolbarSeparator;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_js_1 = require("./material.js");
const fusion_js_1 = require("./fusion.js");
const surface_js_1 = require("./surface.js");
const utils_js_1 = require("./utils.js");
/** Roving focus for toolbar BUTTONS only; complex input widgets belong outside this primitive. */
exports.GlassToolbar = (0, react_1.forwardRef)(function GlassToolbar({ material, backdropTone, density, renderer, radius = 'pill', refraction, className, style, children, orientation = 'horizontal', onKeyDown, onFocusCapture, ...props }, ref) {
    const glass = (0, material_js_1.useGlassSurface)({ material, backdropTone, density, renderer, radius, refraction }, ref);
    const fusion = (0, fusion_js_1.useFusion)(glass.root, { itemSelector: ':scope > .lg-content > .lg-button' });
    const items = () => Array.from(glass.root.current?.querySelectorAll('button:not(:disabled)') ?? []).filter(b => b.closest('[role="toolbar"]') === glass.root.current && !b.closest('[popover]') && b.getClientRects().length > 0);
    const setTabStop = (target) => {
        for (const item of items())
            item.tabIndex = item === target ? 0 : -1;
    };
    (0, react_1.useEffect)(() => {
        const node = glass.root.current;
        if (!node)
            return;
        const reset = () => {
            const available = items();
            const current = available.find(item => item === document.activeElement) ?? available.find(item => item.tabIndex === 0) ?? available[0];
            if (current)
                setTabStop(current);
        };
        reset();
        const observer = new MutationObserver(reset);
        observer.observe(node, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled'] });
        return () => observer.disconnect();
    });
    const keyboard = (event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey)
            return;
        const available = items();
        const index = available.indexOf(document.activeElement);
        if (index < 0)
            return;
        const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
        const previous = orientation === 'horizontal' ? (rtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
        const next = orientation === 'horizontal' ? (rtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
        let target = index;
        if (event.key === next)
            target = (index + 1) % available.length;
        else if (event.key === previous)
            target = (index - 1 + available.length) % available.length;
        else if (event.key === 'Home')
            target = 0;
        else if (event.key === 'End')
            target = available.length - 1;
        else
            return;
        event.preventDefault();
        setTabStop(available[target]);
        available[target].focus();
    };
    return (0, jsx_runtime_1.jsxs)("div", { ...props, ref: glass.ref, role: "toolbar", "aria-orientation": orientation, ...glass.attributes, className: (0, utils_js_1.cx)('lg-root lg-toolbar', className), "data-orientation": orientation, style: { ...glass.style, ...style }, onKeyDown: keyboard, onFocusCapture: event => {
            onFocusCapture?.(event);
            if (event.target.tagName === 'BUTTON')
                setTabStop(event.target);
        }, children: [glass.decoration, (0, jsx_runtime_1.jsx)("div", { className: "lg-content", children: (0, jsx_runtime_1.jsxs)(surface_js_1.SharedSurface, { value: true, children: [fusion, children] }) })] });
});
function GlassToolbarSeparator() { return (0, jsx_runtime_1.jsx)("span", { className: "lg-toolbar-separator", "aria-hidden": "true" }); }

},
"packages/react/utils.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cx = void 0;
exports.assignRef = assignRef;
exports.useMergedRef = useMergedRef;
exports.useControllable = useControllable;
exports.focusable = focusable;
const react_1 = require("react");
const cx = (...values) => values.filter(Boolean).join(' ');
exports.cx = cx;
function assignRef(ref, value) {
    if (typeof ref === 'function')
        return ref(value);
    else if (ref)
        ref.current = value;
}
function useMergedRef(external) {
    const ref = (0, react_1.useRef)(null);
    const callback = (0, react_1.useCallback)((node) => {
        ref.current = node;
        const cleanup = assignRef(external, node);
        // React 19 callback refs may return cleanup; do not discard consumer cleanups.
        return () => {
            ref.current = null;
            if (typeof cleanup === 'function')
                cleanup();
            else
                assignRef(external, null);
        };
    }, [external]);
    return [ref, callback];
}
function useControllable(value, defaultValue, onChange) {
    const [internal, setInternal] = (0, react_1.useState)(defaultValue);
    const current = value === undefined ? internal : value;
    const set = (0, react_1.useCallback)((next) => {
        if (value === undefined)
            setInternal(next);
        if (!Object.is(next, current))
            onChange?.(next);
    }, [value, current, onChange]);
    return [current, set];
}
function focusable(root) {
    return Array.from(root.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]'))
        .filter(el => !el.hidden && !el.closest('[inert]') && el.getClientRects().length > 0 && el.getAttribute('aria-disabled') !== 'true');
}

},
"packages/tokens/index.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPolicy = exports.zIndexTokens = exports.textScale = exports.textStyles = exports.radiusTokens = exports.spacingTokens = exports.motionTokens = exports.densityTokens = exports.materialTokens = void 0;
/** Optical parameters per material and per glass size. Sizes are CSS pixels. */
exports.materialTokens = {
    regular: {
        small: { blur: 14, saturation: 1.15, refraction: 18, edge: 16 },
        large: { blur: 40, saturation: 1.3, refraction: 26, edge: 22 },
    },
    clear: {
        small: { blur: 1.5, saturation: 1.08, refraction: 32, edge: 18 },
        large: { blur: 6, saturation: 1.12, refraction: 40, edge: 24 },
    },
};
exports.densityTokens = {
    compact: { controlHeight: 36, radius: 12, gap: 6 },
    comfortable: { controlHeight: 44, radius: 18, gap: 8 },
};
exports.motionTokens = { press: 90, release: 220, layout: 280, spring: 520, overlay: 360 };
/** 4pt grid plus the HIG layout metrics that components read from TypeScript. */
exports.spacingTokens = {
    space1: 4, space2: 8, space3: 12, space4: 16, space5: 20, space6: 24, space8: 32, space10: 40,
    margin: 16, marginRegular: 20, hitMin: 44, readable: 672, sidebarWidth: 260, controlGap: 8,
};
/** Fixed radii. Capsule is height/2; concentric radii come from `concentricRadius` in core. */
exports.radiusTokens = {
    xs: 6, s: 10, m: 14, l: 20, xl: 26, xxl: 34, sheet: 38, window: 24,
};
/**
 * iOS text styles at the Large (default) content size. `tracking` is in em, taken
 * from the HIG "1/1000 em" column so it survives Dynamic Type scaling.
 * 11pt (caption2) is the floor for readable text — nothing may go below it.
 */
exports.textStyles = {
    largeTitle: { size: 34, leading: 41, tracking: .012, weight: 400, emphasizedWeight: 700 },
    title1: { size: 28, leading: 34, tracking: .014, weight: 400, emphasizedWeight: 700 },
    title2: { size: 22, leading: 28, tracking: -.012, weight: 400, emphasizedWeight: 700 },
    title3: { size: 20, leading: 25, tracking: -.023, weight: 400, emphasizedWeight: 600 },
    headline: { size: 17, leading: 22, tracking: -.026, weight: 600, emphasizedWeight: 600 },
    body: { size: 17, leading: 22, tracking: -.026, weight: 400, emphasizedWeight: 600 },
    callout: { size: 16, leading: 21, tracking: -.020, weight: 400, emphasizedWeight: 600 },
    subhead: { size: 15, leading: 20, tracking: -.016, weight: 400, emphasizedWeight: 600 },
    footnote: { size: 13, leading: 18, tracking: -.006, weight: 400, emphasizedWeight: 600 },
    caption1: { size: 12, leading: 16, tracking: 0, weight: 400, emphasizedWeight: 600 },
    caption2: { size: 11, leading: 13, tracking: .006, weight: 400, emphasizedWeight: 600 },
};
/** Multiplier applied to the whole type scale per Dynamic Type content size. */
exports.textScale = {
    xs: .824, s: .882, m: .941, l: 1, xl: 1.118, xxl: 1.235, xxxl: 1.353,
    ax1: 1.647, ax2: 1.941, ax3: 2.353, ax4: 2.765, ax5: 3.118,
};
/** Overlay stacking bands. A new overlay picks the band it belongs to. */
exports.zIndexTokens = {
    content: 0, scrollEdge: 10, sidebar: 15, tabBar: 20,
    sheetBackdrop: 30, sheet: 31, menu: 40, alert: 41, toast: 60,
};
exports.defaultPolicy = {
    material: 'regular', renderer: 'auto', quality: 'balanced', theme: 'system',
    density: 'comfortable', transparency: 'system', motion: 'system', contrast: 'system',
};

},
"vendor/jsx-runtime.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fragment = exports.jsxs = exports.jsx = void 0;
const react_runtime_js_1 = require("./react-runtime.js");
exports.jsx = react_runtime_js_1.JSX.jsx, exports.jsxs = react_runtime_js_1.JSX.jsxs, exports.Fragment = react_runtime_js_1.JSX.Fragment;

},
"vendor/react-dom-client.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hydrateRoot = exports.createRoot = void 0;
const react_runtime_js_1 = require("./react-runtime.js");
exports.createRoot = react_runtime_js_1.ReactDOMClient.createRoot, exports.hydrateRoot = react_runtime_js_1.ReactDOMClient.hydrateRoot;

},
"vendor/react-dom.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = exports.preload = exports.preinit = exports.prefetchDNS = exports.preconnect = exports.flushSync = exports.createPortal = void 0;
const react_runtime_js_1 = require("./react-runtime.js");
exports.createPortal = react_runtime_js_1.ReactDOM.createPortal, exports.flushSync = react_runtime_js_1.ReactDOM.flushSync, exports.preconnect = react_runtime_js_1.ReactDOM.preconnect, exports.prefetchDNS = react_runtime_js_1.ReactDOM.prefetchDNS, exports.preinit = react_runtime_js_1.ReactDOM.preinit, exports.preload = react_runtime_js_1.ReactDOM.preload, exports.version = react_runtime_js_1.ReactDOM.version;

},
"vendor/react-runtime.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSX = exports.ReactDOMClient = exports.ReactDOM = exports.React = void 0;
function L1(n) { return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n; }
var Yf = { exports: {} }, Ma = {}; /**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var yy;
function D1() { if (yy)
    return Ma; yy = 1; var n = Symbol.for("react.transitional.element"), e = Symbol.for("react.fragment"); function i(s, l, o) { var u = null; if (o !== void 0 && (u = "" + o), l.key !== void 0 && (u = "" + l.key), "key" in l) {
    o = {};
    for (var f in l)
        f !== "key" && (o[f] = l[f]);
}
else
    o = l; return l = o.ref, { $$typeof: n, type: s, key: u, ref: l !== void 0 ? l : null, props: o }; } return Ma.Fragment = e, Ma.jsx = i, Ma.jsxs = i, Ma; }
var by;
function B1() { return by || (by = 1, Yf.exports = D1()), Yf.exports; }
var b = B1(), Xf = { exports: {} }, de = {}; /**
* @license React
* react.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
exports.JSX = b;
var vy;
function U1() { if (vy)
    return de; vy = 1; var n = Symbol.for("react.transitional.element"), e = Symbol.for("react.portal"), i = Symbol.for("react.fragment"), s = Symbol.for("react.strict_mode"), l = Symbol.for("react.profiler"), o = Symbol.for("react.consumer"), u = Symbol.for("react.context"), f = Symbol.for("react.forward_ref"), d = Symbol.for("react.suspense"), p = Symbol.for("react.memo"), m = Symbol.for("react.lazy"), y = Symbol.iterator; function v(N) { return N === null || typeof N != "object" ? null : (N = y && N[y] || N["@@iterator"], typeof N == "function" ? N : null); } var S = { isMounted: function () { return !1; }, enqueueForceUpdate: function () { }, enqueueReplaceState: function () { }, enqueueSetState: function () { } }, E = Object.assign, x = {}; function T(N, P, W) { this.props = N, this.context = P, this.refs = x, this.updater = W || S; } T.prototype.isReactComponent = {}, T.prototype.setState = function (N, P) { if (typeof N != "object" && typeof N != "function" && N != null)
    throw Error("takes an object of state variables to update or a function which returns an object of state variables."); this.updater.enqueueSetState(this, N, P, "setState"); }, T.prototype.forceUpdate = function (N) { this.updater.enqueueForceUpdate(this, N, "forceUpdate"); }; function C() { } C.prototype = T.prototype; function k(N, P, W) { this.props = N, this.context = P, this.refs = x, this.updater = W || S; } var $ = k.prototype = new C; $.constructor = k, E($, T.prototype), $.isPureReactComponent = !0; var V = Array.isArray, R = { H: null, A: null, T: null, S: null, V: null }, G = Object.prototype.hasOwnProperty; function Z(N, P, W, J, ae, be) { return W = be.ref, { $$typeof: n, type: N, key: P, ref: W !== void 0 ? W : null, props: be }; } function q(N, P) { return Z(N.type, P, void 0, void 0, void 0, N.props); } function j(N) { return typeof N == "object" && N !== null && N.$$typeof === n; } function ie(N) { var P = { "=": "=0", ":": "=2" }; return "$" + N.replace(/[=:]/g, function (W) { return P[W]; }); } var le = /\/+/g; function I(N, P) { return typeof N == "object" && N !== null && N.key != null ? ie("" + N.key) : P.toString(36); } function F() { } function ee(N) { switch (N.status) {
    case "fulfilled": return N.value;
    case "rejected": throw N.reason;
    default: switch (typeof N.status == "string" ? N.then(F, F) : (N.status = "pending", N.then(function (P) { N.status === "pending" && (N.status = "fulfilled", N.value = P); }, function (P) { N.status === "pending" && (N.status = "rejected", N.reason = P); })), N.status) {
        case "fulfilled": return N.value;
        case "rejected": throw N.reason;
    }
} throw N; } function ve(N, P, W, J, ae) { var be = typeof N; (be === "undefined" || be === "boolean") && (N = null); var te = !1; if (N === null)
    te = !0;
else
    switch (be) {
        case "bigint":
        case "string":
        case "number":
            te = !0;
            break;
        case "object": switch (N.$$typeof) {
            case n:
            case e:
                te = !0;
                break;
            case m: return te = N._init, ve(te(N._payload), P, W, J, ae);
        }
    } if (te)
    return ae = ae(N), te = J === "" ? "." + I(N, 0) : J, V(ae) ? (W = "", te != null && (W = te.replace(le, "$&/") + "/"), ve(ae, P, W, "", function (Gt) { return Gt; })) : ae != null && (j(ae) && (ae = q(ae, W + (ae.key == null || N && N.key === ae.key ? "" : ("" + ae.key).replace(le, "$&/") + "/") + te)), P.push(ae)), 1; te = 0; var yt = J === "" ? "." : J + ":"; if (V(N))
    for (var Ne = 0; Ne < N.length; Ne++)
        J = N[Ne], be = yt + I(J, Ne), te += ve(J, P, W, be, ae);
else if (Ne = v(N), typeof Ne == "function")
    for (N = Ne.call(N), Ne = 0; !(J = N.next()).done;)
        J = J.value, be = yt + I(J, Ne++), te += ve(J, P, W, be, ae);
else if (be === "object") {
    if (typeof N.then == "function")
        return ve(ee(N), P, W, J, ae);
    throw P = String(N), Error("Objects are not valid as a React child (found: " + (P === "[object Object]" ? "object with keys {" + Object.keys(N).join(", ") + "}" : P) + "). If you meant to render a collection of children, use an array instead.");
} return te; } function z(N, P, W) { if (N == null)
    return N; var J = [], ae = 0; return ve(N, J, "", "", function (be) { return P.call(W, be, ae++); }), J; } function Q(N) { if (N._status === -1) {
    var P = N._result;
    P = P(), P.then(function (W) { (N._status === 0 || N._status === -1) && (N._status = 1, N._result = W); }, function (W) { (N._status === 0 || N._status === -1) && (N._status = 2, N._result = W); }), N._status === -1 && (N._status = 0, N._result = P);
} if (N._status === 1)
    return N._result.default; throw N._result; } var se = typeof reportError == "function" ? reportError : function (N) { if (typeof window == "object" && typeof window.ErrorEvent == "function") {
    var P = new window.ErrorEvent("error", { bubbles: !0, cancelable: !0, message: typeof N == "object" && N !== null && typeof N.message == "string" ? String(N.message) : String(N), error: N });
    if (!window.dispatchEvent(P))
        return;
}
else if (typeof process == "object" && typeof process.emit == "function") {
    process.emit("uncaughtException", N);
    return;
} console.error(N); }; function we() { } return de.Children = { map: z, forEach: function (N, P, W) { z(N, function () { P.apply(this, arguments); }, W); }, count: function (N) { var P = 0; return z(N, function () { P++; }), P; }, toArray: function (N) { return z(N, function (P) { return P; }) || []; }, only: function (N) { if (!j(N))
        throw Error("React.Children.only expected to receive a single React element child."); return N; } }, de.Component = T, de.Fragment = i, de.Profiler = l, de.PureComponent = k, de.StrictMode = s, de.Suspense = d, de.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = R, de.__COMPILER_RUNTIME = { __proto__: null, c: function (N) { return R.H.useMemoCache(N); } }, de.cache = function (N) { return function () { return N.apply(null, arguments); }; }, de.cloneElement = function (N, P, W) { if (N == null)
    throw Error("The argument must be a React element, but you passed " + N + "."); var J = E({}, N.props), ae = N.key, be = void 0; if (P != null)
    for (te in P.ref !== void 0 && (be = void 0), P.key !== void 0 && (ae = "" + P.key), P)
        !G.call(P, te) || te === "key" || te === "__self" || te === "__source" || te === "ref" && P.ref === void 0 || (J[te] = P[te]); var te = arguments.length - 2; if (te === 1)
    J.children = W;
else if (1 < te) {
    for (var yt = Array(te), Ne = 0; Ne < te; Ne++)
        yt[Ne] = arguments[Ne + 2];
    J.children = yt;
} return Z(N.type, ae, void 0, void 0, be, J); }, de.createContext = function (N) { return N = { $$typeof: u, _currentValue: N, _currentValue2: N, _threadCount: 0, Provider: null, Consumer: null }, N.Provider = N, N.Consumer = { $$typeof: o, _context: N }, N; }, de.createElement = function (N, P, W) { var J, ae = {}, be = null; if (P != null)
    for (J in P.key !== void 0 && (be = "" + P.key), P)
        G.call(P, J) && J !== "key" && J !== "__self" && J !== "__source" && (ae[J] = P[J]); var te = arguments.length - 2; if (te === 1)
    ae.children = W;
else if (1 < te) {
    for (var yt = Array(te), Ne = 0; Ne < te; Ne++)
        yt[Ne] = arguments[Ne + 2];
    ae.children = yt;
} if (N && N.defaultProps)
    for (J in te = N.defaultProps, te)
        ae[J] === void 0 && (ae[J] = te[J]); return Z(N, be, void 0, void 0, null, ae); }, de.createRef = function () { return { current: null }; }, de.forwardRef = function (N) { return { $$typeof: f, render: N }; }, de.isValidElement = j, de.lazy = function (N) { return { $$typeof: m, _payload: { _status: -1, _result: N }, _init: Q }; }, de.memo = function (N, P) { return { $$typeof: p, type: N, compare: P === void 0 ? null : P }; }, de.startTransition = function (N) { var P = R.T, W = {}; R.T = W; try {
    var J = N(), ae = R.S;
    ae !== null && ae(W, J), typeof J == "object" && J !== null && typeof J.then == "function" && J.then(we, se);
}
catch (be) {
    se(be);
}
finally {
    R.T = P;
} }, de.unstable_useCacheRefresh = function () { return R.H.useCacheRefresh(); }, de.use = function (N) { return R.H.use(N); }, de.useActionState = function (N, P, W) { return R.H.useActionState(N, P, W); }, de.useCallback = function (N, P) { return R.H.useCallback(N, P); }, de.useContext = function (N) { return R.H.useContext(N); }, de.useDebugValue = function () { }, de.useDeferredValue = function (N, P) { return R.H.useDeferredValue(N, P); }, de.useEffect = function (N, P, W) { var J = R.H; if (typeof W == "function")
    throw Error("useEffect CRUD overload is not enabled in this build of React."); return J.useEffect(N, P); }, de.useId = function () { return R.H.useId(); }, de.useImperativeHandle = function (N, P, W) { return R.H.useImperativeHandle(N, P, W); }, de.useInsertionEffect = function (N, P) { return R.H.useInsertionEffect(N, P); }, de.useLayoutEffect = function (N, P) { return R.H.useLayoutEffect(N, P); }, de.useMemo = function (N, P) { return R.H.useMemo(N, P); }, de.useOptimistic = function (N, P) { return R.H.useOptimistic(N, P); }, de.useReducer = function (N, P, W) { return R.H.useReducer(N, P, W); }, de.useRef = function (N) { return R.H.useRef(N); }, de.useState = function (N) { return R.H.useState(N); }, de.useSyncExternalStore = function (N, P, W) { return R.H.useSyncExternalStore(N, P, W); }, de.useTransition = function () { return R.H.useTransition(); }, de.version = "19.1.1", de; }
var Sy;
function Bh() { return Sy || (Sy = 1, Xf.exports = U1()), Xf.exports; }
var H = Bh();
exports.React = H;
const gt = L1(H);
var Pf = { exports: {} }, Oa = {}, Ff = { exports: {} }, Qf = {}; /**
* @license React
* scheduler.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var _y;
function G1() { return _y || (_y = 1, (function (n) { function e(z, Q) { var se = z.length; z.push(Q); e: for (; 0 < se;) {
    var we = se - 1 >>> 1, N = z[we];
    if (0 < l(N, Q))
        z[we] = Q, z[se] = N, se = we;
    else
        break e;
} } function i(z) { return z.length === 0 ? null : z[0]; } function s(z) { if (z.length === 0)
    return null; var Q = z[0], se = z.pop(); if (se !== Q) {
    z[0] = se;
    e: for (var we = 0, N = z.length, P = N >>> 1; we < P;) {
        var W = 2 * (we + 1) - 1, J = z[W], ae = W + 1, be = z[ae];
        if (0 > l(J, se))
            ae < N && 0 > l(be, J) ? (z[we] = be, z[ae] = se, we = ae) : (z[we] = J, z[W] = se, we = W);
        else if (ae < N && 0 > l(be, se))
            z[we] = be, z[ae] = se, we = ae;
        else
            break e;
    }
} return Q; } function l(z, Q) { var se = z.sortIndex - Q.sortIndex; return se !== 0 ? se : z.id - Q.id; } if (n.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
    var o = performance;
    n.unstable_now = function () { return o.now(); };
}
else {
    var u = Date, f = u.now();
    n.unstable_now = function () { return u.now() - f; };
} var d = [], p = [], m = 1, y = null, v = 3, S = !1, E = !1, x = !1, T = !1, C = typeof setTimeout == "function" ? setTimeout : null, k = typeof clearTimeout == "function" ? clearTimeout : null, $ = typeof setImmediate < "u" ? setImmediate : null; function V(z) { for (var Q = i(p); Q !== null;) {
    if (Q.callback === null)
        s(p);
    else if (Q.startTime <= z)
        s(p), Q.sortIndex = Q.expirationTime, e(d, Q);
    else
        break;
    Q = i(p);
} } function R(z) { if (x = !1, V(z), !E)
    if (i(d) !== null)
        E = !0, G || (G = !0, I());
    else {
        var Q = i(p);
        Q !== null && ve(R, Q.startTime - z);
    } } var G = !1, Z = -1, q = 5, j = -1; function ie() { return T ? !0 : !(n.unstable_now() - j < q); } function le() { if (T = !1, G) {
    var z = n.unstable_now();
    j = z;
    var Q = !0;
    try {
        e: {
            E = !1, x && (x = !1, k(Z), Z = -1), S = !0;
            var se = v;
            try {
                t: {
                    for (V(z), y = i(d); y !== null && !(y.expirationTime > z && ie());) {
                        var we = y.callback;
                        if (typeof we == "function") {
                            y.callback = null, v = y.priorityLevel;
                            var N = we(y.expirationTime <= z);
                            if (z = n.unstable_now(), typeof N == "function") {
                                y.callback = N, V(z), Q = !0;
                                break t;
                            }
                            y === i(d) && s(d), V(z);
                        }
                        else
                            s(d);
                        y = i(d);
                    }
                    if (y !== null)
                        Q = !0;
                    else {
                        var P = i(p);
                        P !== null && ve(R, P.startTime - z), Q = !1;
                    }
                }
                break e;
            }
            finally {
                y = null, v = se, S = !1;
            }
            Q = void 0;
        }
    }
    finally {
        Q ? I() : G = !1;
    }
} } var I; if (typeof $ == "function")
    I = function () { $(le); };
else if (typeof MessageChannel < "u") {
    var F = new MessageChannel, ee = F.port2;
    F.port1.onmessage = le, I = function () { ee.postMessage(null); };
}
else
    I = function () { C(le, 0); }; function ve(z, Q) { Z = C(function () { z(n.unstable_now()); }, Q); } n.unstable_IdlePriority = 5, n.unstable_ImmediatePriority = 1, n.unstable_LowPriority = 4, n.unstable_NormalPriority = 3, n.unstable_Profiling = null, n.unstable_UserBlockingPriority = 2, n.unstable_cancelCallback = function (z) { z.callback = null; }, n.unstable_forceFrameRate = function (z) { 0 > z || 125 < z ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : q = 0 < z ? Math.floor(1e3 / z) : 5; }, n.unstable_getCurrentPriorityLevel = function () { return v; }, n.unstable_next = function (z) { switch (v) {
    case 1:
    case 2:
    case 3:
        var Q = 3;
        break;
    default: Q = v;
} var se = v; v = Q; try {
    return z();
}
finally {
    v = se;
} }, n.unstable_requestPaint = function () { T = !0; }, n.unstable_runWithPriority = function (z, Q) { switch (z) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5: break;
    default: z = 3;
} var se = v; v = z; try {
    return Q();
}
finally {
    v = se;
} }, n.unstable_scheduleCallback = function (z, Q, se) { var we = n.unstable_now(); switch (typeof se == "object" && se !== null ? (se = se.delay, se = typeof se == "number" && 0 < se ? we + se : we) : se = we, z) {
    case 1:
        var N = -1;
        break;
    case 2:
        N = 250;
        break;
    case 5:
        N = 1073741823;
        break;
    case 4:
        N = 1e4;
        break;
    default: N = 5e3;
} return N = se + N, z = { id: m++, callback: Q, priorityLevel: z, startTime: se, expirationTime: N, sortIndex: -1 }, se > we ? (z.sortIndex = se, e(p, z), i(d) === null && z === i(p) && (x ? (k(Z), Z = -1) : x = !0, ve(R, se - we))) : (z.sortIndex = N, e(d, z), E || S || (E = !0, G || (G = !0, I()))), z; }, n.unstable_shouldYield = ie, n.unstable_wrapCallback = function (z) { var Q = v; return function () { var se = v; v = Q; try {
    return z.apply(this, arguments);
}
finally {
    v = se;
} }; }; })(Qf)), Qf; }
var Ty;
function K1() { return Ty || (Ty = 1, Ff.exports = G1()), Ff.exports; }
var Zf = { exports: {} }, dt = {}; /**
* @license React
* react-dom.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var Ey;
function Y1() { if (Ey)
    return dt; Ey = 1; var n = Bh(); function e(d) { var p = "https://react.dev/errors/" + d; if (1 < arguments.length) {
    p += "?args[]=" + encodeURIComponent(arguments[1]);
    for (var m = 2; m < arguments.length; m++)
        p += "&args[]=" + encodeURIComponent(arguments[m]);
} return "Minified React error #" + d + "; visit " + p + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."; } function i() { } var s = { d: { f: i, r: function () { throw Error(e(522)); }, D: i, C: i, L: i, m: i, X: i, S: i, M: i }, p: 0, findDOMNode: null }, l = Symbol.for("react.portal"); function o(d, p, m) { var y = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null; return { $$typeof: l, key: y == null ? null : "" + y, children: d, containerInfo: p, implementation: m }; } var u = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE; function f(d, p) { if (d === "font")
    return ""; if (typeof p == "string")
    return p === "use-credentials" ? p : ""; } return dt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = s, dt.createPortal = function (d, p) { var m = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null; if (!p || p.nodeType !== 1 && p.nodeType !== 9 && p.nodeType !== 11)
    throw Error(e(299)); return o(d, p, null, m); }, dt.flushSync = function (d) { var p = u.T, m = s.p; try {
    if (u.T = null, s.p = 2, d)
        return d();
}
finally {
    u.T = p, s.p = m, s.d.f();
} }, dt.preconnect = function (d, p) { typeof d == "string" && (p ? (p = p.crossOrigin, p = typeof p == "string" ? p === "use-credentials" ? p : "" : void 0) : p = null, s.d.C(d, p)); }, dt.prefetchDNS = function (d) { typeof d == "string" && s.d.D(d); }, dt.preinit = function (d, p) { if (typeof d == "string" && p && typeof p.as == "string") {
    var m = p.as, y = f(m, p.crossOrigin), v = typeof p.integrity == "string" ? p.integrity : void 0, S = typeof p.fetchPriority == "string" ? p.fetchPriority : void 0;
    m === "style" ? s.d.S(d, typeof p.precedence == "string" ? p.precedence : void 0, { crossOrigin: y, integrity: v, fetchPriority: S }) : m === "script" && s.d.X(d, { crossOrigin: y, integrity: v, fetchPriority: S, nonce: typeof p.nonce == "string" ? p.nonce : void 0 });
} }, dt.preinitModule = function (d, p) { if (typeof d == "string")
    if (typeof p == "object" && p !== null) {
        if (p.as == null || p.as === "script") {
            var m = f(p.as, p.crossOrigin);
            s.d.M(d, { crossOrigin: m, integrity: typeof p.integrity == "string" ? p.integrity : void 0, nonce: typeof p.nonce == "string" ? p.nonce : void 0 });
        }
    }
    else
        p == null && s.d.M(d); }, dt.preload = function (d, p) { if (typeof d == "string" && typeof p == "object" && p !== null && typeof p.as == "string") {
    var m = p.as, y = f(m, p.crossOrigin);
    s.d.L(d, m, { crossOrigin: y, integrity: typeof p.integrity == "string" ? p.integrity : void 0, nonce: typeof p.nonce == "string" ? p.nonce : void 0, type: typeof p.type == "string" ? p.type : void 0, fetchPriority: typeof p.fetchPriority == "string" ? p.fetchPriority : void 0, referrerPolicy: typeof p.referrerPolicy == "string" ? p.referrerPolicy : void 0, imageSrcSet: typeof p.imageSrcSet == "string" ? p.imageSrcSet : void 0, imageSizes: typeof p.imageSizes == "string" ? p.imageSizes : void 0, media: typeof p.media == "string" ? p.media : void 0 });
} }, dt.preloadModule = function (d, p) { if (typeof d == "string")
    if (p) {
        var m = f(p.as, p.crossOrigin);
        s.d.m(d, { as: typeof p.as == "string" && p.as !== "script" ? p.as : void 0, crossOrigin: m, integrity: typeof p.integrity == "string" ? p.integrity : void 0 });
    }
    else
        s.d.m(d); }, dt.requestFormReset = function (d) { s.d.r(d); }, dt.unstable_batchedUpdates = function (d, p) { return d(p); }, dt.useFormState = function (d, p, m) { return u.H.useFormState(d, p, m); }, dt.useFormStatus = function () { return u.H.useHostTransitionStatus(); }, dt.version = "19.1.1", dt; }
var Ay;
function X1() { if (Ay)
    return Zf.exports; Ay = 1; function n() { if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
    try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
    }
    catch (e) {
        console.error(e);
    } } return n(), Zf.exports = Y1(), Zf.exports; } /**
* @license React
* react-dom-client.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var Ny;
function P1() {
    if (Ny)
        return Oa;
    Ny = 1;
    var n = K1(), e = Bh(), i = X1();
    function s(t) { var r = "https://react.dev/errors/" + t; if (1 < arguments.length) {
        r += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var a = 2; a < arguments.length; a++)
            r += "&args[]=" + encodeURIComponent(arguments[a]);
    } return "Minified React error #" + t + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."; }
    function l(t) { return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11); }
    function o(t) { var r = t, a = t; if (t.alternate)
        for (; r.return;)
            r = r.return;
    else {
        t = r;
        do
            r = t, (r.flags & 4098) !== 0 && (a = r.return), t = r.return;
        while (t);
    } return r.tag === 3 ? a : null; }
    function u(t) { if (t.tag === 13) {
        var r = t.memoizedState;
        if (r === null && (t = t.alternate, t !== null && (r = t.memoizedState)), r !== null)
            return r.dehydrated;
    } return null; }
    function f(t) { if (o(t) !== t)
        throw Error(s(188)); }
    function d(t) { var r = t.alternate; if (!r) {
        if (r = o(t), r === null)
            throw Error(s(188));
        return r !== t ? null : t;
    } for (var a = t, c = r;;) {
        var h = a.return;
        if (h === null)
            break;
        var g = h.alternate;
        if (g === null) {
            if (c = h.return, c !== null) {
                a = c;
                continue;
            }
            break;
        }
        if (h.child === g.child) {
            for (g = h.child; g;) {
                if (g === a)
                    return f(h), t;
                if (g === c)
                    return f(h), r;
                g = g.sibling;
            }
            throw Error(s(188));
        }
        if (a.return !== c.return)
            a = h, c = g;
        else {
            for (var w = !1, _ = h.child; _;) {
                if (_ === a) {
                    w = !0, a = h, c = g;
                    break;
                }
                if (_ === c) {
                    w = !0, c = h, a = g;
                    break;
                }
                _ = _.sibling;
            }
            if (!w) {
                for (_ = g.child; _;) {
                    if (_ === a) {
                        w = !0, a = g, c = h;
                        break;
                    }
                    if (_ === c) {
                        w = !0, c = g, a = h;
                        break;
                    }
                    _ = _.sibling;
                }
                if (!w)
                    throw Error(s(189));
            }
        }
        if (a.alternate !== c)
            throw Error(s(190));
    } if (a.tag !== 3)
        throw Error(s(188)); return a.stateNode.current === a ? t : r; }
    function p(t) { var r = t.tag; if (r === 5 || r === 26 || r === 27 || r === 6)
        return t; for (t = t.child; t !== null;) {
        if (r = p(t), r !== null)
            return r;
        t = t.sibling;
    } return null; }
    var m = Object.assign, y = Symbol.for("react.element"), v = Symbol.for("react.transitional.element"), S = Symbol.for("react.portal"), E = Symbol.for("react.fragment"), x = Symbol.for("react.strict_mode"), T = Symbol.for("react.profiler"), C = Symbol.for("react.provider"), k = Symbol.for("react.consumer"), $ = Symbol.for("react.context"), V = Symbol.for("react.forward_ref"), R = Symbol.for("react.suspense"), G = Symbol.for("react.suspense_list"), Z = Symbol.for("react.memo"), q = Symbol.for("react.lazy"), j = Symbol.for("react.activity"), ie = Symbol.for("react.memo_cache_sentinel"), le = Symbol.iterator;
    function I(t) { return t === null || typeof t != "object" ? null : (t = le && t[le] || t["@@iterator"], typeof t == "function" ? t : null); }
    var F = Symbol.for("react.client.reference");
    function ee(t) { if (t == null)
        return null; if (typeof t == "function")
        return t.$$typeof === F ? null : t.displayName || t.name || null; if (typeof t == "string")
        return t; switch (t) {
        case E: return "Fragment";
        case T: return "Profiler";
        case x: return "StrictMode";
        case R: return "Suspense";
        case G: return "SuspenseList";
        case j: return "Activity";
    } if (typeof t == "object")
        switch (t.$$typeof) {
            case S: return "Portal";
            case $: return (t.displayName || "Context") + ".Provider";
            case k: return (t._context.displayName || "Context") + ".Consumer";
            case V:
                var r = t.render;
                return t = t.displayName, t || (t = r.displayName || r.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
            case Z: return r = t.displayName || null, r !== null ? r : ee(t.type) || "Memo";
            case q:
                r = t._payload, t = t._init;
                try {
                    return ee(t(r));
                }
                catch { }
        } return null; }
    var ve = Array.isArray, z = e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Q = i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, se = { pending: !1, data: null, method: null, action: null }, we = [], N = -1;
    function P(t) { return { current: t }; }
    function W(t) { 0 > N || (t.current = we[N], we[N] = null, N--); }
    function J(t, r) { N++, we[N] = t.current, t.current = r; }
    var ae = P(null), be = P(null), te = P(null), yt = P(null);
    function Ne(t, r) { switch (J(te, r), J(be, t), J(ae, null), r.nodeType) {
        case 9:
        case 11:
            t = (t = r.documentElement) && (t = t.namespaceURI) ? Km(t) : 0;
            break;
        default: if (t = r.tagName, r = r.namespaceURI)
            r = Km(r), t = Ym(r, t);
        else
            switch (t) {
                case "svg":
                    t = 1;
                    break;
                case "math":
                    t = 2;
                    break;
                default: t = 0;
            }
    } W(ae), J(ae, t); }
    function Gt() { W(ae), W(be), W(te); }
    function jr(t) { t.memoizedState !== null && J(yt, t); var r = ae.current, a = Ym(r, t.type); r !== a && (J(be, t), J(ae, a)); }
    function En(t) { be.current === t && (W(ae), W(be)), yt.current === t && (W(yt), Ea._currentValue = se); }
    var cn = Object.prototype.hasOwnProperty, ds = n.unstable_scheduleCallback, bt = n.unstable_cancelCallback, fl = n.unstable_shouldYield, Mc = n.unstable_requestPaint, Kt = n.unstable_now, Lr = n.unstable_getCurrentPriorityLevel, ps = n.unstable_ImmediatePriority, Mi = n.unstable_UserBlockingPriority, gs = n.unstable_NormalPriority, Qn = n.unstable_LowPriority, hl = n.unstable_IdlePriority, Oc = n.log, Rc = n.unstable_setDisableYieldValue, Oi = null, ut = null;
    function Yt(t) { if (typeof Oc == "function" && Rc(t), ut && typeof ut.setStrictMode == "function")
        try {
            ut.setStrictMode(Oi, t);
        }
        catch { } }
    var vt = Math.clz32 ? Math.clz32 : Ri, jc = Math.log, Lc = Math.LN2;
    function Ri(t) { return t >>>= 0, t === 0 ? 32 : 31 - (jc(t) / Lc | 0) | 0; }
    var Zn = 256, An = 4194304;
    function Nn(t) { var r = t & 42; if (r !== 0)
        return r; switch (t & -t) {
        case 1: return 1;
        case 2: return 2;
        case 4: return 4;
        case 8: return 8;
        case 16: return 16;
        case 32: return 32;
        case 64: return 64;
        case 128: return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152: return t & 4194048;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432: return t & 62914560;
        case 67108864: return 67108864;
        case 134217728: return 134217728;
        case 268435456: return 268435456;
        case 536870912: return 536870912;
        case 1073741824: return 0;
        default: return t;
    } }
    function ms(t, r, a) { var c = t.pendingLanes; if (c === 0)
        return 0; var h = 0, g = t.suspendedLanes, w = t.pingedLanes; t = t.warmLanes; var _ = c & 134217727; return _ !== 0 ? (c = _ & ~g, c !== 0 ? h = Nn(c) : (w &= _, w !== 0 ? h = Nn(w) : a || (a = _ & ~t, a !== 0 && (h = Nn(a))))) : (_ = c & ~g, _ !== 0 ? h = Nn(_) : w !== 0 ? h = Nn(w) : a || (a = c & ~t, a !== 0 && (h = Nn(a)))), h === 0 ? 0 : r !== 0 && r !== h && (r & g) === 0 && (g = h & -h, a = r & -r, g >= a || g === 32 && (a & 4194048) !== 0) ? r : h; }
    function ji(t, r) { return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & r) === 0; }
    function dl(t, r) { switch (t) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64: return r + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152: return r + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432: return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824: return -1;
        default: return -1;
    } }
    function ce() { var t = Zn; return Zn <<= 1, (Zn & 4194048) === 0 && (Zn = 256), t; }
    function Jn() { var t = An; return An <<= 1, (An & 62914560) === 0 && (An = 4194304), t; }
    function un(t) { for (var r = [], a = 0; 31 > a; a++)
        r.push(t); return r; }
    function Dr(t, r) { t.pendingLanes |= r, r !== 268435456 && (t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0); }
    function SS(t, r, a, c, h, g) { var w = t.pendingLanes; t.pendingLanes = a, t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0, t.expiredLanes &= a, t.entangledLanes &= a, t.errorRecoveryDisabledLanes &= a, t.shellSuspendCounter = 0; var _ = t.entanglements, A = t.expirationTimes, D = t.hiddenUpdates; for (a = w & ~a; 0 < a;) {
        var K = 31 - vt(a), X = 1 << K;
        _[K] = 0, A[K] = -1;
        var B = D[K];
        if (B !== null)
            for (D[K] = null, K = 0; K < B.length; K++) {
                var U = B[K];
                U !== null && (U.lane &= -536870913);
            }
        a &= ~X;
    } c !== 0 && Md(t, c, 0), g !== 0 && h === 0 && t.tag !== 0 && (t.suspendedLanes |= g & ~(w & ~r)); }
    function Md(t, r, a) { t.pendingLanes |= r, t.suspendedLanes &= ~r; var c = 31 - vt(r); t.entangledLanes |= r, t.entanglements[c] = t.entanglements[c] | 1073741824 | a & 4194090; }
    function Od(t, r) { var a = t.entangledLanes |= r; for (t = t.entanglements; a;) {
        var c = 31 - vt(a), h = 1 << c;
        h & r | t[c] & r && (t[c] |= r), a &= ~h;
    } }
    function Dc(t) { switch (t) {
        case 2:
            t = 1;
            break;
        case 8:
            t = 4;
            break;
        case 32:
            t = 16;
            break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
            t = 128;
            break;
        case 268435456:
            t = 134217728;
            break;
        default: t = 0;
    } return t; }
    function Bc(t) { return t &= -t, 2 < t ? 8 < t ? (t & 134217727) !== 0 ? 32 : 268435456 : 8 : 2; }
    function Rd() { var t = Q.p; return t !== 0 ? t : (t = window.event, t === void 0 ? 32 : fy(t.type)); }
    function wS(t, r) { var a = Q.p; try {
        return Q.p = t, r();
    }
    finally {
        Q.p = a;
    } }
    var Wn = Math.random().toString(36).slice(2), ft = "__reactFiber$" + Wn, Et = "__reactProps$" + Wn, ys = "__reactContainer$" + Wn, Uc = "__reactEvents$" + Wn, xS = "__reactListeners$" + Wn, _S = "__reactHandles$" + Wn, jd = "__reactResources$" + Wn, Br = "__reactMarker$" + Wn;
    function zc(t) { delete t[ft], delete t[Et], delete t[Uc], delete t[xS], delete t[_S]; }
    function bs(t) { var r = t[ft]; if (r)
        return r; for (var a = t.parentNode; a;) {
        if (r = a[ys] || a[ft]) {
            if (a = r.alternate, r.child !== null || a !== null && a.child !== null)
                for (t = Qm(t); t !== null;) {
                    if (a = t[ft])
                        return a;
                    t = Qm(t);
                }
            return r;
        }
        t = a, a = t.parentNode;
    } return null; }
    function vs(t) { if (t = t[ft] || t[ys]) {
        var r = t.tag;
        if (r === 5 || r === 6 || r === 13 || r === 26 || r === 27 || r === 3)
            return t;
    } return null; }
    function Ur(t) { var r = t.tag; if (r === 5 || r === 26 || r === 27 || r === 6)
        return t.stateNode; throw Error(s(33)); }
    function Ss(t) { var r = t[jd]; return r || (r = t[jd] = { hoistableStyles: new Map, hoistableScripts: new Map }), r; }
    function et(t) { t[Br] = !0; }
    var Ld = new Set, Dd = {};
    function Li(t, r) { ws(t, r), ws(t + "Capture", r); }
    function ws(t, r) { for (Dd[t] = r, t = 0; t < r.length; t++)
        Ld.add(r[t]); }
    var TS = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), Bd = {}, Ud = {};
    function ES(t) { return cn.call(Ud, t) ? !0 : cn.call(Bd, t) ? !1 : TS.test(t) ? Ud[t] = !0 : (Bd[t] = !0, !1); }
    function pl(t, r, a) { if (ES(r))
        if (a === null)
            t.removeAttribute(r);
        else {
            switch (typeof a) {
                case "undefined":
                case "function":
                case "symbol":
                    t.removeAttribute(r);
                    return;
                case "boolean":
                    var c = r.toLowerCase().slice(0, 5);
                    if (c !== "data-" && c !== "aria-") {
                        t.removeAttribute(r);
                        return;
                    }
            }
            t.setAttribute(r, "" + a);
        } }
    function gl(t, r, a) { if (a === null)
        t.removeAttribute(r);
    else {
        switch (typeof a) {
            case "undefined":
            case "function":
            case "symbol":
            case "boolean":
                t.removeAttribute(r);
                return;
        }
        t.setAttribute(r, "" + a);
    } }
    function Cn(t, r, a, c) { if (c === null)
        t.removeAttribute(a);
    else {
        switch (typeof c) {
            case "undefined":
            case "function":
            case "symbol":
            case "boolean":
                t.removeAttribute(a);
                return;
        }
        t.setAttributeNS(r, a, "" + c);
    } }
    var Hc, zd;
    function xs(t) {
        if (Hc === void 0)
            try {
                throw Error();
            }
            catch (a) {
                var r = a.stack.trim().match(/\n( *(at )?)/);
                Hc = r && r[1] || "", zd = -1 < a.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < a.stack.indexOf("@") ? "@unknown:0:0" : "";
            }
        return `
` + Hc + t + zd;
    }
    var qc = !1;
    function $c(t, r) {
        if (!t || qc)
            return "";
        qc = !0;
        var a = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        try {
            var c = { DetermineComponentFrameRoot: function () { try {
                    if (r) {
                        var X = function () { throw Error(); };
                        if (Object.defineProperty(X.prototype, "props", { set: function () { throw Error(); } }), typeof Reflect == "object" && Reflect.construct) {
                            try {
                                Reflect.construct(X, []);
                            }
                            catch (U) {
                                var B = U;
                            }
                            Reflect.construct(t, [], X);
                        }
                        else {
                            try {
                                X.call();
                            }
                            catch (U) {
                                B = U;
                            }
                            t.call(X.prototype);
                        }
                    }
                    else {
                        try {
                            throw Error();
                        }
                        catch (U) {
                            B = U;
                        }
                        (X = t()) && typeof X.catch == "function" && X.catch(function () { });
                    }
                }
                catch (U) {
                    if (U && B && typeof U.stack == "string")
                        return [U.stack, B.stack];
                } return [null, null]; } };
            c.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
            var h = Object.getOwnPropertyDescriptor(c.DetermineComponentFrameRoot, "name");
            h && h.configurable && Object.defineProperty(c.DetermineComponentFrameRoot, "name", { value: "DetermineComponentFrameRoot" });
            var g = c.DetermineComponentFrameRoot(), w = g[0], _ = g[1];
            if (w && _) {
                var A = w.split(`
`), D = _.split(`
`);
                for (h = c = 0; c < A.length && !A[c].includes("DetermineComponentFrameRoot");)
                    c++;
                for (; h < D.length && !D[h].includes("DetermineComponentFrameRoot");)
                    h++;
                if (c === A.length || h === D.length)
                    for (c = A.length - 1, h = D.length - 1; 1 <= c && 0 <= h && A[c] !== D[h];)
                        h--;
                for (; 1 <= c && 0 <= h; c--, h--)
                    if (A[c] !== D[h]) {
                        if (c !== 1 || h !== 1)
                            do
                                if (c--, h--, 0 > h || A[c] !== D[h]) {
                                    var K = `
` + A[c].replace(" at new ", " at ");
                                    return t.displayName && K.includes("<anonymous>") && (K = K.replace("<anonymous>", t.displayName)), K;
                                }
                            while (1 <= c && 0 <= h);
                        break;
                    }
            }
        }
        finally {
            qc = !1, Error.prepareStackTrace = a;
        }
        return (a = t ? t.displayName || t.name : "") ? xs(a) : "";
    }
    function AS(t) { switch (t.tag) {
        case 26:
        case 27:
        case 5: return xs(t.type);
        case 16: return xs("Lazy");
        case 13: return xs("Suspense");
        case 19: return xs("SuspenseList");
        case 0:
        case 15: return $c(t.type, !1);
        case 11: return $c(t.type.render, !1);
        case 1: return $c(t.type, !0);
        case 31: return xs("Activity");
        default: return "";
    } }
    function Hd(t) {
        try {
            var r = "";
            do
                r += AS(t), t = t.return;
            while (t);
            return r;
        }
        catch (a) {
            return `
Error generating stack: ` + a.message + `
` + a.stack;
        }
    }
    function Xt(t) { switch (typeof t) {
        case "bigint":
        case "boolean":
        case "number":
        case "string":
        case "undefined": return t;
        case "object": return t;
        default: return "";
    } }
    function qd(t) { var r = t.type; return (t = t.nodeName) && t.toLowerCase() === "input" && (r === "checkbox" || r === "radio"); }
    function NS(t) { var r = qd(t) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(t.constructor.prototype, r), c = "" + t[r]; if (!t.hasOwnProperty(r) && typeof a < "u" && typeof a.get == "function" && typeof a.set == "function") {
        var h = a.get, g = a.set;
        return Object.defineProperty(t, r, { configurable: !0, get: function () { return h.call(this); }, set: function (w) { c = "" + w, g.call(this, w); } }), Object.defineProperty(t, r, { enumerable: a.enumerable }), { getValue: function () { return c; }, setValue: function (w) { c = "" + w; }, stopTracking: function () { t._valueTracker = null, delete t[r]; } };
    } }
    function ml(t) { t._valueTracker || (t._valueTracker = NS(t)); }
    function $d(t) { if (!t)
        return !1; var r = t._valueTracker; if (!r)
        return !0; var a = r.getValue(), c = ""; return t && (c = qd(t) ? t.checked ? "true" : "false" : t.value), t = c, t !== a ? (r.setValue(t), !0) : !1; }
    function yl(t) { if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u")
        return null; try {
        return t.activeElement || t.body;
    }
    catch {
        return t.body;
    } }
    var CS = /[\n"\\]/g;
    function Pt(t) { return t.replace(CS, function (r) { return "\\" + r.charCodeAt(0).toString(16) + " "; }); }
    function Ic(t, r, a, c, h, g, w, _) { t.name = "", w != null && typeof w != "function" && typeof w != "symbol" && typeof w != "boolean" ? t.type = w : t.removeAttribute("type"), r != null ? w === "number" ? (r === 0 && t.value === "" || t.value != r) && (t.value = "" + Xt(r)) : t.value !== "" + Xt(r) && (t.value = "" + Xt(r)) : w !== "submit" && w !== "reset" || t.removeAttribute("value"), r != null ? Vc(t, w, Xt(r)) : a != null ? Vc(t, w, Xt(a)) : c != null && t.removeAttribute("value"), h == null && g != null && (t.defaultChecked = !!g), h != null && (t.checked = h && typeof h != "function" && typeof h != "symbol"), _ != null && typeof _ != "function" && typeof _ != "symbol" && typeof _ != "boolean" ? t.name = "" + Xt(_) : t.removeAttribute("name"); }
    function Id(t, r, a, c, h, g, w, _) { if (g != null && typeof g != "function" && typeof g != "symbol" && typeof g != "boolean" && (t.type = g), r != null || a != null) {
        if (!(g !== "submit" && g !== "reset" || r != null))
            return;
        a = a != null ? "" + Xt(a) : "", r = r != null ? "" + Xt(r) : a, _ || r === t.value || (t.value = r), t.defaultValue = r;
    } c = c ?? h, c = typeof c != "function" && typeof c != "symbol" && !!c, t.checked = _ ? t.checked : !!c, t.defaultChecked = !!c, w != null && typeof w != "function" && typeof w != "symbol" && typeof w != "boolean" && (t.name = w); }
    function Vc(t, r, a) { r === "number" && yl(t.ownerDocument) === t || t.defaultValue === "" + a || (t.defaultValue = "" + a); }
    function _s(t, r, a, c) { if (t = t.options, r) {
        r = {};
        for (var h = 0; h < a.length; h++)
            r["$" + a[h]] = !0;
        for (a = 0; a < t.length; a++)
            h = r.hasOwnProperty("$" + t[a].value), t[a].selected !== h && (t[a].selected = h), h && c && (t[a].defaultSelected = !0);
    }
    else {
        for (a = "" + Xt(a), r = null, h = 0; h < t.length; h++) {
            if (t[h].value === a) {
                t[h].selected = !0, c && (t[h].defaultSelected = !0);
                return;
            }
            r !== null || t[h].disabled || (r = t[h]);
        }
        r !== null && (r.selected = !0);
    } }
    function Vd(t, r, a) { if (r != null && (r = "" + Xt(r), r !== t.value && (t.value = r), a == null)) {
        t.defaultValue !== r && (t.defaultValue = r);
        return;
    } t.defaultValue = a != null ? "" + Xt(a) : ""; }
    function Gd(t, r, a, c) { if (r == null) {
        if (c != null) {
            if (a != null)
                throw Error(s(92));
            if (ve(c)) {
                if (1 < c.length)
                    throw Error(s(93));
                c = c[0];
            }
            a = c;
        }
        a == null && (a = ""), r = a;
    } a = Xt(r), t.defaultValue = a, c = t.textContent, c === a && c !== "" && c !== null && (t.value = c); }
    function Ts(t, r) { if (r) {
        var a = t.firstChild;
        if (a && a === t.lastChild && a.nodeType === 3) {
            a.nodeValue = r;
            return;
        }
    } t.textContent = r; }
    var kS = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
    function Kd(t, r, a) { var c = r.indexOf("--") === 0; a == null || typeof a == "boolean" || a === "" ? c ? t.setProperty(r, "") : r === "float" ? t.cssFloat = "" : t[r] = "" : c ? t.setProperty(r, a) : typeof a != "number" || a === 0 || kS.has(r) ? r === "float" ? t.cssFloat = a : t[r] = ("" + a).trim() : t[r] = a + "px"; }
    function Yd(t, r, a) { if (r != null && typeof r != "object")
        throw Error(s(62)); if (t = t.style, a != null) {
        for (var c in a)
            !a.hasOwnProperty(c) || r != null && r.hasOwnProperty(c) || (c.indexOf("--") === 0 ? t.setProperty(c, "") : c === "float" ? t.cssFloat = "" : t[c] = "");
        for (var h in r)
            c = r[h], r.hasOwnProperty(h) && a[h] !== c && Kd(t, h, c);
    }
    else
        for (var g in r)
            r.hasOwnProperty(g) && Kd(t, g, r[g]); }
    function Gc(t) { if (t.indexOf("-") === -1)
        return !1; switch (t) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph": return !1;
        default: return !0;
    } }
    var MS = new Map([["acceptCharset", "accept-charset"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"], ["crossOrigin", "crossorigin"], ["accentHeight", "accent-height"], ["alignmentBaseline", "alignment-baseline"], ["arabicForm", "arabic-form"], ["baselineShift", "baseline-shift"], ["capHeight", "cap-height"], ["clipPath", "clip-path"], ["clipRule", "clip-rule"], ["colorInterpolation", "color-interpolation"], ["colorInterpolationFilters", "color-interpolation-filters"], ["colorProfile", "color-profile"], ["colorRendering", "color-rendering"], ["dominantBaseline", "dominant-baseline"], ["enableBackground", "enable-background"], ["fillOpacity", "fill-opacity"], ["fillRule", "fill-rule"], ["floodColor", "flood-color"], ["floodOpacity", "flood-opacity"], ["fontFamily", "font-family"], ["fontSize", "font-size"], ["fontSizeAdjust", "font-size-adjust"], ["fontStretch", "font-stretch"], ["fontStyle", "font-style"], ["fontVariant", "font-variant"], ["fontWeight", "font-weight"], ["glyphName", "glyph-name"], ["glyphOrientationHorizontal", "glyph-orientation-horizontal"], ["glyphOrientationVertical", "glyph-orientation-vertical"], ["horizAdvX", "horiz-adv-x"], ["horizOriginX", "horiz-origin-x"], ["imageRendering", "image-rendering"], ["letterSpacing", "letter-spacing"], ["lightingColor", "lighting-color"], ["markerEnd", "marker-end"], ["markerMid", "marker-mid"], ["markerStart", "marker-start"], ["overlinePosition", "overline-position"], ["overlineThickness", "overline-thickness"], ["paintOrder", "paint-order"], ["panose-1", "panose-1"], ["pointerEvents", "pointer-events"], ["renderingIntent", "rendering-intent"], ["shapeRendering", "shape-rendering"], ["stopColor", "stop-color"], ["stopOpacity", "stop-opacity"], ["strikethroughPosition", "strikethrough-position"], ["strikethroughThickness", "strikethrough-thickness"], ["strokeDasharray", "stroke-dasharray"], ["strokeDashoffset", "stroke-dashoffset"], ["strokeLinecap", "stroke-linecap"], ["strokeLinejoin", "stroke-linejoin"], ["strokeMiterlimit", "stroke-miterlimit"], ["strokeOpacity", "stroke-opacity"], ["strokeWidth", "stroke-width"], ["textAnchor", "text-anchor"], ["textDecoration", "text-decoration"], ["textRendering", "text-rendering"], ["transformOrigin", "transform-origin"], ["underlinePosition", "underline-position"], ["underlineThickness", "underline-thickness"], ["unicodeBidi", "unicode-bidi"], ["unicodeRange", "unicode-range"], ["unitsPerEm", "units-per-em"], ["vAlphabetic", "v-alphabetic"], ["vHanging", "v-hanging"], ["vIdeographic", "v-ideographic"], ["vMathematical", "v-mathematical"], ["vectorEffect", "vector-effect"], ["vertAdvY", "vert-adv-y"], ["vertOriginX", "vert-origin-x"], ["vertOriginY", "vert-origin-y"], ["wordSpacing", "word-spacing"], ["writingMode", "writing-mode"], ["xmlnsXlink", "xmlns:xlink"], ["xHeight", "x-height"]]), OS = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
    function bl(t) { return OS.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t; }
    var Kc = null;
    function Yc(t) { return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t; }
    var Es = null, As = null;
    function Xd(t) { var r = vs(t); if (r && (t = r.stateNode)) {
        var a = t[Et] || null;
        e: switch (t = r.stateNode, r.type) {
            case "input":
                if (Ic(t, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name), r = a.name, a.type === "radio" && r != null) {
                    for (a = t; a.parentNode;)
                        a = a.parentNode;
                    for (a = a.querySelectorAll('input[name="' + Pt("" + r) + '"][type="radio"]'), r = 0; r < a.length; r++) {
                        var c = a[r];
                        if (c !== t && c.form === t.form) {
                            var h = c[Et] || null;
                            if (!h)
                                throw Error(s(90));
                            Ic(c, h.value, h.defaultValue, h.defaultValue, h.checked, h.defaultChecked, h.type, h.name);
                        }
                    }
                    for (r = 0; r < a.length; r++)
                        c = a[r], c.form === t.form && $d(c);
                }
                break e;
            case "textarea":
                Vd(t, a.value, a.defaultValue);
                break e;
            case "select": r = a.value, r != null && _s(t, !!a.multiple, r, !1);
        }
    } }
    var Xc = !1;
    function Pd(t, r, a) { if (Xc)
        return t(r, a); Xc = !0; try {
        var c = t(r);
        return c;
    }
    finally {
        if (Xc = !1, (Es !== null || As !== null) && (io(), Es && (r = Es, t = As, As = Es = null, Xd(r), t)))
            for (r = 0; r < t.length; r++)
                Xd(t[r]);
    } }
    function zr(t, r) { var a = t.stateNode; if (a === null)
        return null; var c = a[Et] || null; if (c === null)
        return null; a = c[r]; e: switch (r) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
            (c = !c.disabled) || (t = t.type, c = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !c;
            break e;
        default: t = !1;
    } if (t)
        return null; if (a && typeof a != "function")
        throw Error(s(231, r, typeof a)); return a; }
    var kn = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Pc = !1;
    if (kn)
        try {
            var Hr = {};
            Object.defineProperty(Hr, "passive", { get: function () { Pc = !0; } }), window.addEventListener("test", Hr, Hr), window.removeEventListener("test", Hr, Hr);
        }
        catch {
            Pc = !1;
        }
    var ei = null, Fc = null, vl = null;
    function Fd() { if (vl)
        return vl; var t, r = Fc, a = r.length, c, h = "value" in ei ? ei.value : ei.textContent, g = h.length; for (t = 0; t < a && r[t] === h[t]; t++)
        ; var w = a - t; for (c = 1; c <= w && r[a - c] === h[g - c]; c++)
        ; return vl = h.slice(t, 1 < c ? 1 - c : void 0); }
    function Sl(t) { var r = t.keyCode; return "charCode" in t ? (t = t.charCode, t === 0 && r === 13 && (t = 13)) : t = r, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0; }
    function wl() { return !0; }
    function Qd() { return !1; }
    function At(t) { function r(a, c, h, g, w) { this._reactName = a, this._targetInst = h, this.type = c, this.nativeEvent = g, this.target = w, this.currentTarget = null; for (var _ in t)
        t.hasOwnProperty(_) && (a = t[_], this[_] = a ? a(g) : g[_]); return this.isDefaultPrevented = (g.defaultPrevented != null ? g.defaultPrevented : g.returnValue === !1) ? wl : Qd, this.isPropagationStopped = Qd, this; } return m(r.prototype, { preventDefault: function () { this.defaultPrevented = !0; var a = this.nativeEvent; a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = wl); }, stopPropagation: function () { var a = this.nativeEvent; a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = wl); }, persist: function () { }, isPersistent: wl }), r; }
    var Di = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function (t) { return t.timeStamp || Date.now(); }, defaultPrevented: 0, isTrusted: 0 }, xl = At(Di), qr = m({}, Di, { view: 0, detail: 0 }), RS = At(qr), Qc, Zc, $r, _l = m({}, qr, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: Wc, button: 0, buttons: 0, relatedTarget: function (t) { return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget; }, movementX: function (t) { return "movementX" in t ? t.movementX : (t !== $r && ($r && t.type === "mousemove" ? (Qc = t.screenX - $r.screenX, Zc = t.screenY - $r.screenY) : Zc = Qc = 0, $r = t), Qc); }, movementY: function (t) { return "movementY" in t ? t.movementY : Zc; } }), Zd = At(_l), jS = m({}, _l, { dataTransfer: 0 }), LS = At(jS), DS = m({}, qr, { relatedTarget: 0 }), Jc = At(DS), BS = m({}, Di, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), US = At(BS), zS = m({}, Di, { clipboardData: function (t) { return "clipboardData" in t ? t.clipboardData : window.clipboardData; } }), HS = At(zS), qS = m({}, Di, { data: 0 }), Jd = At(qS), $S = { Esc: "Escape", Spacebar: " ", Left: "ArrowLeft", Up: "ArrowUp", Right: "ArrowRight", Down: "ArrowDown", Del: "Delete", Win: "OS", Menu: "ContextMenu", Apps: "ContextMenu", Scroll: "ScrollLock", MozPrintableKey: "Unidentified" }, IS = { 8: "Backspace", 9: "Tab", 12: "Clear", 13: "Enter", 16: "Shift", 17: "Control", 18: "Alt", 19: "Pause", 20: "CapsLock", 27: "Escape", 32: " ", 33: "PageUp", 34: "PageDown", 35: "End", 36: "Home", 37: "ArrowLeft", 38: "ArrowUp", 39: "ArrowRight", 40: "ArrowDown", 45: "Insert", 46: "Delete", 112: "F1", 113: "F2", 114: "F3", 115: "F4", 116: "F5", 117: "F6", 118: "F7", 119: "F8", 120: "F9", 121: "F10", 122: "F11", 123: "F12", 144: "NumLock", 145: "ScrollLock", 224: "Meta" }, VS = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
    function GS(t) { var r = this.nativeEvent; return r.getModifierState ? r.getModifierState(t) : (t = VS[t]) ? !!r[t] : !1; }
    function Wc() { return GS; }
    var KS = m({}, qr, { key: function (t) { if (t.key) {
            var r = $S[t.key] || t.key;
            if (r !== "Unidentified")
                return r;
        } return t.type === "keypress" ? (t = Sl(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? IS[t.keyCode] || "Unidentified" : ""; }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: Wc, charCode: function (t) { return t.type === "keypress" ? Sl(t) : 0; }, keyCode: function (t) { return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0; }, which: function (t) { return t.type === "keypress" ? Sl(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0; } }), YS = At(KS), XS = m({}, _l, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Wd = At(XS), PS = m({}, qr, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: Wc }), FS = At(PS), QS = m({}, Di, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), ZS = At(QS), JS = m({}, _l, { deltaX: function (t) { return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0; }, deltaY: function (t) { return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0; }, deltaZ: 0, deltaMode: 0 }), WS = At(JS), ew = m({}, Di, { newState: 0, oldState: 0 }), tw = At(ew), nw = [9, 13, 27, 32], eu = kn && "CompositionEvent" in window, Ir = null;
    kn && "documentMode" in document && (Ir = document.documentMode);
    var iw = kn && "TextEvent" in window && !Ir, ep = kn && (!eu || Ir && 8 < Ir && 11 >= Ir), tp = " ", np = !1;
    function ip(t, r) { switch (t) {
        case "keyup": return nw.indexOf(r.keyCode) !== -1;
        case "keydown": return r.keyCode !== 229;
        case "keypress":
        case "mousedown":
        case "focusout": return !0;
        default: return !1;
    } }
    function sp(t) { return t = t.detail, typeof t == "object" && "data" in t ? t.data : null; }
    var Ns = !1;
    function sw(t, r) { switch (t) {
        case "compositionend": return sp(r);
        case "keypress": return r.which !== 32 ? null : (np = !0, tp);
        case "textInput": return t = r.data, t === tp && np ? null : t;
        default: return null;
    } }
    function rw(t, r) { if (Ns)
        return t === "compositionend" || !eu && ip(t, r) ? (t = Fd(), vl = Fc = ei = null, Ns = !1, t) : null; switch (t) {
        case "paste": return null;
        case "keypress":
            if (!(r.ctrlKey || r.altKey || r.metaKey) || r.ctrlKey && r.altKey) {
                if (r.char && 1 < r.char.length)
                    return r.char;
                if (r.which)
                    return String.fromCharCode(r.which);
            }
            return null;
        case "compositionend": return ep && r.locale !== "ko" ? null : r.data;
        default: return null;
    } }
    var aw = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
    function rp(t) { var r = t && t.nodeName && t.nodeName.toLowerCase(); return r === "input" ? !!aw[t.type] : r === "textarea"; }
    function ap(t, r, a, c) { Es ? As ? As.push(c) : As = [c] : Es = c, r = co(r, "onChange"), 0 < r.length && (a = new xl("onChange", "change", null, a, c), t.push({ event: a, listeners: r })); }
    var Vr = null, Gr = null;
    function lw(t) { qm(t, 0); }
    function Tl(t) { var r = Ur(t); if ($d(r))
        return t; }
    function lp(t, r) { if (t === "change")
        return r; }
    var op = !1;
    if (kn) {
        var tu;
        if (kn) {
            var nu = "oninput" in document;
            if (!nu) {
                var cp = document.createElement("div");
                cp.setAttribute("oninput", "return;"), nu = typeof cp.oninput == "function";
            }
            tu = nu;
        }
        else
            tu = !1;
        op = tu && (!document.documentMode || 9 < document.documentMode);
    }
    function up() { Vr && (Vr.detachEvent("onpropertychange", fp), Gr = Vr = null); }
    function fp(t) { if (t.propertyName === "value" && Tl(Gr)) {
        var r = [];
        ap(r, Gr, t, Yc(t)), Pd(lw, r);
    } }
    function ow(t, r, a) { t === "focusin" ? (up(), Vr = r, Gr = a, Vr.attachEvent("onpropertychange", fp)) : t === "focusout" && up(); }
    function cw(t) { if (t === "selectionchange" || t === "keyup" || t === "keydown")
        return Tl(Gr); }
    function uw(t, r) { if (t === "click")
        return Tl(r); }
    function fw(t, r) { if (t === "input" || t === "change")
        return Tl(r); }
    function hw(t, r) { return t === r && (t !== 0 || 1 / t === 1 / r) || t !== t && r !== r; }
    var Bt = typeof Object.is == "function" ? Object.is : hw;
    function Kr(t, r) { if (Bt(t, r))
        return !0; if (typeof t != "object" || t === null || typeof r != "object" || r === null)
        return !1; var a = Object.keys(t), c = Object.keys(r); if (a.length !== c.length)
        return !1; for (c = 0; c < a.length; c++) {
        var h = a[c];
        if (!cn.call(r, h) || !Bt(t[h], r[h]))
            return !1;
    } return !0; }
    function hp(t) { for (; t && t.firstChild;)
        t = t.firstChild; return t; }
    function dp(t, r) { var a = hp(t); t = 0; for (var c; a;) {
        if (a.nodeType === 3) {
            if (c = t + a.textContent.length, t <= r && c >= r)
                return { node: a, offset: r - t };
            t = c;
        }
        e: {
            for (; a;) {
                if (a.nextSibling) {
                    a = a.nextSibling;
                    break e;
                }
                a = a.parentNode;
            }
            a = void 0;
        }
        a = hp(a);
    } }
    function pp(t, r) { return t && r ? t === r ? !0 : t && t.nodeType === 3 ? !1 : r && r.nodeType === 3 ? pp(t, r.parentNode) : "contains" in t ? t.contains(r) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(r) & 16) : !1 : !1; }
    function gp(t) { t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window; for (var r = yl(t.document); r instanceof t.HTMLIFrameElement;) {
        try {
            var a = typeof r.contentWindow.location.href == "string";
        }
        catch {
            a = !1;
        }
        if (a)
            t = r.contentWindow;
        else
            break;
        r = yl(t.document);
    } return r; }
    function iu(t) { var r = t && t.nodeName && t.nodeName.toLowerCase(); return r && (r === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || r === "textarea" || t.contentEditable === "true"); }
    var dw = kn && "documentMode" in document && 11 >= document.documentMode, Cs = null, su = null, Yr = null, ru = !1;
    function mp(t, r, a) { var c = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument; ru || Cs == null || Cs !== yl(c) || (c = Cs, "selectionStart" in c && iu(c) ? c = { start: c.selectionStart, end: c.selectionEnd } : (c = (c.ownerDocument && c.ownerDocument.defaultView || window).getSelection(), c = { anchorNode: c.anchorNode, anchorOffset: c.anchorOffset, focusNode: c.focusNode, focusOffset: c.focusOffset }), Yr && Kr(Yr, c) || (Yr = c, c = co(su, "onSelect"), 0 < c.length && (r = new xl("onSelect", "select", null, r, a), t.push({ event: r, listeners: c }), r.target = Cs))); }
    function Bi(t, r) { var a = {}; return a[t.toLowerCase()] = r.toLowerCase(), a["Webkit" + t] = "webkit" + r, a["Moz" + t] = "moz" + r, a; }
    var ks = { animationend: Bi("Animation", "AnimationEnd"), animationiteration: Bi("Animation", "AnimationIteration"), animationstart: Bi("Animation", "AnimationStart"), transitionrun: Bi("Transition", "TransitionRun"), transitionstart: Bi("Transition", "TransitionStart"), transitioncancel: Bi("Transition", "TransitionCancel"), transitionend: Bi("Transition", "TransitionEnd") }, au = {}, yp = {};
    kn && (yp = document.createElement("div").style, "AnimationEvent" in window || (delete ks.animationend.animation, delete ks.animationiteration.animation, delete ks.animationstart.animation), "TransitionEvent" in window || delete ks.transitionend.transition);
    function Ui(t) { if (au[t])
        return au[t]; if (!ks[t])
        return t; var r = ks[t], a; for (a in r)
        if (r.hasOwnProperty(a) && a in yp)
            return au[t] = r[a]; return t; }
    var bp = Ui("animationend"), vp = Ui("animationiteration"), Sp = Ui("animationstart"), pw = Ui("transitionrun"), gw = Ui("transitionstart"), mw = Ui("transitioncancel"), wp = Ui("transitionend"), xp = new Map, lu = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
    lu.push("scrollEnd");
    function fn(t, r) { xp.set(t, r), Li(r, [t]); }
    var _p = new WeakMap;
    function Ft(t, r) { if (typeof t == "object" && t !== null) {
        var a = _p.get(t);
        return a !== void 0 ? a : (r = { value: t, source: r, stack: Hd(r) }, _p.set(t, r), r);
    } return { value: t, source: r, stack: Hd(r) }; }
    var Qt = [], Ms = 0, ou = 0;
    function El() { for (var t = Ms, r = ou = Ms = 0; r < t;) {
        var a = Qt[r];
        Qt[r++] = null;
        var c = Qt[r];
        Qt[r++] = null;
        var h = Qt[r];
        Qt[r++] = null;
        var g = Qt[r];
        if (Qt[r++] = null, c !== null && h !== null) {
            var w = c.pending;
            w === null ? h.next = h : (h.next = w.next, w.next = h), c.pending = h;
        }
        g !== 0 && Tp(a, h, g);
    } }
    function Al(t, r, a, c) { Qt[Ms++] = t, Qt[Ms++] = r, Qt[Ms++] = a, Qt[Ms++] = c, ou |= c, t.lanes |= c, t = t.alternate, t !== null && (t.lanes |= c); }
    function cu(t, r, a, c) { return Al(t, r, a, c), Nl(t); }
    function Os(t, r) { return Al(t, null, null, r), Nl(t); }
    function Tp(t, r, a) { t.lanes |= a; var c = t.alternate; c !== null && (c.lanes |= a); for (var h = !1, g = t.return; g !== null;)
        g.childLanes |= a, c = g.alternate, c !== null && (c.childLanes |= a), g.tag === 22 && (t = g.stateNode, t === null || t._visibility & 1 || (h = !0)), t = g, g = g.return; return t.tag === 3 ? (g = t.stateNode, h && r !== null && (h = 31 - vt(a), t = g.hiddenUpdates, c = t[h], c === null ? t[h] = [r] : c.push(r), r.lane = a | 536870912), g) : null; }
    function Nl(t) { if (50 < ya)
        throw ya = 0, mf = null, Error(s(185)); for (var r = t.return; r !== null;)
        t = r, r = t.return; return t.tag === 3 ? t.stateNode : null; }
    var Rs = {};
    function yw(t, r, a, c) { this.tag = t, this.key = a, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = c, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null; }
    function Ut(t, r, a, c) { return new yw(t, r, a, c); }
    function uu(t) { return t = t.prototype, !(!t || !t.isReactComponent); }
    function Mn(t, r) { var a = t.alternate; return a === null ? (a = Ut(t.tag, r, t.key, t.mode), a.elementType = t.elementType, a.type = t.type, a.stateNode = t.stateNode, a.alternate = t, t.alternate = a) : (a.pendingProps = r, a.type = t.type, a.flags = 0, a.subtreeFlags = 0, a.deletions = null), a.flags = t.flags & 65011712, a.childLanes = t.childLanes, a.lanes = t.lanes, a.child = t.child, a.memoizedProps = t.memoizedProps, a.memoizedState = t.memoizedState, a.updateQueue = t.updateQueue, r = t.dependencies, a.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, a.sibling = t.sibling, a.index = t.index, a.ref = t.ref, a.refCleanup = t.refCleanup, a; }
    function Ep(t, r) { t.flags &= 65011714; var a = t.alternate; return a === null ? (t.childLanes = 0, t.lanes = r, t.child = null, t.subtreeFlags = 0, t.memoizedProps = null, t.memoizedState = null, t.updateQueue = null, t.dependencies = null, t.stateNode = null) : (t.childLanes = a.childLanes, t.lanes = a.lanes, t.child = a.child, t.subtreeFlags = 0, t.deletions = null, t.memoizedProps = a.memoizedProps, t.memoizedState = a.memoizedState, t.updateQueue = a.updateQueue, t.type = a.type, r = a.dependencies, t.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }), t; }
    function Cl(t, r, a, c, h, g) { var w = 0; if (c = t, typeof t == "function")
        uu(t) && (w = 1);
    else if (typeof t == "string")
        w = v1(t, a, ae.current) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
    else
        e: switch (t) {
            case j: return t = Ut(31, a, r, h), t.elementType = j, t.lanes = g, t;
            case E: return zi(a.children, h, g, r);
            case x:
                w = 8, h |= 24;
                break;
            case T: return t = Ut(12, a, r, h | 2), t.elementType = T, t.lanes = g, t;
            case R: return t = Ut(13, a, r, h), t.elementType = R, t.lanes = g, t;
            case G: return t = Ut(19, a, r, h), t.elementType = G, t.lanes = g, t;
            default:
                if (typeof t == "object" && t !== null)
                    switch (t.$$typeof) {
                        case C:
                        case $:
                            w = 10;
                            break e;
                        case k:
                            w = 9;
                            break e;
                        case V:
                            w = 11;
                            break e;
                        case Z:
                            w = 14;
                            break e;
                        case q:
                            w = 16, c = null;
                            break e;
                    }
                w = 29, a = Error(s(130, t === null ? "null" : typeof t, "")), c = null;
        } return r = Ut(w, a, r, h), r.elementType = t, r.type = c, r.lanes = g, r; }
    function zi(t, r, a, c) { return t = Ut(7, t, c, r), t.lanes = a, t; }
    function fu(t, r, a) { return t = Ut(6, t, null, r), t.lanes = a, t; }
    function hu(t, r, a) { return r = Ut(4, t.children !== null ? t.children : [], t.key, r), r.lanes = a, r.stateNode = { containerInfo: t.containerInfo, pendingChildren: null, implementation: t.implementation }, r; }
    var js = [], Ls = 0, kl = null, Ml = 0, Zt = [], Jt = 0, Hi = null, On = 1, Rn = "";
    function qi(t, r) { js[Ls++] = Ml, js[Ls++] = kl, kl = t, Ml = r; }
    function Ap(t, r, a) { Zt[Jt++] = On, Zt[Jt++] = Rn, Zt[Jt++] = Hi, Hi = t; var c = On; t = Rn; var h = 32 - vt(c) - 1; c &= ~(1 << h), a += 1; var g = 32 - vt(r) + h; if (30 < g) {
        var w = h - h % 5;
        g = (c & (1 << w) - 1).toString(32), c >>= w, h -= w, On = 1 << 32 - vt(r) + h | a << h | c, Rn = g + t;
    }
    else
        On = 1 << g | a << h | c, Rn = t; }
    function du(t) { t.return !== null && (qi(t, 1), Ap(t, 1, 0)); }
    function pu(t) { for (; t === kl;)
        kl = js[--Ls], js[Ls] = null, Ml = js[--Ls], js[Ls] = null; for (; t === Hi;)
        Hi = Zt[--Jt], Zt[Jt] = null, Rn = Zt[--Jt], Zt[Jt] = null, On = Zt[--Jt], Zt[Jt] = null; }
    var St = null, $e = null, _e = !1, $i = null, yn = !1, gu = Error(s(519));
    function Ii(t) { var r = Error(s(418, "")); throw Fr(Ft(r, t)), gu; }
    function Np(t) { var r = t.stateNode, a = t.type, c = t.memoizedProps; switch (r[ft] = t, r[Et] = c, a) {
        case "dialog":
            ye("cancel", r), ye("close", r);
            break;
        case "iframe":
        case "object":
        case "embed":
            ye("load", r);
            break;
        case "video":
        case "audio":
            for (a = 0; a < va.length; a++)
                ye(va[a], r);
            break;
        case "source":
            ye("error", r);
            break;
        case "img":
        case "image":
        case "link":
            ye("error", r), ye("load", r);
            break;
        case "details":
            ye("toggle", r);
            break;
        case "input":
            ye("invalid", r), Id(r, c.value, c.defaultValue, c.checked, c.defaultChecked, c.type, c.name, !0), ml(r);
            break;
        case "select":
            ye("invalid", r);
            break;
        case "textarea": ye("invalid", r), Gd(r, c.value, c.defaultValue, c.children), ml(r);
    } a = c.children, typeof a != "string" && typeof a != "number" && typeof a != "bigint" || r.textContent === "" + a || c.suppressHydrationWarning === !0 || Gm(r.textContent, a) ? (c.popover != null && (ye("beforetoggle", r), ye("toggle", r)), c.onScroll != null && ye("scroll", r), c.onScrollEnd != null && ye("scrollend", r), c.onClick != null && (r.onclick = uo), r = !0) : r = !1, r || Ii(t); }
    function Cp(t) { for (St = t.return; St;)
        switch (St.tag) {
            case 5:
            case 13:
                yn = !1;
                return;
            case 27:
            case 3:
                yn = !0;
                return;
            default: St = St.return;
        } }
    function Xr(t) { if (t !== St)
        return !1; if (!_e)
        return Cp(t), _e = !0, !1; var r = t.tag, a; if ((a = r !== 3 && r !== 27) && ((a = r === 5) && (a = t.type, a = !(a !== "form" && a !== "button") || Rf(t.type, t.memoizedProps)), a = !a), a && $e && Ii(t), Cp(t), r === 13) {
        if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t)
            throw Error(s(317));
        e: {
            for (t = t.nextSibling, r = 0; t;) {
                if (t.nodeType === 8)
                    if (a = t.data, a === "/$") {
                        if (r === 0) {
                            $e = dn(t.nextSibling);
                            break e;
                        }
                        r--;
                    }
                    else
                        a !== "$" && a !== "$!" && a !== "$?" || r++;
                t = t.nextSibling;
            }
            $e = null;
        }
    }
    else
        r === 27 ? (r = $e, mi(t.type) ? (t = Bf, Bf = null, $e = t) : $e = r) : $e = St ? dn(t.stateNode.nextSibling) : null; return !0; }
    function Pr() { $e = St = null, _e = !1; }
    function kp() { var t = $i; return t !== null && (kt === null ? kt = t : kt.push.apply(kt, t), $i = null), t; }
    function Fr(t) { $i === null ? $i = [t] : $i.push(t); }
    var mu = P(null), Vi = null, jn = null;
    function ti(t, r, a) { J(mu, r._currentValue), r._currentValue = a; }
    function Ln(t) { t._currentValue = mu.current, W(mu); }
    function yu(t, r, a) { for (; t !== null;) {
        var c = t.alternate;
        if ((t.childLanes & r) !== r ? (t.childLanes |= r, c !== null && (c.childLanes |= r)) : c !== null && (c.childLanes & r) !== r && (c.childLanes |= r), t === a)
            break;
        t = t.return;
    } }
    function bu(t, r, a, c) { var h = t.child; for (h !== null && (h.return = t); h !== null;) {
        var g = h.dependencies;
        if (g !== null) {
            var w = h.child;
            g = g.firstContext;
            e: for (; g !== null;) {
                var _ = g;
                g = h;
                for (var A = 0; A < r.length; A++)
                    if (_.context === r[A]) {
                        g.lanes |= a, _ = g.alternate, _ !== null && (_.lanes |= a), yu(g.return, a, t), c || (w = null);
                        break e;
                    }
                g = _.next;
            }
        }
        else if (h.tag === 18) {
            if (w = h.return, w === null)
                throw Error(s(341));
            w.lanes |= a, g = w.alternate, g !== null && (g.lanes |= a), yu(w, a, t), w = null;
        }
        else
            w = h.child;
        if (w !== null)
            w.return = h;
        else
            for (w = h; w !== null;) {
                if (w === t) {
                    w = null;
                    break;
                }
                if (h = w.sibling, h !== null) {
                    h.return = w.return, w = h;
                    break;
                }
                w = w.return;
            }
        h = w;
    } }
    function Qr(t, r, a, c) { t = null; for (var h = r, g = !1; h !== null;) {
        if (!g) {
            if ((h.flags & 524288) !== 0)
                g = !0;
            else if ((h.flags & 262144) !== 0)
                break;
        }
        if (h.tag === 10) {
            var w = h.alternate;
            if (w === null)
                throw Error(s(387));
            if (w = w.memoizedProps, w !== null) {
                var _ = h.type;
                Bt(h.pendingProps.value, w.value) || (t !== null ? t.push(_) : t = [_]);
            }
        }
        else if (h === yt.current) {
            if (w = h.alternate, w === null)
                throw Error(s(387));
            w.memoizedState.memoizedState !== h.memoizedState.memoizedState && (t !== null ? t.push(Ea) : t = [Ea]);
        }
        h = h.return;
    } t !== null && bu(r, t, a, c), r.flags |= 262144; }
    function Ol(t) { for (t = t.firstContext; t !== null;) {
        if (!Bt(t.context._currentValue, t.memoizedValue))
            return !0;
        t = t.next;
    } return !1; }
    function Gi(t) { Vi = t, jn = null, t = t.dependencies, t !== null && (t.firstContext = null); }
    function ht(t) { return Mp(Vi, t); }
    function Rl(t, r) { return Vi === null && Gi(t), Mp(t, r); }
    function Mp(t, r) { var a = r._currentValue; if (r = { context: r, memoizedValue: a, next: null }, jn === null) {
        if (t === null)
            throw Error(s(308));
        jn = r, t.dependencies = { lanes: 0, firstContext: r }, t.flags |= 524288;
    }
    else
        jn = jn.next = r; return a; }
    var bw = typeof AbortController < "u" ? AbortController : function () { var t = [], r = this.signal = { aborted: !1, addEventListener: function (a, c) { t.push(c); } }; this.abort = function () { r.aborted = !0, t.forEach(function (a) { return a(); }); }; }, vw = n.unstable_scheduleCallback, Sw = n.unstable_NormalPriority, Ze = { $$typeof: $, Consumer: null, Provider: null, _currentValue: null, _currentValue2: null, _threadCount: 0 };
    function vu() { return { controller: new bw, data: new Map, refCount: 0 }; }
    function Zr(t) { t.refCount--, t.refCount === 0 && vw(Sw, function () { t.controller.abort(); }); }
    var Jr = null, Su = 0, Ds = 0, Bs = null;
    function ww(t, r) { if (Jr === null) {
        var a = Jr = [];
        Su = 0, Ds = _f(), Bs = { status: "pending", value: void 0, then: function (c) { a.push(c); } };
    } return Su++, r.then(Op, Op), r; }
    function Op() { if (--Su === 0 && Jr !== null) {
        Bs !== null && (Bs.status = "fulfilled");
        var t = Jr;
        Jr = null, Ds = 0, Bs = null;
        for (var r = 0; r < t.length; r++)
            (0, t[r])();
    } }
    function xw(t, r) { var a = [], c = { status: "pending", value: null, reason: null, then: function (h) { a.push(h); } }; return t.then(function () { c.status = "fulfilled", c.value = r; for (var h = 0; h < a.length; h++)
        (0, a[h])(r); }, function (h) { for (c.status = "rejected", c.reason = h, h = 0; h < a.length; h++)
        (0, a[h])(void 0); }), c; }
    var Rp = z.S;
    z.S = function (t, r) { typeof r == "object" && r !== null && typeof r.then == "function" && ww(t, r), Rp !== null && Rp(t, r); };
    var Ki = P(null);
    function wu() { var t = Ki.current; return t !== null ? t : je.pooledCache; }
    function jl(t, r) { r === null ? J(Ki, Ki.current) : J(Ki, r.pool); }
    function jp() { var t = wu(); return t === null ? null : { parent: Ze._currentValue, pool: t }; }
    var Wr = Error(s(460)), Lp = Error(s(474)), Ll = Error(s(542)), xu = { then: function () { } };
    function Dp(t) { return t = t.status, t === "fulfilled" || t === "rejected"; }
    function Dl() { }
    function Bp(t, r, a) { switch (a = t[a], a === void 0 ? t.push(r) : a !== r && (r.then(Dl, Dl), r = a), r.status) {
        case "fulfilled": return r.value;
        case "rejected": throw t = r.reason, zp(t), t;
        default:
            if (typeof r.status == "string")
                r.then(Dl, Dl);
            else {
                if (t = je, t !== null && 100 < t.shellSuspendCounter)
                    throw Error(s(482));
                t = r, t.status = "pending", t.then(function (c) { if (r.status === "pending") {
                    var h = r;
                    h.status = "fulfilled", h.value = c;
                } }, function (c) { if (r.status === "pending") {
                    var h = r;
                    h.status = "rejected", h.reason = c;
                } });
            }
            switch (r.status) {
                case "fulfilled": return r.value;
                case "rejected": throw t = r.reason, zp(t), t;
            }
            throw ea = r, Wr;
    } }
    var ea = null;
    function Up() { if (ea === null)
        throw Error(s(459)); var t = ea; return ea = null, t; }
    function zp(t) { if (t === Wr || t === Ll)
        throw Error(s(483)); }
    var ni = !1;
    function _u(t) { t.updateQueue = { baseState: t.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, lanes: 0, hiddenCallbacks: null }, callbacks: null }; }
    function Tu(t, r) { t = t.updateQueue, r.updateQueue === t && (r.updateQueue = { baseState: t.baseState, firstBaseUpdate: t.firstBaseUpdate, lastBaseUpdate: t.lastBaseUpdate, shared: t.shared, callbacks: null }); }
    function ii(t) { return { lane: t, tag: 0, payload: null, callback: null, next: null }; }
    function si(t, r, a) { var c = t.updateQueue; if (c === null)
        return null; if (c = c.shared, (Ee & 2) !== 0) {
        var h = c.pending;
        return h === null ? r.next = r : (r.next = h.next, h.next = r), c.pending = r, r = Nl(t), Tp(t, null, a), r;
    } return Al(t, c, r, a), Nl(t); }
    function ta(t, r, a) { if (r = r.updateQueue, r !== null && (r = r.shared, (a & 4194048) !== 0)) {
        var c = r.lanes;
        c &= t.pendingLanes, a |= c, r.lanes = a, Od(t, a);
    } }
    function Eu(t, r) { var a = t.updateQueue, c = t.alternate; if (c !== null && (c = c.updateQueue, a === c)) {
        var h = null, g = null;
        if (a = a.firstBaseUpdate, a !== null) {
            do {
                var w = { lane: a.lane, tag: a.tag, payload: a.payload, callback: null, next: null };
                g === null ? h = g = w : g = g.next = w, a = a.next;
            } while (a !== null);
            g === null ? h = g = r : g = g.next = r;
        }
        else
            h = g = r;
        a = { baseState: c.baseState, firstBaseUpdate: h, lastBaseUpdate: g, shared: c.shared, callbacks: c.callbacks }, t.updateQueue = a;
        return;
    } t = a.lastBaseUpdate, t === null ? a.firstBaseUpdate = r : t.next = r, a.lastBaseUpdate = r; }
    var Au = !1;
    function na() { if (Au) {
        var t = Bs;
        if (t !== null)
            throw t;
    } }
    function ia(t, r, a, c) { Au = !1; var h = t.updateQueue; ni = !1; var g = h.firstBaseUpdate, w = h.lastBaseUpdate, _ = h.shared.pending; if (_ !== null) {
        h.shared.pending = null;
        var A = _, D = A.next;
        A.next = null, w === null ? g = D : w.next = D, w = A;
        var K = t.alternate;
        K !== null && (K = K.updateQueue, _ = K.lastBaseUpdate, _ !== w && (_ === null ? K.firstBaseUpdate = D : _.next = D, K.lastBaseUpdate = A));
    } if (g !== null) {
        var X = h.baseState;
        w = 0, K = D = A = null, _ = g;
        do {
            var B = _.lane & -536870913, U = B !== _.lane;
            if (U ? (Se & B) === B : (c & B) === B) {
                B !== 0 && B === Ds && (Au = !0), K !== null && (K = K.next = { lane: 0, tag: _.tag, payload: _.payload, callback: null, next: null });
                e: {
                    var fe = t, oe = _;
                    B = r;
                    var Me = a;
                    switch (oe.tag) {
                        case 1:
                            if (fe = oe.payload, typeof fe == "function") {
                                X = fe.call(Me, X, B);
                                break e;
                            }
                            X = fe;
                            break e;
                        case 3: fe.flags = fe.flags & -65537 | 128;
                        case 0:
                            if (fe = oe.payload, B = typeof fe == "function" ? fe.call(Me, X, B) : fe, B == null)
                                break e;
                            X = m({}, X, B);
                            break e;
                        case 2: ni = !0;
                    }
                }
                B = _.callback, B !== null && (t.flags |= 64, U && (t.flags |= 8192), U = h.callbacks, U === null ? h.callbacks = [B] : U.push(B));
            }
            else
                U = { lane: B, tag: _.tag, payload: _.payload, callback: _.callback, next: null }, K === null ? (D = K = U, A = X) : K = K.next = U, w |= B;
            if (_ = _.next, _ === null) {
                if (_ = h.shared.pending, _ === null)
                    break;
                U = _, _ = U.next, U.next = null, h.lastBaseUpdate = U, h.shared.pending = null;
            }
        } while (!0);
        K === null && (A = X), h.baseState = A, h.firstBaseUpdate = D, h.lastBaseUpdate = K, g === null && (h.shared.lanes = 0), hi |= w, t.lanes = w, t.memoizedState = X;
    } }
    function Hp(t, r) { if (typeof t != "function")
        throw Error(s(191, t)); t.call(r); }
    function qp(t, r) { var a = t.callbacks; if (a !== null)
        for (t.callbacks = null, t = 0; t < a.length; t++)
            Hp(a[t], r); }
    var Us = P(null), Bl = P(0);
    function $p(t, r) { t = $n, J(Bl, t), J(Us, r), $n = t | r.baseLanes; }
    function Nu() { J(Bl, $n), J(Us, Us.current); }
    function Cu() { $n = Bl.current, W(Us), W(Bl); }
    var ri = 0, pe = null, Ce = null, Pe = null, Ul = !1, zs = !1, Yi = !1, zl = 0, sa = 0, Hs = null, _w = 0;
    function Ve() { throw Error(s(321)); }
    function ku(t, r) { if (r === null)
        return !1; for (var a = 0; a < r.length && a < t.length; a++)
        if (!Bt(t[a], r[a]))
            return !1; return !0; }
    function Mu(t, r, a, c, h, g) { return ri = g, pe = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, z.H = t === null || t.memoizedState === null ? Tg : Eg, Yi = !1, g = a(c, h), Yi = !1, zs && (g = Vp(r, a, c, h)), Ip(t), g; }
    function Ip(t) { z.H = Gl; var r = Ce !== null && Ce.next !== null; if (ri = 0, Pe = Ce = pe = null, Ul = !1, sa = 0, Hs = null, r)
        throw Error(s(300)); t === null || tt || (t = t.dependencies, t !== null && Ol(t) && (tt = !0)); }
    function Vp(t, r, a, c) { pe = t; var h = 0; do {
        if (zs && (Hs = null), sa = 0, zs = !1, 25 <= h)
            throw Error(s(301));
        if (h += 1, Pe = Ce = null, t.updateQueue != null) {
            var g = t.updateQueue;
            g.lastEffect = null, g.events = null, g.stores = null, g.memoCache != null && (g.memoCache.index = 0);
        }
        z.H = Mw, g = r(a, c);
    } while (zs); return g; }
    function Tw() { var t = z.H, r = t.useState()[0]; return r = typeof r.then == "function" ? ra(r) : r, t = t.useState()[0], (Ce !== null ? Ce.memoizedState : null) !== t && (pe.flags |= 1024), r; }
    function Ou() { var t = zl !== 0; return zl = 0, t; }
    function Ru(t, r, a) { r.updateQueue = t.updateQueue, r.flags &= -2053, t.lanes &= ~a; }
    function ju(t) { if (Ul) {
        for (t = t.memoizedState; t !== null;) {
            var r = t.queue;
            r !== null && (r.pending = null), t = t.next;
        }
        Ul = !1;
    } ri = 0, Pe = Ce = pe = null, zs = !1, sa = zl = 0, Hs = null; }
    function Nt() { var t = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null }; return Pe === null ? pe.memoizedState = Pe = t : Pe = Pe.next = t, Pe; }
    function Fe() { if (Ce === null) {
        var t = pe.alternate;
        t = t !== null ? t.memoizedState : null;
    }
    else
        t = Ce.next; var r = Pe === null ? pe.memoizedState : Pe.next; if (r !== null)
        Pe = r, Ce = t;
    else {
        if (t === null)
            throw pe.alternate === null ? Error(s(467)) : Error(s(310));
        Ce = t, t = { memoizedState: Ce.memoizedState, baseState: Ce.baseState, baseQueue: Ce.baseQueue, queue: Ce.queue, next: null }, Pe === null ? pe.memoizedState = Pe = t : Pe = Pe.next = t;
    } return Pe; }
    function Lu() { return { lastEffect: null, events: null, stores: null, memoCache: null }; }
    function ra(t) { var r = sa; return sa += 1, Hs === null && (Hs = []), t = Bp(Hs, t, r), r = pe, (Pe === null ? r.memoizedState : Pe.next) === null && (r = r.alternate, z.H = r === null || r.memoizedState === null ? Tg : Eg), t; }
    function Hl(t) { if (t !== null && typeof t == "object") {
        if (typeof t.then == "function")
            return ra(t);
        if (t.$$typeof === $)
            return ht(t);
    } throw Error(s(438, String(t))); }
    function Du(t) { var r = null, a = pe.updateQueue; if (a !== null && (r = a.memoCache), r == null) {
        var c = pe.alternate;
        c !== null && (c = c.updateQueue, c !== null && (c = c.memoCache, c != null && (r = { data: c.data.map(function (h) { return h.slice(); }), index: 0 })));
    } if (r == null && (r = { data: [], index: 0 }), a === null && (a = Lu(), pe.updateQueue = a), a.memoCache = r, a = r.data[r.index], a === void 0)
        for (a = r.data[r.index] = Array(t), c = 0; c < t; c++)
            a[c] = ie; return r.index++, a; }
    function Dn(t, r) { return typeof r == "function" ? r(t) : r; }
    function ql(t) { var r = Fe(); return Bu(r, Ce, t); }
    function Bu(t, r, a) { var c = t.queue; if (c === null)
        throw Error(s(311)); c.lastRenderedReducer = a; var h = t.baseQueue, g = c.pending; if (g !== null) {
        if (h !== null) {
            var w = h.next;
            h.next = g.next, g.next = w;
        }
        r.baseQueue = h = g, c.pending = null;
    } if (g = t.baseState, h === null)
        t.memoizedState = g;
    else {
        r = h.next;
        var _ = w = null, A = null, D = r, K = !1;
        do {
            var X = D.lane & -536870913;
            if (X !== D.lane ? (Se & X) === X : (ri & X) === X) {
                var B = D.revertLane;
                if (B === 0)
                    A !== null && (A = A.next = { lane: 0, revertLane: 0, action: D.action, hasEagerState: D.hasEagerState, eagerState: D.eagerState, next: null }), X === Ds && (K = !0);
                else if ((ri & B) === B) {
                    D = D.next, B === Ds && (K = !0);
                    continue;
                }
                else
                    X = { lane: 0, revertLane: D.revertLane, action: D.action, hasEagerState: D.hasEagerState, eagerState: D.eagerState, next: null }, A === null ? (_ = A = X, w = g) : A = A.next = X, pe.lanes |= B, hi |= B;
                X = D.action, Yi && a(g, X), g = D.hasEagerState ? D.eagerState : a(g, X);
            }
            else
                B = { lane: X, revertLane: D.revertLane, action: D.action, hasEagerState: D.hasEagerState, eagerState: D.eagerState, next: null }, A === null ? (_ = A = B, w = g) : A = A.next = B, pe.lanes |= X, hi |= X;
            D = D.next;
        } while (D !== null && D !== r);
        if (A === null ? w = g : A.next = _, !Bt(g, t.memoizedState) && (tt = !0, K && (a = Bs, a !== null)))
            throw a;
        t.memoizedState = g, t.baseState = w, t.baseQueue = A, c.lastRenderedState = g;
    } return h === null && (c.lanes = 0), [t.memoizedState, c.dispatch]; }
    function Uu(t) { var r = Fe(), a = r.queue; if (a === null)
        throw Error(s(311)); a.lastRenderedReducer = t; var c = a.dispatch, h = a.pending, g = r.memoizedState; if (h !== null) {
        a.pending = null;
        var w = h = h.next;
        do
            g = t(g, w.action), w = w.next;
        while (w !== h);
        Bt(g, r.memoizedState) || (tt = !0), r.memoizedState = g, r.baseQueue === null && (r.baseState = g), a.lastRenderedState = g;
    } return [g, c]; }
    function Gp(t, r, a) { var c = pe, h = Fe(), g = _e; if (g) {
        if (a === void 0)
            throw Error(s(407));
        a = a();
    }
    else
        a = r(); var w = !Bt((Ce || h).memoizedState, a); w && (h.memoizedState = a, tt = !0), h = h.queue; var _ = Xp.bind(null, c, h, t); if (aa(2048, 8, _, [t]), h.getSnapshot !== r || w || Pe !== null && Pe.memoizedState.tag & 1) {
        if (c.flags |= 2048, qs(9, $l(), Yp.bind(null, c, h, a, r), null), je === null)
            throw Error(s(349));
        g || (ri & 124) !== 0 || Kp(c, r, a);
    } return a; }
    function Kp(t, r, a) { t.flags |= 16384, t = { getSnapshot: r, value: a }, r = pe.updateQueue, r === null ? (r = Lu(), pe.updateQueue = r, r.stores = [t]) : (a = r.stores, a === null ? r.stores = [t] : a.push(t)); }
    function Yp(t, r, a, c) { r.value = a, r.getSnapshot = c, Pp(r) && Fp(t); }
    function Xp(t, r, a) { return a(function () { Pp(r) && Fp(t); }); }
    function Pp(t) { var r = t.getSnapshot; t = t.value; try {
        var a = r();
        return !Bt(t, a);
    }
    catch {
        return !0;
    } }
    function Fp(t) { var r = Os(t, 2); r !== null && It(r, t, 2); }
    function zu(t) { var r = Nt(); if (typeof t == "function") {
        var a = t;
        if (t = a(), Yi) {
            Yt(!0);
            try {
                a();
            }
            finally {
                Yt(!1);
            }
        }
    } return r.memoizedState = r.baseState = t, r.queue = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: Dn, lastRenderedState: t }, r; }
    function Qp(t, r, a, c) { return t.baseState = a, Bu(t, Ce, typeof c == "function" ? c : Dn); }
    function Ew(t, r, a, c, h) { if (Vl(t))
        throw Error(s(485)); if (t = r.action, t !== null) {
        var g = { payload: h, action: t, next: null, isTransition: !0, status: "pending", value: null, reason: null, listeners: [], then: function (w) { g.listeners.push(w); } };
        z.T !== null ? a(!0) : g.isTransition = !1, c(g), a = r.pending, a === null ? (g.next = r.pending = g, Zp(r, g)) : (g.next = a.next, r.pending = a.next = g);
    } }
    function Zp(t, r) { var a = r.action, c = r.payload, h = t.state; if (r.isTransition) {
        var g = z.T, w = {};
        z.T = w;
        try {
            var _ = a(h, c), A = z.S;
            A !== null && A(w, _), Jp(t, r, _);
        }
        catch (D) {
            Hu(t, r, D);
        }
        finally {
            z.T = g;
        }
    }
    else
        try {
            g = a(h, c), Jp(t, r, g);
        }
        catch (D) {
            Hu(t, r, D);
        } }
    function Jp(t, r, a) { a !== null && typeof a == "object" && typeof a.then == "function" ? a.then(function (c) { Wp(t, r, c); }, function (c) { return Hu(t, r, c); }) : Wp(t, r, a); }
    function Wp(t, r, a) { r.status = "fulfilled", r.value = a, eg(r), t.state = a, r = t.pending, r !== null && (a = r.next, a === r ? t.pending = null : (a = a.next, r.next = a, Zp(t, a))); }
    function Hu(t, r, a) { var c = t.pending; if (t.pending = null, c !== null) {
        c = c.next;
        do
            r.status = "rejected", r.reason = a, eg(r), r = r.next;
        while (r !== c);
    } t.action = null; }
    function eg(t) { t = t.listeners; for (var r = 0; r < t.length; r++)
        (0, t[r])(); }
    function tg(t, r) { return r; }
    function ng(t, r) { if (_e) {
        var a = je.formState;
        if (a !== null) {
            e: {
                var c = pe;
                if (_e) {
                    if ($e) {
                        t: {
                            for (var h = $e, g = yn; h.nodeType !== 8;) {
                                if (!g) {
                                    h = null;
                                    break t;
                                }
                                if (h = dn(h.nextSibling), h === null) {
                                    h = null;
                                    break t;
                                }
                            }
                            g = h.data, h = g === "F!" || g === "F" ? h : null;
                        }
                        if (h) {
                            $e = dn(h.nextSibling), c = h.data === "F!";
                            break e;
                        }
                    }
                    Ii(c);
                }
                c = !1;
            }
            c && (r = a[0]);
        }
    } return a = Nt(), a.memoizedState = a.baseState = r, c = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: tg, lastRenderedState: r }, a.queue = c, a = wg.bind(null, pe, c), c.dispatch = a, c = zu(!1), g = Gu.bind(null, pe, !1, c.queue), c = Nt(), h = { state: r, dispatch: null, action: t, pending: null }, c.queue = h, a = Ew.bind(null, pe, h, g, a), h.dispatch = a, c.memoizedState = t, [r, a, !1]; }
    function ig(t) { var r = Fe(); return sg(r, Ce, t); }
    function sg(t, r, a) { if (r = Bu(t, r, tg)[0], t = ql(Dn)[0], typeof r == "object" && r !== null && typeof r.then == "function")
        try {
            var c = ra(r);
        }
        catch (w) {
            throw w === Wr ? Ll : w;
        }
    else
        c = r; r = Fe(); var h = r.queue, g = h.dispatch; return a !== r.memoizedState && (pe.flags |= 2048, qs(9, $l(), Aw.bind(null, h, a), null)), [c, g, t]; }
    function Aw(t, r) { t.action = r; }
    function rg(t) { var r = Fe(), a = Ce; if (a !== null)
        return sg(r, a, t); Fe(), r = r.memoizedState, a = Fe(); var c = a.queue.dispatch; return a.memoizedState = t, [r, c, !1]; }
    function qs(t, r, a, c) { return t = { tag: t, create: a, deps: c, inst: r, next: null }, r = pe.updateQueue, r === null && (r = Lu(), pe.updateQueue = r), a = r.lastEffect, a === null ? r.lastEffect = t.next = t : (c = a.next, a.next = t, t.next = c, r.lastEffect = t), t; }
    function $l() { return { destroy: void 0, resource: void 0 }; }
    function ag() { return Fe().memoizedState; }
    function Il(t, r, a, c) { var h = Nt(); c = c === void 0 ? null : c, pe.flags |= t, h.memoizedState = qs(1 | r, $l(), a, c); }
    function aa(t, r, a, c) { var h = Fe(); c = c === void 0 ? null : c; var g = h.memoizedState.inst; Ce !== null && c !== null && ku(c, Ce.memoizedState.deps) ? h.memoizedState = qs(r, g, a, c) : (pe.flags |= t, h.memoizedState = qs(1 | r, g, a, c)); }
    function lg(t, r) { Il(8390656, 8, t, r); }
    function og(t, r) { aa(2048, 8, t, r); }
    function cg(t, r) { return aa(4, 2, t, r); }
    function ug(t, r) { return aa(4, 4, t, r); }
    function fg(t, r) { if (typeof r == "function") {
        t = t();
        var a = r(t);
        return function () { typeof a == "function" ? a() : r(null); };
    } if (r != null)
        return t = t(), r.current = t, function () { r.current = null; }; }
    function hg(t, r, a) { a = a != null ? a.concat([t]) : null, aa(4, 4, fg.bind(null, r, t), a); }
    function qu() { }
    function dg(t, r) { var a = Fe(); r = r === void 0 ? null : r; var c = a.memoizedState; return r !== null && ku(r, c[1]) ? c[0] : (a.memoizedState = [t, r], t); }
    function pg(t, r) { var a = Fe(); r = r === void 0 ? null : r; var c = a.memoizedState; if (r !== null && ku(r, c[1]))
        return c[0]; if (c = t(), Yi) {
        Yt(!0);
        try {
            t();
        }
        finally {
            Yt(!1);
        }
    } return a.memoizedState = [c, r], c; }
    function $u(t, r, a) { return a === void 0 || (ri & 1073741824) !== 0 ? t.memoizedState = r : (t.memoizedState = a, t = ym(), pe.lanes |= t, hi |= t, a); }
    function gg(t, r, a, c) { return Bt(a, r) ? a : Us.current !== null ? (t = $u(t, a, c), Bt(t, r) || (tt = !0), t) : (ri & 42) === 0 ? (tt = !0, t.memoizedState = a) : (t = ym(), pe.lanes |= t, hi |= t, r); }
    function mg(t, r, a, c, h) { var g = Q.p; Q.p = g !== 0 && 8 > g ? g : 8; var w = z.T, _ = {}; z.T = _, Gu(t, !1, r, a); try {
        var A = h(), D = z.S;
        if (D !== null && D(_, A), A !== null && typeof A == "object" && typeof A.then == "function") {
            var K = xw(A, c);
            la(t, r, K, $t(t));
        }
        else
            la(t, r, c, $t(t));
    }
    catch (X) {
        la(t, r, { then: function () { }, status: "rejected", reason: X }, $t());
    }
    finally {
        Q.p = g, z.T = w;
    } }
    function Nw() { }
    function Iu(t, r, a, c) { if (t.tag !== 5)
        throw Error(s(476)); var h = yg(t).queue; mg(t, h, r, se, a === null ? Nw : function () { return bg(t), a(c); }); }
    function yg(t) { var r = t.memoizedState; if (r !== null)
        return r; r = { memoizedState: se, baseState: se, baseQueue: null, queue: { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: Dn, lastRenderedState: se }, next: null }; var a = {}; return r.next = { memoizedState: a, baseState: a, baseQueue: null, queue: { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: Dn, lastRenderedState: a }, next: null }, t.memoizedState = r, t = t.alternate, t !== null && (t.memoizedState = r), r; }
    function bg(t) { var r = yg(t).next.queue; la(t, r, {}, $t()); }
    function Vu() { return ht(Ea); }
    function vg() { return Fe().memoizedState; }
    function Sg() { return Fe().memoizedState; }
    function Cw(t) { for (var r = t.return; r !== null;) {
        switch (r.tag) {
            case 24:
            case 3:
                var a = $t();
                t = ii(a);
                var c = si(r, t, a);
                c !== null && (It(c, r, a), ta(c, r, a)), r = { cache: vu() }, t.payload = r;
                return;
        }
        r = r.return;
    } }
    function kw(t, r, a) { var c = $t(); a = { lane: c, revertLane: 0, action: a, hasEagerState: !1, eagerState: null, next: null }, Vl(t) ? xg(r, a) : (a = cu(t, r, a, c), a !== null && (It(a, t, c), _g(a, r, c))); }
    function wg(t, r, a) { var c = $t(); la(t, r, a, c); }
    function la(t, r, a, c) { var h = { lane: c, revertLane: 0, action: a, hasEagerState: !1, eagerState: null, next: null }; if (Vl(t))
        xg(r, h);
    else {
        var g = t.alternate;
        if (t.lanes === 0 && (g === null || g.lanes === 0) && (g = r.lastRenderedReducer, g !== null))
            try {
                var w = r.lastRenderedState, _ = g(w, a);
                if (h.hasEagerState = !0, h.eagerState = _, Bt(_, w))
                    return Al(t, r, h, 0), je === null && El(), !1;
            }
            catch { }
            finally { }
        if (a = cu(t, r, h, c), a !== null)
            return It(a, t, c), _g(a, r, c), !0;
    } return !1; }
    function Gu(t, r, a, c) { if (c = { lane: 2, revertLane: _f(), action: c, hasEagerState: !1, eagerState: null, next: null }, Vl(t)) {
        if (r)
            throw Error(s(479));
    }
    else
        r = cu(t, a, c, 2), r !== null && It(r, t, 2); }
    function Vl(t) { var r = t.alternate; return t === pe || r !== null && r === pe; }
    function xg(t, r) { zs = Ul = !0; var a = t.pending; a === null ? r.next = r : (r.next = a.next, a.next = r), t.pending = r; }
    function _g(t, r, a) { if ((a & 4194048) !== 0) {
        var c = r.lanes;
        c &= t.pendingLanes, a |= c, r.lanes = a, Od(t, a);
    } }
    var Gl = { readContext: ht, use: Hl, useCallback: Ve, useContext: Ve, useEffect: Ve, useImperativeHandle: Ve, useLayoutEffect: Ve, useInsertionEffect: Ve, useMemo: Ve, useReducer: Ve, useRef: Ve, useState: Ve, useDebugValue: Ve, useDeferredValue: Ve, useTransition: Ve, useSyncExternalStore: Ve, useId: Ve, useHostTransitionStatus: Ve, useFormState: Ve, useActionState: Ve, useOptimistic: Ve, useMemoCache: Ve, useCacheRefresh: Ve }, Tg = { readContext: ht, use: Hl, useCallback: function (t, r) { return Nt().memoizedState = [t, r === void 0 ? null : r], t; }, useContext: ht, useEffect: lg, useImperativeHandle: function (t, r, a) { a = a != null ? a.concat([t]) : null, Il(4194308, 4, fg.bind(null, r, t), a); }, useLayoutEffect: function (t, r) { return Il(4194308, 4, t, r); }, useInsertionEffect: function (t, r) { Il(4, 2, t, r); }, useMemo: function (t, r) { var a = Nt(); r = r === void 0 ? null : r; var c = t(); if (Yi) {
            Yt(!0);
            try {
                t();
            }
            finally {
                Yt(!1);
            }
        } return a.memoizedState = [c, r], c; }, useReducer: function (t, r, a) { var c = Nt(); if (a !== void 0) {
            var h = a(r);
            if (Yi) {
                Yt(!0);
                try {
                    a(r);
                }
                finally {
                    Yt(!1);
                }
            }
        }
        else
            h = r; return c.memoizedState = c.baseState = h, t = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: t, lastRenderedState: h }, c.queue = t, t = t.dispatch = kw.bind(null, pe, t), [c.memoizedState, t]; }, useRef: function (t) { var r = Nt(); return t = { current: t }, r.memoizedState = t; }, useState: function (t) { t = zu(t); var r = t.queue, a = wg.bind(null, pe, r); return r.dispatch = a, [t.memoizedState, a]; }, useDebugValue: qu, useDeferredValue: function (t, r) { var a = Nt(); return $u(a, t, r); }, useTransition: function () { var t = zu(!1); return t = mg.bind(null, pe, t.queue, !0, !1), Nt().memoizedState = t, [!1, t]; }, useSyncExternalStore: function (t, r, a) { var c = pe, h = Nt(); if (_e) {
            if (a === void 0)
                throw Error(s(407));
            a = a();
        }
        else {
            if (a = r(), je === null)
                throw Error(s(349));
            (Se & 124) !== 0 || Kp(c, r, a);
        } h.memoizedState = a; var g = { value: a, getSnapshot: r }; return h.queue = g, lg(Xp.bind(null, c, g, t), [t]), c.flags |= 2048, qs(9, $l(), Yp.bind(null, c, g, a, r), null), a; }, useId: function () { var t = Nt(), r = je.identifierPrefix; if (_e) {
            var a = Rn, c = On;
            a = (c & ~(1 << 32 - vt(c) - 1)).toString(32) + a, r = "«" + r + "R" + a, a = zl++, 0 < a && (r += "H" + a.toString(32)), r += "»";
        }
        else
            a = _w++, r = "«" + r + "r" + a.toString(32) + "»"; return t.memoizedState = r; }, useHostTransitionStatus: Vu, useFormState: ng, useActionState: ng, useOptimistic: function (t) { var r = Nt(); r.memoizedState = r.baseState = t; var a = { pending: null, lanes: 0, dispatch: null, lastRenderedReducer: null, lastRenderedState: null }; return r.queue = a, r = Gu.bind(null, pe, !0, a), a.dispatch = r, [t, r]; }, useMemoCache: Du, useCacheRefresh: function () { return Nt().memoizedState = Cw.bind(null, pe); } }, Eg = { readContext: ht, use: Hl, useCallback: dg, useContext: ht, useEffect: og, useImperativeHandle: hg, useInsertionEffect: cg, useLayoutEffect: ug, useMemo: pg, useReducer: ql, useRef: ag, useState: function () { return ql(Dn); }, useDebugValue: qu, useDeferredValue: function (t, r) { var a = Fe(); return gg(a, Ce.memoizedState, t, r); }, useTransition: function () { var t = ql(Dn)[0], r = Fe().memoizedState; return [typeof t == "boolean" ? t : ra(t), r]; }, useSyncExternalStore: Gp, useId: vg, useHostTransitionStatus: Vu, useFormState: ig, useActionState: ig, useOptimistic: function (t, r) { var a = Fe(); return Qp(a, Ce, t, r); }, useMemoCache: Du, useCacheRefresh: Sg }, Mw = { readContext: ht, use: Hl, useCallback: dg, useContext: ht, useEffect: og, useImperativeHandle: hg, useInsertionEffect: cg, useLayoutEffect: ug, useMemo: pg, useReducer: Uu, useRef: ag, useState: function () { return Uu(Dn); }, useDebugValue: qu, useDeferredValue: function (t, r) { var a = Fe(); return Ce === null ? $u(a, t, r) : gg(a, Ce.memoizedState, t, r); }, useTransition: function () { var t = Uu(Dn)[0], r = Fe().memoizedState; return [typeof t == "boolean" ? t : ra(t), r]; }, useSyncExternalStore: Gp, useId: vg, useHostTransitionStatus: Vu, useFormState: rg, useActionState: rg, useOptimistic: function (t, r) { var a = Fe(); return Ce !== null ? Qp(a, Ce, t, r) : (a.baseState = t, [t, a.queue.dispatch]); }, useMemoCache: Du, useCacheRefresh: Sg }, $s = null, oa = 0;
    function Kl(t) { var r = oa; return oa += 1, $s === null && ($s = []), Bp($s, t, r); }
    function ca(t, r) { r = r.props.ref, t.ref = r !== void 0 ? r : null; }
    function Yl(t, r) { throw r.$$typeof === y ? Error(s(525)) : (t = Object.prototype.toString.call(r), Error(s(31, t === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : t))); }
    function Ag(t) { var r = t._init; return r(t._payload); }
    function Ng(t) { function r(O, M) { if (t) {
        var L = O.deletions;
        L === null ? (O.deletions = [M], O.flags |= 16) : L.push(M);
    } } function a(O, M) { if (!t)
        return null; for (; M !== null;)
        r(O, M), M = M.sibling; return null; } function c(O) { for (var M = new Map; O !== null;)
        O.key !== null ? M.set(O.key, O) : M.set(O.index, O), O = O.sibling; return M; } function h(O, M) { return O = Mn(O, M), O.index = 0, O.sibling = null, O; } function g(O, M, L) { return O.index = L, t ? (L = O.alternate, L !== null ? (L = L.index, L < M ? (O.flags |= 67108866, M) : L) : (O.flags |= 67108866, M)) : (O.flags |= 1048576, M); } function w(O) { return t && O.alternate === null && (O.flags |= 67108866), O; } function _(O, M, L, Y) { return M === null || M.tag !== 6 ? (M = fu(L, O.mode, Y), M.return = O, M) : (M = h(M, L), M.return = O, M); } function A(O, M, L, Y) { var ne = L.type; return ne === E ? K(O, M, L.props.children, Y, L.key) : M !== null && (M.elementType === ne || typeof ne == "object" && ne !== null && ne.$$typeof === q && Ag(ne) === M.type) ? (M = h(M, L.props), ca(M, L), M.return = O, M) : (M = Cl(L.type, L.key, L.props, null, O.mode, Y), ca(M, L), M.return = O, M); } function D(O, M, L, Y) { return M === null || M.tag !== 4 || M.stateNode.containerInfo !== L.containerInfo || M.stateNode.implementation !== L.implementation ? (M = hu(L, O.mode, Y), M.return = O, M) : (M = h(M, L.children || []), M.return = O, M); } function K(O, M, L, Y, ne) { return M === null || M.tag !== 7 ? (M = zi(L, O.mode, Y, ne), M.return = O, M) : (M = h(M, L), M.return = O, M); } function X(O, M, L) { if (typeof M == "string" && M !== "" || typeof M == "number" || typeof M == "bigint")
        return M = fu("" + M, O.mode, L), M.return = O, M; if (typeof M == "object" && M !== null) {
        switch (M.$$typeof) {
            case v: return L = Cl(M.type, M.key, M.props, null, O.mode, L), ca(L, M), L.return = O, L;
            case S: return M = hu(M, O.mode, L), M.return = O, M;
            case q:
                var Y = M._init;
                return M = Y(M._payload), X(O, M, L);
        }
        if (ve(M) || I(M))
            return M = zi(M, O.mode, L, null), M.return = O, M;
        if (typeof M.then == "function")
            return X(O, Kl(M), L);
        if (M.$$typeof === $)
            return X(O, Rl(O, M), L);
        Yl(O, M);
    } return null; } function B(O, M, L, Y) { var ne = M !== null ? M.key : null; if (typeof L == "string" && L !== "" || typeof L == "number" || typeof L == "bigint")
        return ne !== null ? null : _(O, M, "" + L, Y); if (typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
            case v: return L.key === ne ? A(O, M, L, Y) : null;
            case S: return L.key === ne ? D(O, M, L, Y) : null;
            case q: return ne = L._init, L = ne(L._payload), B(O, M, L, Y);
        }
        if (ve(L) || I(L))
            return ne !== null ? null : K(O, M, L, Y, null);
        if (typeof L.then == "function")
            return B(O, M, Kl(L), Y);
        if (L.$$typeof === $)
            return B(O, M, Rl(O, L), Y);
        Yl(O, L);
    } return null; } function U(O, M, L, Y, ne) { if (typeof Y == "string" && Y !== "" || typeof Y == "number" || typeof Y == "bigint")
        return O = O.get(L) || null, _(M, O, "" + Y, ne); if (typeof Y == "object" && Y !== null) {
        switch (Y.$$typeof) {
            case v: return O = O.get(Y.key === null ? L : Y.key) || null, A(M, O, Y, ne);
            case S: return O = O.get(Y.key === null ? L : Y.key) || null, D(M, O, Y, ne);
            case q:
                var ge = Y._init;
                return Y = ge(Y._payload), U(O, M, L, Y, ne);
        }
        if (ve(Y) || I(Y))
            return O = O.get(L) || null, K(M, O, Y, ne, null);
        if (typeof Y.then == "function")
            return U(O, M, L, Kl(Y), ne);
        if (Y.$$typeof === $)
            return U(O, M, L, Rl(M, Y), ne);
        Yl(M, Y);
    } return null; } function fe(O, M, L, Y) { for (var ne = null, ge = null, re = M, ue = M = 0, it = null; re !== null && ue < L.length; ue++) {
        re.index > ue ? (it = re, re = null) : it = re.sibling;
        var xe = B(O, re, L[ue], Y);
        if (xe === null) {
            re === null && (re = it);
            break;
        }
        t && re && xe.alternate === null && r(O, re), M = g(xe, M, ue), ge === null ? ne = xe : ge.sibling = xe, ge = xe, re = it;
    } if (ue === L.length)
        return a(O, re), _e && qi(O, ue), ne; if (re === null) {
        for (; ue < L.length; ue++)
            re = X(O, L[ue], Y), re !== null && (M = g(re, M, ue), ge === null ? ne = re : ge.sibling = re, ge = re);
        return _e && qi(O, ue), ne;
    } for (re = c(re); ue < L.length; ue++)
        it = U(re, O, ue, L[ue], Y), it !== null && (t && it.alternate !== null && re.delete(it.key === null ? ue : it.key), M = g(it, M, ue), ge === null ? ne = it : ge.sibling = it, ge = it); return t && re.forEach(function (wi) { return r(O, wi); }), _e && qi(O, ue), ne; } function oe(O, M, L, Y) { if (L == null)
        throw Error(s(151)); for (var ne = null, ge = null, re = M, ue = M = 0, it = null, xe = L.next(); re !== null && !xe.done; ue++, xe = L.next()) {
        re.index > ue ? (it = re, re = null) : it = re.sibling;
        var wi = B(O, re, xe.value, Y);
        if (wi === null) {
            re === null && (re = it);
            break;
        }
        t && re && wi.alternate === null && r(O, re), M = g(wi, M, ue), ge === null ? ne = wi : ge.sibling = wi, ge = wi, re = it;
    } if (xe.done)
        return a(O, re), _e && qi(O, ue), ne; if (re === null) {
        for (; !xe.done; ue++, xe = L.next())
            xe = X(O, xe.value, Y), xe !== null && (M = g(xe, M, ue), ge === null ? ne = xe : ge.sibling = xe, ge = xe);
        return _e && qi(O, ue), ne;
    } for (re = c(re); !xe.done; ue++, xe = L.next())
        xe = U(re, O, ue, xe.value, Y), xe !== null && (t && xe.alternate !== null && re.delete(xe.key === null ? ue : xe.key), M = g(xe, M, ue), ge === null ? ne = xe : ge.sibling = xe, ge = xe); return t && re.forEach(function (O1) { return r(O, O1); }), _e && qi(O, ue), ne; } function Me(O, M, L, Y) { if (typeof L == "object" && L !== null && L.type === E && L.key === null && (L = L.props.children), typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
            case v:
                e: {
                    for (var ne = L.key; M !== null;) {
                        if (M.key === ne) {
                            if (ne = L.type, ne === E) {
                                if (M.tag === 7) {
                                    a(O, M.sibling), Y = h(M, L.props.children), Y.return = O, O = Y;
                                    break e;
                                }
                            }
                            else if (M.elementType === ne || typeof ne == "object" && ne !== null && ne.$$typeof === q && Ag(ne) === M.type) {
                                a(O, M.sibling), Y = h(M, L.props), ca(Y, L), Y.return = O, O = Y;
                                break e;
                            }
                            a(O, M);
                            break;
                        }
                        else
                            r(O, M);
                        M = M.sibling;
                    }
                    L.type === E ? (Y = zi(L.props.children, O.mode, Y, L.key), Y.return = O, O = Y) : (Y = Cl(L.type, L.key, L.props, null, O.mode, Y), ca(Y, L), Y.return = O, O = Y);
                }
                return w(O);
            case S:
                e: {
                    for (ne = L.key; M !== null;) {
                        if (M.key === ne)
                            if (M.tag === 4 && M.stateNode.containerInfo === L.containerInfo && M.stateNode.implementation === L.implementation) {
                                a(O, M.sibling), Y = h(M, L.children || []), Y.return = O, O = Y;
                                break e;
                            }
                            else {
                                a(O, M);
                                break;
                            }
                        else
                            r(O, M);
                        M = M.sibling;
                    }
                    Y = hu(L, O.mode, Y), Y.return = O, O = Y;
                }
                return w(O);
            case q: return ne = L._init, L = ne(L._payload), Me(O, M, L, Y);
        }
        if (ve(L))
            return fe(O, M, L, Y);
        if (I(L)) {
            if (ne = I(L), typeof ne != "function")
                throw Error(s(150));
            return L = ne.call(L), oe(O, M, L, Y);
        }
        if (typeof L.then == "function")
            return Me(O, M, Kl(L), Y);
        if (L.$$typeof === $)
            return Me(O, M, Rl(O, L), Y);
        Yl(O, L);
    } return typeof L == "string" && L !== "" || typeof L == "number" || typeof L == "bigint" ? (L = "" + L, M !== null && M.tag === 6 ? (a(O, M.sibling), Y = h(M, L), Y.return = O, O = Y) : (a(O, M), Y = fu(L, O.mode, Y), Y.return = O, O = Y), w(O)) : a(O, M); } return function (O, M, L, Y) { try {
        oa = 0;
        var ne = Me(O, M, L, Y);
        return $s = null, ne;
    }
    catch (re) {
        if (re === Wr || re === Ll)
            throw re;
        var ge = Ut(29, re, null, O.mode);
        return ge.lanes = Y, ge.return = O, ge;
    }
    finally { } }; }
    var Is = Ng(!0), Cg = Ng(!1), Wt = P(null), bn = null;
    function ai(t) { var r = t.alternate; J(Je, Je.current & 1), J(Wt, t), bn === null && (r === null || Us.current !== null || r.memoizedState !== null) && (bn = t); }
    function kg(t) { if (t.tag === 22) {
        if (J(Je, Je.current), J(Wt, t), bn === null) {
            var r = t.alternate;
            r !== null && r.memoizedState !== null && (bn = t);
        }
    }
    else
        li(); }
    function li() { J(Je, Je.current), J(Wt, Wt.current); }
    function Bn(t) { W(Wt), bn === t && (bn = null), W(Je); }
    var Je = P(0);
    function Xl(t) { for (var r = t; r !== null;) {
        if (r.tag === 13) {
            var a = r.memoizedState;
            if (a !== null && (a = a.dehydrated, a === null || a.data === "$?" || Df(a)))
                return r;
        }
        else if (r.tag === 19 && r.memoizedProps.revealOrder !== void 0) {
            if ((r.flags & 128) !== 0)
                return r;
        }
        else if (r.child !== null) {
            r.child.return = r, r = r.child;
            continue;
        }
        if (r === t)
            break;
        for (; r.sibling === null;) {
            if (r.return === null || r.return === t)
                return null;
            r = r.return;
        }
        r.sibling.return = r.return, r = r.sibling;
    } return null; }
    function Ku(t, r, a, c) { r = t.memoizedState, a = a(c, r), a = a == null ? r : m({}, r, a), t.memoizedState = a, t.lanes === 0 && (t.updateQueue.baseState = a); }
    var Yu = { enqueueSetState: function (t, r, a) { t = t._reactInternals; var c = $t(), h = ii(c); h.payload = r, a != null && (h.callback = a), r = si(t, h, c), r !== null && (It(r, t, c), ta(r, t, c)); }, enqueueReplaceState: function (t, r, a) { t = t._reactInternals; var c = $t(), h = ii(c); h.tag = 1, h.payload = r, a != null && (h.callback = a), r = si(t, h, c), r !== null && (It(r, t, c), ta(r, t, c)); }, enqueueForceUpdate: function (t, r) { t = t._reactInternals; var a = $t(), c = ii(a); c.tag = 2, r != null && (c.callback = r), r = si(t, c, a), r !== null && (It(r, t, a), ta(r, t, a)); } };
    function Mg(t, r, a, c, h, g, w) { return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(c, g, w) : r.prototype && r.prototype.isPureReactComponent ? !Kr(a, c) || !Kr(h, g) : !0; }
    function Og(t, r, a, c) { t = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(a, c), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(a, c), r.state !== t && Yu.enqueueReplaceState(r, r.state, null); }
    function Xi(t, r) { var a = r; if ("ref" in r) {
        a = {};
        for (var c in r)
            c !== "ref" && (a[c] = r[c]);
    } if (t = t.defaultProps) {
        a === r && (a = m({}, a));
        for (var h in t)
            a[h] === void 0 && (a[h] = t[h]);
    } return a; }
    var Pl = typeof reportError == "function" ? reportError : function (t) { if (typeof window == "object" && typeof window.ErrorEvent == "function") {
        var r = new window.ErrorEvent("error", { bubbles: !0, cancelable: !0, message: typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t), error: t });
        if (!window.dispatchEvent(r))
            return;
    }
    else if (typeof process == "object" && typeof process.emit == "function") {
        process.emit("uncaughtException", t);
        return;
    } console.error(t); };
    function Rg(t) { Pl(t); }
    function jg(t) { console.error(t); }
    function Lg(t) { Pl(t); }
    function Fl(t, r) { try {
        var a = t.onUncaughtError;
        a(r.value, { componentStack: r.stack });
    }
    catch (c) {
        setTimeout(function () { throw c; });
    } }
    function Dg(t, r, a) { try {
        var c = t.onCaughtError;
        c(a.value, { componentStack: a.stack, errorBoundary: r.tag === 1 ? r.stateNode : null });
    }
    catch (h) {
        setTimeout(function () { throw h; });
    } }
    function Xu(t, r, a) { return a = ii(a), a.tag = 3, a.payload = { element: null }, a.callback = function () { Fl(t, r); }, a; }
    function Bg(t) { return t = ii(t), t.tag = 3, t; }
    function Ug(t, r, a, c) { var h = a.type.getDerivedStateFromError; if (typeof h == "function") {
        var g = c.value;
        t.payload = function () { return h(g); }, t.callback = function () { Dg(r, a, c); };
    } var w = a.stateNode; w !== null && typeof w.componentDidCatch == "function" && (t.callback = function () { Dg(r, a, c), typeof h != "function" && (di === null ? di = new Set([this]) : di.add(this)); var _ = c.stack; this.componentDidCatch(c.value, { componentStack: _ !== null ? _ : "" }); }); }
    function Ow(t, r, a, c, h) { if (a.flags |= 32768, c !== null && typeof c == "object" && typeof c.then == "function") {
        if (r = a.alternate, r !== null && Qr(r, a, h, !0), a = Wt.current, a !== null) {
            switch (a.tag) {
                case 13: return bn === null ? bf() : a.alternate === null && Ie === 0 && (Ie = 3), a.flags &= -257, a.flags |= 65536, a.lanes = h, c === xu ? a.flags |= 16384 : (r = a.updateQueue, r === null ? a.updateQueue = new Set([c]) : r.add(c), Sf(t, c, h)), !1;
                case 22: return a.flags |= 65536, c === xu ? a.flags |= 16384 : (r = a.updateQueue, r === null ? (r = { transitions: null, markerInstances: null, retryQueue: new Set([c]) }, a.updateQueue = r) : (a = r.retryQueue, a === null ? r.retryQueue = new Set([c]) : a.add(c)), Sf(t, c, h)), !1;
            }
            throw Error(s(435, a.tag));
        }
        return Sf(t, c, h), bf(), !1;
    } if (_e)
        return r = Wt.current, r !== null ? ((r.flags & 65536) === 0 && (r.flags |= 256), r.flags |= 65536, r.lanes = h, c !== gu && (t = Error(s(422), { cause: c }), Fr(Ft(t, a)))) : (c !== gu && (r = Error(s(423), { cause: c }), Fr(Ft(r, a))), t = t.current.alternate, t.flags |= 65536, h &= -h, t.lanes |= h, c = Ft(c, a), h = Xu(t.stateNode, c, h), Eu(t, h), Ie !== 4 && (Ie = 2)), !1; var g = Error(s(520), { cause: c }); if (g = Ft(g, a), ma === null ? ma = [g] : ma.push(g), Ie !== 4 && (Ie = 2), r === null)
        return !0; c = Ft(c, a), a = r; do {
        switch (a.tag) {
            case 3: return a.flags |= 65536, t = h & -h, a.lanes |= t, t = Xu(a.stateNode, c, t), Eu(a, t), !1;
            case 1: if (r = a.type, g = a.stateNode, (a.flags & 128) === 0 && (typeof r.getDerivedStateFromError == "function" || g !== null && typeof g.componentDidCatch == "function" && (di === null || !di.has(g))))
                return a.flags |= 65536, h &= -h, a.lanes |= h, h = Bg(h), Ug(h, t, a, c), Eu(a, h), !1;
        }
        a = a.return;
    } while (a !== null); return !1; }
    var zg = Error(s(461)), tt = !1;
    function st(t, r, a, c) { r.child = t === null ? Cg(r, null, a, c) : Is(r, t.child, a, c); }
    function Hg(t, r, a, c, h) { a = a.render; var g = r.ref; if ("ref" in c) {
        var w = {};
        for (var _ in c)
            _ !== "ref" && (w[_] = c[_]);
    }
    else
        w = c; return Gi(r), c = Mu(t, r, a, w, g, h), _ = Ou(), t !== null && !tt ? (Ru(t, r, h), Un(t, r, h)) : (_e && _ && du(r), r.flags |= 1, st(t, r, c, h), r.child); }
    function qg(t, r, a, c, h) { if (t === null) {
        var g = a.type;
        return typeof g == "function" && !uu(g) && g.defaultProps === void 0 && a.compare === null ? (r.tag = 15, r.type = g, $g(t, r, g, c, h)) : (t = Cl(a.type, null, c, r, r.mode, h), t.ref = r.ref, t.return = r, r.child = t);
    } if (g = t.child, !tf(t, h)) {
        var w = g.memoizedProps;
        if (a = a.compare, a = a !== null ? a : Kr, a(w, c) && t.ref === r.ref)
            return Un(t, r, h);
    } return r.flags |= 1, t = Mn(g, c), t.ref = r.ref, t.return = r, r.child = t; }
    function $g(t, r, a, c, h) { if (t !== null) {
        var g = t.memoizedProps;
        if (Kr(g, c) && t.ref === r.ref)
            if (tt = !1, r.pendingProps = c = g, tf(t, h))
                (t.flags & 131072) !== 0 && (tt = !0);
            else
                return r.lanes = t.lanes, Un(t, r, h);
    } return Pu(t, r, a, c, h); }
    function Ig(t, r, a) { var c = r.pendingProps, h = c.children, g = t !== null ? t.memoizedState : null; if (c.mode === "hidden") {
        if ((r.flags & 128) !== 0) {
            if (c = g !== null ? g.baseLanes | a : a, t !== null) {
                for (h = r.child = t.child, g = 0; h !== null;)
                    g = g | h.lanes | h.childLanes, h = h.sibling;
                r.childLanes = g & ~c;
            }
            else
                r.childLanes = 0, r.child = null;
            return Vg(t, r, c, a);
        }
        if ((a & 536870912) !== 0)
            r.memoizedState = { baseLanes: 0, cachePool: null }, t !== null && jl(r, g !== null ? g.cachePool : null), g !== null ? $p(r, g) : Nu(), kg(r);
        else
            return r.lanes = r.childLanes = 536870912, Vg(t, r, g !== null ? g.baseLanes | a : a, a);
    }
    else
        g !== null ? (jl(r, g.cachePool), $p(r, g), li(), r.memoizedState = null) : (t !== null && jl(r, null), Nu(), li()); return st(t, r, h, a), r.child; }
    function Vg(t, r, a, c) { var h = wu(); return h = h === null ? null : { parent: Ze._currentValue, pool: h }, r.memoizedState = { baseLanes: a, cachePool: h }, t !== null && jl(r, null), Nu(), kg(r), t !== null && Qr(t, r, c, !0), null; }
    function Ql(t, r) { var a = r.ref; if (a === null)
        t !== null && t.ref !== null && (r.flags |= 4194816);
    else {
        if (typeof a != "function" && typeof a != "object")
            throw Error(s(284));
        (t === null || t.ref !== a) && (r.flags |= 4194816);
    } }
    function Pu(t, r, a, c, h) { return Gi(r), a = Mu(t, r, a, c, void 0, h), c = Ou(), t !== null && !tt ? (Ru(t, r, h), Un(t, r, h)) : (_e && c && du(r), r.flags |= 1, st(t, r, a, h), r.child); }
    function Gg(t, r, a, c, h, g) { return Gi(r), r.updateQueue = null, a = Vp(r, c, a, h), Ip(t), c = Ou(), t !== null && !tt ? (Ru(t, r, g), Un(t, r, g)) : (_e && c && du(r), r.flags |= 1, st(t, r, a, g), r.child); }
    function Kg(t, r, a, c, h) { if (Gi(r), r.stateNode === null) {
        var g = Rs, w = a.contextType;
        typeof w == "object" && w !== null && (g = ht(w)), g = new a(c, g), r.memoizedState = g.state !== null && g.state !== void 0 ? g.state : null, g.updater = Yu, r.stateNode = g, g._reactInternals = r, g = r.stateNode, g.props = c, g.state = r.memoizedState, g.refs = {}, _u(r), w = a.contextType, g.context = typeof w == "object" && w !== null ? ht(w) : Rs, g.state = r.memoizedState, w = a.getDerivedStateFromProps, typeof w == "function" && (Ku(r, a, w, c), g.state = r.memoizedState), typeof a.getDerivedStateFromProps == "function" || typeof g.getSnapshotBeforeUpdate == "function" || typeof g.UNSAFE_componentWillMount != "function" && typeof g.componentWillMount != "function" || (w = g.state, typeof g.componentWillMount == "function" && g.componentWillMount(), typeof g.UNSAFE_componentWillMount == "function" && g.UNSAFE_componentWillMount(), w !== g.state && Yu.enqueueReplaceState(g, g.state, null), ia(r, c, g, h), na(), g.state = r.memoizedState), typeof g.componentDidMount == "function" && (r.flags |= 4194308), c = !0;
    }
    else if (t === null) {
        g = r.stateNode;
        var _ = r.memoizedProps, A = Xi(a, _);
        g.props = A;
        var D = g.context, K = a.contextType;
        w = Rs, typeof K == "object" && K !== null && (w = ht(K));
        var X = a.getDerivedStateFromProps;
        K = typeof X == "function" || typeof g.getSnapshotBeforeUpdate == "function", _ = r.pendingProps !== _, K || typeof g.UNSAFE_componentWillReceiveProps != "function" && typeof g.componentWillReceiveProps != "function" || (_ || D !== w) && Og(r, g, c, w), ni = !1;
        var B = r.memoizedState;
        g.state = B, ia(r, c, g, h), na(), D = r.memoizedState, _ || B !== D || ni ? (typeof X == "function" && (Ku(r, a, X, c), D = r.memoizedState), (A = ni || Mg(r, a, A, c, B, D, w)) ? (K || typeof g.UNSAFE_componentWillMount != "function" && typeof g.componentWillMount != "function" || (typeof g.componentWillMount == "function" && g.componentWillMount(), typeof g.UNSAFE_componentWillMount == "function" && g.UNSAFE_componentWillMount()), typeof g.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof g.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = c, r.memoizedState = D), g.props = c, g.state = D, g.context = w, c = A) : (typeof g.componentDidMount == "function" && (r.flags |= 4194308), c = !1);
    }
    else {
        g = r.stateNode, Tu(t, r), w = r.memoizedProps, K = Xi(a, w), g.props = K, X = r.pendingProps, B = g.context, D = a.contextType, A = Rs, typeof D == "object" && D !== null && (A = ht(D)), _ = a.getDerivedStateFromProps, (D = typeof _ == "function" || typeof g.getSnapshotBeforeUpdate == "function") || typeof g.UNSAFE_componentWillReceiveProps != "function" && typeof g.componentWillReceiveProps != "function" || (w !== X || B !== A) && Og(r, g, c, A), ni = !1, B = r.memoizedState, g.state = B, ia(r, c, g, h), na();
        var U = r.memoizedState;
        w !== X || B !== U || ni || t !== null && t.dependencies !== null && Ol(t.dependencies) ? (typeof _ == "function" && (Ku(r, a, _, c), U = r.memoizedState), (K = ni || Mg(r, a, K, c, B, U, A) || t !== null && t.dependencies !== null && Ol(t.dependencies)) ? (D || typeof g.UNSAFE_componentWillUpdate != "function" && typeof g.componentWillUpdate != "function" || (typeof g.componentWillUpdate == "function" && g.componentWillUpdate(c, U, A), typeof g.UNSAFE_componentWillUpdate == "function" && g.UNSAFE_componentWillUpdate(c, U, A)), typeof g.componentDidUpdate == "function" && (r.flags |= 4), typeof g.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof g.componentDidUpdate != "function" || w === t.memoizedProps && B === t.memoizedState || (r.flags |= 4), typeof g.getSnapshotBeforeUpdate != "function" || w === t.memoizedProps && B === t.memoizedState || (r.flags |= 1024), r.memoizedProps = c, r.memoizedState = U), g.props = c, g.state = U, g.context = A, c = K) : (typeof g.componentDidUpdate != "function" || w === t.memoizedProps && B === t.memoizedState || (r.flags |= 4), typeof g.getSnapshotBeforeUpdate != "function" || w === t.memoizedProps && B === t.memoizedState || (r.flags |= 1024), c = !1);
    } return g = c, Ql(t, r), c = (r.flags & 128) !== 0, g || c ? (g = r.stateNode, a = c && typeof a.getDerivedStateFromError != "function" ? null : g.render(), r.flags |= 1, t !== null && c ? (r.child = Is(r, t.child, null, h), r.child = Is(r, null, a, h)) : st(t, r, a, h), r.memoizedState = g.state, t = r.child) : t = Un(t, r, h), t; }
    function Yg(t, r, a, c) { return Pr(), r.flags |= 256, st(t, r, a, c), r.child; }
    var Fu = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
    function Qu(t) { return { baseLanes: t, cachePool: jp() }; }
    function Zu(t, r, a) { return t = t !== null ? t.childLanes & ~a : 0, r && (t |= en), t; }
    function Xg(t, r, a) { var c = r.pendingProps, h = !1, g = (r.flags & 128) !== 0, w; if ((w = g) || (w = t !== null && t.memoizedState === null ? !1 : (Je.current & 2) !== 0), w && (h = !0, r.flags &= -129), w = (r.flags & 32) !== 0, r.flags &= -33, t === null) {
        if (_e) {
            if (h ? ai(r) : li(), _e) {
                var _ = $e, A;
                if (A = _) {
                    e: {
                        for (A = _, _ = yn; A.nodeType !== 8;) {
                            if (!_) {
                                _ = null;
                                break e;
                            }
                            if (A = dn(A.nextSibling), A === null) {
                                _ = null;
                                break e;
                            }
                        }
                        _ = A;
                    }
                    _ !== null ? (r.memoizedState = { dehydrated: _, treeContext: Hi !== null ? { id: On, overflow: Rn } : null, retryLane: 536870912, hydrationErrors: null }, A = Ut(18, null, null, 0), A.stateNode = _, A.return = r, r.child = A, St = r, $e = null, A = !0) : A = !1;
                }
                A || Ii(r);
            }
            if (_ = r.memoizedState, _ !== null && (_ = _.dehydrated, _ !== null))
                return Df(_) ? r.lanes = 32 : r.lanes = 536870912, null;
            Bn(r);
        }
        return _ = c.children, c = c.fallback, h ? (li(), h = r.mode, _ = Zl({ mode: "hidden", children: _ }, h), c = zi(c, h, a, null), _.return = r, c.return = r, _.sibling = c, r.child = _, h = r.child, h.memoizedState = Qu(a), h.childLanes = Zu(t, w, a), r.memoizedState = Fu, c) : (ai(r), Ju(r, _));
    } if (A = t.memoizedState, A !== null && (_ = A.dehydrated, _ !== null)) {
        if (g)
            r.flags & 256 ? (ai(r), r.flags &= -257, r = Wu(t, r, a)) : r.memoizedState !== null ? (li(), r.child = t.child, r.flags |= 128, r = null) : (li(), h = c.fallback, _ = r.mode, c = Zl({ mode: "visible", children: c.children }, _), h = zi(h, _, a, null), h.flags |= 2, c.return = r, h.return = r, c.sibling = h, r.child = c, Is(r, t.child, null, a), c = r.child, c.memoizedState = Qu(a), c.childLanes = Zu(t, w, a), r.memoizedState = Fu, r = h);
        else if (ai(r), Df(_)) {
            if (w = _.nextSibling && _.nextSibling.dataset, w)
                var D = w.dgst;
            w = D, c = Error(s(419)), c.stack = "", c.digest = w, Fr({ value: c, source: null, stack: null }), r = Wu(t, r, a);
        }
        else if (tt || Qr(t, r, a, !1), w = (a & t.childLanes) !== 0, tt || w) {
            if (w = je, w !== null && (c = a & -a, c = (c & 42) !== 0 ? 1 : Dc(c), c = (c & (w.suspendedLanes | a)) !== 0 ? 0 : c, c !== 0 && c !== A.retryLane))
                throw A.retryLane = c, Os(t, c), It(w, t, c), zg;
            _.data === "$?" || bf(), r = Wu(t, r, a);
        }
        else
            _.data === "$?" ? (r.flags |= 192, r.child = t.child, r = null) : (t = A.treeContext, $e = dn(_.nextSibling), St = r, _e = !0, $i = null, yn = !1, t !== null && (Zt[Jt++] = On, Zt[Jt++] = Rn, Zt[Jt++] = Hi, On = t.id, Rn = t.overflow, Hi = r), r = Ju(r, c.children), r.flags |= 4096);
        return r;
    } return h ? (li(), h = c.fallback, _ = r.mode, A = t.child, D = A.sibling, c = Mn(A, { mode: "hidden", children: c.children }), c.subtreeFlags = A.subtreeFlags & 65011712, D !== null ? h = Mn(D, h) : (h = zi(h, _, a, null), h.flags |= 2), h.return = r, c.return = r, c.sibling = h, r.child = c, c = h, h = r.child, _ = t.child.memoizedState, _ === null ? _ = Qu(a) : (A = _.cachePool, A !== null ? (D = Ze._currentValue, A = A.parent !== D ? { parent: D, pool: D } : A) : A = jp(), _ = { baseLanes: _.baseLanes | a, cachePool: A }), h.memoizedState = _, h.childLanes = Zu(t, w, a), r.memoizedState = Fu, c) : (ai(r), a = t.child, t = a.sibling, a = Mn(a, { mode: "visible", children: c.children }), a.return = r, a.sibling = null, t !== null && (w = r.deletions, w === null ? (r.deletions = [t], r.flags |= 16) : w.push(t)), r.child = a, r.memoizedState = null, a); }
    function Ju(t, r) { return r = Zl({ mode: "visible", children: r }, t.mode), r.return = t, t.child = r; }
    function Zl(t, r) { return t = Ut(22, t, null, r), t.lanes = 0, t.stateNode = { _visibility: 1, _pendingMarkers: null, _retryCache: null, _transitions: null }, t; }
    function Wu(t, r, a) { return Is(r, t.child, null, a), t = Ju(r, r.pendingProps.children), t.flags |= 2, r.memoizedState = null, t; }
    function Pg(t, r, a) { t.lanes |= r; var c = t.alternate; c !== null && (c.lanes |= r), yu(t.return, r, a); }
    function ef(t, r, a, c, h) { var g = t.memoizedState; g === null ? t.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: c, tail: a, tailMode: h } : (g.isBackwards = r, g.rendering = null, g.renderingStartTime = 0, g.last = c, g.tail = a, g.tailMode = h); }
    function Fg(t, r, a) { var c = r.pendingProps, h = c.revealOrder, g = c.tail; if (st(t, r, c.children, a), c = Je.current, (c & 2) !== 0)
        c = c & 1 | 2, r.flags |= 128;
    else {
        if (t !== null && (t.flags & 128) !== 0)
            e: for (t = r.child; t !== null;) {
                if (t.tag === 13)
                    t.memoizedState !== null && Pg(t, a, r);
                else if (t.tag === 19)
                    Pg(t, a, r);
                else if (t.child !== null) {
                    t.child.return = t, t = t.child;
                    continue;
                }
                if (t === r)
                    break e;
                for (; t.sibling === null;) {
                    if (t.return === null || t.return === r)
                        break e;
                    t = t.return;
                }
                t.sibling.return = t.return, t = t.sibling;
            }
        c &= 1;
    } switch (J(Je, c), h) {
        case "forwards":
            for (a = r.child, h = null; a !== null;)
                t = a.alternate, t !== null && Xl(t) === null && (h = a), a = a.sibling;
            a = h, a === null ? (h = r.child, r.child = null) : (h = a.sibling, a.sibling = null), ef(r, !1, h, a, g);
            break;
        case "backwards":
            for (a = null, h = r.child, r.child = null; h !== null;) {
                if (t = h.alternate, t !== null && Xl(t) === null) {
                    r.child = h;
                    break;
                }
                t = h.sibling, h.sibling = a, a = h, h = t;
            }
            ef(r, !0, a, null, g);
            break;
        case "together":
            ef(r, !1, null, null, void 0);
            break;
        default: r.memoizedState = null;
    } return r.child; }
    function Un(t, r, a) { if (t !== null && (r.dependencies = t.dependencies), hi |= r.lanes, (a & r.childLanes) === 0)
        if (t !== null) {
            if (Qr(t, r, a, !1), (a & r.childLanes) === 0)
                return null;
        }
        else
            return null; if (t !== null && r.child !== t.child)
        throw Error(s(153)); if (r.child !== null) {
        for (t = r.child, a = Mn(t, t.pendingProps), r.child = a, a.return = r; t.sibling !== null;)
            t = t.sibling, a = a.sibling = Mn(t, t.pendingProps), a.return = r;
        a.sibling = null;
    } return r.child; }
    function tf(t, r) { return (t.lanes & r) !== 0 ? !0 : (t = t.dependencies, !!(t !== null && Ol(t))); }
    function Rw(t, r, a) { switch (r.tag) {
        case 3:
            Ne(r, r.stateNode.containerInfo), ti(r, Ze, t.memoizedState.cache), Pr();
            break;
        case 27:
        case 5:
            jr(r);
            break;
        case 4:
            Ne(r, r.stateNode.containerInfo);
            break;
        case 10:
            ti(r, r.type, r.memoizedProps.value);
            break;
        case 13:
            var c = r.memoizedState;
            if (c !== null)
                return c.dehydrated !== null ? (ai(r), r.flags |= 128, null) : (a & r.child.childLanes) !== 0 ? Xg(t, r, a) : (ai(r), t = Un(t, r, a), t !== null ? t.sibling : null);
            ai(r);
            break;
        case 19:
            var h = (t.flags & 128) !== 0;
            if (c = (a & r.childLanes) !== 0, c || (Qr(t, r, a, !1), c = (a & r.childLanes) !== 0), h) {
                if (c)
                    return Fg(t, r, a);
                r.flags |= 128;
            }
            if (h = r.memoizedState, h !== null && (h.rendering = null, h.tail = null, h.lastEffect = null), J(Je, Je.current), c)
                break;
            return null;
        case 22:
        case 23: return r.lanes = 0, Ig(t, r, a);
        case 24: ti(r, Ze, t.memoizedState.cache);
    } return Un(t, r, a); }
    function Qg(t, r, a) { if (t !== null)
        if (t.memoizedProps !== r.pendingProps)
            tt = !0;
        else {
            if (!tf(t, a) && (r.flags & 128) === 0)
                return tt = !1, Rw(t, r, a);
            tt = (t.flags & 131072) !== 0;
        }
    else
        tt = !1, _e && (r.flags & 1048576) !== 0 && Ap(r, Ml, r.index); switch (r.lanes = 0, r.tag) {
        case 16:
            e: {
                t = r.pendingProps;
                var c = r.elementType, h = c._init;
                if (c = h(c._payload), r.type = c, typeof c == "function")
                    uu(c) ? (t = Xi(c, t), r.tag = 1, r = Kg(null, r, c, t, a)) : (r.tag = 0, r = Pu(null, r, c, t, a));
                else {
                    if (c != null) {
                        if (h = c.$$typeof, h === V) {
                            r.tag = 11, r = Hg(null, r, c, t, a);
                            break e;
                        }
                        else if (h === Z) {
                            r.tag = 14, r = qg(null, r, c, t, a);
                            break e;
                        }
                    }
                    throw r = ee(c) || c, Error(s(306, r, ""));
                }
            }
            return r;
        case 0: return Pu(t, r, r.type, r.pendingProps, a);
        case 1: return c = r.type, h = Xi(c, r.pendingProps), Kg(t, r, c, h, a);
        case 3:
            e: {
                if (Ne(r, r.stateNode.containerInfo), t === null)
                    throw Error(s(387));
                c = r.pendingProps;
                var g = r.memoizedState;
                h = g.element, Tu(t, r), ia(r, c, null, a);
                var w = r.memoizedState;
                if (c = w.cache, ti(r, Ze, c), c !== g.cache && bu(r, [Ze], a, !0), na(), c = w.element, g.isDehydrated)
                    if (g = { element: c, isDehydrated: !1, cache: w.cache }, r.updateQueue.baseState = g, r.memoizedState = g, r.flags & 256) {
                        r = Yg(t, r, c, a);
                        break e;
                    }
                    else if (c !== h) {
                        h = Ft(Error(s(424)), r), Fr(h), r = Yg(t, r, c, a);
                        break e;
                    }
                    else {
                        switch (t = r.stateNode.containerInfo, t.nodeType) {
                            case 9:
                                t = t.body;
                                break;
                            default: t = t.nodeName === "HTML" ? t.ownerDocument.body : t;
                        }
                        for ($e = dn(t.firstChild), St = r, _e = !0, $i = null, yn = !0, a = Cg(r, null, c, a), r.child = a; a;)
                            a.flags = a.flags & -3 | 4096, a = a.sibling;
                    }
                else {
                    if (Pr(), c === h) {
                        r = Un(t, r, a);
                        break e;
                    }
                    st(t, r, c, a);
                }
                r = r.child;
            }
            return r;
        case 26: return Ql(t, r), t === null ? (a = ey(r.type, null, r.pendingProps, null)) ? r.memoizedState = a : _e || (a = r.type, t = r.pendingProps, c = fo(te.current).createElement(a), c[ft] = r, c[Et] = t, at(c, a, t), et(c), r.stateNode = c) : r.memoizedState = ey(r.type, t.memoizedProps, r.pendingProps, t.memoizedState), null;
        case 27: return jr(r), t === null && _e && (c = r.stateNode = Zm(r.type, r.pendingProps, te.current), St = r, yn = !0, h = $e, mi(r.type) ? (Bf = h, $e = dn(c.firstChild)) : $e = h), st(t, r, r.pendingProps.children, a), Ql(t, r), t === null && (r.flags |= 4194304), r.child;
        case 5: return t === null && _e && ((h = c = $e) && (c = a1(c, r.type, r.pendingProps, yn), c !== null ? (r.stateNode = c, St = r, $e = dn(c.firstChild), yn = !1, h = !0) : h = !1), h || Ii(r)), jr(r), h = r.type, g = r.pendingProps, w = t !== null ? t.memoizedProps : null, c = g.children, Rf(h, g) ? c = null : w !== null && Rf(h, w) && (r.flags |= 32), r.memoizedState !== null && (h = Mu(t, r, Tw, null, null, a), Ea._currentValue = h), Ql(t, r), st(t, r, c, a), r.child;
        case 6: return t === null && _e && ((t = a = $e) && (a = l1(a, r.pendingProps, yn), a !== null ? (r.stateNode = a, St = r, $e = null, t = !0) : t = !1), t || Ii(r)), null;
        case 13: return Xg(t, r, a);
        case 4: return Ne(r, r.stateNode.containerInfo), c = r.pendingProps, t === null ? r.child = Is(r, null, c, a) : st(t, r, c, a), r.child;
        case 11: return Hg(t, r, r.type, r.pendingProps, a);
        case 7: return st(t, r, r.pendingProps, a), r.child;
        case 8: return st(t, r, r.pendingProps.children, a), r.child;
        case 12: return st(t, r, r.pendingProps.children, a), r.child;
        case 10: return c = r.pendingProps, ti(r, r.type, c.value), st(t, r, c.children, a), r.child;
        case 9: return h = r.type._context, c = r.pendingProps.children, Gi(r), h = ht(h), c = c(h), r.flags |= 1, st(t, r, c, a), r.child;
        case 14: return qg(t, r, r.type, r.pendingProps, a);
        case 15: return $g(t, r, r.type, r.pendingProps, a);
        case 19: return Fg(t, r, a);
        case 31: return c = r.pendingProps, a = r.mode, c = { mode: c.mode, children: c.children }, t === null ? (a = Zl(c, a), a.ref = r.ref, r.child = a, a.return = r, r = a) : (a = Mn(t.child, c), a.ref = r.ref, r.child = a, a.return = r, r = a), r;
        case 22: return Ig(t, r, a);
        case 24: return Gi(r), c = ht(Ze), t === null ? (h = wu(), h === null && (h = je, g = vu(), h.pooledCache = g, g.refCount++, g !== null && (h.pooledCacheLanes |= a), h = g), r.memoizedState = { parent: c, cache: h }, _u(r), ti(r, Ze, h)) : ((t.lanes & a) !== 0 && (Tu(t, r), ia(r, null, null, a), na()), h = t.memoizedState, g = r.memoizedState, h.parent !== c ? (h = { parent: c, cache: c }, r.memoizedState = h, r.lanes === 0 && (r.memoizedState = r.updateQueue.baseState = h), ti(r, Ze, c)) : (c = g.cache, ti(r, Ze, c), c !== h.cache && bu(r, [Ze], a, !0))), st(t, r, r.pendingProps.children, a), r.child;
        case 29: throw r.pendingProps;
    } throw Error(s(156, r.tag)); }
    function zn(t) { t.flags |= 4; }
    function Zg(t, r) { if (r.type !== "stylesheet" || (r.state.loading & 4) !== 0)
        t.flags &= -16777217;
    else if (t.flags |= 16777216, !ry(r)) {
        if (r = Wt.current, r !== null && ((Se & 4194048) === Se ? bn !== null : (Se & 62914560) !== Se && (Se & 536870912) === 0 || r !== bn))
            throw ea = xu, Lp;
        t.flags |= 8192;
    } }
    function Jl(t, r) { r !== null && (t.flags |= 4), t.flags & 16384 && (r = t.tag !== 22 ? Jn() : 536870912, t.lanes |= r, Ys |= r); }
    function ua(t, r) { if (!_e)
        switch (t.tailMode) {
            case "hidden":
                r = t.tail;
                for (var a = null; r !== null;)
                    r.alternate !== null && (a = r), r = r.sibling;
                a === null ? t.tail = null : a.sibling = null;
                break;
            case "collapsed":
                a = t.tail;
                for (var c = null; a !== null;)
                    a.alternate !== null && (c = a), a = a.sibling;
                c === null ? r || t.tail === null ? t.tail = null : t.tail.sibling = null : c.sibling = null;
        } }
    function Ue(t) { var r = t.alternate !== null && t.alternate.child === t.child, a = 0, c = 0; if (r)
        for (var h = t.child; h !== null;)
            a |= h.lanes | h.childLanes, c |= h.subtreeFlags & 65011712, c |= h.flags & 65011712, h.return = t, h = h.sibling;
    else
        for (h = t.child; h !== null;)
            a |= h.lanes | h.childLanes, c |= h.subtreeFlags, c |= h.flags, h.return = t, h = h.sibling; return t.subtreeFlags |= c, t.childLanes = a, r; }
    function jw(t, r, a) { var c = r.pendingProps; switch (pu(r), r.tag) {
        case 31:
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14: return Ue(r), null;
        case 1: return Ue(r), null;
        case 3: return a = r.stateNode, c = null, t !== null && (c = t.memoizedState.cache), r.memoizedState.cache !== c && (r.flags |= 2048), Ln(Ze), Gt(), a.pendingContext && (a.context = a.pendingContext, a.pendingContext = null), (t === null || t.child === null) && (Xr(r) ? zn(r) : t === null || t.memoizedState.isDehydrated && (r.flags & 256) === 0 || (r.flags |= 1024, kp())), Ue(r), null;
        case 26: return a = r.memoizedState, t === null ? (zn(r), a !== null ? (Ue(r), Zg(r, a)) : (Ue(r), r.flags &= -16777217)) : a ? a !== t.memoizedState ? (zn(r), Ue(r), Zg(r, a)) : (Ue(r), r.flags &= -16777217) : (t.memoizedProps !== c && zn(r), Ue(r), r.flags &= -16777217), null;
        case 27:
            En(r), a = te.current;
            var h = r.type;
            if (t !== null && r.stateNode != null)
                t.memoizedProps !== c && zn(r);
            else {
                if (!c) {
                    if (r.stateNode === null)
                        throw Error(s(166));
                    return Ue(r), null;
                }
                t = ae.current, Xr(r) ? Np(r) : (t = Zm(h, c, a), r.stateNode = t, zn(r));
            }
            return Ue(r), null;
        case 5:
            if (En(r), a = r.type, t !== null && r.stateNode != null)
                t.memoizedProps !== c && zn(r);
            else {
                if (!c) {
                    if (r.stateNode === null)
                        throw Error(s(166));
                    return Ue(r), null;
                }
                if (t = ae.current, Xr(r))
                    Np(r);
                else {
                    switch (h = fo(te.current), t) {
                        case 1:
                            t = h.createElementNS("http://www.w3.org/2000/svg", a);
                            break;
                        case 2:
                            t = h.createElementNS("http://www.w3.org/1998/Math/MathML", a);
                            break;
                        default: switch (a) {
                            case "svg":
                                t = h.createElementNS("http://www.w3.org/2000/svg", a);
                                break;
                            case "math":
                                t = h.createElementNS("http://www.w3.org/1998/Math/MathML", a);
                                break;
                            case "script":
                                t = h.createElement("div"), t.innerHTML = "<script><\/script>", t = t.removeChild(t.firstChild);
                                break;
                            case "select":
                                t = typeof c.is == "string" ? h.createElement("select", { is: c.is }) : h.createElement("select"), c.multiple ? t.multiple = !0 : c.size && (t.size = c.size);
                                break;
                            default: t = typeof c.is == "string" ? h.createElement(a, { is: c.is }) : h.createElement(a);
                        }
                    }
                    t[ft] = r, t[Et] = c;
                    e: for (h = r.child; h !== null;) {
                        if (h.tag === 5 || h.tag === 6)
                            t.appendChild(h.stateNode);
                        else if (h.tag !== 4 && h.tag !== 27 && h.child !== null) {
                            h.child.return = h, h = h.child;
                            continue;
                        }
                        if (h === r)
                            break e;
                        for (; h.sibling === null;) {
                            if (h.return === null || h.return === r)
                                break e;
                            h = h.return;
                        }
                        h.sibling.return = h.return, h = h.sibling;
                    }
                    r.stateNode = t;
                    e: switch (at(t, a, c), a) {
                        case "button":
                        case "input":
                        case "select":
                        case "textarea":
                            t = !!c.autoFocus;
                            break e;
                        case "img":
                            t = !0;
                            break e;
                        default: t = !1;
                    }
                    t && zn(r);
                }
            }
            return Ue(r), r.flags &= -16777217, null;
        case 6:
            if (t && r.stateNode != null)
                t.memoizedProps !== c && zn(r);
            else {
                if (typeof c != "string" && r.stateNode === null)
                    throw Error(s(166));
                if (t = te.current, Xr(r)) {
                    if (t = r.stateNode, a = r.memoizedProps, c = null, h = St, h !== null)
                        switch (h.tag) {
                            case 27:
                            case 5: c = h.memoizedProps;
                        }
                    t[ft] = r, t = !!(t.nodeValue === a || c !== null && c.suppressHydrationWarning === !0 || Gm(t.nodeValue, a)), t || Ii(r);
                }
                else
                    t = fo(t).createTextNode(c), t[ft] = r, r.stateNode = t;
            }
            return Ue(r), null;
        case 13:
            if (c = r.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
                if (h = Xr(r), c !== null && c.dehydrated !== null) {
                    if (t === null) {
                        if (!h)
                            throw Error(s(318));
                        if (h = r.memoizedState, h = h !== null ? h.dehydrated : null, !h)
                            throw Error(s(317));
                        h[ft] = r;
                    }
                    else
                        Pr(), (r.flags & 128) === 0 && (r.memoizedState = null), r.flags |= 4;
                    Ue(r), h = !1;
                }
                else
                    h = kp(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = h), h = !0;
                if (!h)
                    return r.flags & 256 ? (Bn(r), r) : (Bn(r), null);
            }
            if (Bn(r), (r.flags & 128) !== 0)
                return r.lanes = a, r;
            if (a = c !== null, t = t !== null && t.memoizedState !== null, a) {
                c = r.child, h = null, c.alternate !== null && c.alternate.memoizedState !== null && c.alternate.memoizedState.cachePool !== null && (h = c.alternate.memoizedState.cachePool.pool);
                var g = null;
                c.memoizedState !== null && c.memoizedState.cachePool !== null && (g = c.memoizedState.cachePool.pool), g !== h && (c.flags |= 2048);
            }
            return a !== t && a && (r.child.flags |= 8192), Jl(r, r.updateQueue), Ue(r), null;
        case 4: return Gt(), t === null && Nf(r.stateNode.containerInfo), Ue(r), null;
        case 10: return Ln(r.type), Ue(r), null;
        case 19:
            if (W(Je), h = r.memoizedState, h === null)
                return Ue(r), null;
            if (c = (r.flags & 128) !== 0, g = h.rendering, g === null)
                if (c)
                    ua(h, !1);
                else {
                    if (Ie !== 0 || t !== null && (t.flags & 128) !== 0)
                        for (t = r.child; t !== null;) {
                            if (g = Xl(t), g !== null) {
                                for (r.flags |= 128, ua(h, !1), t = g.updateQueue, r.updateQueue = t, Jl(r, t), r.subtreeFlags = 0, t = a, a = r.child; a !== null;)
                                    Ep(a, t), a = a.sibling;
                                return J(Je, Je.current & 1 | 2), r.child;
                            }
                            t = t.sibling;
                        }
                    h.tail !== null && Kt() > to && (r.flags |= 128, c = !0, ua(h, !1), r.lanes = 4194304);
                }
            else {
                if (!c)
                    if (t = Xl(g), t !== null) {
                        if (r.flags |= 128, c = !0, t = t.updateQueue, r.updateQueue = t, Jl(r, t), ua(h, !0), h.tail === null && h.tailMode === "hidden" && !g.alternate && !_e)
                            return Ue(r), null;
                    }
                    else
                        2 * Kt() - h.renderingStartTime > to && a !== 536870912 && (r.flags |= 128, c = !0, ua(h, !1), r.lanes = 4194304);
                h.isBackwards ? (g.sibling = r.child, r.child = g) : (t = h.last, t !== null ? t.sibling = g : r.child = g, h.last = g);
            }
            return h.tail !== null ? (r = h.tail, h.rendering = r, h.tail = r.sibling, h.renderingStartTime = Kt(), r.sibling = null, t = Je.current, J(Je, c ? t & 1 | 2 : t & 1), r) : (Ue(r), null);
        case 22:
        case 23: return Bn(r), Cu(), c = r.memoizedState !== null, t !== null ? t.memoizedState !== null !== c && (r.flags |= 8192) : c && (r.flags |= 8192), c ? (a & 536870912) !== 0 && (r.flags & 128) === 0 && (Ue(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : Ue(r), a = r.updateQueue, a !== null && Jl(r, a.retryQueue), a = null, t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), c = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (c = r.memoizedState.cachePool.pool), c !== a && (r.flags |= 2048), t !== null && W(Ki), null;
        case 24: return a = null, t !== null && (a = t.memoizedState.cache), r.memoizedState.cache !== a && (r.flags |= 2048), Ln(Ze), Ue(r), null;
        case 25: return null;
        case 30: return null;
    } throw Error(s(156, r.tag)); }
    function Lw(t, r) { switch (pu(r), r.tag) {
        case 1: return t = r.flags, t & 65536 ? (r.flags = t & -65537 | 128, r) : null;
        case 3: return Ln(Ze), Gt(), t = r.flags, (t & 65536) !== 0 && (t & 128) === 0 ? (r.flags = t & -65537 | 128, r) : null;
        case 26:
        case 27:
        case 5: return En(r), null;
        case 13:
            if (Bn(r), t = r.memoizedState, t !== null && t.dehydrated !== null) {
                if (r.alternate === null)
                    throw Error(s(340));
                Pr();
            }
            return t = r.flags, t & 65536 ? (r.flags = t & -65537 | 128, r) : null;
        case 19: return W(Je), null;
        case 4: return Gt(), null;
        case 10: return Ln(r.type), null;
        case 22:
        case 23: return Bn(r), Cu(), t !== null && W(Ki), t = r.flags, t & 65536 ? (r.flags = t & -65537 | 128, r) : null;
        case 24: return Ln(Ze), null;
        case 25: return null;
        default: return null;
    } }
    function Jg(t, r) { switch (pu(r), r.tag) {
        case 3:
            Ln(Ze), Gt();
            break;
        case 26:
        case 27:
        case 5:
            En(r);
            break;
        case 4:
            Gt();
            break;
        case 13:
            Bn(r);
            break;
        case 19:
            W(Je);
            break;
        case 10:
            Ln(r.type);
            break;
        case 22:
        case 23:
            Bn(r), Cu(), t !== null && W(Ki);
            break;
        case 24: Ln(Ze);
    } }
    function fa(t, r) { try {
        var a = r.updateQueue, c = a !== null ? a.lastEffect : null;
        if (c !== null) {
            var h = c.next;
            a = h;
            do {
                if ((a.tag & t) === t) {
                    c = void 0;
                    var g = a.create, w = a.inst;
                    c = g(), w.destroy = c;
                }
                a = a.next;
            } while (a !== h);
        }
    }
    catch (_) {
        Oe(r, r.return, _);
    } }
    function oi(t, r, a) { try {
        var c = r.updateQueue, h = c !== null ? c.lastEffect : null;
        if (h !== null) {
            var g = h.next;
            c = g;
            do {
                if ((c.tag & t) === t) {
                    var w = c.inst, _ = w.destroy;
                    if (_ !== void 0) {
                        w.destroy = void 0, h = r;
                        var A = a, D = _;
                        try {
                            D();
                        }
                        catch (K) {
                            Oe(h, A, K);
                        }
                    }
                }
                c = c.next;
            } while (c !== g);
        }
    }
    catch (K) {
        Oe(r, r.return, K);
    } }
    function Wg(t) { var r = t.updateQueue; if (r !== null) {
        var a = t.stateNode;
        try {
            qp(r, a);
        }
        catch (c) {
            Oe(t, t.return, c);
        }
    } }
    function em(t, r, a) { a.props = Xi(t.type, t.memoizedProps), a.state = t.memoizedState; try {
        a.componentWillUnmount();
    }
    catch (c) {
        Oe(t, r, c);
    } }
    function ha(t, r) { try {
        var a = t.ref;
        if (a !== null) {
            switch (t.tag) {
                case 26:
                case 27:
                case 5:
                    var c = t.stateNode;
                    break;
                case 30:
                    c = t.stateNode;
                    break;
                default: c = t.stateNode;
            }
            typeof a == "function" ? t.refCleanup = a(c) : a.current = c;
        }
    }
    catch (h) {
        Oe(t, r, h);
    } }
    function vn(t, r) { var a = t.ref, c = t.refCleanup; if (a !== null)
        if (typeof c == "function")
            try {
                c();
            }
            catch (h) {
                Oe(t, r, h);
            }
            finally {
                t.refCleanup = null, t = t.alternate, t != null && (t.refCleanup = null);
            }
        else if (typeof a == "function")
            try {
                a(null);
            }
            catch (h) {
                Oe(t, r, h);
            }
        else
            a.current = null; }
    function tm(t) { var r = t.type, a = t.memoizedProps, c = t.stateNode; try {
        e: switch (r) {
            case "button":
            case "input":
            case "select":
            case "textarea":
                a.autoFocus && c.focus();
                break e;
            case "img": a.src ? c.src = a.src : a.srcSet && (c.srcset = a.srcSet);
        }
    }
    catch (h) {
        Oe(t, t.return, h);
    } }
    function nf(t, r, a) { try {
        var c = t.stateNode;
        t1(c, t.type, a, r), c[Et] = r;
    }
    catch (h) {
        Oe(t, t.return, h);
    } }
    function nm(t) { return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 && mi(t.type) || t.tag === 4; }
    function sf(t) { e: for (;;) {
        for (; t.sibling === null;) {
            if (t.return === null || nm(t.return))
                return null;
            t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18;) {
            if (t.tag === 27 && mi(t.type) || t.flags & 2 || t.child === null || t.tag === 4)
                continue e;
            t.child.return = t, t = t.child;
        }
        if (!(t.flags & 2))
            return t.stateNode;
    } }
    function rf(t, r, a) { var c = t.tag; if (c === 5 || c === 6)
        t = t.stateNode, r ? (a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a).insertBefore(t, r) : (r = a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a, r.appendChild(t), a = a._reactRootContainer, a != null || r.onclick !== null || (r.onclick = uo));
    else if (c !== 4 && (c === 27 && mi(t.type) && (a = t.stateNode, r = null), t = t.child, t !== null))
        for (rf(t, r, a), t = t.sibling; t !== null;)
            rf(t, r, a), t = t.sibling; }
    function Wl(t, r, a) { var c = t.tag; if (c === 5 || c === 6)
        t = t.stateNode, r ? a.insertBefore(t, r) : a.appendChild(t);
    else if (c !== 4 && (c === 27 && mi(t.type) && (a = t.stateNode), t = t.child, t !== null))
        for (Wl(t, r, a), t = t.sibling; t !== null;)
            Wl(t, r, a), t = t.sibling; }
    function im(t) { var r = t.stateNode, a = t.memoizedProps; try {
        for (var c = t.type, h = r.attributes; h.length;)
            r.removeAttributeNode(h[0]);
        at(r, c, a), r[ft] = t, r[Et] = a;
    }
    catch (g) {
        Oe(t, t.return, g);
    } }
    var Hn = !1, Ge = !1, af = !1, sm = typeof WeakSet == "function" ? WeakSet : Set, nt = null;
    function Dw(t, r) { if (t = t.containerInfo, Mf = bo, t = gp(t), iu(t)) {
        if ("selectionStart" in t)
            var a = { start: t.selectionStart, end: t.selectionEnd };
        else
            e: {
                a = (a = t.ownerDocument) && a.defaultView || window;
                var c = a.getSelection && a.getSelection();
                if (c && c.rangeCount !== 0) {
                    a = c.anchorNode;
                    var h = c.anchorOffset, g = c.focusNode;
                    c = c.focusOffset;
                    try {
                        a.nodeType, g.nodeType;
                    }
                    catch {
                        a = null;
                        break e;
                    }
                    var w = 0, _ = -1, A = -1, D = 0, K = 0, X = t, B = null;
                    t: for (;;) {
                        for (var U; X !== a || h !== 0 && X.nodeType !== 3 || (_ = w + h), X !== g || c !== 0 && X.nodeType !== 3 || (A = w + c), X.nodeType === 3 && (w += X.nodeValue.length), (U = X.firstChild) !== null;)
                            B = X, X = U;
                        for (;;) {
                            if (X === t)
                                break t;
                            if (B === a && ++D === h && (_ = w), B === g && ++K === c && (A = w), (U = X.nextSibling) !== null)
                                break;
                            X = B, B = X.parentNode;
                        }
                        X = U;
                    }
                    a = _ === -1 || A === -1 ? null : { start: _, end: A };
                }
                else
                    a = null;
            }
        a = a || { start: 0, end: 0 };
    }
    else
        a = null; for (Of = { focusedElem: t, selectionRange: a }, bo = !1, nt = r; nt !== null;)
        if (r = nt, t = r.child, (r.subtreeFlags & 1024) !== 0 && t !== null)
            t.return = r, nt = t;
        else
            for (; nt !== null;) {
                switch (r = nt, g = r.alternate, t = r.flags, r.tag) {
                    case 0: break;
                    case 11:
                    case 15: break;
                    case 1:
                        if ((t & 1024) !== 0 && g !== null) {
                            t = void 0, a = r, h = g.memoizedProps, g = g.memoizedState, c = a.stateNode;
                            try {
                                var fe = Xi(a.type, h, a.elementType === a.type);
                                t = c.getSnapshotBeforeUpdate(fe, g), c.__reactInternalSnapshotBeforeUpdate = t;
                            }
                            catch (oe) {
                                Oe(a, a.return, oe);
                            }
                        }
                        break;
                    case 3:
                        if ((t & 1024) !== 0) {
                            if (t = r.stateNode.containerInfo, a = t.nodeType, a === 9)
                                Lf(t);
                            else if (a === 1)
                                switch (t.nodeName) {
                                    case "HEAD":
                                    case "HTML":
                                    case "BODY":
                                        Lf(t);
                                        break;
                                    default: t.textContent = "";
                                }
                        }
                        break;
                    case 5:
                    case 26:
                    case 27:
                    case 6:
                    case 4:
                    case 17: break;
                    default: if ((t & 1024) !== 0)
                        throw Error(s(163));
                }
                if (t = r.sibling, t !== null) {
                    t.return = r.return, nt = t;
                    break;
                }
                nt = r.return;
            } }
    function rm(t, r, a) { var c = a.flags; switch (a.tag) {
        case 0:
        case 11:
        case 15:
            ci(t, a), c & 4 && fa(5, a);
            break;
        case 1:
            if (ci(t, a), c & 4)
                if (t = a.stateNode, r === null)
                    try {
                        t.componentDidMount();
                    }
                    catch (w) {
                        Oe(a, a.return, w);
                    }
                else {
                    var h = Xi(a.type, r.memoizedProps);
                    r = r.memoizedState;
                    try {
                        t.componentDidUpdate(h, r, t.__reactInternalSnapshotBeforeUpdate);
                    }
                    catch (w) {
                        Oe(a, a.return, w);
                    }
                }
            c & 64 && Wg(a), c & 512 && ha(a, a.return);
            break;
        case 3:
            if (ci(t, a), c & 64 && (t = a.updateQueue, t !== null)) {
                if (r = null, a.child !== null)
                    switch (a.child.tag) {
                        case 27:
                        case 5:
                            r = a.child.stateNode;
                            break;
                        case 1: r = a.child.stateNode;
                    }
                try {
                    qp(t, r);
                }
                catch (w) {
                    Oe(a, a.return, w);
                }
            }
            break;
        case 27: r === null && c & 4 && im(a);
        case 26:
        case 5:
            ci(t, a), r === null && c & 4 && tm(a), c & 512 && ha(a, a.return);
            break;
        case 12:
            ci(t, a);
            break;
        case 13:
            ci(t, a), c & 4 && om(t, a), c & 64 && (t = a.memoizedState, t !== null && (t = t.dehydrated, t !== null && (a = Gw.bind(null, a), o1(t, a))));
            break;
        case 22:
            if (c = a.memoizedState !== null || Hn, !c) {
                r = r !== null && r.memoizedState !== null || Ge, h = Hn;
                var g = Ge;
                Hn = c, (Ge = r) && !g ? ui(t, a, (a.subtreeFlags & 8772) !== 0) : ci(t, a), Hn = h, Ge = g;
            }
            break;
        case 30: break;
        default: ci(t, a);
    } }
    function am(t) { var r = t.alternate; r !== null && (t.alternate = null, am(r)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (r = t.stateNode, r !== null && zc(r)), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null; }
    var Le = null, Ct = !1;
    function qn(t, r, a) { for (a = a.child; a !== null;)
        lm(t, r, a), a = a.sibling; }
    function lm(t, r, a) { if (ut && typeof ut.onCommitFiberUnmount == "function")
        try {
            ut.onCommitFiberUnmount(Oi, a);
        }
        catch { } switch (a.tag) {
        case 26:
            Ge || vn(a, r), qn(t, r, a), a.memoizedState ? a.memoizedState.count-- : a.stateNode && (a = a.stateNode, a.parentNode.removeChild(a));
            break;
        case 27:
            Ge || vn(a, r);
            var c = Le, h = Ct;
            mi(a.type) && (Le = a.stateNode, Ct = !1), qn(t, r, a), wa(a.stateNode), Le = c, Ct = h;
            break;
        case 5: Ge || vn(a, r);
        case 6:
            if (c = Le, h = Ct, Le = null, qn(t, r, a), Le = c, Ct = h, Le !== null)
                if (Ct)
                    try {
                        (Le.nodeType === 9 ? Le.body : Le.nodeName === "HTML" ? Le.ownerDocument.body : Le).removeChild(a.stateNode);
                    }
                    catch (g) {
                        Oe(a, r, g);
                    }
                else
                    try {
                        Le.removeChild(a.stateNode);
                    }
                    catch (g) {
                        Oe(a, r, g);
                    }
            break;
        case 18:
            Le !== null && (Ct ? (t = Le, Fm(t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t, a.stateNode), ka(t)) : Fm(Le, a.stateNode));
            break;
        case 4:
            c = Le, h = Ct, Le = a.stateNode.containerInfo, Ct = !0, qn(t, r, a), Le = c, Ct = h;
            break;
        case 0:
        case 11:
        case 14:
        case 15:
            Ge || oi(2, a, r), Ge || oi(4, a, r), qn(t, r, a);
            break;
        case 1:
            Ge || (vn(a, r), c = a.stateNode, typeof c.componentWillUnmount == "function" && em(a, r, c)), qn(t, r, a);
            break;
        case 21:
            qn(t, r, a);
            break;
        case 22:
            Ge = (c = Ge) || a.memoizedState !== null, qn(t, r, a), Ge = c;
            break;
        default: qn(t, r, a);
    } }
    function om(t, r) { if (r.memoizedState === null && (t = r.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null))))
        try {
            ka(t);
        }
        catch (a) {
            Oe(r, r.return, a);
        } }
    function Bw(t) { switch (t.tag) {
        case 13:
        case 19:
            var r = t.stateNode;
            return r === null && (r = t.stateNode = new sm), r;
        case 22: return t = t.stateNode, r = t._retryCache, r === null && (r = t._retryCache = new sm), r;
        default: throw Error(s(435, t.tag));
    } }
    function lf(t, r) { var a = Bw(t); r.forEach(function (c) { var h = Kw.bind(null, t, c); a.has(c) || (a.add(c), c.then(h, h)); }); }
    function zt(t, r) { var a = r.deletions; if (a !== null)
        for (var c = 0; c < a.length; c++) {
            var h = a[c], g = t, w = r, _ = w;
            e: for (; _ !== null;) {
                switch (_.tag) {
                    case 27:
                        if (mi(_.type)) {
                            Le = _.stateNode, Ct = !1;
                            break e;
                        }
                        break;
                    case 5:
                        Le = _.stateNode, Ct = !1;
                        break e;
                    case 3:
                    case 4:
                        Le = _.stateNode.containerInfo, Ct = !0;
                        break e;
                }
                _ = _.return;
            }
            if (Le === null)
                throw Error(s(160));
            lm(g, w, h), Le = null, Ct = !1, g = h.alternate, g !== null && (g.return = null), h.return = null;
        } if (r.subtreeFlags & 13878)
        for (r = r.child; r !== null;)
            cm(r, t), r = r.sibling; }
    var hn = null;
    function cm(t, r) { var a = t.alternate, c = t.flags; switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
            zt(r, t), Ht(t), c & 4 && (oi(3, t, t.return), fa(3, t), oi(5, t, t.return));
            break;
        case 1:
            zt(r, t), Ht(t), c & 512 && (Ge || a === null || vn(a, a.return)), c & 64 && Hn && (t = t.updateQueue, t !== null && (c = t.callbacks, c !== null && (a = t.shared.hiddenCallbacks, t.shared.hiddenCallbacks = a === null ? c : a.concat(c))));
            break;
        case 26:
            var h = hn;
            if (zt(r, t), Ht(t), c & 512 && (Ge || a === null || vn(a, a.return)), c & 4) {
                var g = a !== null ? a.memoizedState : null;
                if (c = t.memoizedState, a === null)
                    if (c === null)
                        if (t.stateNode === null) {
                            e: {
                                c = t.type, a = t.memoizedProps, h = h.ownerDocument || h;
                                t: switch (c) {
                                    case "title":
                                        g = h.getElementsByTagName("title")[0], (!g || g[Br] || g[ft] || g.namespaceURI === "http://www.w3.org/2000/svg" || g.hasAttribute("itemprop")) && (g = h.createElement(c), h.head.insertBefore(g, h.querySelector("head > title"))), at(g, c, a), g[ft] = t, et(g), c = g;
                                        break e;
                                    case "link":
                                        var w = iy("link", "href", h).get(c + (a.href || ""));
                                        if (w) {
                                            for (var _ = 0; _ < w.length; _++)
                                                if (g = w[_], g.getAttribute("href") === (a.href == null || a.href === "" ? null : a.href) && g.getAttribute("rel") === (a.rel == null ? null : a.rel) && g.getAttribute("title") === (a.title == null ? null : a.title) && g.getAttribute("crossorigin") === (a.crossOrigin == null ? null : a.crossOrigin)) {
                                                    w.splice(_, 1);
                                                    break t;
                                                }
                                        }
                                        g = h.createElement(c), at(g, c, a), h.head.appendChild(g);
                                        break;
                                    case "meta":
                                        if (w = iy("meta", "content", h).get(c + (a.content || ""))) {
                                            for (_ = 0; _ < w.length; _++)
                                                if (g = w[_], g.getAttribute("content") === (a.content == null ? null : "" + a.content) && g.getAttribute("name") === (a.name == null ? null : a.name) && g.getAttribute("property") === (a.property == null ? null : a.property) && g.getAttribute("http-equiv") === (a.httpEquiv == null ? null : a.httpEquiv) && g.getAttribute("charset") === (a.charSet == null ? null : a.charSet)) {
                                                    w.splice(_, 1);
                                                    break t;
                                                }
                                        }
                                        g = h.createElement(c), at(g, c, a), h.head.appendChild(g);
                                        break;
                                    default: throw Error(s(468, c));
                                }
                                g[ft] = t, et(g), c = g;
                            }
                            t.stateNode = c;
                        }
                        else
                            sy(h, t.type, t.stateNode);
                    else
                        t.stateNode = ny(h, c, t.memoizedProps);
                else
                    g !== c ? (g === null ? a.stateNode !== null && (a = a.stateNode, a.parentNode.removeChild(a)) : g.count--, c === null ? sy(h, t.type, t.stateNode) : ny(h, c, t.memoizedProps)) : c === null && t.stateNode !== null && nf(t, t.memoizedProps, a.memoizedProps);
            }
            break;
        case 27:
            zt(r, t), Ht(t), c & 512 && (Ge || a === null || vn(a, a.return)), a !== null && c & 4 && nf(t, t.memoizedProps, a.memoizedProps);
            break;
        case 5:
            if (zt(r, t), Ht(t), c & 512 && (Ge || a === null || vn(a, a.return)), t.flags & 32) {
                h = t.stateNode;
                try {
                    Ts(h, "");
                }
                catch (U) {
                    Oe(t, t.return, U);
                }
            }
            c & 4 && t.stateNode != null && (h = t.memoizedProps, nf(t, h, a !== null ? a.memoizedProps : h)), c & 1024 && (af = !0);
            break;
        case 6:
            if (zt(r, t), Ht(t), c & 4) {
                if (t.stateNode === null)
                    throw Error(s(162));
                c = t.memoizedProps, a = t.stateNode;
                try {
                    a.nodeValue = c;
                }
                catch (U) {
                    Oe(t, t.return, U);
                }
            }
            break;
        case 3:
            if (go = null, h = hn, hn = ho(r.containerInfo), zt(r, t), hn = h, Ht(t), c & 4 && a !== null && a.memoizedState.isDehydrated)
                try {
                    ka(r.containerInfo);
                }
                catch (U) {
                    Oe(t, t.return, U);
                }
            af && (af = !1, um(t));
            break;
        case 4:
            c = hn, hn = ho(t.stateNode.containerInfo), zt(r, t), Ht(t), hn = c;
            break;
        case 12:
            zt(r, t), Ht(t);
            break;
        case 13:
            zt(r, t), Ht(t), t.child.flags & 8192 && t.memoizedState !== null != (a !== null && a.memoizedState !== null) && (df = Kt()), c & 4 && (c = t.updateQueue, c !== null && (t.updateQueue = null, lf(t, c)));
            break;
        case 22:
            h = t.memoizedState !== null;
            var A = a !== null && a.memoizedState !== null, D = Hn, K = Ge;
            if (Hn = D || h, Ge = K || A, zt(r, t), Ge = K, Hn = D, Ht(t), c & 8192)
                e: for (r = t.stateNode, r._visibility = h ? r._visibility & -2 : r._visibility | 1, h && (a === null || A || Hn || Ge || Pi(t)), a = null, r = t;;) {
                    if (r.tag === 5 || r.tag === 26) {
                        if (a === null) {
                            A = a = r;
                            try {
                                if (g = A.stateNode, h)
                                    w = g.style, typeof w.setProperty == "function" ? w.setProperty("display", "none", "important") : w.display = "none";
                                else {
                                    _ = A.stateNode;
                                    var X = A.memoizedProps.style, B = X != null && X.hasOwnProperty("display") ? X.display : null;
                                    _.style.display = B == null || typeof B == "boolean" ? "" : ("" + B).trim();
                                }
                            }
                            catch (U) {
                                Oe(A, A.return, U);
                            }
                        }
                    }
                    else if (r.tag === 6) {
                        if (a === null) {
                            A = r;
                            try {
                                A.stateNode.nodeValue = h ? "" : A.memoizedProps;
                            }
                            catch (U) {
                                Oe(A, A.return, U);
                            }
                        }
                    }
                    else if ((r.tag !== 22 && r.tag !== 23 || r.memoizedState === null || r === t) && r.child !== null) {
                        r.child.return = r, r = r.child;
                        continue;
                    }
                    if (r === t)
                        break e;
                    for (; r.sibling === null;) {
                        if (r.return === null || r.return === t)
                            break e;
                        a === r && (a = null), r = r.return;
                    }
                    a === r && (a = null), r.sibling.return = r.return, r = r.sibling;
                }
            c & 4 && (c = t.updateQueue, c !== null && (a = c.retryQueue, a !== null && (c.retryQueue = null, lf(t, a))));
            break;
        case 19:
            zt(r, t), Ht(t), c & 4 && (c = t.updateQueue, c !== null && (t.updateQueue = null, lf(t, c)));
            break;
        case 30: break;
        case 21: break;
        default: zt(r, t), Ht(t);
    } }
    function Ht(t) { var r = t.flags; if (r & 2) {
        try {
            for (var a, c = t.return; c !== null;) {
                if (nm(c)) {
                    a = c;
                    break;
                }
                c = c.return;
            }
            if (a == null)
                throw Error(s(160));
            switch (a.tag) {
                case 27:
                    var h = a.stateNode, g = sf(t);
                    Wl(t, g, h);
                    break;
                case 5:
                    var w = a.stateNode;
                    a.flags & 32 && (Ts(w, ""), a.flags &= -33);
                    var _ = sf(t);
                    Wl(t, _, w);
                    break;
                case 3:
                case 4:
                    var A = a.stateNode.containerInfo, D = sf(t);
                    rf(t, D, A);
                    break;
                default: throw Error(s(161));
            }
        }
        catch (K) {
            Oe(t, t.return, K);
        }
        t.flags &= -3;
    } r & 4096 && (t.flags &= -4097); }
    function um(t) { if (t.subtreeFlags & 1024)
        for (t = t.child; t !== null;) {
            var r = t;
            um(r), r.tag === 5 && r.flags & 1024 && r.stateNode.reset(), t = t.sibling;
        } }
    function ci(t, r) { if (r.subtreeFlags & 8772)
        for (r = r.child; r !== null;)
            rm(t, r.alternate, r), r = r.sibling; }
    function Pi(t) { for (t = t.child; t !== null;) {
        var r = t;
        switch (r.tag) {
            case 0:
            case 11:
            case 14:
            case 15:
                oi(4, r, r.return), Pi(r);
                break;
            case 1:
                vn(r, r.return);
                var a = r.stateNode;
                typeof a.componentWillUnmount == "function" && em(r, r.return, a), Pi(r);
                break;
            case 27: wa(r.stateNode);
            case 26:
            case 5:
                vn(r, r.return), Pi(r);
                break;
            case 22:
                r.memoizedState === null && Pi(r);
                break;
            case 30:
                Pi(r);
                break;
            default: Pi(r);
        }
        t = t.sibling;
    } }
    function ui(t, r, a) { for (a = a && (r.subtreeFlags & 8772) !== 0, r = r.child; r !== null;) {
        var c = r.alternate, h = t, g = r, w = g.flags;
        switch (g.tag) {
            case 0:
            case 11:
            case 15:
                ui(h, g, a), fa(4, g);
                break;
            case 1:
                if (ui(h, g, a), c = g, h = c.stateNode, typeof h.componentDidMount == "function")
                    try {
                        h.componentDidMount();
                    }
                    catch (D) {
                        Oe(c, c.return, D);
                    }
                if (c = g, h = c.updateQueue, h !== null) {
                    var _ = c.stateNode;
                    try {
                        var A = h.shared.hiddenCallbacks;
                        if (A !== null)
                            for (h.shared.hiddenCallbacks = null, h = 0; h < A.length; h++)
                                Hp(A[h], _);
                    }
                    catch (D) {
                        Oe(c, c.return, D);
                    }
                }
                a && w & 64 && Wg(g), ha(g, g.return);
                break;
            case 27: im(g);
            case 26:
            case 5:
                ui(h, g, a), a && c === null && w & 4 && tm(g), ha(g, g.return);
                break;
            case 12:
                ui(h, g, a);
                break;
            case 13:
                ui(h, g, a), a && w & 4 && om(h, g);
                break;
            case 22:
                g.memoizedState === null && ui(h, g, a), ha(g, g.return);
                break;
            case 30: break;
            default: ui(h, g, a);
        }
        r = r.sibling;
    } }
    function of(t, r) { var a = null; t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), t = null, r.memoizedState !== null && r.memoizedState.cachePool !== null && (t = r.memoizedState.cachePool.pool), t !== a && (t != null && t.refCount++, a != null && Zr(a)); }
    function cf(t, r) { t = null, r.alternate !== null && (t = r.alternate.memoizedState.cache), r = r.memoizedState.cache, r !== t && (r.refCount++, t != null && Zr(t)); }
    function Sn(t, r, a, c) { if (r.subtreeFlags & 10256)
        for (r = r.child; r !== null;)
            fm(t, r, a, c), r = r.sibling; }
    function fm(t, r, a, c) { var h = r.flags; switch (r.tag) {
        case 0:
        case 11:
        case 15:
            Sn(t, r, a, c), h & 2048 && fa(9, r);
            break;
        case 1:
            Sn(t, r, a, c);
            break;
        case 3:
            Sn(t, r, a, c), h & 2048 && (t = null, r.alternate !== null && (t = r.alternate.memoizedState.cache), r = r.memoizedState.cache, r !== t && (r.refCount++, t != null && Zr(t)));
            break;
        case 12:
            if (h & 2048) {
                Sn(t, r, a, c), t = r.stateNode;
                try {
                    var g = r.memoizedProps, w = g.id, _ = g.onPostCommit;
                    typeof _ == "function" && _(w, r.alternate === null ? "mount" : "update", t.passiveEffectDuration, -0);
                }
                catch (A) {
                    Oe(r, r.return, A);
                }
            }
            else
                Sn(t, r, a, c);
            break;
        case 13:
            Sn(t, r, a, c);
            break;
        case 23: break;
        case 22:
            g = r.stateNode, w = r.alternate, r.memoizedState !== null ? g._visibility & 2 ? Sn(t, r, a, c) : da(t, r) : g._visibility & 2 ? Sn(t, r, a, c) : (g._visibility |= 2, Vs(t, r, a, c, (r.subtreeFlags & 10256) !== 0)), h & 2048 && of(w, r);
            break;
        case 24:
            Sn(t, r, a, c), h & 2048 && cf(r.alternate, r);
            break;
        default: Sn(t, r, a, c);
    } }
    function Vs(t, r, a, c, h) { for (h = h && (r.subtreeFlags & 10256) !== 0, r = r.child; r !== null;) {
        var g = t, w = r, _ = a, A = c, D = w.flags;
        switch (w.tag) {
            case 0:
            case 11:
            case 15:
                Vs(g, w, _, A, h), fa(8, w);
                break;
            case 23: break;
            case 22:
                var K = w.stateNode;
                w.memoizedState !== null ? K._visibility & 2 ? Vs(g, w, _, A, h) : da(g, w) : (K._visibility |= 2, Vs(g, w, _, A, h)), h && D & 2048 && of(w.alternate, w);
                break;
            case 24:
                Vs(g, w, _, A, h), h && D & 2048 && cf(w.alternate, w);
                break;
            default: Vs(g, w, _, A, h);
        }
        r = r.sibling;
    } }
    function da(t, r) { if (r.subtreeFlags & 10256)
        for (r = r.child; r !== null;) {
            var a = t, c = r, h = c.flags;
            switch (c.tag) {
                case 22:
                    da(a, c), h & 2048 && of(c.alternate, c);
                    break;
                case 24:
                    da(a, c), h & 2048 && cf(c.alternate, c);
                    break;
                default: da(a, c);
            }
            r = r.sibling;
        } }
    var pa = 8192;
    function Gs(t) { if (t.subtreeFlags & pa)
        for (t = t.child; t !== null;)
            hm(t), t = t.sibling; }
    function hm(t) { switch (t.tag) {
        case 26:
            Gs(t), t.flags & pa && t.memoizedState !== null && w1(hn, t.memoizedState, t.memoizedProps);
            break;
        case 5:
            Gs(t);
            break;
        case 3:
        case 4:
            var r = hn;
            hn = ho(t.stateNode.containerInfo), Gs(t), hn = r;
            break;
        case 22:
            t.memoizedState === null && (r = t.alternate, r !== null && r.memoizedState !== null ? (r = pa, pa = 16777216, Gs(t), pa = r) : Gs(t));
            break;
        default: Gs(t);
    } }
    function dm(t) { var r = t.alternate; if (r !== null && (t = r.child, t !== null)) {
        r.child = null;
        do
            r = t.sibling, t.sibling = null, t = r;
        while (t !== null);
    } }
    function ga(t) { var r = t.deletions; if ((t.flags & 16) !== 0) {
        if (r !== null)
            for (var a = 0; a < r.length; a++) {
                var c = r[a];
                nt = c, gm(c, t);
            }
        dm(t);
    } if (t.subtreeFlags & 10256)
        for (t = t.child; t !== null;)
            pm(t), t = t.sibling; }
    function pm(t) { switch (t.tag) {
        case 0:
        case 11:
        case 15:
            ga(t), t.flags & 2048 && oi(9, t, t.return);
            break;
        case 3:
            ga(t);
            break;
        case 12:
            ga(t);
            break;
        case 22:
            var r = t.stateNode;
            t.memoizedState !== null && r._visibility & 2 && (t.return === null || t.return.tag !== 13) ? (r._visibility &= -3, eo(t)) : ga(t);
            break;
        default: ga(t);
    } }
    function eo(t) { var r = t.deletions; if ((t.flags & 16) !== 0) {
        if (r !== null)
            for (var a = 0; a < r.length; a++) {
                var c = r[a];
                nt = c, gm(c, t);
            }
        dm(t);
    } for (t = t.child; t !== null;) {
        switch (r = t, r.tag) {
            case 0:
            case 11:
            case 15:
                oi(8, r, r.return), eo(r);
                break;
            case 22:
                a = r.stateNode, a._visibility & 2 && (a._visibility &= -3, eo(r));
                break;
            default: eo(r);
        }
        t = t.sibling;
    } }
    function gm(t, r) { for (; nt !== null;) {
        var a = nt;
        switch (a.tag) {
            case 0:
            case 11:
            case 15:
                oi(8, a, r);
                break;
            case 23:
            case 22:
                if (a.memoizedState !== null && a.memoizedState.cachePool !== null) {
                    var c = a.memoizedState.cachePool.pool;
                    c != null && c.refCount++;
                }
                break;
            case 24: Zr(a.memoizedState.cache);
        }
        if (c = a.child, c !== null)
            c.return = a, nt = c;
        else
            e: for (a = t; nt !== null;) {
                c = nt;
                var h = c.sibling, g = c.return;
                if (am(c), c === a) {
                    nt = null;
                    break e;
                }
                if (h !== null) {
                    h.return = g, nt = h;
                    break e;
                }
                nt = g;
            }
    } }
    var Uw = { getCacheForType: function (t) { var r = ht(Ze), a = r.data.get(t); return a === void 0 && (a = t(), r.data.set(t, a)), a; } }, zw = typeof WeakMap == "function" ? WeakMap : Map, Ee = 0, je = null, me = null, Se = 0, Ae = 0, qt = null, fi = !1, Ks = !1, uf = !1, $n = 0, Ie = 0, hi = 0, Fi = 0, ff = 0, en = 0, Ys = 0, ma = null, kt = null, hf = !1, df = 0, to = 1 / 0, no = null, di = null, rt = 0, pi = null, Xs = null, Ps = 0, pf = 0, gf = null, mm = null, ya = 0, mf = null;
    function $t() { if ((Ee & 2) !== 0 && Se !== 0)
        return Se & -Se; if (z.T !== null) {
        var t = Ds;
        return t !== 0 ? t : _f();
    } return Rd(); }
    function ym() { en === 0 && (en = (Se & 536870912) === 0 || _e ? ce() : 536870912); var t = Wt.current; return t !== null && (t.flags |= 32), en; }
    function It(t, r, a) { (t === je && (Ae === 2 || Ae === 9) || t.cancelPendingCommit !== null) && (Fs(t, 0), gi(t, Se, en, !1)), Dr(t, a), ((Ee & 2) === 0 || t !== je) && (t === je && ((Ee & 2) === 0 && (Fi |= a), Ie === 4 && gi(t, Se, en, !1)), wn(t)); }
    function bm(t, r, a) { if ((Ee & 6) !== 0)
        throw Error(s(327)); var c = !a && (r & 124) === 0 && (r & t.expiredLanes) === 0 || ji(t, r), h = c ? $w(t, r) : vf(t, r, !0), g = c; do {
        if (h === 0) {
            Ks && !c && gi(t, r, 0, !1);
            break;
        }
        else {
            if (a = t.current.alternate, g && !Hw(a)) {
                h = vf(t, r, !1), g = !1;
                continue;
            }
            if (h === 2) {
                if (g = r, t.errorRecoveryDisabledLanes & g)
                    var w = 0;
                else
                    w = t.pendingLanes & -536870913, w = w !== 0 ? w : w & 536870912 ? 536870912 : 0;
                if (w !== 0) {
                    r = w;
                    e: {
                        var _ = t;
                        h = ma;
                        var A = _.current.memoizedState.isDehydrated;
                        if (A && (Fs(_, w).flags |= 256), w = vf(_, w, !1), w !== 2) {
                            if (uf && !A) {
                                _.errorRecoveryDisabledLanes |= g, Fi |= g, h = 4;
                                break e;
                            }
                            g = kt, kt = h, g !== null && (kt === null ? kt = g : kt.push.apply(kt, g));
                        }
                        h = w;
                    }
                    if (g = !1, h !== 2)
                        continue;
                }
            }
            if (h === 1) {
                Fs(t, 0), gi(t, r, 0, !0);
                break;
            }
            e: {
                switch (c = t, g = h, g) {
                    case 0:
                    case 1: throw Error(s(345));
                    case 4: if ((r & 4194048) !== r)
                        break;
                    case 6:
                        gi(c, r, en, !fi);
                        break e;
                    case 2:
                        kt = null;
                        break;
                    case 3:
                    case 5: break;
                    default: throw Error(s(329));
                }
                if ((r & 62914560) === r && (h = df + 300 - Kt(), 10 < h)) {
                    if (gi(c, r, en, !fi), ms(c, 0, !0) !== 0)
                        break e;
                    c.timeoutHandle = Xm(vm.bind(null, c, a, kt, no, hf, r, en, Fi, Ys, fi, g, 2, -0, 0), h);
                    break e;
                }
                vm(c, a, kt, no, hf, r, en, Fi, Ys, fi, g, 0, -0, 0);
            }
        }
        break;
    } while (!0); wn(t); }
    function vm(t, r, a, c, h, g, w, _, A, D, K, X, B, U) { if (t.timeoutHandle = -1, X = r.subtreeFlags, (X & 8192 || (X & 16785408) === 16785408) && (Ta = { stylesheets: null, count: 0, unsuspend: S1 }, hm(r), X = x1(), X !== null)) {
        t.cancelPendingCommit = X(Am.bind(null, t, r, g, a, c, h, w, _, A, K, 1, B, U)), gi(t, g, w, !D);
        return;
    } Am(t, r, g, a, c, h, w, _, A); }
    function Hw(t) { for (var r = t;;) {
        var a = r.tag;
        if ((a === 0 || a === 11 || a === 15) && r.flags & 16384 && (a = r.updateQueue, a !== null && (a = a.stores, a !== null)))
            for (var c = 0; c < a.length; c++) {
                var h = a[c], g = h.getSnapshot;
                h = h.value;
                try {
                    if (!Bt(g(), h))
                        return !1;
                }
                catch {
                    return !1;
                }
            }
        if (a = r.child, r.subtreeFlags & 16384 && a !== null)
            a.return = r, r = a;
        else {
            if (r === t)
                break;
            for (; r.sibling === null;) {
                if (r.return === null || r.return === t)
                    return !0;
                r = r.return;
            }
            r.sibling.return = r.return, r = r.sibling;
        }
    } return !0; }
    function gi(t, r, a, c) { r &= ~ff, r &= ~Fi, t.suspendedLanes |= r, t.pingedLanes &= ~r, c && (t.warmLanes |= r), c = t.expirationTimes; for (var h = r; 0 < h;) {
        var g = 31 - vt(h), w = 1 << g;
        c[g] = -1, h &= ~w;
    } a !== 0 && Md(t, a, r); }
    function io() { return (Ee & 6) === 0 ? (ba(0), !1) : !0; }
    function yf() { if (me !== null) {
        if (Ae === 0)
            var t = me.return;
        else
            t = me, jn = Vi = null, ju(t), $s = null, oa = 0, t = me;
        for (; t !== null;)
            Jg(t.alternate, t), t = t.return;
        me = null;
    } }
    function Fs(t, r) { var a = t.timeoutHandle; a !== -1 && (t.timeoutHandle = -1, i1(a)), a = t.cancelPendingCommit, a !== null && (t.cancelPendingCommit = null, a()), yf(), je = t, me = a = Mn(t.current, null), Se = r, Ae = 0, qt = null, fi = !1, Ks = ji(t, r), uf = !1, Ys = en = ff = Fi = hi = Ie = 0, kt = ma = null, hf = !1, (r & 8) !== 0 && (r |= r & 32); var c = t.entangledLanes; if (c !== 0)
        for (t = t.entanglements, c &= r; 0 < c;) {
            var h = 31 - vt(c), g = 1 << h;
            r |= t[h], c &= ~g;
        } return $n = r, El(), a; }
    function Sm(t, r) { pe = null, z.H = Gl, r === Wr || r === Ll ? (r = Up(), Ae = 3) : r === Lp ? (r = Up(), Ae = 4) : Ae = r === zg ? 8 : r !== null && typeof r == "object" && typeof r.then == "function" ? 6 : 1, qt = r, me === null && (Ie = 1, Fl(t, Ft(r, t.current))); }
    function wm() { var t = z.H; return z.H = Gl, t === null ? Gl : t; }
    function xm() { var t = z.A; return z.A = Uw, t; }
    function bf() { Ie = 4, fi || (Se & 4194048) !== Se && Wt.current !== null || (Ks = !0), (hi & 134217727) === 0 && (Fi & 134217727) === 0 || je === null || gi(je, Se, en, !1); }
    function vf(t, r, a) { var c = Ee; Ee |= 2; var h = wm(), g = xm(); (je !== t || Se !== r) && (no = null, Fs(t, r)), r = !1; var w = Ie; e: do
        try {
            if (Ae !== 0 && me !== null) {
                var _ = me, A = qt;
                switch (Ae) {
                    case 8:
                        yf(), w = 6;
                        break e;
                    case 3:
                    case 2:
                    case 9:
                    case 6:
                        Wt.current === null && (r = !0);
                        var D = Ae;
                        if (Ae = 0, qt = null, Qs(t, _, A, D), a && Ks) {
                            w = 0;
                            break e;
                        }
                        break;
                    default: D = Ae, Ae = 0, qt = null, Qs(t, _, A, D);
                }
            }
            qw(), w = Ie;
            break;
        }
        catch (K) {
            Sm(t, K);
        }
    while (!0); return r && t.shellSuspendCounter++, jn = Vi = null, Ee = c, z.H = h, z.A = g, me === null && (je = null, Se = 0, El()), w; }
    function qw() { for (; me !== null;)
        _m(me); }
    function $w(t, r) { var a = Ee; Ee |= 2; var c = wm(), h = xm(); je !== t || Se !== r ? (no = null, to = Kt() + 500, Fs(t, r)) : Ks = ji(t, r); e: do
        try {
            if (Ae !== 0 && me !== null) {
                r = me;
                var g = qt;
                t: switch (Ae) {
                    case 1:
                        Ae = 0, qt = null, Qs(t, r, g, 1);
                        break;
                    case 2:
                    case 9:
                        if (Dp(g)) {
                            Ae = 0, qt = null, Tm(r);
                            break;
                        }
                        r = function () { Ae !== 2 && Ae !== 9 || je !== t || (Ae = 7), wn(t); }, g.then(r, r);
                        break e;
                    case 3:
                        Ae = 7;
                        break e;
                    case 4:
                        Ae = 5;
                        break e;
                    case 7:
                        Dp(g) ? (Ae = 0, qt = null, Tm(r)) : (Ae = 0, qt = null, Qs(t, r, g, 7));
                        break;
                    case 5:
                        var w = null;
                        switch (me.tag) {
                            case 26: w = me.memoizedState;
                            case 5:
                            case 27:
                                var _ = me;
                                if (!w || ry(w)) {
                                    Ae = 0, qt = null;
                                    var A = _.sibling;
                                    if (A !== null)
                                        me = A;
                                    else {
                                        var D = _.return;
                                        D !== null ? (me = D, so(D)) : me = null;
                                    }
                                    break t;
                                }
                        }
                        Ae = 0, qt = null, Qs(t, r, g, 5);
                        break;
                    case 6:
                        Ae = 0, qt = null, Qs(t, r, g, 6);
                        break;
                    case 8:
                        yf(), Ie = 6;
                        break e;
                    default: throw Error(s(462));
                }
            }
            Iw();
            break;
        }
        catch (K) {
            Sm(t, K);
        }
    while (!0); return jn = Vi = null, z.H = c, z.A = h, Ee = a, me !== null ? 0 : (je = null, Se = 0, El(), Ie); }
    function Iw() { for (; me !== null && !fl();)
        _m(me); }
    function _m(t) { var r = Qg(t.alternate, t, $n); t.memoizedProps = t.pendingProps, r === null ? so(t) : me = r; }
    function Tm(t) { var r = t, a = r.alternate; switch (r.tag) {
        case 15:
        case 0:
            r = Gg(a, r, r.pendingProps, r.type, void 0, Se);
            break;
        case 11:
            r = Gg(a, r, r.pendingProps, r.type.render, r.ref, Se);
            break;
        case 5: ju(r);
        default: Jg(a, r), r = me = Ep(r, $n), r = Qg(a, r, $n);
    } t.memoizedProps = t.pendingProps, r === null ? so(t) : me = r; }
    function Qs(t, r, a, c) { jn = Vi = null, ju(r), $s = null, oa = 0; var h = r.return; try {
        if (Ow(t, h, r, a, Se)) {
            Ie = 1, Fl(t, Ft(a, t.current)), me = null;
            return;
        }
    }
    catch (g) {
        if (h !== null)
            throw me = h, g;
        Ie = 1, Fl(t, Ft(a, t.current)), me = null;
        return;
    } r.flags & 32768 ? (_e || c === 1 ? t = !0 : Ks || (Se & 536870912) !== 0 ? t = !1 : (fi = t = !0, (c === 2 || c === 9 || c === 3 || c === 6) && (c = Wt.current, c !== null && c.tag === 13 && (c.flags |= 16384))), Em(r, t)) : so(r); }
    function so(t) { var r = t; do {
        if ((r.flags & 32768) !== 0) {
            Em(r, fi);
            return;
        }
        t = r.return;
        var a = jw(r.alternate, r, $n);
        if (a !== null) {
            me = a;
            return;
        }
        if (r = r.sibling, r !== null) {
            me = r;
            return;
        }
        me = r = t;
    } while (r !== null); Ie === 0 && (Ie = 5); }
    function Em(t, r) { do {
        var a = Lw(t.alternate, t);
        if (a !== null) {
            a.flags &= 32767, me = a;
            return;
        }
        if (a = t.return, a !== null && (a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null), !r && (t = t.sibling, t !== null)) {
            me = t;
            return;
        }
        me = t = a;
    } while (t !== null); Ie = 6, me = null; }
    function Am(t, r, a, c, h, g, w, _, A) { t.cancelPendingCommit = null; do
        ro();
    while (rt !== 0); if ((Ee & 6) !== 0)
        throw Error(s(327)); if (r !== null) {
        if (r === t.current)
            throw Error(s(177));
        if (g = r.lanes | r.childLanes, g |= ou, SS(t, a, g, w, _, A), t === je && (me = je = null, Se = 0), Xs = r, pi = t, Ps = a, pf = g, gf = h, mm = c, (r.subtreeFlags & 10256) !== 0 || (r.flags & 10256) !== 0 ? (t.callbackNode = null, t.callbackPriority = 0, Yw(gs, function () { return Om(), null; })) : (t.callbackNode = null, t.callbackPriority = 0), c = (r.flags & 13878) !== 0, (r.subtreeFlags & 13878) !== 0 || c) {
            c = z.T, z.T = null, h = Q.p, Q.p = 2, w = Ee, Ee |= 4;
            try {
                Dw(t, r, a);
            }
            finally {
                Ee = w, Q.p = h, z.T = c;
            }
        }
        rt = 1, Nm(), Cm(), km();
    } }
    function Nm() { if (rt === 1) {
        rt = 0;
        var t = pi, r = Xs, a = (r.flags & 13878) !== 0;
        if ((r.subtreeFlags & 13878) !== 0 || a) {
            a = z.T, z.T = null;
            var c = Q.p;
            Q.p = 2;
            var h = Ee;
            Ee |= 4;
            try {
                cm(r, t);
                var g = Of, w = gp(t.containerInfo), _ = g.focusedElem, A = g.selectionRange;
                if (w !== _ && _ && _.ownerDocument && pp(_.ownerDocument.documentElement, _)) {
                    if (A !== null && iu(_)) {
                        var D = A.start, K = A.end;
                        if (K === void 0 && (K = D), "selectionStart" in _)
                            _.selectionStart = D, _.selectionEnd = Math.min(K, _.value.length);
                        else {
                            var X = _.ownerDocument || document, B = X && X.defaultView || window;
                            if (B.getSelection) {
                                var U = B.getSelection(), fe = _.textContent.length, oe = Math.min(A.start, fe), Me = A.end === void 0 ? oe : Math.min(A.end, fe);
                                !U.extend && oe > Me && (w = Me, Me = oe, oe = w);
                                var O = dp(_, oe), M = dp(_, Me);
                                if (O && M && (U.rangeCount !== 1 || U.anchorNode !== O.node || U.anchorOffset !== O.offset || U.focusNode !== M.node || U.focusOffset !== M.offset)) {
                                    var L = X.createRange();
                                    L.setStart(O.node, O.offset), U.removeAllRanges(), oe > Me ? (U.addRange(L), U.extend(M.node, M.offset)) : (L.setEnd(M.node, M.offset), U.addRange(L));
                                }
                            }
                        }
                    }
                    for (X = [], U = _; U = U.parentNode;)
                        U.nodeType === 1 && X.push({ element: U, left: U.scrollLeft, top: U.scrollTop });
                    for (typeof _.focus == "function" && _.focus(), _ = 0; _ < X.length; _++) {
                        var Y = X[_];
                        Y.element.scrollLeft = Y.left, Y.element.scrollTop = Y.top;
                    }
                }
                bo = !!Mf, Of = Mf = null;
            }
            finally {
                Ee = h, Q.p = c, z.T = a;
            }
        }
        t.current = r, rt = 2;
    } }
    function Cm() { if (rt === 2) {
        rt = 0;
        var t = pi, r = Xs, a = (r.flags & 8772) !== 0;
        if ((r.subtreeFlags & 8772) !== 0 || a) {
            a = z.T, z.T = null;
            var c = Q.p;
            Q.p = 2;
            var h = Ee;
            Ee |= 4;
            try {
                rm(t, r.alternate, r);
            }
            finally {
                Ee = h, Q.p = c, z.T = a;
            }
        }
        rt = 3;
    } }
    function km() { if (rt === 4 || rt === 3) {
        rt = 0, Mc();
        var t = pi, r = Xs, a = Ps, c = mm;
        (r.subtreeFlags & 10256) !== 0 || (r.flags & 10256) !== 0 ? rt = 5 : (rt = 0, Xs = pi = null, Mm(t, t.pendingLanes));
        var h = t.pendingLanes;
        if (h === 0 && (di = null), Bc(a), r = r.stateNode, ut && typeof ut.onCommitFiberRoot == "function")
            try {
                ut.onCommitFiberRoot(Oi, r, void 0, (r.current.flags & 128) === 128);
            }
            catch { }
        if (c !== null) {
            r = z.T, h = Q.p, Q.p = 2, z.T = null;
            try {
                for (var g = t.onRecoverableError, w = 0; w < c.length; w++) {
                    var _ = c[w];
                    g(_.value, { componentStack: _.stack });
                }
            }
            finally {
                z.T = r, Q.p = h;
            }
        }
        (Ps & 3) !== 0 && ro(), wn(t), h = t.pendingLanes, (a & 4194090) !== 0 && (h & 42) !== 0 ? t === mf ? ya++ : (ya = 0, mf = t) : ya = 0, ba(0);
    } }
    function Mm(t, r) { (t.pooledCacheLanes &= r) === 0 && (r = t.pooledCache, r != null && (t.pooledCache = null, Zr(r))); }
    function ro(t) { return Nm(), Cm(), km(), Om(); }
    function Om() { if (rt !== 5)
        return !1; var t = pi, r = pf; pf = 0; var a = Bc(Ps), c = z.T, h = Q.p; try {
        Q.p = 32 > a ? 32 : a, z.T = null, a = gf, gf = null;
        var g = pi, w = Ps;
        if (rt = 0, Xs = pi = null, Ps = 0, (Ee & 6) !== 0)
            throw Error(s(331));
        var _ = Ee;
        if (Ee |= 4, pm(g.current), fm(g, g.current, w, a), Ee = _, ba(0, !1), ut && typeof ut.onPostCommitFiberRoot == "function")
            try {
                ut.onPostCommitFiberRoot(Oi, g);
            }
            catch { }
        return !0;
    }
    finally {
        Q.p = h, z.T = c, Mm(t, r);
    } }
    function Rm(t, r, a) { r = Ft(a, r), r = Xu(t.stateNode, r, 2), t = si(t, r, 2), t !== null && (Dr(t, 2), wn(t)); }
    function Oe(t, r, a) { if (t.tag === 3)
        Rm(t, t, a);
    else
        for (; r !== null;) {
            if (r.tag === 3) {
                Rm(r, t, a);
                break;
            }
            else if (r.tag === 1) {
                var c = r.stateNode;
                if (typeof r.type.getDerivedStateFromError == "function" || typeof c.componentDidCatch == "function" && (di === null || !di.has(c))) {
                    t = Ft(a, t), a = Bg(2), c = si(r, a, 2), c !== null && (Ug(a, c, r, t), Dr(c, 2), wn(c));
                    break;
                }
            }
            r = r.return;
        } }
    function Sf(t, r, a) { var c = t.pingCache; if (c === null) {
        c = t.pingCache = new zw;
        var h = new Set;
        c.set(r, h);
    }
    else
        h = c.get(r), h === void 0 && (h = new Set, c.set(r, h)); h.has(a) || (uf = !0, h.add(a), t = Vw.bind(null, t, r, a), r.then(t, t)); }
    function Vw(t, r, a) { var c = t.pingCache; c !== null && c.delete(r), t.pingedLanes |= t.suspendedLanes & a, t.warmLanes &= ~a, je === t && (Se & a) === a && (Ie === 4 || Ie === 3 && (Se & 62914560) === Se && 300 > Kt() - df ? (Ee & 2) === 0 && Fs(t, 0) : ff |= a, Ys === Se && (Ys = 0)), wn(t); }
    function jm(t, r) { r === 0 && (r = Jn()), t = Os(t, r), t !== null && (Dr(t, r), wn(t)); }
    function Gw(t) { var r = t.memoizedState, a = 0; r !== null && (a = r.retryLane), jm(t, a); }
    function Kw(t, r) { var a = 0; switch (t.tag) {
        case 13:
            var c = t.stateNode, h = t.memoizedState;
            h !== null && (a = h.retryLane);
            break;
        case 19:
            c = t.stateNode;
            break;
        case 22:
            c = t.stateNode._retryCache;
            break;
        default: throw Error(s(314));
    } c !== null && c.delete(r), jm(t, a); }
    function Yw(t, r) { return ds(t, r); }
    var ao = null, Zs = null, wf = !1, lo = !1, xf = !1, Qi = 0;
    function wn(t) { t !== Zs && t.next === null && (Zs === null ? ao = Zs = t : Zs = Zs.next = t), lo = !0, wf || (wf = !0, Pw()); }
    function ba(t, r) { if (!xf && lo) {
        xf = !0;
        do
            for (var a = !1, c = ao; c !== null;) {
                if (t !== 0) {
                    var h = c.pendingLanes;
                    if (h === 0)
                        var g = 0;
                    else {
                        var w = c.suspendedLanes, _ = c.pingedLanes;
                        g = (1 << 31 - vt(42 | t) + 1) - 1, g &= h & ~(w & ~_), g = g & 201326741 ? g & 201326741 | 1 : g ? g | 2 : 0;
                    }
                    g !== 0 && (a = !0, Um(c, g));
                }
                else
                    g = Se, g = ms(c, c === je ? g : 0, c.cancelPendingCommit !== null || c.timeoutHandle !== -1), (g & 3) === 0 || ji(c, g) || (a = !0, Um(c, g));
                c = c.next;
            }
        while (a);
        xf = !1;
    } }
    function Xw() { Lm(); }
    function Lm() { lo = wf = !1; var t = 0; Qi !== 0 && (n1() && (t = Qi), Qi = 0); for (var r = Kt(), a = null, c = ao; c !== null;) {
        var h = c.next, g = Dm(c, r);
        g === 0 ? (c.next = null, a === null ? ao = h : a.next = h, h === null && (Zs = a)) : (a = c, (t !== 0 || (g & 3) !== 0) && (lo = !0)), c = h;
    } ba(t); }
    function Dm(t, r) { for (var a = t.suspendedLanes, c = t.pingedLanes, h = t.expirationTimes, g = t.pendingLanes & -62914561; 0 < g;) {
        var w = 31 - vt(g), _ = 1 << w, A = h[w];
        A === -1 ? ((_ & a) === 0 || (_ & c) !== 0) && (h[w] = dl(_, r)) : A <= r && (t.expiredLanes |= _), g &= ~_;
    } if (r = je, a = Se, a = ms(t, t === r ? a : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1), c = t.callbackNode, a === 0 || t === r && (Ae === 2 || Ae === 9) || t.cancelPendingCommit !== null)
        return c !== null && c !== null && bt(c), t.callbackNode = null, t.callbackPriority = 0; if ((a & 3) === 0 || ji(t, a)) {
        if (r = a & -a, r === t.callbackPriority)
            return r;
        switch (c !== null && bt(c), Bc(a)) {
            case 2:
            case 8:
                a = Mi;
                break;
            case 32:
                a = gs;
                break;
            case 268435456:
                a = hl;
                break;
            default: a = gs;
        }
        return c = Bm.bind(null, t), a = ds(a, c), t.callbackPriority = r, t.callbackNode = a, r;
    } return c !== null && c !== null && bt(c), t.callbackPriority = 2, t.callbackNode = null, 2; }
    function Bm(t, r) { if (rt !== 0 && rt !== 5)
        return t.callbackNode = null, t.callbackPriority = 0, null; var a = t.callbackNode; if (ro() && t.callbackNode !== a)
        return null; var c = Se; return c = ms(t, t === je ? c : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1), c === 0 ? null : (bm(t, c, r), Dm(t, Kt()), t.callbackNode != null && t.callbackNode === a ? Bm.bind(null, t) : null); }
    function Um(t, r) { if (ro())
        return null; bm(t, r, !0); }
    function Pw() { s1(function () { (Ee & 6) !== 0 ? ds(ps, Xw) : Lm(); }); }
    function _f() { return Qi === 0 && (Qi = ce()), Qi; }
    function zm(t) { return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : bl("" + t); }
    function Hm(t, r) { var a = r.ownerDocument.createElement("input"); return a.name = r.name, a.value = r.value, t.id && a.setAttribute("form", t.id), r.parentNode.insertBefore(a, r), t = new FormData(t), a.parentNode.removeChild(a), t; }
    function Fw(t, r, a, c, h) { if (r === "submit" && a && a.stateNode === h) {
        var g = zm((h[Et] || null).action), w = c.submitter;
        w && (r = (r = w[Et] || null) ? zm(r.formAction) : w.getAttribute("formAction"), r !== null && (g = r, w = null));
        var _ = new xl("action", "action", null, c, h);
        t.push({ event: _, listeners: [{ instance: null, listener: function () { if (c.defaultPrevented) {
                        if (Qi !== 0) {
                            var A = w ? Hm(h, w) : new FormData(h);
                            Iu(a, { pending: !0, data: A, method: h.method, action: g }, null, A);
                        }
                    }
                    else
                        typeof g == "function" && (_.preventDefault(), A = w ? Hm(h, w) : new FormData(h), Iu(a, { pending: !0, data: A, method: h.method, action: g }, g, A)); }, currentTarget: h }] });
    } }
    for (var Tf = 0; Tf < lu.length; Tf++) {
        var Ef = lu[Tf], Qw = Ef.toLowerCase(), Zw = Ef[0].toUpperCase() + Ef.slice(1);
        fn(Qw, "on" + Zw);
    }
    fn(bp, "onAnimationEnd"), fn(vp, "onAnimationIteration"), fn(Sp, "onAnimationStart"), fn("dblclick", "onDoubleClick"), fn("focusin", "onFocus"), fn("focusout", "onBlur"), fn(pw, "onTransitionRun"), fn(gw, "onTransitionStart"), fn(mw, "onTransitionCancel"), fn(wp, "onTransitionEnd"), ws("onMouseEnter", ["mouseout", "mouseover"]), ws("onMouseLeave", ["mouseout", "mouseover"]), ws("onPointerEnter", ["pointerout", "pointerover"]), ws("onPointerLeave", ["pointerout", "pointerover"]), Li("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), Li("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), Li("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), Li("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), Li("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), Li("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
    var va = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Jw = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(va));
    function qm(t, r) { r = (r & 4) !== 0; for (var a = 0; a < t.length; a++) {
        var c = t[a], h = c.event;
        c = c.listeners;
        e: {
            var g = void 0;
            if (r)
                for (var w = c.length - 1; 0 <= w; w--) {
                    var _ = c[w], A = _.instance, D = _.currentTarget;
                    if (_ = _.listener, A !== g && h.isPropagationStopped())
                        break e;
                    g = _, h.currentTarget = D;
                    try {
                        g(h);
                    }
                    catch (K) {
                        Pl(K);
                    }
                    h.currentTarget = null, g = A;
                }
            else
                for (w = 0; w < c.length; w++) {
                    if (_ = c[w], A = _.instance, D = _.currentTarget, _ = _.listener, A !== g && h.isPropagationStopped())
                        break e;
                    g = _, h.currentTarget = D;
                    try {
                        g(h);
                    }
                    catch (K) {
                        Pl(K);
                    }
                    h.currentTarget = null, g = A;
                }
        }
    } }
    function ye(t, r) { var a = r[Uc]; a === void 0 && (a = r[Uc] = new Set); var c = t + "__bubble"; a.has(c) || ($m(r, t, 2, !1), a.add(c)); }
    function Af(t, r, a) { var c = 0; r && (c |= 4), $m(a, t, c, r); }
    var oo = "_reactListening" + Math.random().toString(36).slice(2);
    function Nf(t) { if (!t[oo]) {
        t[oo] = !0, Ld.forEach(function (a) { a !== "selectionchange" && (Jw.has(a) || Af(a, !1, t), Af(a, !0, t)); });
        var r = t.nodeType === 9 ? t : t.ownerDocument;
        r === null || r[oo] || (r[oo] = !0, Af("selectionchange", !1, r));
    } }
    function $m(t, r, a, c) { switch (fy(r)) {
        case 2:
            var h = E1;
            break;
        case 8:
            h = A1;
            break;
        default: h = $f;
    } a = h.bind(null, r, a, t), h = void 0, !Pc || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (h = !0), c ? h !== void 0 ? t.addEventListener(r, a, { capture: !0, passive: h }) : t.addEventListener(r, a, !0) : h !== void 0 ? t.addEventListener(r, a, { passive: h }) : t.addEventListener(r, a, !1); }
    function Cf(t, r, a, c, h) { var g = c; if ((r & 1) === 0 && (r & 2) === 0 && c !== null)
        e: for (;;) {
            if (c === null)
                return;
            var w = c.tag;
            if (w === 3 || w === 4) {
                var _ = c.stateNode.containerInfo;
                if (_ === h)
                    break;
                if (w === 4)
                    for (w = c.return; w !== null;) {
                        var A = w.tag;
                        if ((A === 3 || A === 4) && w.stateNode.containerInfo === h)
                            return;
                        w = w.return;
                    }
                for (; _ !== null;) {
                    if (w = bs(_), w === null)
                        return;
                    if (A = w.tag, A === 5 || A === 6 || A === 26 || A === 27) {
                        c = g = w;
                        continue e;
                    }
                    _ = _.parentNode;
                }
            }
            c = c.return;
        } Pd(function () { var D = g, K = Yc(a), X = []; e: {
        var B = xp.get(t);
        if (B !== void 0) {
            var U = xl, fe = t;
            switch (t) {
                case "keypress": if (Sl(a) === 0)
                    break e;
                case "keydown":
                case "keyup":
                    U = YS;
                    break;
                case "focusin":
                    fe = "focus", U = Jc;
                    break;
                case "focusout":
                    fe = "blur", U = Jc;
                    break;
                case "beforeblur":
                case "afterblur":
                    U = Jc;
                    break;
                case "click": if (a.button === 2)
                    break e;
                case "auxclick":
                case "dblclick":
                case "mousedown":
                case "mousemove":
                case "mouseup":
                case "mouseout":
                case "mouseover":
                case "contextmenu":
                    U = Zd;
                    break;
                case "drag":
                case "dragend":
                case "dragenter":
                case "dragexit":
                case "dragleave":
                case "dragover":
                case "dragstart":
                case "drop":
                    U = LS;
                    break;
                case "touchcancel":
                case "touchend":
                case "touchmove":
                case "touchstart":
                    U = FS;
                    break;
                case bp:
                case vp:
                case Sp:
                    U = US;
                    break;
                case wp:
                    U = ZS;
                    break;
                case "scroll":
                case "scrollend":
                    U = RS;
                    break;
                case "wheel":
                    U = WS;
                    break;
                case "copy":
                case "cut":
                case "paste":
                    U = HS;
                    break;
                case "gotpointercapture":
                case "lostpointercapture":
                case "pointercancel":
                case "pointerdown":
                case "pointermove":
                case "pointerout":
                case "pointerover":
                case "pointerup":
                    U = Wd;
                    break;
                case "toggle":
                case "beforetoggle": U = tw;
            }
            var oe = (r & 4) !== 0, Me = !oe && (t === "scroll" || t === "scrollend"), O = oe ? B !== null ? B + "Capture" : null : B;
            oe = [];
            for (var M = D, L; M !== null;) {
                var Y = M;
                if (L = Y.stateNode, Y = Y.tag, Y !== 5 && Y !== 26 && Y !== 27 || L === null || O === null || (Y = zr(M, O), Y != null && oe.push(Sa(M, Y, L))), Me)
                    break;
                M = M.return;
            }
            0 < oe.length && (B = new U(B, fe, null, a, K), X.push({ event: B, listeners: oe }));
        }
    } if ((r & 7) === 0) {
        e: {
            if (B = t === "mouseover" || t === "pointerover", U = t === "mouseout" || t === "pointerout", B && a !== Kc && (fe = a.relatedTarget || a.fromElement) && (bs(fe) || fe[ys]))
                break e;
            if ((U || B) && (B = K.window === K ? K : (B = K.ownerDocument) ? B.defaultView || B.parentWindow : window, U ? (fe = a.relatedTarget || a.toElement, U = D, fe = fe ? bs(fe) : null, fe !== null && (Me = o(fe), oe = fe.tag, fe !== Me || oe !== 5 && oe !== 27 && oe !== 6) && (fe = null)) : (U = null, fe = D), U !== fe)) {
                if (oe = Zd, Y = "onMouseLeave", O = "onMouseEnter", M = "mouse", (t === "pointerout" || t === "pointerover") && (oe = Wd, Y = "onPointerLeave", O = "onPointerEnter", M = "pointer"), Me = U == null ? B : Ur(U), L = fe == null ? B : Ur(fe), B = new oe(Y, M + "leave", U, a, K), B.target = Me, B.relatedTarget = L, Y = null, bs(K) === D && (oe = new oe(O, M + "enter", fe, a, K), oe.target = L, oe.relatedTarget = Me, Y = oe), Me = Y, U && fe)
                    t: {
                        for (oe = U, O = fe, M = 0, L = oe; L; L = Js(L))
                            M++;
                        for (L = 0, Y = O; Y; Y = Js(Y))
                            L++;
                        for (; 0 < M - L;)
                            oe = Js(oe), M--;
                        for (; 0 < L - M;)
                            O = Js(O), L--;
                        for (; M--;) {
                            if (oe === O || O !== null && oe === O.alternate)
                                break t;
                            oe = Js(oe), O = Js(O);
                        }
                        oe = null;
                    }
                else
                    oe = null;
                U !== null && Im(X, B, U, oe, !1), fe !== null && Me !== null && Im(X, Me, fe, oe, !0);
            }
        }
        e: {
            if (B = D ? Ur(D) : window, U = B.nodeName && B.nodeName.toLowerCase(), U === "select" || U === "input" && B.type === "file")
                var ne = lp;
            else if (rp(B))
                if (op)
                    ne = fw;
                else {
                    ne = cw;
                    var ge = ow;
                }
            else
                U = B.nodeName, !U || U.toLowerCase() !== "input" || B.type !== "checkbox" && B.type !== "radio" ? D && Gc(D.elementType) && (ne = lp) : ne = uw;
            if (ne && (ne = ne(t, D))) {
                ap(X, ne, a, K);
                break e;
            }
            ge && ge(t, B, D), t === "focusout" && D && B.type === "number" && D.memoizedProps.value != null && Vc(B, "number", B.value);
        }
        switch (ge = D ? Ur(D) : window, t) {
            case "focusin":
                (rp(ge) || ge.contentEditable === "true") && (Cs = ge, su = D, Yr = null);
                break;
            case "focusout":
                Yr = su = Cs = null;
                break;
            case "mousedown":
                ru = !0;
                break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
                ru = !1, mp(X, a, K);
                break;
            case "selectionchange": if (dw)
                break;
            case "keydown":
            case "keyup": mp(X, a, K);
        }
        var re;
        if (eu)
            e: {
                switch (t) {
                    case "compositionstart":
                        var ue = "onCompositionStart";
                        break e;
                    case "compositionend":
                        ue = "onCompositionEnd";
                        break e;
                    case "compositionupdate":
                        ue = "onCompositionUpdate";
                        break e;
                }
                ue = void 0;
            }
        else
            Ns ? ip(t, a) && (ue = "onCompositionEnd") : t === "keydown" && a.keyCode === 229 && (ue = "onCompositionStart");
        ue && (ep && a.locale !== "ko" && (Ns || ue !== "onCompositionStart" ? ue === "onCompositionEnd" && Ns && (re = Fd()) : (ei = K, Fc = "value" in ei ? ei.value : ei.textContent, Ns = !0)), ge = co(D, ue), 0 < ge.length && (ue = new Jd(ue, t, null, a, K), X.push({ event: ue, listeners: ge }), re ? ue.data = re : (re = sp(a), re !== null && (ue.data = re)))), (re = iw ? sw(t, a) : rw(t, a)) && (ue = co(D, "onBeforeInput"), 0 < ue.length && (ge = new Jd("onBeforeInput", "beforeinput", null, a, K), X.push({ event: ge, listeners: ue }), ge.data = re)), Fw(X, t, D, a, K);
    } qm(X, r); }); }
    function Sa(t, r, a) { return { instance: t, listener: r, currentTarget: a }; }
    function co(t, r) { for (var a = r + "Capture", c = []; t !== null;) {
        var h = t, g = h.stateNode;
        if (h = h.tag, h !== 5 && h !== 26 && h !== 27 || g === null || (h = zr(t, a), h != null && c.unshift(Sa(t, h, g)), h = zr(t, r), h != null && c.push(Sa(t, h, g))), t.tag === 3)
            return c;
        t = t.return;
    } return []; }
    function Js(t) { if (t === null)
        return null; do
        t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27); return t || null; }
    function Im(t, r, a, c, h) { for (var g = r._reactName, w = []; a !== null && a !== c;) {
        var _ = a, A = _.alternate, D = _.stateNode;
        if (_ = _.tag, A !== null && A === c)
            break;
        _ !== 5 && _ !== 26 && _ !== 27 || D === null || (A = D, h ? (D = zr(a, g), D != null && w.unshift(Sa(a, D, A))) : h || (D = zr(a, g), D != null && w.push(Sa(a, D, A)))), a = a.return;
    } w.length !== 0 && t.push({ event: r, listeners: w }); }
    var Ww = /\r\n?/g, e1 = /\u0000|\uFFFD/g;
    function Vm(t) {
        return (typeof t == "string" ? t : "" + t).replace(Ww, `
`).replace(e1, "");
    }
    function Gm(t, r) { return r = Vm(r), Vm(t) === r; }
    function uo() { }
    function ke(t, r, a, c, h, g) { switch (a) {
        case "children":
            typeof c == "string" ? r === "body" || r === "textarea" && c === "" || Ts(t, c) : (typeof c == "number" || typeof c == "bigint") && r !== "body" && Ts(t, "" + c);
            break;
        case "className":
            gl(t, "class", c);
            break;
        case "tabIndex":
            gl(t, "tabindex", c);
            break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
            gl(t, a, c);
            break;
        case "style":
            Yd(t, c, g);
            break;
        case "data": if (r !== "object") {
            gl(t, "data", c);
            break;
        }
        case "src":
        case "href":
            if (c === "" && (r !== "a" || a !== "href")) {
                t.removeAttribute(a);
                break;
            }
            if (c == null || typeof c == "function" || typeof c == "symbol" || typeof c == "boolean") {
                t.removeAttribute(a);
                break;
            }
            c = bl("" + c), t.setAttribute(a, c);
            break;
        case "action":
        case "formAction":
            if (typeof c == "function") {
                t.setAttribute(a, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
                break;
            }
            else
                typeof g == "function" && (a === "formAction" ? (r !== "input" && ke(t, r, "name", h.name, h, null), ke(t, r, "formEncType", h.formEncType, h, null), ke(t, r, "formMethod", h.formMethod, h, null), ke(t, r, "formTarget", h.formTarget, h, null)) : (ke(t, r, "encType", h.encType, h, null), ke(t, r, "method", h.method, h, null), ke(t, r, "target", h.target, h, null)));
            if (c == null || typeof c == "symbol" || typeof c == "boolean") {
                t.removeAttribute(a);
                break;
            }
            c = bl("" + c), t.setAttribute(a, c);
            break;
        case "onClick":
            c != null && (t.onclick = uo);
            break;
        case "onScroll":
            c != null && ye("scroll", t);
            break;
        case "onScrollEnd":
            c != null && ye("scrollend", t);
            break;
        case "dangerouslySetInnerHTML":
            if (c != null) {
                if (typeof c != "object" || !("__html" in c))
                    throw Error(s(61));
                if (a = c.__html, a != null) {
                    if (h.children != null)
                        throw Error(s(60));
                    t.innerHTML = a;
                }
            }
            break;
        case "multiple":
            t.multiple = c && typeof c != "function" && typeof c != "symbol";
            break;
        case "muted":
            t.muted = c && typeof c != "function" && typeof c != "symbol";
            break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "ref": break;
        case "autoFocus": break;
        case "xlinkHref":
            if (c == null || typeof c == "function" || typeof c == "boolean" || typeof c == "symbol") {
                t.removeAttribute("xlink:href");
                break;
            }
            a = bl("" + c), t.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", a);
            break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
            c != null && typeof c != "function" && typeof c != "symbol" ? t.setAttribute(a, "" + c) : t.removeAttribute(a);
            break;
        case "inert":
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope":
            c && typeof c != "function" && typeof c != "symbol" ? t.setAttribute(a, "") : t.removeAttribute(a);
            break;
        case "capture":
        case "download":
            c === !0 ? t.setAttribute(a, "") : c !== !1 && c != null && typeof c != "function" && typeof c != "symbol" ? t.setAttribute(a, c) : t.removeAttribute(a);
            break;
        case "cols":
        case "rows":
        case "size":
        case "span":
            c != null && typeof c != "function" && typeof c != "symbol" && !isNaN(c) && 1 <= c ? t.setAttribute(a, c) : t.removeAttribute(a);
            break;
        case "rowSpan":
        case "start":
            c == null || typeof c == "function" || typeof c == "symbol" || isNaN(c) ? t.removeAttribute(a) : t.setAttribute(a, c);
            break;
        case "popover":
            ye("beforetoggle", t), ye("toggle", t), pl(t, "popover", c);
            break;
        case "xlinkActuate":
            Cn(t, "http://www.w3.org/1999/xlink", "xlink:actuate", c);
            break;
        case "xlinkArcrole":
            Cn(t, "http://www.w3.org/1999/xlink", "xlink:arcrole", c);
            break;
        case "xlinkRole":
            Cn(t, "http://www.w3.org/1999/xlink", "xlink:role", c);
            break;
        case "xlinkShow":
            Cn(t, "http://www.w3.org/1999/xlink", "xlink:show", c);
            break;
        case "xlinkTitle":
            Cn(t, "http://www.w3.org/1999/xlink", "xlink:title", c);
            break;
        case "xlinkType":
            Cn(t, "http://www.w3.org/1999/xlink", "xlink:type", c);
            break;
        case "xmlBase":
            Cn(t, "http://www.w3.org/XML/1998/namespace", "xml:base", c);
            break;
        case "xmlLang":
            Cn(t, "http://www.w3.org/XML/1998/namespace", "xml:lang", c);
            break;
        case "xmlSpace":
            Cn(t, "http://www.w3.org/XML/1998/namespace", "xml:space", c);
            break;
        case "is":
            pl(t, "is", c);
            break;
        case "innerText":
        case "textContent": break;
        default: (!(2 < a.length) || a[0] !== "o" && a[0] !== "O" || a[1] !== "n" && a[1] !== "N") && (a = MS.get(a) || a, pl(t, a, c));
    } }
    function kf(t, r, a, c, h, g) { switch (a) {
        case "style":
            Yd(t, c, g);
            break;
        case "dangerouslySetInnerHTML":
            if (c != null) {
                if (typeof c != "object" || !("__html" in c))
                    throw Error(s(61));
                if (a = c.__html, a != null) {
                    if (h.children != null)
                        throw Error(s(60));
                    t.innerHTML = a;
                }
            }
            break;
        case "children":
            typeof c == "string" ? Ts(t, c) : (typeof c == "number" || typeof c == "bigint") && Ts(t, "" + c);
            break;
        case "onScroll":
            c != null && ye("scroll", t);
            break;
        case "onScrollEnd":
            c != null && ye("scrollend", t);
            break;
        case "onClick":
            c != null && (t.onclick = uo);
            break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "innerHTML":
        case "ref": break;
        case "innerText":
        case "textContent": break;
        default: if (!Dd.hasOwnProperty(a))
            e: {
                if (a[0] === "o" && a[1] === "n" && (h = a.endsWith("Capture"), r = a.slice(2, h ? a.length - 7 : void 0), g = t[Et] || null, g = g != null ? g[a] : null, typeof g == "function" && t.removeEventListener(r, g, h), typeof c == "function")) {
                    typeof g != "function" && g !== null && (a in t ? t[a] = null : t.hasAttribute(a) && t.removeAttribute(a)), t.addEventListener(r, c, h);
                    break e;
                }
                a in t ? t[a] = c : c === !0 ? t.setAttribute(a, "") : pl(t, a, c);
            }
    } }
    function at(t, r, a) { switch (r) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li": break;
        case "img":
            ye("error", t), ye("load", t);
            var c = !1, h = !1, g;
            for (g in a)
                if (a.hasOwnProperty(g)) {
                    var w = a[g];
                    if (w != null)
                        switch (g) {
                            case "src":
                                c = !0;
                                break;
                            case "srcSet":
                                h = !0;
                                break;
                            case "children":
                            case "dangerouslySetInnerHTML": throw Error(s(137, r));
                            default: ke(t, r, g, w, a, null);
                        }
                }
            h && ke(t, r, "srcSet", a.srcSet, a, null), c && ke(t, r, "src", a.src, a, null);
            return;
        case "input":
            ye("invalid", t);
            var _ = g = w = h = null, A = null, D = null;
            for (c in a)
                if (a.hasOwnProperty(c)) {
                    var K = a[c];
                    if (K != null)
                        switch (c) {
                            case "name":
                                h = K;
                                break;
                            case "type":
                                w = K;
                                break;
                            case "checked":
                                A = K;
                                break;
                            case "defaultChecked":
                                D = K;
                                break;
                            case "value":
                                g = K;
                                break;
                            case "defaultValue":
                                _ = K;
                                break;
                            case "children":
                            case "dangerouslySetInnerHTML":
                                if (K != null)
                                    throw Error(s(137, r));
                                break;
                            default: ke(t, r, c, K, a, null);
                        }
                }
            Id(t, g, _, A, D, w, h, !1), ml(t);
            return;
        case "select":
            ye("invalid", t), c = w = g = null;
            for (h in a)
                if (a.hasOwnProperty(h) && (_ = a[h], _ != null))
                    switch (h) {
                        case "value":
                            g = _;
                            break;
                        case "defaultValue":
                            w = _;
                            break;
                        case "multiple": c = _;
                        default: ke(t, r, h, _, a, null);
                    }
            r = g, a = w, t.multiple = !!c, r != null ? _s(t, !!c, r, !1) : a != null && _s(t, !!c, a, !0);
            return;
        case "textarea":
            ye("invalid", t), g = h = c = null;
            for (w in a)
                if (a.hasOwnProperty(w) && (_ = a[w], _ != null))
                    switch (w) {
                        case "value":
                            c = _;
                            break;
                        case "defaultValue":
                            h = _;
                            break;
                        case "children":
                            g = _;
                            break;
                        case "dangerouslySetInnerHTML":
                            if (_ != null)
                                throw Error(s(91));
                            break;
                        default: ke(t, r, w, _, a, null);
                    }
            Gd(t, c, h, g), ml(t);
            return;
        case "option":
            for (A in a)
                if (a.hasOwnProperty(A) && (c = a[A], c != null))
                    switch (A) {
                        case "selected":
                            t.selected = c && typeof c != "function" && typeof c != "symbol";
                            break;
                        default: ke(t, r, A, c, a, null);
                    }
            return;
        case "dialog":
            ye("beforetoggle", t), ye("toggle", t), ye("cancel", t), ye("close", t);
            break;
        case "iframe":
        case "object":
            ye("load", t);
            break;
        case "video":
        case "audio":
            for (c = 0; c < va.length; c++)
                ye(va[c], t);
            break;
        case "image":
            ye("error", t), ye("load", t);
            break;
        case "details":
            ye("toggle", t);
            break;
        case "embed":
        case "source":
        case "link": ye("error", t), ye("load", t);
        case "area":
        case "base":
        case "br":
        case "col":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "track":
        case "wbr":
        case "menuitem":
            for (D in a)
                if (a.hasOwnProperty(D) && (c = a[D], c != null))
                    switch (D) {
                        case "children":
                        case "dangerouslySetInnerHTML": throw Error(s(137, r));
                        default: ke(t, r, D, c, a, null);
                    }
            return;
        default: if (Gc(r)) {
            for (K in a)
                a.hasOwnProperty(K) && (c = a[K], c !== void 0 && kf(t, r, K, c, a, void 0));
            return;
        }
    } for (_ in a)
        a.hasOwnProperty(_) && (c = a[_], c != null && ke(t, r, _, c, a, null)); }
    function t1(t, r, a, c) { switch (r) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li": break;
        case "input":
            var h = null, g = null, w = null, _ = null, A = null, D = null, K = null;
            for (U in a) {
                var X = a[U];
                if (a.hasOwnProperty(U) && X != null)
                    switch (U) {
                        case "checked": break;
                        case "value": break;
                        case "defaultValue": A = X;
                        default: c.hasOwnProperty(U) || ke(t, r, U, null, c, X);
                    }
            }
            for (var B in c) {
                var U = c[B];
                if (X = a[B], c.hasOwnProperty(B) && (U != null || X != null))
                    switch (B) {
                        case "type":
                            g = U;
                            break;
                        case "name":
                            h = U;
                            break;
                        case "checked":
                            D = U;
                            break;
                        case "defaultChecked":
                            K = U;
                            break;
                        case "value":
                            w = U;
                            break;
                        case "defaultValue":
                            _ = U;
                            break;
                        case "children":
                        case "dangerouslySetInnerHTML":
                            if (U != null)
                                throw Error(s(137, r));
                            break;
                        default: U !== X && ke(t, r, B, U, c, X);
                    }
            }
            Ic(t, w, _, A, D, K, g, h);
            return;
        case "select":
            U = w = _ = B = null;
            for (g in a)
                if (A = a[g], a.hasOwnProperty(g) && A != null)
                    switch (g) {
                        case "value": break;
                        case "multiple": U = A;
                        default: c.hasOwnProperty(g) || ke(t, r, g, null, c, A);
                    }
            for (h in c)
                if (g = c[h], A = a[h], c.hasOwnProperty(h) && (g != null || A != null))
                    switch (h) {
                        case "value":
                            B = g;
                            break;
                        case "defaultValue":
                            _ = g;
                            break;
                        case "multiple": w = g;
                        default: g !== A && ke(t, r, h, g, c, A);
                    }
            r = _, a = w, c = U, B != null ? _s(t, !!a, B, !1) : !!c != !!a && (r != null ? _s(t, !!a, r, !0) : _s(t, !!a, a ? [] : "", !1));
            return;
        case "textarea":
            U = B = null;
            for (_ in a)
                if (h = a[_], a.hasOwnProperty(_) && h != null && !c.hasOwnProperty(_))
                    switch (_) {
                        case "value": break;
                        case "children": break;
                        default: ke(t, r, _, null, c, h);
                    }
            for (w in c)
                if (h = c[w], g = a[w], c.hasOwnProperty(w) && (h != null || g != null))
                    switch (w) {
                        case "value":
                            B = h;
                            break;
                        case "defaultValue":
                            U = h;
                            break;
                        case "children": break;
                        case "dangerouslySetInnerHTML":
                            if (h != null)
                                throw Error(s(91));
                            break;
                        default: h !== g && ke(t, r, w, h, c, g);
                    }
            Vd(t, B, U);
            return;
        case "option":
            for (var fe in a)
                if (B = a[fe], a.hasOwnProperty(fe) && B != null && !c.hasOwnProperty(fe))
                    switch (fe) {
                        case "selected":
                            t.selected = !1;
                            break;
                        default: ke(t, r, fe, null, c, B);
                    }
            for (A in c)
                if (B = c[A], U = a[A], c.hasOwnProperty(A) && B !== U && (B != null || U != null))
                    switch (A) {
                        case "selected":
                            t.selected = B && typeof B != "function" && typeof B != "symbol";
                            break;
                        default: ke(t, r, A, B, c, U);
                    }
            return;
        case "img":
        case "link":
        case "area":
        case "base":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "source":
        case "track":
        case "wbr":
        case "menuitem":
            for (var oe in a)
                B = a[oe], a.hasOwnProperty(oe) && B != null && !c.hasOwnProperty(oe) && ke(t, r, oe, null, c, B);
            for (D in c)
                if (B = c[D], U = a[D], c.hasOwnProperty(D) && B !== U && (B != null || U != null))
                    switch (D) {
                        case "children":
                        case "dangerouslySetInnerHTML":
                            if (B != null)
                                throw Error(s(137, r));
                            break;
                        default: ke(t, r, D, B, c, U);
                    }
            return;
        default: if (Gc(r)) {
            for (var Me in a)
                B = a[Me], a.hasOwnProperty(Me) && B !== void 0 && !c.hasOwnProperty(Me) && kf(t, r, Me, void 0, c, B);
            for (K in c)
                B = c[K], U = a[K], !c.hasOwnProperty(K) || B === U || B === void 0 && U === void 0 || kf(t, r, K, B, c, U);
            return;
        }
    } for (var O in a)
        B = a[O], a.hasOwnProperty(O) && B != null && !c.hasOwnProperty(O) && ke(t, r, O, null, c, B); for (X in c)
        B = c[X], U = a[X], !c.hasOwnProperty(X) || B === U || B == null && U == null || ke(t, r, X, B, c, U); }
    var Mf = null, Of = null;
    function fo(t) { return t.nodeType === 9 ? t : t.ownerDocument; }
    function Km(t) { switch (t) {
        case "http://www.w3.org/2000/svg": return 1;
        case "http://www.w3.org/1998/Math/MathML": return 2;
        default: return 0;
    } }
    function Ym(t, r) { if (t === 0)
        switch (r) {
            case "svg": return 1;
            case "math": return 2;
            default: return 0;
        } return t === 1 && r === "foreignObject" ? 0 : t; }
    function Rf(t, r) { return t === "textarea" || t === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.children == "bigint" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null; }
    var jf = null;
    function n1() { var t = window.event; return t && t.type === "popstate" ? t === jf ? !1 : (jf = t, !0) : (jf = null, !1); }
    var Xm = typeof setTimeout == "function" ? setTimeout : void 0, i1 = typeof clearTimeout == "function" ? clearTimeout : void 0, Pm = typeof Promise == "function" ? Promise : void 0, s1 = typeof queueMicrotask == "function" ? queueMicrotask : typeof Pm < "u" ? function (t) { return Pm.resolve(null).then(t).catch(r1); } : Xm;
    function r1(t) { setTimeout(function () { throw t; }); }
    function mi(t) { return t === "head"; }
    function Fm(t, r) { var a = r, c = 0, h = 0; do {
        var g = a.nextSibling;
        if (t.removeChild(a), g && g.nodeType === 8)
            if (a = g.data, a === "/$") {
                if (0 < c && 8 > c) {
                    a = c;
                    var w = t.ownerDocument;
                    if (a & 1 && wa(w.documentElement), a & 2 && wa(w.body), a & 4)
                        for (a = w.head, wa(a), w = a.firstChild; w;) {
                            var _ = w.nextSibling, A = w.nodeName;
                            w[Br] || A === "SCRIPT" || A === "STYLE" || A === "LINK" && w.rel.toLowerCase() === "stylesheet" || a.removeChild(w), w = _;
                        }
                }
                if (h === 0) {
                    t.removeChild(g), ka(r);
                    return;
                }
                h--;
            }
            else
                a === "$" || a === "$?" || a === "$!" ? h++ : c = a.charCodeAt(0) - 48;
        else
            c = 0;
        a = g;
    } while (a); ka(r); }
    function Lf(t) { var r = t.firstChild; for (r && r.nodeType === 10 && (r = r.nextSibling); r;) {
        var a = r;
        switch (r = r.nextSibling, a.nodeName) {
            case "HTML":
            case "HEAD":
            case "BODY":
                Lf(a), zc(a);
                continue;
            case "SCRIPT":
            case "STYLE": continue;
            case "LINK": if (a.rel.toLowerCase() === "stylesheet")
                continue;
        }
        t.removeChild(a);
    } }
    function a1(t, r, a, c) { for (; t.nodeType === 1;) {
        var h = a;
        if (t.nodeName.toLowerCase() !== r.toLowerCase()) {
            if (!c && (t.nodeName !== "INPUT" || t.type !== "hidden"))
                break;
        }
        else if (c) {
            if (!t[Br])
                switch (r) {
                    case "meta":
                        if (!t.hasAttribute("itemprop"))
                            break;
                        return t;
                    case "link":
                        if (g = t.getAttribute("rel"), g === "stylesheet" && t.hasAttribute("data-precedence"))
                            break;
                        if (g !== h.rel || t.getAttribute("href") !== (h.href == null || h.href === "" ? null : h.href) || t.getAttribute("crossorigin") !== (h.crossOrigin == null ? null : h.crossOrigin) || t.getAttribute("title") !== (h.title == null ? null : h.title))
                            break;
                        return t;
                    case "style":
                        if (t.hasAttribute("data-precedence"))
                            break;
                        return t;
                    case "script":
                        if (g = t.getAttribute("src"), (g !== (h.src == null ? null : h.src) || t.getAttribute("type") !== (h.type == null ? null : h.type) || t.getAttribute("crossorigin") !== (h.crossOrigin == null ? null : h.crossOrigin)) && g && t.hasAttribute("async") && !t.hasAttribute("itemprop"))
                            break;
                        return t;
                    default: return t;
                }
        }
        else if (r === "input" && t.type === "hidden") {
            var g = h.name == null ? null : "" + h.name;
            if (h.type === "hidden" && t.getAttribute("name") === g)
                return t;
        }
        else
            return t;
        if (t = dn(t.nextSibling), t === null)
            break;
    } return null; }
    function l1(t, r, a) { if (r === "")
        return null; for (; t.nodeType !== 3;)
        if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !a || (t = dn(t.nextSibling), t === null))
            return null; return t; }
    function Df(t) { return t.data === "$!" || t.data === "$?" && t.ownerDocument.readyState === "complete"; }
    function o1(t, r) { var a = t.ownerDocument; if (t.data !== "$?" || a.readyState === "complete")
        r();
    else {
        var c = function () { r(), a.removeEventListener("DOMContentLoaded", c); };
        a.addEventListener("DOMContentLoaded", c), t._reactRetry = c;
    } }
    function dn(t) { for (; t != null; t = t.nextSibling) {
        var r = t.nodeType;
        if (r === 1 || r === 3)
            break;
        if (r === 8) {
            if (r = t.data, r === "$" || r === "$!" || r === "$?" || r === "F!" || r === "F")
                break;
            if (r === "/$")
                return null;
        }
    } return t; }
    var Bf = null;
    function Qm(t) { t = t.previousSibling; for (var r = 0; t;) {
        if (t.nodeType === 8) {
            var a = t.data;
            if (a === "$" || a === "$!" || a === "$?") {
                if (r === 0)
                    return t;
                r--;
            }
            else
                a === "/$" && r++;
        }
        t = t.previousSibling;
    } return null; }
    function Zm(t, r, a) { switch (r = fo(a), t) {
        case "html":
            if (t = r.documentElement, !t)
                throw Error(s(452));
            return t;
        case "head":
            if (t = r.head, !t)
                throw Error(s(453));
            return t;
        case "body":
            if (t = r.body, !t)
                throw Error(s(454));
            return t;
        default: throw Error(s(451));
    } }
    function wa(t) { for (var r = t.attributes; r.length;)
        t.removeAttributeNode(r[0]); zc(t); }
    var tn = new Map, Jm = new Set;
    function ho(t) { return typeof t.getRootNode == "function" ? t.getRootNode() : t.nodeType === 9 ? t : t.ownerDocument; }
    var In = Q.d;
    Q.d = { f: c1, r: u1, D: f1, C: h1, L: d1, m: p1, X: m1, S: g1, M: y1 };
    function c1() { var t = In.f(), r = io(); return t || r; }
    function u1(t) { var r = vs(t); r !== null && r.tag === 5 && r.type === "form" ? bg(r) : In.r(t); }
    var Ws = typeof document > "u" ? null : document;
    function Wm(t, r, a) { var c = Ws; if (c && typeof r == "string" && r) {
        var h = Pt(r);
        h = 'link[rel="' + t + '"][href="' + h + '"]', typeof a == "string" && (h += '[crossorigin="' + a + '"]'), Jm.has(h) || (Jm.add(h), t = { rel: t, crossOrigin: a, href: r }, c.querySelector(h) === null && (r = c.createElement("link"), at(r, "link", t), et(r), c.head.appendChild(r)));
    } }
    function f1(t) { In.D(t), Wm("dns-prefetch", t, null); }
    function h1(t, r) { In.C(t, r), Wm("preconnect", t, r); }
    function d1(t, r, a) { In.L(t, r, a); var c = Ws; if (c && t && r) {
        var h = 'link[rel="preload"][as="' + Pt(r) + '"]';
        r === "image" && a && a.imageSrcSet ? (h += '[imagesrcset="' + Pt(a.imageSrcSet) + '"]', typeof a.imageSizes == "string" && (h += '[imagesizes="' + Pt(a.imageSizes) + '"]')) : h += '[href="' + Pt(t) + '"]';
        var g = h;
        switch (r) {
            case "style":
                g = er(t);
                break;
            case "script": g = tr(t);
        }
        tn.has(g) || (t = m({ rel: "preload", href: r === "image" && a && a.imageSrcSet ? void 0 : t, as: r }, a), tn.set(g, t), c.querySelector(h) !== null || r === "style" && c.querySelector(xa(g)) || r === "script" && c.querySelector(_a(g)) || (r = c.createElement("link"), at(r, "link", t), et(r), c.head.appendChild(r)));
    } }
    function p1(t, r) { In.m(t, r); var a = Ws; if (a && t) {
        var c = r && typeof r.as == "string" ? r.as : "script", h = 'link[rel="modulepreload"][as="' + Pt(c) + '"][href="' + Pt(t) + '"]', g = h;
        switch (c) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script": g = tr(t);
        }
        if (!tn.has(g) && (t = m({ rel: "modulepreload", href: t }, r), tn.set(g, t), a.querySelector(h) === null)) {
            switch (c) {
                case "audioworklet":
                case "paintworklet":
                case "serviceworker":
                case "sharedworker":
                case "worker":
                case "script": if (a.querySelector(_a(g)))
                    return;
            }
            c = a.createElement("link"), at(c, "link", t), et(c), a.head.appendChild(c);
        }
    } }
    function g1(t, r, a) { In.S(t, r, a); var c = Ws; if (c && t) {
        var h = Ss(c).hoistableStyles, g = er(t);
        r = r || "default";
        var w = h.get(g);
        if (!w) {
            var _ = { loading: 0, preload: null };
            if (w = c.querySelector(xa(g)))
                _.loading = 5;
            else {
                t = m({ rel: "stylesheet", href: t, "data-precedence": r }, a), (a = tn.get(g)) && Uf(t, a);
                var A = w = c.createElement("link");
                et(A), at(A, "link", t), A._p = new Promise(function (D, K) { A.onload = D, A.onerror = K; }), A.addEventListener("load", function () { _.loading |= 1; }), A.addEventListener("error", function () { _.loading |= 2; }), _.loading |= 4, po(w, r, c);
            }
            w = { type: "stylesheet", instance: w, count: 1, state: _ }, h.set(g, w);
        }
    } }
    function m1(t, r) { In.X(t, r); var a = Ws; if (a && t) {
        var c = Ss(a).hoistableScripts, h = tr(t), g = c.get(h);
        g || (g = a.querySelector(_a(h)), g || (t = m({ src: t, async: !0 }, r), (r = tn.get(h)) && zf(t, r), g = a.createElement("script"), et(g), at(g, "link", t), a.head.appendChild(g)), g = { type: "script", instance: g, count: 1, state: null }, c.set(h, g));
    } }
    function y1(t, r) { In.M(t, r); var a = Ws; if (a && t) {
        var c = Ss(a).hoistableScripts, h = tr(t), g = c.get(h);
        g || (g = a.querySelector(_a(h)), g || (t = m({ src: t, async: !0, type: "module" }, r), (r = tn.get(h)) && zf(t, r), g = a.createElement("script"), et(g), at(g, "link", t), a.head.appendChild(g)), g = { type: "script", instance: g, count: 1, state: null }, c.set(h, g));
    } }
    function ey(t, r, a, c) { var h = (h = te.current) ? ho(h) : null; if (!h)
        throw Error(s(446)); switch (t) {
        case "meta":
        case "title": return null;
        case "style": return typeof a.precedence == "string" && typeof a.href == "string" ? (r = er(a.href), a = Ss(h).hoistableStyles, c = a.get(r), c || (c = { type: "style", instance: null, count: 0, state: null }, a.set(r, c)), c) : { type: "void", instance: null, count: 0, state: null };
        case "link":
            if (a.rel === "stylesheet" && typeof a.href == "string" && typeof a.precedence == "string") {
                t = er(a.href);
                var g = Ss(h).hoistableStyles, w = g.get(t);
                if (w || (h = h.ownerDocument || h, w = { type: "stylesheet", instance: null, count: 0, state: { loading: 0, preload: null } }, g.set(t, w), (g = h.querySelector(xa(t))) && !g._p && (w.instance = g, w.state.loading = 5), tn.has(t) || (a = { rel: "preload", as: "style", href: a.href, crossOrigin: a.crossOrigin, integrity: a.integrity, media: a.media, hrefLang: a.hrefLang, referrerPolicy: a.referrerPolicy }, tn.set(t, a), g || b1(h, t, a, w.state))), r && c === null)
                    throw Error(s(528, ""));
                return w;
            }
            if (r && c !== null)
                throw Error(s(529, ""));
            return null;
        case "script": return r = a.async, a = a.src, typeof a == "string" && r && typeof r != "function" && typeof r != "symbol" ? (r = tr(a), a = Ss(h).hoistableScripts, c = a.get(r), c || (c = { type: "script", instance: null, count: 0, state: null }, a.set(r, c)), c) : { type: "void", instance: null, count: 0, state: null };
        default: throw Error(s(444, t));
    } }
    function er(t) { return 'href="' + Pt(t) + '"'; }
    function xa(t) { return 'link[rel="stylesheet"][' + t + "]"; }
    function ty(t) { return m({}, t, { "data-precedence": t.precedence, precedence: null }); }
    function b1(t, r, a, c) { t.querySelector('link[rel="preload"][as="style"][' + r + "]") ? c.loading = 1 : (r = t.createElement("link"), c.preload = r, r.addEventListener("load", function () { return c.loading |= 1; }), r.addEventListener("error", function () { return c.loading |= 2; }), at(r, "link", a), et(r), t.head.appendChild(r)); }
    function tr(t) { return '[src="' + Pt(t) + '"]'; }
    function _a(t) { return "script[async]" + t; }
    function ny(t, r, a) { if (r.count++, r.instance === null)
        switch (r.type) {
            case "style":
                var c = t.querySelector('style[data-href~="' + Pt(a.href) + '"]');
                if (c)
                    return r.instance = c, et(c), c;
                var h = m({}, a, { "data-href": a.href, "data-precedence": a.precedence, href: null, precedence: null });
                return c = (t.ownerDocument || t).createElement("style"), et(c), at(c, "style", h), po(c, a.precedence, t), r.instance = c;
            case "stylesheet":
                h = er(a.href);
                var g = t.querySelector(xa(h));
                if (g)
                    return r.state.loading |= 4, r.instance = g, et(g), g;
                c = ty(a), (h = tn.get(h)) && Uf(c, h), g = (t.ownerDocument || t).createElement("link"), et(g);
                var w = g;
                return w._p = new Promise(function (_, A) { w.onload = _, w.onerror = A; }), at(g, "link", c), r.state.loading |= 4, po(g, a.precedence, t), r.instance = g;
            case "script": return g = tr(a.src), (h = t.querySelector(_a(g))) ? (r.instance = h, et(h), h) : (c = a, (h = tn.get(g)) && (c = m({}, a), zf(c, h)), t = t.ownerDocument || t, h = t.createElement("script"), et(h), at(h, "link", c), t.head.appendChild(h), r.instance = h);
            case "void": return null;
            default: throw Error(s(443, r.type));
        }
    else
        r.type === "stylesheet" && (r.state.loading & 4) === 0 && (c = r.instance, r.state.loading |= 4, po(c, a.precedence, t)); return r.instance; }
    function po(t, r, a) { for (var c = a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'), h = c.length ? c[c.length - 1] : null, g = h, w = 0; w < c.length; w++) {
        var _ = c[w];
        if (_.dataset.precedence === r)
            g = _;
        else if (g !== h)
            break;
    } g ? g.parentNode.insertBefore(t, g.nextSibling) : (r = a.nodeType === 9 ? a.head : a, r.insertBefore(t, r.firstChild)); }
    function Uf(t, r) { t.crossOrigin == null && (t.crossOrigin = r.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = r.referrerPolicy), t.title == null && (t.title = r.title); }
    function zf(t, r) { t.crossOrigin == null && (t.crossOrigin = r.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = r.referrerPolicy), t.integrity == null && (t.integrity = r.integrity); }
    var go = null;
    function iy(t, r, a) { if (go === null) {
        var c = new Map, h = go = new Map;
        h.set(a, c);
    }
    else
        h = go, c = h.get(a), c || (c = new Map, h.set(a, c)); if (c.has(t))
        return c; for (c.set(t, null), a = a.getElementsByTagName(t), h = 0; h < a.length; h++) {
        var g = a[h];
        if (!(g[Br] || g[ft] || t === "link" && g.getAttribute("rel") === "stylesheet") && g.namespaceURI !== "http://www.w3.org/2000/svg") {
            var w = g.getAttribute(r) || "";
            w = t + w;
            var _ = c.get(w);
            _ ? _.push(g) : c.set(w, [g]);
        }
    } return c; }
    function sy(t, r, a) { t = t.ownerDocument || t, t.head.insertBefore(a, r === "title" ? t.querySelector("head > title") : null); }
    function v1(t, r, a) { if (a === 1 || r.itemProp != null)
        return !1; switch (t) {
        case "meta":
        case "title": return !0;
        case "style":
            if (typeof r.precedence != "string" || typeof r.href != "string" || r.href === "")
                break;
            return !0;
        case "link":
            if (typeof r.rel != "string" || typeof r.href != "string" || r.href === "" || r.onLoad || r.onError)
                break;
            switch (r.rel) {
                case "stylesheet": return t = r.disabled, typeof r.precedence == "string" && t == null;
                default: return !0;
            }
        case "script": if (r.async && typeof r.async != "function" && typeof r.async != "symbol" && !r.onLoad && !r.onError && r.src && typeof r.src == "string")
            return !0;
    } return !1; }
    function ry(t) { return !(t.type === "stylesheet" && (t.state.loading & 3) === 0); }
    var Ta = null;
    function S1() { }
    function w1(t, r, a) { if (Ta === null)
        throw Error(s(475)); var c = Ta; if (r.type === "stylesheet" && (typeof a.media != "string" || matchMedia(a.media).matches !== !1) && (r.state.loading & 4) === 0) {
        if (r.instance === null) {
            var h = er(a.href), g = t.querySelector(xa(h));
            if (g) {
                t = g._p, t !== null && typeof t == "object" && typeof t.then == "function" && (c.count++, c = mo.bind(c), t.then(c, c)), r.state.loading |= 4, r.instance = g, et(g);
                return;
            }
            g = t.ownerDocument || t, a = ty(a), (h = tn.get(h)) && Uf(a, h), g = g.createElement("link"), et(g);
            var w = g;
            w._p = new Promise(function (_, A) { w.onload = _, w.onerror = A; }), at(g, "link", a), r.instance = g;
        }
        c.stylesheets === null && (c.stylesheets = new Map), c.stylesheets.set(r, t), (t = r.state.preload) && (r.state.loading & 3) === 0 && (c.count++, r = mo.bind(c), t.addEventListener("load", r), t.addEventListener("error", r));
    } }
    function x1() { if (Ta === null)
        throw Error(s(475)); var t = Ta; return t.stylesheets && t.count === 0 && Hf(t, t.stylesheets), 0 < t.count ? function (r) { var a = setTimeout(function () { if (t.stylesheets && Hf(t, t.stylesheets), t.unsuspend) {
        var c = t.unsuspend;
        t.unsuspend = null, c();
    } }, 6e4); return t.unsuspend = r, function () { t.unsuspend = null, clearTimeout(a); }; } : null; }
    function mo() { if (this.count--, this.count === 0) {
        if (this.stylesheets)
            Hf(this, this.stylesheets);
        else if (this.unsuspend) {
            var t = this.unsuspend;
            this.unsuspend = null, t();
        }
    } }
    var yo = null;
    function Hf(t, r) { t.stylesheets = null, t.unsuspend !== null && (t.count++, yo = new Map, r.forEach(_1, t), yo = null, mo.call(t)); }
    function _1(t, r) { if (!(r.state.loading & 4)) {
        var a = yo.get(t);
        if (a)
            var c = a.get(null);
        else {
            a = new Map, yo.set(t, a);
            for (var h = t.querySelectorAll("link[data-precedence],style[data-precedence]"), g = 0; g < h.length; g++) {
                var w = h[g];
                (w.nodeName === "LINK" || w.getAttribute("media") !== "not all") && (a.set(w.dataset.precedence, w), c = w);
            }
            c && a.set(null, c);
        }
        h = r.instance, w = h.getAttribute("data-precedence"), g = a.get(w) || c, g === c && a.set(null, h), a.set(w, h), this.count++, c = mo.bind(this), h.addEventListener("load", c), h.addEventListener("error", c), g ? g.parentNode.insertBefore(h, g.nextSibling) : (t = t.nodeType === 9 ? t.head : t, t.insertBefore(h, t.firstChild)), r.state.loading |= 4;
    } }
    var Ea = { $$typeof: $, Provider: null, Consumer: null, _currentValue: se, _currentValue2: se, _threadCount: 0 };
    function T1(t, r, a, c, h, g, w, _) { this.tag = 1, this.containerInfo = t, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = un(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = un(0), this.hiddenUpdates = un(null), this.identifierPrefix = c, this.onUncaughtError = h, this.onCaughtError = g, this.onRecoverableError = w, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = _, this.incompleteTransitions = new Map; }
    function ay(t, r, a, c, h, g, w, _, A, D, K, X) { return t = new T1(t, r, a, w, _, A, D, X), r = 1, g === !0 && (r |= 24), g = Ut(3, null, null, r), t.current = g, g.stateNode = t, r = vu(), r.refCount++, t.pooledCache = r, r.refCount++, g.memoizedState = { element: c, isDehydrated: a, cache: r }, _u(g), t; }
    function ly(t) { return t ? (t = Rs, t) : Rs; }
    function oy(t, r, a, c, h, g) { h = ly(h), c.context === null ? c.context = h : c.pendingContext = h, c = ii(r), c.payload = { element: a }, g = g === void 0 ? null : g, g !== null && (c.callback = g), a = si(t, c, r), a !== null && (It(a, t, r), ta(a, t, r)); }
    function cy(t, r) { if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
        var a = t.retryLane;
        t.retryLane = a !== 0 && a < r ? a : r;
    } }
    function qf(t, r) { cy(t, r), (t = t.alternate) && cy(t, r); }
    function uy(t) { if (t.tag === 13) {
        var r = Os(t, 67108864);
        r !== null && It(r, t, 67108864), qf(t, 67108864);
    } }
    var bo = !0;
    function E1(t, r, a, c) { var h = z.T; z.T = null; var g = Q.p; try {
        Q.p = 2, $f(t, r, a, c);
    }
    finally {
        Q.p = g, z.T = h;
    } }
    function A1(t, r, a, c) { var h = z.T; z.T = null; var g = Q.p; try {
        Q.p = 8, $f(t, r, a, c);
    }
    finally {
        Q.p = g, z.T = h;
    } }
    function $f(t, r, a, c) { if (bo) {
        var h = If(c);
        if (h === null)
            Cf(t, r, c, vo, a), hy(t, c);
        else if (C1(h, t, r, a, c))
            c.stopPropagation();
        else if (hy(t, c), r & 4 && -1 < N1.indexOf(t)) {
            for (; h !== null;) {
                var g = vs(h);
                if (g !== null)
                    switch (g.tag) {
                        case 3:
                            if (g = g.stateNode, g.current.memoizedState.isDehydrated) {
                                var w = Nn(g.pendingLanes);
                                if (w !== 0) {
                                    var _ = g;
                                    for (_.pendingLanes |= 2, _.entangledLanes |= 2; w;) {
                                        var A = 1 << 31 - vt(w);
                                        _.entanglements[1] |= A, w &= ~A;
                                    }
                                    wn(g), (Ee & 6) === 0 && (to = Kt() + 500, ba(0));
                                }
                            }
                            break;
                        case 13: _ = Os(g, 2), _ !== null && It(_, g, 2), io(), qf(g, 2);
                    }
                if (g = If(c), g === null && Cf(t, r, c, vo, a), g === h)
                    break;
                h = g;
            }
            h !== null && c.stopPropagation();
        }
        else
            Cf(t, r, c, null, a);
    } }
    function If(t) { return t = Yc(t), Vf(t); }
    var vo = null;
    function Vf(t) { if (vo = null, t = bs(t), t !== null) {
        var r = o(t);
        if (r === null)
            t = null;
        else {
            var a = r.tag;
            if (a === 13) {
                if (t = u(r), t !== null)
                    return t;
                t = null;
            }
            else if (a === 3) {
                if (r.stateNode.current.memoizedState.isDehydrated)
                    return r.tag === 3 ? r.stateNode.containerInfo : null;
                t = null;
            }
            else
                r !== t && (t = null);
        }
    } return vo = t, null; }
    function fy(t) { switch (t) {
        case "beforetoggle":
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "toggle":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart": return 2;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave": return 8;
        case "message": switch (Lr()) {
            case ps: return 2;
            case Mi: return 8;
            case gs:
            case Qn: return 32;
            case hl: return 268435456;
            default: return 32;
        }
        default: return 32;
    } }
    var Gf = !1, yi = null, bi = null, vi = null, Aa = new Map, Na = new Map, Si = [], N1 = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
    function hy(t, r) { switch (t) {
        case "focusin":
        case "focusout":
            yi = null;
            break;
        case "dragenter":
        case "dragleave":
            bi = null;
            break;
        case "mouseover":
        case "mouseout":
            vi = null;
            break;
        case "pointerover":
        case "pointerout":
            Aa.delete(r.pointerId);
            break;
        case "gotpointercapture":
        case "lostpointercapture": Na.delete(r.pointerId);
    } }
    function Ca(t, r, a, c, h, g) { return t === null || t.nativeEvent !== g ? (t = { blockedOn: r, domEventName: a, eventSystemFlags: c, nativeEvent: g, targetContainers: [h] }, r !== null && (r = vs(r), r !== null && uy(r)), t) : (t.eventSystemFlags |= c, r = t.targetContainers, h !== null && r.indexOf(h) === -1 && r.push(h), t); }
    function C1(t, r, a, c, h) { switch (r) {
        case "focusin": return yi = Ca(yi, t, r, a, c, h), !0;
        case "dragenter": return bi = Ca(bi, t, r, a, c, h), !0;
        case "mouseover": return vi = Ca(vi, t, r, a, c, h), !0;
        case "pointerover":
            var g = h.pointerId;
            return Aa.set(g, Ca(Aa.get(g) || null, t, r, a, c, h)), !0;
        case "gotpointercapture": return g = h.pointerId, Na.set(g, Ca(Na.get(g) || null, t, r, a, c, h)), !0;
    } return !1; }
    function dy(t) { var r = bs(t.target); if (r !== null) {
        var a = o(r);
        if (a !== null) {
            if (r = a.tag, r === 13) {
                if (r = u(a), r !== null) {
                    t.blockedOn = r, wS(t.priority, function () { if (a.tag === 13) {
                        var c = $t();
                        c = Dc(c);
                        var h = Os(a, c);
                        h !== null && It(h, a, c), qf(a, c);
                    } });
                    return;
                }
            }
            else if (r === 3 && a.stateNode.current.memoizedState.isDehydrated) {
                t.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
                return;
            }
        }
    } t.blockedOn = null; }
    function So(t) { if (t.blockedOn !== null)
        return !1; for (var r = t.targetContainers; 0 < r.length;) {
        var a = If(t.nativeEvent);
        if (a === null) {
            a = t.nativeEvent;
            var c = new a.constructor(a.type, a);
            Kc = c, a.target.dispatchEvent(c), Kc = null;
        }
        else
            return r = vs(a), r !== null && uy(r), t.blockedOn = a, !1;
        r.shift();
    } return !0; }
    function py(t, r, a) { So(t) && a.delete(r); }
    function k1() { Gf = !1, yi !== null && So(yi) && (yi = null), bi !== null && So(bi) && (bi = null), vi !== null && So(vi) && (vi = null), Aa.forEach(py), Na.forEach(py); }
    function wo(t, r) { t.blockedOn === r && (t.blockedOn = null, Gf || (Gf = !0, n.unstable_scheduleCallback(n.unstable_NormalPriority, k1))); }
    var xo = null;
    function gy(t) { xo !== t && (xo = t, n.unstable_scheduleCallback(n.unstable_NormalPriority, function () { xo === t && (xo = null); for (var r = 0; r < t.length; r += 3) {
        var a = t[r], c = t[r + 1], h = t[r + 2];
        if (typeof c != "function") {
            if (Vf(c || a) === null)
                continue;
            break;
        }
        var g = vs(a);
        g !== null && (t.splice(r, 3), r -= 3, Iu(g, { pending: !0, data: h, method: a.method, action: c }, c, h));
    } })); }
    function ka(t) { function r(A) { return wo(A, t); } yi !== null && wo(yi, t), bi !== null && wo(bi, t), vi !== null && wo(vi, t), Aa.forEach(r), Na.forEach(r); for (var a = 0; a < Si.length; a++) {
        var c = Si[a];
        c.blockedOn === t && (c.blockedOn = null);
    } for (; 0 < Si.length && (a = Si[0], a.blockedOn === null);)
        dy(a), a.blockedOn === null && Si.shift(); if (a = (t.ownerDocument || t).$$reactFormReplay, a != null)
        for (c = 0; c < a.length; c += 3) {
            var h = a[c], g = a[c + 1], w = h[Et] || null;
            if (typeof g == "function")
                w || gy(a);
            else if (w) {
                var _ = null;
                if (g && g.hasAttribute("formAction")) {
                    if (h = g, w = g[Et] || null)
                        _ = w.formAction;
                    else if (Vf(h) !== null)
                        continue;
                }
                else
                    _ = w.action;
                typeof _ == "function" ? a[c + 1] = _ : (a.splice(c, 3), c -= 3), gy(a);
            }
        } }
    function Kf(t) { this._internalRoot = t; }
    _o.prototype.render = Kf.prototype.render = function (t) { var r = this._internalRoot; if (r === null)
        throw Error(s(409)); var a = r.current, c = $t(); oy(a, c, t, r, null, null); }, _o.prototype.unmount = Kf.prototype.unmount = function () { var t = this._internalRoot; if (t !== null) {
        this._internalRoot = null;
        var r = t.containerInfo;
        oy(t.current, 2, null, t, null, null), io(), r[ys] = null;
    } };
    function _o(t) { this._internalRoot = t; }
    _o.prototype.unstable_scheduleHydration = function (t) { if (t) {
        var r = Rd();
        t = { blockedOn: null, target: t, priority: r };
        for (var a = 0; a < Si.length && r !== 0 && r < Si[a].priority; a++)
            ;
        Si.splice(a, 0, t), a === 0 && dy(t);
    } };
    var my = e.version;
    if (my !== "19.1.1")
        throw Error(s(527, my, "19.1.1"));
    Q.findDOMNode = function (t) { var r = t._reactInternals; if (r === void 0)
        throw typeof t.render == "function" ? Error(s(188)) : (t = Object.keys(t).join(","), Error(s(268, t))); return t = d(r), t = t !== null ? p(t) : null, t = t === null ? null : t.stateNode, t; };
    var M1 = { bundleType: 0, version: "19.1.1", rendererPackageName: "react-dom", currentDispatcherRef: z, reconcilerVersion: "19.1.1" };
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
        var To = __REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (!To.isDisabled && To.supportsFiber)
            try {
                Oi = To.inject(M1), ut = To;
            }
            catch { }
    }
    return Oa.createRoot = function (t, r) { if (!l(t))
        throw Error(s(299)); var a = !1, c = "", h = Rg, g = jg, w = Lg, _ = null; return r != null && (r.unstable_strictMode === !0 && (a = !0), r.identifierPrefix !== void 0 && (c = r.identifierPrefix), r.onUncaughtError !== void 0 && (h = r.onUncaughtError), r.onCaughtError !== void 0 && (g = r.onCaughtError), r.onRecoverableError !== void 0 && (w = r.onRecoverableError), r.unstable_transitionCallbacks !== void 0 && (_ = r.unstable_transitionCallbacks)), r = ay(t, 1, !1, null, null, a, c, h, g, w, _, null), t[ys] = r.current, Nf(t), new Kf(r); }, Oa.hydrateRoot = function (t, r, a) { if (!l(t))
        throw Error(s(299)); var c = !1, h = "", g = Rg, w = jg, _ = Lg, A = null, D = null; return a != null && (a.unstable_strictMode === !0 && (c = !0), a.identifierPrefix !== void 0 && (h = a.identifierPrefix), a.onUncaughtError !== void 0 && (g = a.onUncaughtError), a.onCaughtError !== void 0 && (w = a.onCaughtError), a.onRecoverableError !== void 0 && (_ = a.onRecoverableError), a.unstable_transitionCallbacks !== void 0 && (A = a.unstable_transitionCallbacks), a.formState !== void 0 && (D = a.formState)), r = ay(t, 1, !0, r, a ?? null, c, h, g, w, _, A, D), r.context = ly(null), a = r.current, c = $t(), c = Dc(c), h = ii(c), h.callback = null, si(a, h, c), a = c, r.current.lanes = a, Dr(r, a), wn(r), t[ys] = r.current, Nf(t), new _o(r); }, Oa.version = "19.1.1", Oa;
}
var Cy;
function F1() { if (Cy)
    return Pf.exports; Cy = 1; function n() { if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
    try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
    }
    catch (e) {
        console.error(e);
    } } return n(), Pf.exports = P1(), Pf.exports; }
var s2 = F1();
exports.ReactDOMClient = s2;
const ReactDOM = X1();
exports.ReactDOM = ReactDOM;

},
"vendor/react.js": function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = exports.startTransition = exports.useTransition = exports.useSyncExternalStore = exports.useState = exports.useRef = exports.useReducer = exports.useOptimistic = exports.useMemo = exports.useLayoutEffect = exports.useInsertionEffect = exports.useImperativeHandle = exports.useId = exports.useEffect = exports.useDeferredValue = exports.useDebugValue = exports.useContext = exports.useCallback = exports.useActionState = exports.use = exports.Profiler = exports.Suspense = exports.StrictMode = exports.Fragment = exports.lazy = exports.memo = exports.forwardRef = exports.createRef = exports.createContext = exports.Children = exports.isValidElement = exports.cloneElement = exports.createElement = void 0;
const react_runtime_js_1 = require("./react-runtime.js");
exports.default = react_runtime_js_1.React;
exports.createElement = react_runtime_js_1.React.createElement, exports.cloneElement = react_runtime_js_1.React.cloneElement, exports.isValidElement = react_runtime_js_1.React.isValidElement, exports.Children = react_runtime_js_1.React.Children, exports.createContext = react_runtime_js_1.React.createContext, exports.createRef = react_runtime_js_1.React.createRef, exports.forwardRef = react_runtime_js_1.React.forwardRef, exports.memo = react_runtime_js_1.React.memo, exports.lazy = react_runtime_js_1.React.lazy, exports.Fragment = react_runtime_js_1.React.Fragment, exports.StrictMode = react_runtime_js_1.React.StrictMode, exports.Suspense = react_runtime_js_1.React.Suspense, exports.Profiler = react_runtime_js_1.React.Profiler, exports.use = react_runtime_js_1.React.use, exports.useActionState = react_runtime_js_1.React.useActionState, exports.useCallback = react_runtime_js_1.React.useCallback, exports.useContext = react_runtime_js_1.React.useContext, exports.useDebugValue = react_runtime_js_1.React.useDebugValue, exports.useDeferredValue = react_runtime_js_1.React.useDeferredValue, exports.useEffect = react_runtime_js_1.React.useEffect, exports.useId = react_runtime_js_1.React.useId, exports.useImperativeHandle = react_runtime_js_1.React.useImperativeHandle, exports.useInsertionEffect = react_runtime_js_1.React.useInsertionEffect, exports.useLayoutEffect = react_runtime_js_1.React.useLayoutEffect, exports.useMemo = react_runtime_js_1.React.useMemo, exports.useOptimistic = react_runtime_js_1.React.useOptimistic, exports.useReducer = react_runtime_js_1.React.useReducer, exports.useRef = react_runtime_js_1.React.useRef, exports.useState = react_runtime_js_1.React.useState, exports.useSyncExternalStore = react_runtime_js_1.React.useSyncExternalStore, exports.useTransition = react_runtime_js_1.React.useTransition, exports.startTransition = react_runtime_js_1.React.startTransition, exports.version = react_runtime_js_1.React.version;

}
};
const aliases={"react":"vendor/react.js","react-dom":"vendor/react-dom.js","react-dom/client":"vendor/react-dom-client.js","react/jsx-runtime":"vendor/jsx-runtime.js","@liquid-glass-ui/react":"packages/react/index.js","@liquid-glass-ui/core":"packages/core/index.js","@liquid-glass-ui/tokens":"packages/tokens/index.js"},cache={};function resolve(from,spec){if(aliases[spec])return aliases[spec];if(!spec.startsWith('.'))throw Error('Unknown module '+spec);const p=from.split('/');p.pop();for(const bit of spec.split('/')){if(bit==='..')p.pop();else if(bit!=='.')p.push(bit)}return p.join('/')}function load(id){if(cache[id])return cache[id].exports;if(!modules[id])throw Error('Missing module '+id);const mod={exports:{}};cache[id]=mod;modules[id](mod,mod.exports,s=>load(resolve(id,s)));return mod.exports}window.__glassPreview={reactVersion:load('vendor/react.js').version,diagnostics:()=>load('packages/core/index.js').getGlassDiagnostics()};load('app/main.js');
})();