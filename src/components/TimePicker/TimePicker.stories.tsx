import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TimePicker } from './TimePicker';

const meta: Meta<typeof TimePicker> = { title: 'Data entry/TimePicker', component: TimePicker };
export default meta;
type Story = StoryObj<typeof TimePicker>;

export const Basic: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>('09:30');
    return <TimePicker aria-label="时间" value={value} onChange={setValue} />;
  },
};

export const WithSecondsAndBounds: Story = {
  render: () => (
    <TimePicker
      aria-label="时间"
      format="HH:mm:ss"
      defaultValue="12:00:00"
      min="09:00:00"
      max="18:00:00"
      minuteStep={5}
    />
  ),
};
