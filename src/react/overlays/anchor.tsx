'use client';
import { cloneElement, useEffect, useRef, type ButtonHTMLAttributes, type ReactElement, type Ref, type RefObject } from 'react';
import { assignRef, focusable } from '../system/utils.js';

export type TriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & { ref?: Ref<HTMLButtonElement> };
export interface OpenProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactElement<TriggerProps>;
}
export type Align = 'start' | 'center' | 'end';

/** Wires the caller's own button up as the opener without taking its props away from it. */
export function triggerElement(
  trigger: ReactElement<TriggerProps> | undefined, ref: Ref<HTMLButtonElement>, id: string,
  open: boolean, kind: 'dialog' | 'menu', setOpen: (value: boolean) => void,
) {
  if (!trigger) return null;
  return cloneElement(trigger, {
    'aria-haspopup': kind, 'aria-expanded': open, 'aria-controls': id,
    ref: node => {
      const originalCleanup = assignRef(trigger.props.ref, node), localCleanup = assignRef(ref, node);
      return () => {
        if (typeof originalCleanup === 'function') originalCleanup(); else assignRef(trigger.props.ref, null);
        if (typeof localCleanup === 'function') localCleanup(); else assignRef(ref, null);
      };
    },
    onClick: event => { trigger.props.onClick?.(event); if (!event.defaultPrevented) setOpen(!open); },
  });
}

/**
 * Native top-layer popover with controlled React state and bounded anchor positioning.
 *
 * The panel grows out of the control that opened it and stays anchored to it — menus,
 * popovers and action sheets morph from their source rather than appearing from nowhere,
 * so the origin is projected onto the panel box every time it is repositioned.
 */
export function usePopover(
  open: boolean, setOpen: (value: boolean) => void,
  panel: RefObject<HTMLDivElement | null>, trigger: RefObject<HTMLButtonElement | null>,
  align: Align, menu: boolean, placement: 'below' | 'above' | 'auto' = 'auto',
) {
  const onChange = useRef(setOpen); onChange.current = setOpen;
  useEffect(() => {
    const node = panel.current; if (!node) return;
    const toggled = (event: Event) => onChange.current((event as Event & { newState: string }).newState === 'open');
    node.addEventListener('toggle', toggled);
    return () => node.removeEventListener('toggle', toggled);
  }, [panel]);
  useEffect(() => {
    const node = panel.current; if (!node) return;
    if (!open) { if (node.matches(':popover-open')) node.hidePopover(); return; }
    if (typeof node.showPopover !== 'function') { onChange.current(false); return; }
    if (!node.matches(':popover-open')) node.showPopover();
    let frame = 0;
    const position = () => {
      const rect = trigger.current?.getBoundingClientRect();
      if (!rect) { node.style.left = `${Math.max(16, (innerWidth - node.offsetWidth) / 2)}px`; node.style.top = '96px'; return; }
      const width = node.offsetWidth, height = node.offsetHeight;
      /**
       * `start` and `end` are leading and trailing, not left and right: in an RTL document the
       * trailing edge is the left one. Resolve against the trigger's own direction rather than
       * the document's, so a single RTL subtree inside an LTR page anchors correctly too.
       */
      const rtl = getComputedStyle(trigger.current!).direction === 'rtl';
      const edge = align === 'center' ? 'center' : (align === 'end') !== rtl ? 'right' : 'left';
      const x = edge === 'right' ? rect.right - width : edge === 'center' ? rect.left + (rect.width - width) / 2 : rect.left;
      const below = rect.bottom + 10, above = rect.top - height - 10;
      const fitsBelow = below + height <= innerHeight - 16;
      const top = placement === 'above' ? Math.max(16, above)
        : placement === 'below' ? below
        : fitsBelow ? below : Math.max(16, above);
      const left = Math.max(16, Math.min(x, innerWidth - width - 16));
      const resolvedTop = Math.min(top, Math.max(16, innerHeight - height - 16));
      node.style.left = `${left}px`;
      node.style.top = `${resolvedTop}px`;
      // Grow out of the trigger: the transform origin is the trigger centre projected onto the panel box.
      const originX = Math.max(0, Math.min(100, (rect.left + rect.width / 2 - left) / width * 100));
      node.style.setProperty('--lg-origin-x', `${originX}%`);
      node.style.setProperty('--lg-origin-y', resolvedTop >= rect.bottom ? '0%' : '100%');
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(position); };
    position();
    const first = menu ? node.querySelector<HTMLElement>('[role="menuitem"]:not(:disabled)') : focusable(node)[0];
    (first ?? node).focus({ preventScroll: true });
    const resize = new ResizeObserver(schedule); resize.observe(node); if (trigger.current) resize.observe(trigger.current);
    window.addEventListener('resize', schedule); window.addEventListener('scroll', schedule, true);
    return () => { resize.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('resize', schedule); window.removeEventListener('scroll', schedule, true); };
  }, [open, panel, trigger, align, menu, placement]);
}

let scrollLocks = 0; let previousOverflow = '';
/** Reference-counted, so nested modals do not release the page scroll too early. */
export function lockScroll() {
  if (scrollLocks++ === 0) { previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; }
  return () => { if (--scrollLocks === 0) document.body.style.overflow = previousOverflow; };
}
