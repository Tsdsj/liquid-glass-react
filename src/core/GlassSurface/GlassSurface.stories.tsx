import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LiquidGlassConfig } from '../config/LiquidGlassConfig';
import { GlassSurface } from './GlassSurface';

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
        <ControlRow label="Blur" value={blur} min={0} max={24} step={1} onChange={setBlur}>
          {blur}px
        </ControlRow>
        <ControlRow
          label="Refraction"
          value={refraction}
          min={0}
          max={100}
          step={1}
          onChange={setRefraction}
        />
        <ControlRow
          label="Saturation"
          value={saturation}
          min={0.5}
          max={2.5}
          step={0.1}
          onChange={setSaturation}
        />
        <ControlRow
          label="Tint alpha"
          value={tintAlpha}
          min={0}
          max={0.8}
          step={0.05}
          onChange={setTintAlpha}
        />
      </div>
      <GlassSurface radius={22} bezel={16} interactive style={PANEL_STYLE}>
        Tune the material while keeping the content clear.
      </GlassSurface>
    </div>
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
  render: (args) => (
    <GlassSurface {...args} style={PANEL_STYLE}>
      Edge refraction bends the wallpaper while the center stays readable.
    </GlassSurface>
  ),
};

export const TuningLab: Story = {
  render: () => <TuningLabStory />,
  parameters: { controls: { disable: true } },
};

export const ForcedFallback: Story = {
  render: (args) => (
    <LiquidGlassConfig forceFallback>
      <GlassSurface {...args} style={PANEL_STYLE}>
        CSS blur, saturation, tint, and specular highlights remain available.
      </GlassSurface>
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
  render: () => (
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
        Drag the lower-right corner to resize.
      </GlassSurface>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const Nested: Story = {
  render: () => (
    <GlassSurface radius={28} bezel={18} style={{ ...PANEL_STYLE, width: '420px', height: '280px' }}>
      <GlassSurface
        radius={18}
        style={{ ...PANEL_STYLE, width: '240px', height: '120px', padding: '20px' }}
      >
        Nested surfaces keep tint and highlights without another backdrop filter.
      </GlassSurface>
    </GlassSurface>
  ),
  parameters: { controls: { disable: true } },
};
