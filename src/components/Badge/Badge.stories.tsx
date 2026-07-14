import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const BOX_STYLE = {
  display: 'inline-flex',
  width: 40,
  height: 40,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 10,
  background: 'rgba(0,0,0,0.08)',
} as const;

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: {
    count: 5,
    max: 99,
    dot: false,
    showZero: false,
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Badge {...args}>
      <span style={BOX_STYLE}>📮</span>
    </Badge>
  ),
};

export const Standalone: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
      <Badge count={5} />
      <Badge count={100} />
      <Badge count={10} max={9} />
      <Badge count={0} showZero />
    </div>
  ),
};

export const Wrapping: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
      <Badge count={8}>
        <span style={BOX_STYLE}>📮</span>
      </Badge>
      <Badge dot>
        <span style={BOX_STYLE}>🔔</span>
      </Badge>
    </div>
  ),
};
