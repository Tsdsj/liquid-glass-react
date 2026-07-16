import { useState } from 'react';
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  FormItem,
  Input,
  Select,
  Slider,
  Switch,
  Textarea,
  type SelectOption,
} from '@ttqtt/liquid-glass-react';
import type { ComponentDoc } from './types';

const CATEGORY = { 'zh-CN': '数据录入', 'en-US': 'Data entry' };

const FRUIT_OPTIONS: SelectOption[] = [
  { value: 'apple', label: '苹果 Apple' },
  { value: 'peach', label: '桃子 Peach' },
  { value: 'grape', label: '葡萄 Grape', disabled: true },
  { value: 'lychee', label: '荔枝 Lychee' },
];

function SliderWithValue() {
  const [value, setValue] = useState(40);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 280 }}>
      <Slider value={value} onChange={setValue} aria-label="演示滑块" />
      <span style={{ color: '#fff', minWidth: '3ch' }}>{value}</span>
    </div>
  );
}

export const checkboxDoc: ComponentDoc = {
  slug: 'checkbox',
  name: 'Checkbox',
  title: { 'zh-CN': '复选框', 'en-US': 'Checkbox' },
  category: CATEGORY,
  description: {
    'zh-CN': '玻璃质感复选框,支持受控/非受控、半选与三档尺寸。',
    'en-US': 'Glass checkbox with controlled/uncontrolled modes, indeterminate state and three sizes.',
  },
  renderPreview: () => <Checkbox defaultChecked>选项</Checkbox>,
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础与半选', 'en-US': 'Basic and indeterminate' },
      description: {
        'zh-CN': 'indeterminate 常用于父子选择的中间态。',
        'en-US': 'indeterminate marks the in-between state of grouped selection.',
      },
      code: `
import { Checkbox } from '@ttqtt/liquid-glass-react';

<Checkbox defaultChecked>已勾选</Checkbox>
<Checkbox indeterminate>半选</Checkbox>
<Checkbox disabled>禁用</Checkbox>`,
      render: () => (
        <>
          <Checkbox defaultChecked>已勾选</Checkbox>
          <Checkbox indeterminate>半选</Checkbox>
          <Checkbox disabled>禁用</Checkbox>
        </>
      ),
    },
    {
      id: 'sizes',
      title: { 'zh-CN': '尺寸', 'en-US': 'Sizes' },
      description: { 'zh-CN': '与其他控件共用 sm/md/lg 三档。', 'en-US': 'Shares the sm/md/lg scale with other controls.' },
      code: `
<Checkbox size="sm">sm</Checkbox>
<Checkbox size="md">md</Checkbox>
<Checkbox size="lg">lg</Checkbox>`,
      render: () => (
        <>
          <Checkbox size="sm">sm</Checkbox>
          <Checkbox size="md">md</Checkbox>
          <Checkbox size="lg">lg</Checkbox>
        </>
      ),
    },
  ],
  api: [
    {
      title: 'Checkbox',
      rows: [
        { prop: 'checked / defaultChecked', type: 'boolean', description: { 'zh-CN': '受控 / 非受控选中态', 'en-US': 'Controlled / uncontrolled checked state' } },
        { prop: 'onCheckedChange', type: '(checked: boolean) => void', description: { 'zh-CN': '选中变化回调', 'en-US': 'Change callback' } },
        { prop: 'indeterminate', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '半选态', 'en-US': 'Indeterminate state' } },
        { prop: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: { 'zh-CN': '尺寸', 'en-US': 'Size' } },
      ],
    },
  ],
};

export const inputDoc: ComponentDoc = {
  slug: 'input',
  name: 'Input',
  title: { 'zh-CN': '输入框', 'en-US': 'Input' },
  category: CATEGORY,
  description: {
    'zh-CN': '玻璃输入框,支持前后缀、校验失败态与三档尺寸。',
    'en-US': 'Glass text input with prefix/suffix slots, invalid state and three sizes.',
  },
  renderPreview: () => <Input placeholder="输入内容" style={{ width: 160 }} />,
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '前后缀与状态', 'en-US': 'Affixes and states' },
      description: {
        'zh-CN': 'prefix/suffix 放图标或单位;invalid 标记校验失败。',
        'en-US': 'Use prefix/suffix for icons or units; invalid marks validation failures.',
      },
      code: `
import { Input } from '@ttqtt/liquid-glass-react';

<Input placeholder="搜索组件" prefix="🔍" />
<Input placeholder="金额" suffix="元" />
<Input defaultValue="格式不正确" invalid />
<Input placeholder="禁用" disabled />`,
      render: () => (
        <div style={{ display: 'grid', gap: 12, minWidth: 260 }}>
          <Input placeholder="搜索组件" prefix="🔍" aria-label="搜索" />
          <Input placeholder="金额" suffix="元" aria-label="金额" />
          <Input defaultValue="格式不正确" invalid aria-label="校验失败" />
          <Input placeholder="禁用" disabled aria-label="禁用" />
        </div>
      ),
    },
  ],
  api: [
    {
      title: 'Input',
      rows: [
        { prop: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: { 'zh-CN': '尺寸', 'en-US': 'Size' } },
        { prop: 'prefix / suffix', type: 'ReactNode', description: { 'zh-CN': '前缀 / 后缀内容', 'en-US': 'Leading / trailing content' } },
        { prop: 'invalid', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '校验失败态', 'en-US': 'Invalid state' } },
      ],
    },
  ],
};

export const textareaDoc: ComponentDoc = {
  slug: 'textarea',
  name: 'Textarea',
  title: { 'zh-CN': '多行输入', 'en-US': 'Textarea' },
  category: CATEGORY,
  description: {
    'zh-CN': '多行玻璃输入,autoResize 随内容自动撑高。',
    'en-US': 'Multiline glass input; autoResize grows with its content.',
  },
  renderPreview: () => <Textarea placeholder="多行内容" rows={2} style={{ width: 160 }} />,
  demos: [
    {
      id: 'auto-resize',
      title: { 'zh-CN': '自动高度', 'en-US': 'Auto resize' },
      description: { 'zh-CN': '输入换行时高度自动增长。', 'en-US': 'Height grows as you add lines.' },
      code: `
import { Textarea } from '@ttqtt/liquid-glass-react';

<Textarea autoResize placeholder="输入多行内容试试" />`,
      render: () => (
        <Textarea autoResize placeholder="输入多行内容试试" aria-label="多行输入" style={{ minWidth: 280 }} />
      ),
    },
  ],
  api: [
    {
      title: 'Textarea',
      rows: [
        { prop: 'autoResize', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '随内容自动调整高度', 'en-US': 'Grow with content' } },
        { prop: 'invalid', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '校验失败态', 'en-US': 'Invalid state' } },
      ],
    },
  ],
};

export const selectDoc: ComponentDoc = {
  slug: 'select',
  name: 'Select',
  title: { 'zh-CN': '选择器', 'en-US': 'Select' },
  category: CATEGORY,
  description: {
    'zh-CN': '玻璃下拉选择器:面板真折射、滚动边缘渐隐,键盘导航与首字母跳转开箱即用。',
    'en-US': 'Glass dropdown with refracting panel, scroll-edge fades, keyboard navigation and typeahead built in.',
  },
  renderPreview: () => <Select options={FRUIT_OPTIONS} placeholder="请选择" aria-label="预览" />,
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础用法', 'en-US': 'Basic' },
      description: {
        'zh-CN': '打开面板观察玻璃折射;禁用项自动跳过键盘导航。',
        'en-US': 'Open the panel to see refraction; disabled options are skipped by keyboard navigation.',
      },
      code: `
import { Select } from '@ttqtt/liquid-glass-react';

<Select
  aria-label="水果"
  options={[
    { value: 'apple', label: '苹果' },
    { value: 'peach', label: '桃子' },
    { value: 'grape', label: '葡萄', disabled: true },
  ]}
/>`,
      render: () => <Select options={FRUIT_OPTIONS} aria-label="水果" />,
    },
    {
      id: 'multiple-search',
      title: { 'zh-CN': '多选与搜索', 'en-US': 'Multiple & search' },
      description: {
        'zh-CN': 'multiple 下选中不关面板、触发器显示为标签、Backspace 删最后一项;searchable 在面板顶部加模糊过滤输入。两者可同时开。',
        'en-US': 'multiple keeps the panel open, shows picks as tags and removes the last one with Backspace; searchable adds a fuzzy filter input. They compose.',
      },
      code: `
<Select multiple searchable aria-label="水果"
  defaultValue={['apple']}
  onChange={(values) => console.log(values)}   // string[]
  options={options}
/>`,
      render: () => (
        <Select
          multiple
          searchable
          aria-label="水果多选"
          defaultValue={['apple']}
          options={FRUIT_OPTIONS}
        />
      ),
    },
  ],
  api: [
    {
      title: 'Select',
      rows: [
        { prop: 'options', type: 'SelectOption[]', description: { 'zh-CN': '选项列表({ value, label, disabled? })', 'en-US': 'Options ({ value, label, disabled? })' } },
        { prop: 'value / defaultValue', type: 'string | string[]', description: { 'zh-CN': '受控 / 非受控值(multiple 时为数组)', 'en-US': 'Controlled / uncontrolled value (array with multiple)' } },
        { prop: 'onChange', type: '(value) => void', description: { 'zh-CN': '选中变化(multiple 回调 string[])', 'en-US': 'Change callback (string[] with multiple)' } },
        { prop: 'multiple', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '多选:选中不关面板,Backspace 删最后一项', 'en-US': 'Multiple: keeps the panel open; Backspace drops the last pick' } },
        { prop: 'searchable', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '面板顶部模糊过滤输入', 'en-US': 'Fuzzy filter input at the top of the panel' } },
        { prop: 'placeholder', type: 'string', defaultValue: '请选择 / Select', description: { 'zh-CN': '占位文案,随语言环境切换', 'en-US': 'Placeholder, localized by config' } },
        { prop: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: { 'zh-CN': '尺寸', 'en-US': 'Size' } },
        { prop: 'disabled', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '禁用', 'en-US': 'Disabled' } },
      ],
    },
  ],
};

export const sliderDoc: ComponentDoc = {
  slug: 'slider',
  name: 'Slider',
  title: { 'zh-CN': '滑块', 'en-US': 'Slider' },
  category: CATEGORY,
  description: {
    'zh-CN': '玻璃滑块,拖动时 thumb 光影增强;支持键盘步进与受控用法。',
    'en-US': 'Glass slider whose thumb lights up while dragging; keyboard stepping and controlled usage supported.',
  },
  renderPreview: () => <Slider defaultValue={60} aria-label="预览" />,
  demos: [
    {
      id: 'controlled',
      title: { 'zh-CN': '受控滑块', 'en-US': 'Controlled' },
      description: { 'zh-CN': '拖动或用方向键改变数值。', 'en-US': 'Drag or use arrow keys to change the value.' },
      code: `
import { useState } from 'react';
import { Slider } from '@ttqtt/liquid-glass-react';

const [value, setValue] = useState(40);
<Slider value={value} onChange={setValue} aria-label="音量" />`,
      render: () => <SliderWithValue />,
    },
  ],
  api: [
    {
      title: 'Slider',
      rows: [
        { prop: 'value / defaultValue', type: 'number', description: { 'zh-CN': '受控 / 非受控数值', 'en-US': 'Controlled / uncontrolled value' } },
        { prop: 'onChange', type: '(value: number) => void', description: { 'zh-CN': '拖动过程回调', 'en-US': 'Fires while dragging' } },
        { prop: 'onChangeEnd', type: '(value: number) => void', description: { 'zh-CN': '交互结束回调', 'en-US': 'Fires when the interaction ends' } },
        { prop: 'min / max / step', type: 'number', defaultValue: '0 / 100 / 1', description: { 'zh-CN': '取值范围与步长', 'en-US': 'Range and step' } },
        { prop: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: { 'zh-CN': '尺寸', 'en-US': 'Size' } },
      ],
    },
  ],
};

export const switchDoc: ComponentDoc = {
  slug: 'switch',
  name: 'Switch',
  title: { 'zh-CN': '开关', 'en-US': 'Switch' },
  category: CATEGORY,
  description: {
    'zh-CN': '玻璃开关,thumb 在交互时增强光影,弹性回位。',
    'en-US': 'Glass switch whose thumb lights up during interaction and settles with a spring.',
  },
  renderPreview: () => <Switch defaultChecked aria-label="预览" />,
  demos: [
    {
      id: 'basic',
      title: { 'zh-CN': '基础用法', 'en-US': 'Basic' },
      description: { 'zh-CN': '点按或用空格键切换。', 'en-US': 'Toggle by click or Space.' },
      code: `
import { Switch } from '@ttqtt/liquid-glass-react';

<Switch defaultChecked aria-label="开关" />
<Switch size="lg" aria-label="大号开关" />
<Switch disabled aria-label="禁用" />`,
      render: () => (
        <>
          <Switch defaultChecked aria-label="开关" />
          <Switch size="lg" aria-label="大号开关" />
          <Switch disabled aria-label="禁用" />
        </>
      ),
    },
  ],
  api: [
    {
      title: 'Switch',
      rows: [
        { prop: 'checked / defaultChecked', type: 'boolean', description: { 'zh-CN': '受控 / 非受控开关态', 'en-US': 'Controlled / uncontrolled state' } },
        { prop: 'onCheckedChange', type: '(checked: boolean) => void', description: { 'zh-CN': '切换回调', 'en-US': 'Change callback' } },
        { prop: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: { 'zh-CN': '尺寸', 'en-US': 'Size' } },
      ],
    },
  ],
};

function LoginFormDemo() {
  const [submitted, setSubmitted] = useState<string | null>(null);
  return (
    <div style={{ minWidth: 320, maxWidth: 400 }}>
      <Form
        initialValues={{ email: '', password: '', agree: false }}
        onSubmit={(values) => setSubmitted(JSON.stringify(values))}
      >
        <FormItem
          name="email"
          label="邮箱"
          required
          rules={[{ pattern: /.+@.+\..+/, message: '邮箱格式不正确' }]}
        >
          <Input placeholder="you@example.com" />
        </FormItem>
        <FormItem name="password" label="密码" required rules={[{ min: 6, message: '至少 6 位' }]}>
          <Input type="password" placeholder="至少 6 位" />
        </FormItem>
        <FormItem name="agree" valuePropName="checked" trigger="onCheckedChange" required>
          <Checkbox>我已阅读并同意服务条款</Checkbox>
        </FormItem>
        <Button variant="accent" type="submit">
          登录
        </Button>
      </Form>
      {submitted ? (
        <p style={{ marginTop: 12, color: 'var(--lg-text-secondary)' }}>提交成功:{submitted}</p>
      ) : null}
    </div>
  );
}

export const formDoc: ComponentDoc = {
  slug: 'form',
  name: 'Form',
  title: { 'zh-CN': '表单', 'en-US': 'Form' },
  category: CATEGORY,
  description: {
    'zh-CN': '把现有输入组件编排成受控表单:自写校验、字段布局、错误提示与 a11y 关联,零运行时依赖。',
    'en-US': 'Orchestrates the input components into a controlled form: hand-written validation, field layout, error messaging and a11y wiring — with no runtime dependency.',
  },
  renderPreview: () => <LoginFormDemo />,
  demos: [
    {
      id: 'login',
      title: { 'zh-CN': '登录表单与校验', 'en-US': 'Login form with validation' },
      description: {
        'zh-CN': 'required 加内置必填规则;rules 支持 min/max/pattern/validator。布尔控件用 valuePropName/trigger 适配。提交时全量校验,全通过才回调 onSubmit。',
        'en-US': 'required adds the built-in rule; rules cover min/max/pattern/validator. Boolean controls adapt via valuePropName/trigger. Submit validates everything and only then calls onSubmit.',
      },
      code: `
import { Form, FormItem, Button, Input, Checkbox } from '@ttqtt/liquid-glass-react';

<Form
  initialValues={{ email: '', password: '', agree: false }}
  onSubmit={(values) => console.log(values)}
>
  <FormItem name="email" label="邮箱" required
    rules={[{ pattern: /.+@.+\\..+/, message: '邮箱格式不正确' }]}>
    <Input placeholder="you@example.com" />
  </FormItem>
  <FormItem name="password" label="密码" required
    rules={[{ min: 6, message: '至少 6 位' }]}>
    <Input type="password" />
  </FormItem>
  {/* 布尔控件:声明它的受控 prop 名与事件名 */}
  <FormItem name="agree" valuePropName="checked" trigger="onCheckedChange" required>
    <Checkbox>我已阅读并同意服务条款</Checkbox>
  </FormItem>
  <Button variant="accent" type="submit">登录</Button>
</Form>`,
      render: () => <LoginFormDemo />,
    },
  ],
  api: [
    {
      title: 'Form',
      rows: [
        { prop: 'form', type: 'FormInstance', description: { 'zh-CN': 'useForm() 外部实例(可选)', 'en-US': 'External useForm() instance (optional)' } },
        { prop: 'initialValues', type: 'Partial<T>', description: { 'zh-CN': '初始值', 'en-US': 'Initial values' } },
        { prop: 'onSubmit', type: '(values: T) => void', description: { 'zh-CN': '全部校验通过后回调', 'en-US': 'Called after all rules pass' } },
        { prop: 'onValuesChange', type: '(changed, all) => void', description: { 'zh-CN': '值变化回调', 'en-US': 'Value change callback' } },
        { prop: 'layout', type: "'vertical' | 'horizontal'", defaultValue: "'vertical'", description: { 'zh-CN': '布局', 'en-US': 'Layout' } },
        { prop: 'disabled', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '整表禁用', 'en-US': 'Disable the whole form' } },
      ],
    },
    {
      title: 'FormItem',
      rows: [
        { prop: 'name', type: 'string', description: { 'zh-CN': '字段键', 'en-US': 'Field key' } },
        { prop: 'label', type: 'ReactNode', description: { 'zh-CN': '标签(与控件自动关联)', 'en-US': 'Label (auto-associated)' } },
        { prop: 'required', type: 'boolean', defaultValue: 'false', description: { 'zh-CN': '必填(星标 + 内置规则)', 'en-US': 'Required (marker + built-in rule)' } },
        { prop: 'rules', type: 'FormRule[]', description: { 'zh-CN': '校验规则', 'en-US': 'Validation rules' } },
        { prop: 'help', type: 'ReactNode', description: { 'zh-CN': '辅助说明', 'en-US': 'Helper text' } },
        { prop: 'valuePropName', type: 'string', defaultValue: "'value'", description: { 'zh-CN': "控件受控 prop 名(如 'checked')", 'en-US': "Control's value prop (e.g. 'checked')" } },
        { prop: 'trigger', type: 'string', defaultValue: "'onChange'", description: { 'zh-CN': "控件变化事件名(如 'onCheckedChange')", 'en-US': "Control's change event (e.g. 'onCheckedChange')" } },
      ],
    },
    {
      title: 'FormRule',
      rows: [
        { prop: '{ required, message }', type: '{ required: true }', description: { 'zh-CN': '必填', 'en-US': 'Required' } },
        { prop: '{ min / max, message }', type: 'number', description: { 'zh-CN': '数字比大小,字符串/数组比长度', 'en-US': 'Number magnitude, or string/array length' } },
        { prop: '{ pattern, message }', type: 'RegExp', description: { 'zh-CN': '正则(空值跳过)', 'en-US': 'Regex (skips empty)' } },
        { prop: '{ validator }', type: '(value, all) => string | null', description: { 'zh-CN': '自定义,返回错误文案或 null', 'en-US': 'Custom; return an error message or null' } },
      ],
    },
    {
      title: 'useForm() → FormInstance',
      rows: [
        { prop: 'getValues()', type: '() => T', description: { 'zh-CN': '读取全部值', 'en-US': 'Read all values' } },
        { prop: 'setValue(name, value)', type: 'void', description: { 'zh-CN': '设置某字段', 'en-US': 'Set a field' } },
        { prop: 'validate()', type: '() => Promise<boolean>', description: { 'zh-CN': '手动全量校验', 'en-US': 'Validate all fields' } },
        { prop: 'reset()', type: '() => void', description: { 'zh-CN': '复位到 initialValues', 'en-US': 'Reset to initialValues' } },
      ],
    },
  ],
};

function DatePickerDemo() {
  const [value, setValue] = useState<Date | null>(new Date(2024, 0, 15));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 260 }}>
      <DatePicker
        aria-label="日期"
        placeholder="选择日期"
        value={value}
        onChange={setValue}
        min={new Date(2024, 0, 5)}
        max={new Date(2024, 1, 20)}
        disabledDate={(date) => date.getDay() === 0 || date.getDay() === 6}
      />
      <span style={{ color: 'var(--lg-text-secondary)' }}>
        {value ? value.toLocaleDateString() : '未选择(周末与范围外禁用)'}
      </span>
    </div>
  );
}

export const datePickerDoc: ComponentDoc = {
  slug: 'date-picker',
  name: 'DatePicker',
  title: { 'zh-CN': '日期选择', 'en-US': 'DatePicker' },
  category: CATEGORY,
  description: {
    'zh-CN': '只读输入 + 弹出日历面板:方向键/PageUp·Down/Home·End 键盘导航,min/max 与 disabledDate 拦截,日期算法自写,零运行时依赖。',
    'en-US': 'A read-only input with a popup calendar: arrow / PageUp·Down / Home·End keyboard navigation, min/max and disabledDate gating, hand-written date math, no runtime dependency.',
  },
  renderPreview: () => <DatePickerDemo />,
  demos: [
    {
      id: 'range',
      title: { 'zh-CN': '受控 + 范围 + 禁用日', 'en-US': 'Controlled + range + disabled days' },
      description: {
        'zh-CN': 'min/max 限定可选范围,disabledDate 逐日拦截(此处禁用周末)。点开面板用方向键移动、Enter/点击选中、Escape 关闭,焦点自动进入网格并在关闭后复位到输入框。',
        'en-US': 'min/max bound the range and disabledDate blocks days (weekends here). Open the panel, move with the arrow keys, select with Enter/click, close with Escape — focus enters the grid and returns to the input on close.',
      },
      code: `
import { DatePicker } from '@ttqtt/liquid-glass-react';

const [value, setValue] = useState<Date | null>(new Date(2024, 0, 15));

<DatePicker
  aria-label="日期"
  value={value}
  onChange={setValue}
  min={new Date(2024, 0, 5)}
  max={new Date(2024, 1, 20)}
  disabledDate={(date) => date.getDay() === 0 || date.getDay() === 6}
/>`,
      render: () => <DatePickerDemo />,
    },
  ],
  api: [
    {
      title: 'DatePicker',
      rows: [
        { prop: 'value / defaultValue', type: 'Date | null', description: { 'zh-CN': '受控 / 非受控值', 'en-US': 'Controlled / uncontrolled value' } },
        { prop: 'onChange', type: '(date: Date | null) => void', description: { 'zh-CN': '选中变化', 'en-US': 'Change callback' } },
        { prop: 'min / max', type: 'Date', description: { 'zh-CN': '可选范围边界', 'en-US': 'Selectable range bounds' } },
        { prop: 'disabledDate', type: '(date: Date) => boolean', description: { 'zh-CN': '逐日禁用判定', 'en-US': 'Per-day disable predicate' } },
        { prop: 'format', type: 'string', defaultValue: "'YYYY-MM-DD'", description: { 'zh-CN': '显示格式', 'en-US': 'Display format' } },
        { prop: 'weekStartsOn', type: '0 | 1', defaultValue: '1', description: { 'zh-CN': '周起始(0 周日 / 1 周一)', 'en-US': 'Week start (0 Sun / 1 Mon)' } },
        { prop: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: { 'zh-CN': '尺寸', 'en-US': 'Size' } },
        { prop: 'locale', type: "'zh-CN' | 'en-US'", description: { 'zh-CN': '缺省取 LiquidGlassConfig', 'en-US': 'Defaults to LiquidGlassConfig' } },
      ],
    },
  ],
};
