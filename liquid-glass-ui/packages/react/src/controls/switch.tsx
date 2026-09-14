'use client';
import { useId, useRef } from 'react';
import { usePull } from '../system/pull.js';
import { useGlassSurface, type GlassSurfaceOptions } from '../system/material.js';
import { cx, useControllable } from '../system/utils.js';

export interface GlassSwitchProps extends GlassSurfaceOptions {
  checked?: boolean; defaultChecked?: boolean; onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean; name?: string;
  /** Describe the **on** state — "Wi-Fi", not "Enable Wi-Fi" and never "Enable/Disable". */
  'aria-label': string;
  label?: string;
  className?: string;
}

/**
 * A capsule toggle, green when on, over a real `<input type="checkbox" role="switch">`.
 *
 * It is a drag target as well as a tap target: throw the knob and it lands on the nearer
 * side, tracking the pointer 1:1 and stretching along the drag before it springs. A
 * click-only switch is one of the clearest tells that an interface is not Apple's.
 */
export function GlassSwitch({ checked, defaultChecked = false, onCheckedChange, disabled, name, 'aria-label': label, label: visibleLabel, className, ...surface }: GlassSwitchProps) {
  const id = useId();
  const [active, setActive] = useControllable(checked, defaultChecked, onCheckedChange);
  const glass = useGlassSurface<HTMLSpanElement>({ ...surface, radius: 'pill' });
  const thumb = useRef<HTMLSpanElement>(null); const dragged = useRef(false); const labelRef = useRef<HTMLLabelElement>(null);
  usePull(labelRef, {
    axis: 'x', limit: 14, stretch: 1.2,
    targets: () => [thumb.current!, glass.root.current!].filter(Boolean) as HTMLElement[],
    disabled: () => !!disabled,
    onRelease: ({ dx, cancelled }) => {
      if (cancelled || Math.abs(dx) < 6) { dragged.current = false; return; }
      // A deliberate drag decides by direction and suppresses the label's synthetic click.
      dragged.current = true; const next = dx > 0; if (next !== active) setActive(next);
    },
  }, !glass.policy.reduceMotion);
  return <label ref={labelRef} className={cx('lg-switch', className)} data-disabled={disabled ? 'true' : 'false'} htmlFor={id}
    onClickCapture={event => { if (dragged.current) { dragged.current = false; event.preventDefault(); event.stopPropagation(); } }}>
    <input id={id} type="checkbox" role="switch" aria-label={label} name={name} checked={active} disabled={disabled} onChange={event => setActive(event.currentTarget.checked)} />
    <span ref={glass.ref} {...glass.attributes} className="lg-root lg-switch-track" data-checked={active ? 'true' : 'false'} style={glass.style} aria-hidden="true">
      {glass.decoration}<span className="lg-switch-thumb" ref={thumb} />
    </span>{visibleLabel && <span className="lg-switch-label">{visibleLabel}</span>}
  </label>;
}
