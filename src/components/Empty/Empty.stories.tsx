import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Empty } from './Empty';

const meta: Meta<typeof Empty> = { title: 'Display/Empty', component: Empty };
export default meta;

type Story = StoryObj<typeof Empty>;

export const Basic: Story = {
  render: () => <Empty title="空空如也" description="这里还没有任何内容" />,
};

export const WithAction: Story = {
  render: () => (
    <Empty title="没有项目" description="创建第一个项目开始使用">
      <Button variant="accent">新建项目</Button>
    </Empty>
  ),
};
