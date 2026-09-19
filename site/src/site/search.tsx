import { useEffect, useState } from 'react';
import { GlassDialog, GlassIconButton, LibraryIcon, List, ListRow, ListSection, SearchField, Text } from '@ttqtt/liquid-glass-react';
import { searchDocs, type DocHit } from '../catalog/index.js';

/** How many frames to wait for the destination page to render before giving up on the anchor. */
const ANCHOR_FRAMES = 30;

/**
 * Scroll to an element that does not exist yet.
 *
 * Navigating swaps the whole page, so the anchor appears a render or two later. Waiting a fixed
 * timeout would be a guess; this looks each frame until it is there, and stops rather than
 * looping forever if the id was wrong.
 */
function scrollToAnchor(id: string) {
  let frames = 0;
  const look = () => {
    const target = document.getElementById(id);
    if (target) { target.scrollIntoView({ block: 'start' }); return; }
    if (frames++ < ANCHOR_FRAMES) requestAnimationFrame(look);
  };
  requestAnimationFrame(look);
}

const KIND_LABEL: Record<DocHit['kind'], string> = {
  component: '组件', example: '示例', prop: '属性', section: '章节',
};

/** Quick jump to a component, an example, a property or a section. ⌘K or Ctrl-K opens it. */
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
  const go = (hit: DocHit) => {
    setOpen(false);
    setQuery('');
    onNavigate(`components/${hit.doc.slug}`);
    if (hit.anchor) scrollToAnchor(hit.anchor);
  };
  return <GlassDialog title="搜索" description="组件名、示例标题、属性名、章节名都能搜。"
    open={open} onOpenChange={next => { setOpen(next); if (!next) setQuery(''); }}
    closeLabel="关闭搜索"
    trigger={<GlassIconButton aria-label="搜索（⌘K）" variant="plain"><LibraryIcon name="search" size={18} /></GlassIconButton>}>
    <SearchField aria-label="搜索" placeholder="按钮、刻度、marks、API…" value={query} onValueChange={setQuery} autoFocus />
    <div className="search-results">
      {query && results.length === 0 && <Text variant="subhead" tone="secondary">没有匹配的内容。试试「按钮」「刻度」或「marks」。</Text>}
      {results.length > 0 && <List>
        <ListSection header={`${results.length} 个结果`}>
          {results.slice(0, 8).map(hit => <ListRow key={`${hit.kind}-${hit.doc.slug}-${hit.label}`}
            label={hit.label} secondaryLabel={hit.detail}
            value={KIND_LABEL[hit.kind]} onSelect={() => go(hit)} />)}
        </ListSection>
      </List>}
      {!query && <Text variant="subhead" tone="secondary">随时按 ⌘K 打开这个面板。</Text>}
    </div>
  </GlassDialog>;
}
