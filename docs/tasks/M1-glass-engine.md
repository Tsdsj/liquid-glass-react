---
status: done
depends: [M0]
---

# M1 — 玻璃引擎 + Token（核心里程碑）

## 目标

GlassSurface 原语在 Chromium 上呈现真实边缘折射、其他浏览器优雅降级；token 体系完整可用。**本里程碑质量决定整个库的上限，宁慢勿糙。**

规格文档：`docs/glass-engine.md`（逐节实现）、`docs/tokens.md`（逐条写入）。

## 步骤

1. `src/styles/tokens.css` + `themes.css`：照 tokens.md 全表写入，含 dark 覆盖与 prefers-color-scheme 兜底。
2. `src/core/utils/cx.ts`：`cx(...args: (string | false | null | undefined)[]): string`。
3. `src/core/hooks/useControllableState.ts`（含测试）。
4. `src/core/hooks/useElementSize.ts`：ResizeObserver + rAF 合并。
5. `src/core/filter/displacement-map.ts`：`computeDisplacementPixels`（纯函数）+ `makeDisplacementMap`（canvas 封装）+ LRU。算法照 glass-engine.md §3 定稿公式。
6. `src/core/filter/filter-registry.ts`：照 §4 接口实现（注意 key 含 scale）。
7. `src/core/filter/GlassFilterDefs.tsx`：照 §5。
8. `src/core/hooks/useGlassSupport.ts`：照 §6，含 `__resetGlassSupportCache`。
9. `src/core/config/LiquidGlassConfig.tsx`：forceFallback + insideGlass 嵌套检测（§7）。
10. `src/core/GlassSurface/`：组件 + glass-surface.css（§2 定稿骨架），行为契约照 §2.4。
11. `src/index.ts` 导出 `GlassSurface`、`LiquidGlassConfig` 及类型；styles/index.css 加 @import。
12. 测试：testing.md「引擎层必测」全部覆盖。
13. Storybook：`src/core/GlassSurface/GlassSurface.stories.tsx`
    - `Playground`：一块 320×200 玻璃面板叠在壁纸上，controls 调 radius/depth/bezel/tint/interactive
    - `TuningLab`：页面内滑杆实时改 `--lg-blur/--lg-refraction/--lg-saturation/--lg-tint` 透明度（写 documentElement.style），用于调参定稿 token 默认值
    - `ForcedFallback`：`<LiquidGlassConfig forceFallback>` 包裹，对照降级观感
    - `ManyInstances`：同尺寸 20 个实例网格（验证 filter 共享）
    - `Resizable`：CSS resize: both 的容器内放 GlassSurface（验证 resize 行为）
    - `Nested`：玻璃内嵌玻璃（验证自动降级）

## 验收标准

- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过，引擎测试全绿
- [ ] Chromium 打开 Playground：photo/gradient 壁纸下边缘有明显"背景向内弯折"的折射带，中心内容清晰
- [ ] ForcedFallback 与真实 Safari（或注释 UA 判定强制走降级分支）观感合格：毛玻璃 + 高光边缘，无折射但不破碎
- [ ] ManyInstances：DevTools 检查 body 末尾的 `<svg><defs>` 内只有 1 个 filter
- [ ] Resizable：拖拽改变尺寸无报错、无闪烁，停止后折射贴合新尺寸
- [ ] Nested：内层无 backdrop-filter（DevTools 验证）
- [ ] dark 主题 + prefers-reduced-transparency 模拟（DevTools rendering 面板）行为正确
- [ ] 调参后把满意的默认值回写 tokens.css 并在完成记录中注明改了哪些
- [ ] git 提交（可拆多个：tokens / filter 引擎 / GlassSurface / stories）

## 完成记录

- 2026-07-13：完成全量 light/dark token、`cx`、受控状态与尺寸 hooks、位移贴图/LRU、filter registry、SVG defs 单例宿主、降级检测、`LiquidGlassConfig`、`GlassSurface` 组件/CSS/公共导出及 6 个 Storybook stories。
- 测试：新增 6 个测试文件、25 个 case，覆盖位移方向与缓存、filter 共享/引用计数/延迟移除、UA/SSR/降低透明度分支、受控状态、border-box 测量、GlassSurface 嵌套与 resize 后 filter 切换。
- 验证：`pnpm typecheck`、`pnpm build`、`pnpm test` 全部通过；构建产出 ESM/CJS/types/style.css。
- 浏览器：Playground 为 `data-refraction="on"`，`320x200` 宿主对应 `320x200` filter；ManyInstances 的 20 个实例共享 1 个 SVG/filter；ForcedFallback 无 filter 且使用 `blur(16px)`；Nested 内层 computed `backdrop-filter: none`；dark token 与 `prefers-reduced-transparency: reduce` 模拟均正确，控制台无错误或警告。
- 调参：按 TuningLab 与 photo/gradient、light/dark 组合检查后保留 `tokens.md` 的定稿默认值，未做设计偏移。
- 规格记录：`glass-engine.md` 的 `FilterEntry.scaleVar: true` 与后文 `f.scale`/scale 入 key 冲突；按后文行为实现为 `scale: number`。当前浏览器自动化无法抓取原生 CSS resize 手柄，改由 ResizeObserver + 150ms 防抖的集成测试验证 `320x200 -> 420x260` filter 切换。
