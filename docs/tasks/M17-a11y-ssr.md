---
status: done
depends: [M16]
---

# M17 — 三阶段·无障碍与 SSR 校验

> 三阶段第三卡。用自动化手段给"人人可用"和"服务端安全"两项承诺兜底。

## 执行前提

- 遵守 `AGENTS.md`。允许新增 **devDependency**(本卡明确:`axe-core`;SSR 用已有
  `react-dom/server`,无需新增)。不改组件公共 API 与默认行为。

## 步骤

### 1. 自动化无障碍冒烟(axe-core in jsdom)

- 新增 devDep `axe-core`。测试文件 `src/a11y/a11y.smoke.test.tsx`:
  逐个渲染代表性组件的默认态(Button/Checkbox/Radio/Switch/Slider/Input/Select/Tabs/
  Segmented/Pagination/Breadcrumb/SideNav/Card/Tag/Badge/Progress 等,浮层类渲染其打开态或触发器),
  跑 `axe.run(container)`,断言无 `critical`/`serious` 违规。
- jsdom 无布局/对比度能力:关闭 color-contrast 等依赖真实渲染的规则(标注原因),聚焦
  role/name/aria/label 类可在 jsdom 判定的规则。目的是回归护栏,不是完备审计。
- 发现的真实违规 → 在对应组件修正(仅 a11y 属性层面,不改结构/API);修不了的规则显式豁免并注释。

### 2. SSR 冒烟(`react-dom/server`)

- 测试文件 `src/ssr/ssr.smoke.test.tsx`:对每个导出组件用 `renderToString` 渲染默认态,
  断言不抛错(浮层默认关闭,不渲染 portal)。
- 断言服务端 `useGlassSupport` 走降级(refraction=false):mock/无 `window` 场景下不崩;
  确认无模块顶层直接访问 `window`/`document`(`GlassFilterDefs`/`toast-store`/`useGlassSupport`
  等的惰性化已满足,补断言固化)。
- 可用 `vi` 在单测内构造 SSR 场景;不需真起 Node SSR 服务。

### 3. Next.js App Router 使用指南

- 在文档站 Guide 页新增一节(中英)或新增 `docs/nextjs.md`:说明
  ① 在 root `layout` 引 `@ttqtt/liquid-glass-react/style.css`;
  ② 交互组件所在文件加 `'use client'`(命令式 `toast`/浮层需客户端);
  ③ 首帧走降级、`useEffect` 后升级折射,无 hydration mismatch(引用引擎既定行为)。
- 由 SSR 冒烟测试作为"服务端安全"的机器验证;指南作为使用者说明。

## 测试要求

- a11y 冒烟:代表性组件无 critical/serious 违规;豁免规则有注释。
- SSR 冒烟:各组件 `renderToString` 不抛;服务端降级断言通过。
- 全量 `pnpm test` 绿;存量断言不削弱。

## 验收标准

- [ ] `axe-core` devDep + a11y 冒烟测试就位并全绿(违规已修或显式豁免)。
- [ ] SSR 冒烟测试就位并全绿(不崩 + 服务端降级 + 无顶层 window 访问)。
- [ ] Next.js App Router 指南(中英)落地,SSR 测试兜底其正确性。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,存量断言不削弱。
- [ ] 完成记录注明:关闭了哪些依赖真实渲染的 axe 规则及原因。

## 明确非目标

- 完备的人工无障碍审计;真实 Next.js 示例 app 工程(仅指南 + SSR 冒烟);视觉/对比度回归;
  CI(M18)。

## 完成记录

- **a11y 冒烟** `src/a11y/a11y.smoke.test.tsx`:新增 devDep `axe-core@4.12.1`;`it.each`
  逐个渲染 17 个代表性组件默认态(Button/Checkbox/RadioGroup/Switch/Slider/Input/Select/
  Tabs/Segmented/Pagination/Breadcrumb/SideNav/Card/Tag/Badge/Progress/Avatar),跑
  `axe.run`,按 `impact` 只在 `critical`/`serious` 失败。**关闭的规则**:仅 `color-contrast`
  ——它依赖真实合成后的像素颜色,jsdom 无渲染/合成能力无法判定(已在文件注释说明);其余
  role/name/aria/label 类规则照常判定。`region`/landmark 属 `moderate`,不在门禁范围内,
  按设计不 gate。实测:17/17 无 critical/serious 违规,未改任何组件结构或 API。
- **SSR 冒烟** `src/ssr/ssr.smoke.test.tsx`:文件头 `// @vitest-environment node`,在
  **无 `window`/`document`** 的 Node 环境跑(首个用例即断言两者 `undefined`,为整套赋予意义)。
  `it.each` 对 28 个导出用 `renderToString` 断言不抛(含 GlassSurface/所有组件/闭合的 Modal/
  Drawer/Menu/Popover/Tooltip/Toaster/LiquidGlassConfig);另断言 ① 服务端
  `detectGlassSupport()===false` 且 Button 产出含 `data-refraction="off"`(降级、首帧与客户端
  一致、无 hydration mismatch);② 闭合 Modal/Drawer 不渲染面板内容(无 portal)。为让共享
  `src/test/setup.ts` 在 Node 环境可加载,把其中 `window.matchMedia`/`window.scrollTo` 两处
  DOM mock 用 `typeof window !== 'undefined'` 包裹(纯加性 guard,jsdom 套件不受影响)。
- **Next.js 指南**:文档站 Guide 页新增 `nextjs` 一节(中英,经 `SECTIONS` 自动进侧栏与正文):
  ① 根 `app/layout` 引一次 `style.css`;② 交互/命令式 API 文件加 `'use client'`;③ 首帧毛玻璃
  降级、挂载后升级折射、无 hydration 不匹配。其正确性由上面的 SSR 冒烟机器兜底。
- 验证:`pnpm typecheck` ✓、`pnpm build` ✓、`pnpm test`(默认并行)**393/393 绿**、
  `pnpm site:build` ✓。存量断言未削弱。
