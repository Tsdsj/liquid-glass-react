# 下一期开发计划：0.0.2 → 0.3.0

写于 2026-09-16，0.0.1 发布之前。三条线：文档站体验、已有组件的缺陷与 API、新组件。

每一条都先写**证据**再写**要做什么**——证据来自代码、测试和上一轮审查，不是想象。标了「待复现」的是疑点，没有复现之前不算缺陷，也不排期修。

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

| # | 证据 | 要做什么 |
| --- | --- | --- |
| D1 | 浮层 7 页只有 7 个示例，输入 2 页 3 个；`DemoEntry` 支持多示例但大半页面只用了一个 | 每页至少 3 个示例，各回答一个决定：**状态**（禁用 / 加载 / 错误）、**尺寸与密度**、**压在媒体上时**。示例数是给读者看的，不是凑数：一个示例只讲一件事 |
| D2 | `site/site/code-block.tsx` 是裸 `<pre>`，只有复制按钮，没有语法高亮 | 加高亮。两条路：自写一个 ~150 行的 TSX 分词器（零依赖、CSP 不变）；或构建期用 shiki 生成静态 HTML（颜色准、但引入依赖）。**建议前者**——站点自己就是「零外部请求」用例守着的 |
| D3 | 没有可交互的属性面板；`PropsTable` 是静态表 | 每页选一个「主示例」，右侧挂属性旋钮（`variant` / `controlSize` / `material` / `backdropTone` / `density`），改动即时反映到示例和代码块。数据模型：`DemoEntry.controls?: ControlSpec[]`。这是 antd / MUI 读者的默认预期 |
| D4 | 右侧目录 `.outline` 只在 ≥1280px 显示（`app.css:237`）；以下宽度没有页内导航 | 窄屏改成吸顶的「本页内容」按钮，点开是 `GlassMenu`——顺便让站点用自己的菜单 |
| D5 | ⌘K 搜索只索引组件名（`searchDocs`） | 索引扩到示例标题、属性名、基础与指南的章节标题；结果分组显示，命中属性时直接跳到 API 表对应行 |
| D6 | 每页缺三样常规的东西：`import` 语句、相关组件、「查看源码 / 报告问题」链接 | 页头加 import 片段（可复制）；`ComponentDoc` 加 `related: string[]`；页脚加两个链接指向 GitHub |
| D7 | `PropsTable` 手写，代码里的注释说明了为什么不用运行时反射——但没有任何东西保证它和 TS 接口一致 | 构建期用 TypeScript 编译器 API 把每个 `*Props` 的键读出来，和 `docs.props` 逐项比对，缺一个就让 `pnpm build:site` 失败。仍然不做运行时反射，理由不变 |
| D8 | 折射默认关（`enableSvgAuto: false`），站点自己没有一个折射面；概览首屏就是普通磨砂 | 首屏加一个开关：「打开折射」。同一块玻璃，一按就看出差别；WebKit / Firefox 下开关旁边说明「这个浏览器没有折射」 |
| D9 | `router.ts` 切页只 `scrollTo(0)`，不改 `document.title`，不把焦点移到 `main` | 切页时设标题、把焦点放到 `#main`（已有 `tabIndex`）；这是屏幕阅读器用户知道「页换了」的唯一途径，也是 R1 里能靠代码解决的那一小部分 |
| D10 | 站内没有更新日志页，读者要去仓库翻 `CHANGELOG.md` | 构建期把 CHANGELOG 渲染成 `#/changelog`，版本号已经通过 `__LG_VERSION__` 进站了 |

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

**A. 29 个组件里 21 个不转发 `ref`。**

```text
有 forwardRef：GlassSurface、GlassButton、Card、MaterialView、TextField、SearchField、Sidebar、ToolbarGroup
没 有：Badge、Progress、Segmented、Slider、Stepper、Switch、NavigationBar、ScrollEdge、TabBar、Tabs、
        Popover、Menu、Dialog、Sheet、Alert、ActionSheet、Divider、List、ListRow、Text
```

后果是调用方拿不到节点：不能量尺寸、不能把 `ScrollEdge.targetRef` 指向自己的 `List`、不能用第三方库锚定。全部补上。**验收**：一条浏览器用例遍历目录里每个组件，挂 `ref` 后断言拿到的是 `HTMLElement`。

**B. 一批组件不透传 HTML 属性。** `GlassProgress`、`GlassStepper`、`NavigationBar`、`ScrollEdge` 只收 `className`；`Segmented` / `Slider` / `Switch` / `Tabs` / `TabBar` 和所有浮层也是。写不了 `style`、`id`、`data-*`、`aria-describedby`。统一 `extends Omit<HTMLAttributes<…>, 冲突键>`，冲突键逐个列出（比如 Segmented 内部生成的 `id`）。

**C. `placement` 有实现没接口。** `anchor.tsx:43` 内部支持 `'below' | 'above' | 'auto'`，`GlassPopover` / `GlassMenu` 只暴露 `align`。暴露出来，默认 `auto` 不变。

**D. 菜单只有一层，分组只有 `separatorBefore`。** 没有分组标题、没有子菜单（known-limitations 已记）。HIG 的菜单有 section header，iOS 14 起也有子菜单。加 `sectionLabel?: string` 与 `items?: GlassMenuItem[]`（子菜单）；子菜单的键盘模型（→ 进入、← 返回、Escape 逐层关）要有用例。

**E. `GlassSheet` 只有 `medium` / `large` 两个停靠点。** 加自定义：`detents: Array<'medium' | 'large' | number>`，数字 ≤1 当比例、>1 当像素。停靠动画和拖拽逻辑已经按比例写，扩展成本低。

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
| `GlassProvider` | `accent` 属性（见「待拍板」第 3 条） | — |

**H. 只有一条开发模式告警。** 再加三条，都是审查里靠人眼查过的规则，改成代码守：一个共享表面里出现两个 `glassProminent`（一屏一个主操作）；小玻璃套小玻璃；`material="clear"` 用在没声明色调的地方（现在静默降级为 `regular`，调用方不知道）。每条只在开发模式、每个节点告警一次。

### 2.2 待复现（是疑点，不是缺陷）

| 疑点 | 为什么怀疑 | 怎么复现 |
| --- | --- | --- |
| Strict Mode 下 `usePull` / `useFusion` 的 rAF 循环重复启动 | known-limitations 明说开发 Strict Mode 未跑过 | 站点开发模式套 `<StrictMode>`，按住分段控件，数 `requestAnimationFrame` 调用次数 |
| `defaultOpen` 对话框的 hydration 不匹配 | SSR 用例只断言服务端输出了安全标记，没跑 hydrate | 用 `react-dom/server` 出 HTML，再 `hydrateRoot`，看控制台 |
| Firefox < 129 没有 `@starting-style`，Sheet / Dialog 进出动画退化成什么 | fallback 用例只测材质，没测浮层动画 | Playwright Firefox 打开 Sheet，量 `transform` 在 0ms 与 200ms 的差 |
| Windows Chrome 关闭硬件加速时 `backdrop-filter` 路径 | 从没在 Windows 上跑过 | 需要一台 Windows 机器；排进「需要人做的事」 |

复现出来的按 alpha.3–6 的流程走：先写一条会失败的 Playwright 用例，修，用例留下。没复现出来的从表里删掉，写一句为什么。

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

### 第一批（0.3.0）

| 组件 | 是什么 | 层 | 为什么现在做 |
| --- | --- | --- | --- |
| **`GlassMenuButton`** | 按下弹出菜单的按钮。HIG 分两种：**pull-down**（按钮是动作，菜单是更多动作）和 **pop-up**（按钮显示当前选择，菜单换选择）。一个组件，`kind` 属性区分 | 玻璃 | 现在 `GlassButton` + `GlassMenu` 用 `trigger` 拼得出来，但 iOS 26 的关键动效——**菜单从按钮里长出来**（morph）——拼不出来。这是 Liquid Glass 最有辨识度的动作之一 |
| **`ContextMenu`** | 右键 / 长按弹出的菜单 | 玻璃 | 复用 `GlassMenu`。新增的是触发模型：触摸端长按 500ms、按住期间内容微缩预览、`contextmenu` 事件在键盘上是 Shift+F10 / Menu 键 |
| **`DisclosureGroup`** | 可展开的一组内容，箭头旋转 | 内容 | 原生 `<details>` + 动画高度。列表页、设置页到处要 |
| **`PageControl`** | 一排圆点表示第几页 | 玻璃（iOS 26 是一枚小胶囊） | 轮播、引导页的必需品；可拖动——顺着胶囊拖就翻页，用 `usePull` |
| **`Tooltip`** | macOS 的 help tag：悬停或聚焦 600ms 后出现的说明 | 玻璃（小） | 现在图标按钮只有 `aria-label`，鼠标用户看不到。指针门必须严：触屏上不出现 |
| **`Kbd`** | 快捷键提示 ⌘K | 内容 | 菜单的 `shortcut` 字段现在是纯文本；站点搜索按钮也在手画。很小，但到处要 |

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
| **0.0.2**（发布后 1–2 周） | 文档站 D2、D4、D6、D9、D10；组件 A、B、C、H；2.2 的前三条复现 | 纯新增，无破坏 |
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

## 六、需要拍板的

1. **属性面板的范围**——每页一个主示例挂旋钮（建议），还是每个示例都能调？后者工作量三倍，读者未必需要。
2. **代码高亮**——自写分词器（零依赖，CSP 不变，颜色够用）还是构建期 shiki（颜色准，多一个依赖）？
3. **`GlassProvider` 要不要 `accent` 属性**——只写一个色值不够，`--lg-accent-contrast` 也得配套，而对比度是不能自动算的（那是像素决定）。要么接受调用方给一对色值，要么维持现在的 CSS 变量方案不动。
4. **子菜单**——嵌套（macOS 风格，悬停展开）还是就地展开（iOS 风格，点一下换一屏）？两者键盘模型不同，只做一种。
5. **Sheet 自定义停靠点的写法**——`detents={['medium', 0.3, 420]}` 这种混合数组，还是 `detents={[{ fraction: .3 }, { height: 420 }]}` 显式对象？前者短，后者不用猜。
6. **新组件第一批的优先级**——六个里如果只能先做三个，我的顺序是 MenuButton（动效辨识度）→ Tooltip（现在图标按钮对鼠标用户是哑的）→ DisclosureGroup（设置页刚需）。
