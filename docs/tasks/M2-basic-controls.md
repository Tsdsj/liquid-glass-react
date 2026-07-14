---
status: done
depends: [M1]
---

# M2 — 批次 1：基础交互组件

Button / Switch / Slider / Checkbox。流程照 `docs/component-guide.md` checklist，四个组件相互独立、可并行实现。

## Button

```ts
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'glass' | 'accent' | 'ghost' | 'danger';  // 默认 'glass'
  size?: 'sm' | 'md' | 'lg';                          // 默认 'md'
  loading?: boolean;    // 显示 spinner（纯 CSS 圆环动画），期间不触发 onClick
  icon?: React.ReactNode;  // 前置图标槽
}
```

- 实现：`GlassSurface as="button"`，胶囊圆角（`--lg-radius-full`）。
- variant：`glass` 默认 tint；`accent` tint 换 `--lg-accent`（文字 `--lg-accent-contrast`，折射保留）；`ghost` 无 tint 无 backdrop（纯文字，hover 出现 tint）；`danger` 同 accent 但用 `--lg-danger`。
- 键盘：原生 button 行为即可（Enter/Space）。
- loading 时 `aria-busy`，点击被拦截但不加 disabled 属性。

## Switch

```ts
interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}
```

- 结构：`<label class="lg-switch">` 内隐藏原生 `<input type="checkbox" role="switch">`（opacity:0 覆盖整区，保留可访问性）+ 视觉 track（纯 tint div）+ thumb（小 GlassSurface，`refraction="off"`——尺寸太小折射无意义，用高光质感）。
- thumb 位移动画 `--lg-ease-bounce`；checked 时 track 变 `--lg-accent`。
- 键盘：Space 切换（原生行为）。ref 指向 input。

## Slider

```ts
interface SliderProps {
  value?: number; defaultValue?: number;
  onChange?: (value: number) => void;      // 拖动过程持续触发
  onChangeEnd?: (value: number) => void;   // 松手触发
  min?: number; max?: number; step?: number;  // 默认 0 / 100 / 1
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  'aria-label'?: string;
}
```

- 结构：隐藏原生 `<input type="range">` 叠满整个交互区（可访问性与键盘全靠它）+ 自绘 track（tint 底 + accent 填充段，宽度 `calc` 百分比变量 `--lg-slider-progress`）+ thumb（玻璃圆珠 GlassSurface `refraction="off"`）。
- 键盘：方向键 ±step、Home/End（原生 range 行为，验证即可）。
- 测试注意：jsdom 对 range 拖动支持有限，用 `fireEvent.change` 模拟。

## Checkbox

```ts
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  checked?: boolean; defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;   // label 文本
}
```

- 结构：`<label>` + 隐藏原生 input + 视觉框（圆角 `--lg-radius-sm` 的小 tint 面板，checked 时 accent 底 + 白色对勾 SVG，出现动画 stroke-dashoffset）。
- `indeterminate` 通过 ref 同步到 `input.indeterminate`，视觉为横线。
- 键盘：Space（原生）。

## 验收标准

- [ ] 四组件全部通过 component-guide.md checklist（含 stories 三件套、测试）
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过
- [ ] Storybook 人工验收：light/dark × photo/gradient 壁纸；键盘逐个操作
- [ ] 每组件一个 git 提交：`feat(button): ...` 等

## 完成记录

- 新增 `Button`、`Switch`、`Slider`、`Checkbox` 四组件的实现、纯 CSS 样式、Storybook stories、单元测试和公共导出。
- `pnpm typecheck`、`pnpm build`、`pnpm test` 全部通过；共 10 个测试文件、50 项测试通过。
- Storybook 在 1280×720 下完成 light/dark × photo/gradient 组合验收，并验证 Enter、Space、方向键、Home、End、focus、disabled、loading 和 indeterminate 状态；390×844 移动视口无横向溢出。
