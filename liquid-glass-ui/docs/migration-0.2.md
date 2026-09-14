# 从 0.1 迁移到 0.2

0.2 是一次破坏性重构。核心变化只有一句话：**内容层与浮动的操作层被彻底分开。**

## 1. 改名

| 0.1 | 0.2 |
| --- | --- |
| `variant="default"` | `variant="glass"` |
| `variant="primary"` | `variant="glassProminent"` |
| `variant="ghost"` | `variant="plain"` |
| `variant="danger"` | `variant="destructive"` |
| `GlassToolbarSeparator` | `ToolbarSpacer` |
| `GlassNavBar` | `TabBar` |

`ToolbarSpacer` 不画线：两块玻璃之间的间隙就是分隔符。

## 2. 工具栏结构变了

`GlassToolbar` 自己**不再是玻璃**。它现在是一排分组，每个 `ToolbarGroup` 才是玻璃；材质相关的 props 移到分组上。

```tsx
// 0.1
<GlassToolbar aria-label="操作" material="clear" backdropTone="dark">
  <GlassIconButton aria-label="上一个"><Prev/></GlassIconButton>
  <GlassToolbarSeparator/>
  <GlassButton>保存</GlassButton>
</GlassToolbar>

// 0.2 —— 图标与文字不共享同一块背景
<GlassToolbar aria-label="操作">
  <ToolbarGroup material="clear" backdropTone="dark">
    <GlassIconButton aria-label="上一个"><Prev/></GlassIconButton>
  </ToolbarGroup>
  <ToolbarSpacer/>
  <ToolbarGroup prominent>
    <GlassButton variant="glassProminent">保存</GlassButton>
  </ToolbarGroup>
</GlassToolbar>
```

开发模式下，同一个分组里混排图标按钮与文字按钮会给出一次 console 警告。

## 3. 内容层容器

任何用 `GlassSurface` 当卡片、列表容器、摘要框、页面区块的地方，都应该换掉：

| 用途 | 换成 |
| --- | --- |
| 卡片、面板 | `Card` |
| 设置项、表单行 | `List` / `ListSection` / `ListRow` |
| 照片上的半透明说明 | `MaterialView` |
| 文字 | `Text` |

`GlassSurface` 仍然存在，但它表示的是**浮动的操作面**。

## 4. 新增的材质属性

- `size="large"` —— 侧边栏、菜单、sheet、提示框。更厚、阴影更深、**不随背景翻转**。浮层组件已自动使用，一般不用手动传。
- `chroma` —— 色散折射，成本约三倍，只用于少数非固定元素。
- `GlassBackdrop tone="dark|light|mixed"` —— 声明区域背景色调，内部小玻璃据此翻转。取代了在每个组件上单独写 `backdropTone`。

## 5. 新增能力

- **完整语义色系统**：12 个系统色 × 浅/深/增强对比度，加语义色阶（label / separator / fill / grouped background）。`--lg-accent` 默认系统蓝。
- **iOS 文本样式 token** 与 Dynamic Type：根节点 `data-lg-text-size="ax3"` 即可整体缩放。
- **`prefers-contrast: more`** 支持，Provider 上新增 `contrast` 选项。
- **同心圆角**：`Card` + `Concentric`，或 `concentricRadius()`。
- **新组件**：TabBar、Sidebar、NavigationBar、GlassSheet、GlassAlert、GlassActionSheet、ToastProvider/useToast、List、TextField、SearchField、GlassStepper、GlassProgress、GlassBadge、MaterialView、Card、Text、Divider、Concentric、LibraryIcon。

## 6. 不需要改的部分

`GlassProvider`、`GlassSegmentedControl`、`GlassSwitch`、`GlassSlider`、`GlassTabs`、`GlassPopover`、`GlassMenu`、`GlassDialog`、`ScrollEdge` 的 API 保持兼容（`ScrollEdge` 的 `variant` 由 `fade|line` 改为 `soft|hard`）。

拖拽编排（`usePull`）、液滴融合（`useFusion`）、几何折射内核与弹簧曲线全部保留，行为不变。

## 7. 视觉上会变的地方

即使不改代码，这些也会变化：

- 玻璃从带绿色调变为中性，accent 从墨绿变为系统蓝。
- 整面的白色高光渐变被移除，改为随指针绕轮廓行进的一条发丝高光。
- 滑块旋钮在静止时不再是玻璃，只有被拖动时才抬升。
- 开关打开态从品牌色变为系统绿。
- 菜单、浮层、对话框改用更厚的大玻璃。
