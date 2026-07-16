---
status: todo
depends: [M31]
---

# M32 — 五阶段·RangePicker / TimePicker

> 五阶段收尾卡。日期线补全(M24 当年的非目标转正):**日期范围选择 + 时间选择**。
> 最大化复用 M24 资产——`src/core/utils/date.ts` 纯函数与内部 Calendar 面板。
> 串行 M27→M32,本卡为五阶段终点。无新运行时依赖(时间解析/格式化继续自写)。

## API 定稿

### RangePicker

```ts
export type DateRange = [Date | null, Date | null];

export interface RangePickerProps {
  value?: DateRange; defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  min?: Date; max?: Date;
  disabledDate?: (date: Date) => boolean;
  format?: string;                       // 默认 'YYYY-MM-DD'
  weekStartsOn?: 0 | 1;                  // 默认 1
  placeholder?: [string, string];
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  locale?: 'zh-CN' | 'en-US';
  'aria-label'?: string;
}
```

- 触发器:一个组合输入(起/止两段 + 分隔箭头),点击开 Popover;面板为**双月并排 Calendar**
  (窄屏降为单月)。
- 选择流:第一次点选起点 → hover 实时预览范围底色 → 第二次点选终点(早于起点则交换)→
  回调并关闭;`Escape` 半程取消恢复原值。
- 范围态样式:起/止端点强调、区间内浅 accent 底、跨月连续;禁用日不可作端点。
- 键盘:沿用 Calendar 既有 grid 导航,Enter 依次确定起/止。
- 实现:内部 Calendar 增可选 range 高亮 props(内部扩展,**不改 DatePicker 公共 API**);
  范围区间判定(`isInRange`/端点交换)抽纯函数单测。

### TimePicker

```ts
export interface TimePickerProps {
  value?: string | null;                 // 'HH:mm' 或含秒 'HH:mm:ss',与 format 一致
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
  format?: 'HH:mm' | 'HH:mm:ss';         // 默认 'HH:mm'
  hourStep?: number; minuteStep?: number; secondStep?: number;   // 默认 1
  min?: string; max?: string;            // 同 format 的边界
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  locale?: 'zh-CN' | 'en-US';
  'aria-label'?: string;
}
```

- 值用**字符串**(避免与 Date 时区/日期部分纠缠,消费者拼装自由);
  `parseTime`/`formatTime`/`clampTime`/步进列生成自写在 `src/core/utils/time.ts`,纯函数单测。
- 面板:时/分(/秒)滚动列,列内 `role="listbox"` + option,上下键步进、Home/End、
  typeahead 数字直输;选中项滚动到可视区;确定即回调(分/秒粒度实时回调,关闭走 Popover 惯例)。
- 触发器:只读 Input + `role="combobox"`(沿用 M24 模式)。

## 实现步骤

1. `src/core/utils/time.ts` 纯函数 + 范围判定纯函数(RED→GREEN)。
2. Calendar 内部 range 扩展 + RangePicker 组件。
3. TimePicker 列面板 + 组件。
4. site:两条 ComponentDoc(范围预览/步进边界演示 + API 表,中英双语);计数派生同步。
5. 全量验证 + 提交(两组件各自提交)。

## 测试要求

- 纯函数:time 解析/格式化/步进/clamp 边界(23:59、跨步进对齐);范围端点交换/区间判定。
- RangePicker:两次点选成范围、反序交换、hover 预览态、禁用日拦截、Escape 半程恢复、
  受控/非受控;键盘走查。
- TimePicker:列键盘步进、直输解析、min/max clamp、format 含秒、受控/非受控。
- 双双纳入 SSR + a11y 冒烟与 `smoke:consumer`;site App.test 详情页断言。

## 验收标准

- [ ] RangePicker/TimePicker 及类型从 `src/index.ts` 导出,API 与本卡一致;DatePicker 公共 API 零变化。
- [ ] 纯函数与交互/键盘/a11y 断言完整通过;半程取消/端点交换等边界有测试。
- [ ] site 两张新卡片(演示 + API 表,中英双语),计数派生同步。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,存量断言不削弱,无新运行时依赖。
- [ ] 完成记录注明:双月面板与范围底色观感留本地目检。

## 明确非目标

- DateTimePicker 合体;预设快捷范围(近 7 天等);12 小时制/AM-PM;时区处理;自然语言输入。

## 完成记录

（实现后追加）
