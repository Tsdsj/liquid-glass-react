'use client';
import { type HTMLAttributes, type MouseEvent, type ReactNode, type RefAttributes } from 'react';
import { cx } from '../system/utils.js';
import { useOverflow } from '../system/overflow.js';
import { useGlassStrings } from '../system/strings.js';
import { LibraryIcon } from '../system/icon.js';
import { GlassMenu, type GlassMenuItem } from '../overlays/menu.js';

export interface PathComponent {
  /** Stable identity. Falls back to the label, which is enough for a path. */
  key?: string;
  /** What this level is called. */
  label: string;
  /** A small leading glyph — a disk, a folder, the document itself. */
  icon?: ReactNode;
  /** Where this level goes. Omit on the last one: you are already there. */
  onSelect?: () => void;
  href?: string;
}

export interface PathBarProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'>, RefAttributes<HTMLElement> {
  /** Root first, current item last. */
  items: PathComponent[];
  /** Names the trail for assistive technology, e.g. "位置". */
  'aria-label': string;
}

/**
 * Where the thing you are looking at sits, and a way back up.
 *
 * The HIG's path-controls page describes the Finder's path bar, and three of its sentences are
 * the whole design:
 *
 * - **"A linear list that includes the root disk, parent folders, and selected item."** Root
 *   first, current last, and the current one is not a link — it is where you already are. It
 *   carries `aria-current="page"`, which is how a screen reader says the same thing.
 * - **"If the list is too long to fit within the control, it hides names between the first and
 *   last items."** Measured, not a `maxVisible` the caller guesses at — see `useOverflow`. What
 *   is hidden goes into a menu under an ellipsis, so it is still reachable rather than merely
 *   gone. The first and the last never collapse: they are the two levels that say what this is.
 * - **"Use a path control in the window body, not the window frame."** So this is content
 *   layer. It is not glass and it does not belong in a toolbar; the stylesheet gives it a
 *   hairline and nothing else.
 *
 * `<nav>` with an ordered list, because the order is the meaning. The separators are drawn by
 * the stylesheet rather than written into the markup — a chevron between two names is not a
 * word, and a screen reader reading "chevron" between every level is noise.
 */
export function PathBar({ items, 'aria-label': label, className, ref, ...props }: PathBarProps) {
  const strings = useGlassStrings();
  /* Only the middle can collapse, so only the middle is measured. */
  const middle = items.slice(1, Math.max(1, items.length - 1));
  const { containerRef, itemRef, triggerRef, hidden, measuring } = useOverflow(middle.length);
  const collapsed = measuring ? 0 : Math.min(hidden, middle.length);
  /* From the front of the middle outwards: the levels nearest the root are the ones you can
     most afford to lose, because the root above them still says where this is. */
  const folded = middle.slice(0, collapsed);
  const shown = middle.slice(collapsed);

  const menuItems: GlassMenuItem[] = folded.map((item, index) => ({
    key: item.key ?? `${item.label}-${index}`,
    label: item.label,
    icon: item.icon,
    onSelect: () => item.onSelect?.(),
    disabled: !item.onSelect && !item.href,
  }));

  const level = (item: PathComponent, index: number, position: 'root' | 'middle' | 'leaf') => {
    const current = position === 'leaf';
    const content = <>
      {item.icon && <span className="lg-path-icon" aria-hidden="true">{item.icon}</span>}
      <span className="lg-path-label">{item.label}</span>
    </>;
    const press = (event: MouseEvent) => {
      if (!item.onSelect) return;
      /* A path level with both an `href` and a handler is a link the application handles
         itself — the same trade every navigation component here makes. */
      if (!item.href) event.preventDefault();
      item.onSelect();
    };
    return <li key={item.key ?? `${item.label}-${index}`} className="lg-path-item"
      ref={position === 'middle' ? itemRef(index) : undefined}>
      {current || (!item.onSelect && !item.href)
        ? <span className="lg-path-level" aria-current={current ? 'page' : undefined}>{content}</span>
        : <a className="lg-path-level" href={item.href ?? '#'} onClick={press}>{content}</a>}
    </li>;
  };

  return <nav {...props} ref={ref} className={cx('lg-path', className)} aria-label={label}>
    <ol className="lg-path-list" ref={containerRef as (node: HTMLOListElement | null) => void}>
      {items.length > 0 && level(items[0], 0, items.length === 1 ? 'leaf' : 'root')}
      {/* The ref is on the row, not on the button: the row carries the separator chevron in a
          `::before`, and reserving only the button's width would leave that chevron unpaid for. */}
      {collapsed > 0 && <li className="lg-path-item lg-path-folded" ref={triggerRef as (node: HTMLLIElement | null) => void}>
        <GlassMenu aria-label={strings.morePathLevels} items={menuItems} align="start" trigger={
          <button type="button" className="lg-path-level lg-path-more" aria-label={strings.morePathLevels}>
            <LibraryIcon name="ellipsis" size={15} />
          </button>
        } />
      </li>}
      {(measuring ? middle : shown).map((item, index) => level(item, collapsed + index, 'middle'))}
      {items.length > 1 && level(items[items.length - 1], items.length - 1, 'leaf')}
    </ol>
  </nav>;
}
