'use client';
import {
  useId, useState,
  type CSSProperties, type HTMLAttributes, type KeyboardEvent, type PointerEvent, type ReactNode, type RefAttributes,
} from 'react';
import { cx, useControllable, useMeasureEffect } from '../system/utils.js';
import { useGlassStrings } from '../system/strings.js';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { SharedSurface } from '../system/surface.js';
import { splitSurface } from '../system/props.js';
import { LibraryIcon } from '../system/icon.js';

export interface PanelPoint { x: number; y: number }

export interface PanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onDrag'>, RefAttributes<HTMLDivElement>, GlassSurfaceOptions {
  /** A short noun or noun phrase, title case — "Inspector", "Colors", "Find and Replace". */
  title: string;
  children: ReactNode;
  /** Whether the panel is on screen. Uncontrolled panels start open. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Rolled up to its title bar. The panel stays where it is and keeps its place on screen. */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Offset from the top-leading corner of the positioned ancestor it lives in. */
  position?: PanelPoint;
  defaultPosition?: PanelPoint;
  onPositionChange?: (position: PanelPoint) => void;
  /** Panels are sized by their content and by this; they are not resizable by a drag. */
  width?: number;
  /** Adds a close button to the title bar. Without it the panel has no way to dismiss itself. */
  onClose?: () => void;
  /** Extra controls at the trailing end of the title bar, before collapse and close. */
  accessory?: ReactNode;
}

const STEP = 8, BIG_STEP = 40;

/**
 * A small window that floats above the content, holding controls for whatever is selected.
 *
 * From the HIG's panels page:
 *
 * - **It floats above the window and is not modal.** Nothing behind it is disabled, there is no
 *   backdrop and no focus trap — the whole point is to adjust something and watch the result.
 *   That also settles the `role`: a non-modal `dialog`, which is what the panel is, rather than
 *   the modal one `GlassDialog` uses.
 * - **"It needs a title bar so people can position it where they want."** So the title bar is
 *   the handle, and — because a panel that can only be moved with a mouse cannot be moved by
 *   everyone — the handle takes focus and answers the arrow keys, the same bargain the split
 *   view's divider makes.
 * - **"Prefer simple adjustment controls."** Sliders and steppers over text fields: a panel is
 *   for turning things, not for filling in forms. Guidance for the caller, not something this
 *   component can enforce.
 * - **"Avoid making a panel's minimize button available."** There is no minimize. `collapsed`
 *   rolls it up to its title bar, which is the thing Apple's own panels do and is not the same
 *   as sending it to the Dock.
 *
 * **HUD style is deliberately not here.** The HIG allows a dark translucent panel for
 * media-heavy apps and then spends a paragraph on when not to: most system controls do not
 * match it, and it does not follow the appearance setting. A `variant="hud"` would be a prop
 * whose documentation is mostly a warning. `material="clear"` over a photograph is the same
 * idea, reachable, and already carries the dimming rule with it.
 *
 * Positioned absolutely inside the nearest positioned ancestor, so a panel belongs to a region
 * of the application rather than to the viewport. Give that ancestor `position: relative`.
 */
export function Panel({
  title, children,
  open: controlledOpen, defaultOpen = true, onOpenChange,
  collapsed: controlledCollapsed, defaultCollapsed = false, onCollapsedChange,
  position: controlledPosition, defaultPosition = { x: 24, y: 24 }, onPositionChange,
  width = 280, onClose, accessory,
  className, style, ref, ...rest
}: PanelProps) {
  const [surface, props] = splitSurface(rest);
  const strings = useGlassStrings();
  const generated = useId();
  const [open, setOpen] = useControllable(controlledOpen, defaultOpen, onOpenChange);
  const [collapsed, setCollapsed] = useControllable(controlledCollapsed, defaultCollapsed, onCollapsedChange);
  const [point, setPoint] = useControllable(controlledPosition, defaultPosition, onPositionChange);
  const [moving, setMoving] = useState(false);
  const glass = useGlassSurface<HTMLDivElement>({ radius: 18, ...surface, material: surface.material ?? 'regular', size: 'large' }, ref);
  const glassNode = glass.root;

  /**
   * Clamped to the container it lives in, so a panel cannot be dragged out of reach.
   *
   * Measured at the start of each drag rather than held in state: the container can be resized
   * while the panel sits there, and a bound captured on mount would be a bound for a window
   * that no longer exists.
   */
  const boundsOf = () => {
    const self = glassNode.current;
    const parent = self?.offsetParent as HTMLElement | null;
    if (!self) return null;
    const width = self.offsetWidth, height = self.offsetHeight;
    const room = parent
      ? { w: parent.clientWidth, h: parent.clientHeight }
      : { w: typeof window === 'undefined' ? width : window.innerWidth, h: typeof window === 'undefined' ? height : window.innerHeight };
    /* A panel taller than its container still has to have somewhere to go: the maximum is
       floored at the minimum rather than left negative, which would pin it to the bottom. */
    return { maxX: Math.max(0, room.w - width), maxY: Math.max(0, room.h - height) };
  };
  const clamp = (next: PanelPoint): PanelPoint => {
    const bounds = boundsOf();
    if (!bounds) return next;
    return {
      x: Math.min(bounds.maxX, Math.max(0, Math.round(next.x))),
      y: Math.min(bounds.maxY, Math.max(0, Math.round(next.y))),
    };
  };

  /**
   * And clamped when it arrives, not only when it is dragged.
   *
   * `defaultPosition` is a guess made before anything has been measured — the caller does not
   * know how wide the container will be, and on a phone it is routinely narrower than the
   * offset the panel was given. Without this the panel opens half outside its frame, where it
   * is clipped by the container's overflow and cannot be dragged back because the title bar is
   * the part that is gone. Re-run on resize for the same reason.
   */
  useMeasureEffect(() => {
    if (!open) return;
    const node = glassNode.current;
    if (!node) return;
    const settle = () => {
      const next = clamp(point);
      if (next.x !== point.x || next.y !== point.y) setPoint(next);
    };
    settle();
    const parent = node.offsetParent as HTMLElement | null;
    if (!parent || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(settle);
    observer.observe(parent);
    return () => observer.disconnect();
  });

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !event.isPrimary) return;
    /* A press on the collapse or close button is a press on that button. */
    if ((event.target as HTMLElement).closest('button')) return;
    const origin = { x: event.clientX, y: event.clientY };
    const from = point;
    event.currentTarget.setPointerCapture(event.pointerId);
    setMoving(true);
    let frame = 0;
    const move = (moveEvent: globalThis.PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setPoint(clamp({
        x: from.x + (moveEvent.clientX - origin.x),
        y: from.y + (moveEvent.clientY - origin.y),
      })));
    };
    const end = () => {
      cancelAnimationFrame(frame);
      setMoving(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? BIG_STEP : STEP;
    const moves: Record<string, PanelPoint> = {
      ArrowLeft: { x: point.x - step, y: point.y },
      ArrowRight: { x: point.x + step, y: point.y },
      ArrowUp: { x: point.x, y: point.y - step },
      ArrowDown: { x: point.x, y: point.y + step },
    };
    const next = moves[event.key];
    if (next) { setPoint(clamp(next)); event.preventDefault(); return; }
    if (event.key === 'Escape' && onClose) { onClose(); event.preventDefault(); }
  };

  if (!open) return null;

  return <div {...props} ref={glass.ref} {...glass.attributes}
    className={cx('lg-root lg-panel', className)}
    role="dialog" aria-modal="false" aria-labelledby={`${generated}-title`}
    data-collapsed={collapsed ? 'true' : undefined} data-moving={moving ? 'true' : undefined}
    style={{ ...glass.style, insetInlineStart: `${point.x}px`, insetBlockStart: `${point.y}px`, width: `${width}px`, ...style } as CSSProperties}>
    {glass.decoration}
    {/* The handle is a `separator`-less thing: it moves a window rather than resizing a pane,
        and there is no ARIA role for that. So it is a focusable group with an accessible name
        that says what the arrows will do, which is the part that has to reach the reader. */}
    <div className="lg-panel-bar" tabIndex={0} role="group" aria-label={strings.movePanel(title)}
      onPointerDown={startDrag} onKeyDown={onKeyDown}>
      <span className="lg-panel-title" id={`${generated}-title`}>{title}</span>
      {accessory && <span className="lg-panel-accessory">{accessory}</span>}
      <button type="button" className="lg-panel-action" aria-expanded={!collapsed}
        aria-label={collapsed ? strings.expandPanel(title) : strings.collapsePanel(title)}
        onClick={() => setCollapsed(!collapsed)}>
        <LibraryIcon name="chevronDown" size={14} className="lg-panel-chevron" />
      </button>
      {onClose && <button type="button" className="lg-panel-action" aria-label={strings.close}
        onClick={() => { setOpen(false); onClose(); }}>
        <LibraryIcon name="close" size={14} />
      </button>}
    </div>
    {/**
      * The body shares the panel's glass, the way every other glass container that holds a
      * caller's content already did — dialog, sheet, popover, alert, toast, banner, palette.
      * The panel was the one that did not, and nothing had caught it because the only panel in
      * the repository held sliders, whose tracks are content layer. Put a button in one and it
      * grew a second pane of glass on top of the first, which is the rule the material breaks
      * first and most visibly.
      */}
    <SharedSurface value={true}>
      <div className="lg-panel-body" hidden={collapsed}>{children}</div>
    </SharedSurface>
  </div>;
}
