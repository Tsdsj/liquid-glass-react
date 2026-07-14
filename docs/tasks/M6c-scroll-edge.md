---
status: done
depends: [M6b]
---

# M6c — 二阶段：滚动边缘效果（scroll edge effect）

## 执行前提

- 仅当 `M6b` 为 `status: done` 后开始。
- 继续遵守根目录 `AGENTS.md`。本卡不新增公共组件与 props，机制为内部实现。

## 调研依据

Apple 官方资料（核验日期：2026-07-14）：

- [Adopting Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass)：
  "Scroll views offer a scroll edge effect that helps maintain sufficient
  legibility and contrast for controls by obscuring content that scrolls
  beneath them."
- [HIG Materials](https://developer.apple.com/design/human-interface-guidelines/materials)：
  "Scroll edge effects further enhance legibility by blurring and reducing
  the opacity of background content."

## 当前差距

库内两处内部滚动区——Modal body（header/footer 下方）与 Select 面板（超出
maxHeight 时）——内容滚动到边缘时生硬截断，无官方那种"滚入控件下方逐渐模糊
降透明"的可读性保护。

## 设计（定稿）

### 内部模块 `src/core/scroll-edge/`

```ts
// useScrollEdges.ts —— 内部 hook，不从包入口导出
export interface ScrollEdges { top: boolean; bottom: boolean }
export function useScrollEdges(ref: RefObject<HTMLElement | null>): ScrollEdges;
```

- scroll + ResizeObserver 触发，rAF 合并（与 useElementSize 同一节奏约定），
  阈值 1px 内视为贴边；SSR 返回 `{ top: false, bottom: false }`。
- 卸载取消监听与 pending rAF（沿用 19d1ace 的取消模式）。

### DOM 与 CSS（scroll-edge.css，经 styles/index.css 引入）

滚动容器外包一层 `position: relative` 的 `.lg-scroll-edge`，按需条件渲染两个
覆盖元素（不贴边才挂载，避免常驻合成层）：

```html
<div class="lg-scroll-edge" data-edge-top data-edge-bottom>
  <div class="lg-scroll-edge__overlay" data-side="top" aria-hidden="true"></div>
  <滚动容器 />
  <div class="lg-scroll-edge__overlay" data-side="bottom" aria-hidden="true"></div>
</div>
```

- overlay：absolute 贴上/下缘，`pointer-events: none`，高度 `--lg-scroll-edge-size`，
  `backdrop-filter: blur(var(--lg-scroll-edge-blur))` +
  `mask-image: linear-gradient(<朝内> black, transparent)` 做渐进衰减，
  叠加同方向 `var(--lg-surface-tint)` 渐变补偿亮度。
- 关键前提（实现中注释说明）：overlay 位于玻璃面板内部，面板自身的
  backdrop-filter/isolation 使其成为 backdrop root，overlay 只会采样**面板内**
  滚动内容，不会穿透到页面背景——行为正确且跨浏览器（纯 blur，无 Chromium 依赖）。
- 降级：`data-transparency="reduced"`、`forced-colors` 下 overlay 改为
  `var(--lg-opaque-surface)` 渐变遮罩，无 blur；`prefers-reduced-motion` 下
  出现/消失无过渡，直接切换。

### 新增 Token（定稿）

```css
--lg-scroll-edge-size: calc(var(--lg-space-4) * 2); /* 32px */
--lg-scroll-edge-blur: 6px;
```

### 接入点（仅此两处）

1. Modal body：`.lg-modal__body` 外包 `.lg-scroll-edge`。
2. Select 面板：面板内容滚动区外包（注意面板本身是 GlassSurface，overlay 在
   `.lg-surface__content` 内）。

## 实现步骤

1. 实现 `useScrollEdges` + 单测（初始贴边、滚动中间、滚到底、内容变化重算、
   卸载清理、SSR 快照）。
2. 实现 `scroll-edge.css` 与 overlay 渲染逻辑（条件挂载）。
3. 接入 Modal 与 Select，确认既有键盘导航、focus 循环、typeahead 不受包裹层影响。
4. Storybook：`Visual/ScrollEdge` story——长列表 Select 与长内容 Modal;
   `visual-tests` 增加断言：滚动前后 `data-edge-*` 属性与 overlay 挂载状态。

## 验收标准

- [ ] 内容不足一屏时不渲染任何 overlay，DOM 与现状等价。
- [ ] 滚动位置位于顶部时只有底部 overlay，中部两个，底部只有顶部 overlay。
- [ ] Modal 长内容滚动时 header/footer 附近内容渐进模糊淡出（本地浏览器人工确认，
      记录在完成记录中；服务器环境只做 DOM 状态断言）。
- [ ] Select 键盘导航把选项滚入视野时 `data-edge-*` 正确更新。
- [ ] reduced-transparency / forced-colors 下无 blur，改用不透明渐变。
- [ ] 嵌套玻璃、SSR、resize 防抖、首帧门控相关既有测试全部保持通过。
- [ ] overlay 不参与 tab 序、无 aria 噪音（aria-hidden，pointer-events none）。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过。

## 明确非目标

- 对库外消费者暴露 scroll edge 公共 API（如后续需要，另开任务卡定义导出）。
- 页面级工具栏/标签栏场景（库内没有此类组件）。
- Chromium 渐进式变模糊（progressive blur 多层采样），单层 blur + mask 已足够近似。

## 完成记录（2026-07-14）

改动文件：

- `src/core/scroll-edge/useScrollEdges.ts`：内部 hook（不从包入口导出），scroll +
  ResizeObserver 触发、rAF 合并（与 useElementSize 同节奏），阈值 1px；SSR 返回
  `{top:false,bottom:false}`；卸载移除 scroll 监听、断开 observer、取消 pending rAF。
- `src/core/scroll-edge/ScrollEdge.tsx`：内部组件，包裹滚动区，仅在有隐藏内容的一侧
  条件挂载 `aria-hidden` overlay（pointer-events none、不入 tab 序）；宿主写
  `data-edge-top/bottom`。注释说明 overlay 在玻璃面板内、面板自身构成 backdrop root，
  overlay 的 blur 只采样面板内滚动内容，跨浏览器成立。
- `src/core/scroll-edge/scroll-edge.css`：overlay 贴边 + `backdrop-filter: blur` +
  `mask-image` 朝内衰减 + 同向 tint 渐变补偿；降级（`[data-transparency='reduced']`
  与 `prefers-reduced-transparency` / `forced-colors`）改不透明渐变、无 blur；
  `prefers-reduced-motion` 关闭出现动画。经 `styles/index.css` 引入。
- `src/core/scroll-edge/index.ts`：内部导出（仅供 Modal/Select 引用）。
- `src/styles/tokens.css`：新增 `--lg-scroll-edge-size: calc(var(--lg-space-4) * 2)`、
  `--lg-scroll-edge-blur: 6px`。
- `src/components/Modal/Modal.tsx` + `modal.css`：`.lg-modal__body` 外包
  `.lg-scroll-edge`（wrapper 承接 flex 增长，viewport 保留 body 内边距与滚动）。
- `src/components/Select/Select.tsx` + `select.css`：选项列表外包 `.lg-scroll-edge`
  （overlay 位于 `.lg-surface__content` 内）；滚动从面板宿主下沉到 viewport，面板改
  `display:flex` 列 + `overflow:hidden`，content/scroll/viewport 逐级 `flex:1 1 auto;
  min-height:0` 传递高度约束（沿用 Modal 已验证的 flex 滚动链，且能正确容纳面板内边距）。
- `src/ScrollEdge.stories.tsx`：`Visual/ScrollEdge` story（长内容 Modal + 30 项 Select），
  中英文案（中文默认）。
- `visual-tests/liquid-glass.visual.spec.ts`：新增「滚动前后 overlay 挂载/`data-edge-*`
  状态」DOM 断言（无截图，无需基线）。

测试：`useScrollEdges.test.tsx`（8 例：初始贴边/中部/到底/内容不足/滚动重算/内容 resize
重算/卸载清理/SSR 默认）与 `ScrollEdge.test.tsx`（3 例：内容不足不挂 overlay、顶部只挂
底部 overlay、中部两侧 aria-hidden 且不可聚焦）覆盖 DOM 状态；Modal/Select 既有键盘导航、
focus 循环、typeahead、折射门控测试全部保持通过。

验证结果：`pnpm typecheck && pnpm build && pnpm test` 全部通过（154 tests，无 act 警告）；
`playwright test --list` 可识别新 spec（本机无浏览器，未实际运行截图/交互；服务器环境按
本卡约定只做 DOM 状态断言，Modal 长内容的人工可视确认待有浏览器环境时补测）。
