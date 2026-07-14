import type { Meta, StoryObj } from '@storybook/react-vite';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

const COPY = {
  'zh-CN': {
    label: '取件方式',
    pickup: '到店自取',
    delivery: '快递配送',
    locker: '快递柜',
    small: '小号',
    medium: '中号',
    large: '大号',
  },
  'en-US': {
    label: 'Fulfilment',
    pickup: 'Store pickup',
    delivery: 'Delivery',
    locker: 'Locker',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
  },
} as const;

function RadioGroupPlayground({ children: _children, ...args }: React.ComponentProps<typeof RadioGroup>) {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <RadioGroup aria-label={copy.label} {...args}>
      <Radio value="pickup">{copy.pickup}</Radio>
      <Radio value="delivery">{copy.delivery}</Radio>
      <Radio value="locker" disabled>
        {copy.locker}
      </Radio>
    </RadioGroup>
  );
}

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  args: {
    size: 'md',
    disabled: false,
    orientation: 'horizontal',
    defaultValue: 'pickup',
    children: null,
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
  render: (args) => <RadioGroupPlayground {...args} />,
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const { locale } = useLiquidGlassContext();
    const copy = COPY[locale];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <RadioGroup key={size} size={size} aria-label={`${copy.label}-${size}`} defaultValue="pickup">
            <Radio value="pickup">{copy.pickup}</Radio>
            <Radio value="delivery">{copy.delivery}</Radio>
          </RadioGroup>
        ))}
      </div>
    );
  },
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const { locale } = useLiquidGlassContext();
    const copy = COPY[locale];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <RadioGroup aria-label="vertical" orientation="vertical" defaultValue="delivery">
          <Radio value="pickup">{copy.pickup}</Radio>
          <Radio value="delivery">{copy.delivery}</Radio>
          <Radio value="locker">{copy.locker}</Radio>
        </RadioGroup>
        <RadioGroup aria-label="disabled" disabled defaultValue="pickup">
          <Radio value="pickup">{copy.pickup}</Radio>
          <Radio value="delivery">{copy.delivery}</Radio>
        </RadioGroup>
      </div>
    );
  },
};
