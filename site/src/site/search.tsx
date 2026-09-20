import { useState } from 'react';
import { CommandPalette, GlassIconButton, LibraryIcon, useCommandKey, type PaletteCommand } from '@ttqtt/liquid-glass-react';
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

/**
 * Quick jump to a component, an example, a property or a section. ⌘K or Ctrl-K opens it.
 *
 * This used to be a dialog with a search field and a list inside it, hand-assembled here. It is
 * now the library's own `CommandPalette`, which is the point of having one: the site is the
 * first application to want a palette, and a palette written in the site is a palette nobody
 * else gets.
 *
 * `filter={false}` because `searchDocs` is the ranking — pages before examples before
 * properties — and a second pass over its output could only undo that.
 */
export function ComponentSearch({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [query, setQuery] = useState('');
  /**
   * The button used to say ⌘K on every machine, which was a small lie on most of them and
   * became a visible one the moment the binding stopped accepting both modifiers. `mod` is
   * Command on Apple hardware and Control everywhere else, and this is the same answer the
   * binding uses.
   */
  const commandKey = useCommandKey();
  const go = (hit: DocHit) => {
    onNavigate(`components/${hit.doc.slug}`);
    if (hit.anchor) scrollToAnchor(hit.anchor);
  };
  const commands: PaletteCommand[] = searchDocs(query).slice(0, 8).map(hit => ({
    id: `${hit.kind}-${hit.doc.slug}-${hit.anchor ?? ''}-${hit.label}`,
    label: hit.label,
    detail: hit.detail,
    group: KIND_LABEL[hit.kind],
    onSelect: () => go(hit),
  }));

  return <CommandPalette
    title="搜索文档"
    placeholder="组件名、示例标题、属性名、章节名…"
    commands={commands} filter={false}
    query={query} onQueryChange={setQuery}
    emptyLabel={query ? '没有匹配的内容。试试「按钮」「刻度」或「marks」。' : '输入要找的组件、示例或属性。'}
    trigger={<GlassIconButton aria-label={`搜索（${commandKey ? '⌘' : '⌃'}K）`} aria-keyshortcuts="mod k" variant="plain">
      <LibraryIcon name="search" size={18} />
    </GlassIconButton>} />;
}
