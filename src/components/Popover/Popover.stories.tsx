import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  cloneElement,
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactElement,
} from 'react';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { Popover, type PopoverProps } from './Popover';

const COPY = {
  'zh-CN': {
    trigger: '查看详情',
    content: '这里可以放操作、说明或其他补充内容。',
    placements: { top: '上方', right: '右侧', bottom: '下方', left: '左侧' },
    noArrow: '无箭头',
    open: '默认打开',
    edge: '边缘触发器',
    edgeContent: '靠近视口边缘时，浮层会自动翻转并保持可见。',
  },
  'en-US': {
    trigger: 'View details',
    content: 'Actions, guidance, or supporting content can live here.',
    placements: { top: 'Top', right: 'Right', bottom: 'Bottom', left: 'Left' },
    noArrow: 'No arrow',
    open: 'Open by default',
    edge: 'Edge trigger',
    edgeContent: 'The panel flips near the viewport edge and remains visible.',
  },
} as const;

const BUTTON_STYLE = {
  minHeight: 'var(--lg-control-h-md)',
  padding: '0 var(--lg-space-3)',
  border: '1px solid var(--lg-highlight)',
  borderRadius: 'var(--lg-radius-full)',
  color: 'var(--lg-text)',
  background: 'var(--lg-tint)',
  cursor: 'pointer',
  font: 'inherit',
} as const;

const GRID_STYLE = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, max-content)',
  gap: '48px',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '240px',
} as const;

const Trigger = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  function Trigger({ children, style, ...rest }, ref) {
    return (
      <button {...rest} ref={ref} type="button" style={{ ...BUTTON_STYLE, ...style }}>
        {children}
      </button>
    );
  },
);

function LocalizedPlayground(props: PopoverProps) {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  const trigger = props.children as ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>;
  return (
    <Popover {...props} content={props.content ?? copy.content}>
      {cloneElement(trigger, {}, trigger.props.children ?? copy.trigger)}
    </Popover>
  );
}

function PopoverVariants() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div style={GRID_STYLE}>
      {(['top', 'right', 'bottom', 'left'] as const).map((placement) => (
        <Popover key={placement} placement={placement} content={copy.content}>
          <Trigger>{copy.placements[placement]}</Trigger>
        </Popover>
      ))}
    </div>
  );
}

function PopoverStates() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div style={{ display: 'flex', gap: 'var(--lg-space-4)', alignItems: 'center' }}>
      <Popover content={copy.content} showArrow={false}>
        <Trigger>{copy.noArrow}</Trigger>
      </Popover>
      <Popover content={copy.content} defaultOpen>
        <Trigger>{copy.open}</Trigger>
      </Popover>
    </div>
  );
}

function EdgePlacementStory() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '320px' }}>
      <div style={{ position: 'absolute', top: 0, right: 0 }}>
        <Popover placement="top-end" content={copy.edgeContent}>
          <Trigger>{copy.edge}</Trigger>
        </Popover>
      </div>
    </div>
  );
}

const meta = {
  title: 'Components/Popover',
  component: Popover,
  args: {
    content: null,
    children: <Trigger />,
    placement: 'bottom',
    showArrow: true,
    defaultOpen: false,
  },
  argTypes: {
    content: { control: false },
    children: { control: false },
    placement: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left', 'top-start', 'top-end', 'bottom-start', 'bottom-end'],
    },
  },
  render: (args) => <LocalizedPlayground {...args} />,
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => <PopoverVariants />,
  parameters: { controls: { disable: true } },
};

export const States: Story = {
  render: () => <PopoverStates />,
  parameters: { controls: { disable: true } },
};

export const ViewportEdge: Story = {
  render: () => <EdgePlacementStory />,
  parameters: { controls: { disable: true } },
};
