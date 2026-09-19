'use client';
import { useId, useRef, type HTMLAttributes, type ReactNode, type RefAttributes } from 'react';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { splitSurface } from '../system/props.js';
import { useMediaQuery } from '../system/provider.js';
import { cx, useControllable } from '../system/utils.js';
import { triggerElement, usePopover, type Align, type OpenProps } from './anchor.js';

export interface ActionSheetItem {
  key: string;
  label: string;
  onSelect?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
}
export interface GlassActionSheetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'>, RefAttributes<HTMLDivElement>, GlassSurfaceOptions, OpenProps {
  /** Optional heading explaining what the choices apply to. */
  title?: string;
  message?: string;
  /** Keep this short — around six choices. A longer list is a menu or a list screen. */
  actions: ActionSheetItem[];
  cancelLabel?: string;
  onCancel?: () => void;
  'aria-label': string;
  align?: Align;
}

/**
 * A short list of choices that springs from the control that triggered it. Destructive
 * choices sit at the bottom of the list in red, and Cancel is separated from the rest so it
 * cannot be hit by accident.
 *
 * The rest of the interface stays interactive: this is a set of options, not a modal task.
 * On a phone it anchors to the bottom of the screen; on wider layouts it stays attached to
 * its source control.
 */
export function GlassActionSheet({
  trigger, open: controlled, defaultOpen = false, onOpenChange, title, message, actions,
  cancelLabel = 'Cancel', onCancel, 'aria-label': label, align = 'center', className, style, id: providedId, ref, ...rest
}: GlassActionSheetProps) {
  const [surface, props] = splitSurface(rest);
  const generated = useId(); const id = providedId ?? generated; const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useControllable(controlled, defaultOpen, onOpenChange);
  const wide = useMediaQuery('(min-width: 768px)');
  const glass = useGlassSurface<HTMLDivElement>({ ...surface, material: 'regular', size: 'large' }, ref);
  usePopover(open, setOpen, glass.root, triggerRef, align, true, wide ? 'auto' : 'above');
  const close = () => { setOpen(false); triggerRef.current?.focus(); };
  // Destructive choices are ordered last so a mis-tap lands on something recoverable.
  const ordered = [...actions].sort((a, b) => Number(!!a.destructive) - Number(!!b.destructive));
  return <>
    {triggerElement(trigger, triggerRef, id, open, 'menu', setOpen)}
    <div {...props} id={id} ref={glass.ref} popover="auto" role="menu" tabIndex={-1} aria-label={label}
      {...glass.attributes} className={cx('lg-root lg-action-sheet', className)} style={{ ...glass.style, ...style }}
      data-anchor={wide ? 'source' : 'bottom'}
      onKeyDown={event => {
        if (event.key === 'Escape') { event.preventDefault(); close(); onCancel?.(); return; }
        if (event.key === 'Tab') { close(); return; }
        const enabled = Array.from(glass.root.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? []);
        const index = enabled.indexOf(document.activeElement as HTMLButtonElement); if (!enabled.length) return;
        let next = index;
        if (event.key === 'ArrowDown') next = (index + 1) % enabled.length;
        else if (event.key === 'ArrowUp') next = (index - 1 + enabled.length) % enabled.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = enabled.length - 1;
        else return;
        event.preventDefault(); enabled[next]?.focus();
      }}>
      {glass.decoration}<div className="lg-content">
        {(title || message) && <div className="lg-sheet-heading" role="none">
          {title && <p className="lg-overlay-title">{title}</p>}
          {message && <p className="lg-overlay-description">{message}</p>}
        </div>}
        <div className="lg-action-list" role="none">
          {ordered.map(action => <button key={action.key} type="button" role="menuitem" tabIndex={-1}
            className="lg-action-item" data-destructive={action.destructive ? 'true' : undefined} disabled={action.disabled}
            onClick={() => { close(); action.onSelect?.(); }}>
            {action.icon && <span className="lg-action-icon" aria-hidden="true">{action.icon}</span>}
            {action.label}
          </button>)}
        </div>
        <button type="button" role="menuitem" tabIndex={-1} className="lg-action-cancel"
          onClick={() => { close(); onCancel?.(); }}>{cancelLabel}</button>
      </div>
    </div>
  </>;
}
