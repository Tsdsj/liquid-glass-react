import { useEffect, useState } from 'react';
import { GlassDialog, GlassIconButton, LibraryIcon, List, ListRow, ListSection, SearchField, Text } from '@ttqtt/liquid-glass-react';
import { docLabel, searchDocs } from '../catalog/index.js';

/** Quick jump to a component. ⌘K or Ctrl-K opens it. */
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
  return <GlassDialog title="搜索组件" description="输入中文名、英文名或用途。"
    open={open} onOpenChange={next => { setOpen(next); if (!next) setQuery(''); }}
    closeLabel="关闭搜索"
    trigger={<GlassIconButton aria-label="搜索组件（⌘K）" variant="plain"><LibraryIcon name="search" size={18} /></GlassIconButton>}>
    <SearchField aria-label="搜索组件" placeholder="按钮、列表、面板…" value={query} onValueChange={setQuery} autoFocus />
    <div className="search-results">
      {query && results.length === 0 && <Text variant="subhead" tone="secondary">没有匹配的组件。试试「按钮」「列表」或「玻璃」。</Text>}
      {results.length > 0 && <List>
        <ListSection header={`${results.length} 个结果`}>
          {results.slice(0, 8).map(doc => <ListRow key={doc.slug} label={docLabel(doc)} secondaryLabel={doc.summary}
            value={doc.group} onSelect={() => { setOpen(false); setQuery(''); onNavigate(`components/${doc.slug}`); }} />)}
        </ListSection>
      </List>}
      {!query && <Text variant="subhead" tone="secondary">随时按 ⌘K 打开这个面板。</Text>}
    </div>
  </GlassDialog>;
}
