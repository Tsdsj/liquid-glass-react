---
status: todo
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

（实现后追加）
