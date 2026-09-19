'use client';
import {
  createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState,
  type HTMLAttributes, type ReactNode, type RefAttributes,
} from 'react';
import { GlassButton } from '../controls/button.js';
import { NavigationBar } from '../navigation/nav-bar.js';
import { LibraryIcon } from '../system/icon.js';
import { useGlassPolicy } from '../system/provider.js';
import { useGlassStrings } from '../system/strings.js';
import { cx } from '../system/utils.js';

/** One screen on the stack. `key` is what identifies it; `title` is what the bar says. */
export interface NavigationPage {
  key: string;
  title: string;
  subtitle?: ReactNode;
  /** Trailing controls for this screen's bar. Group by function; the primary action alone. */
  trailing?: ReactNode;
  content: ReactNode;
}

interface StackApi {
  push: (page: NavigationPage) => void;
  pop: () => void;
  /** Back to the first screen in one step, the way a long-press on Back does. */
  popToRoot: () => void;
  /** How deep we are. 1 is the root. */
  depth: number;
  canGoBack: boolean;
}

const StackContext = createContext<StackApi | null>(null);

/**
 * The stack, from inside it. A screen pushes the next one without being handed a callback
 * through three layers of props.
 *
 * Throws outside a `NavigationStack`, rather than returning a no-op: a push that silently does
 * nothing is a dead button, and a dead button is harder to find than an error.
 */
export function useNavigationStack(): StackApi {
  const api = useContext(StackContext);
  if (!api) throw new Error('useNavigationStack must be used inside a <NavigationStack>. Wrap the screen that calls it.');
  return api;
}

export interface NavigationStackProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'>,
  RefAttributes<HTMLDivElement> {
  /** The screen at the bottom of the stack. Always present; it cannot be popped. */
  root: NavigationPage;
  /**
   * Drive the stack yourself — from a router, say. Omit it and the component keeps its own.
   * The array is the screens *above* the root, in order.
   */
  pages?: NavigationPage[];
  onPagesChange?: (pages: NavigationPage[]) => void;
  /**
   * What the back button says. `title` carries the previous screen's name, which is what the
   * system does when it fits; `chevron` is the bare arrow for when it does not.
   */
  backLabel?: 'title' | 'chevron';
  /** Heading level for the root screen's large title. See `NavigationBar.headingLevel`. */
  headingLevel?: 1 | 2 | 3;
}

/**
 * A stack of screens with one bar that follows it.
 *
 * The back button is the whole point and the part that is usually wrong. It carries the
 * **previous screen's title**, because "Back" tells you the direction and not the
 * destination — you already know you are going back. Its accessible name says both, so a
 * screen reader hears "Back to Settings" rather than a chevron.
 *
 * Pushing and popping move focus to the new screen's `<main>`. Without that, a keyboard user
 * presses a row, the screen changes, and their next Tab continues from wherever the row they
 * pressed used to be — on a screen that no longer exists.
 *
 * The transition is a cross-fade with a small slide, mirrored for a pop and for RTL, and it
 * is the slide that Reduce Motion removes: direction is the thing that reads as movement, and
 * a fade alone still says "this is different now".
 */
export function NavigationStack({
  root, pages: controlled, onPagesChange, backLabel = 'title', headingLevel = 1, className, ref, ...props
}: NavigationStackProps) {
  const [own, setOwn] = useState<NavigationPage[]>([]);
  const pages = controlled ?? own;
  const strings = useGlassStrings();
  const policy = useGlassPolicy();
  const generated = useId();
  const mainRef = useRef<HTMLElement>(null);
  const first = useRef(true);
  /** Which way the last change went, so the animation knows whether it is a push or a pop. */
  const [direction, setDirection] = useState<'push' | 'pop'>('push');

  const commit = useCallback((next: NavigationPage[], way: 'push' | 'pop') => {
    setDirection(way);
    if (controlled === undefined) setOwn(next);
    onPagesChange?.(next);
  }, [controlled, onPagesChange]);

  const api = useMemo<StackApi>(() => ({
    push: page => commit([...pages, page], 'push'),
    pop: () => commit(pages.slice(0, -1), 'pop'),
    popToRoot: () => commit([], 'pop'),
    depth: pages.length + 1,
    canGoBack: pages.length > 0,
  }), [pages, commit]);

  const current = pages[pages.length - 1] ?? root;
  const previous = pages.length > 1 ? pages[pages.length - 2] : pages.length === 1 ? root : null;

  /**
   * Focus follows the screen. Not on the first render: focus belongs wherever the browser put
   * it, and moving it on load skips past whatever the page put before the content.
   */
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    mainRef.current?.focus({ preventScroll: true });
    mainRef.current?.scrollTo?.({ top: 0 });
  }, [current.key]);

  const back = previous && <GlassButton
    variant="plain" controlSize="small" className="lg-stack-back"
    /* The visible words are the destination; the spoken name says the direction too, because
       "Settings" on its own does not tell a screen-reader user that this goes back. */
    aria-label={`${strings.back} ${previous.title}`}
    onClick={() => api.pop()}>
    <LibraryIcon name="chevronForward" size={17} className="lg-stack-back-chevron" />
    {backLabel === 'title' && <span className="lg-stack-back-title">{previous.title}</span>}
  </GlassButton>;

  return <StackContext.Provider value={api}>
    <div {...props} ref={ref} className={cx('lg-stack', className)} data-depth={api.depth}>
      <NavigationBar
        title={current.title}
        subtitle={current.subtitle}
        leading={back}
        trailing={current.trailing}
        /* The root screen gets the large title; a screen you navigated into starts compact,
           because the back button is already naming where you came from on the same line. */
        largeTitle={pages.length === 0}
        headingLevel={headingLevel}
        aria-label={current.title} />
      <main
        ref={mainRef}
        id={`${generated}-screen`}
        tabIndex={-1}
        className="lg-stack-screen"
        data-direction={policy.reduceMotion ? 'none' : direction}
        /* Keyed on the screen: React replaces the subtree, which is what restarts the entry
           animation and what makes the outgoing screen's state go away rather than leak into
           the next one. */
        key={current.key}>
        {current.content}
      </main>
    </div>
  </StackContext.Provider>;
}
