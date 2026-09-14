import { useEffect, useState, type ReactNode } from 'react';
import { GlassBackdrop, GlassProvider, GlassSegmentedControl, Text, useGlassPolicy } from '@ttqtt/liquid-glass-react';
import { AlpineScene } from '../scene.js';

export type DemoBackdrop = 'plain' | 'media' | 'both';

/**
 * The frame every live example sits in.
 *
 * It starts in whatever appearance the site is currently using. That matters more than it
 * sounds: dialogs and sheets render in the browser's top layer, covering the whole page, so a
 * demo that defaulted to light would put a white dialog over a dark site. The light/dark
 * switch here is for comparing the two on purpose, not a default you have to correct.
 */
export function Demo({ children, backdrop = 'plain', height = 220, label }: {
  children: ReactNode; backdrop?: DemoBackdrop; height?: number; label?: string;
}) {
  const site = useGlassPolicy().resolvedTheme;
  const [scheme, setScheme] = useState<'light' | 'dark'>(site);
  const [touched, setTouched] = useState(false);
  const [surface, setSurface] = useState<'plain' | 'media'>(backdrop === 'media' ? 'media' : 'plain');
  // Follow the site until the reader picks a side for themselves.
  useEffect(() => { if (!touched) setScheme(site); }, [site, touched]);

  const showSurfaceToggle = backdrop === 'both';
  return <figure className="demo">
    <div className="demo-toolbar">
      {label && <Text variant="caption1" tone="secondary" className="demo-label">{label}</Text>}
      <div className="demo-switches">
        {showSurfaceToggle && <GlassSegmentedControl aria-label="演示背景" density="compact" value={surface}
          onValueChange={value => setSurface(value as 'plain' | 'media')}
          items={[{ value: 'plain', label: '纯色' }, { value: 'media', label: '图片' }]} />}
        <GlassSegmentedControl aria-label="演示外观" density="compact" value={scheme}
          onValueChange={value => { setTouched(true); setScheme(value as 'light' | 'dark'); }}
          items={[{ value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }]} />
      </div>
    </div>
    <div className="demo-stage" data-scheme={scheme} data-surface={surface} style={{ minHeight: height }}>
      {surface === 'media' && <div className="demo-art" aria-hidden="true"><AlpineScene /></div>}
      <GlassProvider theme={scheme}>
        {/* Telling the glass what is behind it, rather than having it read the screen. */}
        <GlassBackdrop tone={surface === 'media' ? 'dark' : 'mixed'} className="demo-content">{children}</GlassBackdrop>
      </GlassProvider>
    </div>
  </figure>;
}
