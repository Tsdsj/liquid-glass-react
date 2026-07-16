import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown } from './Dropdown';

const meta: Meta<typeof Dropdown> = { title: 'Navigation/Dropdown', component: Dropdown };
export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Basic: Story = {
  render: () => (
    <Dropdown
      label="更多操作"
      items={[
        { key: 'edit', label: '编辑' },
        { key: 'duplicate', label: '复制' },
        { type: 'divider' },
        { key: 'delete', label: '删除', danger: true },
      ]}
      onSelect={(key) => console.log(key)}
    />
  ),
};
