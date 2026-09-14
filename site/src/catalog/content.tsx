import { useState } from 'react';
import {
  Card, Concentric, Divider, GlassSwitch, LibraryIcon, List, ListRow, ListSection, MaterialView, Text,
} from '@ttqtt/liquid-glass-react';
import type { ComponentDoc } from './types.js';

export const contentDocs: ComponentDoc[] = [
  {
    slug: 'text', name: 'Text', group: '内容层',
    summary: '按 iOS 文本样式排版，并随 Dynamic Type 缩放。',
    rule: '用内建文本样式，不要只靠字号堆层级。11pt（caption2）是可读文本的下限，任何界面文字都不应低于它。',
    demoHeight: 300,
    example: () => <div style={{ display: 'grid', gap: 10, textAlign: 'start' }}>
      <Text as="h3" variant="largeTitle" emphasized>Large Title</Text>
      <Text variant="title2" emphasized>Title 2</Text>
      <Text variant="headline">Headline 会用 semibold</Text>
      <Text variant="body">Body 17/22，是正文的基准样式。</Text>
      <Text variant="subhead" tone="secondary">Subhead 常用于次级说明</Text>
      <Text variant="footnote" tone="secondary">Footnote 13/18</Text>
      <Text variant="caption2" tone="tertiary">Caption 2 — 11pt，可读下限</Text>
      <Text variant="body" tabular>1,204 · 09:41 · 62%</Text>
    </div>,
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
    example: () => <Card radius={26} padding={16} raised style={{ width: 280 }}>
      <Concentric minimum={12} style={{ height: 96, background: 'var(--lg-fill-tertiary)', display: 'grid', placeItems: 'center' }}>
        <Text variant="caption1" tone="secondary">半径 26 − 内边距 16 = 14</Text>
      </Concentric>
      <Text variant="headline" style={{ marginBlockStart: 12 }}>同心圆角</Text>
      <Text variant="footnote" tone="secondary">内圆角过大会“掐角”，过小会“喇叭口”。</Text>
    </Card>,
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
      const [wifi, setWifi] = useState(true);
      return <List style={{ width: 320 }}>
        <ListSection header="显示与亮度" footer="这些设置只影响本次演示。">
          <ListRow label="外观" value="浅色" href="#/components/list" />
          <ListRow label="文字大小" secondaryLabel="影响全站排版" value="标准" href="#/components/list" />
        </ListSection>
        <ListSection header="网络">
          <ListRow label="Wi‑Fi" leading={<LibraryIcon name="search" size={20} />}
            accessory={<GlassSwitch aria-label="Wi‑Fi" checked={wifi} onCheckedChange={setWifi} />} />
          <ListRow label="移除此网络" destructive onSelect={() => {}} disclosure={false} />
        </ListSection>
      </List>;
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
    example: () => <div style={{ display: 'grid', gap: 10, width: 260 }}>
      {(['ultraThin', 'thin', 'regular', 'thick'] as const).map(thickness =>
        <MaterialView key={thickness} thickness={thickness} radius={14} style={{ padding: 12 }}>
          <Text variant="subhead" emphasized>{thickness}</Text>
          <Text variant="caption1" tone="secondary">越厚对比越高，越薄保留越多上下文</Text>
        </MaterialView>)}
    </div>,
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
    example: () => <div style={{ width: 260 }}>
      <Text variant="body">上一段</Text>
      <Divider style={{ marginBlock: 12 }} />
      <Text variant="body">下一段</Text>
      <Divider inset={32} style={{ marginBlock: 12 }} />
      <Text variant="footnote" tone="secondary">带 inset，与文字起始位置对齐</Text>
    </div>,
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
