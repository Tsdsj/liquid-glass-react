import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { GlassBadge, GlassButton, GlassIconButton, GlassProgress, GlassSegmentedControl, GlassSlider, GlassStepper, GlassSwitch, Text, } from '@liquid-glass-ui/react';
import { Icon } from '../icons.js';
export const controlDocs = [
    {
        slug: 'button', name: 'GlassButton', group: '控件',
        summary: '七种样式，从浮动玻璃到内容层的扁平按钮。',
        rule: '区分首选项的是样式而不是尺寸，一个视图里最多一个 prominent。tint 只加在这一个主操作的背景上，标签保持白色——如果什么都被着色，就什么都不突出。',
        backdrop: 'both', demoHeight: 260,
        example: function ButtonExample() {
            const [count, setCount] = useState(0);
            return _jsxs("div", { style: { display: 'grid', gap: 12, justifyItems: 'center' }, children: [_jsxs("div", { style: { display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }, children: [_jsx(GlassButton, { onClick: () => setCount(n => n + 1), children: "Glass" }), _jsx(GlassButton, { variant: "glassProminent", onClick: () => setCount(n => n + 1), children: "\u4E3B\u64CD\u4F5C" }), _jsx(GlassIconButton, { "aria-label": "\u6536\u85CF", onClick: () => setCount(n => n + 1), children: _jsx(Icon, { name: "heart" }) })] }), _jsxs("div", { style: { display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }, children: [_jsx(GlassButton, { variant: "plain", children: "Plain" }), _jsx(GlassButton, { variant: "gray", children: "Gray" }), _jsx(GlassButton, { variant: "tinted", children: "Tinted" }), _jsx(GlassButton, { variant: "destructive", children: "\u5220\u9664" })] }), _jsxs("div", { style: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }, children: [_jsx(GlassButton, { controlSize: "small", children: "Small" }), _jsx(GlassButton, { controlSize: "large", children: "Large" }), _jsx(GlassButton, { disabled: true, children: "\u4E0D\u53EF\u7528" }), _jsx(GlassButton, { loading: true, children: "\u5904\u7406\u4E2D" })] }), _jsxs(Text, { variant: "caption1", tone: "secondary", role: "status", children: ["\u6309\u4E0B\u8BA1\u6570\uFF1A", count] })] });
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
            const [value, setValue] = useState('week');
            return _jsxs("div", { style: { display: 'grid', gap: 12, justifyItems: 'center' }, children: [_jsx(GlassSegmentedControl, { "aria-label": "\u65F6\u95F4\u8303\u56F4", value: value, onValueChange: setValue, items: [{ value: 'day', label: '日' }, { value: 'week', label: '周' }, { value: 'month', label: '月' }, { value: 'year', label: '年', disabled: true }] }), _jsxs(Text, { variant: "caption1", tone: "secondary", children: ["\u6309\u4F4F\u9009\u4E2D\u9879\u5DE6\u53F3\u62D6\u52A8\u8BD5\u8BD5 \u00B7 \u5F53\u524D\uFF1A", value] })] });
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
            const [on, setOn] = useState(true);
            const [off, setOff] = useState(false);
            return _jsxs("div", { style: { display: 'grid', gap: 14, justifyItems: 'start' }, children: [_jsx(GlassSwitch, { "aria-label": "Wi\u2011Fi", label: "Wi\u2011Fi", checked: on, onCheckedChange: setOn }), _jsx(GlassSwitch, { "aria-label": "\u4F4E\u6570\u636E\u6A21\u5F0F", label: "\u4F4E\u6570\u636E\u6A21\u5F0F", checked: off, onCheckedChange: setOff }), _jsx(GlassSwitch, { "aria-label": "\u4E0D\u53EF\u7528\u5F00\u5173", label: "\u4E0D\u53EF\u7528", disabled: true }), _jsx(Text, { variant: "caption1", tone: "secondary", children: "\u6309\u4F4F\u65CB\u94AE\u5411\u4EFB\u4E00\u4FA7\u7529\u52A8\u8BD5\u8BD5" })] });
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
            const [volume, setVolume] = useState(62);
            return _jsxs("div", { style: { display: 'grid', gap: 14, width: 300 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx(Text, { variant: "subhead", children: "\u97F3\u91CF" }), _jsxs(Text, { variant: "subhead", tone: "secondary", tabular: true, children: [volume, "%"] })] }), _jsx(GlassSlider, { "aria-label": "\u97F3\u91CF", value: volume, onValueChange: setVolume, formatValue: v => `${v} 百分比`, minLabel: _jsx(Icon, { name: "volume", size: 16 }), maxLabel: _jsx(Icon, { name: "volume", size: 20 }) }), _jsx(GlassSlider, { "aria-label": "\u4E0D\u53EF\u7528\u6ED1\u5757", defaultValue: 30, disabled: true })] });
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
            const [count, setCount] = useState(2);
            return _jsxs("div", { style: { display: 'grid', gap: 12, justifyItems: 'center' }, children: [_jsx(GlassStepper, { "aria-label": "\u4EFD\u6570", value: count, onValueChange: setCount, min: 1, max: 9, decrementLabel: "\u51CF\u5C11\u4EFD\u6570", incrementLabel: "\u589E\u52A0\u4EFD\u6570" }), _jsx(Text, { variant: "caption1", tone: "secondary", children: "\u5230\u8FBE\u8FB9\u754C\u65F6\u5BF9\u5E94\u6309\u94AE\u81EA\u52A8\u7981\u7528" })] });
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
            const [value, setValue] = useState(38);
            return _jsxs("div", { style: { display: 'grid', gap: 16, width: 280 }, children: [_jsx(GlassProgress, { "aria-label": "\u5BFC\u51FA\u8FDB\u5EA6", value: value }), _jsx(GlassSlider, { "aria-label": "\u8C03\u6574\u6F14\u793A\u8FDB\u5EA6", value: value, onValueChange: setValue }), _jsx("div", { style: { display: 'flex', gap: 12, alignItems: 'center' }, children: _jsx(GlassProgress, { "aria-label": "\u4E0D\u786E\u5B9A\u8FDB\u5EA6" }) }), _jsxs("div", { style: { display: 'flex', gap: 12, alignItems: 'center' }, children: [_jsx(GlassProgress, { "aria-label": "\u8F7D\u5165\u4E2D", variant: "circular" }), _jsx(Text, { variant: "footnote", tone: "secondary", children: "\u4E0D\u786E\u5B9A\u7684\u5706\u73AF" })] })] });
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
        example: () => _jsxs("div", { style: { display: 'flex', gap: 16, alignItems: 'center' }, children: [_jsx(GlassBadge, { count: 3, "aria-label": "3 \u6761\u672A\u8BFB\u6D88\u606F" }), _jsx(GlassBadge, { count: 128, max: 99, "aria-label": "128 \u6761\u672A\u8BFB\u6D88\u606F" }), _jsx(GlassBadge, { tone: "neutral", children: "Beta" }), _jsx(GlassBadge, { tone: "accent", children: "New" }), _jsx(GlassBadge, { dot: true, "aria-label": "\u6709\u66F4\u65B0" })] }),
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
