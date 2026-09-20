'use client';
import {
  useCallback, useEffect, useId, useRef, useState,
  type CSSProperties, type HTMLAttributes, type ReactNode, type RefAttributes,
} from 'react';
import { useGlassStrings } from '../system/strings.js';
import { cx, useControllable } from '../system/utils.js';
import { useSizeClass } from '../system/size-class.js';
import { useToggling } from '../system/leave.js';
import { NavigationStack, type NavigationPage } from './navigation-stack.js';

export interface SplitViewProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, RefAttributes<HTMLDivElement> {
  /** The leading column: a sidebar of destinations. */
  sidebar: ReactNode;
  /** The title of the whole split view. One title, on the view — not one per column. */
  title: string;
  /** What the sidebar's current selection is showing. */
  children: ReactNode;
  /** The trailing column: details about the current selection. See `Inspector`. */
  inspector?: ReactNode;

  /** Sidebar width in px, and the range a drag may move it through. */
  sidebarWidth?: number;
  minSidebarWidth?: number;
  maxSidebarWidth?: number;
  onSidebarWidthChange?: (width: number) => void;

  /** Whether the sidebar is showing. Hideable, because a wide view is not always wanted. */
  sidebarVisible?: boolean;
  defaultSidebarVisible?: boolean;
  onSidebarVisibleChange?: (visible: boolean) => void;

  inspectorVisible?: boolean;
  defaultInspectorVisible?: boolean;
  onInspectorVisibleChange?: (visible: boolean) => void;
  inspectorWidth?: number;

  /**
   * What the compact environment pushes on top of the sidebar: the current selection, named.
   *
   * Pass it whenever something is selected. The columns cannot sit side by side on a phone, so
   * this is the only thing that shows there — a split view without it is a sidebar and nothing
   * else, which is a legitimate state (nothing selected yet) and a bad default.
   */
  compact?: { title: string; content: ReactNode };
  /**
   * Back was pressed in the compact stack. The detail closes either way; this is how the
   * caller hears about it, so their selection state can follow.
   */
  onCompactBack?: () => void;
}

const DEFAULT_SIDEBAR = 260, MIN_SIDEBAR = 180, MAX_SIDEBAR = 400, DEFAULT_INSPECTOR = 300;
/** The divider's own width, which the columns do not get to use. */
const DIVIDER = 1;

/**
 * Two or three columns, and the rules that make them a split view rather than three divs.
 *
 * From the HIG's split-views page, in the order they are usually got wrong:
 *
 * - **Only in a regular environment.** Columns cannot sit side by side in a compact one, so
 *   this collapses into a `NavigationStack` below 768px — which is what the system does, and
 *   why `compact` is not optional: a split view that simply vanished on a phone would be a
 *   blank screen.
 * - **One title for the whole view**, not one per column.
 * - **A visible divider**, 1pt, that can be dragged — and clamped to a sensible range, so a
 *   drag cannot leave a column too narrow to use or wide enough to swallow the content.
 * - **The sidebar can be hidden**, and there is more than one way to bring it back.
 *
 * The divider is also a control for the keyboard: `role="separator"` with arrow keys, because
 * a column width that can only be set by dragging is a column width a keyboard user cannot set.
 */
export function SplitView({
  sidebar, title, children, inspector,
  sidebarWidth: controlledWidth, minSidebarWidth = MIN_SIDEBAR, maxSidebarWidth = MAX_SIDEBAR,
  onSidebarWidthChange,
  sidebarVisible: controlledSidebar, defaultSidebarVisible = true, onSidebarVisibleChange,
  inspectorVisible: controlledInspector, defaultInspectorVisible = true, onInspectorVisibleChange,
  inspectorWidth = DEFAULT_INSPECTOR,
  compact, onCompactBack, className, style, ref, ...props
}: SplitViewProps) {
  const compactEnvironment = useSizeClass() === 'compact';
  const strings = useGlassStrings();
  const generated = useId();
  const root = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useControllable(controlledWidth, DEFAULT_SIDEBAR, onSidebarWidthChange);
  const [sidebarOn] = useControllable(controlledSidebar, defaultSidebarVisible, onSidebarVisibleChange);
  const [inspectorOn] = useControllable(controlledInspector, defaultInspectorVisible, onInspectorVisibleChange);
  /* Only a show or a hide animates the column's width. Resizing it — by drag or by arrow key —
     has to be exactly as fast as the input, and an animated `flex-basis` made both feel broken. */
  const sidebarToggling = useToggling(sidebarOn);
  const inspectorToggling = useToggling(inspectorOn);

  /**
   * How wide the view itself is, so the range can be bounded by the room there actually is.
   *
   * Without this the sidebar could be set to its declared maximum inside a container too narrow
   * to give it — `aria-valuenow` said 400 while the column rendered at 304. A width nobody has
   * is not a width, and a screen reader reading it out is being told something untrue.
   */
  const [available, setAvailable] = useState(0);
  useEffect(() => {
    const node = root.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => setAvailable(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, [compactEnvironment]);

  /** What the content column must keep whatever the sidebar asks for. */
  const MIN_CONTENT = 160;
  const ceiling = available
    ? Math.max(minSidebarWidth, available - (inspector && inspectorOn ? inspectorWidth : 0) - DIVIDER - MIN_CONTENT)
    : maxSidebarWidth;
  const reachableMax = Math.min(maxSidebarWidth, ceiling);

  const clamp = useCallback(
    (value: number) => Math.min(reachableMax, Math.max(minSidebarWidth, Math.round(value))),
    [minSidebarWidth, reachableMax],
  );

  /**
   * The divider drag. Measured against the root rather than against the last pointer position,
   * so a drag that outruns the pointer does not accumulate error, and mirrored in RTL because
   * the sidebar is on the leading side.
   */
  const [dragging, setDragging] = useState(false);

  /** Set by Back in the compact stack, cleared by the next selection. */
  const [backed, setBacked] = useState(false);
  const lastTitle = useRef(compact?.title);
  if (compact?.title !== lastTitle.current) { lastTitle.current = compact?.title; if (backed) setBacked(false); }
  const onDividerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !event.isPrimary) return;
    const node = root.current; if (!node) return;
    const box = node.getBoundingClientRect();
    const rtl = getComputedStyle(node).direction === 'rtl';
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    let frame = 0;
    const move = (moveEvent: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setWidth(clamp(rtl ? box.right - moveEvent.clientX : moveEvent.clientX - box.left)));
    };
    const end = () => {
      cancelAnimationFrame(frame); setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end); window.removeEventListener('pointercancel', end);
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end);
  };

  /**
   * Compact: a stack, not a narrower set of columns.
   *
   * `NavigationSplitView` degrades exactly this way on iPhone — the sidebar becomes the root
   * screen and a selection pushes the detail on top of it — so the back button leads to the
   * list, which is the relationship the columns were expressing all along.
   */
  if (compactEnvironment) {
    const rootPage: NavigationPage = { key: 'sidebar', title, content: sidebar };
    const detail: NavigationPage[] = compact && !backed
      ? [{ key: 'detail', title: compact.title, content: compact.content }]
      : [];
    return <NavigationStack {...props} className={cx('lg-split', className)} root={rootPage} pages={detail}
      onPagesChange={next => {
        if (next.length) return;
        /* Back has to actually go back. Driving the stack purely from `compact` made it a
           dead button: the caller's selection had not changed, so the next render put the
           detail straight back and nothing moved. The local flag closes it now; a new
           selection — a different title — clears the flag and pushes again, which is what the
           two columns were doing all along. */
        setBacked(true);
        onCompactBack?.();
      }} />;
  }

  return <div {...props} ref={node => {
    root.current = node;
    if (typeof ref === 'function') ref(node); else if (ref) ref.current = node;
  }} className={cx('lg-split', className)} data-dragging={dragging ? 'true' : undefined}
    /* The clamped width, not the requested one: a controlled caller may ask for more than the
       view can give, and what is drawn and what is announced have to be the same number. */
    style={{ '--lg-split-sidebar': `${clamp(width)}px`, '--lg-split-inspector': `${inspectorWidth}px`, ...style } as CSSProperties}>
    {/**
      * The columns stay in the tree when they are hidden, so that hiding one can be watched.
      *
      * A column that is simply not rendered goes from 260px to nothing between two frames, and
      * the reader is left to work out whether it collapsed, moved, or was never there. The
      * stylesheet closes it to nothing and then turns its visibility off, which is what takes
      * it off the tab order and out of the accessibility tree once it is gone.
      *
      * The cost, and it is a real one: the content you pass as `sidebar` or `inspector` stays
      * mounted while hidden. Its effects keep running. Anything expensive enough to mind about
      * should be unmounted by the caller, which is the only place that knows.
      */}
    <div className="lg-split-column" data-column="sidebar" data-hidden={sidebarOn ? undefined : 'true'}
      data-toggling={sidebarToggling ? 'true' : undefined}>
      <div className="lg-split-inner">{sidebar}</div>
    </div>
    {sidebarOn && <>
      {/**
        * "Make the divider always visible" and "let people resize". Both, and the keyboard
        * equivalent: a width that can only be set by dragging cannot be set without a pointer.
        */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label={strings.resizeSidebar}
        aria-valuenow={clamp(width)}
        aria-valuemin={minSidebarWidth}
        /* The reachable maximum, which in a narrow view is less than the declared one. */
        aria-valuemax={reachableMax}
        aria-controls={`${generated}-sidebar`}
        tabIndex={0}
        className="lg-split-divider"
        onPointerDown={onDividerDown}
        onDoubleClick={() => setWidth(DEFAULT_SIDEBAR)}
        onKeyDown={event => {
          const step = event.shiftKey ? 40 : 8;
          if (event.key === 'ArrowRight') setWidth(clamp(width + step));
          else if (event.key === 'ArrowLeft') setWidth(clamp(width - step));
          else if (event.key === 'Home') setWidth(minSidebarWidth);
          else if (event.key === 'End') setWidth(maxSidebarWidth);
          else return;
          event.preventDefault();
        }} />
    </>}

    <div className="lg-split-column" data-column="content" id={`${generated}-sidebar`}>
      <div className="lg-split-inner">{children}</div>
    </div>

    {inspector && <div className="lg-split-column" data-column="inspector" data-hidden={inspectorOn ? undefined : 'true'}
      data-toggling={inspectorToggling ? 'true' : undefined}>
      <div className="lg-split-inner">{inspector}</div>
    </div>}
  </div>;
}

/** `title` is the column's heading, not an HTML tooltip — the same trade the overlays make. */
export interface InspectorProps extends Omit<HTMLAttributes<HTMLElement>, 'title'>, RefAttributes<HTMLElement> {
  /** What is being inspected. A heading for the column, not for the whole view. */
  title?: ReactNode;
  children: ReactNode;
}

/**
 * The trailing column: details about whatever is selected.
 *
 * Trailing, always — the sidebar chooses, the content shows, the inspector refines, and that
 * order is the reading order. Its controls are dense, so they use rounded rectangles rather
 * than capsules: a column of capsules at this width is mostly gap.
 *
 * Content layer. It is a region of the window, not something floating over it; giving it glass
 * would put a translucent panel between the reader and the thing they are editing.
 */
export function Inspector({ title, children, className, ref, ...props }: InspectorProps) {
  return <aside {...props} ref={ref} className={cx('lg-inspector', className)}>
    {title && <header className="lg-inspector-title">{title}</header>}
    <div className="lg-inspector-body">{children}</div>
  </aside>;
}
