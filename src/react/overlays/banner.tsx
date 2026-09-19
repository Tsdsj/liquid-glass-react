'use client';
import { useEffect, useRef, type HTMLAttributes, type ReactNode, type RefAttributes } from 'react';
import { GlassButton, GlassIconButton } from '../controls/button.js';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { splitSurface } from '../system/props.js';
import { SharedSurface } from '../system/surface.js';
import { LibraryIcon, type LibraryIconName } from '../system/icon.js';
import { useGlassStrings } from '../system/strings.js';
import { attachPull } from '../system/pull.js';
import { useGlassPolicy } from '../system/provider.js';
import { cx } from '../system/utils.js';

/**
 * What the banner is reporting. The glyphs match `ToastTone`'s on purpose: the same outcome
 * should not be a tick in one place and something else in another.
 */
export type BannerTone = 'info' | 'success' | 'warning' | 'error';

const TONE_ICON: Record<BannerTone, LibraryIconName | null> = {
  info: null, success: 'checkmark', warning: 'minus', error: 'close',
};

/** Past this far up, the release is a dismissal rather than a fidget. */
const DISMISS_TRAVEL = 44;

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>,
  RefAttributes<HTMLDivElement>, GlassSurfaceOptions {
  /** One line, the thing that happened. */
  title: string;
  /** A second line saying what it means or what to do about it. */
  message?: ReactNode;
  tone?: BannerTone;
  /** A glyph before the text. Defaults to the tone's own; pass `null` for none. */
  icon?: ReactNode | null;
  /** One action, at most. A banner with three buttons is a dialog that forgot to be modal. */
  action?: { label: string; onSelect: () => void };
  /**
   * Called when the reader dismisses it, by the close button or by flicking it upwards.
   * Passing this is what makes the banner dismissible: without it there is no close button,
   * which is right only for a banner the application itself takes down.
   */
  onDismiss?: () => void;
  /** The close button's name. Defaults to the provider's `close`. */
  dismissLabel?: string;
  /**
   * `inline` — the default — puts it in the flow where you place it, usually at the top of the
   * content or in a `Screen`'s `top` slot. `top` pins it across the top of the window instead.
   *
   * Inline is the default because a component that positions itself cannot be composed: the
   * layout already knows where its top is, and two things that both believe they own the top
   * of the window end up on top of each other.
   */
  placement?: 'inline' | 'top';
}

/**
 * A short notice at the top of a view: something arrived, something failed, something is
 * available.
 *
 * Not a toast, and the difference is what it is for. A toast reports the result of something
 * the reader just did and leaves on its own; a banner reports something that happened
 * elsewhere, stays until it is dealt with, and therefore has a title, room for a sentence, and
 * a way to get rid of it. If the reader must answer before going on, neither is right — that
 * is an alert.
 *
 * Control layer: it floats over the content it is about, so it is glass, and large glass
 * because it is a panel rather than a control.
 */
export function Banner({
  title, message, tone = 'info', icon, action, onDismiss, dismissLabel,
  placement = 'inline', className, style, ref, ...rest
}: BannerProps) {
  const strings = useGlassStrings();
  const [surface, props] = splitSurface(rest);
  const glass = useGlassSurface<HTMLDivElement>({ material: 'regular', size: 'large', ...surface }, ref);
  const reduceMotion = useGlassPolicy().reduceMotion;

  /**
   * Flick it up to get rid of it, which is how the system's own notifications go away.
   *
   * It is an addition to the close button, never a replacement: a gesture with no visible
   * affordance is not a way to dismiss something for anyone using a keyboard, and the same
   * applies to anyone who has not been told the gesture exists.
   */
  const latest = useRef(onDismiss); latest.current = onDismiss;
  useEffect(() => {
    const node = glass.root.current;
    if (!node || !onDismiss) return;
    return attachPull(node, () => ({
      axis: 'y', limit: 20, stretch: reduceMotion ? 0 : .3,
      targets: () => [node],
      // Downwards is nothing: it has nowhere to go and an elastic sag is not an affordance.
      range: () => ({ y: [-9999, 0] }),
      onRelease: ({ dy, cancelled }) => { if (!cancelled && dy < -DISMISS_TRAVEL) latest.current?.(); },
    }));
  }, [glass.root, onDismiss, reduceMotion]);

  const glyph = icon === null ? null
    : icon ?? (TONE_ICON[tone] && <LibraryIcon name={TONE_ICON[tone]!} size={17} />);

  return <div {...props} ref={glass.ref} {...glass.attributes}
    className={cx('lg-root lg-banner', className)} style={{ ...glass.style, ...style }}
    data-tone={tone} data-placement={placement}
    /* Polite: a banner reports, it does not interrupt. Something that must be answered before
       the reader goes on is an alert, and saying so here would not make this one. */
    role="status" aria-live="polite">
    {glass.decoration}
    <div className="lg-content"><SharedSurface value={true}>
      {glyph && <span className="lg-banner-icon" aria-hidden="true">{glyph}</span>}
      <div className="lg-banner-text">
        <span className="lg-banner-title">{title}</span>
        {message && <span className="lg-banner-message">{message}</span>}
      </div>
      {action && <GlassButton className="lg-banner-action" controlSize="small"
        onClick={action.onSelect}>{action.label}</GlassButton>}
      {onDismiss && <GlassIconButton className="lg-banner-dismiss" variant="plain" controlSize="small"
        aria-label={dismissLabel ?? strings.close} onClick={onDismiss}>
        <LibraryIcon name="close" size={15} />
      </GlassIconButton>}
    </SharedSurface></div>
  </div>;
}
