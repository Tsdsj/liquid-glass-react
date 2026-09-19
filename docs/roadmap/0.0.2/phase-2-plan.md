# 0.0.2 第二阶段：打磨、补组件、布局

写于 2026-09-20。第一阶段见 [`phase-1-delivered.md`](phase-1-delivered.md)。所有者决定 0.0.2 **先不发**，继续在这个版本下做三条线：

1. 极致打磨已有组件与使用体验，找 bug；
2. 增加更多常用组件；
3. 增加布局组件。

判据统一用 **Apple-Style**（`~/.claude/skills/Apple-Style`）：先把每个元素归到内容层或控制/导航层，再按 HIG 页面找数字。下面每一条都先写**证据**（本轮实测或 HIG 原文），再写要做什么。没有证据的只列为疑点，不排期。

这三条线全部是纯新增或修复，符合 0.0.x 的收纳规则（见 [`../README.md`](../README.md)）。会破坏现有代码的那些在 [`../0.3.0/plan.md`](../0.3.0/plan.md)。

## 门槛

`pnpm check` 全绿是提交前提；每个改过的组件在合入前过一遍 Apple-Style-Review；颜色只来自 token，hover 带指针门，用户的四项偏好优先，不做 DOM 截屏，不加 `will-change`（`AGENTS.md`）。

新组件另外要：HIG 规则写在文档页顶、层归属写明、键盘模型有用例、四项系统偏好各有断言、命中区 44、压在媒体上的示例过对比度用例、进 `refs.spec.ts` 的探针表（否则 `missing` 断言会叫）。

---

## 一、打磨：找 bug

### 1.1 本轮已查实（2026-09-20，代码 + 真实 Chrome 探针）

| # | 组件 | 证据 | HIG / 规则 | 要做什么 | 严重度 |
| --- | --- | --- | --- | --- | --- |
| P1 | `GlassMenu` `GlassPopover` `GlassActionSheet` | `dir="rtl"` 下 `align="end"`：触发器左缘 556，菜单左缘 **432**、右缘 675——对齐的是**物理右边**。`anchor.tsx` 用 `rect.right` 算 `end`，不看方向 | right-to-left：「用 leading/trailing，不用 left/right」 | `usePopover` 读 `getComputedStyle(trigger).direction`，RTL 时 start/end 互换；`--lg-origin-x` 同步 | **Blocker**（RTL 全部错位） |
| P2 | `ListRow` | `list.tsx:78`：`disabled` 时仍渲染 `<a href>` 只加 `aria-disabled`——键盘 Enter、鼠标点击照样导航；站点没有 disabled+href 的示例所以没人撞到 | 「颜色/属性不是唯一信号」；disabled 必须真的不可用 | disabled 时不渲染 `href`（改 `<span role="link" aria-disabled>`）或在 click/keydown 上 `preventDefault`；补示例与用例 | Major |
| P3 | `GlassSheet` | 只能从 grabber 拖：从内容区拖 8 步，`--lg-sheet-offset` 50% → 50%，纹丝不动 | sheets：系统面板整块可拖，内容滚到顶再下拉即收起 | 拖动手柄扩到整个 `<dialog>`：内容 `scrollTop > 0` 时让给滚动，为 0 且向下拖时接管；横向拖不接管 | Major |
| P4 | `GlassPopover` | 没有箭头（`components.css` 0 处）；在手机宽度下不变形。组件注释自己写着「在手机上应该换成 sheet」 | popovers：「让箭头尽量直指打开它的元素」「iPhone 上改用 sheet」 | 加 `::before` 箭头（位置随 `--lg-origin-x` / 上下）；`< 768px` 时渲染为底部面板（复用 `GlassActionSheet` 的 `data-anchor="bottom"` 路径） | Major |
| P5 | 全部带默认文案的组件 | 默认字符串全是英文：`Close` `Cancel` `Decrease` `Increase` `Clear search`；文档站全中文；没有统一机制 | writing：文案要与平台一致 | `GlassProvider` 加 `strings?: Partial<GlassStrings>`，各组件从 context 取默认，prop 仍可覆盖；内置 en 一套，站点传 zh | Major（体验） |
| P6 | `GlassStepper` | 没有按住连续加减，没有 Shift 大步 | steppers：「大范围时支持 Shift-click 按 10 倍变化」；系统 stepper 按住会连续 | `pointerdown` 起 400ms 后每 80ms 重复，`pointerup`/`pointercancel`/失焦停；`shiftKey` 时 step×10 | Minor |
| P7 | `lockScroll` | `body.overflow = hidden` 在有经典滚动条的平台会让内容横跳一次。本机是 overlay 滚动条量不到（1280 → 1280），Windows / macOS「始终显示滚动条」会 | — | 打开前量 `innerWidth - clientWidth`，补成 `padding-inline-end`；或全局建议 `scrollbar-gutter: stable`。在 Windows 上验一次 | Minor（待 Windows 验证） |
| P8 | `ToastProvider` | 没有关闭按钮、不响应 Escape，只能等或悬停暂停 | 可关闭；键盘用户也能关 | 加 `dismissLabel` 的 ✕ 按钮（44 命中区），Escape 关最新一条 | Minor |
| P9 | `GlassBadge` | Increase Contrast 下：白字压 `rgb(233,21,45)`，无边框 | 增强对比度：「自定义元素加边框」 | `[data-lg-contrast="more"]` 时 1px `--lg-label` 边框；实际对比度 4.6:1 已过 AA，所以只是一致性 | Minor |

严重度按 Apple-Style-Review 的口径：Blocker 破坏材质或无障碍，Major 看起来「不 Apple」，Minor 打磨。

**已完成（2026-09-20，第 1 周）**：P1（`tests/browser/rtl.spec.ts`）、P2（`disabled.spec.ts`）、P5（`strings.spec.ts` + `tests/ssr.test.mjs` 的三级优先用例）。每条都先写了会失败的用例并逐条验证过「把修复撤掉就红」：P1 3 条里红 1、P2 4 条里红 3、P5 4 条全红、`size-class.spec.ts` 2 条里红 1（另一条守的是既有行为，不是回归证据——见下）。

**已完成（第 2 周）**：P3（`sheet-drag.spec.ts`）、P4（`popover.spec.ts`）。`GlassMenuButton`（`menu-button.spec.ts`）与 L1 `Screen`（`screen.spec.ts`）一并落地，站点改用 `Screen`，1.4 节「站点 ScrollEdge」那条随之关闭——连站点自己那套量栏高的代码也删掉了，现在只有一处在量。

第 2 周途中另发现两条，都已修：单选菜单打开时焦点落在第一项而不是**已选中**那一项（pop-up 按钮在每个 Apple 平台上都是后者）；`usePopover` 的首个可聚焦项只找 `[role="menuitem"]`，一个全是可勾选项的菜单会把焦点留在面板上。

### 1.2 待复现的疑点（不排期，先写用例）

| 疑点 | 为什么怀疑 | 怎么复现 |
| --- | --- | --- |
| `TabBar` 在 1024 边界切换 tabbar ↔ sidebar 时，选中透镜从横向坐标跳到纵向坐标会闪一帧 | `useSelectionLens` 首帧抑制只在 `placed` 为 false 时生效；布局切换不重置它 | 1000 ↔ 1040 来回改视口，逐帧截透镜位置 |
| `GlassSlider` 在 RTL 下填充方向与旋钮位置 | `--lg-progress` 直接映射到 `inset-inline-start`？还是 `left`？ | `dir=rtl` 下把值设到 80，量填充在哪一侧 |
| AX5 字号下 `GlassSheet` 标题与 grabber 重叠 | 标题是 `largeTitle` 变体，AX5 下超过两行 | AX5 打开 sheet，量标题 rect 与 grabber rect |
| 深浅主题切换瞬间玻璃闪白 | `--lg-backdrop` 是过渡属性，主题切换改的是 token | 录 5 帧，看 `.lg-tint` 的 backgroundColor 有没有中间值 |
| 融合层在 `contrast: more` 下仍启动 rAF | alpha.5 加了开关，但 `forcedColors` 路径没测 | `forced-colors: active` 下按住按钮，数 rAF |
| `GlassToolbar` roving focus 遇到 `GlassSegmentedControl` 子项走不到 | known-limitations 记了，没有用例 | 工具栏里放分段控件，Tab 进入后按 → |

> 最后一条的**修复**属于 0.3.0（改变既有行为），但**复现用例**在这里写——先证明它真的存在。

复现出来的按既有流程：先写会失败的 Playwright 用例，修，用例留下；复现不出来的从表里删并写一句为什么。

### 1.3 系统化的找法

上一次全面审计（alpha.5）是人眼过 27 页。这一阶段把它变成**矩阵**，机器跑，人只看差异：

```text
41 个组件 × {浅色, 深色} × {默认, 减少透明度, 增强对比度, 减少动效, 强制颜色}
              × {LTR, RTL} × {默认字号, AX5} × {鼠标, 触摸, 键盘}
```

不是每格都截图——每格跑同一组**结构性断言**（无横向溢出、命中区 ≥ 44、文字对比度 ≥ 4.5、焦点环可见且单层、hover 在触摸下不残留、`aria-*` 与可见状态一致），只把失败的格子截图。工具是现有 `tests/browser/a11y.spec.ts` 的推广，产出进 `reports/matrix.json`。

之后再用 **Apple-Style-Review** 逐组件重审一遍——上次审的 27 页里，第一阶段动过的有 30 多个文件，且多了 4 个新页面（探针页不算）。

### 1.4 使用体验（DX）

这五条原本排在 0.3.0，但它们只动文档站和构建脚本，不动库的公开 API，按规则属于 0.0.x，所以提前。

| 项 | 证据 | 做什么 |
| --- | --- | --- |
| D7 | `PropsTable` 手写，没有东西保证它和 TS 接口一致 | 构建期用 TS 编译器 API 读每个 `*Props` 的键，与 `docs.props` 逐项比对，缺一个 `pnpm build:site` 就失败 |
| D1 | 浮层 7 页 7 个示例，输入 2 页 3 个 | 每页至少 3 个示例，各回答一个决定：状态 / 尺寸与密度 / 压在媒体上 |
| D3 | 没有可交互的属性面板 | 每页一个主示例挂旋钮（已定），改动实时进示例与代码块 |
| D8 | 折射默认关，站点自己没有一个折射面 | 概览首屏加「打开折射」开关，WebKit/Firefox 下说明「这个浏览器没有折射」 |
| D5 | ⌘K 只索引组件名 | 扩到示例标题、属性名、章节标题 |
| 站点 ScrollEdge | D4 审查留下的第三条：全站 0 个 `ScrollEdge`，吸顶工具栏浮在滚动内容之上 | 随「三、布局」的 `Screen` 容器一起解决——站点改用自己的布局容器，边缘效果自然就有了 |
| 错误信息 | `GlassAlert` 等在参数非法时 `throw`，信息是英文且没说怎么改 | 统一成「什么错了 + 怎么改」的格式，走 P5 的字符串表 |

### 1.5 缺的小 API（第一阶段顺延）

第一阶段的兼容性表把这一组和 `ref`、HTML 透传一起判为纯新增、归 0.0.2，但没排进那一周。它们都是新增可选属性，判断不变。

| 组件 | 缺什么 | HIG 依据 |
| --- | --- | --- |
| `GlassButton` | `icon` / `trailingIcon` 插槽；现在靠 children 排，间距不统一 | 按钮的图标与文字间距是固定值 |
| `GlassButton` | 每实例 `tint`；现在只有全局 `--lg-accent` | 一屏可以有不同色调的按钮 |
| `GlassSlider` | `marks`（刻度）；双滑块（range） | macOS 滑块有 tick marks |
| `TextField` | `multiline`（`<textarea>`）、`controlSize` | 文本视图是独立组件 |
| `SearchField` | `suggestions`（建议列表，`role=listbox`） | 搜索建议是搜索体验的一部分 |
| `ToastOptions` | `tone`（成功 / 警告）、`icon` | — |

`GlassProvider.accent` **不加**（2026-09-16 已定）：一个色值不够，`--lg-accent-contrast` 必须配套，而对比度不能自动算。改为在「换主题色」指南里补一节，讲怎么配、怎么用 `measure-contrast.mjs` 验证。

---

## 二、新组件

### 2.1 对照 HIG 的缺口

把 HIG `components` 下的页面与现有 41 个逐一对照。左列是 HIG 页面名。

| HIG 页面 | 现状 | 结论 |
| --- | --- | --- |
| buttons, segmented-controls, toggles, sliders, steppers, progress-indicators, text-fields, search-fields, toolbars, tab-bars, sidebars, tab-views, sheets, popovers, menus, alerts, action-sheets, lists-and-tables, labels, status, scroll-views | 有 | 打磨（第一节） |
| **pull-down-buttons / pop-up-buttons** | 无。`GlassButton` + `GlassMenu` 拼得出来，但拼不出「菜单从按钮里长出来」的 morph | **做**：`GlassMenuButton`，`kind="pullDown" \| "popUp"` |
| **context-menus** | 无 | **做**：`ContextMenu`，复用 `GlassMenu`；触发模型是右键 / 长按 500ms / Shift+F10 |
| **disclosure-controls** | 无 | **做**：`DisclosureGroup`，原生 `<details>` + 动画高度 |
| **page-controls** | 无 | **做**：`PageControl`，≤10 点，居中在底部，可拖（`usePull`） |
| offering-help（help tags） | 无。图标按钮只有 `aria-label`，鼠标用户看不到 | **做**：`Tooltip`，悬停/聚焦 ~600ms，`pointer: coarse` 不出现 |
| menus 的 `shortcut` 字段 | 纯文本 | **做**：`Kbd`，站点搜索按钮也在手画 |
| pickers | 无 | **做**（第二批）：`Picker` = `GlassMenuButton kind="popUp"` 加值语义；滚轮式**不做** |
| notifications / banners | 只有 Toast | **做**（第二批）：`Banner`，顶部、可上滑关、带图标两行 |
| text-views | `TextField` 无多行 | 见 1.5：`TextField multiline` |
| gauges | 无 | **做**（第二批）：`Gauge`，`GlassProgress variant="circular"` 的带刻度版 |
| rating-indicators | 无 | **做**（第二批）：`RatingIndicator`，`role=radiogroup` |
| color-wells | 无 | **做**（第二批）：`ColorWell`，原生 `<input type=color>` 加玻璃外壳 |
| boxes | 无。`Card` 近似但没有标题语义 | **做**（第二批）：`Box`，带标题的分组容器，内容层 |
| path-controls | 无 | **做**（第二批）：`Breadcrumb`（macOS path control），导航层 |
| combo-boxes, token-fields | 无 | **不做**：自动完成的无障碍模型是一整期 |
| outline-views | 无 | **不做**（本期）：Tree 的键盘模型自成一体 |
| collections | 无 | 归「三、布局」的 `Grid` |
| panels, split-views, windows | 无 | 归「三、布局」 |
| image-views, image-wells | 无 | **不做**：`<img>` + `aspect-ratio` 足够，known-limitations 已说 |
| activity-rings, charts, digit-entry-views, lockups, ornaments | 无 | **不做**：平台专属或体量是整个库的一半 |

### 2.2 入选规则（不变）

三条同时满足：在 Apple 平台上是真实存在的 HIG 组件；有明确的层归属；用现有组件拼不出来或拼出来超过十行且键盘模型要自己写。

### 2.3 第一批，按已定顺序

| # | 组件 | 层 | 决定性规则（HIG 原文压成一行） |
| --- | --- | --- | --- |
| 1 | `GlassMenuButton` | 玻璃 | pull-down 是「动作 + 更多动作」，pop-up 是「显示当前选择」；菜单**从按钮里长出来**；≥3 项才值得，否则用按钮；破坏性项红字且要确认 |
| 2 | `Tooltip` | 玻璃（小） | 悬停或聚焦 ~600ms 后出现，`aria-describedby` 关联，Escape 关；**`pointer: coarse` 下不出现**（触屏没有悬停）；文案说「这个按钮做什么」，不解释标准控件 |
| 3 | `DisclosureGroup` | 内容 | 标签说清藏了什么（「高级选项」）；最常用的放在最上面不折叠；箭头旋转；`interpolate-size` 可用时用它，否则量高度 |
| 4 | `PageControl` | 玻璃（iOS 26 是小胶囊） | 只表示**有序**页面；居中在底部；≤10 个点；顺着胶囊拖就翻页 |
| 5 | `ContextMenu` | 玻璃 | 只放当前最可能要的命令，要短；**主界面里也要能做到同样的事**；子菜单只允许一层；触发：`contextmenu`、长按 500ms、Shift+F10 / Menu 键 |
| 6 | `Kbd` | 内容 | 快捷键提示，修饰键顺序按 macOS：⌃ ⌥ ⇧ ⌘ |

> `ContextMenu` 的子菜单依赖 0.3.0 的 `GlassMenu` 嵌套支持。本期先做单层触发模型，嵌套随 0.3.0 一起。

### 2.4 第二批（本期做几个待定）

`Picker`、`Banner`、`Gauge`、`RatingIndicator`、`ColorWell`、`Box`、`Breadcrumb`。建议只做前三个，其余顺延——8 个全上会把打磨线挤掉，而打磨才是这一阶段的第一条。

---

## 三、布局组件

现在的库有「浮起来的东西」和「内容层的东西」，没有把它们**摆到一起**的容器。文档站自己就是证据：它手写了 `.app-shell` / `.app-bar` / `.app-main`，然后忘了 `ScrollEdge`。布局容器的意义是把 HIG layout 页的规则——安全区、内容延伸到栏下面、按尺寸类别切换、滚动边缘效果——做成默认行为。

### 3.1 尺寸类别是一切的前提

HIG layout：「按尺寸类别决定布局，永远不按设备类型或方向」。web 对应（`web-implementation.md`）：compact ≈ `< 768px`（边距 16），regular ≈ `≥ 768px`（边距 20）。

先做一个 `useSizeClass()`（`'compact' | 'regular'`）和 `--lg-margin` 的自动切换，其余容器都靠它。

> **落地时改了一处。** 原计划写「`TabBar` 的 `sidebarBreakpoint=1024` 改为读同一来源」。做的时候发现这两个不是一件事：768 是尺寸类别，1024 是标签栏变侧边栏——把后者改成 768，竖屏平板就会长出侧边栏，而 HIG 要的恰恰是那里用紧凑布局。所以 `useSizeClass()` 成为**尺寸类别**的唯一来源（`GlassActionSheet` 内联的 768 已改读它），`sidebarBreakpoint` 保留为另一条轴并在 `docs/api.md` 里写明两者的区别。「两个断点各说各的」这个担心是对的，答案是把它们**命名开**，不是合并。

### 3.2 容器清单

| # | 组件 | 层 | HIG 依据 | 规则与行为 |
| --- | --- | --- | --- | --- |
| L1 | **`Screen`** | 骨架 | layout「全屏背景延伸到栏下面；控件留在安全区内」，scroll-views「浮动元素之后的滚动视图才用边缘效果，一个视图一个」 | 插槽：`top`（导航栏/工具栏）、`bottom`（标签栏）、内容。`100dvh`；`env(safe-area-inset-*)` 打在栏上而不是内容上；内容滚到栏下面；**自动挂一个 `ScrollEdge`**。文档站改用它，D4 那条审查发现就此关闭 |
| L2 | **`SplitView`** | 骨架 | split-views：「在 regular 环境用，compact 下多栏无法并排」「每个栏持续高亮当前选择」「合理的最小/最大栏宽，分隔线要一直可见」「细分隔线 1pt」「让人能隐藏栏，并提供多种恢复方式」「默认 1/3 : 2/3」「整个 split view 上只放一个标题」 | 两栏或三栏 + 可选 inspector（trailing）。regular：并排，分隔线可拖（min/max 钳制）；compact：**折叠成 `NavigationStack`**（iPhone 上系统就是这么退化的）。侧栏用现有 `Sidebar` |
| L3 | **`Inspector`** | 玻璃（大） | sidebars：「检查器在尾随侧」 | `SplitView` 的第四栏，或独立：trailing 侧，默认 260–320，可隐藏；密集控件用 rounded-rect 而非胶囊 |
| L4 | **`NavigationStack`** | 骨架 + 导航层 | toolbars/navigation：「返回按钮带上一级标题或只有 chevron」「顶部大标题，滚动后变紧凑标题」 | `push/pop` 栈，`NavigationBar` 自动出现返回按钮；栈切换交叉淡出 + 位移，reduced motion 只淡出；焦点移到新页 `main`；可接客户端路由也可不接 |
| L5 | **`Grid`** | 内容 | collections：「用标准的行或网格布局」「留足 padding 让焦点/悬停效果看得见」 | 按尺寸类别定列数（或 `minItemWidth` 自动），gap 来自间距 token，选中/焦点态留 8pt；**不做虚拟化**（那是另一期，且和玻璃无关） |
| L6 | **`Form`** | 内容 | lists-and-tables：「设置用 grouped form」「标题式段落标题，不全大写」 | `Form > FormSection > FormRow(label, control)`，label 与控件对齐、错误文案挂 `aria-describedby` |
| L7 | ~~`Stack` / `Spacer`~~ | — | — | **不做**。CSS flex 已经是这个东西；做一层没有 HIG 规则可以放进去的包装，只是多一个名字 |

### 3.3 顺序与相互依赖

- L4 先于 L2：compact 折叠依赖它。
- L1 的 `top` 插槽放 `NavigationBar` 时要和 `ScrollEdge` 协调，否则边缘效果盖在大标题上。
- L2 的分隔线拖动要有键盘等价：`role="separator" aria-orientation`，← → 调宽。
- 全部容器都要在 AX5 下不横向溢出（矩阵会抓）。

---

## 四、排期

三条线交错着做，每周一个可以独立合入的切片；每周末 `pnpm check` 全绿，改过的组件过 Apple-Style-Review。

| 周 | 打磨 | 新组件 | 布局 |
| --- | --- | --- | --- |
| **1 ✅** | P1 RTL 对齐、P2 disabled 行、P5 字符串表 | — | `useSizeClass` |
| **2 ✅** | P3 sheet 整块可拖、P4 popover 箭头 + 手机变 sheet | `GlassMenuButton` | L1 `Screen`，站点改用它（ScrollEdge 那条已关闭） |
| 3 | 矩阵用例落地（1.3），跑出第一份 `reports/matrix.json`，修抓到的 | `Tooltip`、`Kbd` | L4 `NavigationStack` |
| 4 | P6 stepper、P8 toast、P9 badge；1.2 的六个疑点逐一复现 | `DisclosureGroup`、`PageControl` | L2 `SplitView`（含 L3 `Inspector`） |
| 5 | 1.5 的小 API；D7 属性表比对进 `build:site` | `ContextMenu` | L5 `Grid`、L6 `Form` |
| 6 | D1 每页三示例、D3 属性面板、D8 折射开关、D5 搜索；全库 Apple-Style-Review 复审 | 第二批择前三个 | 布局容器的 AX5 / RTL 矩阵 |

发版前：CHANGELOG 把 `## 0.0.2` 一节补成完整版；`docs/api.md` 新增全部组件与属性；重打 `v0.0.2` 标签；再跑一次 `pnpm pack` 装进空项目。

---

## 五、需要人做的事（没有自动化替代）

- **VoiceOver 走查**：33+ 页，随每个新组件的文档页一起，清单是页面的「键盘与辅助功能」段落。R1 至今未做，是最大的未知。
- **iPhone Safari 真机**：P3 整块可拖的手感、`PageControl` 的拖动、`ContextMenu` 的长按与系统长按（文字选择、链接预览）的冲突——这三个只能上手。
- **Windows Chrome**：P7 滚动条抖动、关闭硬件加速时的 `backdrop-filter`。
- **一双眼睛看退化材质**：Safari 真机上磨砂而非折射的观感。

---

## 六、要项目所有者拍板的

2026-09-20 全部按建议定下，已生效：

| 决定 | 定为 | 理由 |
| --- | --- | --- |
| 字符串机制（P5） | **`GlassProvider strings={…}` 对象** ✅ 已落地 | 库不该猜语言；内置 en 一套，其余由应用传。`locale` 会把翻译责任揽到库里 |
| `SplitView` 在 compact 下 | **折叠成 `NavigationStack`** | iPhone 上系统的做法（`NavigationSplitView` 在 compact 就是这么退化的） |
| 第二批新组件做几个 | **前 3 个**（`Picker`、`Banner`、`ColorWell`） | 8 个全上会把打磨线挤掉，其余顺延到 [`../0.4.0/plan.md`](../0.4.0/plan.md) |
| `Grid` 要不要虚拟化 | **不要** | 虚拟化是另一期的事，且和「内容层不做玻璃」无关 |
