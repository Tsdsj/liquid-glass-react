import { Fragment, type ReactNode } from 'react';
import { Text } from '@ttqtt/liquid-glass-react';

/**
 * The subset of Markdown the changelog actually uses, and nothing else.
 *
 * A general Markdown library would be a dependency, and the site is held to zero external
 * requests and no runtime dependencies — so this handles what is in `CHANGELOG.md` today
 * (headings, paragraphs, bullet lists, fenced code, `code`, **bold**, bare URLs) and leaves
 * anything else as the literal text it was written as. That is the honest failure mode: a
 * construct nobody uses renders as characters rather than silently disappearing.
 */

/** Inline spans. Split on the markers rather than parsing, because they do not nest here. */
function inline(text: string, key: string): ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|https?:\/\/[^\s)）]+)/g);
  return parts.map((part, index) => {
    const id = `${key}-${index}`;
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) {
      return <code key={id} className="md-code">{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={id}>{part.slice(2, -2)}</strong>;
    }
    if (/^https?:\/\//.test(part)) {
      return <a key={id} href={part} rel="noreferrer noopener">{part}</a>;
    }
    return <Fragment key={id}>{part}</Fragment>;
  });
}

export function Markdown({ source }: { source: string }) {
  const lines = source.split('\n');
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let code: string[] | null = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const key = `p-${blocks.length}`;
    blocks.push(<Text key={key} variant="body" className="md-p">{inline(paragraph.join(' '), key)}</Text>);
    paragraph = [];
  };
  const flushList = () => {
    if (!list.length) return;
    const key = `ul-${blocks.length}`;
    blocks.push(<ul key={key} className="md-list">
      {list.map((item, index) => <li key={index}>{inline(item, `${key}-${index}`)}</li>)}
    </ul>);
    list = [];
  };
  const flush = () => { flushParagraph(); flushList(); };

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (code) { blocks.push(<pre key={`pre-${blocks.length}`} className="md-pre"><code>{code.join('\n')}</code></pre>); code = null; }
      else { flush(); code = []; }
      continue;
    }
    if (code) { code.push(line); continue; }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      flush();
      const level = heading[1].length;
      const key = `h-${blocks.length}`;
      // The page supplies its own <h1>, so the file's title becomes a second-level heading and
      // the rest shift with it — a document with two h1s has an unusable heading rotor.
      const tag = (['h2', 'h2', 'h3', 'h4'] as const)[level - 1];
      const variant = level <= 2 ? 'title2' : level === 3 ? 'headline' : 'subhead';
      blocks.push(<Text key={key} as={tag} variant={variant} emphasized className="md-h" data-level={level}>
        {inline(heading[2], key)}
      </Text>);
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(line);
    if (bullet) { flushParagraph(); list.push(bullet[1]); continue; }

    if (line.trim() === '') { flush(); continue; }
    flushList();
    paragraph.push(line.trim());
  }
  flush();
  if (code) blocks.push(<pre key="pre-tail" className="md-pre"><code>{code.join('\n')}</code></pre>);

  return <div className="md">{blocks}</div>;
}
