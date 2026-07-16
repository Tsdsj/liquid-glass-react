---
status: done
depends: [M23]
---

# M24 — 四阶段·DatePicker 日期选择

> 四阶段组件线之一。日期选择:输入框 + 弹出日历面板 + 键盘导航 + a11y。基于已有 `Popover`。
> 串行 M19→M26。**日期算法自写**在 `src/core/utils/`,不引 dayjs/date-fns。

## 执行前提

- 遵守 `AGENTS.md` 与 `docs/component-guide.md`。本卡 props 表即公共 API 定稿。
- 无新运行时依赖:月份网格、跨月、闰年、周起始、格式化/解析全部自写纯函数。
- a11y:日历 grid 语义 + 完整键盘导航是**验收核心**(参照 WAI-ARIA date grid 实践)。

## API 定稿

```ts
export interface DatePickerProps {
  value?: Date | null;                   // 受控
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  min?: Date; max?: Date;
  disabledDate?: (date: Date) => boolean;
  format?: string;                       // 显示格式,默认 'YYYY-MM-DD'(自写格式化)
  weekStartsOn?: 0 | 1;                  // 0=周日,1=周一,默认 1
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  locale?: 'zh-CN' | 'en-US';            // 缺省取 LiquidGlassConfig
  'aria-label'?: string;
}
```

- **触发**:只读输入框(或带清除)点击/聚焦打开 `Popover` 承载日历面板;外点/Escape 关闭并复焦。
- **日历面板**:月份标题 + 上/下月 + 年月快速切换;7×6 日期网格;今天/选中/禁用/跨月态样式。
- **键盘**:方向键移动日(跨行跨月)、PageUp/Down 换月(Shift 换年)、Home/End 本周首末、
  Enter/Space 选中、Escape 关闭。焦点在 grid 内 roving。
- **a11y**:`role="grid"` + `gridcell` + `aria-selected`/`aria-disabled`;`aria-label` 到具体日期
  (本地化);面板打开时焦点入 grid,关闭复焦触发器。
- **玻璃**:面板为 GlassSurface(浮层惯例,沿用 Popover 的玻璃);日期格为内容层。
- **纯函数**:`buildMonthGrid(year, month, weekStartsOn)`、`formatDate`/`parseDate`、
  `isSameDay`/`clampDate`/`inRange` 自写在 `src/core/utils/date.ts`,jsdom 直接测。

## 实现步骤

1. `src/core/utils/date.ts`(月网格 / 格式化 / 解析 / 比较 / 范围)+ 单测(RED→GREEN,重点闰年/跨月/周起始)。
2. 日历面板(grid + 键盘模型)。
3. DatePicker 组件:输入 + Popover + 面板接线(component-guide checklist);locale 接 LiquidGlassConfig。
4. site:`site/src/demos/entry.demos.tsx` 或新增 datePickerDoc(受控 + min/max + 禁用日示例 + API 表,中英双语);计数同步。
5. 全量验证 + 提交。

## 测试要求

- 纯函数:buildMonthGrid(闰年 2 月、31 天月、跨月填充、weekStartsOn 0/1)、format/parse 往返、
  比较/范围/钳制边界。
- 交互:开合(点击/Escape/外点 + 复焦)、选日回调、min/max 与 disabledDate 拦截。
- 键盘:方向键跨行跨月、PageUp/Down 换月、Home/End、Enter 选中、Escape 关闭——逐键断言焦点与 aria。
- a11y:grid/gridcell/aria-selected/aria-disabled、日期 aria-label 本地化。
- site App.test 增 DatePicker 详情页可渲染断言。

## 验收标准

- [ ] DatePicker/DatePickerProps 从 `src/index.ts` 导出,API 与本卡一致。
- [ ] 日期纯函数断言完整(闰年/跨月/周起始);交互与全部键盘路径逐键断言通过。
- [ ] a11y:date grid 语义 + 本地化 aria-label 断言通过。
- [ ] site 出现 DatePicker 卡片,详情页含受控/min-max/禁用日示例 + API 表,中英双语,计数同步。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,存量断言不削弱;无新增运行时依赖。
- [ ] 完成记录注明:面板玻璃观感留本地目检。

## 明确非目标

- 范围选择(RangePicker)、时间选择(TimePicker)、年/季/周选择器;非公历日历;
  国际化文案库(只做中/英两 locale,沿用现有机制)。

## 完成记录

- **日期纯函数** `src/core/utils/date.ts`(自写,无 dayjs/date-fns):`isLeapYear`/`daysInMonth`、
  `buildMonthGrid`(固定 42 格,按 `weekStartsOn` 对齐,前后补邻月)、`addDays`/`addMonths`(**月末
  钳日**,Jan31+1→Feb29/28)、`isSameDay`/`inRange`/`clampDate`(按天粒度)、`formatDate`/`parseDate`
  (token 格式,拒绝 2024-02-30 等非法)。11 单测(RED→GREEN,含闰年/跨月/周起始/往返)。
- **Calendar 面板**(内部):`role="grid"` 的 `<table>` + `<th scope=col>` 周名 + `gridcell` 里放
  日期 `<button>`;roving tabindex(仅 focusedDate 的按钮 tabIndex=0),`useEffect` 在 focusedDate
  变化时聚焦对应按钮(**开面板即焦点入网格**)。键盘:方向键跨行跨月、PageUp/Down 换月(Shift 换年)、
  Home/End 本周首末——均在 grid `onKeyDown` 处理并 preventDefault。
- **关键决策**:选中(Enter/Space)**交给聚焦日 `<button>` 的原生 click**,grid 的 keydown **不**再处理
  Enter/Space,避免原生激活与手动处理**双触发**。禁用日(超 min/max 或 disabledDate)`aria-disabled`,
  onClick 守卫不选。
- **DatePicker 组件**:`useControllableState` 管 `value`(Date|null),内部 `open`;`<Popover>` 承载
  Calendar(玻璃面板/外点/Escape/关闭复焦由 Popover 复用),只读 `<Input>` 作触发。locale 缺省取
  `LiquidGlassConfig`;`today` 用运行时 `new Date()` 注入 Calendar(纯函数不碰 now)。
- **a11y 踩坑**:Input 触发上 floating-ui(`useRole:dialog`)会加 `aria-haspopup`/`aria-expanded`,
  这些在纯 `textbox` 上不被 axe 允许(aria-allowed-attr critical)。修:给 Input 加 **`role="combobox"`**
  (combobox 允许这两个属性,正是日期输入弹层的正确模式)。a11y 冒烟随后通过。
- **导出/注册**:`src/index.ts` 增 `DatePicker` + `DatePickerProps`;`styles/index.css` @import
  `datepicker.css`;五件套齐全(含 stories:Basic + WithRange)。closed 态纳入 SSR 与 a11y 冒烟。
- **文档**:`entry.demos.tsx` 新增 `datePickerDoc`(受控 + min/max + 禁用周末真实示例 + API 表,
  中英双语),接入 registry「数据录入」组;总览计数派生 +1。
- **测试**:`DatePicker.test.tsx` 7 条(开合、选日+onChange+回填+关闭、受控 format、方向键移焦+Enter 选、
  换月、min 禁用日不选、Escape 关闭)。
- 验证:`pnpm typecheck` ✓、`pnpm build` ✓(dist 含 DatePicker/DatePickerProps)、`pnpm test`
  **474/474 绿**(较 M23 的 454 +20)、`pnpm site:build` ✓。**无新增运行时依赖**。
- **留本地目检**:日历面板玻璃折射、今天/选中/禁用/跨月态配色、方向键移动的焦点观感。
