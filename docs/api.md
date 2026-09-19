# API

`@ttqtt/liquid-glass-react` 共 92 个导出：58 个组件与 Provider、11 个 Hook、23 个常量表、纯函数与诊断工具。所有组件都是 `'use client'`。

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
| `contrast` | `'system' \| 'more'` | `'system'` | 增强对比度。 |
| `strings` | `Partial<GlassStrings>` | 英文 | 组件自己提供的那些文案，见下。 |

`useGlassPolicy()` 返回解析后的策略，含 `resolvedTheme`、`reduceMotion`、`reduceTransparency`、`increaseContrast`、`forcedColors`。

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
| `sidebarVisible` / `inspectorVisible` | `boolean` | `true` | 栏的显隐 |

分隔线是 `role="separator"` 且可聚焦：← → 调宽（Shift 走 40px），Home/End 到两端，双击复位。**只能拖的宽度是键盘用户设不了的宽度。**

`Inspector`（`title?` + children）是**内容层**，不是玻璃：它是窗口的一块区域，在读者和他正在编辑的东西之间放一层半透明面板帮不了任何人。密集控件用圆角矩形而不是胶囊。

> 紧凑模式下的返回不能只靠 `compact` 驱动。那样按下去调用方的选中态没变，下一帧又把详情放回来——一个什么都不做的按钮。组件自己记住「按过返回」，下一次选中（标题变了）再清掉。

**`max` 会被「实际有多少地方」二次收紧。** 范围是按像素声明的，而视图本身可能比它自己的最大值还窄：一个 420px 的分栏视图如果照样报出 400px 的上限，`aria-valuenow` 会说出一个没有人拥有的宽度。组件量自己的宽度，减掉检查器、分隔线和内容栏必须保住的 160px，取这个和 `maxSidebarWidth` 中较小的那个——`aria-valuemax`、`aria-valuenow` 和画出来的宽度始终是同一个数。

栏的 flex 基准是 `0 1`（可收缩）而不是 `0 0`：容器比「侧栏 + 检查器」还窄时，一个刚性基准会让分栏视图**溢出它自己的盒子**——实测在 320px 的容器里溢出 161px，而它的父级根本不知道这些栏存在。内容栏的基准是 `0`，所以它先让，侧栏只在真的没地方时才变窄。

### `NavigationStack` / `useNavigationStack()`

一摞页面和一条跟着走的导航栏。

| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `root` | `NavigationPage` | — | 栈底那一页，弹不掉 |
| `pages` / `onPagesChange` | `NavigationPage[]` / `(pages) => void` | 自管 | 自己管理栈（接路由）。数组是根页**之上**的那些页 |
| `backLabel` | `'title' \| 'chevron'` | `'title'` | 返回按钮写上一页标题，还是只画箭头 |
| `headingLevel` | `1 \| 2 \| 3` | `1` | 根页大标题的标题层级 |

`NavigationPage` = `{ key, title, subtitle?, trailing?, content }`。

`useNavigationStack()` 返回 `{ push, pop, popToRoot, depth, canGoBack }`，在栈里任意一层可用。**不在栈里会抛错**，不是静默失效——一个什么都不做的按钮比一条报错难找得多。

返回按钮可见的是**上一页的标题**，不是「返回」：方向你已经知道了，目的地你不知道。`aria-label` 是「返回 上一页标题」，两样都说。

压栈、弹栈都把焦点移到新页面的 `<main>`。不这么做，键盘用户点了一行、页面换了，下一次 Tab 会从那一行原来的位置继续——而那一页已经不在了。

切换是交叉淡入加位移，弹栈方向相反，RTL 镜像；减少动效只留淡入，**方向**才是被读成运动的那部分。

> `NavigationBar` 也新增了 `headingLevel`。一个永远输出 `h1` 的组件一页只能用一次，而两个 `h1` 会破坏读屏用户靠标题跳转的能力。

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
`ListSection`: `header` `footer`（标题式大小写）。
`ListRow`: `label` `secondaryLabel` `value` `leading` `accessory` `href` `onSelect` `disclosure` `destructive` `disabled`。可导航行渲染为真实 `<a>` 或 `<button>`。

`disabled` 的跳转行**不渲染 `href`**，改渲染 `<button disabled>`：带 `href` 的 `<a>` 无论 `aria-disabled` 写什么，回车和点击都照样导航——`aria-disabled` 只是播报，不是实现。

### `Kbd`
`keys`(必填) `aria-label`。快捷键提示。修饰键顺序由组件排：⌃ ⌥ ⇧ ⌘，Command 挨着被它修饰的键。

写法随意（`"⌘K"` `"Cmd+Shift+P"` `"mod k"`），认不出来的原样输出。⌘ ⌥ ⇧ 这些符号读屏念不出来，所以元素自带 `aria-label`（「Command K」），符号本身 `aria-hidden`。

### `MaterialView`
`thickness`(`ultraThin`/`thin`/`regular`/`thick`) `radius`。内容层的半透明手段。

### `Divider`
`orientation` `inset`（逻辑属性，RTL 自动翻转）。

## 控件

### `GlassButton` / `GlassIconButton`
`variant`: `glass` | `glassProminent` | `plain` | `gray` | `tinted` | `destructive` | `destructiveProminent`。
`icon` / `trailingIcon`：图标插槽。是插槽而不是 children，因为图标和文字之间的间距是系统值。
`tint` / `tintContrast`：这一个按钮的色调，和压在它上面的文字色（默认白）。**一屏仍然只有一个主操作**——tint 换的是它的颜色，不是让你摆三个。开发模式会量这一对的对比度，低于 4.5:1 告警：库挑不出能读的文字色（所以没有全局 `accent`），但它能验调用方挑的那个。
`controlSize`: `small`(32) | `regular`(44) | `large`(50) | `extraLarge`(60)——注意与选择玻璃厚度的 `size` 不同。
`loading` 同时禁用并置 `aria-busy`。`independent` 在共享表面内保留自己的玻璃（玻璃叠玻璃，慎用）。
`GlassIconButton` 的 `aria-label` 是**必填类型**。

### `GlassSegmentedControl`
`items: GlassChoice[]`（2–5 项，文字或图标不混用）、`value`/`defaultValue`/`onValueChange`、`name`、`disabled`、`aria-label`(必填)。
底层是原生 radio。**可拖动**：按住选中分段滑动，选择在拖动过程中即时更新。

### `GlassSwitch`
`checked`/`defaultChecked`/`onCheckedChange`、`label`、`aria-label`(必填，描述**打开后**的状态)。
底层是 `input[type=checkbox][role=switch]`。**可甩**：拖动方向决定结果。打开态为系统绿。

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

**形态是结论，不是参数。** `presentation="automatic"`（默认）按选项数量和尺寸类别决定：四个以内且处在 regular 尺寸类别就并排成分段控件，再多或者到了 compact 就收成弹出式菜单按钮。这正是 layout 那一页反复说的那条——按尺寸类别决定布局，永远不按设备类型。写死 `inline` 或 `menu` 只在形态本身就是设计的一部分时用。

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
`ToolbarGroup`: 继承全部 `GlassSurfaceOptions`，外加 `prominent`。开发模式下同组混排图标与文字会给出警告。
`ToolbarSpacer`: `variant`(`fixed`/`flexible`)。

### `TabBar`
`items: TabBarItem[]`(必填，3–5 项) `current` `search` `minimizeOnScroll` `sidebarBreakpoint`(1024) `sidebarHeader` `accessory` `aria-label`(必填)。
`TabBarItem`: `key` `href` `label` `icon` `badge` `badgeLabel` `onSelect`。
是 `<nav>` + 链接 + `aria-current="page"`，**不是** tablist。宽屏自动变形为侧边栏。

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

### `GlassSheet`
`title`(必填) `description` `detents`(`['medium','large']`) `defaultDetent` `onDetentChange` `grabber`。
可拖动，松手弹簧停在最近停靠点；满高时变不透明并贴住边缘。只动 `transform`。

**整块面板都是把手**，不只是顶部那条横条。判据是滚动位置而不是碰到了哪个元素：内容滚到顶时，往下拖是收起；往上拖只有在还有更高一档可长时才归面板，到了最高一档往上拖就是在读内容。横向拖动不接管。在方向定下来之前不 `preventDefault`、不捕获指针，所以面板里的按钮和输入框照常可用。

### `ToastProvider` / `useToast`
`ToastOptions`: `message`(必填) `action` `duration`(6000) `dismissLabel`。

有**关闭按钮**，**Escape 关最新一条**。此前只能等六秒或者把指针放在上面悬停暂停，键盘用户两样都没有。Escape 不 `preventDefault`：浮层里的 Escape 属于浮层，浮层会先拦下它。

### `Banner`
`title`(必填) `message` `tone`(`info`/`success`/`warning`/`error`) `icon` `action` `onDismiss` `dismissLabel` `placement`(`inline`/`top`)。大玻璃。

**和轻提示的分工是「这件事发生在哪」。** 轻提示报告用户刚做完的那一下，几秒后自己走；横幅报告别处发生的事——同步失败了、有新版本——一直留到被处理掉，所以它有标题、有一整句话的余地、有关掉它的办法。必须先回答才能继续的，两个都不对，那是 `GlassAlert`。

`placement` 默认 `inline`：**一个自己决定位置的组件没法被组合**，而布局本来就知道自己的顶在哪（放进 `Screen` 的 `top` 插槽即可）。要钉在窗口顶部就传 `top`。

`onDismiss` 是「可关闭」的开关：传了才有关闭按钮，也才可以往上一甩关掉。上滑只是关闭按钮之外的一条路，不是替代——没有可见入口的手势，对键盘用户等于不存在。`role="status"` + `aria-live="polite"`：它是来汇报的，不是来打断的。

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
