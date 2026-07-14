import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Tag';

const meta = {
  title: 'Components/Tag',
  component: Tag,
  args: {
    color: 'default',
    size: 'md',
    closable: false,
    children: 'Tag',
  },
  argTypes: {
    color: { control: 'select', options: ['default', 'accent', 'success', 'warning', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Tag>默认 Default</Tag>
      <Tag color="accent">主色 Accent</Tag>
      <Tag color="success">成功 Success</Tag>
      <Tag color="warning">警告 Warning</Tag>
      <Tag color="danger">危险 Danger</Tag>
    </div>
  ),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Tag icon={<span>★</span>}>带图标 Icon</Tag>
      <Tag closable>可关闭 Closable</Tag>
      <Tag color="accent" size="sm" closable>
        小号 Small
      </Tag>
    </div>
  ),
};
