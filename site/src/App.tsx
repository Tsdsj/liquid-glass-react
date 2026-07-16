import { useEffect, useState } from 'react';
import {
  Button,
  LiquidGlassConfig,
  Select,
  Switch,
  Toaster,
  type LiquidGlassLocale,
} from '@ttqtt/liquid-glass-react';
import { SiteSearch } from './components/SiteSearch';
import { ComponentDetailPage } from './pages/ComponentDetailPage';
import { ComponentsPage } from './pages/ComponentsPage';
import { GuidePage } from './pages/GuidePage';
import { HomePage } from './pages/HomePage';
import { useHashRoute, type Route } from './router';
import { SITE_COPY, SiteLocaleContext, useT } from './site-i18n';
import { PHOTO_WALLPAPER } from './wallpaper';
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
  onOpenSearch: () => void;
}

function SiteHeader({
  route,
  locale,
  onLocaleChange,
  theme,
  onThemeChange,
  onOpenSearch,
}: SiteHeaderProps) {
  const t = useT();
  const links = [
    { href: '#/', label: t(SITE_COPY.navHome), active: isActive(route, 'home') },
    { href: '#/components', label: t(SITE_COPY.navComponents), active: isActive(route, 'components') },
    { href: '#/guide', label: t(SITE_COPY.navGuide), active: isActive(route, 'guide') },
  ];

  return (
    <header className="site-header">
      <div className="site-container site-header__inner">
        <a className="site-header__brand" href="#/">
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
        <div className="site-header__controls">
          <Button
            size="sm"
            variant="ghost"
            className="site-header__search"
            onClick={onOpenSearch}
            aria-keyshortcuts="/"
          >
            {locale === 'zh-CN' ? '搜索组件 /' : 'Search /'}
          </Button>
          <div className="site-header__theme">
            <span className="site-header__theme-label">
              {theme === 'dark' ? t(SITE_COPY.themeDark) : t(SITE_COPY.themeLight)}
            </span>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}
              aria-label="theme"
              size="sm"
            />
          </div>
          <div className="site-header__locale">
            <Select
              size="sm"
              aria-label="language"
              options={LOCALE_OPTIONS}
              value={locale}
              onChange={(value) => onLocaleChange(value as LiquidGlassLocale)}
            />
          </div>
        </div>
      </div>
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
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Expose the bundled wallpaper as a CSS var so every demo/preview surface can
  // sit glass on the same textured backdrop (see --site-demo-scrim in site.css).
  useEffect(() => {
    document.documentElement.style.setProperty('--site-wallpaper', PHOTO_WALLPAPER);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LiquidGlassConfig locale={locale}>
      <SiteLocaleContext.Provider value={locale}>
        <div className="site">
          <a className="site-skip-link" href="#site-main">
            {locale === 'zh-CN' ? '跳到主要内容' : 'Skip to content'}
          </a>
          <SiteHeader
            route={route}
            locale={locale}
            onLocaleChange={setLocale}
            theme={theme}
            onThemeChange={setTheme}
            onOpenSearch={() => setSearchOpen(true)}
          />
          <main id="site-main" className="site__main">
            <PageForRoute route={route} />
          </main>
          <SiteFooter />
          <SiteSearch open={searchOpen} onOpenChange={setSearchOpen} />
          <Toaster position="top-center" />
        </div>
      </SiteLocaleContext.Provider>
    </LiquidGlassConfig>
  );
}
