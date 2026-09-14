import { useEffect, useState } from 'react';
import { GlassDialog, GlassIconButton, LibraryIcon, List, ListRow, ListSection, SearchField, Text } from '@ttqtt/liquid-glass-react';
import { searchDocs } from '../catalog/index.js';

/** Command-palette style component search. ⌘K / Ctrl-K opens it; Escape closes and restores focus. */
export function ComponentSearch({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setOpen(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const results = searchDocs(query);
  return <GlassDialog title="搜索组件" description="输入组件名、分组或用途。按 Escape 关闭。"
    open={open} onOpenChange={next => { setOpen(next); if (!next) setQuery(''); }}
    closeLabel="关闭搜索"
    trigger={<GlassIconButton aria-label="搜索组件（⌘K）" variant="plain"><LibraryIcon name="search" size={18} /></GlassIconButton>}>
    <SearchField aria-label="搜索组件" placeholder="按钮、列表、sheet…" value={query} onValueChange={setQuery} autoFocus />
    <div className="search-results">
      {query && results.length === 0 && <Text variant="subhead" tone="secondary">没有匹配的组件。试试「按钮」「列表」或「玻璃」。</Text>}
      {results.length > 0 && <List>
        <ListSection header={`${results.length} 个结果`}>
          {results.slice(0, 8).map(doc => <ListRow key={doc.slug} label={doc.name} secondaryLabel={doc.summary}
            value={doc.group} onSelect={() => { setOpen(false); setQuery(''); onNavigate(`components/${doc.slug}`); }} />)}
        </ListSection>
      </List>}
      {!query && <Text variant="subhead" tone="secondary">提示：随时按 ⌘K 打开这个面板。</Text>}
    </div>
  </GlassDialog>;
}
