import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  args: {
    total: 195,
    pageSize: 10,
    siblingCount: 1,
    size: 'md',
    disabled: false,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  render: (args) => {
    const [current, setCurrent] = useState(1);
    return <Pagination {...args} current={current} onChange={setCurrent} />;
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Pagination total={45} defaultCurrent={1} />
      <Pagination total={200} defaultCurrent={10} />
      <Pagination total={200} defaultCurrent={10} size="sm" siblingCount={2} />
      <Pagination total={45} defaultCurrent={2} disabled />
    </div>
  ),
};
