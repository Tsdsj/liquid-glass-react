import type { Meta, StoryObj } from '@storybook/react-vite';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { Switch, type SwitchProps } from './Switch';

const ROW_STYLE = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  flexWrap: 'wrap',
} as const;

const COPY = {
  'zh-CN': {
    notifications: '通知',
    small: '小号开关',
    medium: '中号开关',
    large: '大号开关',
    off: '关闭',
    on: '开启',
    disabledOff: '禁用且关闭',
    disabledOn: '禁用且开启',
  },
  'en-US': {
    notifications: 'Notifications',
    small: 'Small switch',
    medium: 'Medium switch',
    large: 'Large switch',
    off: 'Off',
    on: 'On',
    disabledOff: 'Disabled off',
    disabledOn: 'Disabled on',
  },
} as const;

function LocalizedPlayground(props: SwitchProps) {
  const { locale } = useLiquidGlassContext();
  return <Switch {...props} aria-label={props['aria-label'] ?? COPY[locale].notifications} />;
}

function SwitchVariants() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div style={ROW_STYLE}>
      <Switch size="sm" aria-label={copy.small} />
      <Switch size="md" aria-label={copy.medium} />
      <Switch size="lg" aria-label={copy.large} />
    </div>
  );
}

function SwitchStates() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div style={ROW_STYLE}>
      <Switch aria-label={copy.off} />
      <Switch defaultChecked aria-label={copy.on} />
      <Switch disabled aria-label={copy.disabledOff} />
      <Switch defaultChecked disabled aria-label={copy.disabledOn} />
    </div>
  );
}

const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: {
    size: 'md',
    disabled: false,
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => <LocalizedPlayground {...args} />,
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => <SwitchVariants />,
  parameters: { controls: { disable: true } },
};

export const States: Story = {
  render: () => <SwitchStates />,
  parameters: { controls: { disable: true } },
};
