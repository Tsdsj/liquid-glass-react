import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spin } from './Spin';

const meta = {
  title: 'Components/Spin',
  component: Spin,
  args: {
    spinning: true,
    size: 'md',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Spin>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
      <Spin size="sm" />
      <Spin size="md" />
      <Spin size="lg" />
      <Spin tip="加载中 Loading" />
    </div>
  ),
};

export const Wrapping: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Spin tip="保存中 Saving">
      <div style={{ width: 260, padding: 24, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 12 }}>
        <p style={{ margin: 0 }}>包裹模式:遮罩覆盖内容,内容仍占位。</p>
        <p style={{ margin: '8px 0 0' }}>Wrap mode overlays the content while it stays in place.</p>
      </div>
    </Spin>
  ),
};
