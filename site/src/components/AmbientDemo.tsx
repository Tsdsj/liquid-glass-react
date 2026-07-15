import { useState, type CSSProperties } from 'react';
import { Button, GlassSurface } from '@ttqtt/liquid-glass-react';
// Internal helper hook (not part of the public API); consumed from source per
// the M14 experiment, same posture as ProgressiveBlur.
import { useAmbientFromImage } from '../../../src/core/hooks/useAmbientFromImage';
import { PHOTO_WALLPAPER, PHOTO_WALLPAPER_URL } from '../wallpaper';
import { useSiteLocale } from '../site-i18n';

const COPY = {
  'zh-CN': {
    title: '环境色自动取样(实验)',
    desc: '开启后自动读取壁纸像素,取其边缘加权主色写入容器的 --lg-ambient,让玻璃带上环境暖色;取不到色(跨域/解码失败)则静默回退到手动值。',
    on: '自动取样:开',
    off: '自动取样:关(手动 --lg-ambient)',
    sampled: (color: string) => `已取样:${color}`,
    fallback: '未取样,保持手动 --lg-ambient(降级路径)',
    card: '玻璃卡片',
  },
  'en-US': {
    title: 'Automatic ambient sampling (experiment)',
    desc: "When on, the wallpaper's edge-weighted dominant colour is written to the container's --lg-ambient so the glass picks up the surrounding warmth; if sampling fails (cross-origin / decode) it silently falls back to the manual value.",
    on: 'Auto sampling: on',
    off: 'Auto sampling: off (manual --lg-ambient)',
    sampled: (color: string) => `Sampled: ${color}`,
    fallback: 'Not sampled — keeping the manual --lg-ambient (fallback path)',
    card: 'Glass card',
  },
} as const;

const MANUAL_AMBIENT = 'rgb(255 200 120 / 0.16)';

interface AmbientStyle extends CSSProperties {
  '--lg-ambient': string;
}

export function AmbientDemo() {
  const locale = useSiteLocale();
  const copy = COPY[locale];
  const [enabled, setEnabled] = useState(true);
  const sampled = useAmbientFromImage(enabled ? PHOTO_WALLPAPER_URL : null, { strategy: 'edge' });
  const ambient = sampled ?? MANUAL_AMBIENT;

  const stageStyle: AmbientStyle = {
    '--lg-ambient': ambient,
    position: 'relative',
    display: 'flex',
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 20,
    backgroundImage: PHOTO_WALLPAPER,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <section
      data-testid="ambient-demo"
      style={{ display: 'grid', gap: 12, marginTop: 32 }}
    >
      <h2 className="site-guide__section-title">{copy.title}</h2>
      <p className="site-guide__section-description">{copy.desc}</p>
      <div style={stageStyle}>
        <GlassSurface interactive radius={18} style={{ padding: '16px 24px' }}>
          {copy.card}
        </GlassSurface>
      </div>
      <p style={{ margin: 0, color: 'var(--lg-text-secondary)' }} aria-live="polite">
        {sampled ? copy.sampled(sampled) : copy.fallback}
      </p>
      <Button size="sm" onClick={() => setEnabled((value) => !value)} style={{ justifySelf: 'start' }}>
        {enabled ? copy.on : copy.off}
      </Button>
    </section>
  );
}
