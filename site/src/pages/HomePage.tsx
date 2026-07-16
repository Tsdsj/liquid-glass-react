import {
  Button,
  Checkbox,
  ProgressiveBlur,
  Select,
  Slider,
  Switch,
} from '@ttqtt/liquid-glass-react';
import { COMPONENT_DOCS } from '../demos/registry';
import { SITE_COPY, useT, type Bilingual } from '../site-i18n';
import { PHOTO_WALLPAPER } from '../wallpaper';

const QUICK_START_CODE = `pnpm add @ttqtt/liquid-glass-react

import '@ttqtt/liquid-glass-react/style.css';
import { Button, Toaster } from '@ttqtt/liquid-glass-react';

<Toaster />
<Button variant="accent">Liquid Glass</Button>`;

const FEATURES = [
  { title: SITE_COPY.featureRefraction, desc: SITE_COPY.featureRefractionDesc },
  { title: SITE_COPY.featureFallback, desc: SITE_COPY.featureFallbackDesc },
  { title: SITE_COPY.featureA11y, desc: SITE_COPY.featureA11yDesc },
  { title: SITE_COPY.featureTheming, desc: SITE_COPY.featureThemingDesc },
];

const SHOWCASE_COPY = {
  primary: { 'zh-CN': '主要操作', 'en-US': 'Primary action' },
  glass: { 'zh-CN': '玻璃按钮', 'en-US': 'Glass button' },
  toggle: { 'zh-CN': '启用效果', 'en-US': 'Enable effect' },
  remember: { 'zh-CN': '记住偏好', 'en-US': 'Remember preference' },
  select: { 'zh-CN': '效果类型', 'en-US': 'Effect type' },
  slider: { 'zh-CN': '效果强度', 'en-US': 'Effect intensity' },
} satisfies Record<string, Bilingual>;

const SHOWCASE_OPTIONS: Array<{ value: string; label: Bilingual }> = [
  {
    value: 'refraction',
    label: { 'zh-CN': '边缘折射 Refraction', 'en-US': 'Edge refraction' },
  },
  {
    value: 'specular',
    label: { 'zh-CN': '动态高光 Specular', 'en-US': 'Dynamic specular' },
  },
  {
    value: 'motion',
    label: { 'zh-CN': '流体动效 Motion', 'en-US': 'Fluid motion' },
  },
];

export function HomePage() {
  const t = useT();

  return (
    <div>
      <section className="site-hero" style={{ backgroundImage: PHOTO_WALLPAPER }}>
        <div className="site-container site-hero__inner">
          <div className="site-hero__copy">
            <span className="site-hero__badge">{t(SITE_COPY.heroBadge)}</span>
            <h1 className="site-hero__title">Liquid Glass React</h1>
            <p className="site-hero__headline">{t(SITE_COPY.heroTitle)}</p>
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
          <div className="site-hero__showcase" data-testid="hero-showcase">
            <div className="site-hero__showcase-row site-hero__showcase-row--actions">
              <Button variant="accent">{t(SHOWCASE_COPY.primary)}</Button>
              <Button>{t(SHOWCASE_COPY.glass)}</Button>
              <label className="site-hero__toggle">
                <span className="site-hero__toggle-label">{t(SHOWCASE_COPY.toggle)}</span>
                <Switch defaultChecked aria-label={t(SHOWCASE_COPY.toggle)} />
              </label>
            </div>
            <div className="site-hero__showcase-row">
              <div className="site-hero__select">
                <Select
                  aria-label={t(SHOWCASE_COPY.select)}
                  options={SHOWCASE_OPTIONS.map((option) => ({
                    value: option.value,
                    label: t(option.label),
                  }))}
                  defaultValue="refraction"
                />
              </div>
            </div>
            <div className="site-hero__showcase-row">
              <div className="site-hero__slider">
                <Slider defaultValue={64} aria-label={t(SHOWCASE_COPY.slider)} />
              </div>
              <Checkbox defaultChecked>{t(SHOWCASE_COPY.remember)}</Checkbox>
            </div>
          </div>
        </div>
        {/* Progressive blur strip softening the wallpaper→content transition at
            the hero's bottom edge (M12 experiment; needs a browser to see). */}
        <ProgressiveBlur direction="to-bottom" />
      </section>

      <section className="site-section">
        <div className="site-container">
          <header className="site-section__header">
            <div>
              <h2 className="site-section__title">{t(SITE_COPY.featureTitle)}</h2>
              <p className="site-section__subtitle">{t(SITE_COPY.componentsSubtitle)}</p>
            </div>
          </header>
          <div className="site-feature-grid">
            {FEATURES.map((feature, index) => (
              <article key={feature.title['en-US']} className="site-feature">
                <span className="site-feature__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="site-feature__title">{t(feature.title)}</h3>
                <p className="site-feature__description">{t(feature.desc)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section">
        <div className="site-container">
          <header className="site-section__header">
            <div>
              <h2 className="site-section__title">{t(SITE_COPY.homeComponentsTitle)}</h2>
              <p className="site-section__subtitle">{t(SITE_COPY.homeComponentsSubtitle)}</p>
            </div>
            <a className="site-text-link" href="#/components">
              {t(SITE_COPY.viewAllComponents)}
            </a>
          </header>
          <div className="site-home-components">
            {COMPONENT_DOCS.slice(0, 4).map((doc) => (
              <article key={doc.slug} className="site-home-component">
                <div
                  className="site-home-component__preview"
                  style={{ backgroundImage: PHOTO_WALLPAPER }}
                  inert
                >
                  {doc.renderPreview()}
                </div>
                <div className="site-home-component__meta">
                  <h3 className="site-home-component__title">
                    <a className="site-home-component__link" href={`#/components/${doc.slug}`}>
                      {doc.name}
                    </a>
                  </h3>
                  <p className="site-home-component__translation">{t(doc.title)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section site-section--quickstart">
        <div className="site-container site-quickstart">
          <div className="site-quickstart__copy">
            <h2 className="site-section__title">{t(SITE_COPY.quickStartTitle)}</h2>
            <p className="site-section__subtitle">{t(SITE_COPY.quickStartSubtitle)}</p>
            <a className="site-text-link" href="#/guide">
              {t(SITE_COPY.heroGetStarted)}
            </a>
          </div>
          <pre className="site-code site-code--standalone">{QUICK_START_CODE}</pre>
        </div>
      </section>
    </div>
  );
}
