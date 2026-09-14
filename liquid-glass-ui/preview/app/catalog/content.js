import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, Concentric, Divider, GlassSwitch, LibraryIcon, List, ListRow, ListSection, MaterialView, Text, } from '@liquid-glass-ui/react';
export const contentDocs = [
    {
        slug: 'text', name: 'Text', group: '内容层',
        summary: '按 iOS 文本样式排版，并随 Dynamic Type 缩放。',
        rule: '用内建文本样式，不要只靠字号堆层级。11pt（caption2）是可读文本的下限，任何界面文字都不应低于它。',
        demoHeight: 300,
        example: () => _jsxs("div", { style: { display: 'grid', gap: 10, textAlign: 'start' }, children: [_jsx(Text, { as: "h3", variant: "largeTitle", emphasized: true, children: "Large Title" }), _jsx(Text, { variant: "title2", emphasized: true, children: "Title 2" }), _jsx(Text, { variant: "headline", children: "Headline \u4F1A\u7528 semibold" }), _jsx(Text, { variant: "body", children: "Body 17/22\uFF0C\u662F\u6B63\u6587\u7684\u57FA\u51C6\u6837\u5F0F\u3002" }), _jsx(Text, { variant: "subhead", tone: "secondary", children: "Subhead \u5E38\u7528\u4E8E\u6B21\u7EA7\u8BF4\u660E" }), _jsx(Text, { variant: "footnote", tone: "secondary", children: "Footnote 13/18" }), _jsx(Text, { variant: "caption2", tone: "tertiary", children: "Caption 2 \u2014 11pt\uFF0C\u53EF\u8BFB\u4E0B\u9650" }), _jsx(Text, { variant: "body", tabular: true, children: "1,204 \u00B7 09:41 \u00B7 62%" })] }),
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
        example: () => _jsxs(Card, { radius: 26, padding: 16, raised: true, style: { width: 280 }, children: [_jsx(Concentric, { minimum: 12, style: { height: 96, background: 'var(--lg-fill-tertiary)', display: 'grid', placeItems: 'center' }, children: _jsx(Text, { variant: "caption1", tone: "secondary", children: "\u534A\u5F84 26 \u2212 \u5185\u8FB9\u8DDD 16 = 14" }) }), _jsx(Text, { variant: "headline", style: { marginBlockStart: 12 }, children: "\u540C\u5FC3\u5706\u89D2" }), _jsx(Text, { variant: "footnote", tone: "secondary", children: "\u5185\u5706\u89D2\u8FC7\u5927\u4F1A\u201C\u6390\u89D2\u201D\uFF0C\u8FC7\u5C0F\u4F1A\u201C\u5587\u53ED\u53E3\u201D\u3002" })] }),
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
            return _jsxs(List, { style: { width: 320 }, children: [_jsxs(ListSection, { header: "\u663E\u793A\u4E0E\u4EAE\u5EA6", footer: "\u8FD9\u4E9B\u8BBE\u7F6E\u53EA\u5F71\u54CD\u672C\u6B21\u6F14\u793A\u3002", children: [_jsx(ListRow, { label: "\u5916\u89C2", value: "\u6D45\u8272", href: "#/components/list" }), _jsx(ListRow, { label: "\u6587\u5B57\u5927\u5C0F", secondaryLabel: "\u5F71\u54CD\u5168\u7AD9\u6392\u7248", value: "\u6807\u51C6", href: "#/components/list" })] }), _jsxs(ListSection, { header: "\u7F51\u7EDC", children: [_jsx(ListRow, { label: "Wi\u2011Fi", leading: _jsx(LibraryIcon, { name: "search", size: 20 }), accessory: _jsx(GlassSwitch, { "aria-label": "Wi\u2011Fi", checked: wifi, onCheckedChange: setWifi }) }), _jsx(ListRow, { label: "\u79FB\u9664\u6B64\u7F51\u7EDC", destructive: true, onSelect: () => { }, disclosure: false })] })] });
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
        example: () => _jsx("div", { style: { display: 'grid', gap: 10, width: 260 }, children: ['ultraThin', 'thin', 'regular', 'thick'].map(thickness => _jsxs(MaterialView, { thickness: thickness, radius: 14, style: { padding: 12 }, children: [_jsx(Text, { variant: "subhead", emphasized: true, children: thickness }), _jsx(Text, { variant: "caption1", tone: "secondary", children: "\u8D8A\u539A\u5BF9\u6BD4\u8D8A\u9AD8\uFF0C\u8D8A\u8584\u4FDD\u7559\u8D8A\u591A\u4E0A\u4E0B\u6587" })] }, thickness)) }),
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
        example: () => _jsxs("div", { style: { width: 260 }, children: [_jsx(Text, { variant: "body", children: "\u4E0A\u4E00\u6BB5" }), _jsx(Divider, { style: { marginBlock: 12 } }), _jsx(Text, { variant: "body", children: "\u4E0B\u4E00\u6BB5" }), _jsx(Divider, { inset: 32, style: { marginBlock: 12 } }), _jsx(Text, { variant: "footnote", tone: "secondary", children: "\u5E26 inset\uFF0C\u4E0E\u6587\u5B57\u8D77\u59CB\u4F4D\u7F6E\u5BF9\u9F50" })] }),
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
