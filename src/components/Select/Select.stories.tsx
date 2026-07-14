import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { Select, type SelectOption, type SelectProps } from './Select';

const STACK_STYLE = {
  display: 'grid',
  gap: '16px',
  width: 'min(100%, 360px)',
} as const;

const COPY = {
  'zh-CN': {
    placeholder: '请选择水果',
    label: '偏好的水果',
    saved: '当前选择',
    apple: '苹果',
    banana: '香蕉',
    cherry: '樱桃',
    grape: '葡萄',
    disabled: '已停用',
  },
  'en-US': {
    placeholder: 'Choose a fruit',
    label: 'Preferred fruit',
    saved: 'Current selection',
    apple: 'Apple',
    banana: 'Banana',
    cherry: 'Cherry',
    grape: 'Grape',
    disabled: 'Disabled',
  },
} as const;

function getOptions(locale: 'zh-CN' | 'en-US'): SelectOption[] {
  const copy = COPY[locale];
  return [
    { value: 'apple', label: copy.apple },
    { value: 'banana', label: copy.banana, disabled: true },
    { value: 'cherry', label: copy.cherry },
    { value: 'grape', label: copy.grape },
  ];
}

function LocalizedPlayground(props: SelectProps) {
  const { locale } = useLiquidGlassContext();
  return (
    <Select
      {...props}
      options={props.options.length > 0 ? props.options : getOptions(locale)}
      placeholder={props.placeholder ?? COPY[locale].placeholder}
    />
  );
}

function SelectVariants() {
  const { locale } = useLiquidGlassContext();
  const options = getOptions(locale);
  const placeholder = COPY[locale].placeholder;
  return (
    <div style={STACK_STYLE}>
      <Select size="sm" options={options} placeholder={placeholder} />
      <Select size="md" options={options} placeholder={placeholder} />
      <Select size="lg" options={options} placeholder={placeholder} />
    </div>
  );
}

function SelectStates() {
  const { locale } = useLiquidGlassContext();
  const options = getOptions(locale);
  return (
    <div style={STACK_STYLE}>
      <Select options={options} placeholder={COPY[locale].placeholder} />
      <Select options={options} defaultValue="cherry" />
      <Select options={options} disabled placeholder={COPY[locale].disabled} />
    </div>
  );
}

function FormScenario() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  const [value, setValue] = useState('');
  return (
    <form style={STACK_STYLE} onSubmit={(event) => event.preventDefault()}>
      <span>{copy.label}</span>
      <Select
        options={getOptions(locale)}
        value={value}
        onChange={setValue}
        placeholder={copy.placeholder}
        aria-label={copy.label}
      />
      <output>{`${copy.saved}: ${value || '-'}`}</output>
    </form>
  );
}

const meta = {
  title: 'Components/Select',
  component: Select,
  args: {
    options: [],
    size: 'md',
    disabled: false,
    'aria-label': 'Select',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => <LocalizedPlayground {...args} />,
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => <SelectVariants />,
  parameters: { controls: { disable: true } },
};

export const States: Story = {
  render: () => <SelectStates />,
  parameters: { controls: { disable: true } },
};

export const Form: Story = {
  render: () => <FormScenario />,
  parameters: { controls: { disable: true } },
};
