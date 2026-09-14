import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { GlassProvider, LibraryIcon, TabBar, Text, ToastProvider, ToolbarGroup } from '@liquid-glass-ui/react';
import { Icon } from '../icons.js';
import { PreferencesButton } from './preferences.js';
import { ComponentSearch } from './search.js';
import { sectionOf } from '../router.js';
const SECTIONS = [
    { key: 'overview', path: 'overview', label: '概览', icon: 'grid' },
    { key: 'foundations', path: 'foundations/materials', label: '基础', icon: 'layer' },
    { key: 'components', path: 'components', label: '组件', icon: 'code' },
    { key: 'labs', path: 'labs/materials', label: '实验室', icon: 'tune' },
    { key: 'guides', path: 'guides/install', label: '指南', icon: 'shield' },
];
const STORAGE = { theme: 'lg-docs-theme', textSize: 'lg-docs-text-size' };
const readStored = (key, fallback) => {
    try {
        return localStorage.getItem(key) ?? fallback;
    }
    catch {
        return fallback;
    }
};
export function Shell({ path, go, secondaryNav, children }) {
    const [preferences, setPreferences] = useState(() => ({
        theme: readStored(STORAGE.theme, 'system'),
        textSize: readStored(STORAGE.textSize, 'l'),
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
        }
        catch { /* private mode: the session still works, it just will not be remembered */ }
    }, [preferences.theme, preferences.textSize]);
    // Following the system means re-resolving when the system changes, not only on first load.
    useEffect(() => {
        if (preferences.theme !== 'system')
            return;
        const media = matchMedia('(prefers-color-scheme: dark)');
        const sync = () => setPreferences(current => ({ ...current }));
        media.addEventListener('change', sync);
        return () => media.removeEventListener('change', sync);
    }, [preferences.theme]);
    const section = sectionOf(path);
    const navigate = (target) => (event) => { event.preventDefault(); go(target); };
    return _jsx(GlassProvider, { theme: preferences.theme, transparency: preferences.opaque ? 'opaque' : 'system', motion: preferences.reducedMotion ? 'reduced' : 'system', contrast: preferences.moreContrast ? 'more' : 'system', children: _jsx(ToastProvider, { children: _jsxs("div", { className: "app-shell", children: [_jsx("a", { className: "skip-link", href: "#main", onClick: event => { event.preventDefault(); document.getElementById('main')?.focus(); }, children: "\u8DF3\u5230\u4E3B\u8981\u5185\u5BB9" }), _jsx(TabBar, { "aria-label": "\u4E3B\u5BFC\u822A", current: section, minimizeOnScroll: true, sidebarBreakpoint: 1024, sidebarHeader: _jsxs("a", { className: "wordmark", href: "#/overview", onClick: navigate('overview'), children: [_jsxs("span", { className: "wordmark-mark", "aria-hidden": "true", children: [_jsx("i", {}), _jsx("i", {})] }), _jsx(Text, { as: "span", variant: "headline", emphasized: true, children: "Liquid Glass UI" })] }), accessory: secondaryNav, items: SECTIONS.map(item => ({
                            key: item.key, href: `#/${item.path}`, label: item.label,
                            icon: _jsx(Icon, { name: item.icon, size: 18 }), onSelect: navigate(item.path),
                        })) }), _jsxs("div", { className: "app-main", children: [_jsx("header", { className: "app-bar", children: _jsxs(ToolbarGroup, { children: [_jsx(ComponentSearch, { onNavigate: go }), _jsx(PreferencesButton, { value: preferences, onChange: setPreferences })] }) }), _jsx("main", { id: "main", tabIndex: -1, className: "app-content", children: _jsx("div", { className: "page-enter", children: children }, path) }), _jsxs("footer", { className: "app-footer", children: [_jsx(Text, { variant: "caption1", tone: "tertiary", children: "Liquid Glass UI 0.2.0-alpha.1 \u00B7 \u72EC\u7ACB\u8BBE\u8BA1\u7814\u7A76\uFF0C\u975E Apple \u5B98\u65B9\u4EA7\u54C1\uFF0C\u4E0D\u542B Apple \u5B57\u4F53\u3001SF Symbols \u6216\u58C1\u7EB8\u7D20\u6750\u3002" }), _jsxs("a", { className: "app-footer-link", href: "#/guides/install", onClick: navigate('guides/install'), children: [_jsx(Text, { as: "span", variant: "caption1", children: "\u5F00\u59CB\u63A5\u5165" }), _jsx(LibraryIcon, { name: "chevronForward", size: 14 })] })] })] })] }) }) });
}
