import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { GlassSurface } from './core/GlassSurface';
import { useLiquidGlassContext } from './core/config/LiquidGlassConfig';
import detailWallpaper from '../.storybook/assets/liquid-glass-detail.webp';

const COPY = {
  'zh-CN': {
    intro:
      'Clear 材质透光更多，放在明亮媒体上文字容易发飘。dim 会在色调层下叠一层 35% 暗化，恢复对比度。',
    clear: 'Clear 清透',
    clearDesc: '最大透光，但亮背景上可读性下降。',
    clearDim: 'Clear + dim',
    clearDimDesc: '推荐组合：暗化层压住高光，文字重新清晰。',
    regular: 'Regular 常规',
    regularDesc: '默认染色更重，作为对照。',
    caption: '在明亮细节壁纸上对比三种材质的可读性。',
  },
  'en-US': {
    intro:
      'Clear glass passes more light, so text can wash out over bright media. dim adds a 35% darkening layer beneath the tint to restore contrast.',
    clear: 'Clear',
    clearDesc: 'Maximum light, but readability drops on bright backgrounds.',
    clearDim: 'Clear + dim',
    clearDimDesc: 'Recommended pairing: the dim layer tames highlights so text reads again.',
    regular: 'Regular',
    regularDesc: 'Heavier default tint, shown for reference.',
    caption: 'Comparing the readability of three materials over a bright, detailed wallpaper.',
  },
} as const;

const STAGE_STYLE: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '24px',
  alignItems: 'stretch',
  padding: '32px',
  borderRadius: '24px',
  backgroundImage: `url("${detailWallpaper}")`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

const PANEL_STYLE: CSSProperties = {
  display: 'grid',
  width: '240px',
  minHeight: '150px',
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

function ClearDimStory() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];

  return (
    <section style={{ maxWidth: '840px' }}>
      <p style={{ ...CAPTION_STYLE, marginTop: 0, marginBottom: '16px' }}>{copy.intro}</p>
      <div style={STAGE_STYLE}>
        <GlassSurface material="clear" radius={20} style={PANEL_STYLE}>
          <span style={TITLE_STYLE}>{copy.clear}</span>
          <span style={DESC_STYLE}>{copy.clearDesc}</span>
        </GlassSurface>
        <GlassSurface material="clear" dim radius={20} style={PANEL_STYLE}>
          <span style={TITLE_STYLE}>{copy.clearDim}</span>
          <span style={DESC_STYLE}>{copy.clearDimDesc}</span>
        </GlassSurface>
        <GlassSurface radius={20} style={PANEL_STYLE}>
          <span style={TITLE_STYLE}>{copy.regular}</span>
          <span style={DESC_STYLE}>{copy.regularDesc}</span>
        </GlassSurface>
      </div>
      <p style={CAPTION_STYLE}>{copy.caption}</p>
    </section>
  );
}

const meta = {
  title: 'Visual/ClearDim',
  parameters: {
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const ClearDim: Story = {
  render: () => <ClearDimStory />,
  globals: {
    theme: 'light',
    wallpaper: 'photo',
  },
};
