import type { Meta, StoryObj } from '@storybook/react-vite';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { Textarea, type TextareaProps } from './Textarea';

const STACK_STYLE = {
  display: 'grid',
  gap: '16px',
  width: 'min(100%, 420px)',
} as const;

const COPY = {
  'zh-CN': {
    placeholder: '请输入详细内容',
    short: '两行文本框',
    long: '四行文本框',
    invalid: '内容不能为空',
    disabled: '此内容不可编辑',
    auto: '输入更多内容时高度会自动增长',
  },
  'en-US': {
    placeholder: 'Enter details',
    short: 'Two-row textarea',
    long: 'Four-row textarea',
    invalid: 'Content is required',
    disabled: 'This content cannot be edited',
    auto: 'The height grows as you enter more content',
  },
} as const;

function LocalizedPlayground(props: TextareaProps) {
  const { locale } = useLiquidGlassContext();
  return <Textarea {...props} placeholder={props.placeholder ?? COPY[locale].placeholder} />;
}

function TextareaVariants() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div style={STACK_STYLE}>
      <Textarea rows={2} placeholder={copy.short} />
      <Textarea rows={4} placeholder={copy.long} />
      <Textarea autoResize defaultValue={copy.auto} aria-label={copy.auto} />
    </div>
  );
}

function TextareaStates() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div style={STACK_STYLE}>
      <Textarea placeholder={copy.placeholder} />
      <Textarea invalid placeholder={copy.invalid} />
      <Textarea disabled placeholder={copy.disabled} />
    </div>
  );
}

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  args: {
    rows: 3,
    invalid: false,
    autoResize: false,
    disabled: false,
  },
  render: (args) => <LocalizedPlayground {...args} />,
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => <TextareaVariants />,
  parameters: { controls: { disable: true } },
};

export const States: Story = {
  render: () => <TextareaStates />,
  parameters: { controls: { disable: true } },
};
