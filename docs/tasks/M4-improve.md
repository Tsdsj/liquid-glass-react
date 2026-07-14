---
status: done
depends: [M4-overlays]
---

# M4 Improve — Apple Liquid Glass 对齐改进

## 执行前提

- 仅当 `docs/tasks/M4-overlays.md` 已变为 `status: done` 后开始本任务。
- 本任务是 M4 完成后的质量改进，不得与 M4 浮层实现混在同一个提交中。
- 继续遵守根目录 `AGENTS.md`：禁止新增运行时依赖；公共 API 只允许按本任务卡定义修改。

## 调研依据

Apple 官方资料（核验日期：2026-07-14）：

- [Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/liquid-glass)
- [Adopting Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass)
- [Applying Liquid Glass to custom views](https://developer.apple.com/documentation/swiftui/applying-liquid-glass-to-custom-views)
- [GlassEffectContainer](https://developer.apple.com/documentation/swiftui/glasseffectcontainer)
- [Glass regular](https://developer.apple.com/documentation/swiftui/glass/regular)
- [Glass clear](https://developer.apple.com/documentation/swiftui/glass/clear)

Apple 对 Liquid Glass 的定义不只是背景模糊或边缘折射。它还应当：

1. 反映周围内容的颜色与光线。
2. 实时响应触摸、指针、焦点和按压。
3. 在控件出现、消失或靠近时产生融合与形变。
4. 主要用于内容层上方的导航、控件和浮层功能层，避免滥用。
5. 根据减少透明度、减少动态效果和提高对比度等设置调整表现。

## 当前差距

### 已有基础

- Chromium 已有圆角矩形边缘折射，Safari/Firefox 有 blur + saturation + tint 降级。
- 已有 filter 复用、SSR 首帧降级、嵌套玻璃保护、亮暗主题和 reduced-motion。
- M2/M3 控件具备基本键盘与 aria 行为。

### 本任务要解决的问题

1. `GlassSurface` 高光方向固定，`interactive` 只有 hover 换色和 active 缩放，缺少实时指针光影。
2. accent/danger Button 使用不透明纯色 tint，背景无法透入，视觉上不再像玻璃。
3. `prefers-reduced-transparency` 目前只关闭折射，仍保留模糊与半透明背景。
4. 没有 `regular` / `clear` 这样的材质语义。
5. Switch/Slider 的 thumb 始终是静态小玻璃，交互时没有增强或形变。
6. Select、Popover 等触发器与浮层只是独立淡入缩放，没有来源感和材质连续性。
7. Storybook 的 `photo` 实际是 CSS 渐变，现有测试不验证真实浏览器渲染。

## 目标

在不重写现有玻璃引擎、不增加运行时依赖的前提下，把现有实现从“静态毛玻璃”提升为“具有环境光、交互反馈和完整无障碍降级的动态玻璃”。

完成后必须满足：

- 默认用法保持兼容，现有组件不需要改调用代码。
- 新能力集中在 `GlassSurface` 和 token 层，组件只声明语义状态。
- Chromium 折射、Safari/Firefox 降级、SSR 和嵌套保护继续成立。
- reduced-transparency 模式不再显示模糊或透明玻璃。
- 不宣称与 Apple 原生系统像素级或物理级完全一致。

## 公共 API 变更（定稿）

### GlassSurface

```ts
export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLElement> {
  // 保留已有 props
  material?: 'regular' | 'clear'; // 默认 regular
}
```

- `regular`：现有主材质，允许折射、模糊、染色和动态高光。
- `clear`：更低 tint、更清晰的背景透入；调用方必须保证内容对比度，Storybook 中提供正确和错误用法对照。
- 宿主增加 `data-material="regular|clear"`。

### LiquidGlassConfig

```ts
export interface LiquidGlassConfigProps {
  forceFallback?: boolean;
  forceReducedTransparency?: boolean; // 新增，仅用于强制不透明无玻璃模式
  locale?: LiquidGlassLocale;
  children: React.ReactNode;
}
```

- `forceFallback` 仅表示关闭 SVG 折射，仍允许毛玻璃降级。
- `forceReducedTransparency` 表示关闭折射、blur、saturation 和透明 tint，使用不透明表面。
- 嵌套配置采用 OR 语义，子级不能重新打开父级已关闭的透明效果。

### useGlassSupport

返回值调整为：

```ts
{
  refraction: boolean;
  reducedTransparency: boolean;
}
```

该 hook 继续监听 `prefers-reduced-transparency: reduce`，并合并 `forceReducedTransparency`。

## 新增 Token（定稿）

在 `src/styles/tokens.css` 和 `src/styles/themes.css` 中增加：

```css
--lg-clear-tint: rgb(255 255 255 / 0.12);
--lg-clear-tint-hover: rgb(255 255 255 / 0.22);
--lg-opaque-surface: rgb(245 247 250 / 0.96);
--lg-pointer-highlight: rgb(255 255 255 / 0.55);
--lg-pointer-shade: rgb(0 0 0 / 0.12);
--lg-accent-glass: color-mix(in srgb, var(--lg-accent) 72%, transparent);
--lg-danger-glass: color-mix(in srgb, var(--lg-danger) 72%, transparent);
--lg-interaction-scale: 0.98;
```

暗色主题覆盖：

```css
--lg-clear-tint: rgb(30 30 30 / 0.18);
--lg-clear-tint-hover: rgb(50 50 50 / 0.28);
--lg-opaque-surface: rgb(32 34 38 / 0.96);
--lg-pointer-highlight: rgb(255 255 255 / 0.28);
--lg-pointer-shade: rgb(0 0 0 / 0.35);
```

不得在组件 CSS 中写新的颜色、圆角或时长字面量。

## 实现步骤

### 1. 动态指针高光

修改 `GlassSurface`：

- `interactive` 时监听 `pointermove`、`pointerenter`、`pointerleave`、`pointerdown`、`pointerup`、`pointercancel`。
- 用 `requestAnimationFrame` 合并 pointermove 更新，禁止每个事件直接 setState 重渲染。
- 将指针相对位置写入宿主 CSS 变量：`--lg-pointer-x`、`--lg-pointer-y`，范围 `0%..100%`。
- 将按压状态通过 `data-pressed` 暴露给 CSS。
- 必须合并调用方传入的同名事件处理器，不得覆盖原生 props。
- 卸载时取消 pending rAF。

修改 `glass-surface.css`：

- 保留原有 rim 高光；在 `::after` 中增加以 pointer 位置为中心的径向高光和反向暗部。
- `pointerleave` 后平滑回到默认位置。
- tint hover 必须有 transition，不能瞬间跳变。
- `prefers-reduced-motion: reduce` 时停止位置动画和按压缩放，但保留必要的颜色状态。
- `@media (hover: none)` 不运行 hover 高光，只响应真实按压状态。

### 2. 材质语义

- `material="regular"` 保持当前默认表现。
- `material="clear"` 使用 `--lg-clear-tint` / `--lg-clear-tint-hover`。
- ForcedFallback、Nested、regular、clear 四类行为各有单测。
- 新增 Storybook `Materials` story，必须放在高细节图片和文字背景上对比。

### 3. 完整透明度与对比度降级

- `forceReducedTransparency` 或媒体查询命中时，宿主增加 `data-transparency="reduced"`。
- reduced-transparency 下：`backdrop-filter: none`、不使用 SVG filter、背景改为 `--lg-opaque-surface`、保留清晰边框和焦点样式。
- `@media (prefers-contrast: more)`：提高表面不透明度和边框可见度，不改变布局。
- `@media (forced-colors: active)`：关闭所有玻璃背景、渐变、阴影和滤镜，使用系统色 `Canvas`、`CanvasText`、`ButtonBorder`。
- 增加配置嵌套、媒体查询变化和 SSR 测试。

### 4. Button tint 修正

- accent 使用 `--lg-accent-glass`，danger 使用 `--lg-danger-glass`。
- 不改变公共 `variant` API。
- 默认背景下必须能看到背景颜色轻微透入，同时文字达到可读水平。
- clear material 不自动用于 accent/danger，避免组合数量膨胀。

### 5. Switch / Slider 交互增强

- thumb 继续 `refraction="off"`，避免小尺寸滤镜开销。
- Pointer 拖动、按压以及键盘改变期间，thumb 增加 `data-interacting` 状态。
- 交互状态使用现有动态高光 token、轻微放大和 tint 增强，结束后回到静止状态。
- Switch 必须处理 pointer cancel；Slider 必须在 pointer up/cancel 后清理状态。
- reduced-motion 下不缩放，只保留颜色/高光变化。
- 增加鼠标、触摸等价 pointer 事件和键盘测试。

### 6. Select / Popover 材质连续性

在 M4 已完成实现的基础上调整：

- 浮层的 transform-origin 根据实际 placement 设置到触发器方向。
- 打开动画保持触发器与面板的圆角、tint、阴影方向连续。
- 打开时触发器进入 `data-expanded`，高光强度降低，避免触发器和面板同时抢视觉焦点。
- reduced-motion 下仅淡入淡出。
- 本任务不实现真正的拓扑融合或 metaball 效果，不新增不稳定的 `GlassGroup` 公共 API。

### 7. 视觉验证基础

- 在 `.storybook/` 或 `src/assets/storybook/` 增加至少一张本地高细节 WebP 图片；必须自行生成或注明可用来源，不使用远程 URL。
- Storybook 增加 `MaterialMatrix` 场景：
  - light / dark
  - regular / clear
  - refraction / forced fallback / reduced transparency
  - 静止 / hover / pressed / keyboard focus
- 明确允许新增 devDependency：`@playwright/test`，禁止新增其他视觉测试依赖。
- 增加 `pnpm test:visual`，只跑 Chromium，使用 Playwright 自带 `toHaveScreenshot`。
- 视觉基线控制在 6 张以内，至少覆盖：GlassSurface 材质矩阵、Button variants、Switch/Slider 交互、Select 或 Popover 展开、reduced-transparency。
- 截图测试使用固定 viewport、字体和动画关闭设置，避免无意义波动。

## 不在本任务范围

- 不实现 App Icon、原生窗口、系统 Tab Bar、Sidebar 或硬件同心圆角。
- 不实现任意 SVG Path 的折射贴图；继续只支持圆角矩形/胶囊。
- 不实现 Apple 私有物理渲染算法、色散或像素级完全一致。
- 不新增 `GlassGroup`、`GlassEffectContainer` 或 metaball 公共 API；真正的玻璃形状融合应先单独做技术验证，再进入后续任务。
- 不改 M4 已经公开的组件 props，除本任务明确列出的 `GlassSurface` 和 `LiquidGlassConfig` 外不增加公共 API。

## 验收标准

- [ ] `GlassSurface material="regular|clear"` API、类型和公共导出正确。
- [ ] 动态高光随指针位置移动，离开后复位，按压有明确但克制的反馈。
- [ ] 所有用户传入的 pointer event handlers 仍会被调用。
- [ ] accent/danger Button 保留可见的背景透入，不再是完全不透明色块。
- [ ] Switch/Slider 在 pointer 和键盘交互期间有明确的玻璃增强状态，结束后正确清理。
- [ ] Select/Popover 展开方向与触发器来源一致，reduced-motion 时无缩放和位移动画。
- [ ] `prefers-reduced-transparency` 和 `forceReducedTransparency` 下无 backdrop blur、无 SVG 折射、表面不透明且文字可读。
- [ ] `prefers-contrast: more` 与 `forced-colors: active` 有可用表现。
- [ ] Chromium 折射、Safari/Firefox 降级、SSR、嵌套保护和 filter 复用没有回归。
- [ ] Playwright 视觉基线不超过 6 张，`pnpm test:visual` 通过。
- [ ] `pnpm typecheck && pnpm build && pnpm test && pnpm test:visual` 全部通过。
- [ ] Storybook 在 1280×720 和 390×844 下人工检查，无文本溢出、控件重叠或明显掉帧。
- [ ] 完成后将本文件顶部改为 `status: done`，并在下方追加完成记录。
- [ ] 使用独立 Conventional Commit，不与 M4 或 M5 的其他工作混合提交。

## 完成记录

- 2026-07-14：完成 `regular` / `clear` 材质、动态指针高光、按压状态、透明度与高对比度降级，以及 Button、Switch、Slider、Select、Popover 的材质和交互增强。
- 新增本地原创高细节 WebP 桌面静物背景、`Materials` 与 `Visual/MaterialMatrix` Stories；图片使用 Pillow 确定性生成，不依赖远程资源。
- 新增 Chromium-only Playwright 视觉测试和 5 张基线，覆盖材质矩阵、Button variants、Switch、Slider 与 Popover 展开状态；Vitest 明确排除视觉测试目录。
- 验证通过：`pnpm typecheck`、`pnpm build`、`pnpm test`（18 个文件、119 个测试）和 `pnpm test:visual`（5 个场景）。
- 在 Chromium 的 1280×720 与 390×844 视口检查 MaterialMatrix、Materials 和交互场景，无横向溢出、文字裁剪、控件重叠或控制台错误；指针高光、交互状态清理和 Popover 展开方向符合预期。
