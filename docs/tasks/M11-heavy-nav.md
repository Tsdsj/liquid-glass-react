---
status: done
depends: [M10]
---

# M11 — 二阶段·重导航批:Drawer、Menu(下拉菜单)

> 优先于 M5 执行。两个重组件顶满一次会话;Drawer 以 Modal 为唯一模板,
> Menu 以 Select 弹层模式为参照。

## 执行前提

- 遵守 `AGENTS.md` 与 `docs/component-guide.md`;本卡 props 表即 API 定稿。
- 实现前通读 `src/components/Modal/Modal.tsx`(Drawer 模板:FloatingOverlay /
  FloatingFocusManager / useDismiss / useRole / useTransitionStatus + 遮罩
  模糊渐入 + 首帧 pending 门控 CSS 模式)与 `src/components/Select/Select.tsx`
  (Menu 浮层模式:useListNavigation / useTypeahead / ScrollEdge)。
- 服务器无浏览器:视觉验证留用户本地目检。

## API 定稿

### Drawer

```ts
export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placement?: 'left' | 'right' | 'top' | 'bottom'; // 默认 'right'
  size?: number | string;              // 面板宽(左右)/高(上下),默认 token 档
  title?: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;       // 默认 true
  children: React.ReactNode;
}
```

- 结构与 Modal 完全同构(命名对齐 Modal 现有签名),差异仅:面板贴边 +
  按 placement 方向滑入(transform 平移,进场用 `--lg-ease-bounce`,遵循
  M6f 惯例:opacity 在玻璃面板自身、transform 进场过冲、reduced-motion
  仅淡入)。
- 面板 = GlassSurface `refraction="auto"` 大 bezel;遮罩沿用 Modal 的
  background-color + backdrop-filter 渐入(不做 opacity 动画——backdrop
  root 规则);`data-refraction-pending` 门控 CSS 与 Modal 同款。
- 内容区外包内部 ScrollEdge(同 Modal body)。
- **抽象约束**:与 Modal 的公共逻辑若差异 < 30 行则宁可复制,不为 Drawer
  重构已 done 的 Modal;若确需抽 hook,只允许内部文件,不改 Modal 行为
  且 Modal 既有测试零改动。
- a11y:焦点圈闭、Esc、遮罩点击(可关)、关闭后焦点还原触发器,
  `role="dialog"` + `aria-modal`;关闭按钮 i18n aria-label(同 Modal)。

### Menu(下拉菜单)

```ts
export type MenuItem =
  | { key: string; label: React.ReactNode; icon?: React.ReactNode;
      disabled?: boolean; danger?: boolean }
  | { type: 'divider' };
export interface MenuProps {
  items: MenuItem[];
  onSelect?: (key: string) => void;
  children: React.ReactElement;        // 触发器,cloneElement 注入(同 Popover)
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;               // 默认 'bottom-start'
}
```

- 浮层面板 = GlassSurface `refraction="auto"`(同 Select 弹层,含首帧
  pending 门控 CSS 与进场弹性);菜单项 hover/active 纯 tint 高亮,
  danger 项 `--lg-danger` 文字。
- 交互:`useClick` + `useDismiss` + `useRole({role:'menu'})` +
  `useListNavigation`(disabled 跳过、loop)+ `useTypeahead`;
  选择项后关闭并把焦点还原触发器;divider `role="separator"`。
- 键盘:触发器 Enter/Space/ArrowDown 打开并聚焦首项(ArrowUp 聚焦末项);
  面板内上下/Home/End/字符 typeahead/Enter 选择/Esc 关闭。
- 超长列表:面板 maxHeight + 内部 ScrollEdge(同 Select)。

## 实现步骤

1. Drawer(先补样式门控的 css-source-invariants 断言可选)→ 测试 → 提交。
2. Menu → 测试 → 提交。
3. site:两条 ComponentDoc 进 `navigation.demos.tsx`/registry。
4. 全量验证。

## 测试要求

- Drawer:四向 placement 的 data 属性、焦点圈闭/还原、Esc、遮罩开关、
  受控 open、i18n 关闭钮;pending 门控 DOM 断言(参照 Modal 既有测试)。
- Menu:打开三通道(点击/Enter/ArrowDown)、全键盘路径逐键断言、typeahead、
  disabled 跳过、danger 类名、divider 语义、选择后焦点还原、外点关闭。
- Modal/Select 既有测试全绿零改动。
- site 冒烟同前批惯例。

## 验收标准

- [ ] 两组件 API 与定稿一致并导出。
- [ ] Drawer 与 Modal 行为对齐(遮罩渐入、门控、reduced-motion),Modal 零改动。
- [ ] Menu 键盘与焦点管理全部断言通过。
- [ ] site 两张新卡片 + 详情页完整,中英双语。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,存量断言不削弱。
- [ ] 完成记录注明:滑入动效与玻璃观感留本地目检。

## 明确非目标(范围红线)

- Menu 嵌套子菜单、多选/勾选菜单、右键上下文菜单。
- Drawer 多层堆叠管理、push 模式(推开页面内容)、无遮罩模式。

## 完成记录

- `Drawer`:**整文件复制 Modal 结构**(FloatingOverlay/FloatingFocusManager/useDismiss/
  useRole/useTransitionStatus + 遮罩 background-color+backdrop-filter 渐入 + 首帧
  `data-refraction-pending` 门控),差异 < 30 行:`placement`(左右上下,默认 right,
  贴边 fixed 定位 + 方向 translate 滑入)、`size`(number→px / string,注入
  `--lg-drawer-size`)。进场 transform 用 `--lg-ease-bounce`、opacity 在玻璃面板自身、
  reduced-motion 仅淡入(遵 M6f)。**Modal 零改动**(未抽公共 hook)。测试:四向
  placement data 属性、i18n 关闭钮、Esc、遮罩开关(closeOnOverlayClick)、锁滚、焦点还原、
  pending 门控 DOM(参照 Modal gating 测试)。
- `Menu`:Select 弹层模式(useClick/useDismiss/useRole menu/useListNavigation loop+
  disabledIndices/useTypeahead + ScrollEdge + size middleware maxHeight)+ Popover 的
  cloneElement 触发器;面板 = GlassSurface refraction=auto,含首帧门控与弹性进场。
  非分隔项按交互序注册进 listRef;divider `role=separator`,danger 项 `data-danger` +
  `--lg-danger` 文字。键盘:触发器 Enter/Space/ArrowDown 开+聚焦首项、ArrowUp 聚焦末项;
  面板内上下循环(disabled 跳过)、Home/End、字符 typeahead、Enter/Space 选择、Esc 关闭;
  选择/Esc/外点关闭后焦点还原触发器。测试 12 条全绿。
- 五件套齐全;`styles/index.css` 追加 drawer/menu @import;`src/index.ts` 导出
  Drawer/DrawerProps、Menu/MenuProps/MenuItem。
- site:`navigation.demos.tsx` 增 Drawer/Menu 两条 ComponentDoc 进 registry,总览计数
  25 → 27;`App.test.tsx` 详情页断言 slug 列表加 drawer/menu。
- 验证:`pnpm typecheck` ✓、`pnpm build` ✓;`pnpm test`——单线程全量 **311/311 全绿**
  (`vitest run --no-file-parallelism`);Modal + Drawer + Menu 三文件同跑 34/34。默认并行下
  M4 既有 Modal 焦点测试(keeps Tab focus inside the dialog)仍为文档记载的 `user.tab()`
  时序 flake(隔离/三文件同跑均稳定过),**按本卡「Modal 既有测试零改动」约束未改**,非本卡回归。
- **留本地目检**:Drawer 四向贴边滑入动效(`--lg-ease-bounce` 过冲)、遮罩模糊渐入、
  Menu 玻璃浮层弹性进场与项高亮观感(服务器无浏览器)。
