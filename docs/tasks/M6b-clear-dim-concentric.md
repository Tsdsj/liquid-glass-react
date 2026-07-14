---
status: todo
depends: [M6a]
---

# M6b — 二阶段：clear 暗化层、环境色调 token、圆角同心

## 执行前提

- 仅当 `M6a` 为 `status: done` 后开始。
- 继续遵守根目录 `AGENTS.md`。本卡包含一次公共 API 变更（GlassSurface 新增
  `dim` prop），以下定义即为定稿依据。

## 调研依据

Apple 官方资料（核验日期：2026-07-14）：

- [HIG Materials](https://developer.apple.com/design/human-interface-guidelines/materials)：
  clear 变体用于媒体等视觉丰富背景；"If the underlying content is bright,
  consider adding a dark dimming layer of 35% opacity."
- [Glass clear](https://developer.apple.com/documentation/swiftui/glass/clear)
- Liquid Glass "reflects color and light of surrounding content"——Web 无法采样
  backdrop 像素，本卡以**调用方声明的环境色 token** 做低保真近似，明确不宣称等效。

## 当前差距

1. `material="clear"` 只是更低的 tint，没有 HIG 要求的暗化层机制；亮背景上的
   clear 玻璃可读性低于官方。
2. 玻璃对周围内容颜色零感知，没有任何(哪怕声明式的)环境色调通道。
3. 内部圆角与容器圆角不同心：Select 选项、Modal 关闭按钮等使用固定
   `--lg-radius-sm`，与 Apple "concentric shapes" 原则不符。

## 公共 API 变更（定稿）

### GlassSurface

```ts
export interface GlassSurfaceProps extends React.HTMLAttributes<HTMLElement> {
  // 保留已有 props
  dim?: boolean; // 默认 false。true 时在 tint 之下渲染暗化层，用于亮媒体背景上的 clear 玻璃
}
```

- 宿主增加 `data-dim`（true 时）。
- 与 `material` 正交（任何材质可用），但文档与 story 只推广 clear + dim 组合。
- `data-transparency="reduced"`、`forced-colors` 下暗化层不渲染（不透明表面已保证对比度）。

## 新增 Token（定稿）

`src/styles/tokens.css`：

```css
--lg-dim-layer: rgb(0 0 0 / 0.35); /* HIG 35% 暗化层 */
--lg-ambient: transparent;         /* 环境色调，调用方在容器上覆盖，如 color-mix 出的主色 */
```

`src/styles/themes.css` 暗色覆盖：

```css
--lg-dim-layer: rgb(0 0 0 / 0.5); /* 暗色主题下媒体高光更刺眼，加深 */
```

## 实现步骤

1. **暗化层**：`glass-surface.css` 中 `::before` 改为多层背景——
   顶层 `var(--lg-surface-tint)`，`[data-dim]` 时追加底层 `var(--lg-dim-layer)`，
   `[data-ambient]`（见下）时追加最底层环境色。禁止新增伪元素或 DOM 节点。
2. **环境色调**：`::before` 恒定渲染最底层
   `linear-gradient(var(--lg-ambient) 0 0)`；默认 transparent，零视觉/性能差异。
   调用方用法（写进 Storybook story，不改组件代码）：

   ```css
   .hero-section { --lg-ambient: color-mix(in srgb, #1d4ed8 18%, transparent); }
   ```

3. **圆角同心**：`--lg-r` 已通过 CSS 自定义属性继承进内容区（嵌套 GlassSurface
   会用自身值正确遮蔽）。约定式公式：

   ```css
   border-radius: max(var(--lg-radius-sm), calc(var(--lg-r, var(--lg-radius-md)) - <内边距>));
   ```

   应用到：Select 选项（内边距 `--lg-space-1`）、Modal 关闭按钮、Toast 图标容器。
   仅改这三处组件 CSS，不做全库扫描替换。
4. **Storybook**：`Visual/ClearDim` story——同一张高细节亮图上放
   clear、clear+dim、regular 三块玻璃对照；`Visual/Ambient` story 演示 token 覆盖。

## 验收标准

- [ ] `dim` 默认 false 时 DOM 与样式与现状完全一致（快照/断言验证无回归）。
- [ ] `dim` 在 regular/clear、亮/暗主题、折射开/关下均只影响 `::before` 背景层。
- [ ] reduced-transparency、forced-colors 下 `data-dim` 存在但暗化层不生效（有测试）。
- [ ] `--lg-ambient` 默认 transparent 时计算样式与改动前一致。
- [ ] Select 选项 / Modal 关闭按钮 / Toast 图标的圆角随宿主 `--lg-r` 联动，
      且不小于 `--lg-radius-sm`（单测断言 style 计算表达式即可，不要求像素验证）。
- [ ] 嵌套玻璃内的同心公式取最近一层玻璃的 `--lg-r`（有测试）。
- [ ] i18n：新 story 提供中英文案（中文默认）。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过。

## 明确非目标

- 自动检测背景亮度决定是否 dim（Web 无法读取 backdrop 像素，由调用方判断）。
- 实时环境反射 / 取色（`--lg-ambient` 是声明式近似，README 措辞不得夸大）。
- 除本卡列出的三处以外的组件圆角改造。
