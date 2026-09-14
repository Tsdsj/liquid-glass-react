# API

`@liquid-glass-ui/react` 共 65 个导出：41 个组件与 Provider、10 个 Hook、14 个纯函数与诊断工具。所有组件都是 `'use client'`。

样式必须引入一次，顺序不能颠倒：

```ts
import '@liquid-glass-ui/react/tokens.css';
import '@liquid-glass-ui/react/styles.css';
```

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

`useGlassPolicy()` 返回解析后的策略，含 `resolvedTheme`、`reduceMotion`、`reduceTransparency`、`increaseContrast`、`forcedColors`。

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
`targetRef`(必填) `edge`(`top`/`bottom`) `variant`(`soft`/`hard`) `height`(44)。一个滚动视图只用一个。

## 浮层

全部支持 `trigger` / `open` / `defaultOpen` / `onOpenChange`，并自动使用 `size="large"`。

### `GlassPopover`
`title`(必填) `description` `align`。非模态，锚定触发器。

### `GlassMenu`
`items: GlassMenuItem[]`（`key` `label` `onSelect` `icon` `checked` `shortcut` `destructive` `disabled` `separatorBefore`）、`aria-label`(必填) `align`。
键盘：上下移动、Home/End、键入查找、Escape 关闭回焦、Tab 关闭。

### `GlassSheet`
`title`(必填) `description` `detents`(`['medium','large']`) `defaultDetent` `onDetentChange` `grabber`。
可拖动，松手弹簧停在最近停靠点；满高时变不透明并贴住边缘。只动 `transform`。

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

`useGlassPolicy` `useGlassSurface` `useBackdropTone` `useSharedSurface` `useMediaQuery` `useFusion` `usePull` `useSelectionLens` `usePopover` `useToast`

`attachPull` `elementAt` `lensOrigin` `triggerElement` `lockScroll`

来自 `@liquid-glass-ui/core`：
- `concentricRadius(containerRadius, inset, { minimum, maximum })` / `concentricInset` / `capsuleRadius`
- `createSpring(initial, apply, config)` / `advanceSpring` / `springAtRest` / `defaultSpring`
- `getGlassDiagnostics()` / `clearGlassCache()`

## 类型

`GlassMaterial` `GlassRenderer` `GlassTheme` `GlassDensity` `GlassTransparency` `GlassMotion` `GlassContrast` `GlassSize` `GlassQuality` `BackdropTone` `StandardMaterial` `TextStyle` `TextSize` `GlassPolicy`

常量表：`materialTokens` `densityTokens` `motionTokens` `spacingTokens` `radiusTokens` `textStyles` `textScale` `zIndexTokens` `defaultPolicy`
