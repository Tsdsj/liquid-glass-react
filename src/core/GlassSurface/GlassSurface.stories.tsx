import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LiquidGlassConfig, useLiquidGlassContext } from '../config/LiquidGlassConfig';
import { GlassSurface, type GlassSurfaceProps } from './GlassSurface';

const PANEL_STYLE = {
  display: 'grid',
  width: '320px',
  height: '200px',
  boxSizing: 'border-box',
  placeItems: 'center',
  padding: '32px',
  color: 'var(--lg-text)',
  fontFamily: 'var(--lg-font)',
  textAlign: 'center',
} as const;

const INSTANCE_STYLE = {
  display: 'grid',
  width: '112px',
  height: '56px',
  boxSizing: 'border-box',
  placeItems: 'center',
  padding: '0 16px',
  color: 'var(--lg-text)',
  fontFamily: 'var(--lg-font)',
} as const;

const INSTANCE_IDS = Array.from({ length: 20 }, (_, index) => index + 1);
const TUNING_TOKENS = ['--lg-blur', '--lg-refraction', '--lg-saturation', '--lg-tint'] as const;

const COPY = {
  'zh-CN': {
    playground: '边缘折射会弯曲背景，同时让中央内容保持清晰可读。',
    tuning: {
      blur: 'Blur 模糊',
      refraction: 'Refraction 折射',
      saturation: 'Saturation 饱和度',
      tintAlpha: 'Tint alpha 色调透明度',
      description: '调整材质参数，同时保持内容清晰可读。',
    },
    fallback: '降级模式仍保留 CSS 模糊、饱和度、色调和高光效果。',
    resize: '拖动右下角即可调整尺寸。',
    nested: '嵌套表面会保留色调和高光，但不会重复使用背景滤镜。',
  },
  'en-US': {
    playground: 'Edge refraction bends the wallpaper while the center stays readable.',
    tuning: {
      blur: 'Blur',
      refraction: 'Refraction',
      saturation: 'Saturation',
      tintAlpha: 'Tint alpha',
      description: 'Tune the material while keeping the content clear.',
    },
    fallback: 'CSS blur, saturation, tint, and specular highlights remain available.',
    resize: 'Drag the lower-right corner to resize.',
    nested: 'Nested surfaces keep tint and highlights without another backdrop filter.',
  },
} as const;

interface ControlRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  children?: ReactNode;
}

function ControlRow({ label, value, min, max, step, onChange, children }: ControlRowProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.currentTarget.value));
  };

  return (
    <label style={{ display: 'grid', gridTemplateColumns: '120px 1fr 52px', gap: '12px' }}>
      <span>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
      />
      <output>{children ?? value}</output>
    </label>
  );
}

function TuningLabStory() {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale].tuning;
  const [blur, setBlur] = useState(4);
  const [refraction, setRefraction] = useState(40);
  const [saturation, setSaturation] = useState(1.5);
  const [tintAlpha, setTintAlpha] = useState(0.25);
  const originalValues = useRef<Record<string, string> | null>(null);

  useEffect(() => {
    originalValues.current = Object.fromEntries(
      TUNING_TOKENS.map((token) => [token, document.documentElement.style.getPropertyValue(token)]),
    );

    return () => {
      if (!originalValues.current) {
        return;
      }

      TUNING_TOKENS.forEach((token) => {
        const originalValue = originalValues.current?.[token] ?? '';
        if (originalValue) {
          document.documentElement.style.setProperty(token, originalValue);
        } else {
          document.documentElement.style.removeProperty(token);
        }
      });
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--lg-blur', `${blur}px`);
    document.documentElement.style.setProperty('--lg-refraction', String(refraction));
    document.documentElement.style.setProperty('--lg-saturation', String(saturation));
    document.documentElement.style.setProperty('--lg-tint', `rgb(255 255 255 / ${tintAlpha})`);
  }, [blur, refraction, saturation, tintAlpha]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 420px) 320px',
        gap: '32px',
        alignItems: 'center',
        color: 'var(--lg-text)',
        fontFamily: 'var(--lg-font)',
      }}
    >
      <div style={{ display: 'grid', gap: '16px' }}>
        <ControlRow label={copy.blur} value={blur} min={0} max={24} step={1} onChange={setBlur}>
          {blur}px
        </ControlRow>
        <ControlRow
          label={copy.refraction}
          value={refraction}
          min={0}
          max={100}
          step={1}
          onChange={setRefraction}
        />
        <ControlRow
          label={copy.saturation}
          value={saturation}
          min={0.5}
          max={2.5}
          step={0.1}
          onChange={setSaturation}
        />
        <ControlRow
          label={copy.tintAlpha}
          value={tintAlpha}
          min={0}
          max={0.8}
          step={0.05}
          onChange={setTintAlpha}
        />
      </div>
      <GlassSurface radius={22} bezel={16} interactive style={PANEL_STYLE}>
        {copy.description}
      </GlassSurface>
    </div>
  );
}

function LocalizedSurface({ copyKey, ...props }: GlassSurfaceProps & { copyKey: 'playground' | 'fallback' }) {
  const { locale } = useLiquidGlassContext();
  return (
    <GlassSurface {...props} style={PANEL_STYLE}>
      {COPY[locale][copyKey]}
    </GlassSurface>
  );
}

function ResizableStory() {
  const { locale } = useLiquidGlassContext();
  return (
    <div
      style={{
        width: '320px',
        height: '200px',
        minWidth: '220px',
        minHeight: '140px',
        resize: 'both',
        overflow: 'hidden',
      }}
    >
      <GlassSurface
        radius={22}
        bezel={16}
        style={{ ...PANEL_STYLE, width: '100%', height: '100%' }}
      >
        {COPY[locale].resize}
      </GlassSurface>
    </div>
  );
}

function NestedStory() {
  const { locale } = useLiquidGlassContext();
  return (
    <GlassSurface radius={28} bezel={18} style={{ ...PANEL_STYLE, width: '420px', height: '280px' }}>
      <GlassSurface
        radius={18}
        style={{ ...PANEL_STYLE, width: '240px', height: '120px', padding: '20px' }}
      >
        {COPY[locale].nested}
      </GlassSurface>
    </GlassSurface>
  );
}

const meta = {
  title: 'Core/GlassSurface',
  component: GlassSurface,
  args: {
    radius: 22,
    depth: 1,
    bezel: 16,
    tint: 'rgb(255 255 255 / 0.25)',
    interactive: true,
  },
  argTypes: {
    radius: { control: { type: 'number', min: 0, max: 80, step: 1 } },
    depth: { control: { type: 'number', min: 0, max: 3, step: 0.1 } },
    bezel: { control: { type: 'number', min: 1, max: 40, step: 1 } },
    tint: { control: 'color' },
    interactive: { control: 'boolean' },
  },
} satisfies Meta<typeof GlassSurface>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <LocalizedSurface {...args} copyKey="playground" />,
};

export const TuningLab: Story = {
  render: () => <TuningLabStory />,
  parameters: { controls: { disable: true } },
};

export const ForcedFallback: Story = {
  render: (args) => (
    <LiquidGlassConfig forceFallback>
      <LocalizedSurface {...args} copyKey="fallback" />
    </LiquidGlassConfig>
  ),
};

export const ManyInstances: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 112px)',
        gap: '16px',
      }}
    >
      {INSTANCE_IDS.map((id) => (
        <GlassSurface key={id} radius={14} bezel={12} style={INSTANCE_STYLE}>
          {id}
        </GlassSurface>
      ))}
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const Resizable: Story = {
  render: () => <ResizableStory />,
  parameters: { controls: { disable: true } },
};

export const Nested: Story = {
  render: () => <NestedStory />,
  parameters: { controls: { disable: true } },
};
