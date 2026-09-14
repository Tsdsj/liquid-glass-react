# 无障碍

系统组件会自动处理这些；自定义玻璃必须自己实现同样的行为。本文件记录本库**已经实现**的部分，以及**仍需人工验证**的部分——两者不混为一谈。

## 1. 四项系统偏好

| 偏好 | 行为 | 实现位置 |
| --- | --- | --- |
| `prefers-reduced-transparency` | 背景滤镜整体关闭，材质变实色；标准材质与滚动边缘一并退化 | `styles.css` 媒体查询 + `data-transparency="opaque"` |
| `prefers-contrast: more` | 材质变为接近黑白 + 一条对比边框；折射、行进高光、液滴融合全部让位 | `tokens.css` 第三套调色板 + `styles.css` 媒体查询 + `data-lg-contrast="more"` |
| `prefers-reduced-motion` | 关闭弹性、位移、变形、拖动拉伸；不确定进度条停止运动；sheet 直接跳到目标高度 | `styles.css` 媒体查询 + `data-reduced-motion` |
| `forced-colors: active` | 交给系统调色板，装饰层整体隐藏 | `styles.css` 媒体查询 |

Provider 上的 `transparency` / `motion` / `contrast` 是**叠加**在系统设置之上的应用级开关。系统偏好不会被更激进的子设置覆盖：

```ts
reduceMotion: parent.reduceMotion || systemReduceMotion || policy.motion !== 'system'
```

## 2. Dynamic Type

根节点 `data-lg-text-size` 取 `xs | s | m | l | xl | xxl | xxxl | ax1 … ax5`，整套文本样式按比例缩放（body 17pt 为基准，AX5 ≈ 3.12×）。

- 所有组件字号来自 `--lg-text-*`，没有硬编码 px。
- 字距用 em，跟着缩放走。
- **AX5 下布局必须仍能回流**，不截断、不横向溢出。回归用例：`tests/browser/a11y.spec.ts`。
- Apple 在无障碍字号下会略微压缩大标题，本实现用单一倍率近似；这一点在 token 注释里写明了。

## 3. 命中区与焦点

- 每个可交互元素不小于 **44×44**，控件间距不小于 8pt。视觉更小的按钮在 `(pointer: coarse)` 下用伪元素把命中区补回来，而不是放大图形。
- 焦点环一律用 `outline` + `outline-offset`，**不用 `box-shadow`**——那是玻璃自己的。
- 玻璃容器里的输入框把焦点环画在容器上（`:focus-within`），因为输入框自身的 outline 被替换掉了。没有替代就不写 `outline: none`。
- 纯图标按钮的 `aria-label` 是**必填类型**，不是约定。

## 4. 角色与键盘模型

| 组件 | 角色 | 键盘 |
| --- | --- | --- |
| `TabBar` | `<nav>` + 链接 + `aria-current="page"` | Tab / 回车。**不是 tablist** |
| `GlassTabs` | `tablist` / `tab` / `tabpanel` | 方向键切换并即时激活，Home / End |
| `GlassSegmentedControl` | 原生 radio + `radiogroup` | 方向键（浏览器提供），可拖动 |
| `GlassSwitch` | `input[type=checkbox][role=switch]` | Space，可拖动 |
| `GlassSlider` | 原生 `input[type=range]` | 方向键 / Home / End / PageUp / PageDown |
| `GlassToolbar` | `role="toolbar"` | 整条一个 Tab 停靠点，方向键跨分组移动，RTL 下左右对调 |
| `GlassMenu` | `menu` / `menuitem` / `menuitemcheckbox` | 上下、Home / End、键入查找（700ms 窗口）、Escape 关闭回焦、Tab 关闭 |
| `GlassDialog` / `GlassAlert` / `GlassSheet` | 原生 `<dialog>` + `showModal()` | 焦点约束、背景 inert、Escape 由平台提供 |
| `GlassSheet` 手柄 | `role="slider"` | 上下方向键在停靠点间移动，最低点再向下即关闭 |
| `GlassPopover` | 原生 `popover="auto"` | 轻量关闭、Escape 回焦 |
| `ToolbarGroup` / `GlassGroup` | 无 role（装饰容器） | 语义由内部按钮承担 |

`GlassAlert` 的 Escape **执行取消操作**，而不是静默关闭——用户按 Escape 是想要一个明确的退出。

## 5. 表单

- 每个字段一个真实 `<label for>`；placeholder 是格式提示，不是标签。
- 字号不低于 16px，否则 iOS Safari 聚焦时会缩放整页。
- 错误通过 `aria-invalid` + `aria-describedby` 关联到具体文案，说清发生了什么和怎么修，**不只靠红框**。
- `autocomplete` 与 `inputmode` 由调用方按字段用途传入。

## 6. 国际化

- `styles.css` 使用逻辑属性（`inset-inline-*`、`margin-inline`、`padding-block`）。
- 方向性图标（列表 chevron、返回箭头）在 RTL 下镜像；媒体控件与时钟类图标不镜像。
- 工具栏与标签页的方向键在 RTL 下自动对调。
- 负字距在 CJK 语境下自动关闭。

## 7. 其他

- 颜色不是唯一信号：破坏性操作同时有红色**和**明确的动词标签；徽标里始终有数字或文字，并带说明用途的可访问名称。
- 破坏性操作二选一：不可逆 → `GlassAlert` / `GlassActionSheet` 确认；可逆 → 直接执行 + `useToast` 撤销。两者都不给是不可接受的。
- Toast 用 `role="status"` + `aria-live="polite"`，报告已发生的事而不打断；悬停或聚焦时暂停计时，避免撤销窗口在伸手过去的路上消失。
- `NavigationBar` 的紧凑标题是 `aria-hidden`，真正的标题是下方的 `h1`，不会重复朗读。
- 浮层与内部滚动容器都设了 `overscroll-behavior: contain`，滚到底不会带动背后的页面。

## 8. 仍需人工验证（**未完成**）

自动化检查覆盖角色、键盘路径、偏好开关、AX5 回流、RTL 与字号下限（`tests/browser/a11y.spec.ts`，10 项）。以下**不能**由它们替代：

- 真实屏幕阅读器（VoiceOver / NVDA / JAWS）的朗读顺序与语音控制名称匹配。
- 实际合成背景上的对比度测量——把两个 CSS token 填进计算器不算数，玻璃的最终颜色取决于它背后是什么。
- 浏览器 200% 缩放与操作系统缩放。
- 切换控制（Switch Control）与完全键盘访问。

这些是发布前门槛，没有因为组件数量增加而降低。状态见 `action-items.md`。
