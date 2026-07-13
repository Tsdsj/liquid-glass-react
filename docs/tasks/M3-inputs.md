---
status: todo
depends: [M2]
---

# M3 — 批次 2：输入类组件

Input / Textarea / Select。流程照 `docs/component-guide.md`。输入区玻璃一律 `refraction="off"`（可读性）。

## Input

```ts
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  size?: 'sm' | 'md' | 'lg';
  prefix?: React.ReactNode;   // 左侧槽（图标/文字）
  suffix?: React.ReactNode;   // 右侧槽
  invalid?: boolean;          // 错误态：danger 描边 + aria-invalid
}
```

- 结构：外层 GlassSurface（`refraction="off"`）容器 `.lg-input`，内部 flex：prefix 槽 + 原生 `<input class="lg-input__el">`（透明背景、无边框）+ suffix 槽。
- ref 指向原生 input；点击容器任意处 focus input。
- focus 态：容器 `:focus-within` 出现 `--lg-accent` 描边（box-shadow 实现，不占布局）。
- onChange 保留 React 原生签名（事件对象）。

## Textarea

```ts
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  autoResize?: boolean;   // true 时高度随内容增长（设置 scrollHeight）
}
```

- 同 Input 的容器方案（无 prefix/suffix，无 size —— 高度由 rows/autoResize 决定）。
- autoResize：onInput 时 `style.height = 'auto'; style.height = scrollHeight + 'px'`，受控外部赋值时用 effect 同步。

## Select（单选）

```ts
interface SelectOption { label: React.ReactNode; value: string; disabled?: boolean }
interface SelectProps {
  options: SelectOption[];
  value?: string; defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  'aria-label'?: string;
}
```

- 触发器：GlassSurface（`refraction="off"`）按钮，显示当前 label 或 placeholder + 下箭头（open 时旋转）。
- 面板：`@floating-ui/react` —— `useFloating`(offset/flip/shift/size middleware，面板 min-width 匹配触发器) + `useClick` + `useDismiss` + `useRole({role:'listbox'})` + `useListNavigation` + `useTypeahead` + `FloatingPortal` + `FloatingFocusManager`。面板本体是 GlassSurface（`refraction="auto"`——浮层可以开折射）。
- 选项：`role="option"`、`aria-selected`；disabled 选项跳过导航。
- 键盘（验收标准）：
  - 触发器 Enter/Space/ArrowDown → 打开并聚焦当前选中项
  - 面板内 ↑/↓ 移动 active、Enter/Space 选中并关闭、Esc 关闭不选、Tab 关闭、字符 typeahead 跳转
- 进出场动画照 component-guide.md 浮层约定。
- **注意**：本组件先直接用 floating-ui 原语实现，M4 抽 Popover 时**不要求**回头重构 Select（记录 TODO 即可）。

## 验收标准

- [ ] 三组件通过 component-guide.md checklist
- [ ] Select 键盘行为逐条测试覆盖（上表 7 条）；外点关闭测试
- [ ] Input/Textarea 受控/非受控、invalid、prefix/suffix 布局正确
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过
- [ ] Storybook 人工验收（含 dark × 壁纸矩阵、表单场景 story）
- [ ] 每组件一个 git 提交

## 完成记录

（完成后填写）
