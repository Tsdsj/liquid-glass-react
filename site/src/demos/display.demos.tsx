import {
  Avatar,
  Badge,
  Button,
  Card,
  Progress,
  Skeleton,
  Spin,
  Table,
  Tag,
  type TableColumn,
} from '@ttqtt/liquid-glass-react';
import type { ComponentDoc } from './types';

const DISPLAY = { 'zh-CN': '展示', 'en-US': 'Display' };

interface Member {
  id: string;
  name: string;
  role: string;
  score: number;
}

const MEMBERS: Member[] = [
  { id: '1', name: '林清', role: '设计', score: 92 },
  { id: '2', name: '陈默', role: '前端', score: 88 },
  { id: '3', name: '苏岚', role: '产品', score: 95 },
  { id: '4', name: '周野', role: '前端', score: 79 },
  { id: '5', name: '吴回', role: '设计', score: 84 },
];

const MEMBER_COLUMNS: TableColumn<Member>[] = [
  { key: 'name', title: '姓名', dataIndex: 'name', sortable: true },
  { key: 'role', title: '角色', dataIndex: 'role' },
  { key: 'score', title: '评分', dataIndex: 'score', sortable: true, align: 'right' },
];

const AVATAR_BOX = {
  display: 'inline-flex',
  width: 40,
  height: 40,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 10,
  background: 'rgba(0,0,0,0.08)',
} as const;

export const tagDoc: ComponentDoc = {
  slug: 'tag',
  name: 'Tag',
  title: { 'zh-CN': '标签', 'en-US': 'Tag' },
  category: DISPLAY,
  description: {
    'zh-CN': '预设语义色的纯 tint 小标签,可选图标与可关闭按钮(i18n aria-label)。',
    'en-US': 'Small tint chips in preset semantic colors, with optional icon and a close button.',
  },
  renderPreview: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Tag color="accent">Accent</Tag>
      <Tag color="success">Success</Tag>
    </div>
  ),
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '语义色与关闭', 'en-US': 'Colors & closable' },
      description: {
        'zh-CN': '五种预设色;closable 渲染真按钮,onClose 后由使用方自行卸载。',
        'en-US': 'Five preset colors; closable renders a real button, unmount on onClose yourself.',
      },
      code: `
import { Tag } from '@ttqtt/liquid-glass-react';

<Tag color="success">已完成</Tag>
<Tag color="danger" closable onClose={() => {}}>可关闭</Tag>`,
      render: () => (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Tag>默认 Default</Tag>
          <Tag color="accent">主色 Accent</Tag>
          <Tag color="success">成功 Success</Tag>
          <Tag color="warning">警告 Warning</Tag>
          <Tag color="danger" closable onClose={() => undefined}>
            可关闭 Closable
          </Tag>
        </div>
      ),
    },
  ],
  api: [
    {
      title: 'Tag',
      rows: [
        { prop: 'color', type: "'default' | 'accent' | 'success' | 'warning' | 'danger'", defaultValue: "'default'", description: { 'zh-CN': '预设语义色', 'en-US': 'Preset semantic color' } },
        { prop: 'closable', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '显示关闭按钮', 'en-US': 'Show a close button' } },
        { prop: 'onClose', type: '() => void', description: { 'zh-CN': '关闭回调', 'en-US': 'Close callback' } },
        { prop: 'icon', type: 'ReactNode', description: { 'zh-CN': '前置图标', 'en-US': 'Leading icon' } },
        { prop: 'size', type: "'sm' | 'md'", defaultValue: "'md'", description: { 'zh-CN': '尺寸档位', 'en-US': 'Size preset' } },
      ],
    },
  ],
};

export const badgeDoc: ComponentDoc = {
  slug: 'badge',
  name: 'Badge',
  title: { 'zh-CN': '徽标', 'en-US': 'Badge' },
  category: DISPLAY,
  description: {
    'zh-CN': '角标数字或红点,可包裹目标;数字配 sr-only 通知文案,纯点 aria-hidden。',
    'en-US': 'Corner count or dot; numbers carry a screen-reader sentence, bare dots are hidden.',
  },
  renderPreview: () => (
    <Badge count={5}>
      <span style={AVATAR_BOX}>📮</span>
    </Badge>
  ),
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '数字与红点', 'en-US': 'Count & dot' },
      description: {
        'zh-CN': '超过 max 显示 `${max}+`;count 为 0 默认隐藏,showZero 保留。',
        'en-US': 'Over max shows `${max}+`; zero hides unless showZero is set.',
      },
      code: `
import { Badge } from '@ttqtt/liquid-glass-react';

<Badge count={8}><Avatar /></Badge>
<Badge count={100} /> {/* 99+ */}
<Badge dot><Bell /></Badge>`,
      render: () => (
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <Badge count={8}>
            <span style={AVATAR_BOX}>📮</span>
          </Badge>
          <Badge count={100} />
          <Badge dot>
            <span style={AVATAR_BOX}>🔔</span>
          </Badge>
        </div>
      ),
    },
  ],
  api: [
    {
      title: 'Badge',
      rows: [
        { prop: 'count', type: 'number', description: { 'zh-CN': '徽标数字', 'en-US': 'Badge count' } },
        { prop: 'max', type: 'number', defaultValue: '99', description: { 'zh-CN': '上限,超出显示 `${max}+`', 'en-US': 'Cap; over it shows `${max}+`' } },
        { prop: 'dot', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '纯红点模式', 'en-US': 'Bare dot mode' } },
        { prop: 'showZero', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': 'count 为 0 时是否显示', 'en-US': 'Show when count is zero' } },
        { prop: 'children', type: 'ReactNode', description: { 'zh-CN': '包裹目标,缺省独立显示', 'en-US': 'Wrapped target; standalone if absent' } },
      ],
    },
  ],
};

export const progressDoc: ComponentDoc = {
  slug: 'progress',
  name: 'Progress',
  title: { 'zh-CN': '进度条', 'en-US': 'Progress' },
  category: DISPLAY,
  description: {
    'zh-CN': '纯 tint 凹槽 + accent 填充;value 内部 clamp,支持不确定态流动动画。',
    'en-US': 'Tint groove with accent fill; value is clamped, with an indeterminate flow mode.',
  },
  renderPreview: () => (
    <div style={{ width: 160 }}>
      <Progress value={62} aria-label="preview" />
    </div>
  ),
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '确定与不确定', 'en-US': 'Determinate & indeterminate' },
      description: {
        'zh-CN': 'showValue 显示百分比;indeterminate 时省略 aria-valuenow,reduced-motion 降级。',
        'en-US': 'showValue prints the percent; indeterminate omits aria-valuenow and degrades gracefully.',
      },
      code: `
import { Progress } from '@ttqtt/liquid-glass-react';

<Progress value={62} showValue aria-label="上传" />
<Progress indeterminate aria-label="加载" />`,
      render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
          <Progress value={62} showValue aria-label="上传" />
          <Progress indeterminate aria-label="加载" />
        </div>
      ),
    },
  ],
  api: [
    {
      title: 'Progress',
      rows: [
        { prop: 'value', type: 'number', defaultValue: '0', description: { 'zh-CN': '0–100,内部 clamp', 'en-US': '0–100, clamped' } },
        { prop: 'indeterminate', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '不确定态流动动画', 'en-US': 'Indeterminate flow mode' } },
        { prop: 'showValue', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '尾部显示百分比', 'en-US': 'Trailing percent text' } },
        { prop: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: { 'zh-CN': '轨道粗细', 'en-US': 'Track thickness' } },
      ],
    },
  ],
};

export const spinDoc: ComponentDoc = {
  slug: 'spin',
  name: 'Spin',
  title: { 'zh-CN': '加载中', 'en-US': 'Spin' },
  category: DISPLAY,
  description: {
    'zh-CN': '环形加载指示器,role=status;包裹模式加半透明遮罩,与 Button loading 共享环样式。',
    'en-US': 'A ring loader (role=status); wrap mode adds a translucent overlay, ring shared with Button.',
  },
  renderPreview: () => <Spin />,
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '独立与包裹', 'en-US': 'Standalone & wrap' },
      description: {
        'zh-CN': '无 children 时独立显示;有 children 时遮罩覆盖内容并拦截交互。',
        'en-US': 'Standalone without children; wrapping children overlays and blocks interaction.',
      },
      code: `
import { Spin } from '@ttqtt/liquid-glass-react';

<Spin tip="加载中" />

<Spin>
  <Card />
</Spin>`,
      render: () => (
        <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
          <Spin tip="加载中 Loading" />
          <Spin>
            <div style={{ width: 200, padding: 20, borderRadius: 12, background: 'rgba(0,0,0,0.06)' }}>
              包裹内容 Wrapped content
            </div>
          </Spin>
        </div>
      ),
    },
  ],
  api: [
    {
      title: 'Spin',
      rows: [
        { prop: 'spinning', type: 'boolean', defaultValue: 'true', description: { 'zh-CN': '是否加载中', 'en-US': 'Whether it is loading' } },
        { prop: 'tip', type: 'ReactNode', description: { 'zh-CN': '指示文案', 'en-US': 'Caption text' } },
        { prop: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: { 'zh-CN': '尺寸档位', 'en-US': 'Size preset' } },
        { prop: 'children', type: 'ReactNode', description: { 'zh-CN': '包裹模式 + 遮罩', 'en-US': 'Wrap mode with overlay' } },
      ],
    },
  ],
};

export const skeletonDoc: ComponentDoc = {
  slug: 'skeleton',
  name: 'Skeleton',
  title: { 'zh-CN': '骨架屏', 'en-US': 'Skeleton' },
  category: DISPLAY,
  description: {
    'zh-CN': '纯 tint 占位 + shimmer;text/circle/rect 三形,aria-hidden,reduced-motion 静止。',
    'en-US': 'Tint placeholders with a shimmer; text/circle/rect, aria-hidden, still under reduced motion.',
  },
  renderPreview: () => (
    <div style={{ width: 160 }}>
      <Skeleton lines={2} />
    </div>
  ),
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '组合占位', 'en-US': 'Composed placeholder' },
      description: {
        'zh-CN': 'text 多行末行 60% 宽;circle/rect 用 width/height 控制尺寸。',
        'en-US': 'Multi-line text ends at 60%; circle/rect take width/height.',
      },
      code: `
import { Skeleton } from '@ttqtt/liquid-glass-react';

<Skeleton variant="circle" width={56} height={56} />
<Skeleton lines={3} />`,
      render: () => (
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', width: 360 }}>
          <Skeleton variant="circle" width={56} height={56} />
          <div style={{ flex: 1 }}>
            <Skeleton lines={3} />
          </div>
        </div>
      ),
    },
  ],
  api: [
    {
      title: 'Skeleton',
      rows: [
        { prop: 'variant', type: "'text' | 'circle' | 'rect'", defaultValue: "'text'", description: { 'zh-CN': '占位形状', 'en-US': 'Placeholder shape' } },
        { prop: 'width / height', type: 'number | string', description: { 'zh-CN': '尺寸,数字按 px', 'en-US': 'Size; numbers are px' } },
        { prop: 'lines', type: 'number', defaultValue: '1', description: { 'zh-CN': '仅 text,末行 60% 宽', 'en-US': 'Text only; last line 60% wide' } },
        { prop: 'animated', type: 'boolean', defaultValue: 'true', description: { 'zh-CN': 'shimmer 动画', 'en-US': 'Shimmer animation' } },
      ],
    },
  ],
};

export const cardDoc: ComponentDoc = {
  slug: 'card',
  name: 'Card',
  title: { 'zh-CN': '卡片', 'en-US': 'Card' },
  category: DISPLAY,
  description: {
    'zh-CN': '本批唯一玻璃主角:整卡一块真折射玻璃,material/dim/radius/interactive 直通引擎。',
    'en-US': 'The glass centrepiece: the whole card is one refracting surface, engine props passed through.',
  },
  renderPreview: () => (
    <div style={{ width: 160 }}>
      <Card padding="sm">玻璃卡片 Card</Card>
    </div>
  ),
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '容器与嵌套控件', 'en-US': 'Container & nested controls' },
      description: {
        'zh-CN':
          '卡内再放玻璃控件时,引擎会自动禁用其折射(玻璃套玻璃会中断背景采样)——这是既定行为,不是 bug。',
        'en-US':
          'Glass controls placed inside a Card automatically lose their own refraction (glass-in-glass breaks sampling) — this is intended engine behavior, not a bug.',
      },
      code: `
import { Card, Button } from '@ttqtt/liquid-glass-react';

<Card padding="lg">
  <h3>玻璃卡片</h3>
  <p>整卡一块真折射玻璃。</p>
  <Button variant="accent">卡内按钮(自动禁折射)</Button>
</Card>`,
      render: () => (
        <div style={{ width: 300 }}>
          <Card padding="lg">
            <h3 style={{ margin: '0 0 8px' }}>玻璃卡片 Glass Card</h3>
            <p style={{ margin: '0 0 12px' }}>
              卡内玻璃控件自动禁用折射(引擎既定行为,避免玻璃套玻璃采样)。
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="accent">主要</Button>
              <Button>次要</Button>
            </div>
          </Card>
        </div>
      ),
    },
  ],
  api: [
    {
      title: 'Card',
      rows: [
        { prop: 'as', type: 'ElementType', defaultValue: "'div'", description: { 'zh-CN': '语义宿主元素', 'en-US': 'Semantic host element' } },
        { prop: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", defaultValue: "'md'", description: { 'zh-CN': '内边距档位', 'en-US': 'Padding preset' } },
        { prop: 'material', type: "'regular' | 'clear'", defaultValue: "'regular'", description: { 'zh-CN': '玻璃材质', 'en-US': 'Glass material' } },
        { prop: 'dim', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '压暗背景', 'en-US': 'Dim the backdrop' } },
        { prop: 'radius', type: 'number | string', description: { 'zh-CN': '圆角(数字启用折射)', 'en-US': 'Corner radius (number enables refraction)' } },
        { prop: 'interactive', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '指针高光/按压反馈', 'en-US': 'Pointer highlight / press feedback' } },
      ],
    },
  ],
};

export const avatarDoc: ComponentDoc = {
  slug: 'avatar',
  name: 'Avatar',
  title: { 'zh-CN': '头像', 'en-US': 'Avatar' },
  category: DISPLAY,
  description: {
    'zh-CN': '圆形/方形头像,图片加载失败自动回退到文字缩写;纯文字走 role=img + aria-label。',
    'en-US': 'Circle/square avatar that falls back to initials on image error; text uses role=img.',
  },
  renderPreview: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Avatar alt="Ada" fallback="AL" />
      <Avatar alt="Bob" fallback="BM" shape="square" />
    </div>
  ),
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '尺寸与回退', 'en-US': 'Sizes & fallback' },
      description: {
        'zh-CN': 'src 缺省或加载失败时显示 fallback(文字缩写),alt 作为无障碍名。',
        'en-US': 'Missing or broken src shows the fallback; alt becomes the accessible name.',
      },
      code: `
import { Avatar } from '@ttqtt/liquid-glass-react';

<Avatar src="/ada.png" alt="Ada Lovelace" fallback="AL" />
<Avatar alt="Grace Hopper" fallback="GH" shape="square" />`,
      render: () => (
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Avatar alt="Ada" fallback="AL" size="sm" />
          <Avatar alt="Bob" fallback="BM" size="md" />
          <Avatar alt="Cara" fallback="CN" size="lg" />
          <Avatar alt="Dan" fallback="DM" size="lg" shape="square" />
        </div>
      ),
    },
  ],
  api: [
    {
      title: 'Avatar',
      rows: [
        { prop: 'src', type: 'string', description: { 'zh-CN': '图片地址', 'en-US': 'Image source' } },
        { prop: 'alt', type: 'string', description: { 'zh-CN': '替代文本 / 无障碍名', 'en-US': 'Alt text / accessible name' } },
        { prop: 'fallback', type: 'ReactNode', description: { 'zh-CN': '失败/缺省回退内容', 'en-US': 'Fallback content' } },
        { prop: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: { 'zh-CN': '尺寸档位', 'en-US': 'Size preset' } },
        { prop: 'shape', type: "'circle' | 'square'", defaultValue: "'circle'", description: { 'zh-CN': '形状', 'en-US': 'Shape' } },
      ],
    },
  ],
};

export const tableDoc: ComponentDoc = {
  slug: 'table',
  name: 'Table',
  title: { 'zh-CN': '表格', 'en-US': 'Table' },
  category: DISPLAY,
  description: {
    'zh-CN': '数据表格:点表头循环排序、行/全选(半选态)、分页联动,玻璃表头与行悬浮高光。受控/非受控双模,零运行时依赖。',
    'en-US': 'Data table: click-to-cycle sorting, row / select-all (with indeterminate), linked pagination, glass header and row-hover highlight. Controlled or uncontrolled, no runtime dependency.',
  },
  renderPreview: () => (
    <Table aria-label="成员预览" columns={MEMBER_COLUMNS} data={MEMBERS.slice(0, 3)} rowKey="id" />
  ),
  demos: [
    {
      id: 'full',
      title: { 'zh-CN': '排序 + 选中 + 分页', 'en-US': 'Sort + select + paginate' },
      description: {
        'zh-CN': 'sortable 列点击表头 asc→desc→无;selectable 加选择列,表头半选态自动计算;pagination 传 pageSize 即联动 Pagination,排序在翻页间保持。',
        'en-US': 'Click a sortable header to cycle asc→desc→none; selectable adds a selection column with an auto indeterminate header; pass pagination.pageSize to link Pagination, and sorting persists across pages.',
      },
      code: `
import { Table, type TableColumn } from '@ttqtt/liquid-glass-react';

interface Member { id: string; name: string; role: string; score: number }

const columns: TableColumn<Member>[] = [
  { key: 'name', title: '姓名', dataIndex: 'name', sortable: true },
  { key: 'role', title: '角色', dataIndex: 'role' },
  { key: 'score', title: '评分', dataIndex: 'score', sortable: true, align: 'right' },
];

<Table
  aria-label="成员"
  rowKey="id"
  columns={columns}
  data={members}
  selectable
  defaultSort={{ key: 'score', order: 'desc' }}
  pagination={{ pageSize: 3 }}
/>`,
      render: () => (
        <Table
          aria-label="成员"
          columns={MEMBER_COLUMNS}
          data={MEMBERS}
          rowKey="id"
          selectable
          defaultSort={{ key: 'score', order: 'desc' }}
          pagination={{ pageSize: 3 }}
        />
      ),
    },
  ],
  api: [
    {
      title: 'Table',
      rows: [
        { prop: 'columns', type: 'TableColumn<T>[]', description: { 'zh-CN': '列定义', 'en-US': 'Column definitions' } },
        { prop: 'data', type: 'T[]', description: { 'zh-CN': '行数据', 'en-US': 'Row data' } },
        { prop: 'rowKey', type: 'keyof T | (row) => string', description: { 'zh-CN': '行唯一键', 'en-US': 'Unique row key' } },
        { prop: 'sort / defaultSort', type: '{ key, order } | null', description: { 'zh-CN': '受控 / 非受控排序', 'en-US': 'Controlled / uncontrolled sort' } },
        { prop: 'onSortChange', type: '(sort) => void', description: { 'zh-CN': '排序变化', 'en-US': 'Sort change' } },
        { prop: 'selectable', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '开启行选择列', 'en-US': 'Enable the selection column' } },
        { prop: 'selectedKeys / defaultSelectedKeys', type: 'string[]', description: { 'zh-CN': '受控 / 非受控选中', 'en-US': 'Controlled / uncontrolled selection' } },
        { prop: 'onSelectionChange', type: '(keys) => void', description: { 'zh-CN': '选中变化', 'en-US': 'Selection change' } },
        { prop: 'pagination', type: '{ pageSize, page?, onChange? } | false', defaultValue: 'false', description: { 'zh-CN': '分页(联动 Pagination)', 'en-US': 'Pagination (links Pagination)' } },
        { prop: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: { 'zh-CN': '尺寸', 'en-US': 'Size' } },
        { prop: 'emptyText', type: 'ReactNode', description: { 'zh-CN': '空数据占位', 'en-US': 'Empty placeholder' } },
      ],
    },
    {
      title: 'TableColumn<T>',
      rows: [
        { prop: 'key', type: 'string', description: { 'zh-CN': '列唯一键', 'en-US': 'Unique column key' } },
        { prop: 'title', type: 'ReactNode', description: { 'zh-CN': '表头', 'en-US': 'Header content' } },
        { prop: 'dataIndex', type: 'keyof T', description: { 'zh-CN': '取值字段', 'en-US': 'Field to read' } },
        { prop: 'render', type: '(row, index) => ReactNode', description: { 'zh-CN': '自定义单元格', 'en-US': 'Custom cell' } },
        { prop: 'sortable', type: 'boolean', description: { 'zh-CN': '可排序', 'en-US': 'Sortable' } },
        { prop: 'sorter', type: '(a, b) => number', description: { 'zh-CN': '自定义比较(缺省按 dataIndex)', 'en-US': 'Custom comparator (defaults to dataIndex)' } },
        { prop: 'align', type: "'left' | 'center' | 'right'", description: { 'zh-CN': '对齐', 'en-US': 'Alignment' } },
        { prop: 'width', type: 'number | string', description: { 'zh-CN': '列宽', 'en-US': 'Column width' } },
      ],
    },
  ],
};
