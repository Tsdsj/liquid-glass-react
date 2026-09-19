# 0.3.0：第一个允许破坏的版本

> 证据写于 2026-09-16（原 `docs/roadmap-0.3.md`）。这里只保留**真正属于 0.3.0 的部分**——那份文档的另一半是 0.0.2 的，已移到 [`../0.0.2/phase-1-delivered.md`](../0.0.2/phase-1-delivered.md)。

0.0.x 收纯新增；改了已有类型的形状、改名、删除、改变既有行为的，都在这里。**每一条都要进改名对照表**（`docs/migration-0.3.md`），从开工第一天就往里记，不要等到最后回忆。

版本号为什么跳过 0.1.0 / 0.2.0：这两个号被 2026 年 7 月的旧实现占死了，npm 的版本号一次性使用。见 [`../README.md`](../README.md)。

---

## 一、破坏性的组件改动

### D. 菜单只有一层，分组只有 `separatorBefore`

没有分组标题、没有子菜单（`known-limitations.md` 已记）。加 `sectionLabel?: string` 与 `items?: GlassMenuItem[]`（子菜单）。

**为什么是破坏性的**：`GlassMenuItem` 从「一定是叶子」变成「可能是分支」，任何对它做穷举处理的调用方都要改。

子菜单按 **macOS 模型**做（2026-09-16 已定）：悬停父项 ~150ms 后向侧边展开，展开的子菜单与父项之间留一个「安全三角」——指针斜着划向子菜单时不因经过相邻项而切换；键盘 → 进入、← 返回、Escape 逐层关、Home / End 在当前层内。触屏（`pointer: coarse`）没有悬停，父项改为点按展开。

三条都要有用例：安全三角用一串斜向 `mouse.move` 断言子菜单没被换掉。

> 0.0.2 的 `ContextMenu` 先做单层触发模型，嵌套等这里落地。`GlassMenuButton` 的 morph 动效也要在菜单结构稳定之后再调，否则调两遍。

### E. `GlassSheet` 只有 `medium` / `large` 两个停靠点

加自定义（已定写法）：

```ts
detents?: Array<'medium' | 'large' | { fraction: number } | { height: number }>
```

`fraction` 是视口高度的比例，`height` 是 CSS 像素；两者都夹在 `[88px, 94%]` 内。停靠动画和拖拽逻辑已经按比例写，扩展成本低。

**为什么是破坏性的**：`SheetDetent` 类型变宽，对它做穷举 `switch` 的调用方会漏分支。

> 依赖 0.0.2 的 P3（整块可拖）先落地——停靠点变多之后再改拖动手柄，两件事会互相干扰。

### F. 工具栏的 roving focus 只覆盖按钮型子控件

`known-limitations.md` 记了：分段控件、开关放进 `ToolbarGroup` 时方向键走不到。扩到所有可聚焦子项。

**为什么是破坏性的**：改变了既有的键盘行为——原本方向键会跳过这些控件，之后不会。依赖它跳过的布局会变。

> 复现用例在 0.0.2 的 1.2 里写（先证明它真的存在），修在这里。

---

## 二、四篇指南

现有五篇：安装、主题、效果与性能、SSR、从 0.1 升级。缺的都是「用错了才知道」的那种：

- **声明背景色调**——R2 那个 4.38:1 的对比度失败就是站点自己把浅色场景声明成了 `dark`。这篇讲怎么判断、怎么量（`scripts/measure-contrast.mjs`）、错了会怎样。
- **配合客户端路由**——`TabBarItem` 有 `href` + `onSelect`，但没有一篇文章说 React Router / TanStack Router 该怎么接。0.0.2 的 `NavigationStack` 落地后一起写。
- **性能预算**——「单视图折射元素 ≤20」写在 `known-limitations.md` 里，读者看不到。
- **换主题色补一节**——怎么为自定义主色配 `--lg-accent-contrast`、怎么用 `measure-contrast.mjs` 验证。这是 `GlassProvider.accent` **不加**之后欠的那份解释。

## 三、`docs/migration-0.3.md`

从开工第一天建骨架，改一处类型就记一行。至少要覆盖上面 D、E、F 三条，以及 0.0.2 期间如果出现的任何行为调整。

---

## 四、不放松的门槛

- `pnpm check` 全绿是提交的前提，不是发版的前提。
- 新组件的用例进 `components.spec.ts`（语义与键盘）、`fallback.spec.ts`（无折射时仍是材质）；带拖动的进 `scrub.spec.ts`；压在媒体上的进 `contrast.spec.ts`。
- 发布前用 Apple-Style-Review 过一遍**改过的**组件，结论追加到 `../../../reports/hig-review.md`。
- **R1 屏幕阅读器**仍然开着。它不是代码任务：排一次 VoiceOver 实机走查，清单是每个组件页的「键盘与辅助功能」段落，结果记进 `reports/`。0.3.0 之前做一次。
