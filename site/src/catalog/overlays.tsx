import { useState } from 'react';
import {
  GlassActionSheet, GlassAlert, GlassButton, GlassDialog, GlassIconButton, GlassMenu, GlassPopover,
  GlassMenuButton, GlassSegmentedControl, GlassSheet, GlassSlider, LibraryIcon, List, ListRow, ListSection,
  Text, TextField, useToast,
} from '@ttqtt/liquid-glass-react';
import { Icon } from '../icons.js';
import type { ComponentDoc } from './types.js';

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
        height: 220,
        render: function PopoverBasic() {
          const [view, setView] = useState('fit');
          const [volume, setVolume] = useState(65);
          return <GlassPopover title="查看设置" description="改动会立刻生效。"
            trigger={<GlassButton>打开面板</GlassButton>}>
            <Text variant="subhead" emphasized style={{ marginBlockEnd: 8 }}>显示方式</Text>
            <GlassSegmentedControl aria-label="显示方式" density="compact" value={view} onValueChange={setView}
              items={[{ value: 'fit', label: '适应' }, { value: 'fill', label: '填充' }]} />
            <Text variant="subhead" emphasized style={{ margin: '16px 0 8px' }}>音量 {volume}%</Text>
            <GlassSlider aria-label="音量" value={volume} onValueChange={setVolume} />
          </GlassPopover>;
        },
        code: `<GlassPopover
  title="查看设置"
  description="改动会立刻生效。"
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
    ],
    props: [
      { name: 'trigger', type: 'ReactElement', description: '你自己的按钮。组件只负责把它和面板关联起来。' },
      { name: 'title', type: 'string', required: true, description: '面板标题。' },
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
        height: 200,
        render: function MenuBasic() {
          const [status, setStatus] = useState('还没选');
          const [pinned, setPinned] = useState(true);
          return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassMenu aria-label="示例菜单" trigger={<GlassButton>打开菜单<LibraryIcon name="chevronDown" size={16} /></GlassButton>}
              items={[
                { key: 'open', label: '打开', icon: <LibraryIcon name="chevronForward" size={16} />, shortcut: '⌘O', onSelect: () => setStatus('打开') },
                { key: 'pin', label: '置顶', checked: pinned, onSelect: () => { setPinned(!pinned); setStatus(pinned ? '取消置顶' : '已置顶'); } },
                { key: 'disabled', label: '暂不可用', disabled: true, onSelect: () => {} },
                { key: 'delete', label: '删除', destructive: true, separatorBefore: true, onSelect: () => setStatus('删除') },
              ]} />
            <Text variant="caption1" tone="secondary" role="status">{status}</Text>
          </div>;
        },
        code: `<GlassMenu aria-label="更多操作"
  trigger={<GlassIconButton aria-label="更多"><MoreIcon /></GlassIconButton>}
  items={[
    { key: 'open', label: '打开', shortcut: '⌘O', onSelect: open },
    { key: 'pin', label: '置顶', checked: pinned, onSelect: togglePin },
    { key: 'delete', label: '删除', destructive: true, separatorBefore: true, onSelect: remove },
  ]}
/>`,
      },
    ],
    props: [
      { name: 'items', type: 'GlassMenuItem[]', required: true, description: '每一项包含标识、文字和点击后做什么。' },
      { name: 'icon', type: 'ReactNode', description: '只给有约定俗成图标的操作配图，不要逐行装饰。' },
      { name: 'checked', type: 'boolean', description: '带勾选状态的项。' },
      { name: 'shortcut', type: 'string', description: '快捷键提示。' },
      { name: 'destructive', type: 'boolean', description: '标红。危险操作仍然需要确认或撤销。' },
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
        height: 210,
        render: function PopUpDemo() {
          const [quality, setQuality] = useState('medium');
          return <div id="popup-demo" style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassMenuButton kind="popUp" aria-label="画质" value={quality} onValueChange={setQuality}
              options={[
                { value: 'low', label: '流畅' },
                { value: 'medium', label: '中等' },
                { value: 'high', label: '高' },
                { value: 'auto', label: '自动', separatorBefore: true },
              ]} />
            <Text variant="caption1" tone="secondary" role="status">当前画质：{quality}</Text>
          </div>;
        },
        code: `<GlassMenuButton
  kind="popUp"
  aria-label="画质"
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
        height: 200,
        render: function SheetBasic() {
          const [open, setOpen] = useState(false);
          return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassSheet title="分享这一刻" description="按住顶部的横条上下拖动，试试两个高度。"
              open={open} onOpenChange={setOpen} detents={['medium', 'large']}
              trigger={<GlassButton>打开面板</GlassButton>}>
              <div style={{ display: 'grid', gap: 12, marginBlockStart: 12 }}>
                <TextField label="备注" placeholder="想说点什么" />
                <GlassButton variant="glassProminent" onClick={() => setOpen(false)}>完成</GlassButton>
              </div>
            </GlassSheet>
            <Text variant="caption1" tone="secondary">横条也支持键盘：上下方向键换高度</Text>
          </div>;
        },
        code: `<GlassSheet
  title="分享这一刻"
  detents={['medium', 'large']}
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
    ],
    props: [
      { name: 'detents', type: "SheetDetent[]", default: "['medium', 'large']", description: '可以停靠的高度，从小到大。' },
      { name: 'defaultDetent', type: 'SheetDetent', description: '打开时停在哪一档。' },
      { name: 'grabber', type: 'boolean', default: 'true', description: '顶部的拖动横条。只有一个高度时才关掉。' },
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
        height: 190,
        render: function AlertDestructive() {
          const [result, setResult] = useState('还没决定');
          return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassAlert title="删除这个工作区？" message="里面的 12 个项目会一起被删除，这个操作没法撤销。"
              trigger={<GlassButton variant="destructive">删除工作区</GlassButton>}
              actions={[
                { key: 'cancel', label: '取消', role: 'cancel', onSelect: () => setResult('已取消') },
                { key: 'delete', label: '删除', role: 'destructive', onSelect: () => setResult('已删除（只是演示）') },
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
        height: 190,
        render: function ActionSheetBasic() {
          const [result, setResult] = useState('还没选');
          return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
            <GlassActionSheet aria-label="照片操作" title="这一张照片" message="选择要做的事。"
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
    ],
    props: [
      { name: 'actions', type: 'ActionSheetItem[]', required: true, description: '六项以内。' },
      { name: 'title / message', type: 'string', description: '说明这些选择作用在什么上。' },
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
        height: 190,
        render: function DialogForm() {
          const [name, setName] = useState('我的灵感空间');
          return <GlassDialog title="创建一个工作区" description="这个示例不会提交到任何地方。"
            trigger={<GlassButton>打开对话框</GlassButton>}>
            <div style={{ display: 'grid', gap: 16 }}>
              <TextField label="工作区名称" value={name} onChange={event => setName(event.target.value)} />
              <Text variant="footnote" tone="secondary">当前名称：{name || '（空）'}</Text>
            </div>
          </GlassDialog>;
        },
        code: `<GlassDialog
  title="创建一个工作区"
  description="…"
  trigger={<GlassButton>新建</GlassButton>}
>
  <form>…</form>
</GlassDialog>`,
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
    ],
    props: [
      { name: 'message', type: 'string', required: true, description: '陈述已经发生的事。' },
      { name: 'action', type: '{ label: string; onSelect: () => void }', description: '撤销入口。有了它，可撤销的操作就不必再弹窗确认。' },
      { name: 'duration', type: 'number', default: '6000', description: '停留多少毫秒。要留够读完并伸手过去的时间。' },
      { name: 'limit', type: 'number', default: '3', description: 'ToastProvider：最多同时堆几条。' },
    ],
    notes: [
      '读屏会在当前操作的间隙把它念出来，不会打断用户正在做的事。',
      '鼠标悬停或键盘聚焦时暂停倒计时，撤销的机会不会在伸手的路上消失。',
    ],
    related: ['alert', 'progress'],
    imports: ['ToastProvider', 'useToast'],
  },
];
