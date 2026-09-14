import { useState } from 'react';
import {
  GlassActionSheet, GlassAlert, GlassButton, GlassDialog, GlassMenu, GlassPopover,
  GlassSegmentedControl, GlassSheet, GlassSlider, LibraryIcon, Text, TextField, useToast,
} from '@ttqtt/liquid-glass-react';
import type { ComponentDoc } from './types.js';

export const overlayDocs: ComponentDoc[] = [
  {
    slug: 'popover', name: 'GlassPopover', group: '浮层',
    summary: '锚定在触发控件上的非模态面板，使用大玻璃。',
    rule: '菜单、浮层、操作表与对话框都从打开它们的控件里“长出来”，并保持锚定。在手机上这种模式应改为 sheet —— 带箭头指向控件是 iPad 和 Mac 的习惯。',
    demoHeight: 200,
    example: function PopoverExample() {
      const [view, setView] = useState('fit');
      const [volume, setVolume] = useState(65);
      return <GlassPopover title="查看设置" description="Escape 关闭并把焦点还给触发器。"
        trigger={<GlassButton>打开浮层</GlassButton>}>
        <Text variant="subhead" emphasized style={{ marginBlockEnd: 8 }}>显示方式</Text>
        <GlassSegmentedControl aria-label="显示方式" density="compact" value={view} onValueChange={setView}
          items={[{ value: 'fit', label: '适应' }, { value: 'fill', label: '填充' }]} />
        <Text variant="subhead" emphasized style={{ margin: '16px 0 8px' }}>音量 {volume}%</Text>
        <GlassSlider aria-label="音量" value={volume} onValueChange={setVolume} />
      </GlassPopover>;
    },
    code: `<GlassPopover
  title="查看设置"
  description="Escape 关闭并返回触发器。"
  trigger={<GlassButton>打开浮层</GlassButton>}
>
  …
</GlassPopover>`,
    props: [
      { name: 'trigger', type: 'ReactElement', description: '你自己的按钮；组件只补上 aria-haspopup / expanded / controls。' },
      { name: 'title', type: 'string', required: true, description: '面板标题，作为 aria-labelledby。' },
      { name: 'align', type: "'start' | 'center' | 'end'", default: "'end'", description: '相对触发器的对齐方式。' },
      { name: 'open / defaultOpen / onOpenChange', type: 'boolean / (open) => void', description: '受控或非受控开合。' },
    ],
    a11y: [
      '使用原生 popover 顶层，自带轻量关闭；Escape 关闭并把焦点还给触发器。',
      '打开时焦点移到面板内第一个可聚焦元素。',
      '视口内自动避让，并把触发器中心投影为 transform-origin，所以是“长出来”的。',
    ],
  },
  {
    slug: 'menu', name: 'GlassMenu', group: '浮层',
    summary: '从触发器变形出来的菜单，支持图标、勾选状态与快捷键。',
    rule: '菜单的键盘模型是一份契约：上下移动、Home/End 跳转、键入跳到匹配项、Escape 关闭并回焦、Tab 关闭。每组保持在七项左右，用分隔线分组而不是无限拉长。',
    demoHeight: 190,
    example: function MenuExample() {
      const [status, setStatus] = useState('尚未选择');
      const [pinned, setPinned] = useState(true);
      return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
        <GlassMenu aria-label="示例菜单" trigger={<GlassButton>打开菜单<LibraryIcon name="chevronDown" size={16} /></GlassButton>}
          items={[
            { key: 'open', label: '打开', icon: <LibraryIcon name="chevronForward" size={16} />, shortcut: '⌘O', onSelect: () => setStatus('打开') },
            { key: 'pin', label: '置顶', checked: pinned, onSelect: () => { setPinned(!pinned); setStatus(pinned ? '取消置顶' : '已置顶'); } },
            { key: 'disabled', label: '不可用项', disabled: true, onSelect: () => {} },
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
    props: [
      { name: 'items', type: 'GlassMenuItem[]', required: true, description: '每项含 key、label 与 onSelect。' },
      { name: 'icon', type: 'ReactNode', description: '标准动作才配图标；不要逐行装饰。' },
      { name: 'checked', type: 'boolean', description: '存在时角色变为 menuitemcheckbox 并带 aria-checked。' },
      { name: 'shortcut', type: 'string', description: '快捷键提示，装饰性地展示。' },
      { name: 'destructive', type: 'boolean', description: '红色；破坏性操作仍需确认或撤销。' },
    ],
    a11y: ['菜单项是真实 <button>，键盘模型需要可聚焦元素。', '键入查找有 700ms 的输入窗口。'],
  },
  {
    slug: 'sheet', name: 'GlassSheet', group: '浮层',
    summary: '带停靠高度的 sheet，可以拖动，满高时变为不透明。',
    rule: '拖动才是重点：sheet 1:1 跟随手指，松手后弹簧停在最近的停靠点，中途可以被打断。满高时它不再假装漂浮——变成不透明并贴住屏幕边缘。',
    demoHeight: 180,
    example: function SheetExample() {
      const [open, setOpen] = useState(false);
      return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
        <GlassSheet title="分享这一刻" description="按住顶部的手柄上下拖动，试试两个停靠高度。"
          open={open} onOpenChange={setOpen} detents={['medium', 'large']}
          trigger={<GlassButton>打开 Sheet</GlassButton>}>
          <div style={{ display: 'grid', gap: 12, marginBlockStart: 12 }}>
            <TextField label="备注" placeholder="想说点什么" />
            <Text variant="footnote" tone="secondary">拖到顶部时背景会变成不透明并贴住边缘。</Text>
            <GlassButton variant="glassProminent" onClick={() => setOpen(false)}>完成</GlassButton>
          </div>
        </GlassSheet>
        <Text variant="caption1" tone="secondary">手柄支持键盘：上下方向键切换停靠高度</Text>
      </div>;
    },
    code: `<GlassSheet
  title="分享这一刻"
  detents={['medium', 'large']}
  trigger={<GlassButton>分享</GlassButton>}
>
  …
</GlassSheet>`,
    props: [
      { name: 'detents', type: "SheetDetent[]", default: "['medium', 'large']", description: '停靠高度，从小到大。' },
      { name: 'defaultDetent', type: 'SheetDetent', description: '初始停靠高度。' },
      { name: 'grabber', type: 'boolean', default: 'true', description: '拖动手柄。只有单一停靠高度时才关掉。' },
      { name: 'title', type: 'string', required: true, description: '标题，作为 aria-labelledby。' },
    ],
    a11y: [
      '基于原生 <dialog>：焦点约束、顶层与 Escape 都来自平台。',
      '手柄是 role="slider"，方向键在停靠点之间移动，最低点再向下即关闭。',
      '只动 transform，不动 height，拖动全程留在合成器上。',
      '减少动效时直接跳到目标高度，不做弹簧。',
    ],
  },
  {
    slug: 'alert', name: 'GlassAlert', group: '浮层',
    summary: '简短且不可回避的决定，最多三个操作。',
    rule: '标题加粗且左对齐——居中的提示文字是上一代设计。破坏性操作要么配这个（红色操作 + 焦点落在取消上），要么配一个即时可用的撤销；日常信息两者都不需要。',
    demoHeight: 180,
    example: function AlertExample() {
      const [result, setResult] = useState('尚未决定');
      return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
        <GlassAlert title="删除这个工作区？" message="工作区内的 12 个项目会一并移除，此操作不可撤销。"
          trigger={<GlassButton variant="destructive">删除工作区</GlassButton>}
          actions={[
            { key: 'cancel', label: '取消', role: 'cancel', onSelect: () => setResult('已取消') },
            { key: 'delete', label: '删除', role: 'destructive', onSelect: () => setResult('已删除（仅本地状态）') },
          ]} />
        <Text variant="caption1" tone="secondary" role="status">{result}</Text>
      </div>;
    },
    code: `<GlassAlert
  title="删除这个工作区？"
  message="工作区内的 12 个项目会一并移除，此操作不可撤销。"
  trigger={<GlassButton variant="destructive">删除</GlassButton>}
  actions={[
    { key: 'cancel', label: '取消', role: 'cancel' },
    { key: 'delete', label: '删除', role: 'destructive', onSelect: remove },
  ]}
/>`,
    props: [
      { name: 'title', type: 'string', required: true, description: '加粗左对齐的标题。' },
      { name: 'message', type: 'string', description: '一两句话说清发生了什么、接下来会怎样。' },
      { name: 'actions', type: 'AlertAction[]', required: true, description: '最多三个；更长的列表用操作表。' },
      { name: 'role', type: "'default' | 'cancel' | 'destructive'", default: "'default'", description: 'AlertAction：决定配色与初始焦点。' },
    ],
    a11y: [
      'role="alertdialog"；存在破坏性操作时初始焦点落在取消上。',
      'Escape 等同于执行取消操作，而不是静默关闭。',
      '三个操作时改为纵向堆叠，避免标签被挤扁。',
    ],
  },
  {
    slug: 'action-sheet', name: 'GlassActionSheet', group: '浮层',
    summary: '从来源控件弹出的一小组选择。',
    rule: '破坏性选项排在列表底部并标红，取消与其余项分开，界面其他部分保持可交互——这是一组选项，不是一个模态任务。',
    demoHeight: 180,
    example: function ActionSheetExample() {
      const [result, setResult] = useState('尚未选择');
      return <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
        <GlassActionSheet aria-label="项目操作" title="这一张照片" message="选择要执行的操作。"
          trigger={<GlassButton>打开操作表</GlassButton>}
          actions={[
            { key: 'share', label: '分享', onSelect: () => setResult('分享') },
            { key: 'duplicate', label: '创建副本', onSelect: () => setResult('创建副本') },
            { key: 'delete', label: '删除照片', destructive: true, onSelect: () => setResult('删除') },
          ]}
          cancelLabel="取消" onCancel={() => setResult('已取消')} />
        <Text variant="caption1" tone="secondary" role="status">{result}</Text>
      </div>;
    },
    code: `<GlassActionSheet
  aria-label="项目操作"
  trigger={<GlassIconButton aria-label="更多"><MoreIcon /></GlassIconButton>}
  actions={[
    { key: 'share', label: '分享', onSelect: share },
    { key: 'delete', label: '删除照片', destructive: true, onSelect: remove },
  ]}
  onCancel={dismiss}
/>`,
    props: [
      { name: 'actions', type: 'ActionSheetItem[]', required: true, description: '大约六项以内；更长就该是菜单或列表页。' },
      { name: 'title / message', type: 'string', description: '说明这些选择作用于什么。' },
      { name: 'cancelLabel', type: 'string', default: "'Cancel'", description: '取消按钮文字。' },
      { name: 'aria-label', type: 'string', required: true, description: '可访问名称。' },
    ],
    a11y: [
      '破坏性项会被自动排到最后，误触更可能落在可恢复的选项上。',
      '窄屏锚定在底部，宽屏保持贴着来源控件。',
    ],
  },
  {
    slug: 'dialog', name: 'GlassDialog', group: '浮层',
    summary: '大玻璃上的模态任务，基于原生 dialog。',
    rule: '打断主流程的任务要配一层变暗；并行任务只需要玻璃的分隔，不需要变暗。',
    demoHeight: 180,
    example: function DialogExample() {
      const [name, setName] = useState('我的灵感空间');
      return <GlassDialog title="创建一个工作区" description="这个示例验证焦点、键盘和表单，不会提交到任何外部服务。"
        trigger={<GlassButton>打开对话框</GlassButton>} closeLabel="关闭对话框">
        <div style={{ display: 'grid', gap: 16 }}>
          <TextField label="工作区名称" value={name} onChange={event => setName(event.target.value)} />
          <Text variant="footnote" tone="secondary">Tab 在对话框内循环，Escape 关闭并把焦点还给触发器。</Text>
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
    props: [
      { name: 'title / description', type: 'string', required: true, description: '分别接到 aria-labelledby 与 aria-describedby。' },
      { name: 'dismissOnBackdrop', type: 'boolean', default: 'true', description: '点击背景关闭；按下与抬起都在外部才算数。' },
      { name: 'closeLabel', type: 'string', default: "'Close'", description: '关闭按钮的可访问名称。' },
    ],
    a11y: ['原生 <dialog> + showModal：焦点约束、背景 inert、顶层都由平台提供。', '打开时锁滚动，关闭后把焦点还给触发器。'],
  },
  {
    slug: 'toast', name: 'ToastProvider · useToast', group: '浮层',
    summary: '轻量提示，承载可撤销操作的 Undo。',
    rule: '不可逆的操作用 alert 或操作表确认；可逆的直接执行，然后在这里给一个撤销。每次删除都要停下来问一遍，界面会变得很累；两者都不给，则会变得不可信。',
    demoHeight: 170,
    example: function ToastExample() {
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
    code: `// 应用根部
<ToastProvider><App /></ToastProvider>

// 任意组件里
const toast = useToast();
toast({
  message: '已删除「草稿 A」',
  action: { label: '撤销', onSelect: restore },
});`,
    props: [
      { name: 'message', type: 'string', required: true, description: '陈述已经发生的事。' },
      { name: 'action', type: '{ label: string; onSelect: () => void }', description: '撤销入口——它让可逆操作可以跳过确认对话框。' },
      { name: 'duration', type: 'number', default: '6000', description: '停留毫秒数。撤销需要足够时间读完并够到。' },
      { name: 'limit', type: 'number', default: '3', description: 'ToastProvider：最多同时堆叠几条。' },
    ],
    a11y: [
      'role="status" + aria-live="polite"：报告已发生的事，不打断当前操作。',
      '鼠标悬停或键盘聚焦时暂停计时，避免撤销窗口在伸手过去的路上消失。',
    ],
  },
];
