import { Button, Checkbox, GlassSurface, Select, Slider, Switch } from '@ttq/liquid-glass-react';
import { SITE_COPY, useT } from '../site-i18n';
import { PHOTO_WALLPAPER } from '../wallpaper';

const QUICK_START_CODE = `pnpm add @ttq/liquid-glass-react

import '@ttq/liquid-glass-react/style.css';
import { Button, Toaster } from '@ttq/liquid-glass-react';

<Toaster />
<Button variant="accent">Liquid Glass</Button>`;

const FEATURES = [
  { title: SITE_COPY.featureRefraction, desc: SITE_COPY.featureRefractionDesc },
  { title: SITE_COPY.featureFallback, desc: SITE_COPY.featureFallbackDesc },
  { title: SITE_COPY.featureA11y, desc: SITE_COPY.featureA11yDesc },
  { title: SITE_COPY.featureTheming, desc: SITE_COPY.featureThemingDesc },
];

export function HomePage() {
  const t = useT();

  return (
    <div>
      <section className="site-hero" style={{ backgroundImage: PHOTO_WALLPAPER }}>
        <div className="site-container site-hero__inner">
          <div className="site-hero__copy">
            <span className="site-hero__badge">{t(SITE_COPY.heroBadge)}</span>
            <h1 className="site-hero__title">{t(SITE_COPY.heroTitle)}</h1>
            <p className="site-hero__subtitle">{t(SITE_COPY.heroSubtitle)}</p>
            <div className="site-hero__actions">
              <Button
                variant="accent"
                size="lg"
                onClick={() => {
                  window.location.hash = '#/guide';
                }}
              >
                {t(SITE_COPY.heroGetStarted)}
              </Button>
              <Button
                size="lg"
                onClick={() => {
                  window.location.hash = '#/components';
                }}
              >
                {t(SITE_COPY.heroBrowse)}
              </Button>
            </div>
          </div>
          <GlassSurface className="site-hero__showcase" radius={22} data-testid="hero-showcase">
            <div className="site-hero__showcase-row">
              <Button variant="accent">主要操作</Button>
              <Button>玻璃按钮</Button>
              <Switch defaultChecked aria-label="演示开关" />
            </div>
            <div className="site-hero__showcase-row">
              <Select
                aria-label="演示选择器"
                options={[
                  { value: 'refraction', label: '边缘折射 Refraction' },
                  { value: 'specular', label: '动态高光 Specular' },
                  { value: 'motion', label: '流体动效 Motion' },
                ]}
                defaultValue="refraction"
              />
            </div>
            <div className="site-hero__showcase-row">
              <Slider defaultValue={64} aria-label="演示滑块" />
              <Checkbox defaultChecked>记住偏好</Checkbox>
            </div>
          </GlassSurface>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container">
          <h2 className="site-section__title">{t(SITE_COPY.featureTitle)}</h2>
          <p className="site-section__subtitle">{t(SITE_COPY.componentsSubtitle)}</p>
          <div className="site-feature-grid">
            {FEATURES.map((feature) => (
              <GlassSurface key={feature.title['en-US']} className="site-feature">
                <h3>{t(feature.title)}</h3>
                <p>{t(feature.desc)}</p>
              </GlassSurface>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container">
          <h2 className="site-section__title">{t(SITE_COPY.quickStartTitle)}</h2>
          <GlassSurface style={{ overflow: 'hidden' }}>
            <pre className="site-code" style={{ borderRadius: 'inherit' }}>
              {QUICK_START_CODE}
            </pre>
          </GlassSurface>
        </div>
      </section>
    </div>
  );
}
