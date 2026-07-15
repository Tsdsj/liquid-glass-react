import { useState } from 'react';
import { Button, Modal, Popover, Tooltip, toast } from '@ttqtt/liquid-glass-react';
import type { ComponentDoc } from './types';

const CATEGORY = { 'zh-CN': '反馈', 'en-US': 'Feedback' };

function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="accent" onClick={() => setOpen(true)}>
        打开弹窗
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="玻璃弹窗"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button variant="accent" onClick={() => setOpen(false)}>
              确定
            </Button>
          </>
        }
      >
        弹窗面板是一块真折射玻璃,遮罩用模糊渐入而不是透明度动画,保证玻璃全程可见。
      </Modal>
    </>
  );
}

export const tooltipDoc: ComponentDoc = {
  slug: 'tooltip',
  name: 'Tooltip',
  title: { 'zh-CN': '文字提示', 'en-US': 'Tooltip' },
  category: CATEGORY,
  description: {
    'zh-CN': '悬停/聚焦触发的小型玻璃气泡,自动避让视口边缘。',
    'en-US': 'Small glass bubble on hover/focus that flips away from viewport edges.',
  },
  renderPreview: () => (
    <Tooltip content="提示内容">
      <Button size="sm">悬停</Button>
    </Tooltip>
  ),
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础用法', 'en-US': 'Basic' },
      description: {
        'zh-CN': '悬停或键盘聚焦触发;delay 控制打开延迟。',
        'en-US': 'Triggered by hover or keyboard focus; delay controls the open latency.',
      },
      code: `
import { Tooltip } from '@ttqtt/liquid-glass-react';

<Tooltip content="删除后不可恢复" placement="top">
  <Button>悬停查看提示</Button>
</Tooltip>`,
      render: () => (
        <>
          <Tooltip content="删除后不可恢复 / Cannot be undone">
            <Button>悬停查看提示</Button>
          </Tooltip>
          <Tooltip content="右侧提示" placement="right">
            <Button variant="ghost">placement="right"</Button>
          </Tooltip>
        </>
      ),
    },
  ],
  api: [
    {
      title: 'Tooltip',
      rows: [
        { prop: 'content', type: 'ReactNode', description: { 'zh-CN': '提示内容', 'en-US': 'Tooltip content' } },
        { prop: 'placement', type: 'Placement', defaultValue: "'top'", description: { 'zh-CN': '弹出方向(floating-ui Placement)', 'en-US': 'Popup placement (floating-ui)' } },
        { prop: 'delay', type: 'number', defaultValue: '300', description: { 'zh-CN': '悬停打开延迟(ms)', 'en-US': 'Hover open delay in ms' } },
      ],
    },
  ],
};

export const popoverDoc: ComponentDoc = {
  slug: 'popover',
  name: 'Popover',
  title: { 'zh-CN': '气泡卡片', 'en-US': 'Popover' },
  category: CATEGORY,
  description: {
    'zh-CN': '点击触发的玻璃浮层,可承载任意交互内容;等待折射就绪后弹性入场。',
    'en-US': 'Click-triggered glass panel for arbitrary interactive content; springs in once refraction is ready.',
  },
  renderPreview: () => (
    <Popover content="气泡内容">
      <Button size="sm">点击</Button>
    </Popover>
  ),
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础用法', 'en-US': 'Basic' },
      description: {
        'zh-CN': '外点或 Esc 关闭;焦点自动进入面板。',
        'en-US': 'Dismiss by outside press or Esc; focus moves into the panel.',
      },
      code: `
import { Popover } from '@ttqtt/liquid-glass-react';

<Popover
  content={
    <div>
      确认删除这条记录吗?
      <Button variant="danger" size="sm">删除</Button>
    </div>
  }
>
  <Button>点击打开</Button>
</Popover>`,
      render: () => (
        <Popover
          content={
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              确认删除这条记录吗?
              <Button variant="danger" size="sm">
                删除
              </Button>
            </div>
          }
        >
          <Button>点击打开</Button>
        </Popover>
      ),
    },
  ],
  api: [
    {
      title: 'Popover',
      rows: [
        { prop: 'content', type: 'ReactNode', description: { 'zh-CN': '浮层内容', 'en-US': 'Panel content' } },
        { prop: 'open / defaultOpen', type: 'boolean', description: { 'zh-CN': '受控 / 非受控打开态', 'en-US': 'Controlled / uncontrolled open state' } },
        { prop: 'onOpenChange', type: '(open: boolean) => void', description: { 'zh-CN': '打开态变化回调', 'en-US': 'Open-state callback' } },
        { prop: 'placement', type: 'Placement', defaultValue: "'bottom'", description: { 'zh-CN': '弹出方向', 'en-US': 'Placement' } },
        { prop: 'showArrow', type: 'boolean', defaultValue: 'true', description: { 'zh-CN': '是否显示箭头', 'en-US': 'Show the arrow' } },
      ],
    },
  ],
};

export const modalDoc: ComponentDoc = {
  slug: 'modal',
  name: 'Modal',
  title: { 'zh-CN': '对话框', 'en-US': 'Modal' },
  category: CATEGORY,
  description: {
    'zh-CN': '模态玻璃对话框:焦点圈定、滚动锁定、长内容滚动边缘渐隐;遮罩用模糊渐入避免玻璃采样中断。',
    'en-US': 'Modal glass dialog with focus trapping, scroll locking and scroll-edge fades; the scrim fades via blur so the glass keeps sampling.',
  },
  renderPreview: () => <Button size="sm">打开弹窗</Button>,
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础用法', 'en-US': 'Basic' },
      description: {
        'zh-CN': 'Esc、遮罩点击或关闭按钮均可关闭,焦点自动归还触发器。',
        'en-US': 'Close via Esc, overlay press or the close button; focus returns to the trigger.',
      },
      code: `
import { useState } from 'react';
import { Button, Modal } from '@ttqtt/liquid-glass-react';

const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>打开弹窗</Button>
<Modal open={open} onOpenChange={setOpen} title="玻璃弹窗">
  内容
</Modal>`,
      render: () => <ModalDemo />,
    },
  ],
  api: [
    {
      title: 'Modal',
      rows: [
        { prop: 'open', type: 'boolean', description: { 'zh-CN': '受控打开态(必填)', 'en-US': 'Controlled open state (required)' } },
        { prop: 'onOpenChange', type: '(open: boolean) => void', description: { 'zh-CN': '打开态变化回调', 'en-US': 'Open-state callback' } },
        { prop: 'title / footer', type: 'ReactNode', description: { 'zh-CN': '标题 / 底部操作区', 'en-US': 'Title / footer area' } },
        { prop: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: { 'zh-CN': '面板宽度档位', 'en-US': 'Panel width preset' } },
        { prop: 'closeOnOverlayClick', type: 'boolean', defaultValue: 'true', description: { 'zh-CN': '点击遮罩是否关闭', 'en-US': 'Close on overlay press' } },
      ],
    },
  ],
};

export const toastDoc: ComponentDoc = {
  slug: 'toast',
  name: 'Toast',
  title: { 'zh-CN': '全局提示', 'en-US': 'Toast' },
  category: CATEGORY,
  description: {
    'zh-CN': '命令式玻璃通知:挂一次 <Toaster/>,任意位置调用 toast.success/error/info。',
    'en-US': 'Imperative glass notifications: mount <Toaster/> once, call toast.success/error/info anywhere.',
  },
  renderPreview: () => <Button size="sm">toast.success()</Button>,
  demos: [
    {
      id: 'kinds',
      title: { 'zh-CN': '三种语义', 'en-US': 'Kinds' },
      description: {
        'zh-CN': '本站根节点已挂载 <Toaster/>,点击按钮直接触发。',
        'en-US': 'This site mounts <Toaster/> at the root, so the buttons fire directly.',
      },
      code: `
import { Toaster, toast } from '@ttqtt/liquid-glass-react';

// 应用根节点挂一次
<Toaster position="top-center" />

toast.success('保存成功');
toast.error('网络异常,请重试');
toast.info('已同步 3 条记录');`,
      render: () => (
        <>
          <Button onClick={() => toast.success('保存成功 / Saved')}>success</Button>
          <Button onClick={() => toast.error('网络异常 / Network error')}>error</Button>
          <Button onClick={() => toast.info('已同步 3 条 / Synced 3 items')}>info</Button>
        </>
      ),
    },
  ],
  api: [
    {
      title: 'Toaster',
      rows: [
        { prop: 'position', type: 'ToasterPosition', defaultValue: "'top-center'", description: { 'zh-CN': '通知堆叠位置(六个方位)', 'en-US': 'Stack position (six placements)' } },
        { prop: 'max', type: 'number', defaultValue: '5', description: { 'zh-CN': '同时显示的最大条数', 'en-US': 'Maximum visible toasts' } },
      ],
    },
    {
      title: 'toast',
      rows: [
        { prop: 'toast.show(content, options?)', type: '(ReactNode, ToastOptions) => string', description: { 'zh-CN': '显示通知,返回 id 供 dismiss', 'en-US': 'Shows a toast and returns its id' } },
        { prop: 'toast.success / error / info', type: '(content, options?) => string', description: { 'zh-CN': '带语义图标的快捷方法', 'en-US': 'Shortcuts with semantic icons' } },
        { prop: 'toast.dismiss(id?)', type: '(id?: string) => void', description: { 'zh-CN': '关闭指定或全部通知', 'en-US': 'Dismiss one or all toasts' } },
        { prop: 'options.duration', type: 'number', defaultValue: '3000', description: { 'zh-CN': '自动关闭时长(ms),Infinity 常驻', 'en-US': 'Auto-dismiss delay in ms; Infinity persists' } },
      ],
    },
  ],
};
