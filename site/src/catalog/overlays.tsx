import { useState } from 'react';
import {
  Banner, Form, GlassActionSheet, GlassAlert, GlassButton, GlassDialog, GlassIconButton, GlassMenu, GlassPopover,
  Card, ContextMenu, GlassMenuButton, GlassSegmentedControl, GlassSheet, GlassSlider, LibraryIcon, List, ListRow, ListSection,
  Text, TextField, Tooltip, useToast, type SheetDetent,
} from '@ttqtt/liquid-glass-react';
import { Icon } from '../icons.js';
import type { ComponentDoc } from './types.js';

/** The same commands the context-menu demo offers, shown where everyone can find them. */
function GlassToolbarLike({ commands, onPick }: {
  commands: { key: string; label: string }[]; onPick: (label: string) => void;
}) {
  return <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
    {commands.map(command => <GlassButton key={command.key} controlSize="small" variant="gray"
      onClick={() => onPick(command.label)}>{command.label}</GlassButton>)}
  </div>;
}

export const overlayDocs: ComponentDoc[] = [
  {
    slug: 'popover', name: 'GlassPopover', title: '气泡面板', group: '浮层',
    summary: '从按钮里长出来的一小块面板，不挡住后面的操作。',
    when: [
      '放一组和某个按钮直接相关的设置，用完随手点外面关掉。',
      '内容不多、也不需要用户非做决定不可的时候。',
      '在手机上这种形式应该换成从底部升起的面板。',
    ],
    examples: [
      {
        id: 'popover-basic', title: '基础用法', description: '面板从触发它的按钮位置展开，按 Escape 关闭并把焦点还回去。',
        backdrop: 'both',
        height: 240,
        knobs: [
          { name: 'align', label: '对齐', type: 'select', value: 'end', options: [
            { value: 'start', label: '起始侧' }, { value: 'center', label: '居中' }, { value: 'end', label: '末尾侧' },
          ] },
          { name: 'description', label: '显示说明', type: 'boolean', value: true },
        ],
        render: function PopoverBasic({ knobs }) {
          const [view, setView] = useState('fit');
          const [volume, setVolume] = useState(65);
          return <GlassPopover title="查看设置" align={knobs.align as 'end'}
            description={knobs.description === true ? '改动会立刻生效。' : undefined}
            trigger={<GlassButton>打开面板</GlassButton>}>
            <Text variant="subhead" emphasized style={{ marginBlockEnd: 8 }}>显示方式</Text>
            <GlassSegmentedControl aria-label="显示方式" density="compact" value={view} onValueChange={setView}
              items={[{ value: 'fit', label: '适应' }, { value: 'fill', label: '填充' }]} />
            <Text variant="subhead" emphasized style={{ margin: '16px 0 8px' }}>音量 {volume}%</Text>
            <GlassSlider aria-label="音量" value={volume} onValueChange={setVolume} />
          </GlassPopover>;
        },
        code: knobs => `<GlassPopover
  title="查看设置"${knobs.align === 'end' ? '' : `\n  align="${knobs.align}"`}${knobs.description ? '\n  description="改动会立刻生效。"' : ''}
  trigger={<GlassButton>打开面板</GlassButton>}
>
  …
</GlassPopover>`,
      },
      {
        id: 'popover-placement', title: '指定展开方向',
        description: '默认按剩余空间自动决定。想固定朝上或朝下，用 placement。',
        height: 260,
        render: function PopoverPlacement() {
          return <div id="popover-above-demo" style={{ display: 'flex', gap: 12, paddingBlockStart: 120 }}>
            <GlassPopover title="朝上展开" placement="above" trigger={<GlassButton>向上</GlassButton>}>
              <Text variant="subhead">面板在按钮上方。</Text>
            </GlassPopover>
            <GlassPopover title="朝下展开" placement="below" trigger={<GlassButton>向下</GlassButton>}>
              <Text variant="subhead">面板在按钮下方。</Text>
            </GlassPopover>
          </div>;
        },
        code: `<GlassPopover title="朝上展开" placement="above" trigger={<GlassButton>向上</GlassButton>}>
  …
</GlassPopover>`,
      },
      {
        id: 'popover-compact', title: '手机上它不是气泡',
        description: '低于 768px，同一个组件会从屏幕底部升起，而不是挂在按钮旁边——一个贴在按钮边上的小气泡，在一只手拿着的屏幕上既够不着也看不清。把窗口拉窄到 768 以下试试。',
        height: 240,
        render: function PopoverCompact() {
          return <div id="popover-compact-demo" style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassPopover title="筛选" description="窄屏下它会从底部升起。"
              trigger={<GlassButton variant="gray">筛选</GlassButton>}>
              <Text variant="subhead">同一段代码，两种形态。</Text>
            </GlassPopover>
            <Text variant="caption1" tone="secondary">形态由尺寸类别决定，不由设备类型决定。</Text>
          </div>;
        },
        code: `{/* 不用写两套：组件自己按尺寸类别切换 */}
<GlassPopover title="筛选" trigger={<GlassButton>筛选</GlassButton>}>
  …
</GlassPopover>`,
      },
    ],
    props: [
      { name: 'trigger', type: 'ReactElement', description: '你自己的按钮。组件只负责把它和面板关联起来。' },
      { name: 'title', type: 'string', required: true, description: '面板标题。' },
      { name: 'description', type: 'string', description: '标题下面的一句说明。' },
      { name: 'align', type: "'start' | 'center' | 'end'", default: "'end'", description: '相对按钮的对齐方式。' },
      { name: 'placement', type: "'below' | 'above' | 'auto'", default: "'auto'", description: '朝哪个方向展开。auto 表示下方放不下就翻到上方。' },
      { name: 'open / defaultOpen / onOpenChange', type: 'boolean / (open) => void', description: '自己控制开合，或交给组件。' },
    ],
    notes: [
      '打开时焦点会移到面板里第一个能操作的元素。',
      '点外面就关，按 Escape 也关，关掉后焦点回到原来的按钮。',
      '快贴到屏幕边时会自动换一侧，不会被截掉。',
    ],
    related: ['menu', 'sheet', 'dialog'],
  },
  {
    slug: 'menu', name: 'GlassMenu', title: '菜单', group: '浮层',
    summary: '一列可以执行的操作。',
    when: [
      '一个按钮后面挂着好几个相关操作，平时不需要都摆出来。',
      '每组控制在七项左右，用分隔线分组，而不是拉成一条长清单。',
      '如果用户是在“选一个值”而不是“做一件事”，那不是菜单。',
    ],
    examples: [
      {
        id: 'menu-basic', title: '基础用法', description: '支持上下键、Home/End、直接打字跳转，Escape 关闭。',
        backdrop: 'both',
        height: 220,
        knobs: [
          { name: 'align', label: '对齐', type: 'select', value: 'end', options: [
            { value: 'start', label: '起始侧' }, { value: 'center', label: '居中' }, { value: 'end', label: '末尾侧' },
          ] },
          { name: 'placement', label: '方向', type: 'select', value: 'auto', options: [
            { value: 'auto', label: '自动' }, { value: 'below', label: '朝下' }, { value: 'above', label: '朝上' },
          ] },
        ],
        render: function MenuBasic({ knobs }) {
          const [status, setStatus] = useState('还没选');
          const [pinned, setPinned] = useState(true);
          return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassMenu aria-label="示例菜单" align={knobs.align as 'end'} placement={knobs.placement as 'auto'}
              trigger={<GlassButton>打开菜单<LibraryIcon name="chevronDown" size={16} /></GlassButton>}
              items={[
                { key: 'open', label: '打开', icon: <LibraryIcon name="chevronForward" size={16} />, shortcut: '⌘O', onSelect: () => setStatus('打开') },
                { key: 'pin', label: '置顶', checked: pinned, onSelect: () => { setPinned(!pinned); setStatus(pinned ? '取消置顶' : '已置顶'); } },
                { key: 'disabled', label: '暂不可用', disabled: true, onSelect: () => {} },
                { key: 'delete', label: '删除', destructive: true, separatorBefore: true, onSelect: () => setStatus('删除') },
              ]} />
            <Text variant="caption1" tone="secondary" role="status">{status}</Text>
          </div>;
        },
        code: knobs => `<GlassMenu aria-label="更多操作"${knobs.align === 'end' ? '' : `\n  align="${knobs.align}"`}${knobs.placement === 'auto' ? '' : `\n  placement="${knobs.placement}"`}
  trigger={<GlassIconButton aria-label="更多"><MoreIcon /></GlassIconButton>}
  items={[
    { key: 'open', label: '打开', shortcut: '⌘O', onSelect: open },
    { key: 'pin', label: '置顶', checked: pinned, onSelect: togglePin },
    { key: 'delete', label: '删除', destructive: true, separatorBefore: true, onSelect: remove },
  ]}
/>`,
      },
      {
        id: 'menu-single', title: '勾选是多选还是单选',
        description: 'selection="single" 之后，带勾的项变成 menuitemradio，读屏会说「三项之中的第二项，已选中」。默认是多选，每一项各自独立。',
        height: 240,
        render: function MenuSelection() {
          const [sort, setSort] = useState('name');
          const [shown, setShown] = useState<string[]>(['size']);
          const toggle = (key: string) => setShown(list => list.includes(key) ? list.filter(item => item !== key) : [...list, key]);
          return <div id="menu-selection-demo" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <GlassMenu aria-label="排序方式" selection="single"
              trigger={<GlassButton variant="gray">排序<LibraryIcon name="chevronDown" size={16} /></GlassButton>}
              items={[
                { key: 'name', label: '按名称', checked: sort === 'name', onSelect: () => setSort('name') },
                { key: 'date', label: '按日期', checked: sort === 'date', onSelect: () => setSort('date') },
                { key: 'size', label: '按大小', checked: sort === 'size', onSelect: () => setSort('size') },
              ]} />
            <GlassMenu aria-label="显示哪些列"
              trigger={<GlassButton variant="gray">显示的列<LibraryIcon name="chevronDown" size={16} /></GlassButton>}
              items={[
                { key: 'size', label: '大小', checked: shown.includes('size'), onSelect: () => toggle('size') },
                { key: 'kind', label: '种类', checked: shown.includes('kind'), onSelect: () => toggle('kind') },
                { key: 'date', label: '修改日期', checked: shown.includes('date'), onSelect: () => toggle('date') },
              ]} />
          </div>;
        },
        code: `{/* 单选：一组互斥的值 */}
<GlassMenu aria-label="排序方式" selection="single" items={…} />

{/* 多选（默认）：各自独立的开关 */}
<GlassMenu aria-label="显示哪些列" items={…} />`,
      },
      {
        id: 'menu-grouping', title: '用分隔线分组，不要拉成长清单',
        description: '每组七项左右。危险的那一条单独一组排在最后——分隔线在这里不是装饰，是让手滑点不到它的那段距离。',
        height: 230,
        render: function MenuGrouping() {
          const [status, setStatus] = useState('还没选');
          return <div id="menu-grouping-demo" style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassMenu aria-label="文件操作"
              trigger={<GlassButton variant="gray">文件<LibraryIcon name="chevronDown" size={16} /></GlassButton>}
              items={[
                { key: 'new', label: '新建', shortcut: '⌘N', onSelect: () => setStatus('新建') },
                { key: 'open', label: '打开…', shortcut: '⌘O', onSelect: () => setStatus('打开') },
                { key: 'save', label: '存储', shortcut: '⌘S', separatorBefore: true, onSelect: () => setStatus('存储') },
                { key: 'export', label: '导出…', onSelect: () => setStatus('导出') },
                { key: 'delete', label: '移到废纸篓', destructive: true, separatorBefore: true, onSelect: () => setStatus('移到废纸篓') },
              ]} />
            <Text variant="caption1" tone="secondary" role="status">{status}</Text>
          </div>;
        },
        code: `items={[
  { key: 'new', label: '新建', shortcut: '⌘N', onSelect: create },
  { key: 'save', label: '存储', shortcut: '⌘S', separatorBefore: true, onSelect: save },
  { key: 'delete', label: '移到废纸篓', destructive: true, separatorBefore: true, onSelect: trash },
]}`,
      },
    ],
    props: [
      { name: 'items', type: 'GlassMenuItem[]', required: true, description: '每一项包含标识、文字和点击后做什么。' },
      { name: 'icon', type: 'ReactNode', description: '只给有约定俗成图标的操作配图，不要逐行装饰。' },
      { name: 'checked', type: 'boolean', description: '带勾选状态的项。' },
      { name: 'shortcut', type: 'string', description: '快捷键提示。' },
      { name: 'destructive', type: 'boolean', description: '标红。危险操作仍然需要确认或撤销。' },
      { name: 'aria-label', type: 'string', required: true, description: '这个菜单是做什么的。' },
      { name: 'selection', type: "'multiple' | 'single'", default: "'multiple'", description: '勾在这里表示什么。single 让带勾的项变成 menuitemradio。' },
      { name: 'align', type: "'start' | 'center' | 'end'", default: "'end'", description: '相对按钮的对齐方式。' },
      { name: 'placement', type: "'below' | 'above' | 'auto'", default: "'auto'", description: '朝哪个方向展开。auto 表示下方放不下就翻到上方。' },
    ],
    notes: [
      '菜单项是真正的按钮，键盘可以逐项走过去。',
      '连续打字会跳到匹配的项上，停顿约 0.7 秒后重新开始。',
    ],
    related: ['menu-button', 'popover', 'action-sheet', 'button'],
  },
  {
    slug: 'menu-button', name: 'GlassMenuButton', title: '菜单按钮', group: '浮层',
    summary: '自带菜单的按钮。菜单从按钮里长出来，不是出现在它旁边。',
    when: [
      '下拉式（pullDown）：按钮有自己的动作，菜单是这个动作的变体或相关命令。按钮文字不变。',
      '弹出式（popUp）：在一组互斥的选项里选一个，按钮上显示的就是当前选中的那个。',
      '至少三项才值得。菜单要先打开才看得到，两项的话直接摆两个按钮看到的更多。',
      '不要把一个页面的主要操作都塞进菜单里——藏起来就等于不好找。',
    ],
    examples: [
      {
        id: 'pulldown-demo', title: '下拉式：按钮说自己做什么', description: '标签固定不变，菜单列的是这个动作的几种做法。危险项标红并排在最后。',
        backdrop: 'both',
        height: 210,
        render: function PullDownDemo() {
          const [result, setResult] = useState('还没选');
          return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassMenuButton label="新建" items={[
              { key: 'doc', label: '文稿', onSelect: () => setResult('文稿') },
              { key: 'folder', label: '文件夹', onSelect: () => setResult('文件夹') },
              { key: 'from', label: '从模板新建…', onSelect: () => setResult('从模板') },
              { key: 'clear', label: '清空草稿', destructive: true, separatorBefore: true, onSelect: () => setResult('清空草稿') },
            ]} />
            <Text id="pulldown-result" variant="caption1" tone="secondary" role="status">选了：{result}</Text>
          </div>;
        },
        code: `<GlassMenuButton label="新建" items={[
  { key: 'doc', label: '文稿', onSelect: newDoc },
  { key: 'folder', label: '文件夹', onSelect: newFolder },
  { key: 'clear', label: '清空草稿', destructive: true, separatorBefore: true, onSelect: clear },
]} />`,
      },
      {
        id: 'popup-demo', title: '弹出式：按钮说现在选的是什么', description: '按钮上写的就是当前值，选完立刻换掉。菜单项是一组单选，不是一排独立的勾选。',
        height: 230,
        knobs: [
          { name: 'variant', label: '样式', type: 'select', value: 'glass', options: [
            { value: 'glass', label: '玻璃' }, { value: 'gray', label: '灰底' }, { value: 'plain', label: '文字' },
          ] },
          { name: 'controlSize', label: '尺寸', type: 'select', value: 'regular', options: [
            { value: 'small', label: '小' }, { value: 'regular', label: '默认' }, { value: 'large', label: '大' },
          ] },
        ],
        render: function PopUpDemo({ knobs }) {
          const [quality, setQuality] = useState('medium');
          return <div id="popup-demo" style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassMenuButton kind="popUp" aria-label="画质" value={quality} onValueChange={setQuality}
              variant={knobs.variant as 'glass'} controlSize={knobs.controlSize as 'regular'}
              options={[
                { value: 'low', label: '流畅' },
                { value: 'medium', label: '中等' },
                { value: 'high', label: '高' },
                { value: 'auto', label: '自动', separatorBefore: true },
              ]} />
            <Text variant="caption1" tone="secondary" role="status">当前画质：{quality}</Text>
          </div>;
        },
        code: knobs => `<GlassMenuButton
  kind="popUp"
  aria-label="画质"${knobs.variant === 'glass' ? '' : `\n  variant="${knobs.variant}"`}${knobs.controlSize === 'regular' ? '' : `\n  controlSize="${knobs.controlSize}"`}
  value={quality}
  onValueChange={setQuality}
  options={[
    { value: 'low', label: '流畅' },
    { value: 'medium', label: '中等' },
    { value: 'high', label: '高' },
  ]}
/>`,
      },
      {
        id: 'menubutton-sizes', title: '尺寸与样式', description: '和 GlassButton 用同一套 variant 与 controlSize。工具栏里通常用 gray 或 plain，别让每个都抢主按钮的位置。',
        height: 210,
        render: function MenuButtonSizes() {
          const [sort, setSort] = useState('name');
          const options = [
            { value: 'name', label: '按名称' },
            { value: 'date', label: '按日期' },
            { value: 'size', label: '按大小' },
          ];
          return <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <GlassMenuButton kind="popUp" aria-label="排序方式（小）" controlSize="small" variant="gray"
              value={sort} onValueChange={setSort} options={options} />
            <GlassMenuButton kind="popUp" aria-label="排序方式" value={sort} onValueChange={setSort} options={options} />
            <GlassMenuButton kind="popUp" aria-label="排序方式（大）" controlSize="large" variant="glassProminent"
              value={sort} onValueChange={setSort} options={options} />
          </div>;
        },
        code: `<GlassMenuButton kind="popUp" aria-label="排序方式"
  controlSize="small" variant="gray"
  value={sort} onValueChange={setSort} options={options} />`,
      },
    ],
    props: [
      { name: 'kind', type: "'pullDown' | 'popUp'", default: "'pullDown'", description: '按钮说自己做什么，还是说现在选的是什么。' },
      { name: 'label', type: 'ReactNode', description: 'pullDown 专用：按钮上的文字，不随菜单选择变化。' },
      { name: 'items', type: 'GlassMenuItem[]', description: 'pullDown 专用：和 GlassMenu 完全一样的一组命令。' },
      { name: 'options', type: 'GlassMenuOption[]', description: 'popUp 专用：一组互斥的值。没有 onSelect——选中什么由 onValueChange 统一上报。' },
      { name: 'value / defaultValue', type: 'string', description: 'popUp 专用：当前值。不传 defaultValue 就用第一项。' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'popUp 专用：选中变化。' },
      { name: 'aria-label', type: 'string', description: 'popUp 上必填：按钮文字是当前值，永远说不出在选什么。' },
      { name: 'placeholder', type: 'string', description: 'popUp 专用：还没选中任何值时按钮上显示什么。能给一个真正的默认值就别用占位符。' },
      { name: 'variant / controlSize', type: 'GlassButtonVariant / ControlSize', description: '同 GlassButton。' },
      { name: 'align / placement', type: "Align / 'below' | 'above' | 'auto'", description: '菜单相对按钮的位置，同 GlassMenu。' },
    ],
    notes: [
      '按钮带 aria-haspopup="menu" 与 aria-expanded，菜单打开后焦点直接落在第一项上。',
      'popUp 的菜单项是 menuitemradio：读屏会说「三项之中的第二项，已选中」，而不是三个各自独立的勾选框。',
      '键盘路径和 GlassMenu 一致：上下键、Home/End、打字跳转、Escape 关闭并把焦点还给按钮。',
      '少于三项时开发模式会给一条告警——不是错误，两项是个判断题，但值得停下来想一下。',
    ],
    related: ['menu', 'button', 'action-sheet'],
    imports: ['GlassMenuButton'],
  },
  {
    slug: 'tooltip', name: 'Tooltip', title: '提示', group: '浮层',
    summary: '把图标按钮的名字显示出来，给看得见但听不见的人。',
    when: [
      '只有图标的按钮。aria-label 告诉了读屏它是什么，鼠标用户只能靠猜。',
      '文案说「这个按钮做什么」，以动词开头：「恢复默认设置」。不要解释标准控件怎么用。',
      '触摸屏上不要用，组件也不会渲染——没有悬停，只剩下「点一下先弹个东西出来」。',
      '它是补充说明，不是名字。控件自己仍然要有 aria-label。',
    ],
    examples: [
      {
        id: 'tooltip-basic', title: '基础用法', description: '指针停留约 0.6 秒出现；用键盘 Tab 聚焦会立刻出现，因为那是有意为之的动作。',
        backdrop: 'both',
        height: 200,
        render: () => <div id="tooltip-demo" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Tooltip content="恢复默认设置">
            <GlassIconButton aria-label="恢复默认设置"><LibraryIcon name="minus" /></GlassIconButton>
          </Tooltip>
          <Tooltip content="添加一个新的工作区">
            <GlassIconButton aria-label="新建工作区"><LibraryIcon name="plus" /></GlassIconButton>
          </Tooltip>
          <Tooltip content="在所有组件里搜索">
            <GlassIconButton aria-label="搜索"><LibraryIcon name="search" /></GlassIconButton>
          </Tooltip>
        </div>,
        code: `<Tooltip content="恢复默认设置">
  <GlassIconButton aria-label="恢复默认设置">
    <ResetIcon />
  </GlassIconButton>
</Tooltip>`,
      },
      {
        id: 'tooltip-placement', title: '朝下展开', description: '默认朝上；顶部没地方时自己翻下来，也可以指定。',
        height: 200,
        render: () => <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Tooltip content="朝下展开的提示" placement="below">
            <GlassButton>朝下</GlassButton>
          </Tooltip>
          <Tooltip content="朝上展开的提示" placement="above">
            <GlassButton>朝上</GlassButton>
          </Tooltip>
        </div>,
        code: `<Tooltip content="朝下展开的提示" placement="below">
  <GlassButton>朝下</GlassButton>
</Tooltip>`,
      },
      {
        id: 'tooltip-delay', title: '延迟', description: '默认 600ms。调短了，指针扫过一排按钮会一路弹出来；调长了没人等得到。',
        height: 230,
        knobs: [
          { name: 'delay', label: '延迟（毫秒）', type: 'number', value: 600, min: 0, max: 1500, step: 100 },
          { name: 'placement', label: '方向', type: 'select', value: 'above', options: [
            { value: 'above', label: '朝上' }, { value: 'below', label: '朝下' },
          ] },
          { name: 'content', label: '文案', type: 'text', value: '恢复默认设置' },
        ],
        render: function TooltipDelay({ knobs }) {
          return <div id="tooltip-delay-demo" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Tooltip content={String(knobs.content)} delay={Number(knobs.delay)} placement={knobs.placement as 'above'}>
              <GlassButton>可调节的那个</GlassButton>
            </Tooltip>
            <Tooltip content="等 0.2 秒" delay={200}><GlassButton variant="gray">200ms</GlassButton></Tooltip>
            <Tooltip content="等 1.2 秒" delay={1200}><GlassButton variant="gray">1200ms</GlassButton></Tooltip>
          </div>;
        },
        code: knobs => `<Tooltip content="${knobs.content}"${knobs.delay === 600 ? '' : ` delay={${knobs.delay}}`}${knobs.placement === 'above' ? '' : ' placement="below"'}>
  <GlassButton>按钮</GlassButton>
</Tooltip>`,
      },
    ],
    props: [
      { name: 'content', type: 'ReactNode', required: true, description: '这个控件做什么，以动词开头。' },
      { name: 'children', type: 'ReactElement', required: true, description: '它描述的那个控件。组件用 cloneElement 接上去，不加包裹层，所以布局不会变。' },
      { name: 'delay', type: 'number', default: '600', description: '悬停多久后出现。聚焦不受这个值影响，立刻出现。' },
      { name: 'placement', type: "'above' | 'below'", default: "'above'", description: '朝哪边展开。放不下时自动翻到另一边。' },
    ],
    notes: [
      '用 aria-describedby 关联，不是 aria-labelledby——它是补充说明。控件自己的名字必须另外给。',
      '`(pointer: coarse)` 下整个组件不渲染：触摸屏没有悬停，硬做只会变成「点一下先弹个东西挡住按钮」。',
      '按 Escape 关掉，不影响其他任何东西。指针按下也会关——你已经点了，不需要再被告知它是什么。',
      '同一时刻只有一个提示；指针移到下一个按钮时，前一个直接让位。',
    ],
    related: ['button', 'menu', 'toast'],
    imports: ['Tooltip'],
  },
  {
    slug: 'context-menu', name: 'ContextMenu', title: '右键菜单', group: '浮层',
    summary: '把菜单开在东西本身上：右键、长按、或者键盘的菜单键。',
    when: [
      '**里面的每一条都必须有别的路径能做到。** 右键菜单是给知道它存在的人的快捷方式；只活在右键菜单里的命令，大多数人永远找不到。',
      '要短。它回答的是「在这儿最可能要做什么」，不是「一共能做什么」。超过十来条开发模式会告警。',
      '三种触发方式对应三类用户：右键、触摸长按 500ms、键盘 Shift+F10 或菜单键。少一种就有一类人用不了。',
    ],
    examples: [
      {
        id: 'context-basic', title: '基础用法', description: '在卡片上右键；触摸屏长按；用 Tab 聚焦到里面的按钮后按 Shift+F10。',
        backdrop: 'both',
        height: 280,
        render: function ContextBasic() {
          const [result, setResult] = useState('还没选');
          return <div id="context-demo" style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <ContextMenu aria-label="照片操作" items={[
              { key: 'open', label: '打开', shortcut: '⌘O', onSelect: () => setResult('打开') },
              { key: 'rename', label: '重命名', onSelect: () => setResult('重命名') },
              { key: 'copy', label: '拷贝', shortcut: '⌘C', onSelect: () => setResult('拷贝') },
              { key: 'delete', label: '删除', destructive: true, separatorBefore: true, onSelect: () => setResult('删除') },
            ]}>
              <Card radius={16} padding={20} style={{ width: 240, textAlign: 'center' }}>
                <Text variant="subhead">在这张卡片上右键</Text>
                <GlassButton controlSize="small" variant="gray" style={{ marginBlockStart: 12 }}
                  onClick={() => setResult('主界面按钮')}>打开（主界面也有）</GlassButton>
              </Card>
            </ContextMenu>
            <Text variant="caption1" tone="secondary" role="status">选了：{result}</Text>
          </div>;
        },
        code: `<ContextMenu aria-label="照片操作" items={[
  { key: 'open', label: '打开', shortcut: '⌘O', onSelect: open },
  { key: 'delete', label: '删除', destructive: true, separatorBefore: true, onSelect: remove },
]}>
  <PhotoCard />
</ContextMenu>`,
      },
      {
        id: 'context-longpress', title: '触摸是长按',
        description: '按住 500ms 打开；手指移动超过 10px 就取消，因为那是在滚动。把延迟调太短，每一次滑动列表都会弹出菜单。',
        height: 260,
        knobs: [{ name: 'longPressDelay', label: '长按时长（毫秒）', type: 'number', value: 500, min: 200, max: 1000, step: 100 }],
        render: function ContextLongPress({ knobs }) {
          const [result, setResult] = useState('还没选');
          return <div id="context-longpress-demo" style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <ContextMenu aria-label="行操作" longPressDelay={Number(knobs.longPressDelay)} items={[
              { key: 'pin', label: '置顶', onSelect: () => setResult('置顶') },
              { key: 'mark', label: '标为已读', onSelect: () => setResult('标为已读') },
              { key: 'archive', label: '归档', onSelect: () => setResult('归档') },
            ]}>
              <List style={{ width: 280 }}>
                <ListSection>
                  <ListRow label="周会纪要" secondaryLabel="长按或右键" />
                  <ListRow label="发票" secondaryLabel="长按或右键" />
                </ListSection>
              </List>
            </ContextMenu>
            <Text variant="caption1" tone="secondary" role="status">选了：{result}</Text>
          </div>;
        },
        code: knobs => `<ContextMenu aria-label="行操作"${knobs.longPressDelay === 500 ? '' : ` longPressDelay={${knobs.longPressDelay}}`} items={…}>
  <List>…</List>
</ContextMenu>`,
      },
      {
        id: 'context-also-elsewhere', title: '每一条都要有别的路',
        description: '右键菜单是给已经知道它存在的人的快捷方式。只活在右键里的命令，大多数人一辈子也找不到——所以这里同一组命令在工具栏里也有一份。',
        height: 300,
        render: function ContextElsewhere() {
          const [result, setResult] = useState('还没选');
          const commands = [
            { key: 'copy', label: '拷贝', shortcut: '⌘C' },
            { key: 'rename', label: '重命名' },
            { key: 'share', label: '分享' },
          ];
          return <div id="context-elsewhere-demo" style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassToolbarLike commands={commands} onPick={setResult} />
            <ContextMenu aria-label="同样的三条命令"
              items={commands.map(command => ({ ...command, onSelect: () => setResult(command.label) }))}>
              <Card radius={16} padding={20} style={{ width: 240, textAlign: 'center' }}>
                <Text variant="subhead">右键这里，得到的是同一组命令</Text>
              </Card>
            </ContextMenu>
            <Text variant="caption1" tone="secondary" role="status">选了：{result}</Text>
          </div>;
        },
        code: `const commands = [{ key: 'copy', label: '拷贝', onSelect: copy }, …];

{/* 主界面里 */}
<GlassToolbar aria-label="操作">…同一组…</GlassToolbar>

{/* 以及快捷方式 */}
<ContextMenu aria-label="操作" items={commands}>…</ContextMenu>`,
      },
    ],
    props: [
      { name: 'items', type: 'GlassMenuItem[]', required: true, description: '命令。和 GlassMenu 完全一样的那一套。' },
      { name: 'aria-label', type: 'string', required: true, description: '这个菜单是做什么的。' },
      { name: 'longPressDelay', type: 'number', default: '500', description: '触摸按住多久才打开。手指移动超过 10px 就取消——那是在滚动。' },
    ],
    notes: [
      '键盘路径是 Shift+F10 和菜单键，这是平台自己打开右键菜单的方式，也是唯一的一条。没有它整个功能就只有指针能用。',
      '打开后的键盘模型和 GlassMenu 是同一份代码：上下移动、Home/End、打字跳转、Escape 关闭并还回焦点。',
      '包裹层是一个真正的盒子而不是 display: contents——后者会把元素从无障碍树里摘掉，而且键盘打开时没有位置可量。',
      '页面一滚动就关掉：菜单钉在打开时的那个点上，内容滑走了它就指错了地方。',
    ],
    related: ['menu', 'menu-button', 'action-sheet'],
    imports: ['ContextMenu'],
  },
  {
    slug: 'sheet', name: 'GlassSheet', title: '底部面板', group: '浮层',
    summary: '从屏幕底部升起的面板，可以拖到不同高度。',
    when: [
      '一个需要专注完成、但又不值得跳转整页的任务：分享、筛选、快速编辑。',
      '内容可多可少时给两个停靠高度，让用户自己决定要看多少。',
      '拖到最顶时它会变成不透明并贴住屏幕边缘——这时它已经是一整屏了。',
    ],
    examples: [
      {
        id: 'sheet-basic', title: '基础用法', description: '按住顶部的横条上下拖动，松手会停在最近的高度。往下拖到底就是关闭。',
        backdrop: 'both',
        height: 220,
        knobs: [
          { name: 'detents', label: '停靠高度', type: 'select', value: 'medium,large', options: [
            { value: 'medium,large', label: '一半与整屏' },
            { value: 'medium', label: '只有一半' },
            { value: 'large', label: '只有整屏' },
          ] },
          { name: 'grabber', label: '顶部横条', type: 'boolean', value: true },
        ],
        render: function SheetBasic({ knobs }) {
          const [open, setOpen] = useState(false);
          const detents = String(knobs.detents).split(',') as SheetDetent[];
          return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassSheet title="分享这一刻" description="按住顶部的横条上下拖动，试试两个高度。"
              open={open} onOpenChange={setOpen} detents={detents} grabber={knobs.grabber === true}
              trigger={<GlassButton>打开面板</GlassButton>}>
              <div style={{ display: 'grid', gap: 12, marginBlockStart: 12 }}>
                <TextField label="备注" placeholder="想说点什么" />
                <GlassButton variant="glassProminent" onClick={() => setOpen(false)}>完成</GlassButton>
              </div>
            </GlassSheet>
            <Text variant="caption1" tone="secondary">横条也支持键盘：上下方向键换高度</Text>
          </div>;
        },
        code: knobs => `<GlassSheet
  title="分享这一刻"
  detents={[${String(knobs.detents).split(',').map(name => `'${name}'`).join(', ')}]}${knobs.grabber ? '' : '\n  grabber={false}'}
  trigger={<GlassButton>分享</GlassButton>}
>
  …
</GlassSheet>`,
      },
      {
        id: 'sheet-scroll', title: '内容可滚动时', description: '整块面板都能拖，不只是顶部的横条。内容滚到顶再往下拉才是收起——中途往下拉是在滚回去。',
        height: 200,
        render: function SheetScroll() {
          const [open, setOpen] = useState(false);
          const [picked, setPicked] = useState('还没选');
          return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassSheet title="选择城市" description="列表很长，可以滚动。"
              open={open} onOpenChange={setOpen} detents={['medium', 'large']}
              trigger={<GlassButton>打开长列表</GlassButton>}>
              <List style={{ marginBlockStart: 12 }}>
                <ListSection>
                  {['北京', '上海', '广州', '深圳', '杭州', '成都', '南京', '武汉', '西安', '重庆', '苏州', '天津', '长沙', '青岛', '厦门', '合肥']
                    .map(city => <ListRow key={city} label={city} onSelect={() => { setPicked(city); setOpen(false); }} />)}
                </ListSection>
              </List>
            </GlassSheet>
            <Text variant="caption1" tone="secondary" role="status">已选：{picked}</Text>
          </div>;
        },
        code: `<GlassSheet title="选择城市" detents={['medium', 'large']} trigger={…}>
  <List>…很长的列表…</List>
</GlassSheet>`,
      },
      {
        id: 'sheet-one-detent', title: '只有一个高度时关掉横条',
        description: '横条表示「这个还能拖到别的高度」。只有一档却留着它，是承诺了一件做不到的事——而且它对键盘用户是一个调不动的滑块。',
        height: 220,
        render: function SheetOneDetent() {
          const [open, setOpen] = useState(false);
          return <div id="sheet-one-detent-demo" style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassSheet title="重命名" description="改完按完成。" grabber={false} detents={['medium']}
              open={open} onOpenChange={setOpen}
              trigger={<GlassButton variant="gray">重命名</GlassButton>}>
              <div style={{ display: 'grid', gap: 12, marginBlockStart: 12 }}>
                <TextField label="名称" defaultValue="封面.png" />
                <GlassButton variant="glassProminent" onClick={() => setOpen(false)}>完成</GlassButton>
              </div>
            </GlassSheet>
            <Text variant="caption1" tone="secondary">一档高度，没有横条。</Text>
          </div>;
        },
        code: `<GlassSheet title="重命名" detents={['medium']} grabber={false} trigger={…}>
  …
</GlassSheet>`,
      },
    ],
    props: [
      { name: 'detents', type: "SheetDetent[]", default: "['medium', 'large']", description: '可以停靠的高度，从小到大。' },
      { name: 'defaultDetent', type: 'SheetDetent', description: '打开时停在哪一档。' },
      { name: 'grabber', type: 'boolean', default: 'true', description: '顶部的拖动横条。只有一个高度时才关掉。' },
      { name: 'description', type: 'string', description: '标题下面的一句说明。' },
      { name: 'onDetentChange', type: '(detent: SheetDetent) => void', description: '停靠高度变了。' },
      { name: 'title', type: 'string', required: true, description: '面板标题。' },
    ],
    notes: [
      '打开时焦点被限制在面板里，按 Escape 关闭，关掉后焦点回到原来的按钮。',
      '横条对键盘用户是一个可调节的控件：上下方向键换高度，在最低档再往下就关闭。',
      '拖动全程跟手，松手后弹回最近的高度；开启“减少动效”后直接切换，不做动画。',
    ],
    related: ['dialog', 'action-sheet'],
  },
  {
    slug: 'alert', name: 'GlassAlert', title: '警告框', group: '浮层',
    summary: '一个必须当场回答的问题，最多三个选项。',
    when: [
      '操作不可撤销，并且后果比较重：删除、覆盖、退出未保存的内容。',
      '如果这件事是可以撤销的，就直接做，然后给一个“撤销”，不要打断用户。',
      '别拿它来通知。只是想让人知道发生了什么，用轻提示。',
    ],
    examples: [
      {
        id: 'alert-destructive', title: '危险操作', description: '有危险选项时，焦点一开始就落在“取消”上。按 Escape 等于取消。',
        backdrop: 'both',
        height: 210,
        knobs: [
          { name: 'message', label: '说明', type: 'text', value: '里面的 12 个项目会一起被删除，这个操作没法撤销。' },
          { name: 'third', label: '加第三个选项', type: 'boolean', value: false },
        ],
        render: function AlertDestructive({ knobs }) {
          const [result, setResult] = useState('还没决定');
          return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassAlert title="删除这个工作区？" message={String(knobs.message) || undefined}
              trigger={<GlassButton variant="destructive">删除工作区</GlassButton>}
              actions={[
                { key: 'cancel', label: '取消', role: 'cancel' as const, onSelect: () => setResult('已取消') },
                ...(knobs.third === true ? [{ key: 'archive', label: '改为归档', onSelect: () => setResult('已归档') }] : []),
                { key: 'delete', label: '删除', role: 'destructive' as const, onSelect: () => setResult('已删除（只是演示）') },
              ]} />
            <Text variant="caption1" tone="secondary" role="status">{result}</Text>
          </div>;
        },
        code: `<GlassAlert
  title="删除这个工作区？"
  message="里面的 12 个项目会一起被删除，这个操作没法撤销。"
  trigger={<GlassButton variant="destructive">删除</GlassButton>}
  actions={[
    { key: 'cancel', label: '取消', role: 'cancel' },
    { key: 'delete', label: '删除', role: 'destructive', onSelect: remove },
  ]}
/>`,
      },
      {
        id: 'alert-reversible', title: '可撤销的就别问',
        description: '同一件事，两种做法。右边直接做完再给一个撤销——不可逆的才值得打断，可逆的打断只是多一次点击。',
        height: 230,
        render: function AlertReversible() {
          const toast = useToast();
          const [items, setItems] = useState(['草稿 A', '草稿 B']);
          const remove = () => {
            const removed = items.at(-1);
            if (!removed) return;
            setItems(list => list.slice(0, -1));
            toast({ message: `已删除「${removed}」`, action: { label: '撤销', onSelect: () => setItems(list => [...list, removed]) } });
          };
          return <div id="alert-reversible-demo" style={{ display: 'grid', gap: 14, justifyItems: 'center' }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <GlassAlert title="退出而不保存？" message="这次编辑的内容会丢失。"
                trigger={<GlassButton variant="destructive">不可逆：退出</GlassButton>}
                actions={[
                  { key: 'cancel', label: '取消', role: 'cancel' },
                  { key: 'discard', label: '不保存', role: 'destructive' },
                ]} />
              <GlassButton variant="gray" onClick={remove} disabled={items.length === 0}>可逆：删除草稿</GlassButton>
            </div>
            <Text variant="caption1" tone="secondary" role="status">剩余：{items.join('、') || '（空）'}</Text>
          </div>;
        },
        code: `{/* 不可逆：先问 */}
<GlassAlert title="退出而不保存？" actions={[…]} />

{/* 可逆：直接做，给一个撤销 */}
toast({ message: '已删除', action: { label: '撤销', onSelect: restore } });`,
      },
      {
        id: 'alert-three', title: '三个选项会竖排',
        description: '两个选项并排，三个就竖着排——挤在一行的三个按钮，文字会被压成谁也读不出来的样子。超过三个应该是操作表。',
        height: 210,
        render: function AlertThree() {
          const [result, setResult] = useState('还没决定');
          return <div id="alert-three-demo" style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassAlert title="这份文稿有未保存的改动" message="离开之前要怎么处理？"
              trigger={<GlassButton>打开三选项的警告框</GlassButton>}
              actions={[
                { key: 'cancel', label: '取消', role: 'cancel', onSelect: () => setResult('取消') },
                { key: 'save', label: '保存并离开', onSelect: () => setResult('保存并离开') },
                { key: 'discard', label: '不保存', role: 'destructive', onSelect: () => setResult('不保存') },
              ]} />
            <Text variant="caption1" tone="secondary" role="status">{result}</Text>
          </div>;
        },
        code: `<GlassAlert title="这份文稿有未保存的改动" actions={[
  { key: 'cancel', label: '取消', role: 'cancel' },
  { key: 'save', label: '保存并离开', onSelect: save },
  { key: 'discard', label: '不保存', role: 'destructive', onSelect: discard },
]} />`,
      },
    ],
    props: [
      { name: 'title', type: 'string', required: true, description: '加粗、左对齐的标题。' },
      { name: 'message', type: 'string', description: '一两句话说清会发生什么。' },
      { name: 'actions', type: 'AlertAction[]', required: true, description: '最多三个。更多选项用操作表。' },
      { name: 'role', type: "'default' | 'cancel' | 'destructive'", default: "'default'", description: '每个选项的性质，决定配色和初始焦点。' },
    ],
    notes: [
      '按 Escape 等于选择“取消”，而不是悄悄关掉——用户按它就是想要一个明确的退出。',
      '三个选项时会改成竖着排，避免文字被挤成一团。',
    ],
    related: ['dialog', 'toast', 'action-sheet'],
  },
  {
    slug: 'action-sheet', name: 'GlassActionSheet', title: '操作表', group: '浮层',
    summary: '针对某个对象的一小组选择。',
    when: [
      '用户点了“更多”，需要在几件事里挑一件做。',
      '控制在六项以内。再多就应该是菜单或一整页。',
      '危险选项排在最后并标红，取消单独隔开——免得手滑点到。',
    ],
    examples: [
      {
        id: 'sheet-actions', title: '基础用法', description: '危险项会被自动排到最后，不管你传进来的顺序是什么。',
        backdrop: 'both',
        height: 210,
        knobs: [
          { name: 'align', label: '宽屏下的对齐', type: 'select', value: 'center', options: [
            { value: 'start', label: '起始侧' }, { value: 'center', label: '居中' }, { value: 'end', label: '末尾侧' },
          ] },
          { name: 'message', label: '说明', type: 'text', value: '选择要做的事。' },
        ],
        render: function ActionSheetBasic({ knobs }) {
          const [result, setResult] = useState('还没选');
          return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassActionSheet aria-label="照片操作" title="这一张照片"
              align={knobs.align as 'center'} message={String(knobs.message) || undefined}
              trigger={<GlassIconButton aria-label="更多操作"><Icon name="more" /></GlassIconButton>}
              actions={[
                { key: 'delete', label: '删除照片', destructive: true, onSelect: () => setResult('删除') },
                { key: 'share', label: '分享', onSelect: () => setResult('分享') },
                { key: 'duplicate', label: '创建副本', onSelect: () => setResult('创建副本') },
              ]}
              onCancel={() => setResult('已取消')} />
            <Text variant="caption1" tone="secondary" role="status">{result}</Text>
          </div>;
        },
        code: `<GlassActionSheet
  aria-label="照片操作"
  trigger={<GlassIconButton aria-label="更多"><MoreIcon /></GlassIconButton>}
  actions={[
    { key: 'share', label: '分享', onSelect: share },
    { key: 'delete', label: '删除照片', destructive: true, onSelect: remove },
  ]}
  onCancel={dismiss}
/>`,
      },
      {
        id: 'action-sheet-limit', title: '六项以内',
        description: '再多就不是「挑一件事做」了。那时候应该是菜单，或者干脆是一整页——一屏滚动的选项，谁也记不住前面有什么。',
        height: 220,
        render: function ActionSheetLimit() {
          const [result, setResult] = useState('还没选');
          return <div id="action-sheet-limit-demo" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <GlassActionSheet aria-label="文档操作" title="这份文稿"
              trigger={<GlassButton variant="gray">六项（上限）</GlassButton>}
              actions={[
                { key: 'share', label: '分享', onSelect: () => setResult('分享') },
                { key: 'duplicate', label: '创建副本', onSelect: () => setResult('创建副本') },
                { key: 'rename', label: '重命名', onSelect: () => setResult('重命名') },
                { key: 'move', label: '移动到…', onSelect: () => setResult('移动') },
                { key: 'export', label: '导出 PDF', onSelect: () => setResult('导出') },
                { key: 'delete', label: '删除', destructive: true, onSelect: () => setResult('删除') },
              ]}
              onCancel={() => setResult('已取消')} />
            <Text variant="caption1" tone="secondary" role="status">{result}</Text>
          </div>;
        },
        code: `{/* 六项以内 */}
<GlassActionSheet aria-label="文档操作" actions={sixOrFewer} onCancel={dismiss} />

{/* 更多：菜单，或者一整页 */}
<GlassMenu aria-label="文档操作" items={many} />`,
      },
      {
        id: 'action-sheet-vs-alert', title: '它不是警告框',
        description: '操作表是一组选项，界面其余部分仍然能操作；警告框是一道必须先过的关。要不要打断用户，是这两者唯一真正的区别。',
        height: 230,
        render: function ActionSheetVsAlert() {
          const [result, setResult] = useState('还没决定');
          return <div id="action-sheet-vs-alert-demo" style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <GlassActionSheet aria-label="分享方式" title="分享到哪里"
                trigger={<GlassButton variant="gray">一组选项</GlassButton>}
                actions={[
                  { key: 'link', label: '拷贝链接', onSelect: () => setResult('拷贝链接') },
                  { key: 'mail', label: '邮件', onSelect: () => setResult('邮件') },
                ]}
                onCancel={() => setResult('已取消')} />
              <GlassAlert title="确定要退出登录？" message="下次需要重新输入密码。"
                trigger={<GlassButton variant="destructive">一道关</GlassButton>}
                actions={[
                  { key: 'cancel', label: '取消', role: 'cancel', onSelect: () => setResult('取消') },
                  { key: 'out', label: '退出登录', role: 'destructive', onSelect: () => setResult('退出登录') },
                ]} />
            </div>
            <Text variant="caption1" tone="secondary" role="status">{result}</Text>
          </div>;
        },
        code: `{/* 挑一件事做：操作表 */}
<GlassActionSheet aria-label="分享方式" actions={…} onCancel={dismiss} />

{/* 必须先回答：警告框 */}
<GlassAlert title="确定要退出登录？" actions={…} />`,
      },
    ],
    props: [
      { name: 'actions', type: 'ActionSheetItem[]', required: true, description: '六项以内。' },
      { name: 'title / message', type: 'string', description: '说明这些选择作用在什么上。' },
      { name: 'align', type: "'start' | 'center' | 'end'", default: "'center'", description: '宽屏下相对触发器的对齐方式。' },
      { name: 'onCancel', type: '() => void', description: '点了取消，或者按了 Escape。' },
      { name: 'cancelLabel', type: 'string', default: "'Cancel'", description: '取消按钮的文字。' },
      { name: 'aria-label', type: 'string', required: true, description: '这组选择是关于什么的。' },
    ],
    notes: [
      '窄屏贴在底部，宽屏贴着触发它的按钮。',
      '界面其余部分仍然可以操作——这是一组选项，不是一道必须先过的关。',
    ],
    related: ['menu', 'alert', 'sheet'],
  },
  {
    slug: 'dialog', name: 'GlassDialog', title: '对话框', group: '浮层',
    summary: '一个需要专注完成的任务，背后的界面会暂时变暗。',
    when: [
      '一个小而完整的任务：新建、重命名、填一张短表单。',
      '任务再长一点就应该是一整页，而不是一个越长越高的框。',
      '只是要一个是非判断时用警告框，它更轻。',
    ],
    examples: [
      {
        id: 'dialog-form', title: '表单对话框', description: 'Tab 只会在框内循环，Escape 关闭并把焦点还给原来的按钮。',
        backdrop: 'both',
        height: 210,
        knobs: [
          { name: 'description', label: '说明', type: 'text', value: '这个示例不会提交到任何地方。' },
          { name: 'dismissOnBackdrop', label: '点外面关闭', type: 'boolean', value: true },
        ],
        render: function DialogForm({ knobs }) {
          const [name, setName] = useState('我的灵感空间');
          return <GlassDialog title="创建一个工作区" description={String(knobs.description)}
            dismissOnBackdrop={knobs.dismissOnBackdrop === true}
            trigger={<GlassButton>打开对话框</GlassButton>}>
            <div style={{ display: 'grid', gap: 16 }}>
              <TextField label="工作区名称" value={name} onChange={event => setName(event.target.value)} />
              <Text variant="footnote" tone="secondary">当前名称：{name || '（空）'}</Text>
            </div>
          </GlassDialog>;
        },
        code: knobs => `<GlassDialog
  title="创建一个工作区"
  description="${knobs.description}"${knobs.dismissOnBackdrop ? '' : '\n  dismissOnBackdrop={false}'}
  trigger={<GlassButton>新建</GlassButton>}
>
  <form>…</form>
</GlassDialog>`,
      },
      {
        id: 'dialog-confirm', title: '里面放一个真的表单',
        description: '对话框只是容器。回车提交、主操作在末尾、取消在它旁边——这些都是 Form 和 GlassButton 的事，对话框不替它们做。',
        height: 210,
        render: function DialogConfirm() {
          const [open, setOpen] = useState(false);
          const [name, setName] = useState('');
          const [created, setCreated] = useState('还没创建');
          return <div id="dialog-confirm-demo" style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassDialog title="新建文件夹" description="给它起个名字。" open={open} onOpenChange={setOpen}
              trigger={<GlassButton variant="gray">新建文件夹</GlassButton>}>
              <Form onSubmit={event => { event.preventDefault(); setCreated(name); setOpen(false); }}>
                <TextField label="名称" value={name} autoComplete="off"
                  onChange={event => setName(event.currentTarget.value)} />
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginBlockStart: 16 }}>
                  <GlassButton variant="plain" type="button" onClick={() => setOpen(false)}>取消</GlassButton>
                  <GlassButton variant="glassProminent" type="submit" disabled={!name}>创建</GlassButton>
                </div>
              </Form>
            </GlassDialog>
            <Text variant="caption1" tone="secondary" role="status">{created}</Text>
          </div>;
        },
        code: `<GlassDialog title="新建文件夹" open={open} onOpenChange={setOpen} trigger={…}>
  <Form onSubmit={create}>
    <TextField label="名称" value={name} onChange={…} />
    <GlassButton variant="glassProminent" type="submit">创建</GlassButton>
  </Form>
</GlassDialog>`,
      },
      {
        id: 'dialog-too-long', title: '任务长了就该是一整页',
        description: '对话框越长越高，最后变成一个在小窗口里滚动的页面——那时候它已经不是「一个专注的小任务」了。',
        height: 200,
        render: () => <div id="dialog-too-long-demo" style={{ display: 'grid', gap: 10, width: 320 }}>
          <Text variant="subhead">判断标准很简单：</Text>
          <Text variant="subhead" tone="secondary">框里需要滚动 → 换成一整页或页面栈。</Text>
          <Text variant="subhead" tone="secondary">只要一个是非判断 → 换成更轻的警告框。</Text>
        </div>,
        code: `{/* 一个小而完整的任务 */}
<GlassDialog title="重命名">…</GlassDialog>

{/* 更长的流程 */}
<NavigationStack root={{ key: 'setup', title: '设置', content: <Setup /> }} />`,
      },
    ],
    props: [
      { name: 'title / description', type: 'string', required: true, description: '标题和一句说明，都会念给读屏用户。' },
      { name: 'dismissOnBackdrop', type: 'boolean', default: 'true', description: '点击外面关闭。按下和松开都在外面才算数，拖选文字不会误关。' },
      { name: 'closeLabel', type: 'string', description: '右上角关闭按钮的名字。不传就用 GlassProvider 的 strings 表，再没有就是英文 “Close”。' },
    ],
    notes: [
      '焦点被限制在对话框内，背后的内容对读屏是隐藏的，这些都由浏览器保证。',
      '打开时锁住页面滚动，关掉后焦点回到原来的按钮。',
    ],
    related: ['sheet', 'alert', 'popover'],
  },
  {
    slug: 'toast', name: 'ToastProvider', title: '轻提示', group: '浮层',
    summary: '在角落里说一句刚发生了什么，顺便给一个“撤销”。',
    when: [
      '操作已经完成，用户不需要做任何事——但应该知道它发生了。',
      '可以撤销的操作用它：先做，再给一个撤销，而不是每次都先弹窗问一遍。',
      '需要用户当场做决定时不要用它，那是警告框的事。',
    ],
    examples: [
      {
        id: 'toast-undo', title: '删除并撤销', description: '删完立刻可以撤销。鼠标放上去或键盘走进去，计时会暂停。',
        backdrop: 'both',
        height: 190,
        render: function ToastUndo() {
          const toast = useToast();
          const [items, setItems] = useState(['草稿 A', '草稿 B', '草稿 C']);
          const remove = () => {
            const removed = items.at(-1);
            if (!removed) return;
            setItems(list => list.slice(0, -1));
            toast({ message: `已删除「${removed}」`, action: { label: '撤销', onSelect: () => setItems(list => [...list, removed]) } });
          };
          return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassButton variant="destructive" onClick={remove} disabled={items.length === 0}>删除最后一项</GlassButton>
            <Text variant="caption1" tone="secondary">剩余：{items.join('、') || '（空）'}</Text>
          </div>;
        },
        code: `// 应用最外层
<ToastProvider><App /></ToastProvider>

// 任意组件里
const toast = useToast();
toast({
  message: '已删除「草稿 A」',
  action: { label: '撤销', onSelect: restore },
});`,
      },
      {
        id: 'toast-tone', title: '语气', description: '语气不是装饰：只在「结果本身就是要说的那件事」时用，而且永远不能只靠颜色——所以每种语气自带一个图标。',
        height: 250,
        knobs: [
          { name: 'tone', label: '语气', type: 'select', value: 'success', options: [
            { value: 'neutral', label: '中性' }, { value: 'success', label: '成功' },
            { value: 'warning', label: '警告' }, { value: 'error', label: '错误' },
          ] },
          { name: 'message', label: '文案', type: 'text', value: '已同步' },
          { name: 'duration', label: '停留（毫秒）', type: 'number', value: 6000, min: 2000, max: 12000, step: 1000 },
        ],
        render: function ToastTone({ knobs }) {
          const toast = useToast();
          return <div id="toast-tone-demo" style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassButton onClick={() => toast({
              message: String(knobs.message), tone: knobs.tone as 'success', duration: Number(knobs.duration),
            })}>按上面的设置弹一条</GlassButton>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <GlassButton controlSize="small" variant="gray" onClick={() => toast({ message: '已同步', tone: 'success' })}>成功</GlassButton>
              <GlassButton controlSize="small" variant="gray" onClick={() => toast({ message: '离线，稍后重试', tone: 'warning' })}>警告</GlassButton>
              <GlassButton controlSize="small" variant="gray" onClick={() => toast({ message: '上传失败', tone: 'error' })}>错误</GlassButton>
              <GlassButton controlSize="small" variant="gray" onClick={() => toast({ message: '已复制' })}>中性（默认）</GlassButton>
            </div>
          </div>;
        },
        code: knobs => `toast({
  message: '${knobs.message}',${knobs.tone === 'neutral' ? '' : `\n  tone: '${knobs.tone}',`}${knobs.duration === 6000 ? '' : `\n  duration: ${knobs.duration},`}
});`,
      },
      {
        id: 'toast-dismiss', title: '总要有办法把它关掉',
        description: '等六秒不是一种关闭方式，悬停暂停对键盘用户根本不存在。所以每条都有一个 44×44 的关闭按钮，Escape 关掉最新的那一条。',
        height: 220,
        render: function ToastDismiss() {
          const toast = useToast();
          return <div id="toast-dismiss-demo" style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassButton variant="gray" onClick={() => toast({
              message: '这一条不会自己消失', duration: Infinity, dismissLabel: '关闭这条提示',
            })}>弹一条不会自己消失的</GlassButton>
            <Text variant="caption1" tone="secondary">用右边的 ✕ 关掉，或者按 Escape。</Text>
          </div>;
        },
        code: `toast({
  message: '这一条不会自己消失',
  duration: Infinity,
  dismissLabel: '关闭这条提示',
});`,
      },
    ],
    props: [
      { name: 'message', type: 'string', required: true, description: '陈述已经发生的事。' },
      { name: 'action', type: '{ label: string; onSelect: () => void }', description: '撤销入口。有了它，可撤销的操作就不必再弹窗确认。' },
      { name: 'tone', type: "'neutral' | 'success' | 'warning' | 'error'", default: "'neutral'", description: '语气。自带图标，所以不是只靠颜色。' },
      { name: 'icon', type: 'ReactNode | null', description: '覆盖语气自带的图标；传 null 表示不要图标。' },
      { name: 'duration', type: 'number', default: '6000', description: '停留多少毫秒。要留够读完并伸手过去的时间。' },
      { name: 'limit', type: 'number', default: '3', description: 'ToastProvider：最多同时堆几条。' },
    ],
    notes: [
      '读屏会在当前操作的间隙把它念出来，不会打断用户正在做的事。',
      '鼠标悬停或键盘聚焦时暂停倒计时，撤销的机会不会在伸手的路上消失。',
    ],
    related: ['alert', 'progress', 'banner'],
    imports: ['ToastProvider', 'useToast'],
  },
  {
    slug: 'banner', name: 'Banner', title: '横幅', group: '浮层',
    summary: '一条留在顶部的通知：发生了什么，以及要不要管它。',
    when: [
      '事情发生在别处——同步失败了、有新版本、网络断了——而不是用户刚做完的那一下。',
      '它会一直留着，直到被关掉或者情况变了。用户刚做完的事、几秒后就该消失的，用轻提示 ToastProvider。',
      '必须先回答才能继续的，两个都不对，那是警告框 GlassAlert。',
      '最多一个操作按钮。三个按钮的横幅是一个忘了自己是模态的对话框。',
    ],
    examples: [
      {
        id: 'banner-tones', title: '四种语气',
        backdrop: 'both',
        description: '语气自带图标，所以从来不是只靠颜色。标题一行说清发生了什么，第二行说它意味着什么。',
        height: 260,
        knobs: [
          { name: 'tone', label: '语气', type: 'select', value: 'error', options: [
            { value: 'info', label: '消息' }, { value: 'success', label: '成功' },
            { value: 'warning', label: '警告' }, { value: 'error', label: '错误' },
          ] },
          { name: 'title', label: '标题', type: 'text', value: '同步失败' },
          { name: 'message', label: '第二行', type: 'text', value: '上次同步在 3 小时前。检查网络后会自动重试。' },
          { name: 'dismissible', label: '可关闭', type: 'boolean', value: true },
        ],
        render: function BannerTones({ knobs }) {
          const [gone, setGone] = useState(false);
          return <div id="banner-tones-demo" style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 460, justifyItems: 'center' }}>
            {gone
              ? <GlassButton controlSize="small" onClick={() => setGone(false)}>再放一条</GlassButton>
              : <Banner style={{ width: '100%' }} tone={knobs.tone as 'info'}
                title={String(knobs.title)} message={String(knobs.message)}
                onDismiss={knobs.dismissible === true ? () => setGone(true) : undefined}
                dismissLabel="关闭这条通知" />}
            <Text variant="caption1" tone="secondary">可关闭时，也可以用手指把它往上一甩。</Text>
          </div>;
        },
        code: knobs => `<Banner
  tone="${knobs.tone}"
  title="${knobs.title}"
  message="${knobs.message}"${knobs.dismissible ? '\n  onDismiss={() => setShown(false)}\n  dismissLabel="关闭这条通知"' : ''}
/>`,
      },
      {
        id: 'banner-action', title: '带一个操作',
        description: '操作只放一个，并且是这条通知本身最可能要做的那件事。',
        height: 200,
        render: function BannerAction() {
          const [updated, setUpdated] = useState(false);
          return <div id="banner-action-demo" style={{ width: '100%', maxWidth: 460 }}>
            <Banner tone={updated ? 'success' : 'info'}
              title={updated ? '已经是最新版本' : '有新版本 2.4'}
              message={updated ? undefined : '包含若干修复。现在更新大约需要 20 秒。'}
              action={updated ? undefined : { label: '更新', onSelect: () => setUpdated(true) }} />
          </div>;
        },
        code: `<Banner
  title="有新版本 2.4"
  message="包含若干修复。"
  action={{ label: '更新', onSelect: update }}
/>`,
      },
      {
        id: 'banner-placement', title: '放在哪里',
        description: '默认在你放它的地方——通常是内容顶部，或者 Screen 的 top 插槽里。placement="top" 才会把它钉到窗口顶部；默认不这样做，是因为一个自己决定位置的组件没法被组合，而布局本来就知道自己的顶在哪。',
        height: 240,
        render: function BannerPlacement() {
          return <div id="banner-placement-demo" style={{ width: '100%', maxWidth: 420, display: 'grid', gap: 10 }}>
            <Banner tone="warning" title="离线" message="改动会先存在本机，恢复连接后上传。" />
            <Card fill="secondary" radius={16} padding={16}>
              <Text variant="subhead">下面是页面内容。横幅在它上面，不盖住它。</Text>
            </Card>
          </div>;
        },
        code: `<Screen top={<Banner tone="warning" title="离线" />}>
  …
</Screen>

{/* 或者钉在窗口顶部 */}
<Banner placement="top" tone="error" title="连接中断" />`,
      },
    ],
    props: [
      { name: 'title', type: 'string', required: true, description: '一行，发生了什么。' },
      { name: 'message', type: 'ReactNode', description: '第二行，它意味着什么或者该做什么。' },
      { name: 'tone', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", description: '语气。自带图标，和轻提示的那一套是同一组，所以同一件事不会在两个地方长得不一样。' },
      { name: 'icon', type: 'ReactNode | null', description: '覆盖语气自带的图标；传 null 表示不要。' },
      { name: 'action', type: '{ label: string; onSelect: () => void }', description: '最多一个操作。' },
      { name: 'onDismiss', type: '() => void', description: '关掉它。传了才有关闭按钮，也才可以上滑关闭。' },
      { name: 'dismissLabel', type: 'string', description: '关闭按钮的名字。不传就用 GlassProvider 的 strings 表。' },
      { name: 'placement', type: "'inline' | 'top'", default: "'inline'", description: '在流里（默认），还是钉在窗口顶部。' },
    ],
    notes: [
      '用 role="status" 客气地播报：横幅是来汇报的，不是来打断的。必须当场回答的用警告框。',
      '上滑关闭只是关闭按钮之外的一条路，不是替代——没有可见入口的手势，对键盘用户等于不存在。',
      '用户开启「减少动效」后不再跟手形变，手势本身仍然可用。',
      '关闭按钮有 44×44 的点击范围。',
    ],
    related: ['toast', 'alert', 'sheet'],
  },
];
