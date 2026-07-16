---
status: todo
depends: [M26]
---

# M27 — 五阶段·演示沙箱隔离

> 五阶段总纲（M27–M32）：**打磨·验证·扩容**。先修文档站演示体验痛点，再装包审计，
> 刷新文档，最后继续扩容。串行 M27→M32。

本卡：修复用户直接反馈的痛点——**演示区里点组件会真实影响站点**（例:Breadcrumb 演示的
`href="#/"` 会真的把站点跳回首页,SideNav 演示同理)。演示应是沙箱:组件行为真实可感,
但不改变站点路由、不产生站点级副作用。

## 现状与根因

- `site/src/demos/navigation.demos.tsx` 中 Breadcrumb(`#/`、`#/components`)与
  SideNav(`#/overview` 等)的演示数据用了**真实可路由的 hash href**;站点是 hash 路由,
  点击即真实跳转。
- DemoBlock 舞台(`.site-demo__stage`)直接渲染 `demo.render()`,无任何拦截层。

## 方案定稿

1. **DemoBlock 舞台加沙箱拦截**(只动 `site/`,不改库组件):舞台容器加 `onClickCapture`——
   事件目标 `closest('a[href]')` 命中且 href 以 `#/` 开头(站点路由)时 `preventDefault()`,
   并以 toast 提示一次(i18n:「演示内导航已拦截 / Demo navigation is sandboxed」;
   同一舞台重复点击不重复轰炸,节流或首次提示即可)。
   - 只拦 anchor 的真实导航;组件自身的选中态/hover/焦点/键盘行为不受影响。
   - `renderPreview`(总览卡)已 `pointer-events:none`,无需处理。
2. **演示约定**(写入卡内与完成记录,供后续 demo 遵守):演示数据里的 href 仅作展示,
   允许保留真实形态(被沙箱拦截);演示不得调用 `window.location` 等站点级 API
   (toast 演示属预期反馈,豁免)。
3. **守卫测试**(防回归):遍历 `COMPONENT_DOCS` 渲染每条 demo,点击其中**静态渲染**的
   全部 `a[href^="#/"]`,断言 `window.location.hash` 不变(浮层内动态锚点不在本卡范围,
   如有逐个补)。另加一条聚焦断言:Breadcrumb 详情页演示点击「首页」链接后 hash 不变。

## 测试要求

- 沙箱单测:舞台内 anchor 点击被 preventDefault、hash 不变、toast 提示出现;
  非 anchor 交互(按钮/开关)不受影响。
- 全量 demo 守卫扫描测试(上述遍历)。
- 存量 site App.test 全绿(演示行为语义不变,只去掉真实跳转)。

## 验收标准

- [ ] 演示区点击 Breadcrumb/SideNav 等链接不再改变站点路由,有轻量提示。
- [ ] 守卫扫描测试就位,遍历全部 demo 的站内链接断言 hash 不变。
- [ ] 组件库源码零改动(本卡只动 `site/`)。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,`pnpm site:build` 通过,存量断言不削弱。

## 明确非目标

- iframe 级完全隔离(过重);修改 Breadcrumb/SideNav 组件 API;拦截浮层内动态渲染锚点的
  全自动扫描(静态渲染层面覆盖,动态个案按需补)。

## 完成记录

（实现后追加）
