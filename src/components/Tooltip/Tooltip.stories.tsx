import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  cloneElement,
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactElement,
} from 'react';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { Tooltip, type TooltipProps } from './Tooltip';

const COPY = {
  'zh-CN': {
    trigger: '悬停或聚焦',
    content: '补充说明',
    placements: { top: '上方', right: '右侧', bottom: '下方', left: '左侧' },
    instant: '立即显示',
    delayed: '延迟一秒',
    edge: '边缘提示',
    edgeContent: '提示会自动避开视口边缘。',
  },
  'en-US': {
    trigger: 'Hover or focus',
    content: 'Supporting information',
    placements: { top: 'Top', right: 'Right', bottom: 'Bottom', left: 'Left' },
    instant: 'Show instantly',
    delayed: 'One-second delay',
    edge: 'Edge tooltip',
    edgeContent: 'The tooltip automatically avoids the viewport edge.',
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

const Trigger = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  function Trigger({ children, style, ...rest }, ref) {
    return (
      <button {...rest} ref={ref} type="button" style={{ ...BUTTON_STYLE, ...style }}>
        {children}
      </button>
    );
  },
);

function LocalizedPlayground(props: TooltipProps) {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  const trigger = props.children as ReactElement<ButtonHTMLAttributes<HTMLButtonElement>>;
  return (
    <Tooltip {...props} content={props.content ?? copy.content}>
      {cloneElement(trigger, {}, trigger.props.children ?? copy.trigger)}
    </Tooltip>
  );
}

function TooltipVariants() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, max-content)',
        gap: '48px',
        placeContent: 'center',
        minHeight: '240px',
      }}
    >
      {(['top', 'right', 'bottom', 'left'] as const).map((placement) => (
        <Tooltip key={placement} placement={placement} content={copy.content}>
          <Trigger>{copy.placements[placement]}</Trigger>
        </Tooltip>
      ))}
    </div>
  );
}

function TooltipStates() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div style={{ display: 'flex', gap: 'var(--lg-space-4)' }}>
      <Tooltip content={copy.content} delay={0}>
        <Trigger>{copy.instant}</Trigger>
      </Tooltip>
      <Tooltip content={copy.content} delay={1000}>
        <Trigger>{copy.delayed}</Trigger>
      </Tooltip>
    </div>
  );
}

function EdgePlacementStory() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '320px' }}>
      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        <Tooltip placement="top-start" content={copy.edgeContent} delay={0}>
          <Trigger>{copy.edge}</Trigger>
        </Tooltip>
      </div>
    </div>
  );
}

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: {
    content: null,
    children: <Trigger />,
    placement: 'top',
    delay: 300,
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
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => <TooltipVariants />,
  parameters: { controls: { disable: true } },
};

export const States: Story = {
  render: () => <TooltipStates />,
  parameters: { controls: { disable: true } },
};

export const ViewportEdge: Story = {
  render: () => <EdgePlacementStory />,
  parameters: { controls: { disable: true } },
};
