import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timeline } from './Timeline';

const meta: Meta<typeof Timeline> = { title: 'Display/Timeline', component: Timeline };
export default meta;
type Story = StoryObj<typeof Timeline>;

export const Basic: Story = {
  render: () => (
    <Timeline
      items={[
        { key: 'a', content: '创建项目', time: '2026-07-01 09:00' },
        { key: 'b', content: '首次部署成功', time: '2026-07-02 10:30', color: 'success' },
        { key: 'c', content: '构建失败,已回滚', time: '2026-07-03 14:00', color: 'danger' },
        { key: 'd', content: '发布 v0.2.0', time: '2026-07-05 18:00', color: 'accent' },
      ]}
    />
  ),
};
