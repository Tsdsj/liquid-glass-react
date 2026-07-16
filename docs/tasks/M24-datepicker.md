---
status: todo
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

（实现后追加）
