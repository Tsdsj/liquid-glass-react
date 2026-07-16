import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Rate } from './Rate';

const meta: Meta<typeof Rate> = { title: 'Data entry/Rate', component: Rate };
export default meta;
type Story = StoryObj<typeof Rate>;

export const Basic: Story = {
  render: () => {
    const [value, setValue] = useState(3);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Rate aria-label="评分" value={value} onChange={setValue} />
        <Rate aria-label="只读评分" value={4} readOnly />
        <Rate aria-label="禁用评分" defaultValue={2} disabled />
      </div>
    );
  },
};
