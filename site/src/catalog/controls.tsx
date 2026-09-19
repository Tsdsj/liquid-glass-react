import { useState } from 'react';
import {
  GlassBadge, GlassButton, GlassIconButton, GlassProgress, GlassSegmentedControl,
  GlassSlider, GlassStepper, GlassSwitch, LibraryIcon, Text,
} from '@ttqtt/liquid-glass-react';
import { Icon } from '../icons.js';
import type { ComponentDoc } from './types.js';

export const controlDocs: ComponentDoc[] = [
  {
    slug: 'button', name: 'GlassButton', title: '按钮', group: '控件',
    summary: '七种样式，从浮在内容之上的玻璃按钮到内容里的扁平按钮。',
    when: [
      '一屏里最多一个主操作。把它设成 glassProminent，其余保持普通——都强调就等于都不强调。',
      '按钮浮在内容之上（工具栏、媒体控制）时用玻璃；嵌在内容里时用 plain、gray 或 tinted。',
      '删除这类不可逆的操作用 destructive，并且配上确认或撤销。',
    ],
    examples: [
      {
        id: 'button-variants', title: '七种样式', description: '前两种是浮动层的玻璃，后五种是内容里的扁平按钮。',
        backdrop: 'both', height: 230,
        render: function ButtonVariants() {
          const [count, setCount] = useState(0);
          return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              <GlassButton onClick={() => setCount(n => n + 1)}>玻璃</GlassButton>
              <GlassButton variant="glassProminent" onClick={() => setCount(n => n + 1)}>主操作</GlassButton>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              <GlassButton variant="plain">文字</GlassButton>
              <GlassButton variant="gray">灰底</GlassButton>
              <GlassButton variant="tinted">淡色</GlassButton>
              <GlassButton variant="destructive">删除</GlassButton>
            </div>
            <Text variant="caption1" tone="secondary" role="status">按了 {count} 次</Text>
          </div>;
        },
        code: `<GlassButton>玻璃</GlassButton>
<GlassButton variant="glassProminent">主操作</GlassButton>
<GlassButton variant="plain">文字</GlassButton>
<GlassButton variant="destructive">删除</GlassButton>`,
      },
      {
        id: 'button-size', title: '尺寸', description: '视觉可以更小，但手指能点到的范围不会小于 44×44。',
        height: 180,
        render: () => <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <GlassButton controlSize="small">小</GlassButton>
          <GlassButton>默认</GlassButton>
          <GlassButton controlSize="large">大</GlassButton>
          <GlassButton controlSize="extraLarge">超大</GlassButton>
        </div>,
        code: `<GlassButton controlSize="small">小</GlassButton>
<GlassButton controlSize="large">大</GlassButton>`,
      },
      {
        id: 'button-state', title: '不可用与处理中', description: '处理中同时不可点，并会告诉读屏“正在忙”。',
        height: 180,
        render: () => <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <GlassButton disabled>不可用</GlassButton>
          <GlassButton loading>处理中</GlassButton>
          <GlassButton variant="destructive" disabled>删除</GlassButton>
        </div>,
        code: `<GlassButton disabled>不可用</GlassButton>
<GlassButton loading>处理中</GlassButton>`,
      },
      {
        id: 'button-icon', title: '图标按钮', description: '没有可见文字，所以必须给一个名字，否则读屏只会念“按钮”。',
        backdrop: 'both', height: 170,
        render: function IconButtons() {
          const [liked, setLiked] = useState(false);
          return <div style={{ display: 'flex', gap: 10 }}>
            <GlassIconButton aria-label={liked ? '取消收藏' : '收藏'} aria-pressed={liked} onClick={() => setLiked(!liked)}>
              <Icon name="heart" style={liked ? { fill: 'currentColor' } : undefined} />
            </GlassIconButton>
            <GlassIconButton aria-label="分享"><Icon name="arrow" /></GlassIconButton>
            <GlassIconButton aria-label="更多"><Icon name="more" /></GlassIconButton>
          </div>;
        },
        code: `<GlassIconButton aria-label="收藏" aria-pressed={liked} onClick={toggle}>
  <HeartIcon />
</GlassIconButton>`,
      },
      {
        id: 'button-icons', title: '图标插槽', description: 'icon 和 trailingIcon 是插槽，不是 children——图标和文字之间的间距是系统值，不该由每个调用方自己决定。',
        height: 200,
        render: () => <div id="button-icons-demo" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <GlassButton icon={<LibraryIcon name="plus" size={17} />}>新建</GlassButton>
          <GlassButton trailingIcon={<LibraryIcon name="chevronForward" size={16} />}>继续</GlassButton>
          <GlassButton variant="gray" icon={<LibraryIcon name="search" size={17} />}
            trailingIcon={<LibraryIcon name="chevronDown" size={16} />}>筛选</GlassButton>
        </div>,
        code: `<GlassButton icon={<PlusIcon />}>新建</GlassButton>
<GlassButton trailingIcon={<ChevronIcon />}>继续</GlassButton>`,
      },
      {
        id: 'button-tint', title: '单个按钮的色调',
        description: '一屏仍然只有**一个**主操作——tint 换的是它的颜色，不是让你摆三个。其余的用扁平的 tinted。色调需要配一个能读的文字色，而这一点算不出来，所以开发模式会量这一对的对比度，低于 4.5:1 就告警。',
        height: 200,
        render: () => <div id="button-tint-demo" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <GlassButton variant="glassProminent" tint="#1a7f37">确认</GlassButton>
          <GlassButton variant="tinted" tint="#8250df">升级</GlassButton>
          <GlassButton variant="tinted">默认强调色</GlassButton>
        </div>,
        code: `{/* 这一屏唯一的主操作 */}
<GlassButton variant="glassProminent" tint="#1a7f37">确认</GlassButton>
{/* 其余的是扁平的 */}
<GlassButton variant="tinted" tint="#8250df">升级</GlassButton>
{/* 浅色调要自己配文字色 */}
<GlassButton variant="tinted" tint="#ffd60a" tintContrast="#000">注意</GlassButton>`,
      },
    ],
    props: [
      { name: 'variant', type: "'glass' | 'glassProminent' | 'plain' | 'gray' | 'tinted' | 'destructive' | 'destructiveProminent'", default: "'glass'", description: '样式。前两种属于浮动层，其余属于内容层。' },
      { name: 'controlSize', type: "'small' | 'regular' | 'large' | 'extraLarge'", default: "'regular'", description: '按钮高度。' },
      { name: 'size', type: "'small' | 'large'", default: "'small'", description: '玻璃的厚薄。大玻璃更厚，而且不会随背景明暗翻转。' },
      { name: 'icon / trailingIcon', type: 'ReactNode', description: '前后的图标插槽。间距固定。' },
      { name: 'tint / tintContrast', type: 'string', description: '这一个按钮的色调，以及压在它上面的文字色（默认白）。开发模式会量对比度。' },
      { name: 'loading', type: 'boolean', default: 'false', description: '显示转圈，同时禁用。' },
      { name: 'chroma', type: 'boolean', default: 'false', description: '让边缘像真玻璃一样出现色散。开销大约三倍，只给少数几个元素用。' },
      { name: 'independent', type: 'boolean', default: 'false', description: '在工具栏这类共享背景里仍然保留自己的玻璃。会变成玻璃叠玻璃，慎用。' },
    ],
    notes: [
      '默认是普通按钮，不会误提交表单。',
      '回车和空格的按下反馈和鼠标完全一致。',
      '在触摸屏上，即使按钮看起来更小，可点范围也会补足到 44×44。',
      '图标按钮的名字是必填的，类型层面就会提醒你。',
    ],
    related: ['toolbar', 'menu', 'segmented-control'],
    imports: ['GlassButton', 'GlassIconButton'],
  },
  {
    slug: 'segmented-control', name: 'GlassSegmentedControl', title: '分段控件', group: '控件',
    summary: '在 2–5 个并列选项里选一个。',
    when: [
      '选项数量固定、都能一眼看完，并且需要立刻切换视图或范围。',
      '选项超过五个，或者名字很长，改用下拉菜单。',
      '这是选择，不是操作。不要拿它当一排按钮用。',
    ],
    examples: [
      {
        id: 'segmented-basic', title: '基础用法', description: '按住当前选项左右滑动就能换，手指到哪它跟到哪——松手前就已经切好了。',
        height: 200,
        render: function SegmentedBasic() {
          const [value, setValue] = useState('week');
          return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassSegmentedControl aria-label="时间范围" value={value} onValueChange={setValue}
              items={[{ value: 'day', label: '日' }, { value: 'week', label: '周' }, { value: 'month', label: '月' }]} />
            <Text variant="caption1" tone="secondary">当前：{value}</Text>
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
      },
      {
        id: 'segmented-disabled', title: '不可选与紧凑', description: '暂时不能选的项留在原位，不要让它消失导致其它项跳动。',
        height: 190,
        render: () => <div style={{ display: 'grid', gap: 14, justifyItems: 'center' }}>
          <GlassSegmentedControl aria-label="时间范围（含不可选）" defaultValue="week"
            items={[{ value: 'day', label: '日' }, { value: 'week', label: '周' }, { value: 'year', label: '年', disabled: true }]} />
          <GlassSegmentedControl aria-label="密度" density="compact" defaultValue="b"
            items={[{ value: 'a', label: '紧凑' }, { value: 'b', label: '常规' }]} />
        </div>,
        code: `<GlassSegmentedControl
  aria-label="时间范围"
  items={[
    { value: 'week', label: '周' },
    { value: 'year', label: '年', disabled: true },
  ]}
/>`,
      },
    ],
    props: [
      { name: 'items', type: 'GlassChoice[]', required: true, description: '2–5 项。全用文字或全用图标，不要混。' },
      { name: 'value / defaultValue', type: 'string', description: '受控或非受控的选中值。' },
      { name: 'onValueChange', type: '(value: string) => void', description: '拖动过程中就会触发，不等到松手。' },
      { name: 'name', type: 'string', description: '表单字段名。' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '整组不可用。' },
      { name: 'aria-label', type: 'string', required: true, description: '这组选项是在选什么。' },
    ],
    notes: [
      '底层是浏览器原生的单选按钮，能参与表单提交，方向键切换也是浏览器自带的。',
      '横向拖动归控件，纵向滚动仍然归页面，两者不会打架。',
      '用户开启“减少动效”后只保留点击选择。',
    ],
    related: ['tabs', 'switch', 'tab-bar'],
  },
  {
    slug: 'switch', name: 'GlassSwitch', title: '开关', group: '控件',
    summary: '打开或关闭一件事，改动立刻生效。',
    when: [
      '设置项里的二选一，并且切换之后马上就生效，不需要再点“保存”。',
      '标签写打开之后的状态：写“Wi‑Fi”，不要写“启用 Wi‑Fi”。',
      '如果改动需要确认才生效，用复选框加一个提交按钮，不要用开关。',
    ],
    examples: [
      {
        id: 'switch-basic', title: '基础用法', description: '除了点，还可以按住旋钮往任意一侧甩过去，往哪甩就是哪个结果。',
        height: 210,
        render: function SwitchBasic() {
          const [wifi, setWifi] = useState(true);
          const [low, setLow] = useState(false);
          return <div style={{ display: 'grid', gap: 14, justifyItems: 'start' }}>
            <GlassSwitch aria-label="Wi‑Fi" label="Wi‑Fi" checked={wifi} onCheckedChange={setWifi} />
            <GlassSwitch aria-label="低数据模式" label="低数据模式" checked={low} onCheckedChange={setLow} />
            <GlassSwitch aria-label="不可用开关" label="暂不可用" disabled />
          </div>;
        },
        code: `<GlassSwitch aria-label="Wi‑Fi" label="Wi‑Fi"
  checked={enabled} onCheckedChange={setEnabled} />`,
      },
    ],
    props: [
      { name: 'checked / defaultChecked', type: 'boolean', description: '受控或非受控状态。' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', description: '点击或拖动松手时触发。' },
      { name: 'label', type: 'string', description: '开关旁边的可见文字。' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '不可用。' },
      { name: 'name', type: 'string', description: '提交表单时用的字段名——底层是真正的 checkbox。' },
      { name: 'aria-label', type: 'string', required: true, description: '描述打开之后的状态。' },
    ],
    notes: [
      '底层是原生复选框，空格键切换。',
      '一次明确的拖动不会再额外触发一次点击，所以不会切换两遍。',
      '打开时是系统绿色，不跟随主题色——这是这个控件的固定含义。',
    ],
    related: ['list', 'segmented-control'],
  },
  {
    slug: 'slider', name: 'GlassSlider', title: '滑块', group: '控件',
    summary: '在一段连续范围里取值。',
    when: [
      '取值范围连续、并且调整时能立刻看到或听到效果，比如音量、亮度、缩放。',
      '两端可以放小图标说明方向。',
      '只有几个离散档位时，用分段控件或步进器更清楚。',
    ],
    examples: [
      {
        id: 'slider-basic', title: '基础用法', description: '旋钮平时是安静的，只有被按住拖动时才变成玻璃。',
        height: 200,
        render: function SliderBasic() {
          const [volume, setVolume] = useState(62);
          return <div style={{ display: 'grid', gap: 14, width: 300 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text variant="subhead">音量</Text>
              <Text variant="subhead" tone="secondary" tabular>{volume}%</Text>
            </div>
            <GlassSlider aria-label="音量" value={volume} onValueChange={setVolume} formatValue={v => `${v} 百分比`} />
          </div>;
        },
        code: `<GlassSlider
  aria-label="音量"
  value={volume}
  onValueChange={setVolume}
  formatValue={v => \`\${v} 百分比\`}
/>`,
      },
      {
        id: 'slider-labels', title: '两端图标与不可用', description: '两端的图标说明往哪边是大、往哪边是小。',
        height: 200,
        render: function SliderLabels() {
          const [level, setLevel] = useState(40);
          return <div style={{ display: 'grid', gap: 16, width: 300 }}>
            <GlassSlider aria-label="亮度" value={level} onValueChange={setLevel}
              minLabel={<Icon name="sun" size={15} />} maxLabel={<Icon name="sun" size={20} />} />
            <GlassSlider aria-label="不可用滑块" defaultValue={30} disabled />
          </div>;
        },
        code: `<GlassSlider
  aria-label="亮度"
  minLabel={<SunSmall />}
  maxLabel={<SunLarge />}
/>`,
      },
      {
        id: 'slider-marks', title: '刻度', description: '刻度表示这个刻度是离散的，所以只在它确实离散时才用。一条音量滑块上画一百个刻度不是信息，是一条网格线——marks={true} 在步数太多时会被拒绝并告警。',
        height: 220,
        render: function SliderMarks() {
          const [quality, setQuality] = useState(2);
          const [percent, setPercent] = useState(40);
          return <div id="slider-marks-demo" style={{ display: 'grid', gap: 20, width: 320 }}>
            <GlassSlider aria-label="画质等级" min={0} max={4} step={1} marks value={quality} onValueChange={setQuality}
              formatValue={value => `第 ${value + 1} 档，共 5 档`} />
            <GlassSlider aria-label="不透明度" marks={[0, 25, 50, 75, 100]} value={percent} onValueChange={setPercent}
              formatValue={value => `${value}%`} />
          </div>;
        },
        code: `{/* 每一步一个刻度 */}
<GlassSlider aria-label="画质等级" min={0} max={4} step={1} marks … />
{/* 只在指定位置 */}
<GlassSlider aria-label="不透明度" marks={[0, 25, 50, 75, 100]} … />`,
      },
    ],
    props: [
      { name: 'value / defaultValue', type: 'number', default: '50', description: '当前值。' },
      { name: 'min / max / step', type: 'number', default: '0 / 100 / 1', description: '范围与步长。' },
      { name: 'marks', type: 'boolean | number[]', description: '刻度。true 是每一步一个（步数太多会被拒绝并告警），数组是指定位置。只给眼睛看——读屏听到的值来自 input 和 formatValue。' },
      { name: 'onValueChange', type: '(value: number) => void', description: '值变化。拖动过程中会连续触发。' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '不可用。' },
      { name: 'name', type: 'string', description: '提交表单时用的字段名。' },
      { name: 'formatValue', type: '(value: number) => string', description: '读屏念出来的说法。光念一个数字往往不够。' },
      { name: 'minLabel / maxLabel', type: 'ReactNode', description: '两端的提示图形。' },
      { name: 'aria-label', type: 'string', required: true, description: '这个滑块在调什么。' },
    ],
    notes: [
      '底层是浏览器原生的范围输入，方向键、Home、End、翻页键全都可用。',
      '拖动时不会重新计算图形，所以拖多久都不会卡。',
    ],
    related: ['stepper', 'progress'],
  },
  {
    slug: 'stepper', name: 'GlassStepper', title: '步进器', group: '控件',
    summary: '在很小的整数范围里加一减一。',
    when: [
      '份数、人数、行数这类几下就能点到位的数字。',
      '范围一大就换滑块或输入框——让人点二十次不合适。',
      '当前值必须一直看得见，或者就在旁边。',
    ],
    examples: [
      {
        id: 'stepper-basic', title: '基础用法', description: '到达上下限时对应的按钮自动变灰。',
        height: 180,
        render: function StepperBasic() {
          const [count, setCount] = useState(2);
          return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassStepper aria-label="份数" value={count} onValueChange={setCount} min={1} max={9} />
            <Text variant="caption1" tone="secondary">范围 1–9，当前 {count}</Text>
          </div>;
        },
        code: `<GlassStepper aria-label="份数"
  value={count} onValueChange={setCount} min={1} max={9} />`,
      },
      {
        id: 'stepper-wide', title: '范围大的时候', description: '按住不放会连续加减；按住 Shift 点一下走 10 步。范围再大就该换成滑块或输入框了。',
        height: 190,
        render: function StepperWide() {
          const [minutes, setMinutes] = useState(30);
          return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassStepper aria-label="时长（分钟）" value={minutes} onValueChange={setMinutes}
              min={0} max={240} step={1} />
            <Text variant="caption1" tone="secondary">按住试试；Shift + 点击走 10 分钟</Text>
          </div>;
        },
        code: `<GlassStepper aria-label="时长（分钟）"
  value={minutes} onValueChange={setMinutes}
  min={0} max={240} shiftMultiplier={10} />`,
      },
      {
        id: 'stepper-disabled', title: '不可用与不显示值', description: '值已经在旁边显示时，关掉 showValue，别让同一个数出现两次。',
        height: 190,
        render: function StepperStates() {
          const [copies, setCopies] = useState(3);
          return <div style={{ display: 'grid', gap: 16, justifyItems: 'center' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Text variant="body">份数 {copies}</Text>
              <GlassStepper aria-label="份数" value={copies} onValueChange={setCopies} min={1} max={20} showValue={false} />
            </div>
            <GlassStepper aria-label="暂不可用" defaultValue={1} min={1} max={5} disabled />
          </div>;
        },
        code: `<GlassStepper aria-label="份数" value={copies} onValueChange={setCopies} showValue={false} />
<GlassStepper aria-label="暂不可用" disabled />`,
      },
    ],
    props: [
      { name: 'value / defaultValue', type: 'number', default: '0', description: '当前值。' },
      { name: 'min / max / step', type: 'number', default: '-∞ / ∞ / 1', description: '范围与步长。' },
      { name: 'onValueChange', type: '(value: number) => void', description: '值变化。' },
      { name: 'formatValue', type: '(value: number) => string', description: '显示和朗读的形式。光一个数字往往不够。' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '不可用。' },
      { name: 'aria-label', type: 'string', required: true, description: '这个步进器在调什么。' },
      { name: 'shiftMultiplier', type: 'number', default: '10', description: '按住 Shift 时一步走几倍。范围只有几个值时设成 1 关掉。' },
      { name: 'showValue', type: 'boolean', default: 'true', description: '值已经在旁边显示时可以关掉。' },
      { name: 'decrementLabel / incrementLabel', type: 'string', description: '两个按钮各自的名字。不传就用 GlassProvider 的 strings 表。' },
    ],
    notes: [
      '是两个有名字的按钮，不是一个需要键盘调节的数字框。',
      '两个按钮各自都满足 44×44 的点击范围。',
      '按住 0.4 秒后开始连续加减，松手、指针取消、或者到达上下限都会停——一直撞着上限跑的定时器是没人看得见的浪费。',
    ],
    related: ['slider', 'list'],
  },
  {
    slug: 'progress', name: 'GlassProgress', title: '进度', group: '控件',
    summary: '告诉用户还要等多久，或者至少告诉他们还在动。',
    when: [
      '知道总量就用确定进度条——不确定的转圈除了“还活着”之外什么都没说。',
      '短暂等待用圆环，长任务用横条。',
      '不要因为在加载就把整个界面锁住。能先显示的内容就先显示。',
    ],
    examples: [
      {
        id: 'progress-determinate', title: '确定进度', description: '拖下面的滑块可以看到进度条跟着走。',
        height: 190,
        render: function ProgressDeterminate() {
          const [value, setValue] = useState(38);
          return <div style={{ display: 'grid', gap: 16, width: 280 }}>
            <GlassProgress aria-label="导出进度" value={value} />
            <GlassSlider aria-label="调整演示进度" value={value} onValueChange={setValue} />
          </div>;
        },
        code: `<GlassProgress aria-label="导出进度" value={done} total={total} />`,
      },
      {
        id: 'progress-indeterminate', title: '不确定进度', description: '只有在真的算不出总量时才用。',
        height: 180,
        render: () => <div style={{ display: 'grid', gap: 18, width: 280 }}>
          <GlassProgress aria-label="处理中" />
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <GlassProgress aria-label="载入中" variant="circular" />
            <Text variant="footnote" tone="secondary">载入中</Text>
          </div>
        </div>,
        code: `<GlassProgress aria-label="处理中" />
<GlassProgress aria-label="载入中" variant="circular" />`,
      },
    ],
    props: [
      { name: 'value', type: 'number', description: '不传就是不确定状态。一旦能算出进度就应该传。' },
      { name: 'total', type: 'number', default: '100', description: '总量。' },
      { name: 'aria-label', type: 'string', required: true, description: '这条进度在表示什么。' },
      { name: 'variant', type: "'bar' | 'circular'", default: "'bar'", description: '横条或圆环。' },
    ],
    notes: ['确定状态会把百分比报给读屏。', '用户开启“减少动效”后不确定指示器会停下来，变成一条静止的轨道。'],
    related: ['toast', 'button'],
  },
  {
    slug: 'badge', name: 'GlassBadge', title: '徽标', group: '控件',
    summary: '一个数字或一小段状态文字。',
    when: [
      '提示有多少条未读、多少个待办。',
      '给一个数字配上说明它在数什么的名字，否则读屏只会念出一个孤零零的数。',
      '没有有意义的数字时用小圆点，别硬凑一个。',
    ],
    examples: [
      {
        id: 'badge-basic', title: '计数与状态', description: '超过上限会显示成“99+”。',
        height: 160,
        render: () => <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <GlassBadge count={3} aria-label="3 条未读消息" />
          <GlassBadge count={128} max={99} aria-label="128 条未读消息" />
          <GlassBadge tone="neutral">测试版</GlassBadge>
          <GlassBadge tone="accent">新</GlassBadge>
          <GlassBadge dot aria-label="有更新" />
        </div>,
        code: `<GlassBadge count={3} aria-label="3 条未读消息" />
<GlassBadge count={128} max={99} aria-label="128 条未读消息" />
<GlassBadge dot aria-label="有更新" />`,
      },
    ],
    props: [
      { name: 'count', type: 'number', description: '数量。超过 max 显示成 “max+”。' },
      { name: 'max', type: 'number', default: '99', description: '折叠阈值。' },
      { name: 'tone', type: "'notification' | 'neutral' | 'accent'", default: "'notification'", description: '色调。' },
      { name: 'dot', type: 'boolean', default: 'false', description: '不显示数字，只显示一个小圆点。' },
      { name: 'aria-label', type: 'string', description: '说明这个数字在数什么。' },
    ],
    notes: ['没有内容时不会渲染，不会留下一个空的装饰圆。', '颜色不是唯一信息，徽标里始终有数字或文字。'],
    related: ['tab-bar', 'list'],
  },
];
