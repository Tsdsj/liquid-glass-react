'use client';
import { useCallback, useEffect, useId, useRef, type ReactNode } from 'react';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { GlassIconButton } from '../controls/button.js';
import { SharedSurface } from '../system/surface.js';
import { LibraryIcon } from '../system/icon.js';
import { cx, useControllable } from '../system/utils.js';
import { lockScroll, triggerElement, type OpenProps } from './anchor.js';

export interface GlassDialogProps extends GlassSurfaceOptions, OpenProps {
  title: string; description: string; children: ReactNode; className?: string;
  closeLabel?: string; dismissOnBackdrop?: boolean;
}

/**
 * A modal task on large glass, built on the native `<dialog>` so focus containment, the
 * top layer and Escape come from the platform rather than from a hand-rolled focus trap.
 *
 * Titles are bold and left-aligned, and the task is paired with a dimming layer because it
 * interrupts the main flow — parallel tasks get glass separation without the dim.
 */
export function GlassDialog({ trigger, open: controlled, defaultOpen = false, onOpenChange, title, description, children, className, closeLabel = 'Close', dismissOnBackdrop = true, ...surface }: GlassDialogProps) {
  const id = useId(); const triggerRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null); const downOutside = useRef(false);
  const [open, setOpen] = useControllable(controlled, defaultOpen, onOpenChange);
  const glass = useGlassSurface<HTMLDialogElement>({ ...surface, material: 'regular', size: 'large', radius: surface.radius ?? 28 });
  useEffect(() => {
    const node = glass.root.current; if (!node) return;
    if (!open) { if (node.open) node.close(); return; }
    restoreRef.current = document.activeElement as HTMLElement | null;
    if (!node.open) node.showModal();
    const unlock = lockScroll();
    return () => { if (node.open) node.close(); unlock(); const target = triggerRef.current ?? restoreRef.current; if (target?.isConnected) target.focus({ preventScroll: true }); };
  }, [open, glass.root]);
  const outside = useCallback((x: number, y: number) => {
    const rect = glass.root.current?.getBoundingClientRect();
    return !!rect && (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom);
  }, [glass.root]);
  return <>
    {triggerElement(trigger, triggerRef, id, open, 'dialog', setOpen)}
    <dialog id={id} ref={glass.ref} aria-labelledby={`${id}-title`} aria-describedby={`${id}-desc`} {...glass.attributes} className={cx('lg-root lg-dialog', className)} style={glass.style}
      onCancel={event => { event.preventDefault(); setOpen(false); }} onClose={() => { if (!glass.root.current?.open) setOpen(false); }}
      onPointerDown={event => { downOutside.current = event.target === event.currentTarget && outside(event.clientX, event.clientY); }}
      onClick={event => { if (dismissOnBackdrop && downOutside.current && event.target === event.currentTarget && outside(event.clientX, event.clientY)) setOpen(false); downOutside.current = false; }}>
      {glass.decoration}<div className="lg-content"><SharedSurface value={true}>
        <h2 id={`${id}-title`} className="lg-overlay-title">{title}</h2>
        <p id={`${id}-desc`} className="lg-overlay-description">{description}</p>
        <div className="lg-dialog-body">{children}</div>
        <GlassIconButton className="lg-dialog-close" aria-label={closeLabel} variant="plain" onClick={() => setOpen(false)}>
          <LibraryIcon name="close" size={18} />
        </GlassIconButton>
      </SharedSurface></div>
    </dialog>
  </>;
}
