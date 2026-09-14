import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import { GlassProvider, LibraryIcon, TabBar, Text, ToastProvider, ToolbarGroup } from '@liquid-glass-ui/react';
import { Icon } from '../icons.js';
import { PreferencesButton, type SitePreferences } from './preferences.js';
import { ComponentSearch } from './search.js';
import { sectionOf } from '../router.js';

const SECTIONS = [
  { key: 'overview', path: 'overview', label: '概览', icon: 'grid' },
  { key: 'foundations', path: 'foundations/materials', label: '基础', icon: 'layer' },
  { key: 'components', path: 'components', label: '组件', icon: 'code' },
  { key: 'labs', path: 'labs/materials', label: '实验室', icon: 'tune' },
  { key: 'guides', path: 'guides/install', label: '指南', icon: 'shield' },
] as const;

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

  const section = sectionOf(path);
  const navigate = (target: string) => (event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(); go(target); };

  return <GlassProvider
    theme={preferences.theme}
    transparency={preferences.opaque ? 'opaque' : 'system'}
    motion={preferences.reducedMotion ? 'reduced' : 'system'}
    contrast={preferences.moreContrast ? 'more' : 'system'}>
    <ToastProvider>
    <div className="app-shell">
      <a className="skip-link" href="#main" onClick={event => { event.preventDefault(); document.getElementById('main')?.focus(); }}>
        跳到主要内容
      </a>

      {/* One navigational element that scales: a floating capsule on phones, a sidebar at 1024. */}
      <TabBar aria-label="主导航" current={section} minimizeOnScroll sidebarBreakpoint={1024}
        sidebarHeader={<a className="wordmark" href="#/overview" onClick={navigate('overview')}>
          <span className="wordmark-mark" aria-hidden="true"><i /><i /></span>
          <Text as="span" variant="headline" emphasized>Liquid Glass UI</Text>
        </a>}
        accessory={secondaryNav}
        items={SECTIONS.map(item => ({
          key: item.key, href: `#/${item.path}`, label: item.label,
          icon: <Icon name={item.icon} size={18} />, onSelect: navigate(item.path),
        }))} />

      <div className="app-main">
        <header className="app-bar">
          <ToolbarGroup>
            <ComponentSearch onNavigate={go} />
            <PreferencesButton value={preferences} onChange={setPreferences} />
          </ToolbarGroup>
        </header>
        <main id="main" tabIndex={-1} className="app-content">
          <div className="page-enter" key={path}>{children}</div>
        </main>
        <footer className="app-footer">
          <Text variant="caption1" tone="tertiary">
            Liquid Glass UI 0.2.0-alpha.1 · 独立设计研究，非 Apple 官方产品，不含 Apple 字体、SF Symbols 或壁纸素材。
          </Text>
          <a className="app-footer-link" href="#/guides/install" onClick={navigate('guides/install')}>
            <Text as="span" variant="caption1">开始接入</Text>
            <LibraryIcon name="chevronForward" size={14} />
          </a>
        </footer>
      </div>
    </div>
    </ToastProvider>
  </GlassProvider>;
}
