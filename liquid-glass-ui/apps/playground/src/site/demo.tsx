import { useState, type ReactNode } from 'react';
import { GlassBackdrop, GlassProvider, GlassSegmentedControl, Text } from '@liquid-glass-ui/react';
import { AlpineScene } from '../scene.js';

export type DemoBackdrop = 'plain' | 'media' | 'both';

/**
 * The frame every live example sits in.
 *
 * A glass component that has only been looked at over one background has not been checked:
 * the material takes its colour from behind, so each example can be flipped between the app
 * background and photographic content, in either appearance.
 */
export function Demo({ children, backdrop = 'plain', height = 220, label }: {
  children: ReactNode; backdrop?: DemoBackdrop; height?: number; label?: string;
}) {
  const [scheme, setScheme] = useState<'light' | 'dark'>('light');
  const [surface, setSurface] = useState<'plain' | 'media'>(backdrop === 'media' ? 'media' : 'plain');
  const showSurfaceToggle = backdrop === 'both';
  return <figure className="demo">
    <div className="demo-toolbar">
      {label && <Text variant="caption1" tone="secondary" className="demo-label">{label}</Text>}
      <div className="demo-switches">
        {showSurfaceToggle && <GlassSegmentedControl aria-label="演示背景" density="compact" value={surface}
          onValueChange={value => setSurface(value as 'plain' | 'media')}
          items={[{ value: 'plain', label: '纯色' }, { value: 'media', label: '图像' }]} />}
        <GlassSegmentedControl aria-label="演示外观" density="compact" value={scheme}
          onValueChange={value => setScheme(value as 'light' | 'dark')}
          items={[{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }]} />
      </div>
    </div>
    <div className="demo-stage" data-scheme={scheme} data-surface={surface} style={{ minHeight: height }}>
      {surface === 'media' && <div className="demo-art" aria-hidden="true"><AlpineScene /></div>}
      <GlassProvider theme={scheme}>
        {/* The tone is declared, never sampled — glass inside adapts without reading pixels. */}
        <GlassBackdrop tone={surface === 'media' ? 'dark' : 'mixed'} className="demo-content">{children}</GlassBackdrop>
      </GlassProvider>
    </div>
  </figure>;
}
