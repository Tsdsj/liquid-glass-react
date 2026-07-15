import { useState } from 'react';
import {
  Breadcrumb,
  Button,
  Drawer,
  Menu,
  Pagination,
  Radio,
  RadioGroup,
  Segmented,
  SideNav,
  Tabs,
} from '@ttqtt/liquid-glass-react';
import type { MenuItem, SideNavItem } from '@ttqtt/liquid-glass-react';
import type { ComponentDoc } from './types';

const MENU_ITEMS: MenuItem[] = [
  { key: 'edit', label: '编辑 Edit', icon: '✎' },
  { key: 'duplicate', label: '复制 Duplicate', icon: '⧉' },
  { type: 'divider' },
  { key: 'archive', label: '归档 Archive', disabled: true },
  { key: 'delete', label: '删除 Delete', danger: true },
];

function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="accent" onClick={() => setOpen(true)}>
        打开抽屉 Open drawer
      </Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="过滤器 Filters"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button variant="accent" onClick={() => setOpen(false)}>
              应用
            </Button>
          </>
        }
      >
        <p style={{ margin: 0 }}>面板贴右侧滑入,遮罩用模糊渐入,面板是真折射玻璃。</p>
      </Drawer>
    </>
  );
}

const SELECTION = { 'zh-CN': '选择控件', 'en-US': 'Selection' };
const NAVIGATION = { 'zh-CN': '导航', 'en-US': 'Navigation' };

const BREADCRUMB_ITEMS = [
  { label: '首页 Home', href: '#/' },
  { label: '组件 Components', href: '#/components' },
  { label: '面包屑 Breadcrumb' },
];

const SIDENAV_ITEMS: SideNavItem[] = [
  { type: 'group', label: '工作区 Workspace' },
  { key: 'overview', label: '概览 Overview', href: '#/overview' },
  { key: 'projects', label: '项目 Projects', href: '#/projects' },
  { key: 'members', label: '成员 Members' },
  { type: 'group', label: '系统 System' },
  { key: 'settings', label: '设置 Settings' },
  { key: 'billing', label: '账单 Billing', disabled: true },
];

const RANGE_OPTIONS = [
  { label: '日 Day', value: 'day' },
  { label: '周 Week', value: 'week' },
  { label: '月 Month', value: 'month' },
];

const TAB_ITEMS = [
  {
    key: 'overview',
    label: '概览 Overview',
    content: '液态玻璃是一套折射真实背景的材质系统 / A material system that refracts the backdrop.',
  },
  {
    key: 'pricing',
    label: '价格 Pricing',
    content: '开源免费,MIT 协议 / Free and open source under MIT.',
  },
  {
    key: 'faq',
    label: '问答 FAQ',
    content: 'Safari 与 Firefox 自动降级为模糊材质 / Safari and Firefox fall back to a blurred material.',
  },
];

export const radioGroupDoc: ComponentDoc = {
  slug: 'radio-group',
  name: 'RadioGroup',
  title: { 'zh-CN': '单选组', 'en-US': 'RadioGroup' },
  category: SELECTION,
  description: {
    'zh-CN': '一组互斥选项,纯 tint 圆框 + accent 圆点;方向键在组内循环移动并即时选中。',
    'en-US': 'A set of mutually exclusive options; arrow keys roam and select within the group.',
  },
  renderPreview: () => (
    <RadioGroup aria-label="preview" defaultValue="standard" orientation="vertical">
      <Radio value="standard">标准 Standard</Radio>
      <Radio value="express">加急 Express</Radio>
    </RadioGroup>
  ),
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础用法', 'en-US': 'Basic' },
      description: {
        'zh-CN': '横向或纵向排列;Tab 只停在选中项,方向键循环选择,禁用项自动跳过。',
        'en-US': 'Horizontal or vertical; Tab lands once, arrows cycle and skip disabled radios.',
      },
      code: `
import { Radio, RadioGroup } from '@ttqtt/liquid-glass-react';

<RadioGroup aria-label="取件方式" defaultValue="pickup">
  <Radio value="pickup">到店自取</Radio>
  <Radio value="delivery">快递配送</Radio>
  <Radio value="locker" disabled>快递柜</Radio>
</RadioGroup>`,
      render: () => (
        <RadioGroup aria-label="取件方式" defaultValue="pickup">
          <Radio value="pickup">到店自取 Pickup</Radio>
          <Radio value="delivery">快递配送 Delivery</Radio>
          <Radio value="locker" disabled>
            快递柜 Locker
          </Radio>
        </RadioGroup>
      ),
    },
  ],
  api: [
    {
      title: 'RadioGroup',
      rows: [
        { prop: 'value / defaultValue', type: 'string', description: { 'zh-CN': '受控 / 非受控选中值', 'en-US': 'Controlled / uncontrolled value' } },
        { prop: 'onChange', type: '(value: string) => void', description: { 'zh-CN': '选中变化回调', 'en-US': 'Selection callback' } },
        { prop: 'name', type: 'string', description: { 'zh-CN': '单选组名,缺省用 useId', 'en-US': 'Group name; defaults to useId' } },
        { prop: 'orientation', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: { 'zh-CN': '排列与方向键轴向', 'en-US': 'Layout and arrow-key axis' } },
        { prop: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: { 'zh-CN': '尺寸档位', 'en-US': 'Size preset' } },
        { prop: 'disabled', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '禁用整组', 'en-US': 'Disable the whole group' } },
      ],
    },
    {
      title: 'Radio',
      rows: [
        { prop: 'value', type: 'string', description: { 'zh-CN': '选项值(必填)', 'en-US': 'Option value (required)' } },
        { prop: 'disabled', type: 'boolean', description: { 'zh-CN': '禁用单项', 'en-US': 'Disable a single radio' } },
        { prop: 'children', type: 'ReactNode', description: { 'zh-CN': '标签文案', 'en-US': 'Label content' } },
      ],
    },
  ],
};

export const segmentedDoc: ComponentDoc = {
  slug: 'segmented',
  name: 'Segmented',
  title: { 'zh-CN': '分段控制器', 'en-US': 'Segmented' },
  category: SELECTION,
  description: {
    'zh-CN': '单选语义的分段器,选中项由一块滑动玻璃 thumb 指示,凹槽纯 tint。',
    'en-US': 'A single-select segmented control; the active segment rides a sliding glass thumb.',
  },
  renderPreview: () => (
    <Segmented aria-label="preview" options={RANGE_OPTIONS} defaultValue="week" />
  ),
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础用法', 'en-US': 'Basic' },
      description: {
        'zh-CN': '方向键移动即选中;block 撑满容器宽度。滑块移动不会触发滤镜重建。',
        'en-US': 'Arrows move and select; block fills the container. The slide never rebuilds the filter.',
      },
      code: `
import { Segmented } from '@ttqtt/liquid-glass-react';

<Segmented
  aria-label="时间范围"
  defaultValue="week"
  options={[
    { label: '日', value: 'day' },
    { label: '周', value: 'week' },
    { label: '月', value: 'month' },
  ]}
/>`,
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 360 }}>
          <Segmented aria-label="时间范围" options={RANGE_OPTIONS} defaultValue="week" />
          <Segmented aria-label="时间范围 block" options={RANGE_OPTIONS} defaultValue="day" block />
        </div>
      ),
    },
  ],
  api: [
    {
      title: 'Segmented',
      rows: [
        { prop: 'options', type: 'SegmentedOption[]', description: { 'zh-CN': '选项数组', 'en-US': 'Option list' } },
        { prop: 'value / defaultValue', type: 'string', description: { 'zh-CN': '受控 / 非受控值,缺省取第一个可用项', 'en-US': 'Controlled / uncontrolled; defaults to the first enabled option' } },
        { prop: 'onChange', type: '(value: string) => void', description: { 'zh-CN': '选中变化回调', 'en-US': 'Selection callback' } },
        { prop: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: { 'zh-CN': '尺寸档位', 'en-US': 'Size preset' } },
        { prop: 'block', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '撑满容器宽', 'en-US': 'Stretch to full width' } },
        { prop: 'disabled', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '禁用整组', 'en-US': 'Disable the whole control' } },
      ],
    },
    {
      title: 'SegmentedOption',
      rows: [
        { prop: 'label', type: 'ReactNode', description: { 'zh-CN': '选项文案', 'en-US': 'Option label' } },
        { prop: 'value', type: 'string', description: { 'zh-CN': '选项值', 'en-US': 'Option value' } },
        { prop: 'disabled', type: 'boolean', description: { 'zh-CN': '禁用单项', 'en-US': 'Disable a single option' } },
      ],
    },
  ],
};

export const tabsDoc: ComponentDoc = {
  slug: 'tabs',
  name: 'Tabs',
  title: { 'zh-CN': '标签页', 'en-US': 'Tabs' },
  category: NAVIGATION,
  description: {
    'zh-CN': '玻璃指示器切换内容面板;左右方向键 + Home/End 自动激活,未选中面板不渲染。',
    'en-US': 'A glass indicator switches panels; arrows + Home/End activate automatically.',
  },
  renderPreview: () => <Tabs aria-label="preview" items={TAB_ITEMS} defaultValue="overview" />,
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础用法', 'en-US': 'Basic' },
      description: {
        'zh-CN': '聚焦即切换(自动激活),仅当前面板存在于 DOM。',
        'en-US': 'Focus activates the tab; only the active panel exists in the DOM.',
      },
      code: `
import { Tabs } from '@ttqtt/liquid-glass-react';

<Tabs
  aria-label="产品文档"
  defaultValue="overview"
  items={[
    { key: 'overview', label: '概览', content: <p>概览内容</p> },
    { key: 'pricing', label: '价格', content: <p>价格内容</p> },
    { key: 'faq', label: '问答', content: <p>问答内容</p> },
  ]}
/>`,
      render: () => <Tabs aria-label="产品文档" items={TAB_ITEMS} defaultValue="overview" />,
    },
  ],
  api: [
    {
      title: 'Tabs',
      rows: [
        { prop: 'items', type: 'TabItem[]', description: { 'zh-CN': '标签与面板数组', 'en-US': 'Tabs and their panels' } },
        { prop: 'value / defaultValue', type: 'string', description: { 'zh-CN': '受控 / 非受控激活 key,缺省取第一个可用项', 'en-US': 'Controlled / uncontrolled key; defaults to the first enabled tab' } },
        { prop: 'onChange', type: '(key: string) => void', description: { 'zh-CN': '激活变化回调', 'en-US': 'Activation callback' } },
        { prop: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: { 'zh-CN': '尺寸档位', 'en-US': 'Size preset' } },
      ],
    },
    {
      title: 'TabItem',
      rows: [
        { prop: 'key', type: 'string', description: { 'zh-CN': '唯一标识', 'en-US': 'Unique key' } },
        { prop: 'label', type: 'ReactNode', description: { 'zh-CN': '标签文案', 'en-US': 'Tab label' } },
        { prop: 'content', type: 'ReactNode', description: { 'zh-CN': '面板内容', 'en-US': 'Panel content' } },
        { prop: 'disabled', type: 'boolean', description: { 'zh-CN': '禁用单个标签', 'en-US': 'Disable a single tab' } },
      ],
    },
  ],
};

export const breadcrumbDoc: ComponentDoc = {
  slug: 'breadcrumb',
  name: 'Breadcrumb',
  title: { 'zh-CN': '面包屑', 'en-US': 'Breadcrumb' },
  category: NAVIGATION,
  description: {
    'zh-CN': '纯文字层级导航;末项 aria-current=page 且不可点,分隔符 aria-hidden。',
    'en-US': 'Text hierarchy nav; the last item is aria-current and inert, separators are hidden.',
  },
  renderPreview: () => <Breadcrumb items={BREADCRUMB_ITEMS} />,
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础与自定义分隔符', 'en-US': 'Basic & custom separator' },
      description: {
        'zh-CN': '有 href 渲染链接,onClick(无 href)渲染按钮;separator 可自定义。',
        'en-US': 'href renders a link, onClick (no href) a button; the separator is customizable.',
      },
      code: `
import { Breadcrumb } from '@ttqtt/liquid-glass-react';

<Breadcrumb
  items={[
    { label: '首页', href: '#/' },
    { label: '组件', href: '#/components' },
    { label: '面包屑' },
  ]}
/>`,
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Breadcrumb items={BREADCRUMB_ITEMS} />
          <Breadcrumb items={BREADCRUMB_ITEMS} separator="›" />
        </div>
      ),
    },
  ],
  api: [
    {
      title: 'Breadcrumb',
      rows: [
        { prop: 'items', type: 'BreadcrumbItem[]', description: { 'zh-CN': '层级项数组', 'en-US': 'Hierarchy items' } },
        { prop: 'separator', type: 'ReactNode', defaultValue: "'/'", description: { 'zh-CN': '分隔符', 'en-US': 'Separator' } },
      ],
    },
    {
      title: 'BreadcrumbItem',
      rows: [
        { prop: 'label', type: 'ReactNode', description: { 'zh-CN': '文案', 'en-US': 'Label' } },
        { prop: 'href', type: 'string', description: { 'zh-CN': '链接地址', 'en-US': 'Link href' } },
        { prop: 'onClick', type: '(e: MouseEvent) => void', description: { 'zh-CN': '点击回调(无 href 时渲染按钮)', 'en-US': 'Click handler (button when no href)' } },
      ],
    },
  ],
};

export const paginationDoc: ComponentDoc = {
  slug: 'pagination',
  name: 'Pagination',
  title: { 'zh-CN': '分页', 'en-US': 'Pagination' },
  category: NAVIGATION,
  description: {
    'zh-CN': '纯 tint ghost 页码,当前页强化;省略号序列由纯函数计算,首尾页禁用前后翻。',
    'en-US': 'Tint ghost page buttons with a strengthened current page; ellipses via a pure function.',
  },
  renderPreview: () => <Pagination total={95} defaultCurrent={1} size="sm" />,
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '受控分页', 'en-US': 'Controlled' },
      description: {
        'zh-CN': '每个按钮带 i18n aria-label(上一页/下一页/第 X 页);siblingCount 控制两侧显示数。',
        'en-US': 'Every button has an i18n aria-label; siblingCount controls neighbours shown.',
      },
      code: `
import { Pagination } from '@ttqtt/liquid-glass-react';

<Pagination total={195} pageSize={10} defaultCurrent={1} />`,
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Pagination total={195} defaultCurrent={1} />
          <Pagination total={200} defaultCurrent={10} siblingCount={2} size="sm" />
        </div>
      ),
    },
  ],
  api: [
    {
      title: 'Pagination',
      rows: [
        { prop: 'current / defaultCurrent', type: 'number', description: { 'zh-CN': '受控 / 非受控当前页(默认 1)', 'en-US': 'Controlled / uncontrolled page (default 1)' } },
        { prop: 'total', type: 'number', description: { 'zh-CN': '条目总数', 'en-US': 'Total item count' } },
        { prop: 'pageSize', type: 'number', defaultValue: '10', description: { 'zh-CN': '每页条数', 'en-US': 'Items per page' } },
        { prop: 'onChange', type: '(page: number) => void', description: { 'zh-CN': '翻页回调', 'en-US': 'Page-change callback' } },
        { prop: 'siblingCount', type: 'number', defaultValue: '1', description: { 'zh-CN': '当前页两侧显示数', 'en-US': 'Neighbours on each side' } },
        { prop: 'size', type: "'sm' | 'md'", defaultValue: "'md'", description: { 'zh-CN': '尺寸档位', 'en-US': 'Size preset' } },
        { prop: 'disabled', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '禁用整组', 'en-US': 'Disable all' } },
      ],
    },
  ],
};

export const sideNavDoc: ComponentDoc = {
  slug: 'side-nav',
  name: 'SideNav',
  title: { 'zh-CN': '侧边导航', 'en-US': 'SideNav' },
  category: NAVIGATION,
  description: {
    'zh-CN': '垂直导航列表,选中项由玻璃滑块指示(复用 useSlidingIndicator 纵向);走原生 Tab 序。',
    'en-US': 'Vertical nav with a glass indicator (shared useSlidingIndicator, vertical); native Tab order.',
  },
  renderPreview: () => (
    <div style={{ width: 180 }}>
      <SideNav aria-label="preview" items={SIDENAV_ITEMS} defaultValue="overview" />
    </div>
  ),
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '分组与选中', 'en-US': 'Groups & selection' },
      description: {
        'zh-CN': '有 href 渲染链接,否则按钮;group 为不可交互分组标题;选中项 aria-current=page。',
        'en-US': 'href renders a link, else a button; group is a non-interactive heading.',
      },
      code: `
import { SideNav } from '@ttqtt/liquid-glass-react';

<SideNav
  aria-label="主导航"
  defaultValue="overview"
  items={[
    { type: 'group', label: '工作区' },
    { key: 'overview', label: '概览', href: '#/overview' },
    { key: 'projects', label: '项目', href: '#/projects' },
    { key: 'members', label: '成员' },
  ]}
/>`,
      render: () => (
        <div style={{ width: 220 }}>
          <SideNav aria-label="主导航" items={SIDENAV_ITEMS} defaultValue="overview" />
        </div>
      ),
    },
  ],
  api: [
    {
      title: 'SideNav',
      rows: [
        { prop: 'items', type: 'SideNavItem[]', description: { 'zh-CN': '项或分组标题数组', 'en-US': 'Items or group headings' } },
        { prop: 'value / defaultValue', type: 'string', description: { 'zh-CN': '受控 / 非受控选中 key', 'en-US': 'Controlled / uncontrolled key' } },
        { prop: 'onChange', type: '(key: string) => void', description: { 'zh-CN': '选中变化回调', 'en-US': 'Selection callback' } },
      ],
    },
    {
      title: 'SideNavItem',
      rows: [
        { prop: 'key', type: 'string', description: { 'zh-CN': '唯一标识(项)', 'en-US': 'Unique key (item)' } },
        { prop: 'label', type: 'ReactNode', description: { 'zh-CN': '文案', 'en-US': 'Label' } },
        { prop: 'icon / href / disabled', type: 'ReactNode / string / boolean', description: { 'zh-CN': '图标 / 链接 / 禁用', 'en-US': 'Icon / link / disabled' } },
        { prop: "{ type: 'group', label }", type: 'object', description: { 'zh-CN': '不可交互分组标题', 'en-US': 'Non-interactive group heading' } },
      ],
    },
  ],
};

export const drawerDoc: ComponentDoc = {
  slug: 'drawer',
  name: 'Drawer',
  title: { 'zh-CN': '抽屉', 'en-US': 'Drawer' },
  category: NAVIGATION,
  description: {
    'zh-CN': '贴边滑入的模态玻璃面板,与 Modal 同构:焦点圈闭、Esc、遮罩模糊渐入、首帧折射门控。',
    'en-US': 'An edge-anchored modal glass panel, structurally identical to Modal, sliding in per placement.',
  },
  renderPreview: () => <Button size="sm">打开抽屉 Drawer</Button>,
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '四向抽屉', 'en-US': 'Four placements' },
      description: {
        'zh-CN': 'placement 控制贴边方向(默认 right),size 控制宽/高;Esc、遮罩点击、关闭钮均可关闭。',
        'en-US': 'placement sets the edge (default right); size sets width/height. Esc, overlay and close all dismiss.',
      },
      code: `
import { useState } from 'react';
import { Button, Drawer } from '@ttqtt/liquid-glass-react';

const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>打开抽屉</Button>
<Drawer open={open} onOpenChange={setOpen} placement="right" title="过滤器">
  内容
</Drawer>`,
      render: () => <DrawerDemo />,
    },
  ],
  api: [
    {
      title: 'Drawer',
      rows: [
        { prop: 'open', type: 'boolean', description: { 'zh-CN': '受控打开态(必填)', 'en-US': 'Controlled open state (required)' } },
        { prop: 'onOpenChange', type: '(open: boolean) => void', description: { 'zh-CN': '打开态变化回调', 'en-US': 'Open-state callback' } },
        { prop: 'placement', type: "'left' | 'right' | 'top' | 'bottom'", defaultValue: "'right'", description: { 'zh-CN': '贴边方向', 'en-US': 'Anchored edge' } },
        { prop: 'size', type: 'number | string', description: { 'zh-CN': '面板宽(左右)/高(上下)', 'en-US': 'Panel width (L/R) or height (T/B)' } },
        { prop: 'title / footer', type: 'ReactNode', description: { 'zh-CN': '标题 / 底部操作区', 'en-US': 'Title / footer area' } },
        { prop: 'closeOnOverlayClick', type: 'boolean', defaultValue: 'true', description: { 'zh-CN': '点击遮罩是否关闭', 'en-US': 'Close on overlay press' } },
      ],
    },
  ],
};

export const menuDoc: ComponentDoc = {
  slug: 'menu',
  name: 'Menu',
  title: { 'zh-CN': '下拉菜单', 'en-US': 'Menu' },
  category: NAVIGATION,
  description: {
    'zh-CN': '触发器 cloneElement 注入,玻璃浮层菜单;点击/Enter/方向键打开,typeahead、disabled 跳过、danger 项。',
    'en-US': 'A glass dropdown injected onto the trigger; opens by click/Enter/arrows with typeahead and danger items.',
  },
  renderPreview: () => (
    <Menu items={MENU_ITEMS}>
      <Button size="sm">操作 Actions</Button>
    </Menu>
  ),
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础用法', 'en-US': 'Basic' },
      description: {
        'zh-CN': '选择后关闭并把焦点还原触发器;divider 为 role=separator,danger 项红色文字。',
        'en-US': 'Selecting closes and restores focus; divider is role=separator, danger items go red.',
      },
      code: `
import { Button, Menu } from '@ttqtt/liquid-glass-react';

<Menu
  items={[
    { key: 'edit', label: '编辑' },
    { type: 'divider' },
    { key: 'delete', label: '删除', danger: true },
  ]}
  onSelect={(key) => console.log(key)}
>
  <Button>操作</Button>
</Menu>`,
      render: () => (
        <Menu items={MENU_ITEMS} onSelect={() => undefined}>
          <Button>操作 Actions</Button>
        </Menu>
      ),
    },
  ],
  api: [
    {
      title: 'Menu',
      rows: [
        { prop: 'items', type: 'MenuItem[]', description: { 'zh-CN': '菜单项或分隔符', 'en-US': 'Items or dividers' } },
        { prop: 'onSelect', type: '(key: string) => void', description: { 'zh-CN': '选择回调', 'en-US': 'Selection callback' } },
        { prop: 'children', type: 'ReactElement', description: { 'zh-CN': '触发器(cloneElement 注入)', 'en-US': 'Trigger (cloneElement)' } },
        { prop: 'open / defaultOpen', type: 'boolean', description: { 'zh-CN': '受控 / 非受控打开态', 'en-US': 'Controlled / uncontrolled open' } },
        { prop: 'onOpenChange', type: '(open: boolean) => void', description: { 'zh-CN': '打开态变化回调', 'en-US': 'Open-state callback' } },
        { prop: 'placement', type: 'Placement', defaultValue: "'bottom-start'", description: { 'zh-CN': '弹出方向', 'en-US': 'Placement' } },
      ],
    },
    {
      title: 'MenuItem',
      rows: [
        { prop: 'key / label', type: 'string / ReactNode', description: { 'zh-CN': '标识 / 文案', 'en-US': 'Key / label' } },
        { prop: 'icon / disabled / danger', type: 'ReactNode / boolean / boolean', description: { 'zh-CN': '图标 / 禁用 / 危险项', 'en-US': 'Icon / disabled / danger' } },
        { prop: "{ type: 'divider' }", type: 'object', description: { 'zh-CN': '分隔线(role=separator)', 'en-US': 'Divider (role=separator)' } },
      ],
    },
  ],
};
