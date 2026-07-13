# 代码规范与约定

## TypeScript / React

- TS strict；禁止 `any`；公共 props 全部显式 interface 并导出（`ButtonProps` 等）。
- 组件一律函数组件 + `forwardRef`，ref 指向语义上的宿主元素（Button → `<button>`，Input → `<input>`，Modal → 面板 div）。
- 组件文件模板：

```tsx
// src/components/Button/Button.tsx
import { forwardRef } from 'react';
import { GlassSurface } from '../../core/GlassSurface';
import { cx } from '../../core/utils/cx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'glass' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'glass', size = 'md', loading, icon, className, children, ...rest },
  ref,
) {
  /* ... */
});
```

- 每个组件目录带 `index.ts`：`export { Button } from './Button'; export type { ButtonProps } from './Button';`
- 原生属性透传：props interface extends 对应的 `React.XxxHTMLAttributes`，`...rest` 透传到宿主元素；`className` 用 `cx()` 合并（用户的 className 追加在最后）。
- 受控/非受控：凡有值状态的组件都用 `useControllableState`（M1 实现），签名：

```ts
function useControllableState<T>(opts: {
  value?: T;              // 受控值
  defaultValue: T;        // 非受控初始值
  onChange?: (v: T) => void;
}): [T, (v: T) => void];
```

- 事件命名：布尔开关类用 `onCheckedChange(checked: boolean)`（Switch/Checkbox）；值类用 `onChange(value)`（Slider/Select）；原生输入类保留 React 原生 `onChange(event)`（Input/Textarea）；浮层用 `onOpenChange(open: boolean)`。
- 禁止 default export；禁止 barrel re-export 之外的深层相对 import 穿透（组件内部互相 import 见 architecture.md 依赖规则）。

## CSS

- **前缀**：所有类名 `lg-` 前缀。BEM 变体：块 `.lg-button`，元素 `.lg-button__icon`，修饰符用 data 属性而非 modifier class。
- **状态用 data 属性**，与 React 侧一一对应：
  - `data-size="sm|md|lg"`、`data-variant="glass|accent|..."`
  - `data-disabled`、`data-checked`、`data-invalid`、`data-open`、`data-refraction="on|off"`
  - 选择器写法：`.lg-button[data-variant="accent"]`、`.lg-switch[data-checked]`
- **禁止**：`!important`；ID 选择器；标签选择器（伪元素除外）；嵌套超过 2 层的选择器；样式字面量硬编码（颜色/圆角/时长必须走 `--lg-*` token，见 tokens.md）。
- 组件 CSS 文件顶部声明组件级 token（默认值引用全局 token）：

```css
/* src/components/Button/button.css */
.lg-button {
  --lg-button-bg: var(--lg-tint);
  --lg-button-radius: var(--lg-radius-full);
  /* ... */
}
```

- focus 样式统一：`:focus-visible` 时 `outline: 2px solid var(--lg-accent); outline-offset: 2px;`（写进 GlassSurface 基础 CSS，可被组件覆盖但不能删除）。
- 动画过渡统一用 `var(--lg-duration)` + `var(--lg-ease)`；必须尊重 `@media (prefers-reduced-motion: reduce)`（关掉装饰性 transition/animation）。
- 新组件 CSS 写完后必须在 `src/styles/index.css` 追加 `@import`（顺序：tokens → themes → glass-surface → 各组件按字母序 → toast）。

## Storybook Story 规范

- 每个组件至少 3 个 story：`Playground`（args 全开，controls 可调）、`Variants`（全 variant × size 矩阵一屏展示）、`States`（disabled/loading/invalid 等状态）。
- story 不需要自己铺背景——全局 decorator 已提供壁纸/主题切换（`.storybook/preview.tsx`）。
- 交互密集组件（Select/Modal/Toast）加一个真实场景 story（如表单中使用）。

## 测试文件规范

见 `docs/testing.md`。文件命名 `<Name>.test.tsx`，与组件同目录。

## 命名速查

| 对象 | 规则 | 例 |
|---|---|---|
| 组件文件/目录 | PascalCase | `Button/Button.tsx` |
| CSS 文件 | kebab-case | `glass-surface.css` |
| hooks | `use` 前缀 camelCase | `useGlassSupport` |
| CSS 类 | `lg-` + kebab-case | `.lg-glass-surface` |
| CSS 变量 | `--lg-` + kebab-case | `--lg-radius-md` |
| filter id | `lg-f-<自增>` | `#lg-f-3` |
| 测试 describe | 组件名 | `describe('Button')` |
