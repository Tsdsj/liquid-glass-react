import { useState } from 'react';
import {
  Card, ColorWell, Form, FormRow, FormSection, GlassBadge, GlassButton, GlassCheckbox, GlassIconButton,
  GlassProgress, GlassSegmentedControl, GlassSlider, GlassStepper, GlassSwitch, Grid, LibraryIcon, List,
  ListRow, ListSection, Picker, RadioGroup, Text,
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
        height: 220,
        knobs: [
          { name: 'variant', label: '样式', type: 'select', value: 'glass', options: [
            { value: 'glass', label: '玻璃' }, { value: 'glassProminent', label: '主操作' },
            { value: 'gray', label: '灰底' }, { value: 'tinted', label: '淡色' }, { value: 'destructive', label: '危险' },
          ] },
          { name: 'controlSize', label: '尺寸', type: 'select', value: 'regular', options: [
            { value: 'small', label: '小' }, { value: 'regular', label: '默认' },
            { value: 'large', label: '大' }, { value: 'extraLarge', label: '超大' },
          ] },
          { name: 'disabled', label: '不可用', type: 'boolean', value: false },
          { name: 'loading', label: '处理中', type: 'boolean', value: false },
        ],
        render: function ButtonSize({ knobs }) {
          return <div style={{ display: 'grid', gap: 14, justifyItems: 'center' }}>
            <GlassButton variant={knobs.variant as 'glass'} controlSize={knobs.controlSize as 'regular'}
              disabled={knobs.disabled === true} loading={knobs.loading === true}>可调节的按钮</GlassButton>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <GlassButton controlSize="small">小</GlassButton>
              <GlassButton>默认</GlassButton>
              <GlassButton controlSize="large">大</GlassButton>
              <GlassButton controlSize="extraLarge">超大</GlassButton>
            </div>
          </div>;
        },
        code: knobs => `<GlassButton${knobs.variant === 'glass' ? '' : `\n  variant="${knobs.variant}"`}${knobs.controlSize === 'regular' ? '' : `\n  controlSize="${knobs.controlSize}"`}${knobs.disabled ? '\n  disabled' : ''}${knobs.loading ? '\n  loading' : ''}>
  可调节的按钮
</GlassButton>`,
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
        description: '一屏仍然只有**一个**主操作——tint 换的是它的颜色，不是让你摆三个。其余的用扁平的 tinted。色调需要配一个能读的文字色，而这一点算不出来，所以开发模式会把按钮**实际画出来**的那一对——标签的颜色，和它底下所有图层合成后的颜色——量一遍，低于 4.5:1 就告警。',
        height: 200,
        render: () => <div id="button-tint-demo" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <GlassButton variant="glassProminent" tint="#146c2e">确认</GlassButton>
          <GlassButton variant="tinted" tint="#8250df">升级</GlassButton>
          <GlassButton variant="tinted">默认强调色</GlassButton>
        </div>,
        code: `{/* 这一屏唯一的主操作 */}
<GlassButton variant="glassProminent" tint="#146c2e">确认</GlassButton>
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
        height: 210,
        knobs: [
          { name: 'count', label: '选项个数', type: 'number', value: 3, min: 2, max: 5, step: 1 },
          { name: 'density', label: '密度', type: 'select', value: 'comfortable', options: [
            { value: 'comfortable', label: '常规' }, { value: 'compact', label: '紧凑' },
          ] },
          { name: 'disabled', label: '整组不可用', type: 'boolean', value: false },
        ],
        render: function SegmentedBasic({ knobs }) {
          const [value, setValue] = useState('week');
          const all = [
            { value: 'day', label: '日' }, { value: 'week', label: '周' }, { value: 'month', label: '月' },
            { value: 'quarter', label: '季' }, { value: 'year', label: '年' },
          ];
          const items = all.slice(0, Number(knobs.count));
          return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassSegmentedControl aria-label="时间范围" density={knobs.density as 'comfortable'}
              disabled={knobs.disabled === true}
              value={items.some(item => item.value === value) ? value : items[0].value}
              onValueChange={setValue} items={items} />
            <Text variant="caption1" tone="secondary" role="status">当前：{value}</Text>
          </div>;
        },
        code: knobs => `<GlassSegmentedControl
  aria-label="时间范围"${knobs.density === 'comfortable' ? '' : `\n  density="${knobs.density}"`}${knobs.disabled ? '\n  disabled' : ''}
  value={range}
  onValueChange={setRange}
  items={[
${['日', '周', '月', '季', '年'].slice(0, Number(knobs.count)).map((label, index) =>
            `    { value: '${['day', 'week', 'month', 'quarter', 'year'][index]}', label: '${label}' },`).join('\n')}
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
      {
        id: 'segmented-switches-view', title: '它切的是视图，不是执行操作',
        description: '选中一段应该立刻换掉下面的内容。如果按下去是「做一件事」，那是按钮，不是分段控件。',
        height: 260,
        render: function SegmentedView() {
          const [view, setView] = useState('list');
          return <div id="segmented-view-demo" style={{ display: 'grid', gap: 14, width: 300, justifyItems: 'center' }}>
            <GlassSegmentedControl aria-label="显示方式" value={view} onValueChange={setView}
              items={[{ value: 'list', label: '列表' }, { value: 'grid', label: '网格' }]} />
            {view === 'list'
              ? <List style={{ width: '100%' }}>
                <ListSection>
                  <ListRow label="封面" value="1280 × 720" />
                  <ListRow label="背景" value="2560 × 1440" />
                </ListSection>
              </List>
              : <Grid minItemWidth={120} gap={12} style={{ width: '100%' }}>
                {['封面', '背景'].map(name => <Card key={name} radius={14} padding={14} fill="secondary">
                  <Text variant="subhead">{name}</Text>
                </Card>)}
              </Grid>}
          </div>;
        },
        code: `<GlassSegmentedControl aria-label="显示方式" value={view} onValueChange={setView}
  items={[{ value: 'list', label: '列表' }, { value: 'grid', label: '网格' }]} />

{view === 'list' ? <List>…</List> : <Grid>…</Grid>}`,
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
        height: 230,
        knobs: [
          { name: 'label', label: '旁边的文字', type: 'text', value: 'Wi‑Fi' },
          { name: 'disabled', label: '不可用', type: 'boolean', value: false },
        ],
        render: function SwitchBasic({ knobs }) {
          const [wifi, setWifi] = useState(true);
          const [low, setLow] = useState(false);
          return <div style={{ display: 'grid', gap: 14, justifyItems: 'start' }}>
            <GlassSwitch aria-label={String(knobs.label)} label={String(knobs.label)}
              disabled={knobs.disabled === true} checked={wifi} onCheckedChange={setWifi} />
            <GlassSwitch aria-label="低数据模式" label="低数据模式" checked={low} onCheckedChange={setLow} />
            <GlassSwitch aria-label="不可用开关" label="暂不可用" disabled />
          </div>;
        },
        code: knobs => `<GlassSwitch aria-label="${knobs.label}" label="${knobs.label}"${knobs.disabled ? '\n  disabled' : ''}
  checked={enabled} onCheckedChange={setEnabled} />`,
      },
      {
        id: 'switch-naming', title: '标签写状态，不写动作',
        description: '写「Wi‑Fi」，不要写「启用 Wi‑Fi」——开关自己就表示开和关，标签再说一遍「启用」，关掉的时候就成了「关掉的启用」。',
        height: 230,
        render: function SwitchNaming() {
          const [a, setA] = useState(true);
          const [b, setB] = useState(true);
          return <div id="switch-naming-demo" style={{ display: 'grid', gap: 18, justifyItems: 'start' }}>
            <div style={{ display: 'grid', gap: 6 }}>
              <GlassSwitch aria-label="蓝牙" label="蓝牙" checked={a} onCheckedChange={setA} />
              <Text variant="caption1" tone="secondary">读作「蓝牙，开」</Text>
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <GlassSwitch aria-label="启用蓝牙" label="启用蓝牙" checked={b} onCheckedChange={setB} />
              <Text variant="caption1" tone="destructive">读作「启用蓝牙，关」——关掉的启用是什么？</Text>
            </div>
          </div>;
        },
        code: `{/* 对 */}
<GlassSwitch aria-label="蓝牙" label="蓝牙" checked={on} onCheckedChange={setOn} />

{/* 错 */}
<GlassSwitch aria-label="启用蓝牙" label="启用蓝牙" … />`,
      },
      {
        id: 'switch-immediate', title: '改完立刻生效',
        description: '开关不配「保存」。需要确认才生效的，用复选框加一个提交按钮——不然用户会以为已经改好了。',
        height: 230,
        render: function SwitchImmediate() {
          const [sync, setSync] = useState(false);
          return <Form id="switch-immediate-demo" style={{ width: 320 }} onSubmit={event => event.preventDefault()}>
            <FormSection header="iCloud" footer={sync ? '已经在同步了，没有「保存」这一步。' : '关掉之后本机的改动不再上传。'}>
              <FormRow label="照片同步">
                <GlassSwitch aria-label="照片同步" checked={sync} onCheckedChange={setSync} />
              </FormRow>
            </FormSection>
          </Form>;
        },
        code: `<FormRow label="照片同步">
  <GlassSwitch aria-label="照片同步" checked={sync} onCheckedChange={setSync} />
</FormRow>`,
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
        height: 220,
        knobs: [
          /* No `marks` knob: `marks` on a 100-step range is refused with a warning (see 刻度
             below), so a knob that produced one would be teaching the reader a mistake. */
          { name: 'step', label: '步长', type: 'number', value: 1, min: 1, max: 25, step: 1 },
          { name: 'disabled', label: '不可用', type: 'boolean', value: false },
        ],
        render: function SliderBasic({ knobs }) {
          const [volume, setVolume] = useState(62);
          return <div style={{ display: 'grid', gap: 14, width: 300 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text variant="subhead">音量</Text>
              <Text variant="subhead" tone="secondary" tabular>{volume}%</Text>
            </div>
            <GlassSlider aria-label="音量" value={volume} onValueChange={setVolume}
              step={Number(knobs.step)} disabled={knobs.disabled === true}
              formatValue={v => `${v} 百分比`} />
          </div>;
        },
        code: knobs => `<GlassSlider
  aria-label="音量"
  value={volume}
  onValueChange={setVolume}${knobs.step === 1 ? '' : `\n  step={${knobs.step}}`}${knobs.disabled ? '\n  disabled' : ''}
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
        height: 200,
        knobs: [
          { name: 'max', label: '上限', type: 'number', value: 9, min: 2, max: 12, step: 1 },
          { name: 'showValue', label: '显示当前值', type: 'boolean', value: true },
          { name: 'disabled', label: '不可用', type: 'boolean', value: false },
        ],
        render: function StepperBasic({ knobs }) {
          const [count, setCount] = useState(2);
          const max = Number(knobs.max);
          return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassStepper aria-label="份数" value={Math.min(count, max)} onValueChange={setCount}
              min={1} max={max} showValue={knobs.showValue === true} disabled={knobs.disabled === true} />
            <Text variant="caption1" tone="secondary" role="status">范围 1–{max}，当前 {Math.min(count, max)}</Text>
          </div>;
        },
        code: knobs => `<GlassStepper aria-label="份数"
  value={count} onValueChange={setCount} min={1} max={${knobs.max}}${knobs.showValue ? '' : '\n  showValue={false}'}${knobs.disabled ? '\n  disabled' : ''} />`,
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
        height: 210,
        knobs: [
          { name: 'variant', label: '形状', type: 'select', value: 'bar', options: [
            { value: 'bar', label: '横条' }, { value: 'circular', label: '圆环' },
          ] },
          { name: 'total', label: '总量', type: 'number', value: 100, min: 10, max: 200, step: 10 },
        ],
        render: function ProgressDeterminate({ knobs }) {
          const [value, setValue] = useState(38);
          const total = Number(knobs.total);
          return <div style={{ display: 'grid', gap: 16, width: 280, justifyItems: 'center' }}>
            <GlassProgress aria-label="导出进度" value={Math.min(value, total)} total={total}
              variant={knobs.variant as 'bar'} style={{ width: '100%' }} />
            <GlassSlider aria-label="调整演示进度" value={value} onValueChange={setValue} max={total} />
          </div>;
        },
        code: knobs => `<GlassProgress aria-label="导出进度" value={done} total={${knobs.total}}${knobs.variant === 'bar' ? '' : ` variant="${knobs.variant}"`} />`,
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
      {
        id: 'progress-not-blocking', title: '不要因为在加载就锁住界面',
        description: '能先显示的内容就先显示。把整页换成一个转圈，等于告诉用户「什么都别想干」——而那通常不是真的。',
        height: 280,
        render: function ProgressNotBlocking() {
          const [loading, setLoading] = useState(true);
          return <div id="progress-not-blocking-demo" style={{ display: 'grid', gap: 12, width: 300 }}>
            <List>
              <ListSection headingLevel={4} header="收件箱">
                <ListRow label="周会纪要" secondaryLabel="昨天" />
                <ListRow label="发票" secondaryLabel="上周" />
                <ListRow label={loading ? '正在收取更多…' : '设计评审'}
                  accessory={loading ? <GlassProgress aria-label="正在收取更多邮件" variant="circular" /> : undefined}
                  secondaryLabel={loading ? undefined : '上周'} />
              </ListSection>
            </List>
            <GlassButton controlSize="small" variant="gray" onClick={() => setLoading(value => !value)}>
              {loading ? '假装加载完成' : '再加载一次'}
            </GlassButton>
          </div>;
        },
        code: `{/* 已经拿到的先显示 */}
<ListRow label="周会纪要" />
{/* 还在路上的那一部分才转圈 */}
<ListRow label="正在收取更多…"
  accessory={<GlassProgress aria-label="正在收取更多邮件" variant="circular" />} />`,
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
        height: 200,
        knobs: [
          { name: 'count', label: '数量', type: 'number', value: 3, min: 0, max: 200, step: 1 },
          { name: 'max', label: '折叠阈值', type: 'number', value: 99, min: 9, max: 999, step: 10 },
          { name: 'tone', label: '色调', type: 'select', value: 'notification', options: [
            { value: 'notification', label: '通知' }, { value: 'neutral', label: '中性' }, { value: 'accent', label: '强调' },
          ] },
        ],
        render: function BadgeBasic({ knobs }) {
          const count = Number(knobs.count);
          return <div style={{ display: 'grid', gap: 16, justifyItems: 'center' }}>
            <GlassBadge count={count} max={Number(knobs.max)} tone={knobs.tone as 'notification'}
              aria-label={`${count} 条未读消息`} />
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <GlassBadge count={128} max={99} aria-label="128 条未读消息" />
              <GlassBadge tone="neutral">测试版</GlassBadge>
              <GlassBadge tone="accent">新</GlassBadge>
              <GlassBadge dot aria-label="有更新" />
            </div>
            <Text variant="caption1" tone="secondary">数量为 0 时它整个不渲染，不会留下一个空圈。</Text>
          </div>;
        },
        code: knobs => `<GlassBadge count={${knobs.count}}${knobs.max === 99 ? '' : ` max={${knobs.max}}`}${knobs.tone === 'notification' ? '' : ` tone="${knobs.tone}"`}
  aria-label="${knobs.count} 条未读消息" />`,
      },
      {
        id: 'badge-on-tab', title: '挂在别的东西上',
        description: '徽标总是属于某个东西——一个标签、一行、一个图标按钮。它不单独出现，因为单独一个数字说不出自己在数什么。',
        height: 200,
        render: () => <div id="badge-on-tab-demo" style={{ display: 'grid', gap: 14, width: 300 }}>
          <List>
            <ListSection headingLevel={4} header="邮箱">
              <ListRow label="收件箱" accessory={<GlassBadge count={12} aria-label="12 封未读" />} onSelect={() => {}} />
              <ListRow label="已发送" onSelect={() => {}} />
              <ListRow label="草稿" accessory={<GlassBadge dot aria-label="有未完成的草稿" />} onSelect={() => {}} />
            </ListSection>
          </List>
        </div>,
        code: `<ListRow label="收件箱"
  accessory={<GlassBadge count={12} aria-label="12 封未读" />} />`,
      },
      {
        id: 'badge-not-color-only', title: '不要只靠颜色',
        description: '徽标里始终有数字或文字。没有有意义的数字时用小圆点，并且给它一个名字——一个纯色的点，对读屏和分不清颜色的人来说什么都没说。',
        height: 190,
        render: () => <div id="badge-color-demo" style={{ display: 'grid', gap: 14, justifyItems: 'start' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <GlassBadge dot aria-label="有更新" />
            <Text variant="subhead">有更新——圆点带名字</Text>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <GlassBadge tone="accent">新</GlassBadge>
            <Text variant="subhead">用一个字说清楚，比一个颜色可靠</Text>
          </div>
        </div>,
        code: `<GlassBadge dot aria-label="有更新" />
<GlassBadge tone="accent">新</GlassBadge>`,
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
  {
    slug: 'picker', name: 'Picker', title: '选择器', group: '控件',
    summary: '从一小组值里选一个，形态由空间决定。',
    when: [
      '选项互斥、并且都能一句话说清。',
      '不要自己决定它长什么样：四个以内、宽度够，它就是分段控件；再多或者窄屏，它就变成下拉按钮。',
      '选项是「命令」而不是「值」时，用下拉按钮 GlassMenuButton 的 pullDown 形态。',
    ],
    examples: [
      {
        id: 'picker-automatic', title: '自动形态',
        description: '默认按选项数量和尺寸类别决定：四个以内且宽度够就并排，否则收成下拉。把窗口拉窄到 768 以下可以看到它自己换形态。',
        height: 200,
        knobs: [
          { name: 'presentation', label: '形态', type: 'select', value: 'automatic', options: [
            { value: 'automatic', label: '自动' }, { value: 'inline', label: '并排' }, { value: 'menu', label: '下拉' },
          ] },
          { name: 'labelHidden', label: '隐藏文字标签', type: 'boolean', value: false },
        ],
        render: function PickerAutomatic({ knobs }) {
          const [value, setValue] = useState('week');
          return <div id="picker-automatic-demo" style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <Picker label="时间范围" value={value} onValueChange={setValue}
              presentation={knobs.presentation as 'automatic'} labelHidden={knobs.labelHidden === true}
              options={[{ value: 'day', label: '日' }, { value: 'week', label: '周' }, { value: 'month', label: '月' }]} />
            <Text variant="caption1" tone="secondary" role="status">当前：{value}</Text>
          </div>;
        },
        code: knobs => `<Picker
  label="时间范围"${knobs.labelHidden ? '\n  labelHidden' : ''}${knobs.presentation === 'automatic' ? '' : `\n  presentation="${knobs.presentation}"`}
  value={range}
  onValueChange={setRange}
  options={[
    { value: 'day', label: '日' },
    { value: 'week', label: '周' },
    { value: 'month', label: '月' },
  ]}
/>`,
      },
      {
        id: 'picker-many', title: '选项多的时候',
        description: '超过四个就一定是下拉——五个并排的分段在手机上谁也读不清。按钮上显示的是当前选择，这正是下拉按钮该做的事。',
        height: 190,
        render: function PickerMany() {
          const [city, setCity] = useState('shanghai');
          return <div id="picker-many-demo">
            <Picker label="城市" value={city} onValueChange={setCity} options={[
              { value: 'beijing', label: '北京' }, { value: 'shanghai', label: '上海' },
              { value: 'guangzhou', label: '广州' }, { value: 'shenzhen', label: '深圳' },
              { value: 'chengdu', label: '成都' }, { value: 'hangzhou', label: '杭州' },
            ]} />
          </div>;
        },
        code: `<Picker label="城市" value={city} onValueChange={setCity}
  options={cities} />`,
      },
      {
        id: 'picker-form', title: '在表单里',
        description: '表单行只负责排版和分组，名字仍然在控件自己身上，所以这里用 labelHidden 把重复的那一份去掉。',
        height: 230,
        render: function PickerForm() {
          const [quality, setQuality] = useState('high');
          const [format, setFormat] = useState('mp4');
          return <Form id="picker-form-demo" style={{ width: 320 }} onSubmit={event => event.preventDefault()}>
            <FormSection header="导出">
              <FormRow label="画质">
                <Picker label="画质" labelHidden value={quality} onValueChange={setQuality}
                  options={[{ value: 'low', label: '低' }, { value: 'high', label: '高' }]} />
              </FormRow>
              <FormRow label="格式">
                <Picker label="格式" labelHidden value={format} onValueChange={setFormat}
                  options={[{ value: 'mp4', label: 'MP4' }, { value: 'mov', label: 'MOV' },
                    { value: 'webm', label: 'WebM' }, { value: 'gif', label: 'GIF' }, { value: 'avi', label: 'AVI' }]} />
              </FormRow>
            </FormSection>
          </Form>;
        },
        code: `<FormRow label="画质">
  <Picker label="画质" labelHidden value={quality} onValueChange={setQuality}
    options={[{ value: 'low', label: '低' }, { value: 'high', label: '高' }]} />
</FormRow>`,
      },
    ],
    props: [
      { name: 'label', type: 'string', required: true, description: '在选什么。既是旁边的可见文字，也是控件的名字。' },
      { name: 'labelHidden', type: 'boolean', default: 'false', description: '藏起文字但保留名字。放进表单行时用。' },
      { name: 'options', type: 'PickerOption[]', required: true, description: '可选的值。没有图标插槽——同一个选择器会在两种形态间切换，而分段控件不允许图文混排。' },
      { name: 'value / defaultValue', type: 'string', description: '受控或非受控的当前值。' },
      { name: 'onValueChange', type: '(value: string) => void', description: '选择变化。' },
      { name: 'presentation', type: "'automatic' | 'inline' | 'menu'", default: "'automatic'", description: '形态。自动是按选项数量和尺寸类别决定的，只有在形态本身就是设计的一部分时才写死。' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '不可用。' },
      { name: 'name', type: 'string', description: '表单字段名。只有并排形态会真的参与表单提交。' },
    ],
    notes: [
      '并排形态是原生单选按钮组，方向键切换；下拉形态是菜单按钮，方向键在菜单里走。',
      '可见的那行文字对读屏是隐藏的——控件自己的名字就是同一串字，念两遍没有意义。语音控制念出可见文字仍然能命中控件。',
      '服务端渲染时按紧凑处理，也就是先渲染下拉形态，到了浏览器再按真实宽度决定。',
    ],
    related: ['segmented-control', 'menu-button', 'form'],
  },
  {
    slug: 'color-well', name: 'ColorWell', title: '颜色', group: '控件',
    summary: '选一个颜色，用系统自己的取色器。',
    when: [
      '需要用户挑一个任意颜色时。只有几个固定颜色就用选择器或分段控件。',
      '颜色旁边始终显示色值——一个只有颜色的控件，看不清颜色的人就读不出它的状态。',
      '常用色放进 swatches，每一个都要有名字。',
    ],
    examples: [
      {
        id: 'color-basic', title: '基础用法',
        description: '底下是真正的 <input type="color">，点开的是操作系统自己的取色器，带吸管和最近使用过的颜色。',
        height: 190,
        knobs: [
          { name: 'showValue', label: '显示色值', type: 'boolean', value: true },
          { name: 'disabled', label: '不可用', type: 'boolean', value: false },
        ],
        render: function ColorBasic({ knobs }) {
          const [color, setColor] = useState('#0a84ff');
          return <div id="color-basic-demo" style={{ display: 'grid', gap: 14, justifyItems: 'center' }}>
            <ColorWell aria-label="强调色" value={color} onValueChange={setColor}
              showValue={knobs.showValue === true} disabled={knobs.disabled === true} />
            <Text variant="caption1" tone="secondary" role="status">当前 {color}</Text>
          </div>;
        },
        code: knobs => `<ColorWell
  aria-label="强调色"
  value={color}
  onValueChange={setColor}${knobs.showValue === false ? '\n  showValue={false}' : ''}${knobs.disabled ? '\n  disabled' : ''}
/>`,
      },
      {
        id: 'color-swatches', title: '常用色',
        description: '每个快捷色都必须有名字。一排只有颜色的方块，对分不清颜色的人来说是一排一模一样的方块。选中是一圈描边，不是「颜色变深一点」。',
        height: 190,
        render: function ColorSwatches() {
          const [color, setColor] = useState('#30d158');
          return <div id="color-swatches-demo">
            <ColorWell aria-label="标签颜色" value={color} onValueChange={setColor} swatches={[
              { value: '#ff453a', label: '红' }, { value: '#ff9f0a', label: '橙' },
              { value: '#30d158', label: '绿' }, { value: '#0a84ff', label: '蓝' },
              { value: '#bf5af2', label: '紫' },
            ]} />
          </div>;
        },
        code: `<ColorWell aria-label="标签颜色" value={color} onValueChange={setColor}
  swatches={[
    { value: '#ff453a', label: '红' },
    { value: '#30d158', label: '绿' },
  ]} />`,
      },
      {
        id: 'color-form', title: '在表单行里',
        description: '表单行里放不下色值时可以关掉它——但只有在旁边已经有别的说法时才关。',
        height: 200,
        render: function ColorForm() {
          const [fill, setFill] = useState('#bf5af2');
          return <Form id="color-form-demo" style={{ width: 320 }} onSubmit={event => event.preventDefault()}>
            <FormSection header="外观" footer="颜色会用在这张卡片的标题上。">
              <FormRow label="填充色" description={fill}>
                <ColorWell aria-label="填充色" value={fill} onValueChange={setFill} showValue={false} />
              </FormRow>
            </FormSection>
          </Form>;
        },
        code: `<FormRow label="填充色" description={fill}>
  <ColorWell aria-label="填充色" value={fill} onValueChange={setFill} showValue={false} />
</FormRow>`,
      },
    ],
    props: [
      { name: 'aria-label', type: 'string', required: true, description: '这个颜色是用来干什么的。一个彩色方块自己说不出来。' },
      { name: 'value / defaultValue', type: 'string', default: "'#0a84ff'", description: '`#rrggbb`。底层是原生颜色输入，它说的就是这个格式。' },
      { name: 'onValueChange', type: '(value: string) => void', description: '颜色变化。拖动取色器时会连续触发。' },
      { name: 'swatches', type: 'ColorSwatch[]', description: '常用色。每一项都要有 label——颜色不能是唯一的信息。' },
      { name: 'showValue', type: 'boolean', default: 'true', description: '在旁边显示色值。关掉之前先确认别处已经说过了。' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '不可用。' },
    ],
    notes: [
      '是真正的 <input type="color">，能参与表单提交，Tab 能聚焦，回车打开系统取色器。',
      '输入框铺满整个 44×44 的外壳并且透明——把它藏起来再用脚本点开，会同时丢掉焦点环、键盘和表单。',
      '色值用等宽数字显示，方便一眼比对和读出来。',
      '快捷色的选中态是描边，在强制颜色模式下也看得见。',
    ],
    related: ['picker', 'form', 'slider'],
  },
  {
    slug: 'checkbox', name: 'GlassCheckbox', title: '复选框', group: '控件',
    summary: '一个小方块：关着是空的，开着是一个勾，半选是一道横杠。',
    when: [
      '改动需要点「保存」才生效——立刻生效的用开关 GlassSwitch。',
      '同一组里有好几个选项要一起看。一列复选框对得齐、读起来是一组；一列开关读起来是一块控制面板。',
      '设置之间有层级：父项管着子项，子项状态不一致时父项显示半选。',
      '互斥的多选一用单选组 RadioGroup；超过五项用选择器 Picker。',
    ],
    examples: [
      {
        id: 'checkbox-basic', title: '基础用法',
        description: '整行都能点，文字也算。标签下面可以再加一行说明它是什么意思。',
        height: 260,
        knobs: [
          { name: 'label', label: '标签', type: 'text', value: '发送每周摘要' },
          { name: 'description', label: '第二行', type: 'text', value: '每周一早上一封，只列有变化的项目。' },
          { name: 'disabled', label: '不可用', type: 'boolean', value: false },
        ],
        render: function CheckboxBasic({ knobs }) {
          const [on, setOn] = useState(true);
          return <div id="checkbox-basic-demo" style={{ display: 'grid', gap: 8, width: 340 }}>
            <GlassCheckbox checked={on} onCheckedChange={setOn}
              label={String(knobs.label)}
              description={knobs.description ? String(knobs.description) : undefined}
              disabled={knobs.disabled === true} />
            <Text variant="caption1" tone="secondary">现在是{on ? '选中' : '未选中'}。</Text>
          </div>;
        },
        code: knobs => `<GlassCheckbox
  checked={on} onCheckedChange={setOn}
  label="${knobs.label}"${knobs.description ? `\n  description="${knobs.description}"` : ''}${knobs.disabled ? '\n  disabled' : ''}
/>`,
      },
      {
        id: 'checkbox-mixed', title: '半选是父项在替子项说话',
        description: '子项有的开有的关时，父项显示一道横杠。半选**不是**读者能选的状态：按下半选的父项会全开，因为「一半」不是一个人点击时能表达的意思。',
        height: 300,
        render: function CheckboxMixed() {
          const [styles, setStyles] = useState({ bold: true, italic: false, underline: false });
          const values = Object.values(styles);
          const all = values.every(Boolean);
          const some = values.some(Boolean);
          return <div id="checkbox-mixed-demo" style={{ display: 'grid', gap: 6, width: 340 }}>
            <GlassCheckbox label="文字样式" checked={all ? true : some ? 'mixed' : false}
              onCheckedChange={next => setStyles({ bold: next, italic: next, underline: next })} />
            <div style={{ display: 'grid', gap: 6, paddingInlineStart: 28 }}>
              {([['bold', '加粗'], ['italic', '斜体'], ['underline', '下划线']] as const).map(([key, label]) =>
                <GlassCheckbox key={key} label={label} checked={styles[key]}
                  onCheckedChange={next => setStyles(current => ({ ...current, [key]: next }))} />)}
            </div>
          </div>;
        },
        code: `<GlassCheckbox label="文字样式"
  checked={all ? true : some ? 'mixed' : false}
  onCheckedChange={next => setAll(next)} />`,
      },
      {
        id: 'checkbox-in-form', title: '放在表单里',
        description: '一组并列的选项对齐在左边缘，缩进用来表示从属关系。',
        height: 300,
        render: function CheckboxInForm() {
          const [picked, setPicked] = useState<Record<string, boolean>>({ email: true, push: true, sms: false });
          return <div id="checkbox-form-demo" style={{ width: 360 }}>
            <Form>
              <FormSection header="通知方式" footer="改完记得按保存。">
                <div style={{ display: 'grid', gap: 2, padding: '4px 16px 12px' }}>
                  {([['email', '邮件'], ['push', '推送'], ['sms', '短信']] as const).map(([key, label]) =>
                    <GlassCheckbox key={key} label={label} checked={picked[key]}
                      onCheckedChange={next => setPicked(current => ({ ...current, [key]: next }))} />)}
                </div>
              </FormSection>
            </Form>
          </div>;
        },
        code: `<FormSection header="通知方式" footer="改完记得按保存。">
  <GlassCheckbox label="邮件" checked={email} onCheckedChange={setEmail} />
  <GlassCheckbox label="推送" checked={push} onCheckedChange={setPush} />
</FormSection>`,
      },
    ],
    props: [
      { name: 'checked', type: "boolean | 'mixed'", description: "受控状态。`'mixed'` 只用来显示，不是读者能选的值。" },
      { name: 'defaultChecked', type: 'boolean', default: 'false', description: '非受控时的初始值。' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', description: '状态变化。半选被按下时给 true。' },
      { name: 'label', type: 'ReactNode', description: '方块旁边的文字。没有它就必须给 aria-label。' },
      { name: 'description', type: 'ReactNode', description: '第二行，说这个选项意味着什么。会和标签一起读出来。' },
      { name: 'aria-label', type: 'string', description: '没有可见标签时必须给——一个空方块只会被念成「复选框」。' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '不可用。' },
      { name: 'name / value', type: 'string', description: '参与原生表单提交。' },
    ],
    notes: [
      '底层是真正的 <input type="checkbox">：Tab 能聚焦，空格切换，能参与表单提交。',
      '半选用的是原生的 indeterminate 属性，所以读屏会念「半选中」，而不是只有画面上有一道横杠。',
      '开和关是两个**形状**（勾 / 空）而不是两种颜色——分不清颜色的人也要能看出状态。',
      '焦点环画在方块上，不是画在整行上：它要说清楚键盘在哪个控件上。',
    ],
    related: ['switch', 'radio-group', 'form'],
  },
  {
    slug: 'radio-group', name: 'RadioGroup', title: '单选组', group: '控件',
    summary: '两到五个互斥选项，每个都有自己的标签。',
    when: [
      '选项互斥，而且每一项都需要一句自己的说明——这是它和分段控件的分界线。',
      '超过五项换选择器 Picker：一长列单选按钮占地方，也读不完。',
      '只有开/关两种，用复选框：有没有那个勾比两个圆圈哪个被填上更快读懂。',
      '能同时选多个，用一列复选框。',
    ],
    examples: [
      {
        id: 'radio-basic', title: '基础用法',
        description: '整组只占一个 Tab 位，进去之后用方向键选——这是原生单选按钮自带的键盘模型，没有任何一行代码去改它。',
        height: 300,
        knobs: [
          { name: 'label', label: '组标题', type: 'text', value: '同步频率' },
          { name: 'orientation', label: '排列', type: 'select', value: 'vertical', options: [
            { value: 'vertical', label: '竖排' }, { value: 'horizontal', label: '横排' },
          ] },
        ],
        render: function RadioBasic({ knobs }) {
          const [value, setValue] = useState('hourly');
          return <div id="radio-basic-demo" style={{ width: 340 }}>
            <RadioGroup label={String(knobs.label)} value={value} onValueChange={setValue}
              orientation={knobs.orientation as 'vertical'}
              options={[
                { value: 'realtime', label: '实时' },
                { value: 'hourly', label: '每小时' },
                { value: 'manual', label: '手动' },
              ]} />
          </div>;
        },
        code: knobs => `<RadioGroup
  label="${knobs.label}"${knobs.orientation === 'vertical' ? '' : '\n  orientation="horizontal"'}
  value={value} onValueChange={setValue}
  options={[
    { value: 'realtime', label: '实时' },
    { value: 'hourly', label: '每小时' },
    { value: 'manual', label: '手动' },
  ]}
/>`,
      },
      {
        id: 'radio-description', title: '每项带一句说明',
        description: '说明会和选项一起被读出来，不是读完选项之后再单独念一遍。',
        height: 300,
        render: function RadioDescription() {
          const [value, setValue] = useState('balanced');
          return <div id="radio-description-demo" style={{ width: 380 }}>
            <RadioGroup label="渲染质量" value={value} onValueChange={setValue} options={[
              { value: 'balanced', label: '均衡', description: '默认。大多数机器上都跑得动。' },
              { value: 'high', label: '高', description: '折射更细腻，也更吃显卡。' },
              { value: 'off', label: '关闭', description: '只保留模糊。最省电。' },
            ]} />
          </div>;
        },
        code: `<RadioGroup label="渲染质量" value={value} onValueChange={setValue} options={[
  { value: 'balanced', label: '均衡', description: '默认。大多数机器上都跑得动。' },
  { value: 'high', label: '高', description: '折射更细腻，也更吃显卡。' },
]} />`,
      },
      {
        id: 'radio-disabled', title: '某一项不可选',
        description: '不可选的项会被方向键跳过——这也是原生行为，不用自己算下一个是谁。',
        height: 260,
        render: function RadioDisabled() {
          const [value, setValue] = useState('personal');
          return <div id="radio-disabled-demo" style={{ width: 340 }}>
            <RadioGroup label="账户类型" value={value} onValueChange={setValue} options={[
              { value: 'personal', label: '个人' },
              { value: 'team', label: '团队', description: '当前套餐不含。', disabled: true },
              { value: 'enterprise', label: '企业' },
            ]} />
          </div>;
        },
        code: `options={[
  { value: 'personal', label: '个人' },
  { value: 'team', label: '团队', disabled: true },
]}`,
      },
    ],
    props: [
      { name: 'label', type: 'ReactNode', required: true, description: '这组选项在问什么。渲染成 <legend>。' },
      { name: 'labelHidden', type: 'boolean', default: 'false', description: '视觉上藏起来，读屏仍然念得到。周围已经问过了才关。' },
      { name: 'options', type: 'RadioOption[]', required: true, description: '`{ value, label, description?, disabled? }`。' },
      { name: 'value / defaultValue', type: 'string', description: '受控 / 非受控的选中值。' },
      { name: 'onValueChange', type: '(value: string) => void', description: '选中项变化。' },
      { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: '横排只适合短标签，而且每项占的宽度要一致。' },
      { name: 'name', type: 'string', description: '一组输入共用的 name。不传会自动生成。' },
    ],
    notes: [
      '底层是共用 name 的原生 <input type="radio">：整组一个 Tab 位，方向键移动并选中，到头会绕回来，不可用的项自动跳过。这些都是浏览器给的，组件一行都没有覆盖。',
      '组标题是真正的 <legend>——fieldset 上的 aria-label 各家读屏念得并不一致。',
      '每项的说明用 aria-describedby 绑定，所以是跟着选项一起念的。',
      '超过五项会在开发模式下告警，并建议换 Picker。',
    ],
    related: ['checkbox', 'picker', 'segmented-control'],
  },
];
