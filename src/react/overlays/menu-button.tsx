'use client';
import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode, type RefAttributes } from 'react';
import { GlassButton, type ControlSize, type GlassButtonVariant } from '../controls/button.js';
import { LibraryIcon } from '../system/icon.js';
import { type GlassSurfaceOptions } from '../system/material.js';
import { useControllable } from '../system/utils.js';
import { inDevelopment, warnOnce } from '../system/warn.js';
import { GlassMenu, type GlassMenuItem } from './menu.js';
import { type Align } from './anchor.js';

/**
 * One choice in a pop-up button. Deliberately not a `GlassMenuItem`: a pop-up button's items
 * are values, not commands, so they have no `onSelect` of their own — the button reports the
 * new value once, in one place.
 */
export interface GlassMenuOption {
  value: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  separatorBefore?: boolean;
}

/**
 * `value` and `type` are taken back from `<button>`: a pop-up button's `value` is the choice
 * it is showing, and its element is always `type="button"` — a menu opener that submitted a
 * form would be a trap. Everything else passes through to the button, which is the element on
 * the page and the one the `ref` points at.
 */
interface CommonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'type' | 'children'>,
  RefAttributes<HTMLButtonElement>, GlassSurfaceOptions {
  variant?: GlassButtonVariant;
  controlSize?: ControlSize;
  align?: Align;
  placement?: 'below' | 'above' | 'auto';
}

export interface PullDownButtonProps extends CommonProps {
  kind?: 'pullDown';
  /** What the button says. Stays put — a pull-down button's label describes its own action. */
  label: ReactNode;
  items: GlassMenuItem[];
  'aria-label'?: string;
}

export interface PopUpButtonProps extends CommonProps {
  kind: 'popUp';
  options: GlassMenuOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * What the choice is for. Required, because a pop-up button's own label is the current
   * selection and therefore never says what is being chosen.
   */
  'aria-label': string;
  /** Shown when nothing is selected yet. Prefer a real default selection to a placeholder. */
  placeholder?: string;
}

export type GlassMenuButtonProps = PullDownButtonProps | PopUpButtonProps;

/**
 * A button whose menu grows out of it.
 *
 * Two kinds, and the HIG is precise about the difference. A **pull-down** button performs or
 * clarifies its own action: the label stays put and the menu lists commands related to it.
 * A **pop-up** button presents a flat list of mutually exclusive options and *updates its own
 * label to show the current selection* — which is why its items are values rather than
 * commands, and why they read as `menuitemradio` rather than as checkboxes.
 *
 * Either can be assembled from `GlassButton` plus `GlassMenu`, but not the part that matters:
 * the chevron, the label that tracks the selection, the single-choice semantics, and the menu
 * morphing out of the button rather than appearing beside it.
 */
export function GlassMenuButton(props: GlassMenuButtonProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popUp = props.kind === 'popUp';

  /**
   * "Listing a minimum of three items can help the interaction feel worthwhile" — below that,
   * the menu costs a press to reveal less than the buttons it replaced would have shown.
   * A warning, not an error: two items is a judgement call, not a broken component.
   */
  const count = popUp ? props.options.length : props.items.length;
  useEffect(() => {
    if (!inDevelopment() || !triggerRef.current || count >= 3) return;
    warnOnce(triggerRef.current, 'menu-button-too-few',
      `GlassMenuButton has ${count} item${count === 1 ? '' : 's'}. A menu has to be opened before it can be read, so below about three items plain buttons show more for less effort.`);
  }, [count]);

  return popUp ? <PopUp {...props} triggerRef={triggerRef} /> : <PullDown {...props} triggerRef={triggerRef} />;
}

type WithTrigger<P> = P & { triggerRef: React.RefObject<HTMLButtonElement | null> };

function Chevron() {
  return <LibraryIcon name="chevronDown" size={15} className="lg-menu-button-chevron" />;
}

function PullDown({
  label, items, variant = 'glass', controlSize = 'regular', align = 'end',
  placement = 'auto', className, id, ref, triggerRef, 'aria-label': ariaLabel,
  kind: _kind, ...rest
}: WithTrigger<PullDownButtonProps>) {
  return <GlassMenu
    aria-label={ariaLabel ?? (typeof label === 'string' ? label : 'Menu')}
    items={items} align={align} placement={placement} id={id}
    trigger={<GlassButton {...rest} ref={mergeRefs(ref, triggerRef)} variant={variant}
      controlSize={controlSize} className={cxButton(className)}>
      {label}<Chevron />
    </GlassButton>} />;
}

function PopUp({
  options, value, defaultValue, onValueChange, placeholder, variant = 'glass', controlSize = 'regular',
  align = 'end', placement = 'auto', className, id, ref, triggerRef,
  'aria-label': ariaLabel, kind: _kind, ...rest
}: WithTrigger<PopUpButtonProps>) {
  const [current, setCurrent] = useControllable(value, defaultValue ?? options[0]?.value ?? '', onValueChange);
  const selected = options.find(option => option.value === current);

  /* Values, turned into menu items at the edge. The checkmark is state rather than colour, and
     `selection="single"` makes it a radio group so picking one is understood to clear the rest. */
  const items: GlassMenuItem[] = options.map(option => ({
    key: option.value,
    label: option.label,
    icon: option.icon,
    disabled: option.disabled,
    separatorBefore: option.separatorBefore,
    checked: option.value === current,
    onSelect: () => setCurrent(option.value),
  }));

  return <GlassMenu
    aria-label={ariaLabel} items={items} selection="single" align={align} placement={placement} id={id}
    trigger={<GlassButton {...rest} ref={mergeRefs(ref, triggerRef)} variant={variant}
      controlSize={controlSize} aria-label={ariaLabel} className={cxButton(className)}>
      {/* The button's content *is* the current selection — that is what makes it a pop-up button. */}
      <span className="lg-menu-button-value">{selected?.label ?? placeholder ?? ''}</span><Chevron />
    </GlassButton>} />;
}

const cxButton = (className?: string) => className ? `lg-menu-button ${className}` : 'lg-menu-button';

/** Two refs onto one button: the caller's, and the one the item-count warning needs. */
function mergeRefs(outer: PullDownButtonProps['ref'], inner: React.RefObject<HTMLButtonElement | null>) {
  return (node: HTMLButtonElement | null) => {
    inner.current = node;
    if (typeof outer === 'function') outer(node);
    else if (outer) outer.current = node;
  };
}
