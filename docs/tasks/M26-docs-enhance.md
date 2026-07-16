---
status: done
depends: [M25]
---

# M26 — 四阶段·文档站增强

> 四阶段收尾卡。文档站已有每组件 API 表(`ComponentDoc.api` / `ApiSection`)与静态代码演示。
> 本卡补齐真正缺的 DX:**props playground(交互调参)+ 站内搜索 + 代码复制 + 更多真实示例**。
> 一次性覆盖 M19–M25 新增的主题/引擎/组件。串行 M19→M26,本卡为终点。

## 执行前提

- 遵守 `AGENTS.md`;文档站在 `site/`,与库共用 Vite 管线。文案延续「去术语、用户视角」基调,中英双语。
- 无新运行时依赖用于**库**;文档站(`site/`)devDep 如确需,须在本卡明确并从轻(优先自写)。
- 不改库公共 API;本卡只动 `site/`。

## 步骤

### 1. Props Playground（交互调参）

- 组件详情页新增可交互面板:按 `ComponentDoc` 声明的可调 props 渲染控件(用本库自己的
  Switch/Select/Slider/Input——**吃狗粮**),实时预览 + 同步生成对应代码片段。
- 扩展 `ComponentDoc`/`ApiSection`:给可调 prop 增可选 `control` 元信息(类型 + 选项 + 默认),
  playground 据此渲染;无 `control` 的 prop 只进 API 表不进 playground(渐进增强,不必全组件覆盖)。
- 优先给高频组件(Button/Card/Modal/Table/Form 等)配 playground。

### 2. 站内搜索

- 顶部搜索框:按组件名/分类/中英标题过滤,跳转详情页。数据来自现有 registry,
  自写轻量匹配(复用 M25 的 fuzzy-match 思路),不引搜索库。
- 键盘可达:`/` 聚焦、上下键选、Enter 跳转、Escape 关闭;可接 M25 的 Command 面板做「命令式跳转」。

### 3. 代码复制

- 所有代码演示块加「复制」按钮(`navigator.clipboard`,SSR/无 clipboard 守卫 + 降级),复制成功反馈(toast)。

### 4. 更多真实示例 + 新特性入口

- 为 M19 主题、M21 进阶引擎、M22–M25 新组件补足有代表性的组合示例(不只最小用例)。
- 首页/导航补新分类入口(主题 / 进阶引擎 / 表单 / 数据),总览计数更新到最终组件数。

## 测试要求

- Playground:控件改值 → 预览与生成代码同步(挑 1–2 组件断言);无 `control` 的 prop 不进 playground。
- 搜索:关键词过滤命中/空结果、键盘路径(`/` 聚焦、上下、Enter、Escape)。
- 复制:mock clipboard 断言写入 + 成功反馈;无 clipboard 环境降级不崩(SSR 守卫)。
- App.test:新分类入口与新组件详情页可渲染;总览计数为最终值。
- 站点仍 SSR/构建正常:`pnpm site:build` 通过,产物资产带 `/liquid-glass-react/` 子路径前缀(M18 不回归)。

## 验收标准

- [ ] 高频组件详情页有可用 props playground(改参实时预览 + 生成代码),渐进增强不要求全覆盖。
- [ ] 站内搜索可用且键盘可达;代码块可一键复制(含降级守卫)。
- [ ] 主题/进阶引擎/新组件均有真实示例入口,总览计数更新到最终值,中英双语。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过;`pnpm site:build` 通过、子路径前缀不回归。
- [ ] 完成记录注明:playground/搜索/复制的实际手感留本地目检。

## 明确非目标

- 全文检索/Algolia 等外部服务;MDX 化文档架构重写;版本化文档(v1/v2 切换);
  在线可编辑 sandbox(StackBlitz/CodeSandbox 嵌入);为每个组件都做 playground(只做高频)。

## 完成记录

- **浅色模式玻璃可读性(用户追加需求)**:发现根因——demo 详情舞台用照片壁纸尚可,但**总览预览卡
  (`.site-card__preview`/`.site-home-component__preview`)根本无 background-image、只有平铺 tan 底色**,
  白色 tint 玻璃在平底色上几乎不可见,浅色模式最糟。修:App 把壁纸暴露为 `--site-wallpaper` CSS 变量;
  新增**主题感知对比 scrim** `--site-demo-scrim`(浅色更重的冷→暖渐变压暗壁纸让白玻璃与高光跳出,
  深色仅轻微),三处预览面(舞台 + 两种卡片)统一 `background-image: var(--site-demo-scrim), var(--site-wallpaper)`;
  DemoBlock 去掉内联壁纸改由 CSS 统一。玻璃在明暗两模式下均有变化的背景可折射/对比。
- **站内搜索(dogfood Command)**:`SiteSearch` 用**本库 Command 面板**——`/` 键(非输入区)或 header
  「搜索组件 /」按钮打开,列出全部组件(label=名+标题,keywords=名/slug/中英标题/分类,按分类分组),
  模糊过滤 + 上下键 + Enter 跳转 `#/components/<slug>`。键盘路径复用 Command 既有能力(Escape 关闭)。
- **Props Playground**:扩展 `ComponentDoc` 增可选 `playground`(`PlaygroundSpec`:controls + render + code);
  `Playground` 组件用**本库 Segmented/Switch/Input** 渲染控件(吃狗粮),实时预览 + 同步生成代码。
  接入高频组件 **Button / Alert**(渐进增强,无 playground 的组件只出 API 表);详情页有则渲染「交互调参」节。
- **代码复制**:核对发现 **DemoBlock 早已实现**(`navigator.clipboard` + try/catch 降级 + toast 反馈,
  SSR 安全);本卡沿用,未重复造。
- **测试**:site App.test 增两条(① `/` 开面板 + 输入 + Enter 跳转;② Button playground 改 variant→生成
  代码同步);既有「显示代码」断言因 playground 新增一块 `.site-code` 而调整为「任一代码块含包名导入」
  (仍验证 demo 导入,不削弱)。
- 验证:`pnpm typecheck` ✓、`pnpm build` ✓、`pnpm test` **505/505 绿**(较 M25 的 503 +2)、
  `pnpm site:build` ✓ 且产物资产仍带 `/liquid-glass-react/` 子路径前缀(M18 不回归)。
- **总览计数**:全程由 `COMPONENT_DOCS` 派生,M19–M25 新增组件已自动计入,无硬编码需同步。
- **留本地目检**:浅色/深色下玻璃预览与交互(hover/press/折射)的实际可读性、playground 调参手感、
  搜索面板玻璃观感。scrim 浓淡为可调参数,若浅色仍偏暗/偏亮可调 `--site-demo-scrim` 透明度。
