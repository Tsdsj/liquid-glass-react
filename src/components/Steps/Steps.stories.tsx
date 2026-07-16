import type { Meta, StoryObj } from '@storybook/react-vite';
import { Steps, type StepItem } from './Steps';

const ITEMS: StepItem[] = [
  { key: 'a', title: '填写信息', description: '基本资料' },
  { key: 'b', title: '确认订单', description: '核对明细' },
  { key: 'c', title: '完成', description: '提交成功' },
];

const meta: Meta<typeof Steps> = { title: 'Navigation/Steps', component: Steps };
export default meta;

type Story = StoryObj<typeof Steps>;

export const Horizontal: Story = {
  render: () => (
    <div style={{ width: 520 }}>
      <Steps items={ITEMS} current={1} />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => <Steps items={ITEMS} current={1} direction="vertical" />,
};
