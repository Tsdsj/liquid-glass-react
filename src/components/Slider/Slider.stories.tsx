import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from './Slider';

const STACK_STYLE = {
  display: 'grid',
  gap: '20px',
  width: 'min(100%, 320px)',
} as const;

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
    'aria-label': 'Volume',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={STACK_STYLE}>
      <Slider size="sm" defaultValue={25} aria-label="Small slider" />
      <Slider size="md" defaultValue={50} aria-label="Medium slider" />
      <Slider size="lg" defaultValue={75} aria-label="Large slider" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const States: Story = {
  render: () => (
    <div style={STACK_STYLE}>
      <Slider defaultValue={0} aria-label="Minimum" />
      <Slider defaultValue={50} aria-label="Middle" />
      <Slider defaultValue={100} aria-label="Maximum" />
      <Slider defaultValue={65} disabled aria-label="Disabled" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};
