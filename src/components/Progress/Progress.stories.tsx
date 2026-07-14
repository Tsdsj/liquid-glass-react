import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress';

const meta = {
  title: 'Components/Progress',
  component: Progress,
  args: {
    value: 42,
    indeterminate: false,
    size: 'md',
    showValue: true,
    'aria-label': 'progress',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Progress {...args} />
    </div>
  ),
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: 320 }}>
      <Progress value={25} size="sm" aria-label="sm" />
      <Progress value={60} size="md" showValue aria-label="md" />
      <Progress value={90} size="lg" showValue aria-label="lg" />
      <Progress indeterminate aria-label="indeterminate" />
    </div>
  ),
};
