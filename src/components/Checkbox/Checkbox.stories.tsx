import type { Meta, StoryObj } from '@storybook/react-vite';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { Checkbox, type CheckboxProps } from './Checkbox';

const ROW_STYLE = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  flexWrap: 'wrap',
} as const;

const COPY = {
  'zh-CN': {
    remember: '记住此选择',
    small: '小号',
    medium: '中号',
    large: '大号',
    unchecked: '未选中',
    checked: '已选中',
    indeterminate: '半选',
    disabled: '已禁用',
    disabledChecked: '禁用且选中',
  },
  'en-US': {
    remember: 'Remember this choice',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    unchecked: 'Unchecked',
    checked: 'Checked',
    indeterminate: 'Indeterminate',
    disabled: 'Disabled',
    disabledChecked: 'Disabled checked',
  },
} as const;

function LocalizedPlayground(props: CheckboxProps) {
  const { locale } = useLiquidGlassContext();
  return <Checkbox {...props}>{props.children ?? COPY[locale].remember}</Checkbox>;
}

function CheckboxVariants() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div style={ROW_STYLE}>
      <Checkbox size="sm">{copy.small}</Checkbox>
      <Checkbox size="md">{copy.medium}</Checkbox>
      <Checkbox size="lg">{copy.large}</Checkbox>
    </div>
  );
}

function CheckboxStates() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div style={ROW_STYLE}>
      <Checkbox>{copy.unchecked}</Checkbox>
      <Checkbox defaultChecked>{copy.checked}</Checkbox>
      <Checkbox indeterminate>{copy.indeterminate}</Checkbox>
      <Checkbox disabled>{copy.disabled}</Checkbox>
      <Checkbox defaultChecked disabled>
        {copy.disabledChecked}
      </Checkbox>
    </div>
  );
}

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: {
    size: 'md',
    disabled: false,
    indeterminate: false,
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => <LocalizedPlayground {...args} />,
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => <CheckboxVariants />,
  parameters: { controls: { disable: true } },
};

export const States: Story = {
  render: () => <CheckboxStates />,
  parameters: { controls: { disable: true } },
};
