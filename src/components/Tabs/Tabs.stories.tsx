import type { Meta, StoryObj } from '@storybook/react-vite';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { Tabs } from './Tabs';

const COPY = {
  'zh-CN': {
    label: '产品文档',
    overview: '概览',
    overviewBody: '液态玻璃是一套折射真实背景的材质系统。',
    pricing: '价格',
    pricingBody: '开源免费,MIT 协议。',
    faq: '常见问题',
    faqBody: 'Safari 与 Firefox 自动降级为模糊材质。',
    changelog: '更新日志',
  },
  'en-US': {
    label: 'Product docs',
    overview: 'Overview',
    overviewBody: 'Liquid Glass is a material system that refracts the real backdrop.',
    pricing: 'Pricing',
    pricingBody: 'Free and open source under the MIT license.',
    faq: 'FAQ',
    faqBody: 'Safari and Firefox gracefully fall back to a blurred material.',
    changelog: 'Changelog',
  },
} as const;

function useItems() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return {
    label: copy.label,
    items: [
      { key: 'overview', label: copy.overview, content: copy.overviewBody },
      { key: 'pricing', label: copy.pricing, content: copy.pricingBody },
      { key: 'faq', label: copy.faq, content: copy.faqBody },
      { key: 'changelog', label: copy.changelog, disabled: true, content: '—' },
    ],
  };
}

function TabsPlayground({ items: _items, ...args }: React.ComponentProps<typeof Tabs>) {
  const { label, items } = useItems();
  return <Tabs aria-label={label} {...args} items={items} />;
}

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    size: 'md',
    defaultValue: 'overview',
    items: [],
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => <TabsPlayground {...args} />,
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const { label, items } = useItems();
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <Tabs key={size} size={size} aria-label={`${label}-${size}`} items={items} defaultValue="overview" />
        ))}
      </div>
    );
  },
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const { label, items } = useItems();
    return <Tabs aria-label={`${label}-disabled`} items={items} defaultValue="faq" />;
  },
};
