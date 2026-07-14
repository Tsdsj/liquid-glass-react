import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  args: {
    padding: 'md',
    material: 'regular',
    dim: false,
    interactive: false,
    children: null,
  },
  argTypes: {
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
    material: { control: 'inline-radio', options: ['regular', 'clear'] },
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Card {...args}>
        <h3 style={{ margin: '0 0 8px' }}>玻璃卡片 Glass Card</h3>
        <p style={{ margin: 0 }}>整卡一块真折射玻璃,内容直接放入。</p>
      </Card>
    </div>
  ),
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const NestedControls: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 320 }}>
      <Card>
        <h3 style={{ margin: '0 0 12px' }}>嵌套控件 Nested controls</h3>
        <p style={{ margin: '0 0 12px' }}>
          卡内玻璃控件会自动禁用折射(引擎既定行为,避免玻璃套玻璃采样)。
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="accent">主要</Button>
          <Button>次要</Button>
        </div>
      </Card>
    </div>
  ),
};

export const Interactive: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Card interactive padding="lg">
        <strong>可交互 Interactive</strong>
      </Card>
      <Card material="clear" dim padding="lg">
        <strong>Clear + Dim</strong>
      </Card>
    </div>
  ),
};
