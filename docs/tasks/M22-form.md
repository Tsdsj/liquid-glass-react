---
status: todo
depends: [M21]
---

# M22 — 四阶段·Form 表单

> 四阶段组件线之一。把现有输入组件（Input/Textarea/Select/Checkbox/Radio/Switch/Slider）
> 编排成**受控表单**:表单容器 + 字段布局 + 自写校验 + 错误提示。串行 M19→M26。

无新运行时依赖:校验逻辑**自写**在 `src/core/utils/`,不引 zod/yup。

## 执行前提

- 遵守 `AGENTS.md` 与 `docs/component-guide.md`(五件套、size/disabled/受控约定、
  `src/styles/index.css` 追加 @import、`src/index.ts` 导出)。
- 本卡 props 表即公共 API 定稿。a11y(label 关联、错误 aria)是验收项。
- 表单不自己造输入控件,只做**编排层**;字段内容由使用者放入现有组件。

## API 定稿

```ts
export interface FormProps<T = Record<string, unknown>> {
  initialValues?: Partial<T>;
  onSubmit?: (values: T) => void | Promise<void>;
  onValuesChange?: (changed: Partial<T>, all: T) => void;
  layout?: 'vertical' | 'horizontal';   // 默认 'vertical'
  disabled?: boolean;                    // 整表禁用
  children: React.ReactNode;
}

export interface FormItemProps {
  name: string;                          // 字段键,连接值与校验
  label?: React.ReactNode;
  required?: boolean;                    // 视觉星标 + 内置 required 规则
  rules?: FormRule[];                    // 自写校验规则
  help?: React.ReactNode;               // 辅助说明
  children: React.ReactElement;          // 单个受控控件,由 FormItem 注入 value/onChange
}

export type FormRule =
  | { required: true; message: string }
  | { min: number; message: string } | { max: number; message: string }
  | { pattern: RegExp; message: string }
  | { validator: (value: unknown, all: Record<string, unknown>) => string | null }; // null=通过

export interface FormInstance<T = Record<string, unknown>> {
  getValues(): T; setValue(name: string, v: unknown): void;
  validate(): Promise<boolean>; reset(): void;
}
export function useForm<T>(): FormInstance<T>;   // 可选外部实例
```

- **受控注入**:`FormItem` 通过 context 拿 `name` 对应值,克隆 `children` 注入 `value`/`onChange`
  (或组件既有的受控 prop 名);校验失败时给控件 `aria-invalid` + 关联 `aria-describedby` 到错误文案。
- **校验**:blur / submit 触发(可配),自写规则求值,首个失败规则的 message 显示;submit 时全量校验、
  全通过才回调 `onSubmit`。
- **a11y**:`label` 与控件 `htmlFor`/`id` 关联(缺省用 useId);错误文案 `role="alert"`;
  required 星标有无障碍文本。
- **玻璃**:FormItem 容器不套玻璃(布局层);错误/help 为普通文本层。

## 实现步骤

1. `src/core/utils/validate-rules.ts`(纯函数:规则数组 + 值 → 首个错误 message 或 null)+ 单测(RED→GREEN)。
2. Form context + `useForm` 实例 + FormItem 受控注入。
3. Form / FormItem 组件(component-guide checklist)。
4. site:`site/src/demos/` 新增 formDoc(登录/设置类真实示例 + API 表,中英双语);总览计数同步。
5. 全量验证 + 提交。

## 测试要求

- 校验纯函数:required/min/max/pattern/validator 逐条 + 组合 + 首错优先。
- 受控注入:改子控件值 → 表单值更新;submit 校验拦截;reset 复位;`useForm` 外部实例读写。
- a11y:label 关联、`aria-invalid`、错误 `role="alert"`、`aria-describedby` 指向错误。
- 键盘:Tab 顺序、Enter 提交(单行输入场景)。
- site App.test 增 Form 详情页可渲染断言。

## 验收标准

- [ ] Form/FormItem/useForm/类型 从 `src/index.ts` 导出,API 与本卡一致。
- [ ] 校验、受控注入、submit 拦截、reset 全绿;a11y 断言(label/aria-invalid/alert)通过。
- [ ] site 出现 Form 卡片,详情页含真实示例 + API 表,中英双语,总览计数同步。
- [ ] `pnpm typecheck && pnpm build && pnpm test` 通过,存量断言不削弱。
- [ ] 无新增运行时依赖(校验自写)。

## 明确非目标

- 异步远程校验编排/防抖策略(留 validator 自行实现);字段数组/动态增删列表;
  与第三方表单库(RHF/Formik)适配;文件上传字段。

## 完成记录

（实现后追加）
