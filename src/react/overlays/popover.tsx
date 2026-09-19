'use client';
import { useId, useRef, type HTMLAttributes, type ReactNode, type RefAttributes } from 'react';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { splitSurface } from '../system/props.js';
import { SharedSurface } from '../system/surface.js';
import { cx, useControllable } from '../system/utils.js';
import { triggerElement, usePopover, type Align, type OpenProps } from './anchor.js';
import { useSizeClass } from '../system/size-class.js';

/**
 * `title` is the panel's heading, not the HTML tooltip. An `id` is accepted and becomes the
 * base the internal `-title` / `-desc` ids are derived from, so the ARIA wiring still holds
 * together — that is why it is taken rather than ignored.
 */
export interface GlassPopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'>, RefAttributes<HTMLDivElement>, GlassSurfaceOptions, OpenProps {
  title: string; children: ReactNode; description?: string; align?: Align;
  /** Where the panel opens relative to its trigger. `auto` flips up when there is no room below. */
  placement?: 'below' | 'above' | 'auto';
}

/**
 * A non-modal panel anchored to the control that opened it, on large glass, with an arrow
 * pointing as directly as it can at that control. Escape closes it and returns focus to the
 * trigger; a click outside light-dismisses it.
 *
 * A popover with an arrow is an iPad and Mac idiom, so in a compact environment it presents
 * as a bottom sheet instead — full width, pinned to the bottom edge, no arrow, because an
 * arrow from the bottom of the screen to a control halfway up it points at nothing. The
 * content, the roles and the keyboard path are the same either way; only the shape changes.
 */
export function GlassPopover({ trigger, open: controlled, defaultOpen = false, onOpenChange, title, description, children, align = 'end', placement = 'auto', className, style, id: providedId, ref, ...rest }: GlassPopoverProps) {
  const [surface, props] = splitSurface(rest);
  const generated = useId(); const id = providedId ?? generated; const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useControllable(controlled, defaultOpen, onOpenChange);
  const compact = useSizeClass() === 'compact';
  const glass = useGlassSurface<HTMLDivElement>({ ...surface, material: 'regular', size: 'large' }, ref);
  usePopover(open, setOpen, glass.root, triggerRef, align, false, placement, compact ? 'bottom' : 'source');
  return <>
    {triggerElement(trigger, triggerRef, id, open, 'dialog', setOpen)}
    <div {...props} popover="auto" id={id} ref={glass.ref} role="dialog" tabIndex={-1} aria-labelledby={`${id}-title`} aria-describedby={description ? `${id}-desc` : undefined}
      {...glass.attributes} className={cx('lg-root lg-popover', className)} style={{ ...glass.style, ...style }}
      data-anchor={compact ? 'bottom' : 'source'}
      onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); setOpen(false); triggerRef.current?.focus(); } }}>
      {glass.decoration}<div className="lg-content"><SharedSurface value={true}>
        <h3 id={`${id}-title`} className="lg-overlay-title">{title}</h3>
        {description && <p id={`${id}-desc`} className="lg-overlay-description">{description}</p>}
        {children}
      </SharedSurface></div>
    </div>
  </>;
}

export interface GlassMenuDescriptionProps extends HTMLAttributes<HTMLParagraphElement>, RefAttributes<HTMLParagraphElement> {}
export function GlassMenuDescription({ className, ref, ...props }: GlassMenuDescriptionProps) {
  return <p {...props} ref={ref} className={cx('lg-overlay-description', className)} />;
}
