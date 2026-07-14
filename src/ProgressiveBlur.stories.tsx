import { type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressiveBlur } from './core/progressive-blur';
import { useLiquidGlassContext } from './core/config/LiquidGlassConfig';

const COPY = {
  'zh-CN': {
    intro:
      '渐进模糊:模糊强度沿一个方向逐层衰减,而不是单层均匀模糊。对比下方"单层"与 3 / 5 / 8 层的过渡自然度与带状伪影。',
    single: '单层均匀',
    layers: (n: number) => `${n} 层渐进`,
    line: (i: number) => `第 ${i} 行:文字在底部逐渐被玻璃模糊吞没,层数越多过渡越顺滑。`,
  },
  'en-US': {
    intro:
      'Progressive blur decays layer by layer along one axis instead of a single uniform pass. Compare the "single" strip below with 3 / 5 / 8 layers for smoothness and banding.',
    single: 'Single uniform',
    layers: (n: number) => `${n} layers`,
    line: (i: number) => `Line ${i}: text is swallowed by the glass blur toward the bottom — more layers, smoother ramp.`,
  },
} as const;

const CARD_STYLE: CSSProperties = {
  position: 'relative',
  width: 260,
  height: 300,
  overflow: 'hidden',
  borderRadius: 16,
  padding: 16,
  background: 'var(--lg-tint)',
  color: 'var(--lg-text)',
  fontFamily: 'var(--lg-font)',
  fontSize: 14,
  lineHeight: 1.6,
};

const SINGLE_STYLE: CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: 96,
  pointerEvents: 'none',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  maskImage: 'linear-gradient(to top, #000, transparent)',
  WebkitMaskImage: 'linear-gradient(to top, #000, transparent)',
};

function TextCard({ title, children }: { title: string; children?: React.ReactNode }) {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div>
      <p style={{ margin: '0 0 8px', fontWeight: 600, fontFamily: 'var(--lg-font)' }}>{title}</p>
      <div style={CARD_STYLE}>
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index} style={{ margin: 0 }}>
            {copy.line(index + 1)}
          </p>
        ))}
        {children}
      </div>
    </div>
  );
}

function Comparison() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <div style={{ maxWidth: 900 }}>
      <p style={{ maxWidth: 640, fontFamily: 'var(--lg-font)', color: 'var(--lg-text)' }}>
        {copy.intro}
      </p>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <TextCard title={copy.single}>
          <div style={SINGLE_STYLE} aria-hidden="true" />
        </TextCard>
        {[3, 5, 8].map((n) => (
          <TextCard key={n} title={copy.layers(n)}>
            <ProgressiveBlur direction="to-bottom" layers={n} maxBlur={16} size={96} />
          </TextCard>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: 'Core/ProgressiveBlur',
  component: ProgressiveBlur,
  args: {
    direction: 'to-bottom',
    layers: 5,
    maxBlur: 16,
    size: 96,
  },
  argTypes: {
    direction: { control: 'inline-radio', options: ['to-top', 'to-bottom'] },
    layers: { control: { type: 'range', min: 3, max: 8, step: 1 } },
    maxBlur: { control: { type: 'range', min: 4, max: 40, step: 1 } },
  },
  render: (args) => (
    <TextCard title="Playground">
      <ProgressiveBlur {...args} />
    </TextCard>
  ),
} satisfies Meta<typeof ProgressiveBlur>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const LayerComparison: Story = {
  parameters: { controls: { disable: true } },
  render: () => <Comparison />,
};
