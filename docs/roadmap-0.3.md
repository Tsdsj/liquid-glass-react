# 下一期开发计划：0.0.2 → 0.3.0

写于 2026-09-16，0.0.1 发布之前。三条线：文档站体验、已有组件的缺陷与 API、新组件。

每一条都先写**证据**再写**要做什么**——证据来自代码、测试和上一轮审查，不是想象。标了「待复现」的是疑点，没有复现之前不算缺陷，也不排期修。

## 已定的六件事（2026-09-16 项目所有者拍板）

| 决定 | 取值 | 理由 |
| --- | --- | --- |
| 属性面板范围 | **每页一个主示例挂旋钮**，其余示例保持静态 | 读者要的是「这个属性改了长什么样」，不是每个示例都能调 |
| 代码高亮 | **自写分词器**，零依赖 | 站点被「零外部请求」用例守着；颜色够用就行 |
| `GlassProvider.accent` | **不加**，维持 CSS 变量方案 | 一个色值不够，`--lg-accent-contrast` 必须配套，而对比度不能自动算。补一篇指南比加一个半吊子属性诚实 |
| 子菜单 | **macOS 风格：嵌套，悬停 / → 展开** | 这是面向网页的组件库，主要在有指针的设备上用；触屏下退化为点按展开 |
| Sheet 自定义停靠点 | **显式对象** `{ fraction }` / `{ height }` | 不用猜 0.3 是比例还是像素 |
| 新组件顺序 | **MenuButton → Tooltip → DisclosureGroup** → PageControl → ContextMenu → Kbd | 动效辨识度、图标按钮对鼠标用户是哑的、设置页刚需 |

## 起点

```text
41 个组件 · 27 个文档页 · 41 个示例（内容 11 / 控件 13 / 输入 3 / 导航 7 / 浮层 7）
65 单元 · 3 SSR · 84 真实 Chrome · 16 WebKit + Firefox
公开运行时名字 69 · 一条开发模式告警（工具栏混排）
```

版本号的约束（见 `../RELEASING.md`）：0.1.0 与 0.2.0 已被永久占用，所以缺陷修复走 **0.0.x**，新组件与新 API 走 **0.3.0**。0.x 允许破坏性改动，但每次都要给改名对照表。

---

## 一、文档站体验

### 已查实的缺口

> **0.0.2 已完成 D2、D4、D6、D9、D10**（2026-09-19）。下表保留原始证据，完成的一项在末尾标注。

| # | 证据 | 要做什么 |
| --- | --- | --- |
| D1 | 浮层 7 页只有 7 个示例，输入 2 页 3 个；`DemoEntry` 支持多示例但大半页面只用了一个 | 每页至少 3 个示例，各回答一个决定：**状态**（禁用 / 加载 / 错误）、**尺寸与密度**、**压在媒体上时**。示例数是给读者看的，不是凑数：一个示例只讲一件事 |
| D2 | `site/site/code-block.tsx` 是裸 `<pre>`，只有复制按钮，没有语法高亮 | 自写一个 ~150 行的 TSX 分词器：关键字、字符串、JSX 标签与属性、注释、数字，五类 token 五个 CSS 类，颜色来自 token。不引依赖，`csp.spec.ts` 的「零外部请求」不变。已定<br>**已完成（0.0.2）**：`site/src/site/tokenize.ts`，五类 token，颜色来自语义 token；`tests/core/tokenize.test.mjs` 守住「高亮不改变代码」。 |
| D3 | 没有可交互的属性面板；`PropsTable` 是静态表 | 每页**一个**主示例挂旋钮（`variant` / `controlSize` / `material` / `backdropTone` / `density` 等，按组件选），改动即时反映到示例和代码块；其余示例保持静态。数据模型：`DemoEntry.controls?: ControlSpec[]`，只有主示例填。已定 |
| D4 | 右侧目录 `.outline` 只在 ≥1280px 显示（`app.css:237`）；以下宽度没有页内导航 | 窄屏改成吸顶的「本页内容」按钮，点开是 `GlassMenu`——顺便让站点用自己的菜单<br>**已完成（0.0.2）**：吸顶 `GlassMenu`，与目录栏共用同一份目的地。过了 Apple-Style-Review，五条发现修掉四条，剩下一条见下。 |
| D5 | ⌘K 搜索只索引组件名（`searchDocs`） | 索引扩到示例标题、属性名、基础与指南的章节标题；结果分组显示，命中属性时直接跳到 API 表对应行 |
| D6 | 每页缺三样常规的东西：`import` 语句、相关组件、「查看源码 / 报告问题」链接 | 页头加 import 片段（可复制）；`ComponentDoc` 加 `related: string[]`；页脚加两个链接指向 GitHub<br>**已完成（0.0.2）**：import 片段、`related`（slug 会校验）、查看源码 / 报告问题。 |
| D7 | `PropsTable` 手写，代码里的注释说明了为什么不用运行时反射——但没有任何东西保证它和 TS 接口一致 | 构建期用 TypeScript 编译器 API 把每个 `*Props` 的键读出来，和 `docs.props` 逐项比对，缺一个就让 `pnpm build:site` 失败。仍然不做运行时反射，理由不变 |
| D8 | 折射默认关（`enableSvgAuto: false`），站点自己没有一个折射面；概览首屏就是普通磨砂 | 首屏加一个开关：「打开折射」。同一块玻璃，一按就看出差别；WebKit / Firefox 下开关旁边说明「这个浏览器没有折射」 |
| D9 | `router.ts` 切页只 `scrollTo(0)`，不改 `document.title`，不把焦点移到 `main` | 切页时设标题、把焦点放到 `#main`（已有 `tabIndex`）；这是屏幕阅读器用户知道「页换了」的唯一途径，也是 R1 里能靠代码解决的那一小部分<br>**已完成（0.0.2）**：`tests/browser/routing.spec.ts`。 |
| D10 | 站内没有更新日志页，读者要去仓库翻 `CHANGELOG.md` | 构建期把 CHANGELOG 渲染成 `#/changelog`，版本号已经通过 `__LG_VERSION__` 进站了<br>**已完成（0.0.2）**：`#/changelog`，构建期内联 CHANGELOG.md。 |

### 指南要补的

现有五篇：安装、主题、效果与性能、SSR、从 0.1 升级。缺的都是「用错了才知道」的那种：

- **声明背景色调**——R2 那个 4.38:1 的对比度失败就是站点自己把浅色场景声明成了 `dark`。这篇讲怎么判断、怎么量（`scripts/measure-contrast.mjs`）、错了会怎样。
- **配合客户端路由**——`TabBarItem` 有 `href` + `onSelect`，但没有一篇文章说 React Router / TanStack Router 该怎么接。
- **性能预算**——「单视图折射元素 ≤20」写在 known-limitations 里，读者看不到。
- **从 0.0.x 升级**——0.3.0 之前必须有，随改名对照表一起写。

### 验收

- 每一条改动跑一次 `catalog.spec.ts`（每页完整、无报错、代码可展开）和 `csp.spec.ts`（零外部请求）——D2 选依赖方案时后者会第一个叫。
- D3 属性面板：改任一旋钮后，示例 DOM 上对应的 `data-*` 或 class 必须同步变化，代码块文本必须包含新值。写成用例。
- D9：切页后 `document.activeElement` 是 `main`，`document.title` 含页题。写成用例。
- Lighthouse 跑一次，数字进 `reports/`，当证据不当目标。

---

## 二、已有组件：缺陷与 API

### 2.1 已查实（来自代码，不需要复现）

> **A、B、C、H 已在 0.0.2 完成。** 实际数量比这里写的多：会渲染元素的组件是 37 个，缺 `ref` 的是 25 个（另有 4 个纯 context 的 Provider 本来就不该有）。守它的是 `site/src/pages/ref-probe.tsx` + `tests/browser/refs.spec.ts`，运行时与类型两层都测——JSX 展开会跳过多余属性检查，所以「能编译」不等于「类型上接受」。

**A. 29 个组件里 21 个不转发 `ref`。**

```text
有 forwardRef：GlassSurface、GlassButton、Card、MaterialView、TextField、SearchField、Sidebar、ToolbarGroup
没 有：Badge、Progress、Segmented、Slider、Stepper、Switch、NavigationBar、ScrollEdge、TabBar、Tabs、
        Popover、Menu、Dialog、Sheet、Alert、ActionSheet、Divider、List、ListRow、Text
```

后果是调用方拿不到节点：不能量尺寸、不能把 `ScrollEdge.targetRef` 指向自己的 `List`、不能用第三方库锚定。全部补上。**验收**：一条浏览器用例遍历目录里每个组件，挂 `ref` 后断言拿到的是 `HTMLElement`。

**B. 一批组件不透传 HTML 属性。** `GlassProgress`、`GlassStepper`、`NavigationBar`、`ScrollEdge` 只收 `className`；`Segmented` / `Slider` / `Switch` / `Tabs` / `TabBar` 和所有浮层也是。写不了 `style`、`id`、`data-*`、`aria-describedby`。统一 `extends Omit<HTMLAttributes<…>, 冲突键>`，冲突键逐个列出（比如 Segmented 内部生成的 `id`）。

**C. `placement` 有实现没接口。** `anchor.tsx:43` 内部支持 `'below' | 'above' | 'auto'`，`GlassPopover` / `GlassMenu` 只暴露 `align`。暴露出来，默认 `auto` 不变。

**D. 菜单只有一层，分组只有 `separatorBefore`。** 没有分组标题、没有子菜单（known-limitations 已记）。加 `sectionLabel?: string` 与 `items?: GlassMenuItem[]`（子菜单）。

子菜单按 **macOS 模型**做（已定）：悬停父项 ~150ms 后向侧边展开，展开的子菜单与父项之间留一个「安全三角」——指针斜着划向子菜单时不因经过相邻项而切换；键盘 → 进入、← 返回、Escape 逐层关、Home / End 在当前层内。触屏（`pointer: coarse`）没有悬停，父项改为点按展开。三条都要有用例：安全三角用一串斜向 `mouse.move` 断言子菜单没被换掉。

**E. `GlassSheet` 只有 `medium` / `large` 两个停靠点。** 加自定义（已定写法）：

```ts
detents?: Array<'medium' | 'large' | { fraction: number } | { height: number }>
```

`fraction` 是视口高度的比例，`height` 是 CSS 像素；两者都夹在 `[88px, 94%]` 内。停靠动画和拖拽逻辑已经按比例写，扩展成本低。`SheetDetent` 类型变宽是 0.3.0 的破坏性改动之一。

**F. 工具栏的 roving focus 只覆盖按钮型子控件**（known-limitations）。分段控件、开关放进 `ToolbarGroup` 时方向键走不到。扩到所有可聚焦子项。

**G. 缺的小 API**（各自一行就能说清）：

| 组件 | 缺什么 | HIG 依据 |
| --- | --- | --- |
| `GlassButton` | `icon` / `trailingIcon` 插槽；现在靠 children 排，间距不统一 | 按钮的图标与文字间距是固定值 |
| `GlassButton` | 每实例 `tint`；现在只有全局 `--lg-accent` | 一屏可以有不同色调的按钮 |
| `GlassSlider` | `marks`（刻度）；双滑块（range） | macOS 滑块有 tick marks |
| `TextField` | `multiline`（`<textarea>`）、`controlSize` | 文本视图是独立组件 |
| `SearchField` | `suggestions`（建议列表，`role=listbox`） | 搜索建议是搜索体验的一部分 |
| `ToastOptions` | `tone`（成功 / 警告）、`icon` | — |
| `GlassProvider` | ~~`accent` 属性~~ **不加**（已定）。改为在「换主题色」指南里补一节：怎么为自定义主色配 `--lg-accent-contrast`、怎么用 `measure-contrast.mjs` 验证 | — |

**H. 只有一条开发模式告警。** 再加三条，都是审查里靠人眼查过的规则，改成代码守：一个共享表面里出现两个 `glassProminent`（一屏一个主操作）；小玻璃套小玻璃；`material="clear"` 用在没声明色调的地方（现在静默降级为 `regular`，调用方不知道）。每条只在开发模式、每个节点告警一次。

**H 完成（0.0.2）**：`src/react/system/warn.ts`，`tests/browser/warnings.spec.ts` 在 dev server 上读控制台（生产构建里它们被折叠掉了，这正是要的）。同一个原因牵出了守卫本身的缺陷，见 2.2。「两个 `glassProminent`」按表面去重而不是按按钮——一个问题只说一次。

### 2.1-D4 留下的一条未决

Apple-Style-Review 对窄屏目录菜单的第三条发现，修改会波及整站观感，留给项目所有者定：

**站点一个 `ScrollEdge` 都没有。** 文档里 `.lg-scroll-edge` 计数为 0，而 `.app-bar` 是吸顶的、现在 `.outline-compact` 也是，两者都浮在滚动内容之上。HIG（scroll-views）：「只在滚动视图位于浮动界面元素之后时使用滚动边缘效果」——正是这个情形。本库把 `ScrollEdge` 文档成「取代自定义栏背景」的东西，自己却没用。改法是在 `.app-main` 顶部加一个。

### 2.2 复现结果（2026-09-19，0.0.2）

三条都去查了。**一条都没复现**——但查的过程本身找出了三个别的缺陷，见下。

| 疑点 | 结论 | 证据 |
| --- | --- | --- |
| Strict Mode 下 `usePull` / `useFusion` 的 rAF 循环重复启动 | **没复现** | `tests/browser/strict-mode.spec.ts`。文档站本来就跑在 `<StrictMode>` 里、dev server 又是 React 开发版，双调用是真的在生效。断言的是「闲置页面不排帧」：拖完松手、离开页面，600ms 内 rAF 调用 ≤2。故意让 `tick` 无条件重排后测到 36–37 帧，用例能抓 |
| `defaultOpen` 对话框的 hydration 不匹配 | **没复现** | `site/hydration-probe.html` + `tests/browser/hydration.spec.ts`。八个用例（含 dialog / sheet / alert / popover 四个 `defaultOpen`）在页面里 `renderToString` 再 `hydrateRoot`，React 开发版一条 mismatch 都没报。两侧故意用不同 `identifierPrefix` 时能抓到，说明检测有效 |
| Firefox < 129 没有 `@starting-style` | **无法在这里复现** | Playwright 装的是 Firefox 155，三家引擎实测 `@starting-style` 与 `transition-behavior: allow-discrete` 全部支持。装不到 128。改为守住真正的风险：`fallback.spec.ts` 断言没有入场动画时浮层仍然能开、有实际尺寸、能关 |
| Windows Chrome 关闭硬件加速时 `backdrop-filter` 路径 | 仍未执行 | 需要一台 Windows 机器；排进「需要人做的事」 |

**顺带查出来的三个真缺陷**（都已修，都有用例）：

- `inDevelopment()` 原来读 `globalThis.process?.env`——打包器只替换字面量 `process.env.NODE_ENV`，所以浏览器产物里 `process` 是 undefined，开发告警在**生产环境里一直开着**。实测旧写法在站点生产构建上吐 6 条告警。
- `TabBar` 的 `ref` 落在内层 `div` 上而不是 `<nav>`：它混在 `...surface` 里被透传到了第一个 `GlassSurface`。
- `SearchField` 类型上收 `id`，内部又用生成的覆盖掉，`<label for>` 指不过去。

另外，测试配置本身有个坑：`reuseExistingServer` 会让 Playwright 把别的项目占着 5173 / 4173 的 dev server 当成自己的，整套用例跑在别人的应用上还全绿。已改成独占端口 41730 / 41731 且不复用。

### 2.3 兼容性

A、B、C、G 都是纯新增，进 **0.0.2**。D、E、F 改了行为或类型（`GlassMenuItem` 多字段、`SheetDetent` 类型变宽），进 **0.3.0**，随对照表。

---

## 三、新组件

### 入选规则

三条同时满足才做：

1. 在 Apple 平台上是一个真实存在的 HIG 组件，不是 web 生态的习惯；
2. 有明确的层归属——要么是浮起来的玻璃，要么明确属于内容层；
3. 用现有组件拼不出来，或拼出来超过十行、且键盘模型要自己写。

每个新组件的验收都一样：HIG 规则写在文档页顶上、层归属写明、键盘模型有用例、四项系统偏好各有断言、命中区 44、颜色只来自 token、hover 有指针门、放在媒体上的示例过对比度用例、发布前过一遍 Apple-Style-Review。

### 第一批（0.3.0），按已定顺序

| # | 组件 | 是什么 | 层 | 为什么现在做 |
| --- | --- | --- | --- | --- |
| 1 | **`GlassMenuButton`** | 按下弹出菜单的按钮。HIG 分两种：**pull-down**（按钮是动作，菜单是更多动作）和 **pop-up**（按钮显示当前选择，菜单换选择）。一个组件，`kind` 属性区分 | 玻璃 | 现在 `GlassButton` + `GlassMenu` 用 `trigger` 拼得出来，但 iOS 26 的关键动效——**菜单从按钮里长出来**（morph）——拼不出来。这是 Liquid Glass 最有辨识度的动作之一。与 2.1-D 的子菜单同一期做，共用 `GlassMenu` 的新键盘模型 |
| 2 | **`Tooltip`** | macOS 的 help tag：悬停或聚焦 ~600ms 后出现的说明 | 玻璃（小） | 现在图标按钮只有 `aria-label`，鼠标用户看不到。指针门必须严：`pointer: coarse` 下不出现；`aria-describedby` 关联；Escape 关 |
| 3 | **`DisclosureGroup`** | 可展开的一组内容，箭头旋转 | 内容 | 原生 `<details>` + 动画高度（`interpolate-size` 可用时用它，否则量高度）。列表页、设置页到处要 |
| 4 | **`PageControl`** | 一排圆点表示第几页 | 玻璃（iOS 26 是一枚小胶囊） | 轮播、引导页的必需品；可拖动——顺着胶囊拖就翻页，用 `usePull` |
| 5 | **`ContextMenu`** | 右键 / 长按弹出的菜单 | 玻璃 | 复用 `GlassMenu`。新增的是触发模型：`contextmenu` 事件、触摸端长按 500ms、键盘 Shift+F10 / Menu 键。排在子菜单之后，因为上下文菜单最常见的形态就是带子菜单的 |
| 6 | **`Kbd`** | 快捷键提示 ⌘K | 内容 | 菜单的 `shortcut` 字段现在是纯文本；站点搜索按钮也在手画。很小，但到处要 |

如果 0.3.0 只装得下三个，就是前三个；4–6 顺延到 0.4.0，第二批往后推。

### 第二批（0.4.0）

| 组件 | 说明 |
| --- | --- |
| **`SplitView`** | 侧栏 / 内容 / 检查器三栏。macOS 26 的 inspector 是新东西。纯布局容器，只有侧栏是玻璃（`Sidebar` 已有） |
| **`Picker`** | 菜单式选择器 = `GlassMenuButton kind="popUp"` 加值语义；滚轮式选择器**不做**（触摸专属，web 上没有好的键盘模型） |
| **`Banner`** | 顶部通知横幅。和 Toast 的区别：从顶部来、可上滑关闭、可带图标与两行文字。HIG 的 notification 与 toast 是两种东西 |
| **`Gauge`** | 圆弧仪表，`GlassProgress variant="circular"` 的带刻度版 | 
| **`RatingIndicator`** | 五星评分，`role=radiogroup` |

### 不做，以及为什么

| 组件 | 原因 |
| --- | --- |
| Combobox / TokenField | 自动完成的无障碍模型（`aria-activedescendant` + 虚拟焦点）是一整期的工作量，做半截比不做差 |
| DatePicker | 平台差异太大；web 上原生 `<input type="date">` 加样式是更诚实的答案 |
| 数据表格 | 内容层、和玻璃无关、体量是整个库的一半 |
| 滚轮选择器 | 见 Picker |
| BottomAccessory | `TabBar` 已有 `accessory` 属性；缺的是一个文档示例，不是组件 |
| NavigationStack / 返回按钮 | 是 `NavigationBar` 的 `back` 属性 + 标题过渡，不是新组件；排进 2.1-G |

---

## 四、排期

| 版本 | 内容 | 兼容性 |
| --- | --- | --- |
| ~~**0.0.2**~~ **已发布 2026-09-19** | 文档站 D2、D4、D6、D9、D10；组件 A、B、C、H；2.2 前三条已查（均未复现） | 纯新增，无破坏 |
| **0.3.0**（4–6 周） | 文档站 D1、D3、D5、D7、D8 与四篇指南；组件 D、E、F、G；新组件第一批六个；升级指南 | 有类型变宽与改名，附对照表 |
| **0.4.0** | 新组件第二批；搜索建议；Windows 矩阵 | 视 0.3.0 反馈定 |

顺序的理由：0.0.2 先把「拿不到 ref、写不了 style」这类让人在真实项目里第一天就卡住的东西清掉；0.3.0 才动结构。

---

## 五、不放松的门槛

- `pnpm check` 全绿是提交的前提，不是发版的前提。
- 新组件的用例进 `components.spec.ts`（语义与键盘）、`fallback.spec.ts`（无折射时仍是材质）；带拖动的进 `scrub.spec.ts`；压在媒体上的进 `contrast.spec.ts`。
- 每个版本发布前用 Apple-Style-Review 过一遍**改过的**组件，结论追加到 `../reports/hig-review.md`。
- **R1 屏幕阅读器**仍然开着。它不是代码任务：排一次 VoiceOver 实机走查，清单是每个组件页的「键盘与辅助功能」段落，结果记进 `../reports/`。0.3.0 之前做一次。

---

## 六、0.0.2 的第一周：具体到文件

排期表说「1–2 周」，这里说第一周动哪些文件，接手就能开工：

| 天 | 做什么 | 触及 |
| --- | --- | --- |
| 1–2 | 2.1-A `forwardRef` 全覆盖 + 2.1-B HTML 透传；先写遍历目录挂 `ref` 的用例 | `src/react/{controls,navigation,overlays,content}/*.tsx`、`tests/browser/components.spec.ts`、`docs/api.md` |
| 3 | 2.1-C 暴露 `placement`；2.1-H 三条开发告警 | `overlays/anchor.tsx`、`popover.tsx`、`menu.tsx`、`system/material.tsx`、`controls/button.tsx` |
| 4 | D2 分词器 + D6 import 片段与链接 | `site/site/code-block.tsx`（新增 `tokenize.ts`）、`site/pages/component-page.tsx`、`site/catalog/types.ts` |
| 5 | D9 切页焦点与标题；D4 窄屏目录；D10 更新日志页 | `site/router.ts`、`site/pages/component-page.tsx`、`site/vite.config.ts`（读 CHANGELOG） |

每天结束跑 `pnpm check`；第 5 天跑一遍 Apple-Style-Review 看 D4 那个菜单。

## 七、写给 0.3.0 开工那天

- 先写升级指南的骨架（`docs/migration-0.3.md`），改一处类型就往里记一行——不要等到最后回忆。
- `GlassMenu` 的子菜单先于 `GlassMenuButton` 落地：后者的 morph 动效要在菜单结构稳定之后再调，否则调两遍。
- D7 的属性表比对脚本在第一个新组件之前接进 `build:site`——新组件的文档页从第一天起就受它守着。
- R1 的 VoiceOver 走查排在六个新组件都进目录之后、发布之前，一次走完 33 页。
