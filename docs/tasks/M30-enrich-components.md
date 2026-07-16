---
status: done
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

四项增强全部落地(每项独立提交,RED→GREEN),不传新 props 时行为与现状一致(存量断言零改动全绿)。

- **Tabs 可关闭**:`TabItem.closable` + `TabsProps.onClose`。**结构决策**:tab 本身是 `<button>`,
  嵌套真按钮非法(axe nested-interactive serious)——改为每项包 `role="presentation"` 包裹器,
  关闭按钮做**兄弟节点**(`tabIndex=-1`,服务指针);**键盘走 Delete 键**(WAI-ARIA 可删除页签惯例,
  roving tabindex 保持单停点)。滑动指示器改测量包裹器(pill 覆盖 tab+关闭钮),Segmented 共享
  hook 零回归。i18n 关闭 aria-label。3 测试。
- **Modal.confirm**:`Modal.confirm(options): Promise<boolean>`(`Object.assign` 静态挂载,
  index.ts 组合)。动态 `createRoot` 临时容器渲染受控 Modal(焦点圈定/Escape/遮罩全复用),
  确定 true、取消/Escape/遮罩 false,退出过渡(400ms)后 unmount+移除容器;并发调用各自独立容器;
  SSR 守卫 `resolve(false)`;`locale` 显式传(命令式读不到 Context,卡内已定)。`ConfirmOptions`
  导出;`react-dom/client` 加入构建 external。4 测试(含容器不泄漏)。
- **Table 展开行**:`expandable.{render,rowExpandable,expandedKeys,defaultExpandedKeys,
  onExpandedChange}`,受控/非受控(useControllableState);展开列在选择列后,内容整行
  `colSpan`;展开态按 rowKey 存储,**先排序后切片**故翻页/排序间保持;`aria-expanded` +
  展开/收起 i18n aria-label;rowExpandable 拦截行不渲染开关。基于另一 agent 重构后的
  table.css 追加样式(含 reduced-motion)。4 测试。
- **Select 多选+搜索**:
  - **类型策略(卡内允许的择优)**:选**判别联合** `SelectProps = SelectSingleProps |
    SelectMultipleProps`——`multiple: true` 时 value/onChange 自动收窄为 `string[]`,消费者
    类型体验最好;内部归一化为 `string[]` 状态单路径处理。
  - 多选:点选切换**不关面板**、选项尾部 ✓、触发器内已选项显示为 **Tag(纯展示)**、
    Backspace 删最后一项、listbox `aria-multiselectable`。**卡内偏差**:tag 不带独立关闭钮
    (触发器是 `<button>`,内嵌按钮非法)——移除路径=Backspace / 面板反选,记录于此。
  - 搜索:沿用**自家 Command 的 combobox-in-dialog 模式**——searchable 时 floating 角色转
    dialog、内层挂 listbox,输入框 `role=combobox` + `aria-activedescendant`,手动方向键/
    Enter 导航(此时 useListNavigation/useTypeahead 关闭;非搜索态二者原样启用=零回归)。
    过滤复用 `fuzzyMatch`,全下游索引统一走 `visibleOptions`;空结果 i18n 空态。4 测试。
  - 测试期学得:floating-ui `useRole('listbox')` 给触发器 `role="combobox"`(既有行为),
    新测试按 combobox 查询。
- **site 文档**:四组件各增演示与 API 行(Select 多选搜索、Table 展开行、Modal.confirm、
  Tabs 可关闭),中英双语。
- 验证:`pnpm typecheck` ✓、`pnpm build` ✓、`pnpm test` **562/562 绿**(较 M29 的 547 +15)、
  `pnpm smoke:consumer` ✓(联合类型经包内 d.ts 对消费者严格模式友好)、`pnpm site:build` ✓。
  无新增运行时依赖。
- **留本地目检**:多选 Tag 换行观感、搜索输入的玻璃材质、展开行动画感、可关闭页签 pill 覆盖。
