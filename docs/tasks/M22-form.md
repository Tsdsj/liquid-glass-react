---
status: done
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

- **纯校验** `src/core/utils/validate-rules.ts`:`validateValue(value, rules, all?)` → 首个失败
  message 或 null。`required`/`validator` 恒跑,`min/max/pattern` 跳过空值;min/max 对数字比
  magnitude、对字符串/数组比 length;`false`/空串/空数组视为空(必填能拦未勾选)。17 单测(RED→GREEN)。
- **Form 架构**(`src/components/Form/`):
  - `form-store.ts` `FormStore` 类:values/errors + `subscribe`/`getSnapshot`(useSyncExternalStore)
    + `initialize`(幂等种子)+ `setValue`(已有错误时即时重校验,否则不打扰)+ `validateField` /
    `validate`(全量)+ `reset`。
  - `FormContext` + `useForm()`(返回稳定 `FormInstance`;store 经 WeakMap 隐藏,不进公共类型)。
  - `Form`:解析 store(外部 `form` 或内部)、种子 initialValues、submit 前全量校验、通过才 onSubmit。
  - `FormItem`:`cloneElement` 注入受控 prop——`useSyncExternalStore` 取本字段值/错误,注入
    `[valuePropName]`/`[trigger]`/`onBlur`(失焦校验)/`id`/`disabled`/`aria-invalid`/`aria-required`/
    `aria-describedby`;label 经 `htmlFor` 关联,错误 `role="alert"`。
- **API 细化(记录偏差,均落在卡内「或组件既有的受控 prop 名」的意图内)**:
  - `FormProps` 增 `form?: FormInstance`——`useForm()` 外部实例需要它接线(卡内 API 表未列,
    但「可选外部实例」隐含);
  - `FormItemProps` 增 `valuePropName`(默认 'value')/ `trigger`(默认 'onChange')/
    `getValueFromEvent`——因输入组件受控约定**不统一**(Input/Textarea 原生 `onChange(event)`、
    Select/Slider/RadioGroup `onChange(value)`、Checkbox/Switch `checked`+`onCheckedChange`)。
    默认 `getValueFromEvent` 自动拆 DOM 事件(取 `target.value`),否则透传首参——覆盖全部约定。
- **实现决策**:① 必填星标用 CSS `::after '*'`(不污染 label 文本 → 控件可访问名干净、
  `getByLabelText` 精确匹配;真无障碍靠注入的 `aria-required`);② `FormItem` 的
  `useSyncExternalStore` 传第三参 `getServerSnapshot`(否则 `renderToString` 抛错)——SSR 冒烟捕获;
  ③ 未种子字段注入值兜底(checked→false、其余→''),避免受控/非受控警告(数值字段建议 initialValues 种子)。
- **导出/注册**:`src/index.ts` 增 `Form`/`FormItem`/`useForm` + 类型 `FormProps`/`FormItemProps`/
  `FormInstance`/`FormRule`;`styles/index.css` @import `form.css`;五件套齐全(含 `Form.stories.tsx`)。
- **文档**:`entry.demos.tsx` 新增 `formDoc`(登录表单真实示例 + Form/FormItem/FormRule/FormInstance
  四张 API 表,中英双语),接入 registry「数据录入」组;站点总览计数由 `COMPONENT_DOCS` 派生自动 +1。
- **测试**:`Form.test.tsx` 6 条(label 关联+提交、必填拦截+a11y、改正清错、布尔控件注入、整表禁用、
  外部 useForm 读写/reset);Form 纳入 SSR 冒烟与 a11y 冒烟(无 critical/serious 违规)。
- 验证:`pnpm typecheck` ✓、`pnpm build` ✓(dist 类型含 7 个 Form 公共项)、`pnpm test`
  **437/437 绿**(较 M21 的 412 +25)、`pnpm site:build` ✓。**无新增运行时依赖**(校验自写)。
- **留本地目检**:表单玻璃控件观感、错误态红色描边与星标、horizontal 布局。
