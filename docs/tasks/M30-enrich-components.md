---
status: todo
depends: [M29]
---

# M30 — 五阶段·既有组件丰富

> 五阶段组件线之一。给四个高频组件补上早期卡列为非目标、现在转正的能力:
> **Select 多选+搜索、Table 展开行、Modal 命令式 confirm、Tabs 可关闭页签**。
> 串行 M27→M32。无新运行时依赖;全部为**向后兼容增强**,不传新 props 行为与现状完全一致。

## API 定稿（逐组件增量）

### Select：多选 + 搜索

```ts
export interface SelectProps {
  // ……既有 props 不变(单选形态保持现状)……
  multiple?: boolean;            // 开启后 value/defaultValue: string[]、onChange: (values: string[]) => void
  searchable?: boolean;          // 面板顶部输入过滤(复用 fuzzy-match),单选/多选均可用
}
```

- 多选:选项前 checkmark,点击切换不关面板;触发器内已选项显示为可移除的小 Tag,
  Backspace 删最后一项;`aria-multiselectable`。
- 搜索:过滤后键盘导航只在命中项内;空结果显示内置空态文案(i18n)。
- 类型策略:value 联合(`string | string[]`)+ 运行时按 `multiple` 收窄;实现时若联合类型
  对消费者提示太差,可改函数重载,取消费者体验更好者并在完成记录注明。

### Table：展开行

```ts
export interface TableProps<T> {
  // ……既有 props 不变……
  expandable?: {
    render: (row: T) => React.ReactNode;
    rowExpandable?: (row: T) => boolean;         // 缺省全部可展开
    expandedKeys?: string[];                      // 受控
    defaultExpandedKeys?: string[];
    onExpandedChange?: (keys: string[]) => void;
  };
}
```

- 新增首列展开按钮(`aria-expanded` + i18n aria-label),展开内容为紧随其后的整行
  `<td colSpan>`;与选择列共存(展开列在选择列后);分页/排序切换时展开态按 key 保持。

### Modal：命令式 confirm

```ts
export interface ConfirmOptions {
  title?: React.ReactNode;
  content?: React.ReactNode;
  okText?: React.ReactNode;      // 缺省「确定/OK」(i18n)
  cancelText?: React.ReactNode;  // 缺省「取消/Cancel」
  danger?: boolean;              // 确认钮 danger 变体
  locale?: 'zh-CN' | 'en-US';    // 命令式无法读 Context,显式传或默认 zh-CN
}
Modal.confirm = (options: ConfirmOptions) => Promise<boolean>; // resolve true=确定 false=取消/Escape
```

- 实现:动态 `createRoot` 挂临时容器渲染受控 Modal,关闭后 unmount + 移除容器;
  复用 Modal 既有焦点圈定/Escape/遮罩行为。同刻多次调用允许叠加(各自独立容器)。

### Tabs：可关闭页签

```ts
export interface TabItem { /* ……既有…… */ closable?: boolean }
export interface TabsProps { /* ……既有…… */ onClose?: (key: string) => void }
```

- closable 页签渲染关闭按钮(真 `<button>`,i18n aria-label,不吞页签激活点击);
  `onClose` 只通知,**由使用者更新 items**(数据受控惯例);关闭当前激活页签后由使用者
  决定新激活项(文档写明推荐做法)。

## 实现步骤

1. 逐组件 RED→GREEN(先写失败测试);一组件一或多提交。
2. site:四个组件的 ComponentDoc 增补对应演示与 API 行(中英双语)。
3. 全量验证 + 提交。

## 测试要求

- Select:多选切换/Tag 移除/Backspace、搜索过滤+键盘只走命中项、单选行为零回归。
- Table:展开受控/非受控、rowExpandable 拦截、与选择列/分页共存、`aria-expanded`。
- Modal.confirm:resolve true/false 两路径、Escape=false、unmount 清理(无泄漏容器)。
- Tabs:关闭按钮不激活页签、onClose 回调、键盘可达;既有键盘断言零回归。
- 全部增强不传新 props 时快照/断言与现状一致(向后兼容证明)。

## 验收标准

- [ ] 四项增强 API 与本卡一致并从 `src/index.ts` 导出所需类型;不传新 props 行为不变。
- [ ] 各自交互/a11y/回归断言全绿;site 演示与 API 表更新,中英双语。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,`pnpm smoke:consumer` 仍绿,无新运行时依赖。

## 明确非目标

- Select 远程搜索/虚拟滚动/自定义 option 渲染;Table 固定列/树形数据;Modal.confirm 的
  队列/全局配置;Tabs 新增按钮/拖拽排序。

## 完成记录

（实现后追加）
