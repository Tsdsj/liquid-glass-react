---
status: done
depends: [M28]
---

# M29 — 五阶段·站点使用文档刷新

> 五阶段文档卡。README / 指南页 / CHANGELOG 已落后于四阶段成果(主题 API、进阶引擎、
> Form/Table/DatePicker、五个轻型组件、playground/搜索),且组件计数各处不一。
> 本卡一次性对齐,并把 M28 审计发现的用法要点沉淀进指南。串行 M27→M32。

## 步骤

### 1. 组件计数核准（单一事实源）

- 以 `src/index.ts` 公共组件导出 + `COMPONENT_DOCS` 为准核出唯一计数;README/首页文案/
  指南各处统一(当前 README 写 35,需核实)。能派生的地方派生,不能派生的地方在完成记录
  注明「计数出处」,后续新增组件卡负责同步。

### 2. README 刷新

- 亮点/组件面描述补四阶段成果:主题 API(createTheme/presetThemes)、进阶引擎
  (ProgressiveBlur/环境取样)、表单与数据(Form/Table/DatePicker)一句话级提及。
- 「三行上手」「主题」「SSR/Next.js」章节核对仍准确;文档站链接与徽章不动(M18 已就位)。

### 3. 指南页(GuidePage)刷新

- 快速开始/主题/进阶引擎章节核对与四阶段实际 API 一致。
- 新增「常见用法要点 / Tips」小节:M28 审计发现的真实使用坑(例:Form 布尔控件需
  `valuePropName/trigger`、DatePicker locale 取 Config、Table rowKey 必填的原因等,
  以审计结论为准)。中英双语。

### 4. CHANGELOG

- 增「未发布 / Unreleased」小节,归纳 M19–M28 的新增(主题/动效/引擎转正/新组件/文档站/
  审计修复),为下一次发版(v0.2.0)做准备;不打 tag(发版由用户触发)。

## 测试要求

- 计数断言:App.test 或独立测试把站点展示的组件计数与 `COMPONENT_DOCS.length` 绑定
  (若文案含数字);README 无自动测试,人工核对并在完成记录列出改动点。
- `pnpm typecheck && pnpm build && pnpm test`、`pnpm site:build` 全绿。

## 验收标准

- [ ] README/首页/指南各处组件计数一致且与实际导出相符。
- [ ] README 与指南覆盖四阶段全部面向用户的新能力;指南新增审计要点小节,中英双语。
- [ ] CHANGELOG 有 Unreleased 小节,内容与 M19–M28 实际产出一致。
- [ ] 全量验证通过,存量断言不削弱。

## 明确非目标

- 发版/打 tag(用户触发);文档站结构重构;英文 README 全文翻译(保持现有中主英辅基调)。

## 完成记录

- **计数核准**:唯一事实源=站点目录 `COMPONENT_DOCS`(35 条,站点文案本就 `length` 派生)。
  README 的「35 个组件」经核已准(另一 agent 先行修正);CHANGELOG [0.1.0] 的「27 个组件」是
  历史版本记录,**不改**。新增**防漂移测试** `site/src/docs-consistency.test.ts`:README 计数
  正则提取 === `COMPONENT_DOCS.length`、CHANGELOG Unreleased 含 `→ 35`——后续组件卡加组件时
  该测试会强制同步文档。
- **README 刷新**:亮点新增「成套的组件面」(Form/Table/DatePicker/命令面板 + 两件进阶引擎)、
  「随心换装」补 createTheme/presetThemes;主题章节增 JS 侧 `createTheme` + `LiquidGlassConfig
  theme` 代码示例与 token 参考表指路。安装/三行上手/浏览器支持/SSR 章节核对无误未动。
- **指南页**:新增「常见用法要点 / Usage tips」章节(自动进页内导航),沉淀 M28 审计五要点——
  ①toast 需先挂 `<Toaster/>`(DEV 会警告)②Form 布尔控件 `valuePropName/trigger`
  ③Modal/Drawer 纯受控 ④无文本控件自备 aria-label ⑤内联 `--lg-*` 需断言、主题用 createTheme;
  附对照代码块,中英双语。
- **CHANGELOG**:新增「未发布 / Unreleased」——主题 API、进阶引擎转正、8 个新组件(27→35)、
  交互动效、文档站(playground/搜索/浅色可读性/演示沙箱)、toast 警告修复、smoke:consumer,
  为 v0.2.0 发版备好;不打 tag(用户触发)。
- **测试**:docs-consistency 2 条 + App.test 指南 tips 断言 1 条。
- 验证:`pnpm typecheck` ✓、`pnpm build` ✓、`pnpm test` **547/547 绿**(+2)、`pnpm site:build` ✓。
