---
status: done
depends: [M20]
---

# M21 — 四阶段·实验特性产品化

> 四阶段引擎线。把二阶段 M12–M14 做的三个**内部 opt-in 实验特性**转正为**公共 API**:
> ProgressiveBlur（渐进模糊）、液态 morph（融合过渡）、环境取样（ambient）。串行 M19→M26。

背景:M12–M14 的实现已在 `src/core/{progressive-blur,morph,scroll-edge,hooks,utils}`,当时
**刻意不导出、不改默认行为**。本卡把成熟部分公开、补文档与示例,**仍不改任何现有组件默认行为**。

## 执行前提

- 遵守 `AGENTS.md`:公共 API 变更须先定稿(本卡即定稿);玻璃质感经 `GlassSurface`;
  无新运行时依赖。
- **先审阅 M12/M13/M14 完成记录**,确认各特性的分级结论(哪些达标可公开、哪些仅内部保留)。
  达标者转正,未达标者在本卡记录理由、保持内部,不强行公开。
- 每个转正特性:命名/props 二次定稿(内部 API 未必适合直接公开),SSR 安全(顶层无 window)、
  reduced-motion / 降级路径完备。

## 拟转正清单（以 M12–M14 完成记录为准,逐个确认）

| 来源 | 特性 | 公开形态(草案,实现时定稿) |
|---|---|---|
| M12 | ProgressiveBlur | `<ProgressiveBlur>` 组件(方向/强度 props) + 类型 |
| M13 | 液态 morph | `useMorphTransition` hook 或 `<Morph>` 包裹器(择一,按稳定度定) |
| M14 | 环境取样 | `useAmbientFromImage` / `ambient` 工具(返回取样色,喂给 token) |

- 未达发布标准的特性:**不导出**,在完成记录写明「保持内部,原因 X」。宁缺毋滥。

## 实现步骤

1. 通读 `src/core/progressive-blur`、`src/core/morph`、`src/core/hooks/useAmbientFromImage.ts`、
   `src/core/utils/ambient-color.ts` + M12–M14 完成记录,列出各特性成熟度与公开决定。
2. 对决定转正的:整理公共 props/返回类型、补 SSR 守卫核对、补 reduced-motion/降级测试。
3. `src/index.ts` 导出转正的组件/hook/类型。
4. 文档:`site` 新增「进阶引擎 / Advanced」页,逐特性演示 + API 表 + 何时用/降级说明;中英双语。
5. 全量验证 + 提交(一特性一提交)。

## 测试要求

- 转正特性:公共 API 冒烟(渲染/调用不崩)、SSR `renderToString` 不崩且降级、reduced-motion 分支。
- 未转正特性保持内部,不出现在 `src/index.ts`;现有内部使用点行为不变(存量断言不削弱)。
- site App.test 增进阶页可渲染断言。

## 验收标准

- [ ] 逐特性给出「转正/保持内部」决定并记录理由;转正者从 `src/index.ts` 导出且 API 已定稿。
- [ ] 转正特性 SSR 安全、reduced-motion/降级完备,有对应测试。
- [ ] 进阶引擎文档页含演示 + API 表 + 使用/降级说明,中英双语。
- [ ] 任何现有组件默认行为**不变**(这些特性此前即 opt-in)。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,存量断言不削弱。
- [ ] 完成记录注明:折射/融合/取样的实际观感留本地目检。

## 明确非目标

- 重写 M12–M14 的引擎算法(只做公开化 + 文档,必要的 API 整形除外);把实验特性设为
  组件默认;为未达标特性强行凑公开 API。

## 完成记录

**逐特性成熟度判定(审阅 M12–M14 完成记录 + 源码后):**

| 来源 | 特性 | 决定 | 理由 |
|---|---|---|---|
| M12 | ProgressiveBlur | **转正** | 已是自洽组件(direction/size/maxBlur/layers/className),reduced-transparency/forced-colors 降级完备,SSR 安全,纯函数 `computeBlurLayers` 有测试,站点已消费 |
| M14 | 环境取样 `useAmbientFromImage` | **转正** | SSR 守卫(window/document)、CORS 污染/解码失败/无 2D context 均静默回退 null,纯函数 `computeAmbientColor` 有测试 |
| M13 | 液态 morph L0 | **保持内部** | L0(`useMorphTransition`/`computeMorphFrames`)correctness 达标,但公共**人机工程太低**——使用者需自行测量 rect → 计算帧 → play,缺可用 DX。给它一个体面的公共面需新设计 `<Morph>` 自动测量包裹器,超出「产品化既有」范围且触碰 AGENTS「不做设计发挥」。L1/L1.5/L2 在 M13 已实证不可行(合成模型互斥)。故不导出。 |

**转正实现:**
- `src/index.ts` 新增导出:`ProgressiveBlur` + `ProgressiveBlurProps`;`useAmbientFromImage` +
  `AmbientSampleOptions`(类型来自 `core/utils/ambient-color`)。**最小公共面**——不导出内部
  纯函数 `computeBlurLayers`/`computeAmbientColor`/`BlurLayer`(避免过度暴露)。
- 组件源码**零改动**:两者本就写成干净的组件/hook,只是此前未挂到公共 barrel。
  `progressive-blur.css` 早已被 `styles/index.css` @import,转正即随包发出;`dist/index.d.ts`
  已含四个新公共类型/值(构建校验)。
- **站点吃狗粮**:HomePage hero 的 `ProgressiveBlur`、AmbientDemo 的 `useAmbientFromImage`
  从 `../../../src/...` 内部路径改为 `@ttqtt/liquid-glass-react` 公共包导入(证明公共 API 端到端可用)。

**测试/文档:**
- SSR 冒烟:`ssr.smoke.test.tsx` import 从公共 barrel,CASES 增 `ProgressiveBlur`;新增
  `useAmbientFromImage` 在 Node 环境降级为 null 的断言(RED→GREEN:先因未导出 undefined 失败)。
- ProgressiveBlur 是**装饰元素**(`aria-hidden="true"`),不属 a11y 冒烟「可达控件/内容面」范畴,
  故未纳入 a11y.smoke——由 SSR 冒烟覆盖(诚实判断,非遗漏)。
- 文档:GuidePage 新增「进阶引擎 / Advanced」章节(两 API 用法 + 何时用 + 降级说明,自动进导航);
  既有 AmbientDemo 仍作实时演示。App.test 增 `guide-advanced` 含 `ProgressiveBlur` 断言。
- 验证:`pnpm typecheck` ✓、`pnpm build` ✓(dist 首次因新增导出而变化,类型含四新项)、
  `pnpm test` **412/412 绿**(较 M20 的 410 +2)、`pnpm site:build` ✓。
- **现有默认行为不变**:两特性此前即 opt-in,转正只加导出、未改任何组件默认。morph 保持内部,
  既有 GlassSurface/指示器测试零改动。
- **留本地目检**(服务器无浏览器):ProgressiveBlur 3/5/8 层带状伪影与流畅度、环境取样的取色可信度
  (edge vs average),沿用 M12/M14 的退出条件判据。
