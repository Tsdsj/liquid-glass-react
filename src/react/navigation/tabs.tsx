'use client';
import { useId, useRef, type HTMLAttributes, type ReactNode, type RefAttributes } from 'react';
import { GlassSurface } from '../system/surface.js';
import { type GlassSurfaceOptions } from '../system/material.js';
import { splitSurface } from '../system/props.js';
import { cx, useControllable } from '../system/utils.js';
import { usePull, elementAt } from '../system/pull.js';
import { useGlassPolicy } from '../system/provider.js';
import { useSelectionLens, lensOrigin, trackSpan, type GlassChoice } from '../controls/segmented.js';

export interface GlassTab extends GlassChoice { content: ReactNode }
export interface GlassTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'>, RefAttributes<HTMLDivElement>, GlassSurfaceOptions {
  items: GlassTab[]; value?: string; defaultValue?: string; onValueChange?: (value: string) => void;
  'aria-label': string;
}

/**
 * In-page tabs that swap content — `role="tablist"` with real panels. This is deliberately
 * not the app's tab bar: navigating between sections of the app is a `<nav>` of links
 * (`TabBar`), because a tablist tells assistive technology the content is swapping in place.
 */
export function GlassTabs({ items, value, defaultValue, onValueChange, 'aria-label': label, className, ref, ...rest }: GlassTabsProps) {
  const [surface, props] = splitSurface(rest);
  const id = useId();
  const [selected, setSelected] = useControllable(value, defaultValue ?? items.find(x => !x.disabled)?.value ?? '', onValueChange);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const list = useRef<HTMLDivElement>(null);
  const policy = useGlassPolicy();
  const lensRef = useRef<HTMLSpanElement>(null);
  useSelectionLens(list, lensRef, '.lg-tab[aria-selected="true"]', [selected, items]);
  usePull(list, {
    axis: 'x', limit: 18, stretch: .8,
    targets: () => lensRef.current ? [lensRef.current] : [],
    origin: () => lensOrigin(lensRef.current),
    range: () => trackSpan(list.current, lensRef.current),
    disabled: event => !!(event.target as HTMLElement).closest('button:disabled'),
    onPress: event => pick(event), onMove: event => pick(event),
    onRelease: ({ event, cancelled }) => { if (!cancelled) (elementAt(event, '.lg-tab') as HTMLButtonElement | null)?.focus({ preventScroll: true }); },
  }, !policy.reduceMotion);
  function pick(event: PointerEvent) {
    const hit = elementAt(event, '.lg-tab') as HTMLButtonElement | null; const index = refs.current.indexOf(hit);
    if (hit && !hit.disabled && index >= 0 && items[index].value !== selected) setSelected(items[index].value);
  }
  return <div {...props} ref={ref} className={cx('lg-tabs', className)}>
    <GlassSurface {...surface} className="lg-tabs-surface" radius="pill">
      <div className="lg-tab-list" role="tablist" aria-label={label} ref={list}>
        <span aria-hidden="true" className="lg-selection-lens" ref={lensRef} />
        {items.map((item, index) => <button key={item.value} ref={node => { refs.current[index] = node; }} type="button" role="tab"
          id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={selected === item.value}
          tabIndex={selected === item.value ? 0 : -1} disabled={item.disabled} className="lg-tab" onClick={() => setSelected(item.value)}
          onKeyDown={event => {
            const enabled = items.map((x, i) => x.disabled ? -1 : i).filter(i => i >= 0); const current = enabled.indexOf(index);
            let next: number;
            const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
            if (event.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) next = enabled[(current + 1) % enabled.length];
            else if (event.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) next = enabled[(current - 1 + enabled.length) % enabled.length];
            else if (event.key === 'Home') next = enabled[0];
            else if (event.key === 'End') next = enabled.at(-1)!;
            else return;
            event.preventDefault(); setSelected(items[next].value); refs.current[next]?.focus();
          }}>{item.label}</button>)}
      </div>
    </GlassSurface>
    {items.map((item, index) => <div key={item.value} role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={selected !== item.value} tabIndex={0} className="lg-tab-panel">{item.content}</div>)}
  </div>;
}
