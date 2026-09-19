'use client';
import { useEffect, useId, useRef, type DialogHTMLAttributes, type RefAttributes } from 'react';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { splitSurface } from '../system/props.js';
import { GlassButton } from '../controls/button.js';
import { SharedSurface } from '../system/surface.js';
import { cx, useControllable } from '../system/utils.js';
import { lockScroll, triggerElement, type OpenProps } from './anchor.js';

export interface AlertAction {
  key: string;
  /** A verb in title case — "Delete", "Move to Trash". Never "OK" for something destructive. */
  label: string;
  onSelect?: () => void;
  /**
   * `cancel` is the safe way out and takes focus when a destructive action is present;
   * `destructive` renders red; `default` is the ordinary confirming action.
   */
  role?: 'default' | 'cancel' | 'destructive';
}
/** `open` is the controlled state, not the `<dialog>` attribute — the element is opened with `showModal`. */
export interface GlassAlertProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'title' | 'children' | 'open'>, RefAttributes<HTMLDialogElement>, GlassSurfaceOptions, OpenProps {
  title: string;
  /** One or two short sentences saying what happened and what happens next. */
  message?: string;
  actions: AlertAction[];
}

/**
 * A short, unavoidable decision. The title is bold and **left-aligned** — centred alert text
 * is the old design — and there are at most three actions.
 *
 * Reserve alerts for things the user must act on. A destructive action needs either this
 * (with a red action and Cancel focused) or an immediate Undo; routine information needs
 * neither, and marketing never belongs here.
 */
export function GlassAlert({ trigger, open: controlled, defaultOpen = false, onOpenChange, title, message, actions, className, style, id: providedId, ref, ...rest }: GlassAlertProps) {
  const [surface, props] = splitSurface(rest);
  if (actions.length === 0) throw new Error('GlassAlert requires at least one action');
  if (actions.length > 3) throw new RangeError('GlassAlert supports at most three actions; use an action sheet for longer lists');
  const generated = useId(); const id = providedId ?? generated; const triggerRef = useRef<HTMLButtonElement>(null); const restoreRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useControllable(controlled, defaultOpen, onOpenChange);
  const glass = useGlassSurface<HTMLDialogElement>({ ...surface, material: 'regular', size: 'large', radius: surface.radius ?? 26 }, ref);
  const hasDestructive = actions.some(action => action.role === 'destructive');
  useEffect(() => {
    const node = glass.root.current; if (!node) return;
    if (!open) { if (node.open) node.close(); return; }
    restoreRef.current = document.activeElement as HTMLElement | null;
    if (!node.open) node.showModal();
    // When something irreversible is on offer, the safe option is the one under the user's hands.
    const preferred = node.querySelector<HTMLButtonElement>(hasDestructive ? '[data-role="cancel"]' : '[data-role="default"]')
      ?? node.querySelector<HTMLButtonElement>('.lg-alert-action');
    preferred?.focus({ preventScroll: true });
    const unlock = lockScroll();
    return () => { if (node.open) node.close(); unlock(); const target = triggerRef.current ?? restoreRef.current; if (target?.isConnected) target.focus({ preventScroll: true }); };
  }, [open, glass.root, hasDestructive]);
  const run = (action: AlertAction) => { setOpen(false); action.onSelect?.(); };
  return <>
    {triggerElement(trigger, triggerRef, id, open, 'dialog', setOpen)}
    <dialog {...props} id={id} ref={glass.ref} role="alertdialog" aria-labelledby={`${id}-title`} aria-describedby={message ? `${id}-msg` : undefined}
      {...glass.attributes} className={cx('lg-root lg-dialog lg-alert', className)} style={{ ...glass.style, ...style }}
      onCancel={event => {
        event.preventDefault();
        // Escape means "get me out", so it runs the cancel action rather than silently closing.
        const cancel = actions.find(action => action.role === 'cancel');
        setOpen(false); cancel?.onSelect?.();
      }}>
      {glass.decoration}<div className="lg-content"><SharedSurface value={true}>
        <h2 id={`${id}-title`} className="lg-overlay-title lg-alert-title">{title}</h2>
        {message && <p id={`${id}-msg`} className="lg-overlay-description lg-alert-message">{message}</p>}
        <div className="lg-alert-actions" data-count={actions.length}>
          {actions.map(action => <GlassButton key={action.key} className="lg-alert-action" data-role={action.role ?? 'default'}
            variant={action.role === 'destructive' ? 'destructive' : action.role === 'cancel' ? 'gray' : 'tinted'}
            independent onClick={() => run(action)}>{action.label}</GlassButton>)}
        </div>
      </SharedSurface></div>
    </dialog>
  </>;
}
