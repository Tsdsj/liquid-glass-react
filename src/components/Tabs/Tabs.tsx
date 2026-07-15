import {
  forwardRef,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  type ForwardedRef,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { GlassSurface } from '../../core/GlassSurface';
import { useControllableState } from '../../core/hooks/useControllableState';
import { useSlidingIndicator } from '../../core/hooks/useSlidingIndicator';

export interface TabItem {
  key: string;
  label: ReactNode;
  disabled?: boolean;
  content?: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (key: string) => void;
  size?: 'sm' | 'md' | 'lg';
  'aria-label'?: string;
}

function assignRef(ref: ForwardedRef<HTMLDivElement>, value: HTMLDivElement | null): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

function firstEnabledKey(items: TabItem[]): string {
  return items.find((item) => !item.disabled)?.key ?? '';
}

export const Tabs = /* @__PURE__ */ forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { items, value, defaultValue, onChange, size = 'md', 'aria-label': ariaLabel },
  forwardedRef,
) {
  const baseId = useId();
  const [currentValue, setCurrentValue] = useControllableState({
    value,
    defaultValue: defaultValue ?? firstEnabledKey(items),
    onChange,
  });

  const listRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);
  const tabsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Declared before the sliding-indicator hook so it points activeRef at the
  // selected tab before the indicator measures.
  useLayoutEffect(() => {
    activeRef.current = tabsRef.current.get(currentValue) ?? null;
  });
  const indicatorStyle = useSlidingIndicator(listRef, activeRef);

  const setRootRef = useCallback(
    (element: HTMLDivElement | null) => {
      assignRef(forwardedRef, element);
    },
    [forwardedRef],
  );

  const select = (key: string) => {
    const item = items.find((candidate) => candidate.key === key);
    if (!item || item.disabled || key === currentValue) {
      return;
    }
    setCurrentValue(key);
  };

  const tabId = (key: string) => `${baseId}-tab-${key}`;
  const panelId = (key: string) => `${baseId}-panel-${key}`;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const list = listRef.current;
    if (!list) {
      return;
    }
    const tabs = Array.from(list.querySelectorAll<HTMLButtonElement>('button[role="tab"]')).filter(
      (tab) => !tab.disabled,
    );
    if (tabs.length === 0) {
      return;
    }
    const currentIndex = tabs.findIndex((tab) => tab === event.target);
    const startIndex = currentIndex >= 0 ? currentIndex : 0;

    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (startIndex + 1) % tabs.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (startIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextTab = tabs[nextIndex];
    nextTab.focus();
    // Automatic activation: focusing a tab selects it.
    select(nextTab.value);
  };

  const activeItem = items.find((item) => item.key === currentValue);

  return (
    <div ref={setRootRef} className="lg-tabs" data-size={size}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="horizontal"
        className="lg-tabs__list"
        onKeyDown={handleKeyDown}
      >
        <GlassSurface
          aria-hidden="true"
          interactive
          className="lg-tabs__indicator"
          style={indicatorStyle ?? undefined}
          data-hidden={indicatorStyle ? undefined : ''}
        />
        {items.map((item) => {
          const selected = item.key === currentValue;
          return (
            <button
              key={item.key}
              ref={(element) => {
                if (element) {
                  tabsRef.current.set(item.key, element);
                } else {
                  tabsRef.current.delete(item.key);
                }
              }}
              type="button"
              role="tab"
              id={tabId(item.key)}
              value={item.key}
              aria-selected={selected}
              aria-controls={selected ? panelId(item.key) : undefined}
              disabled={item.disabled}
              tabIndex={selected ? 0 : -1}
              className="lg-tabs__tab"
              data-selected={selected ? '' : undefined}
              onClick={() => select(item.key)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {activeItem ? (
        <div
          role="tabpanel"
          id={panelId(activeItem.key)}
          aria-labelledby={tabId(activeItem.key)}
          tabIndex={0}
          className="lg-tabs__panel"
        >
          {activeItem.content}
        </div>
      ) : null}
    </div>
  );
});
