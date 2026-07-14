import { useEffect, useState } from 'react';
import {
  GlassSurface,
  LiquidGlassConfig,
  Select,
  Switch,
  Toaster,
  type LiquidGlassLocale,
} from '@ttq/liquid-glass-react';
import { ComponentDetailPage } from './pages/ComponentDetailPage';
import { ComponentsPage } from './pages/ComponentsPage';
import { GuidePage } from './pages/GuidePage';
import { HomePage } from './pages/HomePage';
import { useHashRoute, type Route } from './router';
import { SITE_COPY, SiteLocaleContext, useT } from './site-i18n';
import './site.css';

const LOCALE_OPTIONS = [
  { value: 'zh-CN', label: '中文' },
  { value: 'en-US', label: 'English' },
];

function isActive(route: Route, page: Route['page']): boolean {
  return route.page === page;
}

interface SiteHeaderProps {
  route: Route;
  locale: LiquidGlassLocale;
  onLocaleChange: (locale: LiquidGlassLocale) => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

function SiteHeader({ route, locale, onLocaleChange, theme, onThemeChange }: SiteHeaderProps) {
  const t = useT();
  const links = [
    { href: '#/', label: t(SITE_COPY.navHome), active: isActive(route, 'home') },
    { href: '#/components', label: t(SITE_COPY.navComponents), active: isActive(route, 'components') },
    { href: '#/guide', label: t(SITE_COPY.navGuide), active: isActive(route, 'guide') },
  ];

  return (
    <header className="site-header">
      <GlassSurface className="site-header__bar" radius={22}>
        <a className="site-header__brand" href="#/">
          <span className="site-header__logo" aria-hidden="true" />
          {t(SITE_COPY.brand)}
        </a>
        <nav className="site-header__nav" aria-label="site">
          {links.map((link) => (
            <a
              key={link.href}
              className="site-header__link"
              href={link.href}
              data-active={link.active ? '' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <span className="site-header__spacer" />
        <div className="site-header__controls">
          <label className="site-header__theme">
            {theme === 'dark' ? t(SITE_COPY.themeDark) : t(SITE_COPY.themeLight)}
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}
              aria-label="theme"
              size="sm"
            />
          </label>
          <Select
            size="sm"
            aria-label="language"
            options={LOCALE_OPTIONS}
            value={locale}
            onChange={(value) => onLocaleChange(value as LiquidGlassLocale)}
          />
        </div>
      </GlassSurface>
    </header>
  );
}

function SiteFooter() {
  const t = useT();
  return <footer className="site-footer">{t(SITE_COPY.footer)}</footer>;
}

function PageForRoute({ route }: { route: Route }) {
  if (route.page === 'guide') {
    return <GuidePage />;
  }
  if (route.page === 'components') {
    return route.slug ? <ComponentDetailPage slug={route.slug} /> : <ComponentsPage />;
  }
  return <HomePage />;
}

export function App() {
  const route = useHashRoute();
  const [locale, setLocale] = useState<LiquidGlassLocale>('zh-CN');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LiquidGlassConfig locale={locale}>
      <SiteLocaleContext.Provider value={locale}>
        <div className="site">
          <SiteHeader
            route={route}
            locale={locale}
            onLocaleChange={setLocale}
            theme={theme}
            onThemeChange={setTheme}
          />
          <main className="site__main">
            <PageForRoute route={route} />
          </main>
          <SiteFooter />
          <Toaster position="top-center" />
        </div>
      </SiteLocaleContext.Provider>
    </LiquidGlassConfig>
  );
}
