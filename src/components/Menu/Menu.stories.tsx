import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Menu, type MenuItem } from './Menu';

const ITEMS: MenuItem[] = [
  { key: 'edit', label: '编辑 Edit', icon: '✎' },
  { key: 'duplicate', label: '复制 Duplicate', icon: '⧉' },
  { type: 'divider' },
  { key: 'archive', label: '归档 Archive', icon: '🗄', disabled: true },
  { key: 'delete', label: '删除 Delete', icon: '🗑', danger: true },
];

const meta = {
  title: 'Components/Menu',
  component: Menu,
  args: {
    items: ITEMS,
    placement: 'bottom-start',
    children: <button type="button">Actions</button>,
  },
  render: (args) => (
    <Menu {...args} onSelect={(key) => console.log('select', key)}>
      <Button>操作 Actions</Button>
    </Menu>
  ),
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const PlacementEnd: Story = {
  args: { placement: 'bottom-end' },
};
