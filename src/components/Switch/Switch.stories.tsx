import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

const ROW_STYLE = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  flexWrap: 'wrap',
} as const;

const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: {
    'aria-label': 'Notifications',
    size: 'md',
    disabled: false,
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={ROW_STYLE}>
      <Switch size="sm" aria-label="Small switch" />
      <Switch size="md" aria-label="Medium switch" />
      <Switch size="lg" aria-label="Large switch" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const States: Story = {
  render: () => (
    <div style={ROW_STYLE}>
      <Switch aria-label="Off" />
      <Switch defaultChecked aria-label="On" />
      <Switch disabled aria-label="Disabled off" />
      <Switch defaultChecked disabled aria-label="Disabled on" />
    </div>
  ),
  parameters: { controls: { disable: true } },
};
