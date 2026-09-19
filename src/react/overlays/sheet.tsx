'use client';
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type DialogHTMLAttributes, type ReactNode, type RefAttributes } from 'react';
import { createSpring } from '../../core/index.js';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { splitSurface } from '../system/props.js';
import { useGlassPolicy } from '../system/provider.js';
import { SharedSurface } from '../system/surface.js';
import { cx, useControllable } from '../system/utils.js';
import { lockScroll, triggerElement, type OpenProps } from './anchor.js';
import { useGlassStrings } from '../system/strings.js';

export type SheetDetent = 'medium' | 'large';
/** Fraction of the viewport each detent occupies. `large` stops just short of the top. */
const DETENT_FRACTION: Record<SheetDetent, number> = { medium: .5, large: .94 };
/** At or above this fraction the sheet is effectively full height: opaque, anchored to the edge. */
const FULL = .9;

/** `open` is the controlled state, not the `<dialog>` attribute — the element is opened with `showModal`. */
export interface GlassSheetProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'title' | 'children' | 'open'>, RefAttributes<HTMLDialogElement>, GlassSurfaceOptions, OpenProps {
  title: string;
  description?: string;
  children: ReactNode;
  /** Heights the sheet settles at. Ordered smallest first. */
  detents?: SheetDetent[];
  defaultDetent?: SheetDetent;
  onDetentChange?: (detent: SheetDetent) => void;
  /** The drag handle. Hide it only if the sheet has a single detent and cannot be dragged. */
  grabber?: boolean;
}

/**
 * A sheet that is inset from the display edge on glass and grows as it is dragged up,
 * becoming **opaque and anchored to the edge at full height** — translucency at full height
 * would just be a blurry app behind a wall of text.
 *
 * The drag is the point: the sheet tracks the finger 1:1 and settles on a spring at the
 * nearest detent, and it is interruptible mid-flight. Only `transform` moves, never `height`,
 * so the drag stays on the compositor.
 */
export function GlassSheet({
  trigger, open: controlled, defaultOpen = false, onOpenChange, title, description, children,
  detents = ['medium', 'large'], defaultDetent, onDetentChange, grabber = true, className, style, id: providedId, ref, ...rest
}: GlassSheetProps) {
  const [surface, props] = splitSurface(rest);
  const strings = useGlassStrings();
  if (detents.length === 0) throw new Error('GlassSheet requires at least one detent');
  const generated = useId(); const id = providedId ?? generated; const triggerRef = useRef<HTMLButtonElement>(null); const restoreRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useControllable(controlled, defaultOpen, onOpenChange);
  const [detent, setDetent] = useControllable(undefined, defaultDetent ?? detents[0], onDetentChange);
  const policy = useGlassPolicy();
  const glass = useGlassSurface<HTMLDialogElement>({ ...surface, material: 'regular', size: 'large', radius: surface.radius ?? 38 }, ref);
  const fractions = detents.map(name => DETENT_FRACTION[name]);
  const [full, setFull] = useState(DETENT_FRACTION[detent] >= FULL);
  const spring = useRef<ReturnType<typeof createSpring> | null>(null);

  /** One writer for the visible fraction, so the drag and the spring cannot fight each other. */
  const paint = useCallback((fraction: number) => {
    const node = glass.root.current; if (!node) return;
    node.style.setProperty('--lg-sheet-offset', `${((1 - fraction) * 100).toFixed(3)}%`);
    setFull(fraction >= FULL);
  }, [glass.root]);

  useEffect(() => {
    const node = glass.root.current; if (!node) return;
    if (!open) { if (node.open) node.close(); return; }
    restoreRef.current = document.activeElement as HTMLElement | null;
    if (!node.open) node.showModal();
    paint(DETENT_FRACTION[detent]);
    const unlock = lockScroll();
    return () => { if (node.open) node.close(); unlock(); const target = triggerRef.current ?? restoreRef.current; if (target?.isConnected) target.focus({ preventScroll: true }); };
    // `detent` is intentionally not a dependency: re-running this on every detent change would
    // close and reopen the dialog mid-drag.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, glass.root, paint]);

  useEffect(() => { if (open) paint(DETENT_FRACTION[detent]); }, [detent, open, paint]);

  /**
   * The drag.
   *
   * The whole panel is the handle, not just the little bar at the top — that is what the
   * system does, and the rule it uses is about the scroll position rather than about which
   * element was touched. A gesture that starts in the body belongs to the sheet only while
   * the content is scrolled to the top, and even then only in the direction that does not
   * have somewhere else to go: downwards always, upwards only while there is a taller detent
   * left to grow into. Once the sheet is at its tallest, pulling up is the user reading, and
   * a sheet that took that gesture would make its own content unreachable.
   *
   * Nothing here calls `preventDefault` or captures the pointer before the direction is known,
   * so buttons and fields inside the sheet keep working: a body-wide handler that swallowed
   * `pointerdown` would break every control in the panel, which is worse than the bug it fixes.
   */
  useEffect(() => {
    const node = glass.root.current;
    if (!node || !open) return;
    const handle = node.querySelector<HTMLElement>('.lg-sheet-grabber');
    const scroller = node.querySelector<HTMLElement>('.lg-sheet-scroll');
    /** Movement, in px, before a gesture is called vertical or horizontal. */
    const SLOP = 6;
    let active = false, startY = 0, startX = 0, startFraction = 0, height = 1, pointer = -1, frame = 0, latest = 0;
    /** `false` until the gesture has committed to the sheet; the grabber commits immediately. */
    let owned = false;
    const settle = (fraction: number) => {
      // Nearest detent wins; below the smallest one the gesture is a dismissal.
      if (fraction < fractions[0] * .6) { setOpen(false); return; }
      const nearest = fractions.reduce((best, value) => Math.abs(value - fraction) < Math.abs(best - fraction) ? value : best, fractions[0]);
      const name = detents[fractions.indexOf(nearest)];
      if (policy.reduceMotion) { paint(nearest); setDetent(name); return; }
      spring.current?.stop();
      const animation = createSpring(fraction, paint, { stiffness: 260, damping: 26 });
      spring.current = animation;
      animation.to(nearest);
      setDetent(name);
    };
    /** Does a gesture from the body, moving this way, belong to the sheet or to the content? */
    const claim = (dy: number) => {
      if (!scroller) return true;
      if (scroller.scrollTop > 0) return false;             // the content is the scroll view's
      if (dy > 0) return true;                              // pulling down from the top
      return startFraction < Math.max(...fractions) - .01;  // pulling up, with room left to grow
    };
    const detach = () => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
    const move = (event: PointerEvent) => {
      if (!active || event.pointerId !== pointer) return;
      const dy = event.clientY - startY, dx = event.clientX - startX;
      if (!owned) {
        if (Math.abs(dy) < SLOP && Math.abs(dx) < SLOP) return;
        // A sideways gesture is not a sheet gesture; neither is one the content has a use for.
        if (Math.abs(dx) > Math.abs(dy) || !claim(dy)) { active = false; pointer = -1; detach(); return; }
        owned = true;
        node.setAttribute('data-dragging', 'true');
      }
      latest = startFraction - dy / height;
      cancelAnimationFrame(frame);
      // Rubber-band past the top so the sheet never detaches from the finger.
      frame = requestAnimationFrame(() => paint(Math.min(1, Math.max(.04, latest > 1 ? 1 + (latest - 1) * .2 : latest))));
    };
    const end = () => {
      if (!active) return;
      const committed = owned;
      active = false; owned = false; pointer = -1; cancelAnimationFrame(frame);
      node.removeAttribute('data-dragging');
      detach();
      if (committed) settle(Math.min(1, Math.max(.04, latest)));
    };
    const begin = (event: PointerEvent, immediate: boolean) => {
      if (event.button !== 0 || !event.isPrimary || active) return;
      spring.current?.stop();
      // Measured once at gesture start; reading layout inside pointermove is what drops frames.
      height = window.innerHeight || 1;
      const offset = parseFloat(getComputedStyle(node).getPropertyValue('--lg-sheet-offset')) || 0;
      startFraction = 1 - offset / 100;
      latest = startFraction;
      startY = event.clientY; startX = event.clientX; active = true; pointer = event.pointerId;
      owned = immediate;
      if (immediate) node.setAttribute('data-dragging', 'true');
      window.addEventListener('pointermove', move, { passive: true });
      window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end);
    };
    /* The grabber has nothing else the gesture could mean, so it commits at once. The body
       waits to see where the finger goes. */
    const onHandle = (event: PointerEvent) => begin(event, true);
    const onBody = (event: PointerEvent) => { if (!handle?.contains(event.target as Node)) begin(event, false); };
    handle?.addEventListener('pointerdown', onHandle);
    node.addEventListener('pointerdown', onBody);
    return () => {
      handle?.removeEventListener('pointerdown', onHandle);
      node.removeEventListener('pointerdown', onBody);
      end(); spring.current?.stop();
    };
  }, [open, glass.root, detents.join(), fractions.join(), policy.reduceMotion, paint, setDetent, setOpen]);

  return <>
    {triggerElement(trigger, triggerRef, id, open, 'dialog', setOpen)}
    <dialog {...props} id={id} ref={glass.ref} aria-labelledby={`${id}-title`} aria-describedby={description ? `${id}-desc` : undefined}
      {...glass.attributes} className={cx('lg-root lg-sheet', className)} data-full={full ? 'true' : undefined}
      style={{ '--lg-sheet-offset': `${(1 - DETENT_FRACTION[detent]) * 100}%`, ...glass.style, ...style } as CSSProperties}
      onCancel={event => { event.preventDefault(); setOpen(false); }}
      onClose={() => { if (!glass.root.current?.open) setOpen(false); }}>
      {glass.decoration}
      <div className="lg-content">
        <SharedSurface value={true}>
          {grabber && detents.length > 1 && <div className="lg-sheet-grabber" role="slider" tabIndex={0}
            aria-label={strings.sheetHeight(title)} aria-valuetext={detent}
            aria-valuenow={fractions.indexOf(DETENT_FRACTION[detent])} aria-valuemin={0} aria-valuemax={detents.length - 1}
            onKeyDown={event => {
              const index = detents.indexOf(detent);
              if (event.key === 'ArrowUp' && index < detents.length - 1) { event.preventDefault(); setDetent(detents[index + 1]); }
              else if (event.key === 'ArrowDown') { event.preventDefault(); if (index > 0) setDetent(detents[index - 1]); else setOpen(false); }
            }}><span aria-hidden="true" /></div>}
          <div className="lg-sheet-scroll">
            <h2 id={`${id}-title`} className="lg-overlay-title">{title}</h2>
            {description && <p id={`${id}-desc`} className="lg-overlay-description">{description}</p>}
            {children}
          </div>
        </SharedSurface>
      </div>
    </dialog>
  </>;
}
