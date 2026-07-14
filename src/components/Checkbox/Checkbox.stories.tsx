import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const ROW_STYLE = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  flexWrap: 'wrap',
} as const;

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: {
    children: 'Remember this choice',
    size: 'md',
    disabled: false,
    indeterminate: false,
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={ROW_STYLE}>
      <Checkbox size="sm">Small</Checkbox>
      <Checkbox size="md">Medium</Checkbox>
      <Checkbox size="lg">Large</Checkbox>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const States: Story = {
  render: () => (
    <div style={ROW_STYLE}>
      <Checkbox>Unchecked</Checkbox>
      <Checkbox defaultChecked>Checked</Checkbox>
      <Checkbox indeterminate>Indeterminate</Checkbox>
      <Checkbox disabled>Disabled</Checkbox>
      <Checkbox defaultChecked disabled>
        Disabled checked
      </Checkbox>
    </div>
  ),
  parameters: { controls: { disable: true } },
};
