'use client';
import { useId, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { SharedSurface } from '../system/surface.js';
import { cx, useControllable } from '../system/utils.js';
import { triggerElement, usePopover, type Align, type OpenProps } from './anchor.js';

export interface GlassPopoverProps extends GlassSurfaceOptions, OpenProps {
  title: string; children: ReactNode; description?: string; className?: string; align?: Align;
}

/**
 * A non-modal panel anchored to the control that opened it, on large glass. Escape closes it
 * and returns focus to the trigger; a click outside light-dismisses it.
 *
 * On a phone this pattern should become a sheet instead — a popover with an arrow pointing at
 * a control is an iPad and Mac idiom.
 */
export function GlassPopover({ trigger, open: controlled, defaultOpen = false, onOpenChange, title, description, children, align = 'end', className, ...surface }: GlassPopoverProps) {
  const id = useId(); const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useControllable(controlled, defaultOpen, onOpenChange);
  const glass = useGlassSurface<HTMLDivElement>({ ...surface, material: 'regular', size: 'large' });
  usePopover(open, setOpen, glass.root, triggerRef, align, false);
  return <>
    {triggerElement(trigger, triggerRef, id, open, 'dialog', setOpen)}
    <div popover="auto" id={id} ref={glass.ref} role="dialog" tabIndex={-1} aria-labelledby={`${id}-title`} aria-describedby={description ? `${id}-desc` : undefined}
      {...glass.attributes} className={cx('lg-root lg-popover', className)} style={glass.style}
      onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); setOpen(false); triggerRef.current?.focus(); } }}>
      {glass.decoration}<div className="lg-content"><SharedSurface value={true}>
        <h3 id={`${id}-title`} className="lg-overlay-title">{title}</h3>
        {description && <p id={`${id}-desc`} className="lg-overlay-description">{description}</p>}
        {children}
      </SharedSurface></div>
    </div>
  </>;
}

export function GlassMenuDescription(props: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={cx('lg-overlay-description', props.className)} />;
}
