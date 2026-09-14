import { useRef, useState, type MouseEvent } from 'react';
import {
  GlassButton, GlassIconButton, GlassTabs, GlassToolbar, LibraryIcon, ScrollEdge, Sidebar,
  TabBar, Text, ToolbarGroup, ToolbarSpacer,
} from '@ttqtt/liquid-glass-react';
import { Icon } from '../icons.js';
import { demoLink } from '../site/demo.js';
import type { ComponentDoc } from './types.js';

/** Demo navigation must not move the reader off the page they are reading. */
const hold = (event: MouseEvent<HTMLAnchorElement>) => event.preventDefault();

export const navigationDocs: ComponentDoc[] = [
  {
    slug: 'toolbar', name: 'GlassToolbar', title: '工具栏', group: '导航',
    summary: '浮在内容之上的一排操作。工具栏本身没有背景，每一组才是玻璃。',
    when: [
      '把当前页面能做的事集中放在一处：编辑、播放、分享。',
      '按功能分组。相关的放一起共享一块背景，不相关的分开。',
      '图标和文字不要放进同一组——那看起来会像一个很宽的按钮。主操作单独一组。',
    ],
    examples: [
      {
        id: 'toolbar-groups', title: '分组与主操作', description: '左边是一组图标，右边是单独成组的主操作，中间的空隙就是分隔。',
        backdrop: 'both', height: 200,
        render: function ToolbarGroups() {
          const [saved, setSaved] = useState(false);
          return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassToolbar aria-label="编辑工具栏">
              <ToolbarGroup>
                <GlassIconButton aria-label="网格"><Icon name="grid" /></GlassIconButton>
                <GlassIconButton aria-label="图层"><Icon name="layer" /></GlassIconButton>
                <GlassIconButton aria-label="调整"><Icon name="tune" /></GlassIconButton>
              </ToolbarGroup>
              <ToolbarSpacer />
              <ToolbarGroup prominent>
                <GlassButton variant="glassProminent" onClick={() => setSaved(true)}>完成</GlassButton>
              </ToolbarGroup>
            </GlassToolbar>
            <Text variant="caption1" tone="secondary" role="status">
              {saved ? '已保存' : 'Tab 进入后用方向键在整条工具栏里移动'}
            </Text>
          </div>;
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
      },
      {
        id: 'toolbar-vertical', title: '竖向', description: '贴在侧边时改成竖向，方向键也跟着换成上下。',
        backdrop: 'both', height: 260,
        render: () => <GlassToolbar aria-label="竖向工具栏" orientation="vertical">
          <ToolbarGroup>
            <GlassIconButton aria-label="放大"><Icon name="expand" /></GlassIconButton>
            <GlassIconButton aria-label="缩小"><Icon name="shrink" /></GlassIconButton>
          </ToolbarGroup>
          <ToolbarSpacer />
          <ToolbarGroup>
            <GlassIconButton aria-label="更多"><Icon name="more" /></GlassIconButton>
          </ToolbarGroup>
        </GlassToolbar>,
        code: `<GlassToolbar aria-label="竖向工具栏" orientation="vertical">
  <ToolbarGroup>…</ToolbarGroup>
</GlassToolbar>`,
      },
    ],
    props: [
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: '方向，同时决定方向键走哪个轴。' },
      { name: 'aria-label', type: 'string', required: true, description: '这条工具栏是做什么的。' },
      { name: 'prominent', type: 'boolean', default: 'false', description: 'ToolbarGroup：标记唯一的主操作分组。' },
      { name: 'variant', type: "'fixed' | 'flexible'", default: "'fixed'", description: 'ToolbarSpacer：固定间距，或把两组推到两端。' },
    ],
    notes: [
      '整条工具栏只占一个 Tab 位，进去之后用方向键在所有分组之间移动。',
      '从右到左的语言里左右方向键会自动对调。',
      '开发时如果把图标和文字放进同一组，控制台会提醒一次。',
    ],
  },
  {
    slug: 'tab-bar', name: 'TabBar', title: '标签栏', group: '导航',
    summary: '应用的主导航。手机上是底部的一条浮动胶囊，屏幕变宽后同一个元素展开成侧边栏。',
    when: [
      '在应用的几个主要区域之间切换，通常 3–5 个。',
      '搜索单独占一格，放在最后，和内容区域分开。',
      '这里放的是去哪儿，不是做什么。操作属于工具栏。',
    ],
    examples: [
      {
        id: 'tabbar-basic', title: '底部标签栏', description: '按住当前项左右拖也能切换。徽标要带一个说明它在数什么的名字。',
        backdrop: 'both', height: 240,
        render: function TabBarBasic() {
          const [current, setCurrent] = useState('home');
          const pick = (key: string) => (event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(); setCurrent(key); };
          return <div className="demo-tabbar-frame">
            <TabBar aria-label="示例导航" current={current} sidebarBreakpoint={99999}
              items={[
                { key: 'home', href: '#', label: '首页', icon: <Icon name="grid" size={18} />, onSelect: pick('home') },
                { key: 'library', href: '#', label: '资料库', icon: <Icon name="layer" size={18} />, badge: 3, badgeLabel: '3 个新项目', onSelect: pick('library') },
                { key: 'settings', href: '#', label: '设置', icon: <Icon name="tune" size={18} />, onSelect: pick('settings') },
              ]}
              search={{ key: 'search', href: '#', label: '搜索', icon: <LibraryIcon name="search" size={18} />, onSelect: pick('search') }} />
            <Text variant="caption1" tone="secondary">当前：{current}</Text>
          </div>;
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
      },
    ],
    props: [
      { name: 'items', type: 'TabBarItem[]', required: true, description: '3–5 个主要区域。' },
      { name: 'current', type: 'string', description: '当前所在区域的 key。' },
      { name: 'search', type: 'TabBarItem', description: '单独一格的搜索入口，排在最后。' },
      { name: 'minimizeOnScroll', type: 'boolean', default: 'false', description: '向下滚动时收起，向上滚动恢复。' },
      { name: 'sidebarBreakpoint', type: 'number', default: '1024', description: '超过这个宽度就变成侧边栏。' },
      { name: 'accessory', type: 'ReactNode', description: '常驻的附加内容，比如“正在播放”。不要放页面专属的操作。' },
    ],
    notes: [
      '是一组真正的链接，读屏会报出当前所在项，而不是把它当成会就地换内容的标签页。',
      '底部会自动避开 iPhone 的home 指示条。',
      '徽标必须带名字，否则读屏只会念出一个数字。',
    ],
  },
  {
    slug: 'sidebar', name: 'Sidebar', title: '侧边栏', group: '导航',
    summary: '宽屏上的一块浮动面板，内容从它下方穿过。',
    when: [
      '屏幕够宽、并且导航项比较多，放不进底部的几格。',
      '也可以放在右侧当作属性面板。',
      '里面嵌的元素记得让圆角和外框同心。',
    ],
    examples: [
      {
        id: 'sidebar-basic', title: '基础用法', description: '用的是更厚的一档玻璃，而且不会随背后内容明暗翻转——这么大一块跟着翻会没法读。',
        backdrop: 'both', height: 320,
        render: () => <Sidebar aria-label="示例侧栏" style={{ width: 220, position: 'static' }}
          header={<Text variant="subhead" emphasized>资料库</Text>}
          footer={<Text variant="caption1" tone="secondary">12 个项目</Text>}>
          <div style={{ display: 'grid', gap: 4 }}>
            {['全部', '最近', '收藏', '归档'].map((label, index) =>
              <a key={label} {...demoLink} onClick={hold} className="demo-sidebar-row"
                aria-current={index === 1 ? 'page' : undefined}>{label}</a>)}
          </div>
        </Sidebar>,
        code: `<Sidebar aria-label="资料库"
  header={<Text variant="subhead" emphasized>资料库</Text>}
  footer={<Text variant="caption1" tone="secondary">12 个项目</Text>}>
  <nav>…</nav>
</Sidebar>`,
      },
    ],
    props: [
      { name: 'aria-label', type: 'string', required: true, description: '这块侧栏是做什么的。' },
      { name: 'side', type: "'leading' | 'trailing'", default: "'leading'", description: '放在起始侧还是末尾侧。放在末尾侧通常表示它是属性面板。' },
      { name: 'header / footer', type: 'ReactNode', description: '不随内容滚动的固定区域。' },
    ],
    notes: ['中间区域可以滚动，滚到底不会带着整页一起动。'],
  },
  {
    slug: 'tabs', name: 'GlassTabs', title: '标签页', group: '导航',
    summary: '在同一个页面里切换几块内容。',
    when: [
      '同一个对象的几个侧面：详情、评论、历史。切换不改变你在哪一页。',
      '如果切换会让你去到应用的另一个区域，那应该用标签栏，不是这个。',
      '标签数量固定且不多时才适合。',
    ],
    examples: [
      {
        id: 'tabs-basic', title: '基础用法', description: '方向键切换，按住当前标签拖动也能换。',
        height: 250,
        render: () => <GlassTabs aria-label="组件资料" items={[
          { value: 'design', label: '设计', content: <Text variant="body">有边界的视觉系统，比一堆没有上限的特效参数更有价值。</Text> },
          { value: 'code', label: '实现', content: <Text variant="body">真实的按钮、真实的表单、真实的键盘路径。</Text> },
          { value: 'test', label: '测试', content: <Text variant="body">每个组件都有自己的交互与键盘用例。</Text> },
        ]} />,
        code: `<GlassTabs aria-label="组件资料" items={[
  { value: 'design', label: '设计', content: <DesignNotes /> },
  { value: 'code', label: '实现', content: <CodeNotes /> },
]} />`,
      },
    ],
    props: [
      { name: 'items', type: 'GlassTab[]', required: true, description: '每项包含值、标签和对应内容。' },
      { name: 'value / defaultValue', type: 'string', description: '当前选中的标签。' },
      { name: 'aria-label', type: 'string', required: true, description: '这组标签是在切什么。' },
    ],
    notes: [
      '读屏会把它识别成“会就地换内容”的标签页，和页面导航区分得很清楚。',
      '方向键切换并立刻显示对应内容；内容区可以直接用键盘进入。',
    ],
  },
  {
    slug: 'navigation-bar', name: 'NavigationBar', title: '导航栏', group: '导航',
    summary: '页面顶部的标题栏。大标题滚上去之后，一个紧凑的标题接手。',
    when: [
      '需要一直能看到当前页面叫什么，同时又不想让标题一直占着地方。',
      '返回、更多这类操作放在两端。',
      '次级页面可以直接用紧凑标题，不必每页都来一个大标题。',
    ],
    examples: [
      {
        id: 'navbar-handover', title: '标题交接', description: '大标题还在屏幕上时，紧凑标题是隐藏的——否则同一句话会出现两次。',
        height: 280,
        render: () => <div className="demo-navbar-frame">
          <div className="demo-navbar-row">
            <Text variant="caption1" tone="secondary">滚动前</Text>
            <div className="demo-navbar-mock" data-compact="false">
              <GlassIconButton aria-label="返回" variant="plain" controlSize="small">
                <LibraryIcon name="chevronForward" size={18} style={{ transform: 'scaleX(-1)' }} />
              </GlassIconButton>
              <span className="demo-navbar-title">地标</span>
              <GlassIconButton aria-label="更多" variant="plain" controlSize="small"><LibraryIcon name="ellipsis" size={18} /></GlassIconButton>
            </div>
            <Text as="h3" variant="largeTitle" emphasized>地标</Text>
          </div>
          <div className="demo-navbar-row">
            <Text variant="caption1" tone="secondary">滚动后</Text>
            <div className="demo-navbar-mock" data-compact="true">
              <GlassIconButton aria-label="返回" variant="plain" controlSize="small">
                <LibraryIcon name="chevronForward" size={18} style={{ transform: 'scaleX(-1)' }} />
              </GlassIconButton>
              <span className="demo-navbar-title">地标</span>
              <GlassIconButton aria-label="更多" variant="plain" controlSize="small"><LibraryIcon name="ellipsis" size={18} /></GlassIconButton>
            </div>
          </div>
        </div>,
        code: `<NavigationBar
  title="地标"
  subtitle="12 个收藏"
  leading={<GlassIconButton aria-label="返回"><ChevronIcon /></GlassIconButton>}
  trailing={<ToolbarGroup><GlassIconButton aria-label="更多"><MoreIcon /></GlassIconButton></ToolbarGroup>}
/>`,
      },
    ],
    props: [
      { name: 'title', type: 'string', required: true, description: '页面标题，大标题和紧凑标题共用。' },
      { name: 'largeTitle', type: 'boolean', default: 'true', description: '关掉就直接使用紧凑标题。' },
      { name: 'subtitle', type: 'ReactNode', description: '只出现在大标题下方。' },
      { name: 'leading / trailing', type: 'ReactNode', description: '两端的控件。' },
    ],
    notes: [
      '紧凑标题对读屏是隐藏的，真正的标题是下面那个——不会被念两遍。',
      '顶部会自动避开刘海和状态栏。',
    ],
  },
  {
    slug: 'scroll-edge', name: 'ScrollEdge', title: '滚动边缘', group: '导航',
    summary: '内容滚到浮动栏下面时，让它渐渐化开，而不是被一条硬边切断。',
    when: [
      '有固定的栏悬在可滚动内容之上时。',
      '一个滚动区域只用一个，上下各一条也算一个整体。',
      '内容根本不会从栏下面穿过时不要加——那就只是装饰。',
    ],
    examples: [
      {
        id: 'edge-soft', title: '渐隐', description: '往下滚，顶部的文字会淡出而不是被切掉。',
        height: 300,
        render: function EdgeSoft() {
          const scroller = useRef<HTMLDivElement>(null);
          return <div className="demo-scroll-fixture">
            <ScrollEdge targetRef={scroller} variant="soft" />
            <div className="demo-scroll-body" ref={scroller} tabIndex={0} aria-label="滚动正文演示">
              {Array.from({ length: 8 }, (_, i) =>
                <Text key={i} variant="body" style={{ marginBlockEnd: 12 }}>
                  第 {i + 1} 段。正文不需要做成半透明。阅读需要的是稳定的底色、合适的行长和清晰的层级。
                </Text>)}
            </div>
            <ScrollEdge targetRef={scroller} edge="bottom" variant="soft" />
          </div>;
        },
        code: `const scroller = useRef<HTMLDivElement>(null);

<ScrollEdge targetRef={scroller} variant="soft" />
<div ref={scroller} className="scroller">…</div>
<ScrollEdge targetRef={scroller} edge="bottom" />`,
      },
    ],
    props: [
      { name: 'targetRef', type: 'RefObject<HTMLElement>', required: true, description: '要观察的滚动容器。' },
      { name: 'edge', type: "'top' | 'bottom'", default: "'top'", description: '作用在哪一侧。' },
      { name: 'variant', type: "'soft' | 'hard'", default: "'soft'", description: '渐隐，或一条均匀的实边。' },
      { name: 'height', type: 'number', default: '44', description: '渐隐区域的高度。' },
    ],
    notes: ['纯装饰，读屏会跳过。只有内容真的交叠时才出现。', '用户开启“减少透明度”后会变成一条实边。'],
  },
];
