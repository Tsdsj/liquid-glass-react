'use client';
import { useCallback, useId, useRef, type DialogHTMLAttributes, type ReactNode, type RefAttributes } from 'react';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { splitSurface } from '../system/props.js';
import { GlassIconButton } from '../controls/button.js';
import { SharedSurface } from '../system/surface.js';
import { LibraryIcon } from '../system/icon.js';
import { cx, useControllable } from '../system/utils.js';
import { triggerElement, type OpenProps } from './anchor.js';
import { useModalDialog } from './modal.js';
import { useGlassStrings } from '../system/strings.js';

/** `open` is the controlled state, not the `<dialog>` attribute — the element is opened with `showModal`. */
export interface GlassDialogProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'title' | 'children' | 'open'>, RefAttributes<HTMLDialogElement>, GlassSurfaceOptions, OpenProps {
  title: string; description: string; children: ReactNode;
  closeLabel?: string; dismissOnBackdrop?: boolean;
}

/**
 * A modal task on large glass, built on the native `<dialog>` so focus containment, the
 * top layer and Escape come from the platform rather than from a hand-rolled focus trap.
 *
 * Titles are bold and left-aligned, and the task is paired with a dimming layer because it
 * interrupts the main flow — parallel tasks get glass separation without the dim.
 */
export function GlassDialog({ trigger, open: controlled, defaultOpen = false, onOpenChange, title, description, children, className, style, closeLabel, dismissOnBackdrop = true, id: providedId, ref, ...rest }: GlassDialogProps) {
  const [surface, props] = splitSurface(rest);
  const strings = useGlassStrings();
  const generated = useId(); const id = providedId ?? generated; const triggerRef = useRef<HTMLButtonElement>(null);
  const downOutside = useRef(false);
  const [open, setOpen] = useControllable(controlled, defaultOpen, onOpenChange);
  const glass = useGlassSurface<HTMLDialogElement>({ ...surface, material: 'regular', size: 'large', radius: surface.radius ?? 28 }, ref);
  useModalDialog(open, glass.root, triggerRef);
  const outside = useCallback((x: number, y: number) => {
    const rect = glass.root.current?.getBoundingClientRect();
    return !!rect && (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom);
  }, [glass.root]);
  return <>
    {triggerElement(trigger, triggerRef, id, open, 'dialog', setOpen)}
    <dialog {...props} id={id} ref={glass.ref} aria-labelledby={`${id}-title`} aria-describedby={`${id}-desc`} {...glass.attributes} className={cx('lg-root lg-dialog', className)} style={{ ...glass.style, ...style }}
      onCancel={event => { event.preventDefault(); setOpen(false); }} onClose={() => { if (!glass.root.current?.open) setOpen(false); }}
      onPointerDown={event => { downOutside.current = event.target === event.currentTarget && outside(event.clientX, event.clientY); }}
      onClick={event => { if (dismissOnBackdrop && downOutside.current && event.target === event.currentTarget && outside(event.clientX, event.clientY)) setOpen(false); downOutside.current = false; }}>
      {glass.decoration}<div className="lg-content"><SharedSurface value={true}>
        <h2 id={`${id}-title`} className="lg-overlay-title">{title}</h2>
        <p id={`${id}-desc`} className="lg-overlay-description">{description}</p>
        <div className="lg-dialog-body">{children}</div>
        <GlassIconButton className="lg-dialog-close" aria-label={closeLabel ?? strings.close} variant="plain" onClick={() => setOpen(false)}>
          <LibraryIcon name="close" size={18} />
        </GlassIconButton>
      </SharedSurface></div>
    </dialog>
  </>;
}
