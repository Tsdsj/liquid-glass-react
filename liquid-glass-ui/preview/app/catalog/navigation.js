import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { GlassButton, GlassIconButton, GlassTabs, GlassToolbar, LibraryIcon, ScrollEdge, Sidebar, TabBar, Text, ToolbarGroup, ToolbarSpacer, } from '@liquid-glass-ui/react';
import { Icon } from '../icons.js';
const stop = (event) => event.preventDefault();
export const navigationDocs = [
    {
        slug: 'toolbar', name: 'GlassToolbar', group: '导航',
        summary: '工具栏本身没有背景；每个 ToolbarGroup 才是玻璃。',
        rule: '相关项共享一个背景，按功能和使用频率分组。不要把图标和文字放进同一个分组——那会读成一个很宽的按钮。主操作单独成组并着色。',
        backdrop: 'both', demoHeight: 200,
        example: function ToolbarExample() {
            const [saved, setSaved] = useState(false);
            return _jsxs("div", { style: { display: 'grid', gap: 12, justifyItems: 'center' }, children: [_jsxs(GlassToolbar, { "aria-label": "\u7F16\u8F91\u5DE5\u5177\u680F", children: [_jsxs(ToolbarGroup, { children: [_jsx(GlassIconButton, { "aria-label": "\u7F51\u683C", children: _jsx(Icon, { name: "grid" }) }), _jsx(GlassIconButton, { "aria-label": "\u56FE\u5C42", children: _jsx(Icon, { name: "layer" }) }), _jsx(GlassIconButton, { "aria-label": "\u8C03\u6574", children: _jsx(Icon, { name: "tune" }) })] }), _jsx(ToolbarSpacer, {}), _jsx(ToolbarGroup, { prominent: true, children: _jsx(GlassButton, { variant: "glassProminent", onClick: () => setSaved(true), children: "\u5B8C\u6210" }) })] }), _jsx(Text, { variant: "caption1", tone: "secondary", role: "status", children: saved ? '已保存' : 'Tab 进入，方向键在整条工具栏内移动' })] });
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
            const [current, setCurrent] = useState('home');
            const items = [
                { key: 'home', href: '#/components/tab-bar', label: '首页', icon: _jsx(Icon, { name: "grid", size: 18 }) },
                { key: 'library', href: '#/components/tab-bar', label: '资料库', icon: _jsx(Icon, { name: "layer", size: 18 }), badge: 3, badgeLabel: '3 个新项目' },
                { key: 'settings', href: '#/components/tab-bar', label: '设置', icon: _jsx(Icon, { name: "tune", size: 18 }) },
            ].map(item => ({ ...item, onSelect: (event) => { event.preventDefault(); setCurrent(item.key); } }));
            return _jsxs("div", { className: "demo-tabbar-frame", children: [_jsx(TabBar, { "aria-label": "\u793A\u4F8B\u5BFC\u822A", items: items, current: current, sidebarBreakpoint: 99999, search: { key: 'search', href: '#/components/tab-bar', label: '搜索', icon: _jsx(LibraryIcon, { name: "search", size: 18 }), onSelect: (event) => { event.preventDefault(); setCurrent('search'); } } }), _jsxs(Text, { variant: "caption1", tone: "secondary", children: ["\u5F53\u524D\uFF1A", current, " \u00B7 \u6309\u4F4F\u9009\u4E2D\u9879\u62D6\u52A8\u53EF\u4EE5\u5207\u6362"] })] });
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
        example: () => _jsx(Sidebar, { "aria-label": "\u793A\u4F8B\u4FA7\u680F", style: { width: 220, position: 'static' }, header: _jsx(Text, { variant: "subhead", emphasized: true, children: "\u8D44\u6599\u5E93" }), footer: _jsx(Text, { variant: "caption1", tone: "secondary", children: "12 \u4E2A\u9879\u76EE" }), children: _jsx("div", { style: { display: 'grid', gap: 4 }, children: ['全部', '最近', '收藏', '归档'].map((label, index) => _jsx("a", { href: "#/components/sidebar", onClick: stop, className: "demo-sidebar-row", "aria-current": index === 1 ? 'page' : undefined, children: label }, label)) }) }),
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
        example: () => _jsx(GlassTabs, { "aria-label": "\u7EC4\u4EF6\u8D44\u6599", items: [
                { value: 'design', label: '设计', content: _jsx(Text, { variant: "body", children: "\u6709\u8FB9\u754C\u7684\u89C6\u89C9\u7CFB\u7EDF\uFF0C\u6BD4\u4E00\u7EC4\u6CA1\u6709\u4E0A\u9650\u7684\u7279\u6548\u53C2\u6570\u66F4\u6709\u4EF7\u503C\u3002" }) },
                { value: 'code', label: '实现', content: _jsx(Text, { variant: "body", children: "CSS backdrop-filter + SVG \u4F4D\u79FB\u6298\u5C04 + \u539F\u751F\u4EA4\u4E92\u8BED\u4E49\u3002" }) },
                { value: 'test', label: '测试', content: _jsx(Text, { variant: "body", children: "\u51E0\u4F55\u5355\u6D4B\u3001\u771F\u5B9E\u6D4F\u89C8\u5668\u4EA4\u4E92\u3001\u53EF\u590D\u73B0\u7684\u6D4B\u91CF\u8BB0\u5F55\u3002" }) },
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
        example: () => _jsxs("div", { className: "demo-navbar-frame", children: [_jsxs("div", { className: "demo-navbar-row", children: [_jsx(Text, { variant: "caption1", tone: "secondary", children: "\u6EDA\u52A8\u524D\uFF1A\u7D27\u51D1\u6807\u9898\u9690\u85CF" }), _jsxs("div", { className: "demo-navbar-mock", "data-compact": "false", children: [_jsx(GlassIconButton, { "aria-label": "\u8FD4\u56DE", variant: "plain", controlSize: "small", children: _jsx(LibraryIcon, { name: "chevronForward", size: 18, style: { transform: 'scaleX(-1)' } }) }), _jsx("span", { className: "demo-navbar-title", children: "\u5730\u6807" }), _jsx(GlassIconButton, { "aria-label": "\u66F4\u591A", variant: "plain", controlSize: "small", children: _jsx(LibraryIcon, { name: "ellipsis", size: 18 }) })] }), _jsx(Text, { as: "h3", variant: "largeTitle", emphasized: true, children: "\u5730\u6807" })] }), _jsxs("div", { className: "demo-navbar-row", children: [_jsx(Text, { variant: "caption1", tone: "secondary", children: "\u6EDA\u52A8\u540E\uFF1A\u5927\u6807\u9898\u79BB\u573A\uFF0C\u7D27\u51D1\u6807\u9898\u63A5\u624B" }), _jsxs("div", { className: "demo-navbar-mock", "data-compact": "true", children: [_jsx(GlassIconButton, { "aria-label": "\u8FD4\u56DE", variant: "plain", controlSize: "small", children: _jsx(LibraryIcon, { name: "chevronForward", size: 18, style: { transform: 'scaleX(-1)' } }) }), _jsx("span", { className: "demo-navbar-title", children: "\u5730\u6807" }), _jsx(GlassIconButton, { "aria-label": "\u66F4\u591A", variant: "plain", controlSize: "small", children: _jsx(LibraryIcon, { name: "ellipsis", size: 18 }) })] })] })] }),
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
            const soft = useRef(null);
            return _jsxs("div", { className: "demo-scroll-fixture", children: [_jsx(ScrollEdge, { targetRef: soft, variant: "soft" }), _jsx("div", { className: "demo-scroll-body", ref: soft, tabIndex: 0, "aria-label": "\u6EDA\u52A8\u6B63\u6587\u6F14\u793A", children: Array.from({ length: 8 }, (_, i) => _jsxs(Text, { variant: "body", style: { marginBlockEnd: 12 }, children: ["\u7B2C ", i + 1, " \u6BB5\u3002\u6B63\u6587\u4E0D\u9700\u8981\u73BB\u7483\u5316\u3002\u9605\u8BFB\u9700\u8981\u7A33\u5B9A\u7684\u5E95\u8272\u3001\u5408\u9002\u7684\u884C\u957F\u548C\u6E05\u6670\u7684\u5C42\u7EA7\uFF1B\u6EDA\u52A8\u8FB9\u7F18\u53EA\u8868\u8FBE\u5185\u5BB9\u4E0E\u64CD\u4F5C\u5C42\u7684\u5173\u7CFB\u3002"] }, i)) }), _jsx(ScrollEdge, { targetRef: soft, edge: "bottom", variant: "soft" })] });
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
