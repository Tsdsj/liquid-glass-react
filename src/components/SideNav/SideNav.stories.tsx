import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SideNav, type SideNavItem } from './SideNav';

const ITEMS: SideNavItem[] = [
  { type: 'group', label: '工作区 Workspace' },
  { key: 'overview', label: '概览 Overview', icon: '◵', href: '#/overview' },
  { key: 'projects', label: '项目 Projects', icon: '▦', href: '#/projects' },
  { key: 'members', label: '成员 Members', icon: '☺' },
  { type: 'group', label: '系统 System' },
  { key: 'settings', label: '设置 Settings', icon: '⚙' },
  { key: 'billing', label: '账单 Billing', icon: '¤', disabled: true },
];

const meta = {
  title: 'Components/SideNav',
  component: SideNav,
  args: {
    items: ITEMS,
    'aria-label': '主导航',
  },
  render: (args) => {
    const [value, setValue] = useState('overview');
    return (
      <div style={{ width: 240 }}>
        <SideNav {...args} value={value} onChange={setValue} />
      </div>
    );
  },
} satisfies Meta<typeof SideNav>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Uncontrolled: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ width: 240 }}>
      <SideNav aria-label="uncontrolled" items={ITEMS} defaultValue="projects" />
    </div>
  ),
};
