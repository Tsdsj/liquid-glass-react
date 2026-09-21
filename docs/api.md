# API

`@ttqtt/liquid-glass-react` 共 105 个导出：67 个组件与 Provider、14 个 Hook、24 个常量表、纯函数与诊断工具。所有组件都是 `'use client'`。

样式必须引入一次，顺序不能颠倒：

```ts
import '@ttqtt/liquid-glass-react/tokens.css';
import '@ttqtt/liquid-glass-react/styles.css';
```

## 每个组件都接受的东西

**`ref`** 指向组件渲染出来的那个元素——`Card` 是它的 `<div>`，`TabBar` 是整条 `<nav>`，`GlassSheet` 是 `<dialog>`。两个例外是输入类：`TextField` 和 `SearchField` 的 `ref` 落在 `<input>` 上，因为那才是你要聚焦、要读值的东西。

**HTML 属性**（`id` `style` `data-*` `aria-*` `onClick` …）透传到同一个元素上。`style` 是合并不是替换，组件自己的自定义属性不会被顶掉。

`GlassProvider`、`BackdropToneProvider`、`SharedSurface`、`ToastProvider` 例外：它们只提供 context，自己不渲染元素，所以没有 `ref`。

少数几个键被组件收回了，因为同名但不同义：

| 组件 | 收回 | 为什么 |
| --- | --- | --- |
| `NavigationBar` `GlassPopover` `GlassSheet` `GlassAlert` `GlassDialog` `GlassActionSheet` | `title` | 这里是标题文字，不是鼠标悬停提示 |
| `ListRow` | `value` `onSelect` | `<li>` 的 `value` 是有序列表序号，`onSelect` 是文本选中事件 |
| `GlassSwitch` | `htmlFor` | 它渲染的 `<label>` 自己管着里面的 checkbox |
| `GlassDialog` `GlassSheet` `GlassAlert` | `open` | 开合由受控状态决定，元素本身用 `showModal()` 打开 |
| 带 `defaultValue` / `onValueChange` 的控件 | `defaultValue` `onChange` | 指的是内部原生输入框，不是控件本身 |

`id` 不在收回之列：浮层会拿它当内部 `-title` / `-desc` 的前缀，所以你给的 id 会被用上而不是被忽略。

## 系统

### `GlassProvider`
| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `theme` | `'system' \| 'light' \| 'dark'` | `'system'` | 主题。服务端先输出稳定浅色标记。 |
| `material` | `'regular' \| 'clear'` | `'regular'` | 默认材质。 |
| `renderer` | `'auto' \| 'css' \| 'svg'` | `'auto'` | `auto` 默认走保守 CSS。 |
| `enableSvgAuto` | `boolean` | `false` | 只有在自己的 Chrome / GPU 矩阵上验证过才打开。 |
| `quality` | `'balanced' \| 'high'` | `'balanced'` | 位移贴图分辨率上限 256 / 512。 |
| `density` | `'compact' \| 'comfortable'` | `'comfortable'` | 控件高度 36 / 44。 |
| `transparency` | `'system' \| 'reduced' \| 'opaque'` | `'system'` | 系统偏好不会被更激进的子设置覆盖。 |
| `motion` | `'system' \| 'reduced' \| 'none'` | `'system'` | 同上。 |
| `platform` | `'auto' \| 'desktop' \| 'touch'` | `'auto'` | 用哪一套度量画界面。 |
| `contrast` | `'system' \| 'more'` | `'system'` | 增强对比度。 |
| `strings` | `Partial<GlassStrings>` | 英文 | 组件自己提供的那些文案，见下。 |

`useGlassPolicy()` 返回解析后的策略，含 `resolvedTheme`、`reduceMotion`、`reduceTransparency`、`increaseContrast`、`forcedColors`。

### `platform`：两套度量

`auto`（默认）读的是 `(pointer: fine) and (min-width: 768px)`——有光标，且屏幕宽到画桌面布局是诚实的。带触控板的平板在手机宽度下也报 fine，而那里 36px 的控件是对的问题给了错的答案。解析后的值在 `useGlassPolicy().resolvedPlatform`；显式覆盖时会写成 `<html>` 上的 `data-lg-platform`，`auto` 什么都不写（媒体查询已经是答案了）。

**量的是手，不是眼睛。** 指针比指尖准，所以控件矮一圈；插上鼠标眼睛不会变好，所以字号表一张，两个平台通用。

| | 触摸 | 指针 |
| --- | --- | --- |
| 控件高（小 / 紧凑 / 标准 / 大 / 超大） | 32 / 36 / 44 / 50 / 60 | 28 / 32 / 36 / 44 / 52 |
| 输入框高（小 / 标准 / 大） | 36 / 44 / 52 | 32 / 36 / 44 |
| 命中区下限 | 44（HIG） | 24（WCAG 2.2 指针下限） |
| 字号（全表） | iOS 表，正文 17/22 | **同一张表** |
| 控件标签 | subhead 15 | subhead 15 |
| 输入框里的字 | 至少 16（否则 iOS Safari 聚焦时缩放页面） | 跟随正文 |
| 布局边距 | 16 | 20 |
| 拖动时的形变 | 全量 | 55% |

**度量全部由 CSS 决定，不由 JS。** 一个从 JavaScript 里算出来的高度会让服务端渲染的页面先带着触摸度量到达、再在 hydrate 的那一刻重排一次，而且写成内联样式之后 `platform="desktop"` 永远赢不了它。

这张表**曾经是 macOS AppKit 的那一套**：标准控件 22、正文 13/16、大标题 26/32。改掉它的原因不是口味：

1. **浏览器里的一页不是一个 AppKit 窗口。** 13pt 正文是原生检查器里一行表格的尺寸，旁边有原生菜单栏、窗口大小是用户自己拉的。浏览器自己的默认正文是 16px，那张表从一开始就比同一台机器上别的每一页都小三个像素。
2. **Apple 自己在网页上也不用它。** developer.apple.com 在有鼠标的桌面上，正文 17/25、章节导航行 44 与 30、页题 48/52——用的是 iOS 那张表。这是量出来的，不是记忆。十一个主流组件库文档站在 1600px 下量下来也一致：九个的正文是 16px，默认按钮 32–36 高、标签 14，主按钮 40–42。

仍然保留的两条：**字号下限 11px**（macOS 把脚注和说明文字放在 10pt，网页不行，审计矩阵每一页都在查），以及 **Dynamic Type 在桌面照常工作**。

**仍然不按平台切换的：** 圆角。`radius` 喂给折射几何，按指针种类改变透镜的形状，和改变它的大小是两个决定。HIG 说 macOS 的小控件是圆角矩形而不是胶囊，这条记在待办里，没有在这一轮做。

**「减少动效」覆盖这个库画的每一个元素**，按类名前缀（`lg-` 开头，前缀不是包含，所以你自己的 `mlg-card` 不会被误伤），不是一份组件名单。曾经是名单，于是库里没被写进去的部分在这个设置打开时照常动——而这种错是没有声音的：被记住的那几个组件，正是你会先去检查的那几个。由脚本驱动的动画（比如徽标数字变化时那一下）管不到，所以那些组件自己读 `reduceMotion`。

**最外层的 Provider 会把显式覆盖写到 `<html>` 上**：`data-lg-motion`、`data-lg-transparency`、`data-lg-contrast`，取值就是你传的那个（`'system'` 时不写属性，因为媒体查询已经管了）。这是必须的：玻璃听这三个属性，是因为材质在 JS 里读 policy；而页面转场、标准材质、标签栏这些**只在 CSS 里决定**的东西只认媒体查询，于是 `motion="reduced"` 会变成一个看起来生效、实际什么都没变的开关。只有最外层写——嵌套的 Provider 管的是一棵子树，把它写到 `<html>` 上等于让一张深色卡片替整页做主。卸载时恢复原值，不是清空：应用自己可能也在写这些属性。

### 文案：`GlassStrings` / `useGlassStrings()` / `defaultStrings`

组件自己提供、调用方通常不会传的那几个标签——对话框右上角的关闭、步进器的两个箭头、搜索框的清除、面板拖动手柄。它们也正是**只有读屏用户才会听到**的标签，所以一直是英文也不会在截图里露馅。

| 键 | 默认 | 出现在 |
| --- | --- | --- |
| `close` | `'Close'` | `GlassDialog` |
| `cancel` | `'Cancel'` | `GlassActionSheet` |
| `decrease` / `increase` | `'Decrease'` / `'Increase'` | `GlassStepper` |
| `clearSearch` | `'Clear search'` | `SearchField` |
| `back` | `'Back to'` | `NavigationStack` 的返回按钮 |
| `resizeSidebar` | `'Resize sidebar'` | `SplitView` 的分隔线 |
| `sheetHeight` | `` title => `${title} height` `` | `GlassSheet` 的拖动手柄 |
| `morePathLevels` | `'More levels'` | `PathBar` 折起来的那几级 |
| `moreToolbarItems` | `'More'` | `ToolbarGroup` 的溢出菜单 |
| `collapsePanel` / `expandPanel` | `` title => `Collapse ${title}` `` | `Panel` 的收起按钮 |
| `movePanel` | `` title => `Move ${title}` `` | `Panel` 的标题栏（也是把手） |

```tsx
<GlassProvider strings={{ close: '关闭', cancel: '取消' }}>
```

三级优先：组件上的具体属性（`closeLabel` 等）> `strings` 表 > 内置英文。表可以只写一部分，嵌套的 Provider 会合并。

库**只内置英文**，也不从 `navigator` 或文档猜语言——判断应用说什么语言是应用的事，`locale="zh"` 会把翻译的责任揽到库里，而库跟不上。

> 组件在参数非法时 `throw` 的信息不走这张表：那些是给开发者看的，不是给用户看的，而且抛出的时机拿不到 context。

### `useSizeClass()` / `REGULAR_MIN_WIDTH`

`'compact' | 'regular'`，以 768px 为界——HIG 的 layout 页要求「按尺寸类别决定布局，永远不按设备类型或方向」。CSS 侧 `--lg-margin` 在同一个断点上自己从 16px 切到 20px，所以组件和样式表不会各说各的。

服务端和首次客户端渲染返回 `'compact'`，水合后立刻落到真实值；服务端标记不能动的东西请直接用 CSS 媒体查询。

### `SplitView` / `Inspector`

并排的两到三栏，**只在 regular 环境**；低于 768px 折叠成 `NavigationStack`。

| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `sidebar` | `ReactNode` | — | 前导栏 |
| `title` | `string` | — | **整个视图**一个标题，不是每栏一个 |
| `inspector` | `ReactNode` | — | 尾侧栏，用 `Inspector` 包 |
| `compact` | `{ title, content }` | — | 折叠成栈后压在侧栏上的那一页 |
| `onCompactBack` | `() => void` | — | 紧凑模式按了返回 |
| `sidebarWidth` / `min` / `max` | `number` | 260 / 180 / 400 | 宽度与拖动范围 |
| `sidebarVisible` / `inspectorVisible` | `boolean` | `true` | 栏的显隐。收起和展开有动画；改宽没有 |
| `headingLevel` | `1…6` | `1` | 折叠成栈之后那个标题的层级。嵌在已经有 `h1` 的页面里时调低 |

分隔线是 `role="separator"` 且可聚焦：← → 调宽（Shift 走 40px），Home/End 到两端，双击复位。**只能拖的宽度是键盘用户设不了的宽度。**

`Inspector`（`title?` + children）是**内容层**，不是玻璃：它是窗口的一块区域，在读者和他正在编辑的东西之间放一层半透明面板帮不了任何人。密集控件用圆角矩形而不是胶囊。

> 紧凑模式下的返回不能只靠 `compact` 驱动。那样按下去调用方的选中态没变，下一帧又把详情放回来——一个什么都不做的按钮。组件自己记住「按过返回」，下一次选中（标题变了）再清掉。

**收起的栏留在树上。** 一个不渲染的栏从 260px 到没有，中间没有一帧，读者得自己判断它是收起来了还是从来就不在。栏的宽度收到零之后 `visibility` 关掉，这也是它离开 Tab 顺序和无障碍树的方式。代价是实打实的：收起时你传进 `sidebar` / `inspector` 的内容仍然挂载，它的 effect 还在跑。贵到需要在意的东西请调用方自己卸载——只有调用方知道。

**改宽不走动画。** 拖分隔线和按方向键都是 1:1 的，动画只挂在「显示/隐藏」那一次切换上。读者正在设的宽度必须和他们一样快。

**`max` 会被「实际有多少地方」二次收紧。** 范围是按像素声明的，而视图本身可能比它自己的最大值还窄：一个 420px 的分栏视图如果照样报出 400px 的上限，`aria-valuenow` 会说出一个没有人拥有的宽度。组件量自己的宽度，减掉检查器、分隔线和内容栏必须保住的 160px，取这个和 `maxSidebarWidth` 中较小的那个——`aria-valuemax`、`aria-valuenow` 和画出来的宽度始终是同一个数。

栏的 flex 基准是 `0 1`（可收缩）而不是 `0 0`：容器比「侧栏 + 检查器」还窄时，一个刚性基准会让分栏视图**溢出它自己的盒子**——实测在 320px 的容器里溢出 161px，而它的父级根本不知道这些栏存在。内容栏的基准是 `0`，所以它先让，侧栏只在真的没地方时才变窄。

### `NavigationStack` / `useNavigationStack()`

一摞页面和一条跟着走的导航栏。

| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `root` | `NavigationPage` | — | 栈底那一页，弹不掉 |
| `pages` / `onPagesChange` | `NavigationPage[]` / `(pages) => void` | 自管 | 自己管理栈（接路由）。数组是根页**之上**的那些页 |
| `backLabel` | `'title' \| 'chevron'` | `'title'` | 返回按钮写上一页标题，还是只画箭头 |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1` | 根页大标题的标题层级 |

`NavigationPage` = `{ key, title, subtitle?, trailing?, content }`。

`useNavigationStack()` 返回 `{ push, pop, popToRoot, depth, canGoBack }`，在栈里任意一层可用。**不在栈里会抛错**，不是静默失效——一个什么都不做的按钮比一条报错难找得多。

返回按钮可见的是**上一页的标题**，不是「返回」：方向你已经知道了，目的地你不知道。`aria-label` 是「返回 上一页标题」，两样都说。

压栈、弹栈都把焦点移到新页面的 `<main>`。不这么做，键盘用户点了一行、页面换了，下一次 Tab 会从那一行原来的位置继续——而那一页已经不在了。

切换是交叉淡入加位移，弹栈方向相反，RTL 镜像；减少动效只留淡入，**方向**才是被读成运动的那部分。

> `NavigationBar` 也新增了 `headingLevel`，同样的 1–6。一个永远输出 `h1` 的组件一页只能用一次，而两个 `h1` 会破坏读屏用户靠标题跳转的能力。范围到 6 而不是 3，是因为 3 对唯一真正用到它的地方还不够低：文档站的示例标题本身就是 `h3`，栏停在 3 就会让样例标题和页面目录混成一份。

> `TabBar` 的 `sidebarBreakpoint`（默认 1024）是**另一条轴**：它决定标签栏什么时候变成侧边栏，而不是尺寸类别。两者不共用一个数字是有意的——768 的竖屏平板该有紧凑布局，不该有侧边栏。

### `GlassBackdrop` / `BackdropToneProvider` / `useBackdropTone`
声明一个区域的背景色调（`'light' | 'dark' | 'mixed'`），内部的小玻璃据此翻转明暗。**不做像素采样。**

### `GlassSurface` / `GlassGroup` / `SharedSurface` / `useSharedSurface`
浮动的玻璃面。`GlassSurfaceOptions` 是所有玻璃组件共享的材质属性：

| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `material` | `'regular' \| 'clear'` | 继承 | `clear` + `tone="mixed"` 自动降级为 `regular`。 |
| `backdropTone` | `'light' \| 'dark' \| 'mixed'` | 继承 | 覆盖继承到的背景色调。 |
| `size` | `'small' \| 'large'` | `'small'` | 大玻璃更厚、阴影更深、**不翻转**明暗。 |
| `density` | `'compact' \| 'comfortable'` | 继承 | |
| `renderer` | `'auto' \| 'css' \| 'svg'` | 继承 | |
| `radius` | `number \| 'pill'` | 按密度 | |
| `refraction` | `number` | 按材质 | 0–64 CSS px。 |
| `chroma` | `boolean` | `false` | 色散。成本约三倍。 |

`useGlassSurface(options, ref?, shared?, pressable?)` 是底层 Hook，返回 `{ ref, root, style, attributes, decoration, policy, appearance, size }`，用于自建玻璃组件。

### `LibraryIcon`
库内自绘图标（24×24 / 1.8 描边）：`chevronForward` `chevronDown` `checkmark` `close` `search` `clear` `plus` `minus` `grabber` `ellipsis`。**不含 SF Symbols。**

## 内容层（不含玻璃）

### `Text`
`variant`（11 种 iOS 文本样式）、`emphasized`、`tone`（`primary`/`secondary`/`tertiary`/`quaternary`/`accent`/`destructive`）、`as`（默认 `p`，标题层级不会被推断）、`tabular`。

### `Card` / `Concentric`
`Card`: `radius`(26) `padding`(16) `fill`(`grouped`/`plain`/`secondary`) `raised`。
`Concentric`: `minimum` —— 圆角 = 容器半径 − 内边距，独立出现时回落到 `minimum`。

### `List` / `ListSection` / `ListRow`
`List`: `variant`(`insetGrouped`/`plain`)。
`ListSection`: `header` `footer`（标题式大小写）、`headingLevel`（`1`–`6`，默认 `3`）。分区标题是真标题——读屏用户靠它找到这一组——所以嵌得更深时是把它放到对的深度，不是取消它。
`ListRow`: `label` `secondaryLabel` `value` `leading` `accessory` `href` `onSelect` `disclosure` `destructive` `disabled`。可导航行渲染为真实 `<a>` 或 `<button>`。

`disabled` 的跳转行**不渲染 `href`**，改渲染 `<button disabled>`：带 `href` 的 `<a>` 无论 `aria-disabled` 写什么，回车和点击都照样导航——`aria-disabled` 只是播报，不是实现。

### `Kbd` / `useShortcut()`
`keys`(必填) `aria-label`。快捷键提示。修饰键顺序由组件排：⌃ ⌥ ⇧ ⌘，Command 挨着被它修饰的键。

写法随意（`"⌘K"` `"Cmd+Shift+P"` `"mod k"`），认不出来的原样输出。⌘ ⌥ ⇧ 这些符号读屏念不出来，所以元素自带 `aria-label`（「Command K」），符号本身 `aria-hidden`。

**`mod` 会按平台解析**：苹果设备上是 ⌘，别的机器上是 ⌃。只有 `mod` 会——写 `"ctrl alt delete"` 的人要的就是那几个键，组件不替他改。其余符号原样画出来。

```tsx
useShortcut('mod k', () => setPaletteOpen(true));
<Kbd keys="mod k" />   // 同一张表、同一次解析
```

`useShortcut(keys, handler, options?)`。`options`：`enabled`、`scope`（`RefObject`，限定事件必须来自这个元素内部）、`passive`（不拦截浏览器默认行为）。三条规则都是关于**不触发**的：

- **模态打开时，外层的快捷键全部失效**，只有 `scope` 落在对话框里的还响。否则 ⌘S 会去保存那张正在问你要不要保存的表单背后的文档。
- **不带修饰键的快捷键在输入框里就是一个字符。** 带修饰键的照常触发——输入框里的 ⌘F 仍然是查找。
- **按住不放只算一次命令**（`event.repeat`）。

开发模式下，两个同时存在的命令绑到同一组键会告警：先挂载的那个会赢，而那不是任何人做过的决定。

`GlassMenuItem.shortcut` 用同一个组件渲染，并写进菜单项的 `aria-keyshortcuts`——可见的那串符号是 `aria-hidden` 的装饰，读屏从属性里拿键。

### `MaterialView`
`thickness`(`ultraThin`/`thin`/`regular`/`thick`) `radius`。内容层的半透明手段。

### `Divider`
`orientation` `inset`（逻辑属性，RTL 自动翻转）。

### `GroupBox`
`title` `description` `variant`(`fill`/`outline`) `radius`(14) `padding`(16)。

一圈把相关内容框起来的边界，**标题画在框的外面**（macOS 的画法），并用 `aria-labelledby` 绑到框上——框自己是 `role="group"`，读屏会先说这个分组叫什么。

背景**或**描边，不是两样一起：两个装置做一件事，看起来就是框里套了框。HIG 的 boxes 页还有两条是调用方的事，写在这里因为没别的地方可写：**相对容器要小**（和窗口一样大的框已经分不出任何东西），**不要嵌套**（里面还要分组就用留白和对齐）。

和 `Card` 的分别：卡片是一块**承载**内容的面，有底色、圆角、阴影，是信息流里你会去点的那个东西；分组框是一圈**边界**，它的标题属于这个分组而不属于内容。

### `OutlineView`
`items` `aria-label` `expanded` / `defaultExpanded`(`[]`) / `onExpandedChange` `selected` / `defaultSelected`(`null`) / `onSelect`。

`OutlineNode`：`key` `label` `icon?` `value?` `children?` `disabled?`。`children` 为 `undefined` 是叶子（不带 `aria-expanded`），为 `[]` 是一个空的容器——这是两句不同的话。

有层级的数据，一层层展开收起。HIG 的 outline-views 页定了形状：**"层级只出现在第一列"**，所以它只有一列；`value` 是同一行右侧的读数，**不是第二列**。真正的多列大纲是 `treegrid`——方向键在单元格之间走、列头可排序、列宽可拖——而两列而没有列头也没有单元格导航的东西，对谁都不像表格，对谁也不像树。要多列就不要用这个组件。

**键盘**（`role="tree"`）：↑ ↓ 按**看得见的行**走而不是按 DOM 走，→ 打开一个关着的容器、再按一次才进去，← 收起一个开着的容器、再按一次退到父级，Home / End 到头，打字跳到匹配的名字，Enter / 空格选中。整棵树在 Tab 顺序里**只占一个位置**，并且这个位置跟着选中项走。

**三角形不是按钮**：`treeitem` 里的按钮是树的键盘模型走不到的焦点位，却要在每一行多按一次 Tab。点三角形是开合，点名字是选中；按住 Option 点三角形把这一支整个展开（HIG 的原话）。

**展开状态由你保管。** 库不替你存——它不知道该存到哪，而悄悄放进组件自己的 state 会看起来像记住了，直到刷新。

两条讲清楚的限制：收起的那一层用 `content-visibility: hidden`（不是 `display: none`），既留下一个能做高度动画的盒子，又真的把里面的行移出无障碍树和页内查找；名字太长时在**末尾**省略，HIG 更希望省略号在中间，CSS 没有这个能力。打字跳转匹配的是按键直接产生的字符，经输入法组字打出来的中文不会以单字符按键到达——这一条对库里所有打字跳转的地方都一样。

## 控件

### `GlassButton` / `GlassIconButton`
`variant`: `glass` | `glassProminent` | `plain` | `gray` | `tinted` | `destructive` | `destructiveProminent`。
`icon` / `trailingIcon`：图标插槽。是插槽而不是 children，因为图标和文字之间的间距是系统值。
`tint` / `tintContrast`：这一个按钮的色调，和压在它上面的文字色（默认白）。**一屏仍然只有一个主操作**——tint 换的是它的颜色，不是让你摆三个。开发模式会量**按钮实际画出来的那一对**——渲染后的 `color`，对上按钮自己的色调层、背景和每一层祖先合成到不透明的结果——低于 4.5:1 告警：库挑不出能读的文字色（所以没有全局 `accent`），但它能验调用方挑的那个。

> 早先它比的是 `tint` 对 `tintContrast`，也就是**主操作**按钮画出来的那一对。`tinted`、`plain`、`destructive` 的标签是色调本身压在同色的淡底上，于是护栏量的是屏幕上不存在的两个颜色，并放行了实际 2.87:1 的按钮。改成量渲染结果之后，当场逮到本站自己的绿色确认按钮：4.45:1。
`controlSize`: `small`(32) | `regular`(44) | `large`(50) | `extraLarge`(60)——注意与选择玻璃厚度的 `size` 不同。
`loading` 同时禁用并置 `aria-busy`。`independent` 在共享表面内保留自己的玻璃（玻璃叠玻璃，慎用）。
`GlassIconButton` 的 `aria-label` 是**必填类型**。

### `GlassSegmentedControl`
`items: GlassChoice[]`（2–5 项，文字或图标不混用）、`value`/`defaultValue`/`onValueChange`、`name`、`disabled`、`aria-label`(必填)。
底层是原生 radio。**可拖动**：按住选中分段滑动，选择在拖动过程中即时更新。

「按住**选中**分段」是字面意思：胶囊是你拖的那个东西，按在它上面才会被带走。按别的分段是一次点击——胶囊留在选中项上，松手后滑过去；按住再横着划过去，选中项会跟着走，胶囊仍然是在两个槽位之间滑，不会被扯到手指底下。同样的规则用在 `GlassTabs` 和 `TabBar` 的高亮上。

**动效可以被打断。** 滑行途中再点一下，它从当前位置改道，不会先跳到终点再重新开始。一次点击自始至终不会碰正在跑的过渡：手势要到指针真的移动了 4px 才算数。

### `GlassSwitch`
`checked`/`defaultChecked`/`onCheckedChange`、`label`、`aria-label`(必填，描述**打开后**的状态)。
底层是 `input[type=checkbox][role=switch]`。**可甩**：拖动方向决定结果。打开态为系统绿。

### `GlassCheckbox`
`checked`（`boolean | 'mixed'`）/`defaultChecked`/`onCheckedChange`、`label`、`description`、`aria-label`、`disabled`、`name`/`value`。**内容层**，不是玻璃——HIG：开关、复选框、单选按钮属于窗口内容，不属于窗口边框。

底层是真正的 `<input type="checkbox">`。开和关是两个**形状**（勾 / 空）而不是两种颜色。

`'mixed'` 是**显示**状态，不是读者能选的值：按下半选的父项会全开，因为「一半」不是一个人点击时能表达的意思。它走的是原生 `indeterminate`——那是一个没有对应 HTML 属性的 DOM 属性，必须在渲染之后写到元素上，漏掉的话框**看起来**是半选、**念出来**是未选中。

什么时候用它而不是 `GlassSwitch`：改动需要按保存才生效；设置之间有层级；或者同一组里有好几个——一列复选框对得齐、读起来是一组。

### `RadioGroup`
`label`(必填) `labelHidden` `options`(必填) `value`/`defaultValue`/`onValueChange` `orientation` `name`。内容层。

`options` 是 `{ value, label, description?, disabled? }`。建在共用 `name` 的原生 `<input type="radio">` 上，**而这就是键盘模型**：整组一个 Tab 位，方向键移动并选中，到头绕回，自动跳过不可用项。组件一行都没有覆盖它。

组标题渲染成真正的 `<legend>`：`fieldset` 上的 `aria-label` 各家读屏念得并不一致。每项的 `description` 用 `aria-describedby` 绑定，所以是跟着选项一起念的。

超过五项会在开发模式下告警并建议换 `Picker`——HIG 的原话是一长列单选按钮占地方也读不完。两种状态用 `GlassCheckbox`：有没有那个勾比两个圆圈哪个被填上更快读懂。

### `GlassSlider`
`value`/`defaultValue`/`onValueChange`、`min`/`max`/`step`、`formatValue`（→ `aria-valuetext`）、`minLabel`/`maxLabel`、`marks`、`aria-label`(必填)。
`marks`：`true` 每步一个刻度（步数超过 20 会被拒绝并告警——那时它是一条网格线不是信息），数组是指定位置。只给眼睛看，读屏听到的值来自 input 和 `formatValue`。
**双滑块（range）没做**：两个重叠的滑块需要一套「按下时归谁」的仲裁规则，做半截比不做差。顺延到 0.4.0。
底层是原生 `input[type=range]`。旋钮**只在被拖动时**抬升为玻璃。

### `GlassStepper`
`value` `min` `max` `step` `showValue` `decrementLabel` `incrementLabel` `shiftMultiplier`(10) `aria-label`(必填)。仅用于很小的整数范围。

**按住会连续加减**：0.4 秒后每 90ms 一步，松手、指针取消、或到达上下限都会停。**Shift + 点击**走 `shiftMultiplier` 倍。没有这两样，从 1 到 40 只能点 40 次。

### `GlassProgress`
`value`（省略即不确定）、`total`、`variant`(`bar`/`circular`)、`aria-label`(必填)。

### `GlassBadge`
`count` `max`(99) `tone`(`notification`/`neutral`/`accent`) `dot` `aria-label`。没有内容时不渲染。增强对比度下加一圈边框——白字压红色本身已经是 4.6:1 过 AA，这是一致性：其他表面在这个设置下都会长出边线。

### `Picker`
`label`(必填) `labelHidden` `options: PickerOption[]`（`value` `label` `disabled`）、`value`/`defaultValue`/`onValueChange` `presentation` `disabled` `name`。

**形态是结论，不是参数。** `presentation="automatic"`（默认）按选项数量和尺寸类别决定：**两个选项在任何宽度下都并排**；四个以内且处在 regular 尺寸类别也并排；再多或者到了 compact 就收成弹出式菜单按钮。两个那一档是单独的规则，理由和 `GlassMenuButton` 的开发期告警是同一条——一个两项的菜单要按一下才能读到，比它替掉的两段露出的信息更少。这正是 layout 那一页反复说的那条——按尺寸类别决定布局，永远不按设备类型。写死 `inline` 或 `menu` 只在形态本身就是设计的一部分时用。

`PickerOption` **没有图标插槽**：同一个选择器会在两种形态之间切换，而分段控件不允许一组里图文混排。

可见的那行文字带 `aria-hidden`，控件自己拿同一串字作为名字——念两遍没有意义，而语音控制匹配的是控件的名字，和可见文字逐字相同，所以照样能命中。

服务端渲染时 `useSizeClass()` 按 compact 处理，也就是先渲染菜单形态，到浏览器再按真实宽度决定。

### `ColorWell`
`aria-label`(必填) `value`/`defaultValue`(`#0a84ff`)/`onValueChange` `swatches: ColorSwatch[]`（`value` + **必填的** `label`）、`showValue`(true) `disabled`。内容层。

底下是真正的 `<input type="color">`，铺满整个 44×44 的外壳并且透明——**把它藏起来再用脚本点开，会同时丢掉焦点环、键盘和表单**。点开的是操作系统自己的取色器，带吸管和最近用过的颜色。

`showValue` 默认开：一个控件的全部状态如果就是一种颜色，分不清颜色的人读不出它，想把它念给别人听的人也说不出口。快捷色的选中态是一圈描边而不是「颜色深一点」，强制颜色模式下另有一条 `outline`。

### `Kbd`
见「内容层」一节。

### `DisclosureGroup`
`label`(必填) `secondaryLabel` `open`/`defaultOpen`/`onOpenChange`。底层是原生 `<details>`：页内查找命中折叠内容会自动展开，摘要对读屏就是带展开状态的按钮，回车空格本来就能用。内容层。

高度动画在支持 `interpolate-size` 的浏览器上交给浏览器，否则量一次内容高度；减少动效下直接显示。

## 输入

### `TextField`
`label`(必填) `hint` `error` `leading` `trailing` `labelHidden` `controlSize` `multiline`，其余透传给 `<input>`。

`multiline` 是一个**可辨识联合**而不是一个布尔开关：`<textarea>` 有 `rows` 没有 `type`，`<input>` 反过来，而且 `ref` 指向的元素不一样。压成一个形状会让单行那一边的 `ref` 也变成联合类型，每个现有调用方都得跟着改。不传 `multiline` 时，单行那一套和以前完全相同。

`rows`（multiline 专用）可以是数字或 `'auto'`；`auto` 用 `field-sizing: content`，不支持的浏览器上就是一个不会自己长高但照常能用的 textarea。`controlSize` 改的是**控件**高度，不是文字——低于 16px 会让 iOS Safari 在聚焦时把整页放大。
`error` 存在即标记 `aria-invalid` 并接上 `aria-describedby`。字号不低于 16px。

### `SearchField`
`value`/`onValueChange`、`onSubmitQuery`、`clearLabel`、`suggestions`、`onSuggestionSelect`、`aria-label`(必填)。外层 `role="search"` 的 form，输入框 `type="search"`。

传了 `suggestions`（`{ value, label?, icon? }[]`）它就是一个 combobox：上下键在列表里走，Home/End 到两端，回车选中，Escape **只关列表不清空输入框**（`type="search"` 的 Escape 本来会清空，而因为建议列表恰好开着就丢掉一个查询是件小灾难）。

高亮靠 `aria-activedescendant`，焦点**不离开输入框**——把真焦点移进列表是这个模式最常见的做法，也是错的：下一次按键就到不了输入框了。

**筛选永远是调用方的。** 只有应用知道自己的数据里「匹配」是什么意思，库猜的话对大多数情况都是错的，而且没法覆盖。

### `ContextMenu`
`items`(必填) `aria-label`(必填) `longPressDelay`(500)，children 是它作用的那块区域。

三种触发：`contextmenu`（右键）、触摸长按（手指移动超过 10px 就取消——那是在滚动）、**Shift+F10 与菜单键**（平台打开右键菜单的键盘方式，也是唯一的一条；没有它整个功能只有指针能用）。打开后的键盘模型和 `GlassMenu` 共用同一份代码。

用的是 `popover="manual"`，关闭逻辑自己写。`auto` 会在打开它的那次手势的下一个指针事件上自动关掉——右键是 pointerdown → contextmenu → **pointerup**，菜单于是在抬手时把自己关了。延迟一帧看起来修好了其实没有：那一帧和 pointerup 是竞态，换一个窗口高度就又坏了。

滚动时菜单**跟着内容走**而不是关闭：锚点存的是文档坐标。右键会移动焦点，移动焦点会滚动页面——「滚动就关」意味着它会被自己引起的滚动关掉。

> **里面的每一条都必须有别的路径能做到。** 右键菜单是给知道它存在的人的快捷方式；只活在右键菜单里的命令，大多数人永远找不到。这一条代码检查不了，所以写在这里。

## 导航

### `GlassToolbar` / `ToolbarGroup` / `ToolbarSpacer`
工具栏本身**没有背景**；每个 `ToolbarGroup` 才是玻璃。
`GlassToolbar`: `orientation` `aria-label`(必填)。整条是一个 Tab 停靠点，方向键跨分组移动。
`ToolbarGroup`: 继承全部 `GlassSurfaceOptions`，外加 `prominent` 和 `items`。开发模式下同组混排图标与文字会给出警告。
`ToolbarSpacer`: `variant`(`fixed`/`flexible`)。

**`items` 是溢出菜单的入口。** 把这一组的按钮作为数据（`{ key, label, icon?, onSelect, disabled?, shortcut? }`）交给它，组就会量自己的宽度，把放不下的从后往前收进尾部的「更多」菜单。HIG 说系统在 macOS 和 iPadOS 上会自动这么做，并且明确要求**不要手工加一个溢出菜单**；同一页还说尾侧的项在任何窗口宽度下都保持可见，所以会折叠的是你给了 `items` 的那些组，不是整条工具栏。

给 `children` 就没有这个能力，这是有意的：要把一个按钮放进菜单，组件得先知道它**叫什么**，而从任意子节点里把名字读回来是一种会在"有人传了一个没有标签的图标"那天悄悄失败的猜测。

收起来的项在菜单里，不是没了——键盘和读屏照样够得到。

### `PathBar`
`items: PathComponent[]`(必填) `aria-label`(必填)。`PathComponent` = `{ key?, label, icon?, onSelect?, href? }`。

根在前、当前项在最后。最后一项不给 `onSelect` / `href`：你已经在那儿了，它带 `aria-current="page"` 而不是一个指向自己的链接。

**中间放不下就折。** HIG 的 path-controls 页说路径控件"在列表太长装不下时，会隐藏首尾之间的名字"——所以这是量出来的，不是一个层数上限；折起来的几级进「…」菜单，首尾两级永远不折。层级之间的箭头由样式表画，不在无障碍树里，因为读屏在每两级之间念一次"箭头"是在念标点。

**放在窗体里，不要放进工具栏**：这条也是 HIG 的原话。所以它是内容层，不是玻璃。

### `TabBar`
`items: TabBarItem[]`(必填，3–5 项) `current` `search` `minimizeOnScroll` `sidebarBreakpoint`(1024) `sidebarHeader` `accessory` `aria-label`(必填)。
`TabBarItem`: `key` `href` `label` `icon` `badge` `badgeLabel` `onSelect`。
是 `<nav>` + 链接 + `aria-current="page"`，**不是** tablist。宽屏自动变形为侧边栏。

`sidebarBreakpoint` 是一条宽度，不是一个开关：给一个大到够不着的数，它就在所有宽度上保持胶囊形态，由调用方决定把它**放**在哪。这个站点就是这么用的——胶囊放进顶部通栏，窄屏下它自己 `position: fixed` 落到屏幕底部。

### `Sidebar`
`aria-label`(必填) `header` `footer` `side`(`leading`/`trailing`) + `GlassSurfaceOptions`。自动使用大玻璃。

### `NavigationBar`
`title`(必填) `leading` `trailing` `largeTitle`(true) `subtitle`。大标题滚出视野后紧凑标题才出现——两者不会同时可见。

### `GlassTabs`
`items: GlassTab[]`（含 `content`）、`value`/`defaultValue`/`onValueChange`、`aria-label`(必填)。**页内**标签页，会换面板。

### `Grid`
`minItemWidth`(220) `columns` `gap`(16)，内容层。

`minItemWidth` 而不是断点列表：网格被告知一项最窄多少，列数它自己算，所以同一个网格放进侧栏、放进分栏的中间列、和铺满整宽都对——而它所在的那个盒子往往不是窗口。

`gap` 下限是 8（HIG 的控件最小间距，也是焦点环需要的地方），传更小的值开发模式会告警。**没有 `itemPadding`**：第一版给每个子元素加 padding 来腾这个地方，结果和子元素自己的 padding 打架并且输了——实测 `.lg-button` 的 padding 赢了，那个设置什么也没做。腾地方是 gap 的事。

**不做虚拟化。** 那是另一个组件、另一组取舍（量高度、滚动锚定、以及一套要在「行还不存在」时也能用的键盘模型），在这里做半截会让以后做真的那个更难。

### `Form` / `FormSection` / `FormRow`
`Form` 是真正的 `<form>`。`FormSection`：`header`（真 heading，正常大小写）、`footer`（挂 `aria-describedby`）。`FormRow`：`label` `description` `error` `layout`(`inline`/`stacked`)。内容层。

**行的标题是 `<span>` 不是 `<label>`**，这是想清楚之后的选择。显而易见的写法是把控件包进 `<label>`，让那行字也成为命中区——试过，不行，而且两个原因指向同一件事：库里每个控件**本来就带自己的名字**（`GlassSwitch`、`GlassStepper`、`GlassSlider` 都强制要求 `aria-label`，`TextField` 收一个真的 `label`），包一层是加第二个名字而不是加第一个；并且 `GlassSwitch` 和 `TextField` 自己就渲染 `<label>`，而 `<label>` 套 `<label>` 是非法的，浏览器的答复是外面那个直接失效——实测「点那行字什么也不会发生」。

所以行只负责排布和分组，命名留在它本来就在的地方。想让文字也成为命中区，就给控件 `labelHidden`，让它自己拥有那行字。

### `PageControl`
`count`(必填) `page`/`defaultPage`/`onPageChange` `aria-label`(必填) `formatPage` `orientation`。

表示在一组**有顺序**的页面里的位置。没有顺序的一组目的地是 `TabBar`。是一个 tablist：整体一个 Tab 停靠点，方向键在内部移动，Home/End 跳两端；每个点是真按钮且有自己的名字（「3 / 6」）。**顺着它拖可以翻页**。

超过 10 个点开发模式告警——数不过来的点不再表示位置。

点画出来 7px，触摸时纵向（横排时）撑到 44。**不是四面都撑**：点间距 18px，四面各撑 44 会让相邻点的命中区互相覆盖，后面那个赢——实测「点第一个选中了第二个」。沿着排列方向它们是相邻目标，本来就共享中间那段。

### `ScrollEdge`
`targetRef` `edge`(`top`/`bottom`) `variant`(`soft`/`hard`) `height`(44)。一个滚动视图只用一个。

`targetRef` 省略时监听**页面本身**。这一种写不成 ref：页面的 scroll 事件派发在 `document` 上，永远到不了 `documentElement`。

## 布局

### `Screen`

把「内容延伸到栏下面、安全区打在栏上、一个视图一个边缘效果」做成默认行为，而不是每个应用各自重推一遍。

| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `top` / `bottom` | `ReactNode` | — | 浮在上/下的导航栏、工具栏、标签栏 |
| `scroll` | `'container' \| 'page'` | `'container'` | 自己成为一个 100dvh 的滚动视图，还是让文档滚动、只把栏钉在视口上 |
| `edge` | `'soft' \| 'hard' \| 'none'` | `'soft'` | 栏下的滚动边缘效果 |
| `edgeHeight` | `number` | `44` | 溶解高度。分栏的各栏要一致 |
| `inset` | `number` | `12` | 栏与内容之间额外留白，加在量到的栏高之上 |

内容预留的是**量出来的**栏高，不是写死的数字——栏有多高取决于它自己的内容，而内容会随文字大小变。安全区的内边距打在栏上而不是内容上：打在内容上会在一条本来就已经避开刘海的栏上方再留一道空白。

文档站自己用的是 `scroll="page"`。`--lg-screen-top` / `--lg-screen-bottom` 会发布到 `.lg-screen` 上，页内其他要吸顶的东西可以读它。

## 浮层

全部支持 `trigger` / `open` / `defaultOpen` / `onOpenChange`，并自动使用 `size="large"`。

### `GlassPopover`
`title`(必填) `description` `align` `placement`。非模态，锚定触发器，**带一个指向触发器的箭头**。
`placement`: `'below' | 'above' | 'auto'`，默认 `auto`——下方放不下就翻到上方。指定方向时如果会超出屏幕，仍会被拉回可视范围内。落在哪一侧会写成 `data-placement`，箭头据此贴在朝向触发器的那条边上。

**紧凑尺寸（< 768px）下换成底部面板**：通栏、贴底、没有箭头——面板钉在屏幕底部之后，箭头已经没有东西可指了。内容、角色和键盘路径不变，只换形状。

### `GlassMenuButton`
自带菜单的按钮，菜单从按钮里长出来。

`kind="pullDown"`（默认）：`label` + `items: GlassMenuItem[]`。按钮说自己做什么，标签不随选择变化。
`kind="popUp"`：`options: GlassMenuOption[]`（`value` `label` `icon` `disabled` `separatorBefore`）+ `value`/`defaultValue`/`onValueChange` + `aria-label`(必填)。按钮上显示的就是当前选中项；菜单项是 `menuitemradio`，打开时焦点直接落在**已选中**的那一项上。

其余同 `GlassButton`（`variant` `controlSize` 及全部 HTML 属性，`ref` 指向按钮）与 `GlassMenu`（`align` `placement`）。收回 `value` 与 `type`。

少于三项时开发模式给一条告警：菜单要先打开才看得到，三项以下它露出的比它替掉的那几个按钮还少。

### `GlassMenu`
`items: GlassMenuItem[]`（`key` `label` `onSelect` `icon` `checked` `shortcut` `destructive` `disabled` `separatorBefore`）、`aria-label`(必填) `align` `placement`（同上）、`selection`。
键盘：上下移动、Home/End、键入查找、Escape 关闭回焦、Tab 关闭。

`selection`：勾在这个菜单里表示什么。`multiple`（默认）是一组互相独立的开关，项是 `menuitemcheckbox`；`single` 是一组里选一个，项变成 `menuitemradio`——这才告诉读屏「选了这个就会取消别的」。

`alternate?: GlassMenuAlternate`（`label` `onSelect` `shortcut` `destructive`）：按住 Option 时这一项**原地变成**的样子——「关闭」变「全部关闭」，「复制一份」变「存储为…」。不是多一行，这正是长菜单能保持短的原因。松开、或者窗口失去焦点（按住 ⌘Tab 走掉时 `keyup` 永远不会来），都会还原。

> 替代项永远只是快捷写法。按住修饰键这件事本身不可发现，所以**不能有命令只住在那里**——它对不知道有这回事的人，以及对一次只能按一个键的人，等于不存在。

### `MenuBar`
`menus: MenuBarMenu[]`（`key` `title` `items: GlassMenuItem[]` `selection` `disabled`）、`aria-label`(必填)、`open` / `defaultOpen` / `onOpenChange`（当前打开的是哪个菜单的 `key`，`null` 表示没有）。`role="menubar"`，标题是 `menuitem`。

`selection` 和 `GlassMenu` 上的那个是同一个，但它按**菜单**给而不是按栏给——一条菜单栏里两种都有是常态：「外观」是三选一，三个辅助功能开关各自独立。把一组单选画成复选框，等于告诉读屏用户「选了另一个，这个还留着」，而那不是实际发生的事。

和一排菜单按钮的区别全在**打开之后**：指针移到另一个标题上时开着的菜单跟着走，左右方向键也是——**一次按键换一个菜单**，不是先关再开，中间没有一帧是空的。整排只占一个 Tab 位，下方向键打开，菜单内部是 `GlassMenu` 的键盘模型，Escape 关闭并把焦点还给标题。

- **一直显示同一组菜单项。** `disabled` 在整个菜单和单条命令上都是「仍然画出来，只是不能用」。菜单栏是靠位置记住的。
- **标题尽量一个词**，窗口窄的时候这条栏要扛得住。
- 指针跟随只在**真的移动过**之后才算数：用鼠标点开一个菜单会把光标停在那个标题上，之后用方向键走时浏览器会在原地补发一个指针事件，照单全收就会把菜单拽回光标底下。手指不参与——划过去的那一路不该开四个菜单。
- 玻璃只在这条栏上，标题是栏上的项。

### `GlassSheet`
`title`(必填) `description` `detents`(`['medium','large']`) `defaultDetent` `onDetentChange` `grabber`。
可拖动，松手弹簧停在最近停靠点；满高时变不透明并贴住边缘。只动 `transform`。

**整块面板都是把手**，不只是顶部那条横条。判据是滚动位置而不是碰到了哪个元素：内容滚到顶时，往下拖是收起；往上拖只有在还有更高一档可长时才归面板，到了最高一档往上拖就是在读内容。横向拖动不接管。在方向定下来之前不 `preventDefault`、不捕获指针，所以面板里的按钮和输入框照常可用。

**在指针平台上它是另一个东西，API 不变。** HIG 的 sheets 页对 macOS 的描述只有一句："一张浮在父窗口之上、带圆角的卡片"，父窗口压暗。上面那一整段没有一句还成立：没有可以升起的边缘，没有要跟的手指，也没有理由去拖一个本来就该是这个大小的东西。所以有光标的宽窗口下，面板从窗口顶部落下、居中、按内容定大小、没有横条。**`detents` 这时不起作用**，写在这里而不是让它悄悄为真。

### `Panel`
`title`(必填) `open` `defaultOpen`(true) `onOpenChange` `collapsed` `defaultCollapsed` `onCollapsedChange` `position` `defaultPosition`(`{x:24,y:24}`) `onPositionChange` `width`(280) `onClose` `accessory`，外加全部 `GlassSurfaceOptions`。

浮在内容之上的一扇小窗，非模态：没有遮罩、没有焦点陷阱，背后照常能用——这正是它和 `GlassDialog` 的分界，也是 `role="dialog"` + `aria-modal="false"` 的由来。用它来"一边调一边看"：字体、颜色、查找替换、检查器。

**标题栏就是把手。** HIG 说面板"需要一条标题栏，好让人把它放到想要的位置"；只能用鼠标摆的位置是有些人摆不了的位置，所以标题栏可以聚焦，方向键移动，Shift 走大步。位置会被夹在最近的定位祖先里——包括**打开的那一刻**，不只是拖动时：`defaultPosition` 是在任何东西被量之前的一个猜测，容器比它窄的时候，面板会开在框外面被裁掉，而被裁掉的正是能把它拖回来的那条标题栏。

没有最小化（HIG：一般不要提供），`collapsed` 是把它卷成一条标题栏。**HUD 那一种没有做**：HIG 允许深色半透明的面板，然后用一整段讲什么时候别用——系统自己的控件大多不配它，它也不跟随浅深色设置。那会是一个文档大半是警告的属性；需要的话，`material="clear"` 压在图片上是同一个意思，而且自带压暗规则。

容器需要 `position: relative`。

### `ToastProvider` / `useToast`
`ToastOptions`: `message`(必填) `action` `duration`(6000) `dismissLabel`。

有**关闭按钮**，**Escape 关最新一条**。此前只能等六秒或者把指针放在上面悬停暂停，键盘用户两样都没有。Escape 不 `preventDefault`：浮层里的 Escape 属于浮层，浮层会先拦下它。

### `Banner`
`title`(必填) `message` `tone`(`info`/`success`/`warning`/`error`) `icon` `action` `onDismiss` `dismissLabel` `placement`(`inline`/`top`)。大玻璃。

**和轻提示的分工是「这件事发生在哪」。** 轻提示报告用户刚做完的那一下，几秒后自己走；横幅报告别处发生的事——同步失败了、有新版本——一直留到被处理掉，所以它有标题、有一整句话的余地、有关掉它的办法。必须先回答才能继续的，两个都不对，那是 `GlassAlert`。

`placement` 默认 `inline`：**一个自己决定位置的组件没法被组合**，而布局本来就知道自己的顶在哪（放进 `Screen` 的 `top` 插槽即可）。要钉在窗口顶部就传 `top`。

`onDismiss` 是「可关闭」的开关：传了才有关闭按钮，也才可以往上一甩关掉。它在**退场播完之后**才到达（约 220ms，减少动效下立即）——横幅得还在树上才动得了，而把它从树上拿走的是调用方。调用方出于别的原因把它移除时就没有退场，这一点没有办法：谁都没法给一次已经发生的渲染补动画。上滑只是关闭按钮之外的一条路，不是替代——没有可见入口的手势，对键盘用户等于不存在。`role="status"` + `aria-live="polite"`：它是来汇报的，不是来打断的。

语气自带的图标和 `ToastTone` 用同一套，同一件事不会在两个地方长得不一样。

### `Tooltip`
`content`(必填) `children`(必填，一个元素) `delay`(600) `placement`(`above`/`below`)。

把图标按钮的名字显示出来给鼠标用户。三条它不会破的规矩：

- **触摸屏上整个组件不渲染**（`(hover: hover) and (pointer: fine)` 不匹配就返回 children 本身，不加包裹层、不加属性）。没有悬停的地方，提示只能变成「点一下先弹个东西挡住按钮」。
- **用 `aria-describedby` 关联，不是 `aria-labelledby`**。它是补充说明；控件自己的名字必须另外给。
- 聚焦立刻出现（那是有意为之的动作），悬停要等 `delay`。Escape 关掉，不影响别的。同一时刻只有一个。

### `GlassAlert`
`title`(必填) `message` `actions: AlertAction[]`（最多 3 个，`role`: `default`/`cancel`/`destructive`）。
标题加粗左对齐。存在破坏性操作时焦点落在取消上，Escape 执行取消。

### `GlassActionSheet`
`actions: ActionSheetItem[]`（约 6 个以内）、`title` `message` `cancelLabel` `onCancel` `align` `aria-label`(必填)。破坏性项自动排到最后。

### `GlassDialog`
`title`(必填) `description`(必填) `dismissOnBackdrop` `closeLabel`。基于原生 `<dialog>` + `showModal()`。

### `CommandPalette`
`commands: PaletteCommand[]`（`id` `label` `onSelect` `group` `detail` `icon` `shortcut` `keywords` `disabled`）、`title`(必填) `placeholder` `shortcut`(`'mod k'`) `query` / `defaultQuery` / `onQueryChange` `filter` `emptyLabel` `limit`(50)，以及 `trigger`。

一个输入框、一张列表、一次按键到达。`title` 只念不画——面板上方的标题栏是 Spotlight 从来没有过的东西。

- **虚拟焦点**：输入框是 `role="combobox"`，列表是 `listbox`，高亮那一行由 `aria-activedescendant` 点名，**真正的焦点一直在输入框里**。把焦点移进列表是这类控件最常见的做法，也正好废掉它唯一的用途——下一个字得还能打进去。上下键移动高亮并跳过不可用项，Home/End 到两端，回车执行，Escape 关闭并把焦点还回原处。
- **`filter`**：默认规则是输入的每个词都要在 `label` / `group` / `detail` / `keywords` 里出现过，大小写和顺序都不管。传一个函数换掉它，传 `false` 表示「给你的列表就是答案」（自己排过序、或者问过服务端）。
  > 这和 `SearchField` **坚持不自带筛选**不矛盾：搜索框的结果可能在任何地方，只有应用知道「匹配」对它的数据意味着什么；而面板一开始就拿到了全部命令，对一个已经握着整份清单的函数没什么好隐瞒的。
- **两个绑定，不是一个开关。** 打开它的快捷键是应用级的，按 `useShortcut` 的规则在有模态窗时不响；关掉它的那个限定在面板内部，所以是那条规则的例外——同一组键，从它自己打开的东西里面按。`shortcut={null}` 表示由应用自己决定怎么打开。
- **它不记任何东西**：没有历史，没有「最近使用」，什么都不往外写。要这些的话由应用自己给 `commands` 排序，并提供清除的入口。
- **它是快的那条路，不是唯一那条路。** 只住在面板里的命令，等于只对已经知道它存在的人存在——每条命令都该在菜单栏或工具栏里有位置。这一条代码检查不了，所以写在这里。

### `ToastProvider` / `useToast`
`toast({ message, action?: { label, onSelect }, duration? })`。可逆操作用它提供撤销，而不是每次都弹确认框。区域为 `role="status"` + `aria-live="polite"`，悬停或聚焦时暂停计时。

## Hook 与工具

`useGlassPolicy` `useGlassSurface` `useBackdropTone` `useSharedSurface` `useMediaQuery` `useFusion` `usePull` `useToast`

`attachPull` `elementAt`

浮层的装配件（`triggerElement`、`usePopover`、`lockScroll`）与选中透镜的内部件（`useSelectionLens`、`lensOrigin`、`trackSpan`）不在公开 API 里：它们假定了特定的 DOM 结构和样式表里的变换链，单独拿出来用不了。

几何与弹簧（与组件同源，直接从包根导入）：
- `concentricRadius(containerRadius, inset, { minimum, maximum })` / `concentricInset` / `capsuleRadius`
- `createSpring(initial, apply, config)` / `advanceSpring` / `springAtRest` / `defaultSpring`
- `getGlassDiagnostics()` / `clearGlassCache()`
- `supportsSvgBackdrop()` — 这个浏览器认不认 `backdrop-filter: url(#…)`。只是语法检测，不代表效果正确，也不是任何认证；用来决定要不要给用户一个「打开折射」的开关，因为一个按下去什么也不会变的开关比没有这个开关更糟。

## 类型

`GlassMaterial` `GlassRenderer` `GlassTheme` `GlassDensity` `GlassTransparency` `GlassMotion` `GlassContrast` `GlassSize` `GlassQuality` `BackdropTone` `StandardMaterial` `TextStyle` `TextSize` `GlassPolicy`

常量表：`materialTokens` `densityTokens` `motionTokens` `spacingTokens` `radiusTokens` `textStyles` `textScale` `zIndexTokens` `defaultPolicy`
