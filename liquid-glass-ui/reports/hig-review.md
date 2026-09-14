# HIG / Liquid Glass 审查报告 — 0.2.0-alpha.1

依据 Apple HIG（Materials、Color、Typography、Layout、Buttons、Toolbars、Tab bars、Sidebars、Sheets、Menus、Motion、Accessibility）与 WWDC25 219 / 356 的 Liquid Glass 指南，对整套组件库与文档站做的收尾审查。

自动化证据：62 项核心测试、3 项 SSR 测试、60 项 Playwright 用例（**正式 Google Chrome**，单机）。日期：2026-09-15。

---

## 1. 重构前审计中已修复的问题

| # | 严重度 | 元素 | 违反的规则 | 修复 |
| --- | --- | --- | --- | --- |
| B1 | Blocker | 演示站中的卡片、性能项、试样、摘要框 | 玻璃进入内容层 | 新增 `Card` / `List` / `MaterialView` / `Text`，全部改用实色分组背景 |
| B2 | Blocker | `.lg-shine` 整面白色渐变 + `.lg-rim` 双层内阴影 | "光是被折射的，不是画上去的"；双斜面 = 光泽塑料 | 删除渐变层；改为随指针绕轮廓行进的一条 conic 发丝高光 |
| B3 | Blocker | 无语义色阶与系统色 | 必须使用语义色，并提供增强对比度变体 | 12 系统色 × 浅/深/增强对比度 + 完整语义色阶 |
| B4 | Blocker | 站内大量 8–10px 文字 | 可读文本下限 11pt | iOS 文本样式 token；自动用例断言全站最小字号 ≥ 11px |
| B5 | Blocker | 无 `prefers-contrast: more` | 增强对比度下材质须转为黑白 + 对比边框 | tokens.css 第三套调色板 + styles.css 分支 + Provider `contrast` |
| B6 | Blocker | 滑块旋钮常驻玻璃 | 内容层旋钮只在被操作时抬升 | 静止为实心旋钮，`:active` / `[data-pulling]` 时才显示玻璃装饰 |
| B7 | Blocker | compact 密度 36px、站点导航约 34px | 命中区 44×44 | `--lg-hit-min`；`(pointer: coarse)` 下用伪元素补足 |
| M1 | Major | 自定义 header 背景 + 边框 + 阴影 | 删除自定义栏背景，分隔来自玻璃与滚动边缘 | `.app-bar` 三者皆无，并有回归用例断言 |
| M2 | Major | 全站 ALL-CAPS + 大字距 eyebrow | iOS 26 起分区标题用标题式大小写 | 全部改为标题式 |
| M3 | Major | ScrollEdge 用实色块盖住内容 | 滚动边缘是渐进溶解 / 均匀边界 | 重写为 soft（渐进模糊 + 遮罩淡出）/ hard 两种 |
| M4 | Major | 菜单 / 浮层 / 对话框与按钮共用 regular 参数 | 大玻璃更厚、阴影更深、**不翻转** | 新增 `size="large"`，浮层自动使用 |
| M5 | Major | 无同心圆角体系 | 嵌套形状必须 parent − inset | `Card` + `Concentric` + `concentricRadius()`，纯 CSS 解析 |
| M6 | Major | 工具栏内图标与文字同组 | 同组不可混排符号与文字 | 拆为 `ToolbarGroup`；开发模式对混排告警 |
| M7 | Major | 开关打开态用品牌色 | 开关打开态为系统绿 | 改为 `--lg-green` |
| M8 | Major | 全物理属性 | RTL 必须用逻辑属性 | styles.css 全面改造；chevron 镜像；方向键对调 |
| M9 | Major | 主题存在 React state，首屏恒浅色 | 不响应系统深色，且闪烁 | `<head>` 内联脚本在首屏绘制前应用 |
| M10 | Major | `100vh`、无 safe-area | 移动端底栏被裁 | `100dvh` + `viewport-fit=cover` + `env(safe-area-inset-*)` |

组件目录缺口（TabBar、Sidebar、NavigationBar、Sheet、Alert、ActionSheet、Toast、List、TextField、SearchField、Stepper、Progress、Badge 等）已补齐，共 41 个组件与 Provider。

---

## 2. 本轮审查新发现并已修复

| # | 严重度 | 元素 | 问题 | 修复 |
| --- | --- | --- | --- | --- |
| N1 | Major | `apps/playground/index.html` 首屏主题脚本 | 内联脚本没有 nonce，违反预览服务器的 `script-src 'self' 'nonce-…'` | 加 `data-csp-nonce`；CSP 用例现在断言零违规 |
| N2 | Minor | `--lg-glass-blur` / `-saturate` / `-fill` / `-light-angle` / `-tint` / `--lg-flex-press-*` | 与 TS 的 `materialTokens` 重复声明，或名字与实际消费的不一致——改了不生效 | 删除重复项；高光角度统一为 `--lg-light-angle`；注释写明材质参数的唯一来源在 `tokens/src/index.ts` |
| N3 | Minor | `--lg-rim-light` / `--lg-rim-dark` | 迁移到 `--lg-glass-rim-hi/lo` 后成为死别名 | 删除 |

---

## 3. 仍然存在的发现

| # | 严重度 | 元素 | 问题 | 建议 |
| --- | --- | --- | --- | --- |
| R1 | Major | 全库 | 真实屏幕阅读器（VoiceOver / NVDA）朗读顺序与语音控制名称匹配**未验证**。自动用例只能证明角色与键盘路径正确 | 发布前人工过一遍，见 `docs/accessibility.md` §8 |
| R2 | Major | 玻璃上的文字 | 对比度只按 token 理论值检查过。玻璃的最终颜色取决于背后的内容，token 计算不构成证据 | 在真实媒体背景上做合成后取样测量 |
| R3 | Minor | Safari / Firefox | 两者无折射（退化为模糊），回退观感未做人工复核 | 目视确认退化后仍读得出是"材质"而不是一块灰板 |
| R4 | Minor | 公共 API | `usePopover` / `triggerElement` / `lockScroll` 属内部装配，被 `export *` 带进了公开 API | 下个破坏性版本收敛为内部模块 |
| R5 | Minor | `GlassSheet` | 只支持 medium / large 两个停靠高度，不支持自定义比例 | 有需求再扩展；当前已在 `known-limitations.md` 写明 |
| R6 | Minor | tokens.css | 15 个 token 未被库自身引用（`--lg-cyan`、`--lg-purple`、`--lg-radius-xs`、`--lg-z-content` 等） | **不是缺陷**：设计系统本就该对外提供完整调色板与量表。记录于此以免后人误删 |
| R7 | Minor | 性能预算 | "单视图折射元素 ≤ 20" 是经验值，未在低端设备实测 | 用 DevTools 录制替换 rAF 诊断后复核 |

---

## 4. 清单核对

**分层与材质** — 玻璃仅用于浮动操作 / 导航层 ✓（用例断言 `.lg-card` 无 `backdrop-filter`）· 不玻璃叠玻璃、分组共享一个背景 ✓ · Regular 默认、Clear 仅媒体且 mixed 自动降级 ✓ · 无自定义栏背景、有滚动边缘效果 ✓ · 大玻璃更厚且不翻转 ✓ · 内容层用标准材质 ✓

**色彩** — 唯一 tinted 主操作 ✓（用例断言每视图仅一个 prominent）· 语义色、无硬编码灰度 ✓ · 浅/深/增强对比度三套 ✓ · 对比度 ⚠ 见 R2

**排版** — iOS 文本样式与正确行高字距 ✓ · Dynamic Type 至 AX5 回流 ✓ · ≥ 11pt ✓ · 提示框标题加粗左对齐 ✓ · 标题式分区头 ✓

**形状与布局** — 44×44 命中区 ✓ · 胶囊 / 同心圆角 ✓ · 尺寸类驱动、标签栏 ↔ 侧边栏 ✓ · 工具栏按功能分组、不混排、主操作独立 ✓ · 搜索在尾部独立位置 ✓

**动效与反馈** — 每个按钮都有按下态 ✓ · 弹簧、可中断、仅 transform/opacity ✓ · 玻璃按压形变并从指针处点亮 ✓ · 高光绕轮廓行进 ✓ · 三个控件均可拖动且拖动中即时更新 ✓（6 项用例）· 旋钮仅操作时抬升 ✓ · 减少动效已尊重 ✓ · 破坏性操作有确认或撤销 ✓

**无障碍** — 图标按钮有名称 ✓ · 焦点可见且未被移除 ✓ · 减少透明度 / 增强对比度 ✓ · RTL ✓ · 表单 `aria-invalid` + `aria-describedby` ✓ · 屏幕阅读器 ⚠ 见 R1

**Web 实现** — 无 SF Symbols、无自托管 SF 字体 ✓ · 角色正确（标签栏是 nav 不是 tablist）✓ · `100dvh` + safe-area + z 分层 ✓ · `touch-action` / `overscroll-behavior` / `scrollbar-gutter` ✓ · 输入 ≥16px ✓ · 首屏前应用主题 ✓ · 无全量 `will-change`、`pointermove` 内不读布局 ✓ · Safari / Firefox ⚠ 见 R3

---

## 5. 结论

审计发现的 7 个 Blocker 与 10 个 Major 全部修复，并各自有自动化用例守住。剩余 2 个 Major（R1 屏幕阅读器、R2 真实合成背景对比度）本质上无法由自动化替代，是发布前的人工门槛；它们在 `docs/action-items.md` 里保持"待验证"，没有因为组件数量增加而被标记通过。

最能改变观感的三处改动，按影响排序：**把玻璃从内容层拿走**（页面重新有了层次）、**去掉画上去的高光**（材质不再像塑料）、**建立字号体系**（8px 的说明文字曾经让整站显得不可读）。
