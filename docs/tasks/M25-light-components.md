---
status: done
depends: [M24]
---

# M25 — 四阶段·轻型组件补齐

> 四阶段组件线收尾。一次补齐 5 个较小的常用缺口:Alert/Banner、Accordion/Collapse、
> Command（命令面板）、Empty（空态）、Steps（步骤条）。串行 M19→M26。无新运行时依赖。

一卡多组件(参照 M8/M9 惯例):共性简单、单独开卡不划算,合并一卡、一组件一或多提交。

## 执行前提

- 遵守 `AGENTS.md` 与 `docs/component-guide.md`(五件套、size/disabled/受控、@import、导出)。
- 每个组件的 props 表即公共 API 定稿。a11y 是验收项。
- Command 复用已有 `Modal`/`Popover` + `@floating-ui/react`(唯一依赖),不引 cmdk。

## API 定稿（逐组件）

### Alert / Banner
```ts
export interface AlertProps {
  kind?: 'info' | 'success' | 'warning' | 'danger';  // 默认 info
  title?: React.ReactNode;
  closable?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode | false;
  children?: React.ReactNode;                          // 正文
}
```
- 玻璃:GlassSurface 轻 tint,按 kind 走 token 强调色;`role="alert"`(warning/danger)或 `status`。

### Accordion / Collapse
```ts
export interface AccordionItem { key: string; title: React.ReactNode; content: React.ReactNode; disabled?: boolean }
export interface AccordionProps {
  items: AccordionItem[];
  multiple?: boolean;                    // 是否允许多个同时展开,默认 false
  value?: string[]; defaultValue?: string[]; onChange?: (keys: string[]) => void;
}
```
- a11y:头部 button `aria-expanded`/`aria-controls`,面板 `role="region"`;展开动画走动效 token,reduced-motion 瞬变。

### Command（命令面板）
```ts
export interface CommandItem { key: string; label: React.ReactNode; keywords?: string[]; onRun?: () => void; group?: string }
export interface CommandProps {
  items: CommandItem[];
  open?: boolean; onOpenChange?: (open: boolean) => void;
  placeholder?: string;
}
```
- 承载于 Modal/浮层;输入过滤(自写模糊匹配纯函数)+ 上下键导航 + Enter 执行 + Escape 关闭;
  `role="listbox"`/`option`,`aria-activedescendant`。

### Empty（空态）
```ts
export interface EmptyProps { image?: React.ReactNode; title?: React.ReactNode; description?: React.ReactNode; children?: React.ReactNode }
```
- 纯展示,内容层;供 Table `emptyText` 等对接。

### Steps（步骤条）
```ts
export interface StepItem { key: string; title: React.ReactNode; description?: React.ReactNode }
export interface StepsProps { items: StepItem[]; current?: number; direction?: 'horizontal' | 'vertical'; size?: 'sm' | 'md' | 'lg' }
```
- 当前/完成/待办态走 token;`aria-current="step"`;连接线为装饰(aria-hidden)。

## 实现步骤

1. Command 的过滤匹配纯函数(`src/core/utils/fuzzy-match.ts`)+ 单测(RED→GREEN)。
2. 逐组件实现(component-guide checklist),由简到繁:Empty → Alert → Steps → Accordion → Command。
3. site:`site/src/demos/` 各新增一条 ComponentDoc(演示 + API 表,中英双语);总览计数同步。
4. 全量验证 + 提交(一组件一或多提交)。

## 测试要求

- Alert:kind 样式/role、closable + onClose。
- Accordion:单/多展开、受控非受控、disabled 跳过、`aria-expanded`/region;reduced-motion。
- Command:过滤纯函数(关键词/分组/空结果)、上下键导航 + Enter 执行 + Escape 关闭、activedescendant。
- Empty:插槽渲染。Steps:current 态、direction、`aria-current`。
- 各组件 site 详情页可渲染断言。

## 验收标准

- [ ] 5 组件及各自 Props 类型从 `src/index.ts` 导出,API 与本卡一致。
- [ ] 各组件交互/键盘/a11y 断言通过;Command 过滤纯函数断言完整。
- [ ] site 出现 5 张新卡片,详情页含演示 + API 表,中英双语,总览计数同步。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,存量断言不削弱;无新增运行时依赖。

## 明确非目标

- Notification(与现有 toast 重叠,不做);Timeline;Tour/引导;Command 的异步远程搜索;
  Accordion 手风琴嵌套树。

## 完成记录

- **纯函数** `src/core/utils/fuzzy-match.ts`:`fuzzyMatch`(大小写不敏感的顺序子序列,空查询全匹配)
  + `commandMatches`(label 或任一 keyword 命中)。6 单测(RED→GREEN)。
- **Empty**:纯展示,image 缺省默认图标,title/description/children 插槽。2 测。
- **Alert**:GlassSurface,四语义色,warning/danger 用 `role="alert"` 否则 `status`,closable 关闭按钮
  (i18n aria-label),`icon={false}` 隐藏。**设计修正**:impeccable 命中"左侧强调粗边=AI 味",改为
  **kind 色淡染背景(color-mix)+ 强调色图标**,去掉 side-tab 边。3 测。
- **Steps**:`<ol>/<li>` 语义,finish/process/wait 三态走 token,当前步 `aria-current="step"`,
  连接线 aria-hidden,横/纵向。2 测。
- **Accordion**:`useControllableState` 受控/非受控,单开/multiple 多开,disabled 跳过;头部 button
  `aria-expanded`/`aria-controls`,面板 `role="region"` `aria-labelledby`;展开走 **grid-rows 0fr→1fr**
  动画,reduced-motion 瞬变。4 测。
- **Command**:**关键决策——未用 Modal**。Modal 把初始焦点给了先渲染的关闭按钮,命令面板要求焦点落在
  输入框;Modal 未暴露 initialFocus。故 Command **自建浮层**(FloatingPortal + FloatingOverlay +
  `FloatingFocusManager initialFocus={inputRef}` + useDismiss/useRole,仍只依赖 `@floating-ui/react`),
  焦点可靠落到 combobox 输入。自写模糊过滤 + 上下键(`aria-activedescendant`)+ Enter 执行 + Escape 关闭,
  按 group 分组渲染,`role="listbox"`/`option`。3 测(过滤/空态、方向键+Enter、点击执行)。
- **导出/注册**:`src/index.ts` 增 5 组件 + 各 Props/子类型;`styles/index.css` @import 5 份 css;
  五件套齐全(含各 stories)。SSR 冒烟纳入 5 个(Command 用 closed);a11y 冒烟纳入静态 4 个
  (Command 为浮层,closed 无内容,其 listbox a11y 由 Command.test 覆盖)。
- **文档**:5 条 ComponentDoc——Alert/Command→feedback.demos(反馈)、Empty/Accordion→display.demos(展示)、
  Steps→navigation.demos(导航);接入 registry;总览计数派生 +5。
- 验证:`pnpm typecheck` ✓、`pnpm build` ✓(dist 含 5 组件)、`pnpm test` **503/503 绿**
  (较 M24 的 474 +29)、`pnpm site:build` ✓。**无新增运行时依赖**(Command 仅用既有 floating-ui)。
- **留本地目检**:Alert 淡染背景与图标色、Accordion 展开动画、Command 浮层玻璃与分组、Steps 连接线态。
