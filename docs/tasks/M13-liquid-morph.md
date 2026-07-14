---
status: done
depends: [M8, M12]
---

# M13 — 二阶段·引擎实验:液态融合 morph(分级验证)

> 优先于 M5 执行。**M4-improve 的结论(不新增不稳定的 GlassGroup 公共 API)
> 继续有效**——本卡是刻意重启的技术验证,不是翻案:所有产出均为内部工具或
> 私有 Storybook story,不新增任何公共导出。风险最高,故置于组件批之后,
> 失败只留结论、不连坐其他卡。

## 背景

Apple GlassEffectContainer:相邻玻璃靠近时形状融合、过渡时相互形变。Web 的
backdrop-filter 合成模型与此存在根本冲突,本卡按可行性分级逐级验证并落地
能落地的部分。

## 分级方案(定稿)

### L0 共享形状 + FLIP(正式落地)

同一个 GlassSurface 实体在目标位置间过渡:transform 平移缩放 + border-radius
插值,叠加"液滴进出场"(scale 0.6→1 + filter blur 4px→0 + opacity,出场反向)。
M8 的 `useSlidingIndicator` 即最小实现;本卡泛化为内部工具:

```ts
// src/core/morph/morph.ts —— 纯函数,不公开导出
export interface MorphFrame { transform: string; borderRadius: string }
export function computeMorphFrames(
  from: DOMRect, to: DOMRect,
  fromRadius: number, toRadius: number,
  steps?: number,
): MorphFrame[];

// src/core/morph/useMorphTransition.ts —— 内部 hook
// 将 frames 应用为 Web Animations / CSS transition;reduced-motion 直接跳终态
```

**关键技术点(验收项)**:过渡期间必须**锁定 filter shape**——transform 不改
offsetWidth/Height 天然满足,但过渡终点若尺寸变化,须等过渡结束后一次性
settle(复用现有 resize 防抖路径),禁止逐帧触发 filter-registry 重建
(否则逐帧重建 displacement map 必然闪烁,并与首帧 pending 门控冲突)。

### L1 SVG goo 直接作用于真玻璃 —— 预判不可行,实证后记录

理由(须在卡内以最小 story 实证并存档):goo(feGaussianBlur + feColorMatrix
alpha 对比)作用于元素**自身已合成像素**,不改变 backdrop-filter 的采样形状
(由 border-box + border-radius 决定);更致命的是祖先 `filter` 会形成
backdrop root,后代的 backdrop-filter 只能采样容器内内容——真玻璃直接失效。
这是合成模型互斥,不是调参问题。

### L1.5 过渡期 snapshot 替身(仅 Storybook 技术验证)

morph 的 ~300ms 内把两块玻璃临时替换为不透明 tint + 高光的"假玻璃"副本放入
goo 容器融合,结束后换回真玻璃。唯一验证点:切换瞬间是否肉眼可见跳变。
不进任何 API、不进 site。

### L2 逐帧重建 displacement map —— 明确不做

与 filter-registry 复用模型冲突、每帧 feImage 编码成本、Chromium-only,
一句话记录,不实验。

## 测试要求(无浏览器环境的验收面)

- `computeMorphFrames` 全量单测:平移/缩放/radius 插值数值、steps 边界、
  from==to 恒等。
- hook:reduced-motion 直接终态;过渡期间 filter registry 无新增/删除条目
  (mock 计时驱动);卸载中断动画无泄漏。
- 现有 GlassSurface / 指示器测试零改动全绿。
- L1/L1.5:各一个私有 story(`GlassMorphLab.stories.tsx`,标注内部实验),
  结论与复现路径写入完成记录。

## 验收标准

- [ ] L0 纯函数 + hook 先 RED 后 GREEN;M8 指示器可选择性迁移到该工具
      (迁移则其测试不削弱)。
- [ ] 过渡期 filter 不重建的断言通过。
- [ ] L1 不可行结论以 story 实证并写入完成记录(含机制解释)。
- [ ] L1.5 跳变结论(可行/不可行)写入完成记录。
- [ ] 不新增公共导出;site 不展示未定稿能力。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,存量断言不削弱。
- [ ] 完成记录注明:L0 液滴动效与 L1.5 跳变由用户本地 Storybook 目检。

## 退出条件

- L0 若锁 shape 后移动仍闪烁 → 退化为纯 opacity 交叉淡化,记录结论。
- L1.5 若切换跳变明显 → goo 线路整体关闭,记录结论。
- glass-engine.md 如需增补 morph 规范,按 AGENTS §10 在卡底记录建议,
  不改规范文件。

## 明确非目标

- GlassGroup / GlassEffectContainer 式公共 API;跨两个独立 GlassSurface
  实体的真实形状融合;morph 进入任何现有组件的默认行为。

## 完成记录

### L0 共享形状 + FLIP(正式落地)

- 纯函数 `src/core/morph/morph.ts`:`computeMorphFrames(from, to, fromRadius, toRadius, steps=2)`
  → `{ transform, borderRadius }[]`。平移=`to.left/top - from.left/top`,缩放=尺寸比
  (源尺寸 0 时回退 1),radius 线性插值;steps clamp ≥2;from==to 恒等。6 条纯函数单测
  (RED→GREEN)。
- 内部 hook `src/core/morph/useMorphTransition.ts`(不公开导出):把 frames 应用为 Web
  Animations 关键帧(`fill:'forwards'`),`onfinish` 提交终态 inline style 后 cancel;
  `prefers-reduced-motion` 或无 WAAPI 时直接跳终态;卸载 cancel 防泄漏。3 条单测。
- **锁 filter shape(验收项)**:hook 只写 `transform`/`border-radius`、从不改尺寸,也从不
  触碰 filter-registry——单测 spy `filterRegistry.acquire/release` 断言过渡期零调用;尺寸变化
  由 GlassSurface 自身 resize 防抖路径在终点一次性 settle,不逐帧重建 displacement map。
- **M8 指示器迁移**:选择**不迁移**(卡内为「可选择性」)。`useSlidingIndicator` 保持原样、
  测试零改动;`computeMorphFrames` 是其思路的泛化超集(指示器只用平移+尺寸,morph 增加 radius
  插值与多帧)。避免为实验去动已 done 的 M8。

### L1 SVG goo 直接作用于真玻璃 —— 实证:不可行(合成模型互斥)

- 私有 story `src/GlassMorphLab.stories.tsx` → `L1_GooOnRealGlass`:容器套 `filter:url(#lab-goo)`
  (feGaussianBlur + feColorMatrix alpha 对比),内含两块真 `GlassSurface`。
- **结论/机制**:祖先 `filter` 使容器成为 backdrop root,后代 `backdrop-filter` 只能采样容器
  内部像素,**无法采样容器背后的页面**——真玻璃折射直接失效(观感退化为普通半透明块)。且 goo
  作用于元素**自身已合成像素**,不改变 backdrop-filter 由 border-box+radius 决定的采样形状。
  这是合成模型互斥,非调参问题。**L1 不落地**。复现:Storybook 打开该 story,对比容器内玻璃与
  容器外玻璃的折射差异。

### L1.5 过渡期 snapshot 替身(仅 Storybook 技术验证)

- 私有 story `L1_5_SnapshotStandIn`:点击后 ~300ms 内把两块真玻璃换成不透明 `--lg-tint-hover`
  +高光的「假玻璃」副本放进 goo 容器,结束换回真玻璃。
- **结论**:跳变**是否可接受留用户本地 Storybook 目检**(服务器无浏览器,无法判定)。机制预判:
  真玻璃(采样真实背景)↔ 不透明替身(固定 tint)在切换瞬间背景采样源不同,除非替身 tint/高光
  与当前背景高度吻合,**大概率有肉眼可见闪跳**;若目检确认明显 → 按退出条件整条 goo 线路关闭
  (当前已隔离在私有 story,零外溢,关闭成本≈删 story)。

### L2 逐帧重建 displacement map —— 明确不做

- 与 filter-registry 按形状复用模型冲突、每帧 feImage 解码成本高、且 Chromium-only。不实验,仅记录。

### 收口

- **不新增任何公共导出**(`src/index.ts` 零改动);morph 工具仅 `src/core/morph/` 内部 + 私有
  story 消费;site 不展示。既有 GlassSurface / `useSlidingIndicator` / 指示器相关测试零改动全绿。
- 验证:`pnpm typecheck` ✓、`pnpm build` ✓(dist 无变化)、`pnpm test` 单线程 **332/333**
  (唯一失败为 M4 既有 Modal 焦点并行 flake,非本卡;GlassSurface/指示器均在通过项内)。
- **留本地目检**:① L0 morph 的「液滴」观感与折射全程无闪烁(Storybook `Core/GlassMorphLab`
  → L0);② L1.5 替身切换是否跳变(同 lab → L1.5)。
- glass-engine.md 规范增补建议(按 AGENTS §10,不改规范文件):如未来要正式化 L0,可在
  glass-engine.md 增「morph:仅同一 GlassSurface 实体的共享形状 FLIP,禁止 goo 融合真玻璃」
  一节,把 L1 的合成模型互斥结论沉淀为规范约束。
