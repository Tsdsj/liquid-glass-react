---
status: done
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

- **消费者环境**(`scripts/smoke-consumer.mjs` + `pnpm smoke:consumer`):build → pack →
  tarball 解包进 `mkdtemp` 临时项目的 `node_modules/@ttqtt/liquid-glass-react`;
  react/react-dom/@floating-ui/react/@types/react(-dom)/jsdom 以 **realpath 符号链接**自仓库
  pnpm store 注入(pnpm 布局保证传递依赖可解析)——**全程无网络**。临时项目自带独立 strict
  tsconfig,**无任何仓库 paths/alias**,类型只可能来自包内 `dist/index.d.ts`。产物用毕清理。
- **用例**(`scripts/consumer-cases/consumer.cases.tsx`,版本化):39 条「新手第一次用」姿势
  覆盖全部公共导出(35 组件 + GlassSurface/LiquidGlassConfig/createTheme/presetThemes/
  ProgressiveBlur/useAmbientFromImage/useForm/toast/Toaster);含受控 Input、外部 useForm、
  Table 泛型推断、主题作用域等真实形态;closed 浮层标记 `allowEmpty`。
- **三层验证**:① 类型层——仓库 tsc 对临时项目 strict 编译(顺带产出 JS 供后两层);
  ② SSR 层——裸 Node `renderToString` 全部用例,并断言 Button 服务端首帧
  `data-refraction="off"`(**首次在 dist 层面验证**);③ 运行层——jsdom + `createRoot` 渲染
  全部用例(桩对齐库自身 setup:ResizeObserver/matchMedia/OffscreenCanvas/rAF)+ 2 条真实
  交互冒烟(Button onClick、Accordion aria-expanded 切换)。另有 CSS 层:`./style.css`
  exports 可达 + 关键组件类名齐全。
- **故障注入验证**(防空转):向用例注入 `const x: number = 'str'` → 类型层准确报 TS2322、
  脚本退出非 0;还原后全绿。三层非摆设。
- **审计发现与处置**:
  - 🐛 **修复**:`toast.*()` 在无 `<Toaster/>` 挂载时**静默丢失**且无提示——新手极难排查。
    回库加 DEV 一次性 `console.warn`(仿 GlassSurface string-radius 先例;`resetToastStore`
    复位标志)。RED→GREEN 2 测试;店内 hostless 套件与 demo-sandbox 扫描按「预期警告」静音。
  - 📝 记 M29 指南 tips(合理设计,但值得写明):内联自定义 `--lg-*` 变量需
    `['--lg-x' as string]` 断言(React CSSProperties 通病,主题场景用 createTheme 规避);
    多数控件 `aria-label` 可选——裸用能编译能渲染但无可访问名,使用者需自给;Form 布尔控件需
    `valuePropName/trigger`;Modal/Drawer 仅受控(open 必填)是刻意设计。
  - ✅ 顺畅项:包内 d.ts strict 零障碍;Table 泛型自 `data` 推断无需显式标注、`rowKey` keyof
    约束生效;createTheme 返回值可直接 spread;默认值(size/variant/duration 等)裸用合理;
    className/style 透传正常(runtime 渲染层佐证)。
- 验证:`pnpm typecheck` ✓、`pnpm test` **545/545 绿**(+2 toast 警告测试)、
  `pnpm smoke:consumer` ✓(39×3 层 + 2 交互 + CSS)、`pnpm smoke:pack` ✓(不回归,build 于脚本内执行)。
- **无破坏性变更**待确认项:无(唯一修复为纯新增 DEV 警告)。
