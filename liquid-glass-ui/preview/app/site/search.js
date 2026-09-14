import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { GlassDialog, GlassIconButton, LibraryIcon, List, ListRow, ListSection, SearchField, Text } from '@liquid-glass-ui/react';
import { searchDocs } from '../catalog/index.js';
/** Command-palette style component search. ⌘K / Ctrl-K opens it; Escape closes and restores focus. */
export function ComponentSearch({ onNavigate }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    useEffect(() => {
        const onKey = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                setOpen(true);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);
    const results = searchDocs(query);
    return _jsxs(GlassDialog, { title: "\u641C\u7D22\u7EC4\u4EF6", description: "\u8F93\u5165\u7EC4\u4EF6\u540D\u3001\u5206\u7EC4\u6216\u7528\u9014\u3002\u6309 Escape \u5173\u95ED\u3002", open: open, onOpenChange: next => { setOpen(next); if (!next)
            setQuery(''); }, closeLabel: "\u5173\u95ED\u641C\u7D22", trigger: _jsx(GlassIconButton, { "aria-label": "\u641C\u7D22\u7EC4\u4EF6\uFF08\u2318K\uFF09", variant: "plain", children: _jsx(LibraryIcon, { name: "search", size: 18 }) }), children: [_jsx(SearchField, { "aria-label": "\u641C\u7D22\u7EC4\u4EF6", placeholder: "\u6309\u94AE\u3001\u5217\u8868\u3001sheet\u2026", value: query, onValueChange: setQuery, autoFocus: true }), _jsxs("div", { className: "search-results", children: [query && results.length === 0 && _jsx(Text, { variant: "subhead", tone: "secondary", children: "\u6CA1\u6709\u5339\u914D\u7684\u7EC4\u4EF6\u3002\u8BD5\u8BD5\u300C\u6309\u94AE\u300D\u300C\u5217\u8868\u300D\u6216\u300C\u73BB\u7483\u300D\u3002" }), results.length > 0 && _jsx(List, { children: _jsx(ListSection, { header: `${results.length} 个结果`, children: results.slice(0, 8).map(doc => _jsx(ListRow, { label: doc.name, secondaryLabel: doc.summary, value: doc.group, onSelect: () => { setOpen(false); setQuery(''); onNavigate(`components/${doc.slug}`); } }, doc.slug)) }) }), !query && _jsx(Text, { variant: "subhead", tone: "secondary", children: "\u63D0\u793A\uFF1A\u968F\u65F6\u6309 \u2318K \u6253\u5F00\u8FD9\u4E2A\u9762\u677F\u3002" })] })] });
}
