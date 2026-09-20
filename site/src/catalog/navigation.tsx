import { useRef, useState, type MouseEvent } from 'react';
import {
  GlassButton, GlassIconButton, GlassSegmentedControl, GlassTabs, GlassToolbar, LibraryIcon, List, ListRow, ListSection,
  Inspector, NavigationBar, NavigationStack, PageControl, ScrollEdge, Sidebar, SplitView, useNavigationStack,
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
        backdrop: 'both', height: 220,
        knobs: [
          { name: 'orientation', label: '方向', type: 'select', value: 'horizontal', options: [
            { value: 'horizontal', label: '横向' }, { value: 'vertical', label: '竖向' },
          ] },
          { name: 'spacer', label: '把两组推到两端', type: 'boolean', value: true },
        ],
        render: function ToolbarGroups({ knobs }) {
          const [saved, setSaved] = useState(false);
          return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassToolbar aria-label="编辑工具栏" orientation={knobs.orientation as 'horizontal'}>
              <ToolbarGroup>
                <GlassIconButton aria-label="网格"><Icon name="grid" /></GlassIconButton>
                <GlassIconButton aria-label="图层"><Icon name="layer" /></GlassIconButton>
                <GlassIconButton aria-label="调整"><Icon name="tune" /></GlassIconButton>
              </ToolbarGroup>
              <ToolbarSpacer variant={knobs.spacer === true ? 'flexible' : 'fixed'} />
              <ToolbarGroup prominent>
                <GlassButton variant="glassProminent" onClick={() => setSaved(true)}>完成</GlassButton>
              </ToolbarGroup>
            </GlassToolbar>
            <Text variant="caption1" tone="secondary" role="status">
              {saved ? '已保存' : 'Tab 进入后用方向键在整条工具栏里移动'}
            </Text>
          </div>;
        },
        code: knobs => `<GlassToolbar aria-label="编辑工具栏"${knobs.orientation === 'horizontal' ? '' : ' orientation="vertical"'}
  <ToolbarGroup>
    <GlassIconButton aria-label="网格"><GridIcon /></GlassIconButton>
    <GlassIconButton aria-label="图层"><LayerIcon /></GlassIconButton>
  </ToolbarGroup>
  <ToolbarSpacer${knobs.spacer ? ' variant="flexible"' : ''} />
  <ToolbarGroup prominent>
    <GlassButton variant="glassProminent">完成</GlassButton>
  </ToolbarGroup>
</GlassToolbar>`,
      },
      {
        id: 'toolbar-segmented', title: '放一个分段控件进去',
        description: '分段控件有自己的键盘模型（方向键在选项之间走）。放进工具栏后，工具栏的方向键遍历走到它这里会停——这是已知限制，修复会改变既有键盘行为，排在 0.3.0。',
        height: 250,
        render: function ToolbarSegmented() {
          const [view, setView] = useState('map');
          return <div id="toolbar-segmented-demo" style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassToolbar aria-label="视图工具栏">
              <ToolbarGroup>
                <GlassSegmentedControl aria-label="视图" density="compact" value={view} onValueChange={setView}
                  items={[{ value: 'map', label: '地图' }, { value: 'transit', label: '公交' }]} />
              </ToolbarGroup>
              <ToolbarSpacer />
              <ToolbarGroup>
                <GlassIconButton aria-label="定位"><Icon name="expand" /></GlassIconButton>
              </ToolbarGroup>
            </GlassToolbar>
            <Text variant="caption1" tone="secondary" role="status">当前视图：{view}</Text>
          </div>;
        },
        code: `<GlassToolbar aria-label="视图工具栏">
  <ToolbarGroup>
    <GlassSegmentedControl aria-label="视图" density="compact" … />
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
    related: ['button', 'navigation-bar', 'menu'],
    imports: ['GlassToolbar', 'ToolbarGroup', 'ToolbarSpacer'],
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
        backdrop: 'both', height: 260,
        knobs: [
          { name: 'badge', label: '资料库上的徽标', type: 'number', value: 3, min: 0, max: 120, step: 1 },
          { name: 'search', label: '单独的搜索格', type: 'boolean', value: true },
        ],
        render: function TabBarBasic({ knobs }) {
          const [current, setCurrent] = useState('home');
          const pick = (key: string) => (event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(); setCurrent(key); };
          const badge = Number(knobs.badge);
          return <div className="demo-tabbar-frame">
            <TabBar aria-label="示例导航" current={current} sidebarBreakpoint={99999}
              items={[
                { key: 'home', href: '#', label: '首页', icon: <Icon name="grid" size={18} />, onSelect: pick('home') },
                { key: 'library', href: '#', label: '资料库', icon: <Icon name="layer" size={18} />, badge: badge || undefined, badgeLabel: `${badge} 个新项目`, onSelect: pick('library') },
                { key: 'settings', href: '#', label: '设置', icon: <Icon name="tune" size={18} />, onSelect: pick('settings') },
              ]}
              search={knobs.search === true
                ? { key: 'search', href: '#', label: '搜索', icon: <LibraryIcon name="search" size={18} />, onSelect: pick('search') }
                : undefined} />
            <Text variant="caption1" tone="secondary" role="status">当前：{current}</Text>
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
      {
        id: 'tabbar-sidebar', title: '同一个元素，宽屏变侧边栏',
        description: '不是两套导航。超过 sidebarBreakpoint 之后，同一个 TabBar 展开成侧边栏，当前项还是那一项——这也是为什么它和尺寸类别的 768 是两条不同的轴。',
        height: 340,
        render: function TabBarSidebar() {
          const [current, setCurrent] = useState('library');
          const pick = (key: string) => (event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(); setCurrent(key); };
          return <div id="tabbar-sidebar-demo" style={{ position: 'relative', width: '100%', height: 280 }}>
            {/* Breakpoint 0: always the sidebar form, so the two forms can be read side by side. */}
            <TabBar aria-label="宽屏导航" current={current} sidebarBreakpoint={0}
              sidebarHeader={<Text variant="subhead" emphasized>资料库</Text>}
              style={{ position: 'absolute', insetBlock: 0, insetInlineStart: 0 }}
              items={[
                { key: 'home', href: '#', label: '首页', icon: <Icon name="grid" size={18} />, onSelect: pick('home') },
                { key: 'library', href: '#', label: '资料库', icon: <Icon name="layer" size={18} />, onSelect: pick('library') },
                { key: 'settings', href: '#', label: '设置', icon: <Icon name="tune" size={18} />, onSelect: pick('settings') },
              ]} />
            <Text variant="caption1" tone="secondary" role="status"
              style={{ position: 'absolute', insetInlineEnd: 0, insetBlockStart: 0 }}>当前：{current}</Text>
          </div>;
        },
        code: `{/* 一个元素，两种形态 */}
<TabBar
  aria-label="主导航"
  current={section}
  items={items}
  sidebarHeader={<AppName />}
  sidebarBreakpoint={1024}
/>`,
      },
      {
        id: 'tabbar-not-actions', title: '这里放的是去哪儿，不是做什么',
        description: '「新建」「分享」「删除」属于工具栏。放进标签栏，用户会以为按下去是换一个区域。',
        height: 260,
        render: function TabBarNotActions() {
          return <div id="tabbar-not-actions-demo" style={{ display: 'grid', gap: 14, width: 320, justifyItems: 'center' }}>
            <GlassToolbar aria-label="页面操作">
              <ToolbarGroup>
                <GlassIconButton aria-label="新建"><LibraryIcon name="plus" size={18} /></GlassIconButton>
                <GlassIconButton aria-label="更多"><LibraryIcon name="ellipsis" size={18} /></GlassIconButton>
              </ToolbarGroup>
            </GlassToolbar>
            <Text variant="caption1" tone="secondary">操作在工具栏；标签栏只负责「首页 / 资料库 / 设置」这类目的地。</Text>
          </div>;
        },
        code: `{/* 去哪儿 */}
<TabBar items={[{ key: 'home', label: '首页' }, …]} />

{/* 做什么 */}
<GlassToolbar aria-label="页面操作">
  <ToolbarGroup><GlassIconButton aria-label="新建"><PlusIcon /></GlassIconButton></ToolbarGroup>
</GlassToolbar>`,
      },
    ],
    props: [
      { name: 'items', type: 'TabBarItem[]', required: true, description: '3–5 个主要区域。' },
      { name: 'current', type: 'string', description: '当前所在区域的 key。' },
      { name: 'search', type: 'TabBarItem', description: '单独一格的搜索入口，排在最后。' },
      { name: 'minimizeOnScroll', type: 'boolean', default: 'false', description: '向下滚动时收起，向上滚动恢复。' },
      { name: 'aria-label', type: 'string', required: true, description: '这条导航是做什么的。' },
      { name: 'sidebarHeader', type: 'ReactNode', description: '变成侧边栏之后顶部放什么——通常是应用名。标签栏形态下不显示。' },
      { name: 'sidebarBreakpoint', type: 'number', default: '1024', description: '超过这个宽度就变成侧边栏。' },
      { name: 'accessory', type: 'ReactNode', description: '常驻的附加内容，比如“正在播放”。不要放页面专属的操作。' },
    ],
    notes: [
      '是一组真正的链接，读屏会报出当前所在项，而不是把它当成会就地换内容的标签页。',
      '底部会自动避开 iPhone 的home 指示条。',
      '徽标必须带名字，否则读屏只会念出一个数字。',
    ],
    related: ['sidebar', 'badge', 'scroll-edge'],
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
        backdrop: 'both', height: 340,
        knobs: [
          { name: 'header', label: '显示头部', type: 'boolean', value: true },
          { name: 'footer', label: '显示底部', type: 'boolean', value: true },
          { name: 'width', label: '宽度', type: 'number', value: 220, min: 160, max: 320, step: 20 },
        ],
        render: function SidebarBasic({ knobs }) {
          return <Sidebar aria-label="示例侧栏" style={{ width: Number(knobs.width), position: 'static' }}
            header={knobs.header === true ? <Text variant="subhead" emphasized>资料库</Text> : undefined}
            footer={knobs.footer === true ? <Text variant="caption1" tone="secondary">12 个项目</Text> : undefined}>
            <div style={{ display: 'grid', gap: 4 }}>
              {['全部', '最近', '收藏', '归档'].map((label, index) =>
                <a key={label} {...demoLink} onClick={hold} className="demo-sidebar-row"
                  aria-current={index === 1 ? 'page' : undefined}>{label}</a>)}
            </div>
          </Sidebar>;
        },
        code: knobs => `<Sidebar aria-label="资料库"${knobs.header ? '\n  header={<Text variant="subhead" emphasized>资料库</Text>}' : ''}${knobs.footer ? '\n  footer={<Text variant="caption1" tone="secondary">12 个项目</Text>}' : ''}>
  <nav>…</nav>
</Sidebar>`,
      },
      {
        id: 'sidebar-trailing', title: '放在尾侧就是属性面板',
        description: '放在尾侧的侧栏表示「当前选中项的细节」。真的要做分栏布局时用 SplitView 的 inspector，这里只是说明 side 这个属性。',
        backdrop: 'both', height: 320,
        render: () => <Sidebar id="sidebar-trailing-demo" aria-label="属性" side="trailing"
          style={{ width: 220, position: 'static' }}
          header={<Text variant="subhead" emphasized>属性</Text>}>
          <div style={{ display: 'grid', gap: 8 }}>
            <Text variant="footnote" tone="secondary">尺寸</Text>
            <Text variant="subhead">1280 × 720</Text>
            <Text variant="footnote" tone="secondary">格式</Text>
            <Text variant="subhead">PNG</Text>
          </div>
        </Sidebar>,
        code: `<Sidebar aria-label="属性" side="trailing" header={<Text>属性</Text>}>
  …
</Sidebar>`,
      },
      {
        id: 'sidebar-concentric', title: '里面的圆角要和外框同心',
        description: '侧栏是一块大玻璃，圆角很大。里面的选中高亮如果停在一个固定的小圆角上，两个角就对不上——这是「不像 Apple」里最容易看出来的一种。',
        backdrop: 'both', height: 320,
        render: () => <Sidebar id="sidebar-concentric-demo" aria-label="同心演示"
          style={{ width: 220, position: 'static' }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <a {...demoLink} onClick={hold} className="demo-sidebar-row" aria-current="page">算对了的高亮</a>
            <a {...demoLink} onClick={hold} className="demo-sidebar-row demo-sidebar-row-wrong">固定 4px 的高亮</a>
          </div>
        </Sidebar>,
        code: `/* 高亮的圆角 = 外框圆角 − 内边距 */
.row { border-radius: calc(var(--lg-glass-radius) - 8px); }`,
      },
    ],
    props: [
      { name: 'aria-label', type: 'string', required: true, description: '这块侧栏是做什么的。' },
      { name: 'side', type: "'leading' | 'trailing'", default: "'leading'", description: '放在起始侧还是末尾侧。放在末尾侧通常表示它是属性面板。' },
      { name: 'header / footer', type: 'ReactNode', description: '不随内容滚动的固定区域。' },
    ],
    notes: ['中间区域可以滚动，滚到底不会带着整页一起动。'],
    related: ['tab-bar', 'navigation-bar'],
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
        height: 270,
        knobs: [{ name: 'count', label: '标签数', type: 'number', value: 3, min: 2, max: 4, step: 1 }],
        render: function TabsBasic({ knobs }) {
          const all = [
            { value: 'design', label: '设计', content: <Text variant="body">有边界的视觉系统，比一堆没有上限的特效参数更有价值。</Text> },
            { value: 'code', label: '实现', content: <Text variant="body">真实的按钮、真实的表单、真实的键盘路径。</Text> },
            { value: 'test', label: '测试', content: <Text variant="body">每个组件都有自己的交互与键盘用例。</Text> },
            { value: 'history', label: '历史', content: <Text variant="body">同一个对象的另一个侧面。切换不会让你离开这一页。</Text> },
          ];
          return <GlassTabs aria-label="组件资料" items={all.slice(0, Number(knobs.count))} />;
        },
        code: `<GlassTabs aria-label="组件资料" items={[
  { value: 'design', label: '设计', content: <DesignNotes /> },
  { value: 'code', label: '实现', content: <CodeNotes /> },
]} />`,
      },
      {
        id: 'tabs-controlled', title: '自己控制选中',
        description: '需要把当前标签同步到别处（比如地址栏）时传 value。不需要的话交给组件自己管就好。',
        height: 270,
        render: function TabsControlled() {
          const [value, setValue] = useState('code');
          return <div id="tabs-controlled-demo" style={{ display: 'grid', gap: 12, width: 340, justifyItems: 'center' }}>
            <GlassTabs aria-label="受控标签页" value={value} onValueChange={setValue} items={[
              { value: 'design', label: '设计', content: <Text variant="body">当前值会同步到下面那行字。</Text> },
              { value: 'code', label: '实现', content: <Text variant="body">也可以从外面把它改回去。</Text> },
            ]} />
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <GlassButton controlSize="small" variant="gray" onClick={() => setValue('design')}>跳到「设计」</GlassButton>
              <Text variant="caption1" tone="secondary" role="status">当前：{value}</Text>
            </div>
          </div>;
        },
        code: `const [tab, setTab] = useState('code');

<GlassTabs aria-label="详情" value={tab} onValueChange={setTab} items={…} />`,
      },
      {
        id: 'tabs-not-tabbar', title: '它不是标签栏',
        description: '标签页切的是同一个对象的几个侧面，你还在同一页上。如果切换之后你去了应用的另一个区域，那是标签栏 TabBar——读屏对这两者的播报也完全不同。',
        height: 250,
        render: () => <div id="tabs-not-tabbar-demo" style={{ display: 'grid', gap: 12, width: 340 }}>
          <GlassTabs aria-label="一张照片的几个侧面" items={[
            { value: 'info', label: '信息', content: <Text variant="body">1280 × 720 · PNG · 2.4 MB</Text> },
            { value: 'comments', label: '评论', content: <Text variant="body">还没有评论。</Text> },
          ]} />
          <Text variant="caption1" tone="secondary">两个标签说的是同一张照片。换区域用标签栏。</Text>
        </div>,
        code: `{/* 同一个对象的几个侧面 */}
<GlassTabs aria-label="照片" items={[{ value: 'info', label: '信息' }, …]} />

{/* 应用的几个区域 */}
<TabBar aria-label="主导航" items={[{ key: 'home', label: '首页' }, …]} />`,
      },
    ],
    props: [
      { name: 'items', type: 'GlassTab[]', required: true, description: '每项包含值、标签和对应内容。' },
      { name: 'value / defaultValue', type: 'string', description: '当前选中的标签。' },
      { name: 'onValueChange', type: '(value: string) => void', description: '切换了哪一页。' },
      { name: 'aria-label', type: 'string', required: true, description: '这组标签是在切什么。' },
    ],
    notes: [
      '读屏会把它识别成“会就地换内容”的标签页，和页面导航区分得很清楚。',
      '方向键切换并立刻显示对应内容；内容区可以直接用键盘进入。',
    ],
    related: ['segmented-control', 'tab-bar'],
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
            <Text as="h4" variant="largeTitle" emphasized>地标</Text>
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
      {
        id: 'navbar-live', title: '真的一条导航栏',
        description: '这是组件本身。大标题下面可以带一行副标题；两端放控件。整页只应该有一条，而且它的标题层级是 1——这一页已经有 h1 了，所以这里调到 3。',
        height: 300,
        knobs: [
          { name: 'largeTitle', label: '大标题', type: 'boolean', value: true },
          { name: 'subtitle', label: '副标题', type: 'text', value: '12 个收藏' },
        ],
        render: function NavBarLive({ knobs }) {
          return <div id="navbar-live-demo" style={{ width: '100%', maxWidth: 380, border: '1px solid var(--lg-separator)', borderRadius: 16, padding: 12 }}>
            <NavigationBar headingLevel={4} title="地标"
              largeTitle={knobs.largeTitle === true}
              subtitle={String(knobs.subtitle) || undefined}
              leading={<GlassIconButton aria-label="返回" variant="plain" controlSize="small">
                <LibraryIcon name="chevronForward" size={18} style={{ transform: 'scaleX(-1)' }} />
              </GlassIconButton>}
              trailing={<ToolbarGroup>
                <GlassIconButton aria-label="更多" variant="plain" controlSize="small"><LibraryIcon name="ellipsis" size={18} /></GlassIconButton>
              </ToolbarGroup>} />
            <Text variant="subhead" tone="secondary" style={{ marginBlockStart: 8 }}>
              正文从栏下面穿过去，不被一条硬边切断——那是 ScrollEdge 的活。
            </Text>
          </div>;
        },
        code: knobs => `<NavigationBar
  title="地标"${knobs.largeTitle ? '' : '\n  largeTitle={false}'}${knobs.subtitle ? `\n  subtitle="${knobs.subtitle}"` : ''}
  leading={<GlassIconButton aria-label="返回"><ChevronIcon /></GlassIconButton>}
  trailing={<ToolbarGroup>…</ToolbarGroup>}
/>`,
      },
      {
        id: 'navbar-compact-only', title: '次级页面直接用紧凑标题',
        description: '不是每一页都要来一个大标题。深入一层之后，返回按钮已经在同一行说明了来处，再摆一个大标题只是重复。',
        height: 240,
        render: () => <div id="navbar-compact-demo" style={{ width: '100%', maxWidth: 380, border: '1px solid var(--lg-separator)', borderRadius: 16, padding: 12 }}>
          <NavigationBar headingLevel={4} title="储存空间" largeTitle={false}
            leading={<GlassButton variant="plain" controlSize="small"
              icon={<LibraryIcon name="chevronForward" size={16} style={{ transform: 'scaleX(-1)' }} />}>通用</GlassButton>} />
          <Text variant="subhead" tone="secondary" style={{ marginBlockStart: 8 }}>
            返回按钮写的是上一页的名字，不是「返回」。
          </Text>
        </div>,
        code: `<NavigationBar title="储存空间" largeTitle={false}
  leading={<GlassButton variant="plain" icon={<ChevronIcon />}>通用</GlassButton>} />`,
      },
    ],
    props: [
      { name: 'title', type: 'string', required: true, description: '页面标题，大标题和紧凑标题共用。' },
      { name: 'largeTitle', type: 'boolean', default: 'true', description: '关掉就直接使用紧凑标题。' },
      { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '1', description: '大标题的标题层级。栏在页面顶部时是 1；嵌在已经有 h1 的页面里时调低——一页两个 h1 会毁掉读屏用户靠标题跳转的能力。这一页的示例用的是 4，因为示例自己的标题已经是 3。' },
      { name: 'subtitle', type: 'ReactNode', description: '只出现在大标题下方。' },
      { name: 'leading / trailing', type: 'ReactNode', description: '两端的控件。' },
    ],
    notes: [
      '紧凑标题对读屏是隐藏的，真正的标题是下面那个——不会被念两遍。',
      '顶部会自动避开刘海和状态栏。',
    ],
    related: ['toolbar', 'scroll-edge'],
  },
  {
    slug: 'navigation-stack', name: 'NavigationStack', title: '页面栈', group: '导航',
    summary: '一摞页面和一条跟着走的导航栏。返回按钮写的是上一页的名字。',
    when: [
      '一层层深入的内容：设置 → 通用 → 关于。每进一层压一页，返回弹一页。',
      '返回按钮写**上一页的标题**，不写「返回」。你已经知道自己在往回走，你不知道的是回到哪。',
      '根页用大标题，进去之后用紧凑标题——返回按钮已经在同一行说明来处了。',
      '并排的多栏不是栈。那是分栏视图，紧凑尺寸下才退化成栈。',
    ],
    examples: [
      {
        id: 'stack-basic', title: '基础用法', description: '点一行进下一层，返回按钮带着上一层的名字。焦点会跟着移到新页面。',
        height: 440,
        knobs: [
          { name: 'backLabel', label: '返回按钮', type: 'select', value: 'title', options: [
            { value: 'title', label: '上一页标题' }, { value: 'chevron', label: '只要箭头' },
          ] },
        ],
        render: function StackBasic({ knobs }) {
          return <div id="stack-demo" style={{ width: '100%', maxWidth: 420, border: '1px solid var(--lg-separator)', borderRadius: 20, overflow: 'hidden', padding: 12 }}>
            <NavigationStack headingLevel={4} backLabel={knobs.backLabel as 'title'} root={{
              key: 'settings',
              title: '设置',
              content: <StackRoot />,
            }} />
          </div>;
        },
        code: knobs => `<NavigationStack${knobs.backLabel === 'title' ? '' : ' backLabel="chevron"'} root={{ key: 'settings', title: '设置', content: <Settings /> }} />

// 任何一层里面：
const { push, pop, canGoBack } = useNavigationStack();
push({ key: 'general', title: '通用', content: <General /> });`,
      },
      {
        id: 'stack-trailing', title: '每页自己的操作', description: '导航栏右侧的控件属于当前这一页，压栈时一起换掉。',
        height: 360,
        render: function StackTrailing() {
          return <div style={{ width: '100%', maxWidth: 420, border: '1px solid var(--lg-separator)', borderRadius: 20, overflow: 'hidden', padding: 12 }}>
            <NavigationStack headingLevel={4} root={{
              key: 'inbox',
              title: '收件箱',
              trailing: <GlassButton controlSize="small" variant="gray">编辑</GlassButton>,
              content: <StackInbox />,
            }} />
          </div>;
        },
        code: `<NavigationStack root={{
  key: 'inbox', title: '收件箱',
  trailing: <GlassButton controlSize="small">编辑</GlassButton>,
  content: <Inbox />,
}} />`,
      },
      {
        id: 'stack-chevron', title: '只要箭头', description: '上一页标题太长时，backLabel="chevron" 只画箭头。可读的名字仍然在 aria-label 里。',
        height: 340,
        render: function StackChevron() {
          return <div style={{ width: '100%', maxWidth: 420, border: '1px solid var(--lg-separator)', borderRadius: 20, overflow: 'hidden', padding: 12 }}>
            <NavigationStack backLabel="chevron" headingLevel={4} root={{
              key: 'root', title: '一个名字非常非常长的页面',
              content: <StackChevronRoot />,
            }} />
          </div>;
        },
        code: `<NavigationStack backLabel="chevron" root={…} />`,
      },
    ],
    props: [
      { name: 'root', type: 'NavigationPage', required: true, description: '栈底那一页，永远在，弹不掉。' },
      { name: 'pages / onPagesChange', type: 'NavigationPage[] / (pages) => void', description: '自己管理栈（比如接路由）。不传就由组件自己管。数组是根页**之上**的那些页。' },
      { name: 'backLabel', type: "'title' | 'chevron'", default: "'title'", description: '返回按钮写上一页标题，还是只画箭头。' },
      { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '1', description: '根页大标题的标题层级，同 NavigationBar。' },
      { name: 'NavigationPage', type: '{ key, title, subtitle?, trailing?, content }', description: '一页。key 用来标识，title 是导航栏上的字。' },
      { name: 'useNavigationStack()', type: '() => { push, pop, popToRoot, depth, canGoBack }', description: '在栈里的任意一层调用。不在栈里会抛错——静默失效的按钮更难找。' },
    ],
    notes: [
      '压栈和弹栈都会把焦点移到新页面的 main 上。不这么做的话，键盘用户点了一行、页面换了，下一次 Tab 会从那一行原来的位置继续——而那一页已经不在了。',
      '返回按钮可见的是上一页标题，读屏听到的是「返回 上一页标题」——只有标题的话，听不出这是往回走。',
      '切换是交叉淡入加一点位移，弹栈时方向相反，RTL 下整体镜像。开启「减少动效」后只剩淡入：方向才是被读成「运动」的那一部分。',
      '页面用 key 区分，切换时 React 会整棵替换——上一页的状态不会漏到下一页。',
    ],
    related: ['navigation-bar', 'tab-bar', 'sidebar'],
    imports: ['NavigationStack', 'useNavigationStack'],
  },
  {
    slug: 'page-control', name: 'PageControl', title: '页码点', group: '导航',
    summary: '一排小点，表示你在一组**有顺序**的页面里的哪一页。',
    when: [
      '一组有先后的页面：引导流程、图片轮播、分步表单。',
      '**没有顺序就不要用。** 一组并列的目的地是标签栏，用这个等于告诉读者存在一个并不存在的次序。',
      '超过十个点就数不过来了，那时候改成「3 / 24」这样的文字。开发模式下会告警。',
      '顺着它拖就能翻页，不只是点——只能点的一排点，和只能点的分段控件是同一种破绽。',
    ],
    examples: [
      {
        id: 'page-control-basic', title: '基础用法', description: '点一下跳过去，按住横着拖也能翻。方向键、Home/End 都能用。',
        height: 240,
        knobs: [{ name: 'count', label: '页数', type: 'number', value: 4, min: 2, max: 10, step: 1 }],
        render: function PageControlBasic({ knobs }) {
          const [page, setPage] = useState(0);
          const count = Number(knobs.count);
          const titles = ['欢迎', '权限', '同步', '完成', '第五页', '第六页', '第七页', '第八页', '第九页', '第十页'];
          const current = Math.min(page, count - 1);
          return <div id="page-control-demo" style={{ display: 'grid', gap: 16, justifyItems: 'center' }}>
            <Text variant="title3" emphasized role="status">{titles[current]}</Text>
            <PageControl aria-label="引导步骤" count={count} page={current} onPageChange={setPage} />
          </div>;
        },
        code: knobs => `<PageControl aria-label="引导步骤" count={${knobs.count}} page={page} onPageChange={setPage} />`,
      },
      {
        id: 'page-control-vertical', title: '竖向', description: '贴在侧边时改成竖向，方向键跟着换成上下。',
        height: 260,
        render: function PageControlVertical() {
          const [page, setPage] = useState(1);
          return <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <PageControl aria-label="章节" orientation="vertical" count={5} page={page} onPageChange={setPage} />
            <Text variant="subhead" tone="secondary" role="status">第 {page + 1} 章</Text>
          </div>;
        },
        code: `<PageControl aria-label="章节" orientation="vertical" count={5} … />`,
      },
      {
        id: 'page-control-media', title: '压在图片上', description: '玻璃浮在内容之上，这正是它该在的那一层。',
        backdrop: 'media', height: 200,
        render: function PageControlMedia() {
          const [page, setPage] = useState(2);
          return <PageControl aria-label="照片" count={6} page={page} onPageChange={setPage}
            formatPage={(index, count) => `第 ${index + 1} 张，共 ${count} 张`} />;
        },
        code: `<PageControl aria-label="照片" count={6} page={page} onPageChange={setPage}
  formatPage={(i, n) => \`第 \${i + 1} 张，共 \${n} 张\`} />`,
      },
    ],
    props: [
      { name: 'count', type: 'number', required: true, description: '一共几页。超过 10 开发模式会告警。' },
      { name: 'page / defaultPage / onPageChange', type: 'number / (page) => void', description: '当前第几页，从 0 开始。' },
      { name: 'aria-label', type: 'string', required: true, description: '这些页是什么。一排点自己说不出来。' },
      { name: 'formatPage', type: '(page, count) => string', description: '每个点自己的名字，默认是「3 / 6」。' },
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: '方向，同时决定方向键走哪个轴。' },
    ],
    notes: [
      '是一个 tablist：整体一个 Tab 停靠点，方向键在内部移动，Home/End 跳到两端。',
      '每个点都是真正的按钮并且有自己的名字（「3 / 6」），所以拖动是键盘路径之外的补充，不是替代。',
      '点画出来只有 7px，触摸时**竖直方向**的命中区撑到 44，横向只撑到相邻两点的中线——横向也撑到 44 的话，一排点的命中区会互相压住，按到隔壁比按不到更糟。',
    ],
    related: ['tab-bar', 'tabs', 'segmented-control'],
  },
  {
    slug: 'split-view', name: 'SplitView', title: '分栏视图', group: '导航',
    summary: '并排的两到三栏：选择、内容、细节。窄屏下折叠成页面栈。',
    when: [
      '左边选一个，右边看它：邮件、文件、设置。',
      '**只在宽屏用。** 窄屏塞不下并排的栏，所以组件会折叠成页面栈——这正是 iPhone 上系统的做法。',
      '整个视图只有一个标题，不是每栏一个。',
      '第三栏（检查器）放当前选中项的细节，永远在尾侧。',
    ],
    examples: [
      {
        id: 'split-basic', title: '两栏', description: '中间那条分隔线可以拖，也可以用键盘：聚焦后左右方向键调宽，Shift 走大步，双击复位。',
        height: 440,
        knobs: [
          /* `sidebarWidth` is a *controlled* prop, so a knob driving it would pin the width and
             the divider would stop moving. The knobs here are the ones that leave the drag alone. */
          { name: 'sidebarVisible', label: '显示侧栏', type: 'boolean', value: true },
          { name: 'maxSidebarWidth', label: '最宽', type: 'number', value: 400, min: 240, max: 480, step: 20 },
        ],
        render: function SplitBasic({ knobs }) {
          const items = ['收件箱', '已发送', '草稿', '归档'];
          const [picked, setPicked] = useState(0);
          return <div id="split-demo" style={{ width: '100%', height: 320, border: '1px solid var(--lg-separator)', borderRadius: 16, overflow: 'hidden' }}>
            <SplitView title="邮件" style={{ height: '100%' }}
              maxSidebarWidth={Number(knobs.maxSidebarWidth)} sidebarVisible={knobs.sidebarVisible === true}
              compact={{ title: items[picked], content: <SplitDetail name={items[picked]} /> }}
              sidebar={<List variant="plain" style={{ padding: 8 }}>
                <ListSection>
                  {items.map((item, index) => <ListRow key={item} label={item}
                    onSelect={() => setPicked(index)} disclosure={false} />)}
                </ListSection>
              </List>}>
              <SplitDetail name={items[picked]} />
            </SplitView>
          </div>;
        },
        code: knobs => `<SplitView
  title="邮件"${knobs.sidebarVisible ? '' : '\n  sidebarVisible={false}'}${knobs.maxSidebarWidth === 400 ? '' : `\n  maxSidebarWidth={${knobs.maxSidebarWidth}}`}
  sidebar={<List>…目的地…</List>}
  compact={{ title: current, content: <Detail /> }}
>
  <Detail />
</SplitView>`,
      },
      {
        id: 'split-inspector', title: '三栏（带检查器）', description: '检查器在尾侧，放当前选中项的细节。它是内容层，不是玻璃——它是窗口的一块区域，不是浮在上面的面板。',
        height: 420,
        render: function SplitInspector() {
          const [name, setName] = useState('封面.png');
          return <div id="split-inspector-demo" style={{ width: '100%', height: 320, border: '1px solid var(--lg-separator)', borderRadius: 16, overflow: 'hidden' }}>
            <SplitView title="素材" style={{ height: '100%' }} inspectorWidth={220}
              compact={{ title: name, content: <SplitDetail name={name} /> }}
              sidebar={<List variant="plain" style={{ padding: 8 }}>
                <ListSection>
                  {['封面.png', '背景.jpg', '图标.svg'].map(file => <ListRow key={file} label={file}
                    onSelect={() => setName(file)} disclosure={false} />)}
                </ListSection>
              </List>}
              inspector={<Inspector title="属性">
                <Text variant="footnote" tone="secondary">文件名</Text>
                <Text variant="subhead">{name}</Text>
                <Text variant="footnote" tone="secondary">尺寸</Text>
                <Text variant="subhead">1280 × 720</Text>
                <GlassButton controlSize="small" variant="gray">替换…</GlassButton>
              </Inspector>}>
              <SplitDetail name={name} />
            </SplitView>
          </div>;
        },
        code: `<SplitView title="素材" sidebar={…} inspector={
  <Inspector title="属性">…</Inspector>
}>
  <Detail />
</SplitView>`,
      },
      {
        id: 'split-hide', title: '让人能把栏收起来',
        description: '并且给不止一种恢复方式。只能靠拖动到最窄来隐藏、又没有办法叫回来的栏，是一个能把自己藏掉的功能。',
        height: 440,
        render: function SplitHide() {
          const [sidebar, setSidebar] = useState(true);
          const [inspector, setInspector] = useState(false);
          return <div id="split-hide-demo" style={{ display: 'grid', gap: 12, width: '100%' }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <GlassButton controlSize="small" variant="gray" aria-pressed={sidebar}
                onClick={() => setSidebar(value => !value)}>{sidebar ? '收起侧栏' : '显示侧栏'}</GlassButton>
              <GlassButton controlSize="small" variant="gray" aria-pressed={inspector}
                onClick={() => setInspector(value => !value)}>{inspector ? '收起检查器' : '显示检查器'}</GlassButton>
            </div>
            <div style={{ width: '100%', height: 300, border: '1px solid var(--lg-separator)', borderRadius: 16, overflow: 'hidden' }}>
              <SplitView title="项目" style={{ height: '100%' }}
                sidebarVisible={sidebar} onSidebarVisibleChange={setSidebar}
                inspectorVisible={inspector} onInspectorVisibleChange={setInspector}
                compact={{ title: '详情', content: <SplitDetail name="详情" /> }}
                sidebar={<List variant="plain" style={{ padding: 8 }}>
                  <ListSection>
                    {['设计', '开发', '发布'].map(item => <ListRow key={item} label={item} disclosure={false} />)}
                  </ListSection>
                </List>}
                inspector={<Inspector title="属性">
                  <Text variant="subhead">这一栏可以随时收起来。</Text>
                </Inspector>}>
                <SplitDetail name="详情" />
              </SplitView>
            </div>
          </div>;
        },
        code: `<SplitView
  title="项目"
  sidebarVisible={sidebar} onSidebarVisibleChange={setSidebar}
  inspectorVisible={inspector} onInspectorVisibleChange={setInspector}
  sidebar={…} inspector={<Inspector title="属性">…</Inspector>}
>
  <Detail />
</SplitView>`,
      },
    ],
    props: [
      { name: 'sidebar', type: 'ReactNode', required: true, description: '前导栏：一组目的地。' },
      { name: 'title', type: 'string', required: true, description: '整个视图的标题。只有一个。' },
      { name: 'inspector', type: 'ReactNode', description: '尾侧栏。用 Inspector 包一下。' },
      { name: 'compact', type: '{ title, content }', description: '窄屏折叠成栈之后，压在侧栏上面的那一页。不传就只显示侧栏。' },
      { name: 'sidebarWidth / min / max', type: 'number', default: '260 / 180 / 400', description: '侧栏宽度与拖动范围。' },
      { name: 'sidebarVisible / inspectorVisible', type: 'boolean', default: 'true', description: '栏的显隐，可受控。' },
      { name: 'onSidebarWidthChange', type: '(width: number) => void', description: '侧栏宽度变化。' },
      { name: 'minSidebarWidth / maxSidebarWidth', type: 'number', default: '180 / 400', description: '拖动范围。' },
      { name: 'defaultSidebarVisible / defaultInspectorVisible', type: 'boolean', default: 'true', description: '非受控时的初始显隐。' },
      { name: 'onSidebarVisibleChange / onInspectorVisibleChange', type: '(visible: boolean) => void', description: '栏的显隐变化。' },
      { name: 'inspectorWidth', type: 'number', default: '300', description: '尾侧栏宽度。' },
      { name: 'onCompactBack', type: '() => void', description: '紧凑模式下按了返回。详情无论如何都会关掉，这只是让调用方的选中态能跟上。' },
      { name: 'Inspector', type: '{ title?, children }', description: '尾侧栏的容器。内容层，密集控件用圆角矩形而不是胶囊。' },
    ],
    notes: [
      '分隔线是 `role="separator"`，能聚焦：左右方向键调宽（Shift 走 40px），Home/End 到两端，双击复位。只能拖的宽度是键盘用户设不了的宽度。',
      '低于 768px 折叠成 NavigationStack：侧栏变成根页面，选中一项把详情压上去，返回按钮回到列表——这正是那两栏本来在表达的关系。',
      '拖动按根容器测量，不按上一次指针位置累加，RTL 下方向镜像。',
    ],
    related: ['sidebar', 'navigation-stack', 'tab-bar'],
    imports: ['SplitView', 'Inspector'],
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
        height: 320,
        knobs: [
          { name: 'variant', label: '样式', type: 'select', value: 'soft', options: [
            { value: 'soft', label: '渐隐' }, { value: 'hard', label: '实边' },
          ] },
          { name: 'height', label: '高度', type: 'number', value: 44, min: 16, max: 80, step: 4 },
        ],
        render: function EdgeSoft({ knobs }) {
          const scroller = useRef<HTMLDivElement>(null);
          return <div className="demo-scroll-fixture">
            <ScrollEdge targetRef={scroller} variant={knobs.variant as 'soft'} height={Number(knobs.height)} />
            <div className="demo-scroll-body" ref={scroller} tabIndex={0} aria-label="滚动正文演示">
              {Array.from({ length: 8 }, (_, i) =>
                <Text key={i} variant="body" style={{ marginBlockEnd: 12 }}>
                  第 {i + 1} 段。正文不需要做成半透明。阅读需要的是稳定的底色、合适的行长和清晰的层级。
                </Text>)}
            </div>
            <ScrollEdge targetRef={scroller} edge="bottom" variant={knobs.variant as 'soft'} height={Number(knobs.height)} />
          </div>;
        },
        code: knobs => `const scroller = useRef<HTMLDivElement>(null);

<ScrollEdge targetRef={scroller}${knobs.variant === 'soft' ? '' : ' variant="hard"'}${knobs.height === 44 ? '' : ` height={${knobs.height}}`} />
<div ref={scroller} className="scroller">…</div>
<ScrollEdge targetRef={scroller} edge="bottom" />`,
      },
      {
        id: 'edge-page', title: '整页滚动',
        description: '不传 targetRef 就是看整页的滚动。Screen 会自动放一个，所以大多数情况下你不必自己写——这里是给自己搭布局时用的。',
        height: 260,
        render: () => <div id="edge-page-demo" style={{ display: 'grid', gap: 12, width: 340 }}>
          <Text variant="subhead">整页版本就挂在页面顶部那条栏下面，随页面滚动生效。</Text>
          <Text variant="caption1" tone="secondary">这一页的顶栏下面就有一条——往下滚看得到。</Text>
        </div>,
        code: `{/* 整页 */}
<ScrollEdge />

{/* 或者交给布局容器 */}
<Screen top={<NavigationBar title="地标" />}>…</Screen>`,
      },
      {
        id: 'edge-one-per-view', title: '一个滚动区域只用一个',
        description: '上下各一条算一个整体。同一个滚动区域里叠两条，边缘就会出现两段深浅不同的渐变——那不是层次，那是重影。',
        height: 300,
        render: function EdgeOne() {
          const scroller = useRef<HTMLDivElement>(null);
          return <div className="demo-scroll-fixture" id="edge-one-demo">
            <ScrollEdge targetRef={scroller} />
            <div className="demo-scroll-body" ref={scroller} tabIndex={0} aria-label="只有一条边缘的滚动演示">
              {Array.from({ length: 6 }, (_, i) =>
                <Text key={i} variant="body" style={{ marginBlockEnd: 12 }}>
                  第 {i + 1} 段。顶部只有一条边缘效果。
                </Text>)}
            </div>
          </div>;
        },
        code: `{/* 对：一个滚动区域，上下各一条 */}
<ScrollEdge targetRef={scroller} />
<div ref={scroller}>…</div>
<ScrollEdge targetRef={scroller} edge="bottom" />

{/* 错：同一侧叠两条 */}`,
      },
    ],
    props: [
      { name: 'targetRef', type: 'RefObject<HTMLElement>', required: true, description: '要观察的滚动容器。' },
      { name: 'edge', type: "'top' | 'bottom'", default: "'top'", description: '作用在哪一侧。' },
      { name: 'variant', type: "'soft' | 'hard'", default: "'soft'", description: '渐隐，或一条均匀的实边。' },
      { name: 'height', type: 'number', default: '44', description: '渐隐区域的高度。' },
    ],
    notes: ['纯装饰，读屏会跳过。只有内容真的交叠时才出现。', '用户开启“减少透明度”后会变成一条实边。'],
    related: ['navigation-bar', 'tab-bar'],
  },
];

/* ---- The demo screens for NavigationStack. Separate components because each one calls
   `useNavigationStack()`, which only works inside the stack that renders it. ---- */

function StackRoot() {
  const { push } = useNavigationStack();
  return <List>
    <ListSection headingLevel={4} header="设置">
      <ListRow label="通用" value="8 项" onSelect={() => push({
        key: 'general', title: '通用', content: <StackGeneral />,
      })} />
      <ListRow label="辅助功能" onSelect={() => push({
        key: 'a11y', title: '辅助功能', content: <StackLeaf text="这里是辅助功能的内容。返回按钮写着「设置」。" />,
      })} />
      <ListRow label="关于本机" value="1.0" onSelect={() => push({
        key: 'about', title: '关于本机', content: <StackLeaf text="这里是关于本机。" />,
      })} />
    </ListSection>
  </List>;
}

function StackGeneral() {
  const { push, depth } = useNavigationStack();
  return <List>
    <ListSection headingLevel={4} header={`第 ${depth} 层`} footer="再进一层试试，返回按钮会跟着换。">
      <ListRow label="软件更新" onSelect={() => push({
        key: 'update', title: '软件更新', content: <StackLeaf text="返回按钮现在写着「通用」。" />,
      })} />
      <ListRow label="储存空间" value="128 GB" onSelect={() => push({
        key: 'storage', title: '储存空间', content: <StackLeaf text="返回按钮现在写着「通用」。" />,
      })} />
    </ListSection>
  </List>;
}

function StackLeaf({ text }: { text: string }) {
  const { popToRoot, depth } = useNavigationStack();
  return <div style={{ display: 'grid', gap: 12, padding: '8px 4px', justifyItems: 'start' }}>
    <Text variant="body">{text}</Text>
    <Text variant="caption1" tone="secondary">当前深度：{depth}</Text>
    <GlassButton controlSize="small" variant="gray" onClick={popToRoot}>回到最上层</GlassButton>
  </div>;
}

function StackInbox() {
  const { push } = useNavigationStack();
  return <List>
    <ListSection>
      {['周会纪要', '发票', '出差安排'].map(subject => <ListRow key={subject} label={subject} onSelect={() => push({
        key: subject, title: subject,
        trailing: <GlassButton controlSize="small" variant="gray">回复</GlassButton>,
        content: <StackLeaf text={`「${subject}」的正文。右上角的按钮也跟着换了。`} />,
      })} />)}
    </ListSection>
  </List>;
}

function StackChevronRoot() {
  const { push } = useNavigationStack();
  return <div style={{ padding: '8px 4px' }}>
    <GlassButton controlSize="small" onClick={() => push({
      key: 'deep', title: '下一页', content: <StackLeaf text="返回按钮只有一个箭头，但读屏听到的是完整的名字。" />,
    })}>进入下一页</GlassButton>
  </div>;
}


/** The detail pane for the SplitView demos. */
function SplitDetail({ name }: { name: string }) {
  return <div style={{ padding: 16, display: 'grid', gap: 8, alignContent: 'start' }}>
    <Text variant="title3" emphasized>{name}</Text>
    <Text variant="subhead" tone="secondary">
      选中项的内容显示在这里。把窗口拖窄到 768px 以下，两栏会折叠成一摞页面。
    </Text>
  </div>;
}
