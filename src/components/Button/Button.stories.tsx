import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const VARIANTS = ['glass', 'accent', 'ghost', 'danger'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;
const MATRIX_STYLE = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, max-content)',
  gap: '16px',
  alignItems: 'center',
} as const;

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Continue',
    variant: 'glass',
    size: 'md',
    loading: false,
    disabled: false,
  },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    size: { control: 'select', options: SIZES },
    icon: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={MATRIX_STYLE}>
      {VARIANTS.flatMap((variant) =>
        SIZES.map((size) => (
          <Button key={`${variant}-${size}`} variant={variant} size={size}>
            {variant} {size}
          </Button>
        )),
      )}
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const States: Story = {
  render: () => (
    <div style={MATRIX_STYLE}>
      <Button icon={<span>+</span>}>With icon</Button>
      <Button loading>Saving</Button>
      <Button disabled>Disabled</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="danger">Delete</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
  parameters: { controls: { disable: true } },
};
