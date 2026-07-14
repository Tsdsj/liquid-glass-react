import type { Meta, StoryObj } from '@storybook/react-vite';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { Button, type ButtonProps } from './Button';

const VARIANTS = ['glass', 'accent', 'ghost', 'danger'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;
const MATRIX_STYLE = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  alignItems: 'center',
} as const;

const COPY = {
  'zh-CN': {
    continue: '继续',
    variants: { glass: '玻璃', accent: '强调', ghost: '幽灵', danger: '危险' },
    sizes: { sm: '小', md: '中', lg: '大' },
    withIcon: '带图标',
    saving: '保存中',
    disabled: '已禁用',
    accent: '强调',
    delete: '删除',
    ghost: '幽灵',
  },
  'en-US': {
    continue: 'Continue',
    variants: { glass: 'Glass', accent: 'Accent', ghost: 'Ghost', danger: 'Danger' },
    sizes: { sm: 'Small', md: 'Medium', lg: 'Large' },
    withIcon: 'With icon',
    saving: 'Saving',
    disabled: 'Disabled',
    accent: 'Accent',
    delete: 'Delete',
    ghost: 'Ghost',
  },
} as const;

function LocalizedPlayground(props: ButtonProps) {
  const { locale } = useLiquidGlassContext();
  return <Button {...props}>{props.children ?? COPY[locale].continue}</Button>;
}

function ButtonVariants() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div style={MATRIX_STYLE}>
      {VARIANTS.flatMap((variant) =>
        SIZES.map((size) => (
          <Button key={`${variant}-${size}`} variant={variant} size={size}>
            {copy.variants[variant]} {copy.sizes[size]}
          </Button>
        )),
      )}
    </div>
  );
}

function ButtonStates() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div style={MATRIX_STYLE}>
      <Button icon={<span>+</span>}>{copy.withIcon}</Button>
      <Button loading>{copy.saving}</Button>
      <Button disabled>{copy.disabled}</Button>
      <Button variant="accent">{copy.accent}</Button>
      <Button variant="danger">{copy.delete}</Button>
      <Button variant="ghost">{copy.ghost}</Button>
    </div>
  );
}

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
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
  render: (args) => <LocalizedPlayground {...args} />,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => <ButtonVariants />,
  parameters: { controls: { disable: true } },
};

export const States: Story = {
  render: () => <ButtonStates />,
  parameters: { controls: { disable: true } },
};
