'use client';
import { useId, type CSSProperties, type HTMLAttributes, type ReactNode, type RefAttributes } from 'react';
import { cx } from '../system/utils.js';

export interface GroupBoxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'>, RefAttributes<HTMLDivElement> {
  /**
   * A short phrase describing what is inside, in sentence case and without ending punctuation.
   * Drawn *above* the box, which is where macOS puts it, and wired to the box with
   * `aria-labelledby` so a screen reader announces the group by that name rather than
   * announcing a box and leaving the reader to work out what it holds.
   */
  title?: ReactNode;
  /** One line under the title, for when the title cannot carry the whole relationship. */
  description?: ReactNode;
  children: ReactNode;
  /** A box separates by background or by border. Not both — two devices for one job. */
  variant?: 'fill' | 'outline';
  radius?: number;
  padding?: number;
}

/**
 * A visually distinct group of related content.
 *
 * The HIG's boxes page is short and every sentence of it is a constraint:
 *
 * - **A border *or* a background**, hence `variant` rather than both at once.
 * - **Keep it small relative to its container.** A box the size of the window stops separating
 *   anything, and that is a caller's decision this component cannot make — it is in the
 *   documentation because there is nowhere else for it to live.
 * - **Don't nest boxes.** Use padding and alignment for subgroups instead; the stylesheet does
 *   not style a box inside a box specially, which is the honest way to say "don't".
 * - **The title goes above the box** on macOS, and the title is optional.
 *
 * Content layer, always. A box is a region of the page, not something floating over it.
 *
 * Against `Card`: a card is a *surface* that carries something — it has a fill, a radius and a
 * shadow, and it is the thing you tap in a feed. A box is a *boundary* around things that
 * belong together, and its title is part of the grouping rather than the content. They look
 * similar and they answer different questions, which is why the box carries a `role="group"`
 * and the card does not.
 */
export function GroupBox({
  title, description, children, variant = 'fill', radius = 14, padding = 16,
  className, style, ref, ...props
}: GroupBoxProps) {
  const generated = useId();
  const labelId = `${generated}-title`;
  return <div {...props} ref={ref} className={cx('lg-groupbox', className)} data-variant={variant}
    style={{ '--lg-radius-container': `${radius}px`, '--lg-concentric-inset': `${padding}px`, ...style } as CSSProperties}>
    {title !== undefined && <div className="lg-groupbox-title" id={labelId}>{title}</div>}
    {description !== undefined && <div className="lg-groupbox-description">{description}</div>}
    <div className="lg-groupbox-body" role="group" aria-labelledby={title !== undefined ? labelId : undefined}
      style={{ padding: `${padding}px`, borderRadius: `${radius}px` }}>
      {children}
    </div>
  </div>;
}
