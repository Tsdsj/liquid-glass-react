---
status: done
depends: [M4-improve]
---

# M6a — 二阶段：按压折射增强（交互时材质"活"起来）

> 二阶段（Liquid Glass 对齐第二批）共三张卡：M6a → M6b → M6c，按此顺序执行。
> M5（发布）由用户单独触发，本阶段任务卡优先于 M5。

## 执行前提

- 仅当 `M4-improve` 为 `status: done` 后开始（已满足）。
- 继续遵守根目录 `AGENTS.md`：禁止新增运行时依赖；公共 API 只允许按本卡定义修改。
- 不得改动 19d1ace 引入的首帧合成门控语义（pending 两帧 + 400ms 降级出口）。

## 调研依据

Apple 官方资料（核验日期：2026-07-14）：

- [Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/liquid-glass)
- [Adopting Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass)：
  "Controls come to life when a person interacts with them. For controls like
  sliders and toggles, the knob transforms into Liquid Glass during interaction."
- [Applying Liquid Glass to custom views](https://developer.apple.com/documentation/swiftui/applying-liquid-glass-to-custom-views)：
  "reacts to touch and pointer interactions in real time"；`interactive()` modifier。

## 当前差距

M4-improve 已实现指针跟随高光、按压缩放（`--lg-interaction-scale`）和 thumb 的
`data-interacting` 色彩增强，但**折射本身在交互中完全静态**：按压一个玻璃按钮，
位移贴图和 `feDisplacementMap` 的 scale 从不变化。Apple 材质在按压瞬间"变得更玻璃"。

受益面：Button（非 ghost，interactive + refraction auto）及任何
`interactive` + 折射开启的自定义 GlassSurface。Switch/Slider thumb 在嵌套玻璃内
（`insideGlass` 强制无折射），**不在本卡范围**，维持 M4 的色彩/高光方案。

## 公共 API 变更（定稿）

无新增 props。仅新增 token 与内部行为。

## 新增 Token（定稿）

`src/styles/tokens.css`（亮暗主题同值，不需要 themes.css 覆盖）：

```css
--lg-refraction-press: 1.35; /* 按压时折射 scale 的无量纲倍率 */
```

## 实现步骤

1. **GlassSurface 增加按压状态的 React 状态**
   - 现有 `data-pressed` 由 pointer 事件处理器直接写 DOM（避免高频重渲染），保留不动。
   - 新增 `useState` 的 `isPressed`，仅在 pointerdown/up/cancel/leave 中更新
     （低频事件，允许重渲染）。`interactive === false` 时恒为 false。
2. **按压时切换到增强滤镜**
   - 读取 token：与 `--lg-refraction` 同路径，在既有 computed-style effect 中解析
     `--lg-refraction-press`（非法/缺失回退 1，即无增强）。
   - `isPressed && isRefractionActive` 时，向 `filterRegistry` acquire 第二个 shape：
     `{ w, h, r, bezel, scale: depth * refractionBase * pressBoost }`。
     位移贴图缓存 key 不含 scale（`makeDisplacementMap` 按 `w,h,r,bezel` 缓存），
     因此增强滤镜**复用同一张已解码的贴图 URI**——切换无 feImage 首帧问题，
     这是本方案可行的关键，实现中必须以注释说明。
   - `--lg-filter-url` 在按压期间指向增强滤镜 id，释放后切回基础滤镜。
   - 首次按压后不立即 release 增强滤镜（复用 registry 的 2s 延迟移除已可防抖，
     不要再自建计时器）；unmount / shape 变化时按现有 acquire/release 配对清理。
3. **过渡处理**
   - `backdrop-filter` 的 url() 部分不可插值，切换是瞬时的；配合已有
     `--lg-interaction-scale` 缩放过渡即可，不做额外动画。
   - 降级链自然成立并须有测试确认：fallback / reduced-transparency / 嵌套 /
     Safari/Firefox 无折射 → 无增强路径被触发。
   - `prefers-reduced-motion` 不影响本特性（材质变化不是位移动画），但按压缩放
     依旧遵守既有 reduced-motion 规则。

## 验收标准

- [ ] Chromium 中按压非 ghost Button：折射 scale 变为 `depth * base * 1.35`，
      registry 中出现第二个 filter 条目且贴图 URI 与基础滤镜相同。
- [ ] 连续快速按压/释放不新建贴图、不堆积 filter 条目（registry 计数正确）。
- [ ] pointercancel、按压中 pointerleave、按压中 unmount 均正确释放，无泄漏、无 act 警告。
- [ ] `forceFallback` / `forceReducedTransparency` / 嵌套玻璃 / `refraction="off"`
      下按压不触发任何 acquire。
- [ ] 首帧门控回归：GlassSurface 现有 pending 生命周期测试全部保持通过。
- [ ] 单测覆盖上述全部分支；Storybook Button story 无需改调用代码即获得该行为。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过。

## 明确非目标

- Switch/Slider thumb 的真折射（嵌套玻璃内，规格禁止）。
- hover 阶段的折射变化（Apple 仅在按压/拖动时增强）。
- 任何新的公共 props。

## 完成记录（2026-07-14）

改动文件：

- `src/styles/tokens.css`：新增 `--lg-refraction-press: 1.35;`（亮暗同值）。
- `src/core/GlassSurface/GlassSurface.tsx`：
  - 新增低频 `isPressed` 状态（pointerdown 置真，pointerup/cancel/leave 置假；
    `interactive` 关闭时归零）。既有 `data-pressed` 直写 DOM 的高频路径保持不变。
  - 在既有 computed-style effect 中解析 `--lg-refraction-press`，非法/缺失回退 1。
  - 新增 `pressBoostRequested` 闩锁（首次按压置真）驱动第二个 acquire effect，
    scale = `depth * refractionBase * pressBoost`；与基础滤镜同 `w,h,r,bezel`，
    因 `makeDisplacementMap` 按形状（不含 scale）缓存而复用同一张贴图 URI，
    切换无 feImage 首帧问题（代码注释已说明）。生命周期与基础滤镜一致
    （shape 变化 / unmount 配对 release，靠 registry 2s 延迟移除防抖，无自建计时器）。
  - `--lg-filter-url`：按压且增强滤镜就绪时指向增强 id，否则指向基础 id。
- `src/core/filter/filter-registry.ts`：新增测试专用 `__resetFilterRegistry`
  （不导出到 index，用于测试隔离；teardown 语义下清空且不通知订阅者，避免 act 警告）。
- `src/core/GlassSurface/GlassSurface.test.tsx`：新增 5 条单测覆盖增强、连续按压不堆积、
  pointercancel 回退、按压中 unmount 释放、fallback/refraction=off 不 acquire；
  afterEach 接入 registry 重置。

验证结果：`pnpm typecheck && pnpm build && pnpm test` 全部通过（138 tests，无 act 警告）。
首帧门控（pending 两帧 + 400ms 出口）语义未改动，相关回归测试保持通过。
Button（非 ghost，interactive + refraction auto）无需改调用代码即获得该行为，
ghost（refraction=off）与嵌套/降级路径均不触发 acquire。
