'use client';
import { useCallback, useRef, useState, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type ReactNode, type RefAttributes } from 'react';
import { cx, useControllable } from '../system/utils.js';
import { LibraryIcon } from '../system/icon.js';

export interface OutlineNode {
  /** Stable identity. Expansion and selection are remembered by this, not by position. */
  key: string;
  /** The name in the hierarchy column. Type-ahead matches against it. */
  label: string;
  /** A small leading glyph — a folder, a document, a kind. */
  icon?: ReactNode;
  /**
   * A trailing read-out on the same row: a size, a count, a date.
   *
   * It is deliberately *not* a column. A multi-column outline is a `treegrid` — cell-level
   * arrow keys, column headings, resizable columns — and a two-column tree with neither
   * headings nor cell navigation is the half-built version of that: it reads as a table to
   * nobody and navigates as one to nobody either.
   */
  value?: ReactNode;
  /**
   * Undefined means a leaf and carries no `aria-expanded`; an empty array means a container
   * that happens to be empty, which is a different thing to say and a different thing to hear.
   */
  children?: OutlineNode[];
  disabled?: boolean;
}

export interface OutlineViewProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect'>, RefAttributes<HTMLUListElement> {
  items: OutlineNode[];
  /** Names the outline. A single-column outline has no column heading to do it instead. */
  'aria-label': string;
  /** Keys of the open containers. Hold this to keep someone's expansion across visits. */
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (keys: string[]) => void;
  selected?: string | null;
  defaultSelected?: string | null;
  onSelect?: (key: string, node: OutlineNode) => void;
}

interface Row { node: OutlineNode; depth: number; parent: string | null }

/** The rows you can actually reach: a container's children only count once it is open. */
function visibleRows(items: OutlineNode[], open: Set<string>, depth = 0, parent: string | null = null): Row[] {
  const rows: Row[] = [];
  for (const node of items) {
    rows.push({ node, depth, parent });
    if (node.children && open.has(node.key)) rows.push(...visibleRows(node.children, open, depth + 1, node.key));
  }
  return rows;
}

/** Every container at or under `node`, for the HIG's Option-click. */
function containersUnder(node: OutlineNode, into: string[] = []): string[] {
  if (!node.children) return into;
  into.push(node.key);
  for (const child of node.children) containersUnder(child, into);
  return into;
}

function find(items: OutlineNode[], key: string): OutlineNode | undefined {
  for (const node of items) {
    if (node.key === key) return node;
    const hit = node.children && find(node.children, key);
    if (hit) return hit;
  }
  return undefined;
}

const OWNED = new Set(['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter', ' ']);

/**
 * Hierarchical data as a tree of rows you can open and close.
 *
 * The HIG's outline-views page draws the line this is built on: **"Expose data hierarchy in the
 * first column only."** So there is one column, it holds the hierarchy, and a row's `value` is
 * a read-out on that same row rather than a second column — see `OutlineNode`.
 *
 * Two behaviours come straight off that page. **"Make it easy for people to expand or collapse
 * nested containers"**: clicking the triangle opens one level, Option-clicking it opens
 * everything underneath. **"Retain people's expansion choices"**: which containers are open is
 * a controlled value, because the library cannot know where a caller would persist it, and
 * quietly keeping it in a `useState` would lose it on every visit while looking like it worked.
 *
 * The keyboard model is `role="tree"`, and it is why this is a component rather than a nested
 * `<ul>`: Up and Down move by *visible* row rather than by DOM order, Right opens a closed
 * container and then steps into it, Left closes an open one and then steps out to its parent,
 * Home and End jump, typing skips to a matching name, Enter and Space select. One row is in the
 * tab order at a time, so the whole tree is one stop rather than one stop per file.
 *
 * The triangle is not a button. A `<button>` inside a `treeitem` is a focus stop the tree model
 * has no move for, and one more thing to tab past on every row; the row carries `aria-expanded`
 * and that is what announces open and closed. Content layer, like every other list here.
 */
export function OutlineView({
  items, 'aria-label': label, expanded, defaultExpanded = [], onExpandedChange,
  selected, defaultSelected = null, onSelect, className, ref, ...props
}: OutlineViewProps) {
  const [openKeys, setOpenKeys] = useControllable(expanded, defaultExpanded, onExpandedChange);
  const [active, setActive] = useControllable<string | null>(selected, defaultSelected,
    key => { const node = key === null ? undefined : find(items, key); if (node) onSelect?.(node.key, node); });
  const open = new Set(openKeys);
  const rows = visibleRows(items, open);

  /**
   * Which row owns the tab stop. It is not the selection: someone can walk the tree with the
   * arrow keys without having chosen anything, and a tree with nothing selected still has to be
   * enterable. It follows the selection when there is one and otherwise starts at the top, and
   * `rows` is consulted so a row whose parent has since closed cannot keep the tab stop where
   * nobody can reach it.
   */
  const [remembered, setRemembered] = useState<string | null>(null);
  const focusKey = [remembered, active].find(key => key !== null && rows.some(row => row.node.key === key))
    ?? rows[0]?.node.key ?? null;

  const list = useRef<HTMLUListElement>(null);
  const search = useRef({ text: '', time: 0 });

  /**
   * Focus moves now and the tab stop follows on the next render. Both are needed: the element
   * is reachable by `focus()` at `tabindex="-1"`, but leaving the stop behind would mean
   * tabbing back into the tree landed somewhere other than where you left it.
   */
  const move = useCallback((key: string | undefined) => {
    if (!key) return;
    setRemembered(key);
    list.current?.querySelector<HTMLLIElement>(`[data-key="${CSS.escape(key)}"]`)?.focus();
  }, []);

  const setOpen = useCallback((key: string, next: boolean, deep = false) => {
    const node = find(items, key);
    const affected = deep && node ? containersUnder(node) : [key];
    const kept = openKeys.filter(k => !affected.includes(k));
    /* Closing a folder someone is standing inside takes their row away. Catch them on the
       folder itself rather than letting focus fall back to the document body, which would end
       the keyboard walk and put them at the top of the page on the next Tab. */
    if (!next) {
      const item = list.current?.querySelector<HTMLElement>(`[data-key="${CSS.escape(key)}"]`);
      if (item && item !== document.activeElement && item.contains(document.activeElement)) {
        setRemembered(key); item.focus();
      }
    }
    setOpenKeys(next ? [...kept, ...affected] : kept);
  }, [items, openKeys, setOpenKeys]);

  const rowAt = (event: { target: EventTarget | null }) => {
    const element = (event.target as HTMLElement | null)?.closest<HTMLElement>('[role="treeitem"]');
    const key = element?.dataset.key;
    return key ? rows.find(row => row.node.key === key) : undefined;
  };

  /**
   * One handler on the tree rather than one per row. Rows nest, so a row-level handler makes
   * every keystroke arrive at the child and then at each ancestor in turn: Right on a leaf does
   * nothing there and then steps its open parent forward, which is a move nobody asked for.
   */
  const keys = (event: KeyboardEvent<HTMLUListElement>) => {
    const row = rowAt(event); if (!row) return;
    const { node } = row;
    const printable = event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;
    if (!OWNED.has(event.key) && !printable) return;
    event.stopPropagation();
    const index = rows.indexOf(row);
    const container = !!node.children;
    const isOpen = container && open.has(node.key);
    switch (event.key) {
      case 'ArrowDown': move(rows[index + 1]?.node.key); break;
      case 'ArrowUp': move(rows[index - 1]?.node.key); break;
      case 'Home': move(rows[0]?.node.key); break;
      case 'End': move(rows[rows.length - 1]?.node.key); break;
      case 'ArrowRight':
        /* Open it, then step in — two presses rather than one, because a container that both
           opened and moved the focus away would never let you look at what it opened. */
        if (container && !isOpen) setOpen(node.key, true);
        else if (isOpen) move(rows[index + 1]?.node.key);
        break;
      case 'ArrowLeft':
        if (isOpen) setOpen(node.key, false);
        else if (row.parent) move(row.parent);
        break;
      case 'Enter': case ' ':
        if (!node.disabled) setActive(node.key);
        break;
      default: {
        const now = Date.now();
        search.current.text = (now - search.current.time > 700 ? '' : search.current.text) + event.key.toLocaleLowerCase();
        search.current.time = now;
        const order = [...rows.slice(index + 1), ...rows.slice(0, index + 1)];
        const match = order.find(candidate => candidate.node.label.toLocaleLowerCase().startsWith(search.current.text));
        if (match) move(match.node.key);
        break;
      }
    }
    event.preventDefault();
  };

  const press = (event: MouseEvent<HTMLUListElement>) => {
    const row = rowAt(event); if (!row) return;
    const { node } = row;
    setRemembered(node.key);
    /* A click on the triangle is about the container; a click anywhere else on the row is about
       the row. The same one-row-two-meanings split the Finder makes. */
    if (node.children && (event.target as HTMLElement).closest('.lg-outline-twist')) {
      setOpen(node.key, !open.has(node.key), event.altKey);
    } else if (!node.disabled) {
      setActive(node.key);
    }
  };

  const render = (node: OutlineNode, depth: number): ReactNode => {
    const container = !!node.children;
    const isOpen = container && open.has(node.key);
    return <li key={node.key} className="lg-outline-item" role="treeitem" data-key={node.key}
      aria-expanded={container ? isOpen : undefined}
      aria-selected={active === node.key}
      aria-level={depth + 1}
      aria-disabled={node.disabled || undefined}
      data-selected={active === node.key ? 'true' : undefined}
      data-disabled={node.disabled ? 'true' : undefined}
      tabIndex={focusKey === node.key ? 0 : -1}>
      <span className="lg-outline-row" style={{ '--lg-outline-depth': depth } as React.CSSProperties}>
        {/* Decoration: `aria-expanded` on the row already says open or closed, and a second
            voice saying it would be heard on every row of the tree. */}
        <span className="lg-outline-twist" aria-hidden="true" data-container={container ? 'true' : undefined}>
          {container && <LibraryIcon name="chevronForward" size={13} />}
        </span>
        {node.icon && <span className="lg-outline-icon" aria-hidden="true">{node.icon}</span>}
        <span className="lg-outline-label">{node.label}</span>
        {node.value !== undefined && <span className="lg-outline-value">{node.value}</span>}
      </span>
      {container && <ul className="lg-outline-group" role="group">
        {node.children!.map(child => render(child, depth + 1))}
      </ul>}
    </li>;
  };

  return <ul {...props}
    ref={node => { list.current = node; if (typeof ref === 'function') ref(node); else if (ref) ref.current = node; }}
    className={cx('lg-outline', className)} role="tree" aria-label={label}
    onKeyDown={keys} onClick={press}
    onFocus={event => { const row = rowAt(event); if (row) setRemembered(row.node.key); }}>
    {items.map(node => render(node, 0))}
  </ul>;
}
