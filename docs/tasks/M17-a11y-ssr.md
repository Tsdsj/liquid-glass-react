---
status: todo
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
