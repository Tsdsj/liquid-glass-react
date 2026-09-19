# API

`@ttqtt/liquid-glass-react` 共 65 个导出：41 个组件与 Provider、10 个 Hook、14 个纯函数与诊断工具。所有组件都是 `'use client'`。

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

### `MaterialView`
`thickness`(`ultraThin`/`thin`/`regular`/`thick`) `radius`。内容层的半透明手段。

### `Divider`
`orientation` `inset`（逻辑属性，RTL 自动翻转）。

## 控件

### `GlassButton` / `GlassIconButton`
`variant`: `glass` | `glassProminent` | `plain` | `gray` | `tinted` | `destructive` | `destructiveProminent`。
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
`value`/`defaultValue`/`onValueChange`、`min`/`max`/`step`、`formatValue`（→ `aria-valuetext`）、`minLabel`/`maxLabel`、`aria-label`(必填)。
底层是原生 `input[type=range]`。旋钮**只在被拖动时**抬升为玻璃。

### `GlassStepper`
`value` `min` `max` `step` `showValue` `decrementLabel` `incrementLabel` `aria-label`(必填)。仅用于很小的整数范围。

### `GlassProgress`
`value`（省略即不确定）、`total`、`variant`(`bar`/`circular`)、`aria-label`(必填)。

### `GlassBadge`
`count` `max`(99) `tone`(`notification`/`neutral`/`accent`) `dot` `aria-label`。没有内容时不渲染。

## 输入

### `TextField`
`label`(必填) `hint` `error` `leading` `trailing` `labelHidden`，其余透传给 `<input>`。
`error` 存在即标记 `aria-invalid` 并接上 `aria-describedby`。字号不低于 16px。

### `SearchField`
`value`/`onValueChange`、`onSubmitQuery`、`clearLabel`、`aria-label`(必填)。外层 `role="search"` 的 form，输入框 `type="search"`。

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

## 类型

`GlassMaterial` `GlassRenderer` `GlassTheme` `GlassDensity` `GlassTransparency` `GlassMotion` `GlassContrast` `GlassSize` `GlassQuality` `BackdropTone` `StandardMaterial` `TextStyle` `TextSize` `GlassPolicy`

常量表：`materialTokens` `densityTokens` `motionTokens` `spacingTokens` `radiusTokens` `textStyles` `textScale` `zIndexTokens` `defaultPolicy`
