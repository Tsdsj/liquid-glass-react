import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Data entry/DatePicker',
  component: DatePicker,
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Basic: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return <DatePicker aria-label="日期" placeholder="选择日期" value={value} onChange={setValue} />;
  },
};

export const WithRange: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(new Date(2024, 0, 15));
    return (
      <DatePicker
        aria-label="日期"
        value={value}
        onChange={setValue}
        min={new Date(2024, 0, 10)}
        max={new Date(2024, 0, 25)}
        // Disable weekends.
        disabledDate={(date) => date.getDay() === 0 || date.getDay() === 6}
      />
    );
  },
};
