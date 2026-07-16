import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { Command, type CommandItem } from './Command';

const ITEMS: CommandItem[] = [
  { key: 'new', label: '新建文件', keywords: ['create', 'new'], group: '文件', onRun: () => undefined },
  { key: 'open', label: '打开文件', keywords: ['open'], group: '文件', onRun: () => undefined },
  { key: 'copy', label: '复制链接', keywords: ['copy', 'link'], group: '编辑', onRun: () => undefined },
  { key: 'theme', label: '切换主题', keywords: ['theme', 'dark'], group: '视图', onRun: () => undefined },
];

const meta: Meta<typeof Command> = { title: 'Feedback/Command', component: Command };
export default meta;

type Story = StoryObj<typeof Command>;

export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>打开命令面板</Button>
        <Command items={ITEMS} open={open} onOpenChange={setOpen} />
      </>
    );
  },
};
