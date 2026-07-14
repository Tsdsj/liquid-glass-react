import type { Meta, StoryObj } from '@storybook/react-vite';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { Slider, type SliderProps } from './Slider';

const STACK_STYLE = {
  display: 'grid',
  gap: '20px',
  width: 'min(100%, 320px)',
} as const;

const COPY = {
  'zh-CN': {
    volume: '音量',
    small: '小号滑块',
    medium: '中号滑块',
    large: '大号滑块',
    minimum: '最小值',
    middle: '中间值',
    maximum: '最大值',
    disabled: '已禁用',
  },
  'en-US': {
    volume: 'Volume',
    small: 'Small slider',
    medium: 'Medium slider',
    large: 'Large slider',
    minimum: 'Minimum',
    middle: 'Middle',
    maximum: 'Maximum',
    disabled: 'Disabled',
  },
} as const;

function LocalizedPlayground(props: SliderProps) {
  const { locale } = useLiquidGlassContext();
  return <Slider {...props} aria-label={props['aria-label'] ?? COPY[locale].volume} />;
}

function SliderVariants() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div style={STACK_STYLE}>
      <Slider size="sm" defaultValue={25} aria-label={copy.small} />
      <Slider size="md" defaultValue={50} aria-label={copy.medium} />
      <Slider size="lg" defaultValue={75} aria-label={copy.large} />
    </div>
  );
}

function SliderStates() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div style={STACK_STYLE}>
      <Slider defaultValue={0} aria-label={copy.minimum} />
      <Slider defaultValue={50} aria-label={copy.middle} />
      <Slider defaultValue={100} aria-label={copy.maximum} />
      <Slider defaultValue={65} disabled aria-label={copy.disabled} />
    </div>
  );
}

const meta = {
  title: 'Components/Slider',
  component: Slider,
  args: {
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 1,
    size: 'md',
    disabled: false,
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => <LocalizedPlayground {...args} />,
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => <SliderVariants />,
  parameters: { controls: { disable: true } },
};

export const States: Story = {
  render: () => <SliderStates />,
  parameters: { controls: { disable: true } },
};
