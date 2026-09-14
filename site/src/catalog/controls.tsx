import { useState } from 'react';
import {
  GlassBadge, GlassButton, GlassIconButton, GlassProgress, GlassSegmentedControl,
  GlassSlider, GlassStepper, GlassSwitch, Text,
} from '@ttqtt/liquid-glass-react';
import { Icon } from '../icons.js';
import type { ComponentDoc } from './types.js';

export const controlDocs: ComponentDoc[] = [
  {
    slug: 'button', name: 'GlassButton', group: '控件',
    summary: '七种样式，从浮动玻璃到内容层的扁平按钮。',
    rule: '区分首选项的是样式而不是尺寸，一个视图里最多一个 prominent。tint 只加在这一个主操作的背景上，标签保持白色——如果什么都被着色，就什么都不突出。',
    backdrop: 'both', demoHeight: 260,
    example: function ButtonExample() {
      const [count, setCount] = useState(0);
      return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <GlassButton onClick={() => setCount(n => n + 1)}>Glass</GlassButton>
          <GlassButton variant="glassProminent" onClick={() => setCount(n => n + 1)}>主操作</GlassButton>
          <GlassIconButton aria-label="收藏" onClick={() => setCount(n => n + 1)}><Icon name="heart" /></GlassIconButton>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <GlassButton variant="plain">Plain</GlassButton>
          <GlassButton variant="gray">Gray</GlassButton>
          <GlassButton variant="tinted">Tinted</GlassButton>
          <GlassButton variant="destructive">删除</GlassButton>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <GlassButton controlSize="small">Small</GlassButton>
          <GlassButton controlSize="large">Large</GlassButton>
          <GlassButton disabled>不可用</GlassButton>
          <GlassButton loading>处理中</GlassButton>
        </div>
        <Text variant="caption1" tone="secondary" role="status">按下计数：{count}</Text>
      </div>;
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
      return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
        <GlassSegmentedControl aria-label="时间范围" value={value} onValueChange={setValue}
          items={[{ value: 'day', label: '日' }, { value: 'week', label: '周' }, { value: 'month', label: '月' }, { value: 'year', label: '年', disabled: true }]} />
        <Text variant="caption1" tone="secondary">按住选中项左右拖动试试 · 当前：{value}</Text>
      </div>;
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
      return <div style={{ display: 'grid', gap: 14, justifyItems: 'start' }}>
        <GlassSwitch aria-label="Wi‑Fi" label="Wi‑Fi" checked={on} onCheckedChange={setOn} />
        <GlassSwitch aria-label="低数据模式" label="低数据模式" checked={off} onCheckedChange={setOff} />
        <GlassSwitch aria-label="不可用开关" label="不可用" disabled />
        <Text variant="caption1" tone="secondary">按住旋钮向任一侧甩动试试</Text>
      </div>;
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
      return <div style={{ display: 'grid', gap: 14, width: 300 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text variant="subhead">音量</Text>
          <Text variant="subhead" tone="secondary" tabular>{volume}%</Text>
        </div>
        <GlassSlider aria-label="音量" value={volume} onValueChange={setVolume} formatValue={v => `${v} 百分比`}
          minLabel={<Icon name="volume" size={16} />} maxLabel={<Icon name="volume" size={20} />} />
        <GlassSlider aria-label="不可用滑块" defaultValue={30} disabled />
      </div>;
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
      return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
        <GlassStepper aria-label="份数" value={count} onValueChange={setCount} min={1} max={9}
          decrementLabel="减少份数" incrementLabel="增加份数" />
        <Text variant="caption1" tone="secondary">到达边界时对应按钮自动禁用</Text>
      </div>;
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
      return <div style={{ display: 'grid', gap: 16, width: 280 }}>
        <GlassProgress aria-label="导出进度" value={value} />
        <GlassSlider aria-label="调整演示进度" value={value} onValueChange={setValue} />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <GlassProgress aria-label="不确定进度" />
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <GlassProgress aria-label="载入中" variant="circular" />
          <Text variant="footnote" tone="secondary">不确定的圆环</Text>
        </div>
      </div>;
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
    example: () => <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <GlassBadge count={3} aria-label="3 条未读消息" />
      <GlassBadge count={128} max={99} aria-label="128 条未读消息" />
      <GlassBadge tone="neutral">Beta</GlassBadge>
      <GlassBadge tone="accent">New</GlassBadge>
      <GlassBadge dot aria-label="有更新" />
    </div>,
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
