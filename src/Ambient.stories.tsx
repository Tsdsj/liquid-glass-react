import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { GlassSurface } from './core/GlassSurface';
import { useLiquidGlassContext } from './core/config/LiquidGlassConfig';

interface AmbientStyle extends CSSProperties {
  '--lg-ambient'?: string;
}

const COPY = {
  'zh-CN': {
    intro:
      '--lg-ambient 是声明式的环境色通道：在容器上覆盖它，玻璃会在最底层染上该色，近似“反射周围内容颜色”。Web 无法采样背景像素，这是低保真近似，并非实时取色。',
    none: '无环境色',
    noneDesc: '默认 transparent，与改动前一致。',
    blue: '冷蓝环境',
    warm: '暖橙环境',
    ambientDesc: '容器覆盖 --lg-ambient，玻璃底层随之着色。',
    caption: '每个区块在容器上覆盖不同的 --lg-ambient，玻璃组件无需改动。',
  },
  'en-US': {
    intro:
      '--lg-ambient is a declarative ambient-color channel: override it on a container and the glass tints its lowest layer with that color, approximating "reflecting surrounding color". The web cannot sample backdrop pixels, so this is a low-fidelity approximation, not live color pickup.',
    none: 'No ambient',
    noneDesc: 'Default transparent, identical to before.',
    blue: 'Cool blue ambient',
    warm: 'Warm amber ambient',
    ambientDesc: 'The container overrides --lg-ambient; the glass tints its base layer to match.',
    caption: 'Each block overrides a different --lg-ambient on its container; the glass component is unchanged.',
  },
} as const;

const SECTION_BASE: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  alignItems: 'center',
  padding: '28px',
  borderRadius: '20px',
};

const PANEL_STYLE: CSSProperties = {
  display: 'grid',
  width: '220px',
  minHeight: '120px',
  alignContent: 'center',
  gap: 'var(--lg-space-2)',
  boxSizing: 'border-box',
  padding: 'var(--lg-space-4)',
  color: 'var(--lg-text)',
  fontFamily: 'var(--lg-font)',
  fontSize: 'var(--lg-font-size-md)',
};

const TITLE_STYLE: CSSProperties = { fontWeight: 600, fontSize: 'var(--lg-font-size-lg)' };
const DESC_STYLE: CSSProperties = { color: 'var(--lg-text-secondary)' };
const CAPTION_STYLE: CSSProperties = {
  margin: '16px 0 0',
  color: 'var(--lg-text-secondary)',
  fontFamily: 'var(--lg-font)',
  fontSize: 'var(--lg-font-size-sm)',
};

const NEUTRAL_BG: CSSProperties = { ...SECTION_BASE, background: 'linear-gradient(120deg, #cfd6dc, #aab4bd)' };
const BLUE_BG: AmbientStyle = {
  ...SECTION_BASE,
  background: 'linear-gradient(120deg, #1d4ed8, #60a5fa)',
  '--lg-ambient': 'color-mix(in srgb, #1d4ed8 18%, transparent)',
};
const WARM_BG: AmbientStyle = {
  ...SECTION_BASE,
  background: 'linear-gradient(120deg, #b45309, #fbbf24)',
  '--lg-ambient': 'color-mix(in srgb, #f97316 20%, transparent)',
};

function AmbientStory() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];

  return (
    <section style={{ display: 'grid', gap: '20px', maxWidth: '760px' }}>
      <p style={{ ...CAPTION_STYLE, margin: 0 }}>{copy.intro}</p>

      <div style={NEUTRAL_BG}>
        <GlassSurface material="clear" radius={18} style={PANEL_STYLE}>
          <span style={TITLE_STYLE}>{copy.none}</span>
          <span style={DESC_STYLE}>{copy.noneDesc}</span>
        </GlassSurface>
      </div>

      <div style={BLUE_BG}>
        <GlassSurface material="clear" radius={18} style={PANEL_STYLE}>
          <span style={TITLE_STYLE}>{copy.blue}</span>
          <span style={DESC_STYLE}>{copy.ambientDesc}</span>
        </GlassSurface>
      </div>

      <div style={WARM_BG}>
        <GlassSurface material="clear" radius={18} style={PANEL_STYLE}>
          <span style={TITLE_STYLE}>{copy.warm}</span>
          <span style={DESC_STYLE}>{copy.ambientDesc}</span>
        </GlassSurface>
      </div>

      <p style={CAPTION_STYLE}>{copy.caption}</p>
    </section>
  );
}

const meta = {
  title: 'Visual/Ambient',
  parameters: {
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Ambient: Story = {
  render: () => <AmbientStory />,
  globals: {
    theme: 'light',
    wallpaper: 'plain-light',
  },
};
