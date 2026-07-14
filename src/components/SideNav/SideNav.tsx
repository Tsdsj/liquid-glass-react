import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  type ForwardedRef,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { GlassSurface } from '../../core/GlassSurface';
import { useControllableState } from '../../core/hooks/useControllableState';
import { useSlidingIndicator } from '../../core/hooks/useSlidingIndicator';

export type SideNavItem =
  | { key: string; label: ReactNode; icon?: ReactNode; href?: string; disabled?: boolean }
  | { type: 'group'; label: ReactNode };

export interface SideNavProps {
  items: SideNavItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (key: string) => void;
  'aria-label'?: string;
}

function isGroup(item: SideNavItem): item is { type: 'group'; label: ReactNode } {
  return 'type' in item && item.type === 'group';
}

function firstEnabledKey(items: SideNavItem[]): string {
  for (const item of items) {
    if (!isGroup(item) && !item.disabled) {
      return item.key;
    }
  }
  return '';
}

function assignRef(ref: ForwardedRef<HTMLElement>, value: HTMLElement | null): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

export const SideNav = forwardRef<HTMLElement, SideNavProps>(function SideNav(
  { items, value, defaultValue, onChange, 'aria-label': ariaLabel },
  forwardedRef,
) {
  const [currentValue, setCurrentValue] = useControllableState({
    value,
    defaultValue: defaultValue ?? firstEnabledKey(items),
    onChange,
  });

  const listRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLElement | null>(null);
  const itemsRef = useRef<Map<string, HTMLElement>>(new Map());

  // Point activeRef at the selected item before the sliding-indicator effect
  // measures (this layout effect is declared first).
  useLayoutEffect(() => {
    activeRef.current = itemsRef.current.get(currentValue) ?? null;
  });
  const indicatorStyle = useSlidingIndicator(listRef, activeRef);

  const setNavRef = useCallback(
    (element: HTMLElement | null) => {
      assignRef(forwardedRef, element);
    },
    [forwardedRef],
  );

  const select = (key: string, disabled: boolean) => {
    if (disabled || key === currentValue) {
      return;
    }
    setCurrentValue(key);
  };

  return (
    <nav ref={setNavRef} aria-label={ariaLabel} className="lg-sidenav">
      <div ref={listRef} className="lg-sidenav__list">
        <GlassSurface
          aria-hidden="true"
          interactive
          className="lg-sidenav__indicator"
          style={indicatorStyle ?? undefined}
          data-hidden={indicatorStyle ? undefined : ''}
        />
        {items.map((item, index) => {
          if (isGroup(item)) {
            return (
              <div key={`group-${index}`} className="lg-sidenav__group">
                {item.label}
              </div>
            );
          }

          const disabled = item.disabled ?? false;
          const selected = item.key === currentValue;
          const setItemRef = (element: HTMLElement | null) => {
            if (element) {
              itemsRef.current.set(item.key, element);
            } else {
              itemsRef.current.delete(item.key);
            }
          };
          const content = (
            <>
              {item.icon != null ? (
                <span className="lg-sidenav__icon" aria-hidden="true">
                  {item.icon}
                </span>
              ) : null}
              <span className="lg-sidenav__label">{item.label}</span>
            </>
          );
          const commonProps = {
            className: 'lg-sidenav__item',
            'aria-current': selected ? ('page' as const) : undefined,
            'data-selected': selected ? '' : undefined,
            'data-disabled': disabled ? '' : undefined,
          };

          if (item.href != null) {
            return (
              <a
                {...commonProps}
                key={item.key}
                ref={setItemRef}
                href={disabled ? undefined : item.href}
                aria-disabled={disabled || undefined}
                tabIndex={disabled ? -1 : undefined}
                onClick={(event: MouseEvent) => {
                  if (disabled) {
                    event.preventDefault();
                    return;
                  }
                  select(item.key, disabled);
                }}
              >
                {content}
              </a>
            );
          }

          return (
            <button
              {...commonProps}
              key={item.key}
              ref={setItemRef}
              type="button"
              disabled={disabled}
              onClick={() => select(item.key, disabled)}
            >
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
});
