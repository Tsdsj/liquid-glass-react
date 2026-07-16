---
status: todo
depends: [M27]
---

# M28 — 五阶段·消费者装包审计

> 五阶段核心验证卡。以**真实使用者视角**验证:`pnpm add @ttqtt/liquid-glass-react` 之后,
> 每个组件是否**导入即好用**——默认值合理、类型提示友好、CSS 生效、SSR 安全。
> 发现的问题**回库修复**;流程沉淀为可重跑脚本。串行 M27→M32。

与 M15 `smoke:pack` 的区别:smoke:pack 验「装得上、解析对」;本卡验「用起来顺不顺」。

## 步骤

### 1. 消费者环境搭建（`scripts/smoke-consumer.mjs` + `pnpm smoke:consumer`）

- `pnpm build` → `pnpm pack` 产出 tarball → 临时目录生成最小消费者项目:
  `package.json` 依赖 tarball(`file:`),react/react-dom 复用仓库 `node_modules`
  (`file:` 链接或 pnpm overrides,**避免依赖网络**;确需网络时在脚本与完成记录注明)。
- 消费者项目含独立 `tsconfig`(strict,不含本仓库 paths 映射——**必须走包内 d.ts**)。

### 2. 逐组件最小用例审计

对每个公共导出组件写「新手第一次用」的最小 `.tsx` 用例,三层验证:

- **类型层**:消费者 tsc 严格模式编译全部用例——验证包内 d.ts 可用、泛型(Table/Form)推断顺、
  必填 props 是否过多(什么都不传能不能跑/该不该跑)。
- **SSR 层**:Node 环境 `renderToString` 全部用例(从**包产物**导入,非源码)。
- **运行层**:jsdom 渲染 + 一两个关键交互冒烟(从包产物导入);`style.css` 从包内引入后
  关键类名存在。

审计清单(每组件记录):默认值是否合理、不传可选 props 的观感、受控/非受控是否都顺、
`className`/`style` 透传、ref 转发、aria 必填项是否成为使用负担。

### 3. 问题回库修复

- 审计发现的问题在**本仓库**修复(遵守既有约定:API 变更需在本卡追记定稿;倾向宽松化/
  补默认值等**非破坏**修复,破坏性变更单独列出待用户确认)。
- 修复后重跑 `smoke:consumer` 直至全绿。

## 测试要求

- `pnpm smoke:consumer` 本机跑通(类型/SSR/运行三层全绿),失败退出码非 0,产物清理。
- 回库修复各自带回归测试(RED→GREEN);全量套件仍绿。

## 验收标准

- [ ] `smoke:consumer` 脚本就位、可重复运行,覆盖全部公共组件的最小用例三层验证。
- [ ] 审计清单逐组件结论写入完成记录;发现的问题已修复或明确列为「待确认破坏性变更」。
- [ ] 消费者项目不依赖仓库源码路径(真实走包产物 + 包内 d.ts)。
- [ ] `pnpm typecheck && pnpm build && pnpm test && pnpm smoke:pack` 通过,存量断言不削弱。

## 明确非目标

- 真实 npm registry 发布验证(仍走本地 tarball);浏览器端到端(无浏览器环境);
  真实 Next.js 完整工程(renderToString 覆盖 SSR 面);性能基准。

## 完成记录

（实现后追加）
