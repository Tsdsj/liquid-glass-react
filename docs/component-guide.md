# 组件开发指南

## 新组件开发流程（checklist）

每个组件严格走完以下步骤，全部勾完才算完成：

1. [ ] 读对应任务卡中该组件的 API 定义（props 表是定稿，不加不减）
2. [ ] 创建目录 `src/components/<Name>/`，五件套：`<Name>.tsx`、`<name>.css`、`<Name>.stories.tsx`、`<Name>.test.tsx`、`index.ts`
3. [ ] 实现组件（forwardRef、受控/非受控、原生属性透传，规范见 conventions.md）
4. [ ] CSS：组件级 token 声明在顶部；状态全部用 data 属性；在 `src/styles/index.css` 追加 `@import`
5. [ ] 在 `src/index.ts` 追加导出（组件 + Props 类型）
6. [ ] Stories：Playground / Variants / States 三个起步
7. [ ] 测试：按 testing.md 要求，交互逻辑全覆盖
8. [ ] `pnpm typecheck && pnpm build && pnpm test` 通过
9. [ ] Storybook 人工过一遍：light/dark × 至少 2 种壁纸 × 键盘操作

## 通用 API 约定（所有组件）

| 约定 | 内容 |
|---|---|
| size | `'sm' \| 'md' \| 'lg'`，默认 `'md'`，映射 `--lg-control-h-*` 与 `--lg-font-size-*` |
| disabled | 布尔；视觉（`--lg-text-disabled`、tint 减淡、`pointer-events` 保留但交互拦截）+ `aria-disabled` 或原生 disabled |
| 受控/非受控 | `useControllableState`；两模式在测试中都要覆盖 |
| ref | forwardRef 指向语义宿主元素 |
| className/style | 透传合并，用户值优先 |
| 键盘 | 每个交互组件的键盘行为在其 API 定义中列出，属验收标准 |

## 玻璃使用原则（哪些部位用 GlassSurface）

- **控件主体**（Button 整体、Switch/Slider 的 thumb、Select 触发器、Modal 面板、Toast 胶囊）→ GlassSurface。
- **轨道/背景**（Switch/Slider 的 track、Checkbox 的框）→ 纯 tint（普通 div + `--lg-tint` 背景），不用 backdrop-filter——小面积玻璃看不出折射且浪费合成。
- **文字输入区**（Input/Textarea/Select 触发器）→ GlassSurface 但 `refraction="off"`（背景在文字后扭曲影响可读性）。
- 浮层（Modal/Popover/Tooltip/Toast 面板）是玻璃效果最出彩的地方，`refraction="auto"` + 较大 `bezel`。

## 浮层组件公共约定（M4）

- 全部基于 `@floating-ui/react`：`useFloating` + middleware `offset(8) / flip() / shift({padding: 8})`；箭头用 `arrow()`（Tooltip/Popover）。
- Portal：`<FloatingPortal>` 到 body。
- 进出场动画：CSS class `data-status="open|close"`（floating-ui 的 `useTransitionStatus`），透明度 + 轻微 scale(0.96→1) + translateY，时长 `--lg-duration-slow`；`prefers-reduced-motion` 时仅透明度。
- z-index：`var(--lg-z-overlay)`。
- 浮层面板挂载时才渲染 DOM（不做 keepMounted）。

## 每个组件的定稿 API

详见各里程碑任务卡：

- 批次 1（Button/Switch/Slider/Checkbox）→ `docs/tasks/M2-basic-controls.md`
- 批次 2（Input/Textarea/Select）→ `docs/tasks/M3-inputs.md`
- 批次 3（Modal/Popover/Tooltip/Toast）→ `docs/tasks/M4-overlays.md`
