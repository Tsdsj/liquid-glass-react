import type { Meta, StoryObj } from '@storybook/react-vite';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { Input, type InputProps } from './Input';

const STACK_STYLE = {
  display: 'grid',
  gap: '16px',
  width: 'min(100%, 360px)',
} as const;

const COPY = {
  'zh-CN': {
    placeholder: '请输入内容',
    email: '邮箱地址',
    password: '密码',
    invalid: '请输入有效邮箱',
    disabled: '不可编辑',
  },
  'en-US': {
    placeholder: 'Enter text',
    email: 'Email address',
    password: 'Password',
    invalid: 'Enter a valid email',
    disabled: 'Not editable',
  },
} as const;

function LocalizedPlayground(props: InputProps) {
  const { locale } = useLiquidGlassContext();
  return <Input {...props} placeholder={props.placeholder ?? COPY[locale].placeholder} />;
}

function InputVariants() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div style={STACK_STYLE}>
      <Input size="sm" placeholder={copy.placeholder} />
      <Input size="md" placeholder={copy.placeholder} />
      <Input size="lg" placeholder={copy.placeholder} />
    </div>
  );
}

function InputStates() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div style={STACK_STYLE}>
      <Input prefix="@" placeholder={copy.email} />
      <Input suffix=".com" placeholder={copy.email} />
      <Input type="password" placeholder={copy.password} />
      <Input invalid placeholder={copy.invalid} />
      <Input disabled placeholder={copy.disabled} />
    </div>
  );
}

const meta = {
  title: 'Components/Input',
  component: Input,
  args: {
    size: 'md',
    invalid: false,
    disabled: false,
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    prefix: { control: false },
    suffix: { control: false },
  },
  render: (args) => <LocalizedPlayground {...args} />,
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => <InputVariants />,
  parameters: { controls: { disable: true } },
};

export const States: Story = {
  render: () => <InputStates />,
  parameters: { controls: { disable: true } },
};
