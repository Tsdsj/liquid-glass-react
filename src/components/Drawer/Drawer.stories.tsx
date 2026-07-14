import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Drawer } from './Drawer';

function DrawerDemo(args: Omit<React.ComponentProps<typeof Drawer>, 'open' | 'onOpenChange' | 'children'>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="accent" onClick={() => setOpen(true)}>
        打开抽屉 Open drawer
      </Button>
      <Drawer
        {...args}
        open={open}
        onOpenChange={setOpen}
        title="过滤器 Filters"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button variant="accent" onClick={() => setOpen(false)}>
              应用
            </Button>
          </>
        }
      >
        <p style={{ margin: 0 }}>抽屉面板贴边滑入,遮罩用模糊渐入,面板是一块真折射玻璃。</p>
      </Drawer>
    </>
  );
}

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  args: {
    placement: 'right',
    open: false,
    onOpenChange: () => undefined,
    children: null,
  },
  argTypes: {
    placement: { control: 'inline-radio', options: ['left', 'right', 'top', 'bottom'] },
  },
  render: (args) => <DrawerDemo placement={args.placement} size={args.size} />,
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Left: Story = { args: { placement: 'left' } };

export const Bottom: Story = { args: { placement: 'bottom', size: 320 } };
