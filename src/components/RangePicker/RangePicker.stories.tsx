import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { RangePicker, type DateRange } from './RangePicker';

const meta: Meta<typeof RangePicker> = { title: 'Data entry/RangePicker', component: RangePicker };
export default meta;
type Story = StoryObj<typeof RangePicker>;

export const Basic: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>([null, null]);
    return <RangePicker aria-label="日期范围" value={range} onChange={setRange} />;
  },
};

export const WithBounds: Story = {
  render: () => (
    <RangePicker
      aria-label="日期范围"
      defaultValue={[new Date(2024, 0, 5), new Date(2024, 0, 12)]}
      min={new Date(2024, 0, 1)}
      max={new Date(2024, 1, 15)}
      disabledDate={(date) => date.getDay() === 0 || date.getDay() === 6}
    />
  ),
};
