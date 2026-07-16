import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputNumber } from './InputNumber';

const meta: Meta<typeof InputNumber> = { title: 'Data entry/InputNumber', component: InputNumber };
export default meta;
type Story = StoryObj<typeof InputNumber>;

export const Basic: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 200 }}>
      <InputNumber aria-label="数量" defaultValue={3} min={0} max={10} />
      <InputNumber aria-label="金额" defaultValue={9.99} step={0.5} precision={2} />
      <InputNumber aria-label="禁用" defaultValue={1} disabled />
    </div>
  ),
};
