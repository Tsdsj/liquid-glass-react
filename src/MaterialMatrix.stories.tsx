import type { Meta, StoryObj } from '@storybook/react-vite';
import { GlassSurface } from './core/GlassSurface';
import {
  LiquidGlassConfig,
  useLiquidGlassContext,
  type LiquidGlassLocale,
} from './core/config/LiquidGlassConfig';

const COPY = {
  'zh-CN': {
    title: '材质矩阵',
    light: '浅色环境',
    dark: '深色环境',
    regular: 'Regular 折射',
    clear: 'Clear 折射',
    fallback: '强制降级',
    reduced: '减少透明度',
    static: '静止',
    hover: '悬停',
    pressed: '按压',
    focus: '键盘焦点',
  },
  'en-US': {
    title: 'Material matrix',
    light: 'Light environment',
    dark: 'Dark environment',
    regular: 'Regular refraction',
    clear: 'Clear refraction',
    fallback: 'Forced fallback',
    reduced: 'Reduced transparency',
    static: 'Static',
    hover: 'Hover',
    pressed: 'Pressed',
    focus: 'Keyboard focus',
  },
} as const;

const SURFACE_STYLE = {
  display: 'grid',
  minHeight: '112px',
  alignContent: 'center',
  gap: 'var(--lg-space-1)',
  boxSizing: 'border-box',
  padding: 'var(--lg-space-3)',
  color: 'var(--lg-text)',
  fontFamily: 'var(--lg-font)',
  fontSize: 'var(--lg-font-size-md)',
} as const;

interface ModeSurfaceProps {
  locale: LiquidGlassLocale;
  mode: 'regular' | 'clear' | 'fallback' | 'reduced';
  theme: 'light' | 'dark';
}

function ModeSurface({ locale, mode, theme }: ModeSurfaceProps) {
  const copy = COPY[locale];
  const label = copy[mode];
  const surface = (
    <GlassSurface
      material={mode === 'clear' ? 'clear' : 'regular'}
      radius={18}
      bezel={16}
      interactive
      data-testid={`matrix-${mode}-${theme}`}
      style={SURFACE_STYLE}
    >
      <strong>{label}</strong>
      <span>{`${theme === 'dark' ? copy.dark : copy.light} / ${label}`}</span>
    </GlassSurface>
  );

  if (mode === 'fallback') {
    return <LiquidGlassConfig forceFallback>{surface}</LiquidGlassConfig>;
  }
  if (mode === 'reduced') {
    return (
      <LiquidGlassConfig forceReducedTransparency>{surface}</LiquidGlassConfig>
    );
  }
  return surface;
}

interface ThemeBandProps {
  locale: LiquidGlassLocale;
  theme: 'light' | 'dark';
}

function ThemeBand({ locale, theme }: ThemeBandProps) {
  const copy = COPY[locale];
  return (
    <section
      data-theme={theme}
      style={{
        display: 'grid',
        gap: 'var(--lg-space-3)',
        padding: 'var(--lg-space-4)',
        color: 'var(--lg-text)',
        background: 'var(--lg-tint)',
      }}
    >
      <h2
        style={{
          margin: 0,
          fontFamily: 'var(--lg-font)',
          fontSize: 'var(--lg-font-size-lg)',
        }}
      >
        {theme === 'dark' ? copy.dark : copy.light}
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))',
          gap: 'var(--lg-space-3)',
        }}
      >
        {(['regular', 'clear', 'fallback', 'reduced'] as const).map((mode) => (
          <ModeSurface key={mode} locale={locale} mode={mode} theme={theme} />
        ))}
      </div>
    </section>
  );
}

function InteractionBand({ locale }: { locale: LiquidGlassLocale }) {
  const copy = COPY[locale];
  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))',
        gap: 'var(--lg-space-3)',
      }}
    >
      <GlassSurface radius={18} interactive style={SURFACE_STYLE}>
        {copy.static}
      </GlassSurface>
      <GlassSurface
        radius={18}
        interactive
        data-testid="matrix-hover"
        style={SURFACE_STYLE}
      >
        {copy.hover}
      </GlassSurface>
      <GlassSurface
        radius={18}
        interactive
        data-pressed=""
        data-testid="matrix-pressed"
        style={SURFACE_STYLE}
      >
        {copy.pressed}
      </GlassSurface>
      <GlassSurface
        as="button"
        radius={18}
        interactive
        data-testid="matrix-focus"
        style={{ ...SURFACE_STYLE, width: '100%', border: 'none', textAlign: 'start' }}
      >
        {copy.focus}
      </GlassSurface>
    </section>
  );
}

function MaterialMatrixStory() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  return (
    <main
      style={{
        display: 'grid',
        width: 'min(100%, 1040px)',
        gap: 'var(--lg-space-4)',
      }}
    >
      <h1
        style={{
          margin: 0,
          color: 'var(--lg-text)',
          fontFamily: 'var(--lg-font)',
          fontSize: 'var(--lg-font-size-lg)',
        }}
      >
        {copy.title}
      </h1>
      <ThemeBand locale={locale} theme="light" />
      <ThemeBand locale={locale} theme="dark" />
      <InteractionBand locale={locale} />
    </main>
  );
}

const meta = {
  title: 'Visual/MaterialMatrix',
  parameters: {
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const MaterialMatrix: Story = {
  render: () => <MaterialMatrixStory />,
  globals: {
    theme: 'light',
    wallpaper: 'photo',
  },
};
