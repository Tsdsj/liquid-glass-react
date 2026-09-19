'use client';
import { useId, useRef, type LabelHTMLAttributes, type RefAttributes } from 'react';
import { usePull } from '../system/pull.js';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { splitSurface } from '../system/props.js';
import { cx, useControllable, useMergedRef } from '../system/utils.js';

/** `htmlFor` is taken back: the label owns the checkbox it renders and wires itself to it. */
export interface GlassSwitchProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor' | 'children' | 'onChange'>, RefAttributes<HTMLLabelElement>, GlassSurfaceOptions {
  checked?: boolean; defaultChecked?: boolean; onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean; name?: string;
  /** Describe the **on** state — "Wi-Fi", not "Enable Wi-Fi" and never "Enable/Disable". */
  'aria-label': string;
  label?: string;
}

/**
 * A capsule toggle, green when on, over a real `<input type="checkbox" role="switch">`.
 *
 * It is a drag target as well as a tap target: throw the knob and it lands on the nearer
 * side, tracking the pointer 1:1 and stretching along the drag before it springs. A
 * click-only switch is one of the clearest tells that an interface is not Apple's.
 */
export function GlassSwitch({ checked, defaultChecked = false, onCheckedChange, disabled, name, 'aria-label': label, label: visibleLabel, className, ref, ...rest }: GlassSwitchProps) {
  const [surface, props] = splitSurface(rest);
  const id = useId();
  const [active, setActive] = useControllable(checked, defaultChecked, onCheckedChange);
  const glass = useGlassSurface<HTMLSpanElement>({ ...surface, radius: 'pill' });
  const thumb = useRef<HTMLSpanElement>(null); const dragged = useRef(false);
  // The label is both the drag surface and what the caller's ref should point at.
  const [labelRef, mergedRef] = useMergedRef<HTMLLabelElement>(ref);
  usePull(labelRef, {
    axis: 'x', limit: 10, stretch: 1.2,
    targets: () => [thumb.current!, glass.root.current!].filter(Boolean) as HTMLElement[],
    /**
     * The thumb crosses the track under the finger and only resists past the ends. `--lg-travel`
     * already holds whichever side it started on, so the free span is the remaining travel.
     */
    range: () => {
      const track = glass.root.current, knob = thumb.current;
      if (!track || !knob) return null;
      const travel = track.clientWidth - knob.offsetWidth - 6;
      if (travel <= 0) return null;
      return { x: [(active ? -travel : 0), (active ? 0 : travel)] as [number, number] };
    },
    disabled: () => !!disabled,
    onRelease: ({ dx, cancelled }) => {
      if (cancelled || Math.abs(dx) < 6) { dragged.current = false; return; }
      // A deliberate drag decides by direction and suppresses the label's synthetic click.
      dragged.current = true; const next = dx > 0; if (next !== active) setActive(next);
    },
  }, !glass.policy.reduceMotion);
  return <label {...props} ref={mergedRef} className={cx('lg-switch', className)} data-disabled={disabled ? 'true' : 'false'} htmlFor={id}
    onClickCapture={event => { if (dragged.current) { dragged.current = false; event.preventDefault(); event.stopPropagation(); } }}>
    <input id={id} type="checkbox" role="switch" aria-label={label} name={name} checked={active} disabled={disabled} onChange={event => setActive(event.currentTarget.checked)} />
    <span ref={glass.ref} {...glass.attributes} className="lg-root lg-switch-track" data-checked={active ? 'true' : 'false'} style={glass.style} aria-hidden="true">
      {glass.decoration}<span className="lg-switch-thumb" ref={thumb} />
    </span>{visibleLabel && <span className="lg-switch-label">{visibleLabel}</span>}
  </label>;
}
