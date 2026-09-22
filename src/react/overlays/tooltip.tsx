'use client';
import {
  cloneElement, useEffect, useId, useRef, useState,
  type HTMLAttributes, type ReactElement, type ReactNode, type Ref, type RefAttributes,
} from 'react';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { splitSurface } from '../system/props.js';
import { assignRef, cx } from '../system/utils.js';

type AnchorProps = HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> };

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'content'>,
  RefAttributes<HTMLDivElement>, GlassSurfaceOptions {
  /**
   * What the control does, starting with a verb — "Restore default settings". Not an
   * explanation of how a standard control works: that is the platform's job, not this one's.
   */
  content: ReactNode;
  /** The control it describes. Cloned, not wrapped, so nothing changes about its layout. */
  children: ReactElement<AnchorProps>;
  /** Milliseconds of hover before it appears. Focus shows it immediately. */
  delay?: number;
  placement?: 'above' | 'below';
}

/** One at a time, and the second one replaces the first rather than joining it. */
let openTooltip: symbol | null = null;

/**
 * The name of an icon-only control, shown to the people who cannot hear it.
 *
 * An `aria-label` tells a screen reader what a button does. It tells a sighted mouse user
 * nothing at all — they are left guessing from a glyph. This is the other half of that: the
 * same words, on screen, after a pause long enough that moving the pointer across a toolbar
 * does not set off a row of them.
 *
 * Three rules it will not break:
 *
 * - **Never on touch.** There is no hover on a touch screen, so a tooltip there can only be a
 *   thing that appears on tap and swallows the tap that was meant for the button. The whole
 *   component renders nothing under `(pointer: coarse)`.
 * - **Never the only source of the name.** It attaches with `aria-describedby`, which is
 *   supplementary. The control still needs its own accessible name, and this does not provide
 *   one — a tooltip is help, not a label.
 * - **Never in the way of the keyboard.** Focus shows it at once with no delay, and Escape
 *   dismisses it without closing anything else.
 */
export function Tooltip({
  content, children, delay = 600, placement = 'above', className, style, id: providedId, ref, ...rest
}: TooltipProps) {
  const [surface, props] = splitSurface(rest);
  const generated = useId(); const id = providedId ?? `${generated}-tip`;
  const anchor = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const token = useRef(Symbol('tooltip'));
  const glass = useGlassSurface<HTMLDivElement>({ ...surface, material: 'regular', size: 'small' }, ref);

  /**
   * Hover exists or it does not; there is no useful middle. Read once per mount rather than
   * subscribed, because a pointer type does not change under a running page — and if it does,
   * the user has picked up a mouse and will hover again.
   */
  const [hoverable, setHoverable] = useState(false);
  useEffect(() => { setHoverable(window.matchMedia('(hover: hover) and (pointer: fine)').matches); }, []);

  /**
   * Set when the control is pressed, cleared when the pointer leaves it or focus does.
   *
   * Dismissing on press is not enough on its own: a press is immediately followed by the
   * control taking focus, and it can be followed by the pointer being re-delivered to the same
   * element, either of which asks for the tooltip again while the finger has not moved. CI on
   * Linux caught the result — pressing a control put its own help back on screen and left it
   * there — and it could not be reproduced on macOS, so what is written here is the rule
   * rather than the trigger: **after you press it, it stays shut until you leave and come
   * back.** That is what the desktop platforms do, and it cannot be got wrong by whatever the
   * next engine decides to dispatch after a click.
   */
  const pressed = useRef(false);
  const cancel = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } };
  const hide = () => { cancel(); if (openTooltip === token.current) openTooltip = null; setOpen(false); };
  const show = (after: number) => {
    if (pressed.current) return;
    cancel();
    timer.current = setTimeout(() => { openTooltip = token.current; setOpen(true); }, after);
  };
  useEffect(() => cancel, []);

  /* Escape closes it, wherever the focus is — a tooltip is not modal, so it has no key
     handling of its own and has to listen while it is open. */
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') hide(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  /** Positioned against the anchor, like the other overlays, but never focused. */
  useEffect(() => {
    const panel = glass.root.current, target = anchor.current;
    if (!open || !panel || !target) return;
    if (typeof panel.showPopover !== 'function') { setOpen(false); return; }
    if (!panel.matches(':popover-open')) panel.showPopover();
    let frame = 0;
    const position = () => {
      const rect = target.getBoundingClientRect();
      const width = panel.offsetWidth, height = panel.offsetHeight;
      const above = rect.top - height - 8, below = rect.bottom + 8;
      const top = placement === 'below'
        ? (below + height <= innerHeight - 8 ? below : Math.max(8, above))
        : (above >= 8 ? above : below);
      panel.style.left = `${Math.max(8, Math.min(rect.left + (rect.width - width) / 2, innerWidth - width - 8))}px`;
      panel.style.top = `${top}px`;
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(position); };
    position();
    const resize = new ResizeObserver(schedule); resize.observe(panel); resize.observe(target);
    window.addEventListener('resize', schedule); window.addEventListener('scroll', schedule, true);
    return () => {
      resize.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener('resize', schedule); window.removeEventListener('scroll', schedule, true);
      if (panel.matches(':popover-open')) panel.hidePopover();
    };
  }, [open, glass.root, placement]);

  // No hover, no tooltip — and no wrapper, no attribute, nothing. The control is untouched.
  if (!hoverable) return children;

  const anchored = cloneElement(children, {
    ref: node => {
      const outer = assignRef(children.props.ref, node);
      anchor.current = node;
      return () => {
        if (typeof outer === 'function') outer(); else assignRef(children.props.ref, null);
        anchor.current = null;
      };
    },
    /* `aria-describedby`, never `aria-labelledby`: this is help about a control that already
       has a name. Pointing the name at a node that only exists on hover would leave the
       control nameless the rest of the time. */
    'aria-describedby': open ? cx(children.props['aria-describedby'], id) : children.props['aria-describedby'],
    onPointerEnter: event => { children.props.onPointerEnter?.(event); show(delay); },
    onPointerLeave: event => { children.props.onPointerLeave?.(event); pressed.current = false; hide(); },
    onPointerDown: event => { children.props.onPointerDown?.(event); pressed.current = true; hide(); },
    /**
     * Focus is deliberate, so it does not wait: a keyboard user asked for this control.
     *
     * `:focus-visible`, not focus — because a click focuses the control too, on every platform
     * except the one this was written on. macOS does not focus a button on mouse-down, so
     * `onFocus` there really did mean "tabbed here"; on Windows and Linux the click that had
     * just dismissed the tooltip immediately focused the button and put it straight back on
     * screen, where it sat until the pointer left. Found by CI on Linux, which is the only
     * place in this project that runs a non-Apple pointer.
     */
    onFocus: event => {
      children.props.onFocus?.(event);
      if (event.target === anchor.current && anchor.current?.matches(':focus-visible')) show(0);
    },
    onBlur: event => { children.props.onBlur?.(event); pressed.current = false; hide(); },
  });

  return <>
    {anchored}
    <div {...props} id={id} ref={glass.ref} popover="manual" role="tooltip" {...glass.attributes}
      className={cx('lg-root lg-tooltip', className)} style={{ ...glass.style, ...style }}>
      {glass.decoration}<div className="lg-content">{content}</div>
    </div>
  </>;
}
