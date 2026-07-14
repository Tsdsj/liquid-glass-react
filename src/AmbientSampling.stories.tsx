import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import wallpaper from '../.storybook/assets/liquid-glass-detail.webp';
import { GlassSurface } from './core/GlassSurface';
import { useAmbientFromImage } from './core/hooks/useAmbientFromImage';
import { useLiquidGlassContext } from './core/config/LiquidGlassConfig';
import type { AmbientSampleOptions } from './core/utils/ambient-color';

/**
 * Internal experiment (M14): sample a known-URL image down to ≤64px and write
 * the dominant colour into --lg-ambient. Not a public API — for local visual
 * verification of whether the glass picks up believable ambient warmth.
 */

const COPY = {
  'zh-CN': {
    intro:
      '自动读取壁纸像素,取边缘加权主色写入容器 --lg-ambient,让玻璃反射环境暖色。取不到色(跨域/解码失败)时静默回退手动值。目检点:玻璃是否带上壁纸暖色、均值(average)是否发灰。',
    on: '自动取样:开',
    off: '自动取样:关',
    sampled: (c: string) => `已取样:${c}`,
    fallback: '未取样(降级)',
    card: '玻璃卡片',
    edge: '边缘加权 edge',
    average: '全图均值 average',
  },
  'en-US': {
    intro:
      "Sample the wallpaper's edge-weighted dominant colour into --lg-ambient so the glass reflects ambient warmth; silently falls back on failure. Check: does the glass pick up the warmth, and does the plain average gray out?",
    on: 'Auto sampling: on',
    off: 'Auto sampling: off',
    sampled: (c: string) => `Sampled: ${c}`,
    fallback: 'Not sampled (fallback)',
    card: 'Glass card',
    edge: 'Edge-weighted',
    average: 'Whole-image average',
  },
} as const;

const MANUAL_AMBIENT = 'rgb(255 200 120 / 0.16)';

interface AmbientStyle extends CSSProperties {
  '--lg-ambient': string;
}

function Stage({ ambient, label }: { ambient: string; label: string }) {
  const style: AmbientStyle = {
    '--lg-ambient': ambient,
    position: 'relative',
    display: 'flex',
    width: 260,
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundImage: `url("${wallpaper}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={style}>
        <GlassSurface interactive radius={18} style={{ padding: '16px 24px' }}>
          {label}
        </GlassSurface>
      </div>
      <p style={{ margin: 0, fontFamily: 'var(--lg-font)', color: 'var(--lg-text-secondary)', fontSize: 13 }}>
        {ambient}
      </p>
    </div>
  );
}

function Playground() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  const [enabled, setEnabled] = useState(true);
  const sampled = useAmbientFromImage(enabled ? wallpaper : null, { strategy: 'edge' });
  const ambient = sampled ?? MANUAL_AMBIENT;

  return (
    <div style={{ display: 'grid', gap: 14, maxWidth: 560, fontFamily: 'var(--lg-font)', color: 'var(--lg-text)' }}>
      <p style={{ margin: 0 }}>{copy.intro}</p>
      <Stage ambient={ambient} label={copy.card} />
      <p style={{ margin: 0, color: 'var(--lg-text-secondary)' }}>
        {sampled ? copy.sampled(sampled) : copy.fallback}
      </p>
      <button type="button" onClick={() => setEnabled((value) => !value)} style={{ justifySelf: 'start' }}>
        {enabled ? copy.on : copy.off}
      </button>
    </div>
  );
}

function StrategyComparison() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  const edgeOptions: AmbientSampleOptions = { strategy: 'edge' };
  const averageOptions: AmbientSampleOptions = { strategy: 'average' };
  const edge = useAmbientFromImage(wallpaper, edgeOptions) ?? MANUAL_AMBIENT;
  const average = useAmbientFromImage(wallpaper, averageOptions) ?? MANUAL_AMBIENT;

  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      <Stage ambient={edge} label={copy.edge} />
      <Stage ambient={average} label={copy.average} />
    </div>
  );
}

const meta = {
  title: 'Core/AmbientSampling',
  parameters: { controls: { disable: true } },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground_: Story = { name: 'Playground', render: () => <Playground /> };
export const EdgeVsAverage: Story = { render: () => <StrategyComparison /> };
