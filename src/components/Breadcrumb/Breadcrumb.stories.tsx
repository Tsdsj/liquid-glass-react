import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from './Breadcrumb';

const ITEMS = [
  { label: '首页 Home', href: '#/' },
  { label: '组件 Components', href: '#/components' },
  { label: '面包屑 Breadcrumb' },
];

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  args: {
    items: ITEMS,
    separator: '/',
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const CustomSeparator: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Breadcrumb items={ITEMS} separator="›" />,
};
