'use client';
import { useEffect, useRef, type HTMLAttributes, type ReactNode, type RefAttributes } from 'react';
import { useGlassPolicy } from '../system/provider.js';
import { cx, useMergedRef } from '../system/utils.js';

export interface GlassBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'>, RefAttributes<HTMLSpanElement> {
  /** A count, or text for a status badge. Counts above `max` render as "max+". */
  count?: number;
  max?: number;
  children?: ReactNode;
  tone?: 'notification' | 'neutral' | 'accent';
  /** A bare dot, for "something changed" with no useful number. */
  dot?: boolean;
  /**
   * Badges are read out on their own, so say what the number means. Without this a screen
   * reader announces a naked "3".
   */
  'aria-label'?: string;
}

/**
 * Colour alone never carries the meaning here: the badge always contains a number or a
 * label, and the accessible name spells out what it counts.
 */
export function GlassBadge({ count, max = 99, children, tone = 'notification', dot = false, className, ref, ...props }: GlassBadgeProps) {
  const text = dot ? null : children ?? (count === undefined ? null : count > max ? `${max}+` : String(count));
  const [node, mergedRef] = useMergedRef<HTMLSpanElement>(ref);
  const reduceMotion = useGlassPolicy().reduceMotion;

  /**
   * A number that changed should look like it changed.
   *
   * Two unread becoming three is the whole message a badge carries, and swapping the glyph
   * between frames is the one way to deliver it that the eye can miss entirely. Driven from
   * script rather than a class, because the trigger is the *content* changing — CSS has no
   * selector for that, and the usual workaround (flip an attribute to restart a keyframe) is
   * the same animation with a harder-to-read implementation. Script also means the stylesheet's
   * blanket `animation: none` does not reach it, so the preference is asked about here.
   *
   * Only after the first render: a badge appearing is already motion, and bouncing it on
   * arrival would be two animations telling the reader one thing.
   */
  const previous = useRef<string | null>(null);
  useEffect(() => {
    // The count only. Arbitrary `children` may be an element, and two elements are never
    // usefully comparable — a badge whose content is a node is not reporting a number.
    const value = dot || children !== undefined || text === null ? null : String(text);
    const was = previous.current;
    previous.current = value;
    if (was === null || was === value || value === null || reduceMotion) return;
    node.current?.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.22)', offset: .35 }, { transform: 'scale(1)' }],
      { duration: 320, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }, [text, dot, children, reduceMotion, node]);

  if (!dot && (text === null || text === '')) return null;
  return <span {...props} ref={mergedRef} className={cx('lg-badge', className)} data-tone={tone} data-dot={dot ? 'true' : undefined}>{text}</span>;
}
