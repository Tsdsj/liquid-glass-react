import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import { GlassProvider, LibraryIcon, Screen, TabBar, Text, ToastProvider, ToolbarGroup } from '@ttqtt/liquid-glass-react';
import { Icon } from '../icons.js';
import { PreferencesButton, type SitePreferences } from './preferences.js';
import { ComponentSearch } from './search.js';
import { sectionOf } from '../router.js';

const SECTIONS = [
  { key: 'overview', path: 'overview', label: '概览', icon: 'grid' },
  { key: 'foundations', path: 'foundations/materials', label: '基础', icon: 'layer' },
  { key: 'components', path: 'components', label: '组件', icon: 'code' },
  { key: 'guides', path: 'guides/install', label: '指南', icon: 'shield' },
] as const;

/**
 * The labels the components supply for themselves. The library ships English and does not
 * guess; this site is written in Chinese, so it says so. Defined once outside the component
 * so its identity is stable and the provider is not a new value on every render.
 */
const STRINGS = {
  close: '关闭',
  cancel: '取消',
  decrease: '减少',
  increase: '增加',
  clearSearch: '清除搜索内容',
  searchCommands: '搜索命令',
  noResults: '没有匹配的命令',
  back: '返回',
  resizeSidebar: '调整侧栏宽度',
  sheetHeight: (title: string) => `${title}的高度`,
};

const STORAGE = { theme: 'lg-docs-theme', textSize: 'lg-docs-text-size' };
const readStored = (key: string, fallback: string) => {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
};

export function Shell({ path, go, secondaryNav, children }: {
  path: string; go: (path: string) => void; secondaryNav?: ReactNode; children: ReactNode;
}) {
  const [preferences, setPreferences] = useState<SitePreferences>(() => ({
    theme: readStored(STORAGE.theme, 'system') as SitePreferences['theme'],
    textSize: readStored(STORAGE.textSize, 'l') as SitePreferences['textSize'],
    opaque: false, reducedMotion: false, moreContrast: false,
  }));

  // Written straight onto <html> so the inline boot script and React agree on one source of truth.
  useEffect(() => {
    const root = document.documentElement;
    const dark = preferences.theme === 'dark'
      || (preferences.theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    root.dataset.appTheme = dark ? 'dark' : 'light';
    root.setAttribute('data-lg-theme', dark ? 'dark' : 'light');
    root.style.colorScheme = dark ? 'dark' : 'light';
    root.dataset.lgTextSize = preferences.textSize;
    try {
      localStorage.setItem(STORAGE.theme, preferences.theme);
      localStorage.setItem(STORAGE.textSize, preferences.textSize);
    } catch { /* private mode: the session still works, it just will not be remembered */ }
  }, [preferences.theme, preferences.textSize]);

  // Following the system means re-resolving when the system changes, not only on first load.
  useEffect(() => {
    if (preferences.theme !== 'system') return;
    const media = matchMedia('(prefers-color-scheme: dark)');
    const sync = () => setPreferences(current => ({ ...current }));
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, [preferences.theme]);

  /* The bar's height used to be measured here, so the compact outline could stick below it
     rather than slide underneath. `Screen` measures its own bars and publishes the result as
     `--lg-screen-top`, so that duplicate is gone: one measurement, and the safe-area inset is
     part of it because the inset lives on the bar. */

  const section = sectionOf(path);
  const navigate = (target: string) => (event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(); go(target); };

  return <GlassProvider
    theme={preferences.theme}
    transparency={preferences.opaque ? 'opaque' : 'system'}
    motion={preferences.reducedMotion ? 'reduced' : 'system'}
    contrast={preferences.moreContrast ? 'more' : 'system'}
    strings={STRINGS}>
    <ToastProvider>
    <div className="app-shell">
      <a className="skip-link" href="#main" onClick={event => { event.preventDefault(); document.getElementById('main')?.focus(); }}>
        跳到主要内容
      </a>

      {/**
        * One band across the top, the way every documentation site anyone will arrive from is
        * built: the name, the sections, and the two things that are not navigation.
        *
        * The sections live **here** rather than in the left column, and that is the change that
        * makes the left column a documentation sidebar instead of two lists of different kinds
        * stacked in one rail. It is also what the reader already knows: top-level areas across
        * the top, the pages of the area you are in down the side.
        *
        * `Screen` still owns the band — it pins it, measures it, publishes the height as
        * `--lg-screen-top` (which the sidebar below sticks to) and draws the one scroll edge
        * this view is allowed, so content dissolves into the bar instead of sliding under a
        * hard line.
        */}
      <Screen scroll="page" className="app-main" edge="hard" edgeHeight={64} top={
        <div className="app-header">
          <div className="app-header-inner">
            <a className="wordmark" href="#/overview" onClick={navigate('overview')}>
              <span className="wordmark-mark" aria-hidden="true"><i /><i /></span>
              <Text as="span" variant="headline" emphasized>Liquid Glass UI</Text>
            </a>
            {/**
              * One navigational element at every width. `sidebarBreakpoint` is out of reach on
              * purpose: the capsule *is* the desktop form here, sitting in the band, and on a
              * phone the same element drops back to the floating bar at the bottom of the
              * screen. Two renderings of one list would be two lists to keep in step.
              */}
            <TabBar aria-label="主导航" current={section} minimizeOnScroll sidebarBreakpoint={Number.MAX_SAFE_INTEGER}
              className="app-sections"
              items={SECTIONS.map(item => ({
                key: item.key, href: `#/${item.path}`, label: item.label,
                icon: <Icon name={item.icon} size={18} />, onSelect: navigate(item.path),
              }))} />
            <ToolbarGroup className="app-header-actions">
              <ComponentSearch onNavigate={go} />
              <PreferencesButton value={preferences} onChange={setPreferences} />
            </ToolbarGroup>
          </div>
        </div>
      }>
        {/**
          * Two columns under the band, and only where there is something to put in the first
          * one. The overview and the changelog have no sibling pages, so they get the width
          * instead of a 260px column of nothing — which is what a sidebar with four links in a
          * 1000px rail had become.
          */}
        <div className="app-body" data-rail={secondaryNav ? 'true' : 'false'}>
          {secondaryNav && <div className="app-rail">{secondaryNav}</div>}
          <main id="main" tabIndex={-1} className="app-content">
            <div className="page-enter" key={path}>{children}</div>
          </main>
        </div>
        <footer className="app-footer">
          {/* Secondary, not tertiary: tertiary is the colour of a placeholder and measures
              2.3:1 on this canvas. This line is something to read. */}
          <Text variant="caption1" tone="secondary">
            Liquid Glass UI · 独立设计研究，非 Apple 官方产品，不含 Apple 字体、SF Symbols 或壁纸素材。
          </Text>
          <div className="app-footer-links">
            {/* The version links to what changed in it — the question anyone reading a version
                number in a footer is actually asking. A link of its own, not a word inside the
                sentence: at caption size that word is 26x15, and a touch target is 44. */}
            <a className="app-footer-link" href="#/changelog" onClick={navigate('changelog')}>
              <Text as="span" variant="caption1">更新日志 {__LG_VERSION__}</Text>
              <LibraryIcon name="chevronForward" size={14} />
            </a>
            <a className="app-footer-link" href="#/guides/install" onClick={navigate('guides/install')}>
              <Text as="span" variant="caption1">开始接入</Text>
              <LibraryIcon name="chevronForward" size={14} />
            </a>
          </div>
        </footer>
      </Screen>
    </div>
    </ToastProvider>
  </GlassProvider>;
}
