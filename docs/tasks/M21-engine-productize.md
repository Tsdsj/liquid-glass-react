---
status: todo
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

（实现后追加）
