import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  args: {
    alt: 'Ada Lovelace',
    fallback: 'AL',
    size: 'md',
    shape: 'circle',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar alt="A" fallback="A" size="sm" />
      <Avatar alt="B" fallback="B" size="md" />
      <Avatar alt="C" fallback="C" size="lg" />
      <Avatar alt="D" fallback="D" shape="square" size="lg" />
    </div>
  ),
};

export const Fallback: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar src="https://invalid.example/none.png" alt="Broken image" fallback="BK" />
      <Avatar alt="No source" fallback="NS" />
    </div>
  ),
};
