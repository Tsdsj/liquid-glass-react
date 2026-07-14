import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ButtonHTMLAttributes } from 'react';
import { useLiquidGlassContext } from '../core/config/LiquidGlassConfig';
import { toast } from './toast';
import { Toaster, type ToasterPosition, type ToasterProps } from './Toaster';

const POSITIONS: ToasterPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

const COPY = {
  'zh-CN': {
    show: '显示通知',
    default: '设置已保存',
    success: '操作成功',
    error: '操作失败',
    info: '有新的更新可用',
    persistent: '常驻通知',
    clear: '清除全部',
    positions: {
      'top-left': '左上',
      'top-center': '顶部居中',
      'top-right': '右上',
      'bottom-left': '左下',
      'bottom-center': '底部居中',
      'bottom-right': '右下',
    },
    richTitle: '滚动内容上的通知',
    richBody: '浮层固定在视口中，下面的内容可以继续滚动。',
  },
  'en-US': {
    show: 'Show toast',
    default: 'Settings saved',
    success: 'Operation completed',
    error: 'Operation failed',
    info: 'A new update is available',
    persistent: 'Persistent toast',
    clear: 'Clear all',
    positions: {
      'top-left': 'Top left',
      'top-center': 'Top center',
      'top-right': 'Top right',
      'bottom-left': 'Bottom left',
      'bottom-center': 'Bottom center',
      'bottom-right': 'Bottom right',
    },
    richTitle: 'Toasts over scrolling content',
    richBody: 'The overlay stays fixed while the content beneath it keeps scrolling.',
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

function StoryButton({ children, style, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...rest} type="button" style={{ ...BUTTON_STYLE, ...style }}>
      {children}
    </button>
  );
}

function ToastPlayground(props: ToasterProps) {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <>
      <StoryButton onClick={() => toast.show(copy.default)}>{copy.show}</StoryButton>
      <Toaster {...props} />
    </>
  );
}

function PositionVariants() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  const [position, setPosition] = useState<ToasterPosition>('top-center');
  return (
    <>
      <div style={{ display: 'flex', gap: 'var(--lg-space-2)', flexWrap: 'wrap' }}>
        {POSITIONS.map((value) => (
          <StoryButton
            key={value}
            onClick={() => {
              setPosition(value);
              toast.show(copy.positions[value]);
            }}
          >
            {copy.positions[value]}
          </StoryButton>
        ))}
      </div>
      <Toaster position={position} />
    </>
  );
}

function ToastStates() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <>
      <div style={{ display: 'flex', gap: 'var(--lg-space-2)', flexWrap: 'wrap' }}>
        <StoryButton onClick={() => toast.show(copy.default)}>{copy.default}</StoryButton>
        <StoryButton onClick={() => toast.success(copy.success)}>{copy.success}</StoryButton>
        <StoryButton onClick={() => toast.error(copy.error)}>{copy.error}</StoryButton>
        <StoryButton onClick={() => toast.info(copy.info)}>{copy.info}</StoryButton>
        <StoryButton onClick={() => toast.show(copy.persistent, { duration: Infinity })}>
          {copy.persistent}
        </StoryButton>
        <StoryButton onClick={() => toast.dismiss()}>{copy.clear}</StoryButton>
      </div>
      <Toaster />
    </>
  );
}

function RichBackgroundStory() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div style={{ display: 'grid', gap: 'var(--lg-space-4)', minHeight: '120vh' }}>
      <StoryButton onClick={() => toast.info(copy.richBody)}>{copy.richTitle}</StoryButton>
      {Array.from({ length: 12 }, (_, index) => (
        <section
          key={index}
          style={{
            minHeight: '120px',
            padding: 'var(--lg-space-4)',
            color: 'var(--lg-text)',
            background: index % 2 === 0 ? 'var(--lg-tint)' : 'var(--lg-tint-hover)',
          }}
        >
          <strong>{copy.richTitle}</strong>
          <p>{copy.richBody}</p>
        </section>
      ))}
      <Toaster />
    </div>
  );
}

const meta = {
  title: 'Feedback/Toaster',
  component: Toaster,
  args: {
    position: 'top-center',
    max: 5,
  },
  argTypes: {
    position: { control: 'select', options: POSITIONS },
    max: { control: { type: 'number', min: 0, max: 10, step: 1 } },
  },
  render: (args) => <ToastPlayground {...args} />,
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => <PositionVariants />,
  parameters: { controls: { disable: true } },
};

export const States: Story = {
  render: () => <ToastStates />,
  parameters: { controls: { disable: true } },
};

export const RichBackground: Story = {
  render: () => <RichBackgroundStory />,
  parameters: { controls: { disable: true } },
};
