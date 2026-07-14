---
status: done
depends: [M3]
---

# M4 — 批次 3：浮层与反馈

Popover / Tooltip / Modal / Toast。公共约定见 `docs/component-guide.md` §浮层组件公共约定。建议实现顺序：Popover → Tooltip（复用交互模式）→ Modal → Toast。

## Popover

```ts
interface PopoverProps {
  content: React.ReactNode;
  children: React.ReactElement;          // 触发器，cloneElement 注入 ref + 交互 props
  open?: boolean; defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;                 // floating-ui Placement，默认 'bottom'
  showArrow?: boolean;                   // 默认 true
}
```

- `useFloating` + offset(8)/flip()/shift({padding:8})/arrow()；`useClick` + `useDismiss`（外点/Esc）+ `useRole({role:'dialog'})`。
- 面板：GlassSurface `refraction="auto"`，padding `--lg-space-3`。
- 箭头：`<FloatingArrow>` 或自绘小三角，fill 用与面板 tint 一致的半透明色（箭头处无 backdrop-filter，接受色差，保持简单）。
- 键盘：触发器 Enter/Space 开、Esc 关、焦点循环（FloatingFocusManager，`modal:false`）。

## Tooltip

```ts
interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: Placement;      // 默认 'top'
  delay?: number;             // hover 打开延迟 ms，默认 300；关闭无延迟
}
```

- `useHover({delay, move:false})` + `useFocus` + `useDismiss` + `useRole({role:'tooltip'})`。
- 面板：小号 GlassSurface（`refraction="off"`——太小），深色 tint 提高对比。
- 无交互内容，不抢焦点。

## Modal

```ts
interface ModalProps {
  open: boolean;                          // 受控 only（Modal 不做非受控）
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;                // 渲染 header + aria-labelledby
  footer?: React.ReactNode;               // 渲染 footer 槽
  size?: 'sm' | 'md' | 'lg';              // 面板 max-width: 400/560/720px
  closeOnOverlayClick?: boolean;          // 默认 true
  children: React.ReactNode;
}
```

- `useFloating`（无定位 middleware，居中布局用 CSS）+ `useDismiss`（Esc + overlay 点击受 `closeOnOverlayClick` 控制）+ `useRole({role:'dialog'})`。
- `<FloatingOverlay lockScroll>`：暗化 + 轻度 `backdrop-filter: blur(8px)`；`<FloatingFocusManager modal>` 焦点圈闭，关闭后焦点还原触发元素。
- 面板：大 GlassSurface（`--lg-radius-lg`，`refraction="auto"`，较大 bezel）。右上角关闭按钮（复用 Button ghost 变体，`aria-label="Close"`）。
- 进出场：overlay 淡入 + 面板 scale(0.96)+translateY(8px)→原位，`--lg-duration-slow`；动画期间临时 `will-change`，结束移除（glass-engine.md §9）。

## Toast（命令式）

```ts
// 公共 API
export const toast: {
  show(content: React.ReactNode, opts?: ToastOptions): string;   // 返回 id
  success(content: React.ReactNode, opts?: Omit<ToastOptions,'kind'>): string;
  error(content: ...): string;
  info(content: ...): string;
  dismiss(id?: string): void;    // 无参清空
};
interface ToastOptions { duration?: number; /* ms，默认 3000，Infinity 常驻 */ icon?: React.ReactNode; kind?: 'default'|'success'|'error'|'info' }
interface ToasterProps { position?: 'top-left'|'top-center'|'top-right'|'bottom-left'|'bottom-center'|'bottom-right'; /* 默认 'top-center' */ max?: number /* 超出丢弃最旧，默认 5 */ }
```

- `toast-store.ts`：模块级数组 + listeners + `getSnapshot`（不可变更新，快照引用稳定）；`show` 生成自增 id、注册自动 dismiss 计时器；`dismiss` 先标记 `exiting`（触发退场动画），300ms 后真删。**store 不触碰 DOM，SSR 安全；Toaster 未挂载时 show 只入队。**
- `Toaster.tsx`：`useSyncExternalStore` 订阅，`createPortal` 到 body，固定定位堆叠（gap 8px，新的在最前）；每条是胶囊 GlassSurface（`refraction="auto"`）+ kind 图标（success/error/info 用 `--lg-success/danger/accent` 着色）。
- hover 暂停自动关闭计时（可选加分项，不强制）。
- `role="status"` + `aria-live="polite"`。

## 验收标准

- [ ] 四组件通过 component-guide.md checklist
- [ ] Modal：焦点圈闭（Tab 不逃逸）、Esc 关、overlay 点击可配置、滚动锁定、关闭后焦点还原——各一个测试
- [ ] Popover/Tooltip：开关交互、外点关闭、Esc、视口边缘 flip（Storybook 边缘场景 story 人工验证）
- [ ] Toast：show→自动消失（fake timers）、dismiss(id)、dismiss()、max 截断、未挂载 Toaster 不抛错——测试覆盖
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过
- [ ] Storybook 人工验收：浮层玻璃叠在滚动的丰富内容上折射明显（做一个长内容背景 story）
- [ ] 每组件一个 git 提交

## 完成记录

- 需求补充（2026-07-14）：补齐 M1/M2 已有组件 Stories 的中英文文案并默认中文；M4 内置的可访问性文案跟随 `LiquidGlassConfig.locale`，业务内容仍由调用方传入。
- 完成（2026-07-14）：实现 Popover、Tooltip、Modal 与命令式 Toast/Toaster，补齐公共导出、统一样式入口、双语 Stories 和交互测试；Modal 关闭按钮随 locale 显示“关闭”或“Close”。
- 验证：`pnpm typecheck`、`pnpm build`、`pnpm test` 通过（18 个测试文件、108 项测试）；Chromium Storybook 在 1280×720 与 390×844 下完成中英文、键盘、定位、焦点、滚动锁和溢出检查，无控制台错误。
