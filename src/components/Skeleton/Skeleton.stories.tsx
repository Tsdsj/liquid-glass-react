import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  args: {
    variant: 'text',
    lines: 3,
    animated: true,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['text', 'circle', 'rect'] },
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Skeleton {...args} />
    </div>
  ),
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', width: 420 }}>
      <Skeleton variant="circle" width={56} height={56} />
      <div style={{ flex: 1 }}>
        <Skeleton lines={3} />
      </div>
    </div>
  ),
};

export const Card: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Skeleton variant="rect" height={140} />
      <Skeleton lines={2} />
    </div>
  ),
};
