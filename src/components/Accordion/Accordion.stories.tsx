import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, type AccordionItem } from './Accordion';

const ITEMS: AccordionItem[] = [
  { key: 'a', title: '什么是液态玻璃?', content: '一种会折射背景的玻璃材质。' },
  { key: 'b', title: '如何降级?', content: '不支持折射的浏览器自动换成毛玻璃。' },
  { key: 'c', title: '可以定制吗?', content: '所有视觉参数都是 --lg-* CSS 变量。' },
];

const meta: Meta<typeof Accordion> = { title: 'Display/Accordion', component: Accordion };
export default meta;

type Story = StoryObj<typeof Accordion>;

export const Single: Story = {
  render: () => (
    <div style={{ width: 460 }}>
      <Accordion items={ITEMS} defaultValue={['a']} />
    </div>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div style={{ width: 460 }}>
      <Accordion items={ITEMS} multiple defaultValue={['a', 'b']} />
    </div>
  ),
};
