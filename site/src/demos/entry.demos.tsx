import { useState } from 'react';
import {
  Checkbox,
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
  ],
  api: [
    {
      title: 'Select',
      rows: [
        { prop: 'options', type: 'SelectOption[]', description: { 'zh-CN': '选项列表({ value, label, disabled? })', 'en-US': 'Options ({ value, label, disabled? })' } },
        { prop: 'value / defaultValue', type: 'string', description: { 'zh-CN': '受控 / 非受控选中值', 'en-US': 'Controlled / uncontrolled value' } },
        { prop: 'onChange', type: '(value: string) => void', description: { 'zh-CN': '选中变化回调', 'en-US': 'Change callback' } },
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
