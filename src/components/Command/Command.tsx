import {
  Fragment,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { GlassSurface } from '../../core/GlassSurface';
import { useControllableState } from '../../core/hooks/useControllableState';
import { commandMatches } from '../../core/utils/fuzzy-match';

export interface CommandItem {
  key: string;
  label: ReactNode;
  keywords?: string[];
  onRun?: () => void;
  group?: string;
}

export interface CommandProps {
  items: CommandItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
}

const COPY = {
  'zh-CN': { title: '命令面板', placeholder: '输入命令…', empty: '无匹配命令' },
  'en-US': { title: 'Command palette', placeholder: 'Type a command…', empty: 'No matching commands' },
} as const;

export function Command({ items, open, onOpenChange, placeholder }: CommandProps) {
  const { locale } = useLiquidGlassContext();
  const copy = COPY[locale];
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: false,
    onChange: onOpenChange,
  });
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const baseId = useId();
  const listId = `${baseId}-list`;
  const optionId = (index: number) => `${baseId}-option-${index}`;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { refs, context } = useFloating({ open: isOpen, onOpenChange: setIsOpen });
  const dismiss = useDismiss(context, { escapeKey: true, outsidePress: true });
  const role = useRole(context, { role: 'dialog' });
  const { getFloatingProps } = useInteractions([dismiss, role]);

  const filtered = useMemo(
    () =>
      items.filter((item) =>
        commandMatches(query, typeof item.label === 'string' ? item.label : '', item.keywords),
      ),
    [items, query],
  );

  // Fresh palette each time it opens.
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || filtered.length === 0) {
      return;
    }

    document
      .getElementById(optionId(activeIndex))
      ?.scrollIntoView?.({ block: 'nearest' });
  }, [activeIndex, filtered.length, isOpen]);

  const run = (item: CommandItem) => {
    item.onRun?.();
    setIsOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (filtered.length > 0) {
        setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (filtered.length > 0) {
        setActiveIndex((index) => Math.max(index - 1, 0));
      }
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(Math.max(filtered.length - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const item = filtered[activeIndex];
      if (item) {
        run(item);
      }
    }
    // Escape closes via useDismiss.
  };

  if (!isOpen) {
    return null;
  }

  const activeItem = filtered[activeIndex];
  const options: ReactNode[] = [];
  let lastGroup: string | undefined;
  filtered.forEach((item, index) => {
    if (item.group && item.group !== lastGroup) {
      options.push(
        <li key={`group-${item.group}`} role="presentation" className="lg-command__group">
          {item.group}
        </li>,
      );
    }
    lastGroup = item.group;
    options.push(
      <li
        key={item.key}
        id={optionId(index)}
        role="option"
        aria-selected={index === activeIndex}
        className="lg-command__option"
        data-active={index === activeIndex ? '' : undefined}
        onPointerMove={() => setActiveIndex(index)}
        onClick={() => run(item)}
      >
        {item.label}
      </li>,
    );
  });

  return (
    <FloatingPortal>
      <FloatingOverlay lockScroll className="lg-command__overlay">
        <FloatingFocusManager context={context} modal initialFocus={inputRef}>
          <GlassSurface
            as="div"
            {...getFloatingProps()}
            ref={refs.setFloating}
            className="lg-command__panel"
            aria-label={copy.title}
            aria-modal="true"
          >
            <div className="lg-command">
              <GlassSurface
                as="div"
                refraction="off"
                material="clear"
                className="lg-command__search"
              >
                <input
                  ref={inputRef}
                  type="text"
                  role="combobox"
                  className="lg-command__input"
                  aria-expanded
                  aria-autocomplete="list"
                  aria-controls={listId}
                  aria-activedescendant={activeItem ? optionId(activeIndex) : undefined}
                  aria-label={copy.title}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder={placeholder ?? copy.placeholder}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                />
              </GlassSurface>
              <ul id={listId} role="listbox" aria-label={copy.title} className="lg-command__list">
                {filtered.length === 0 ? (
                  <li className="lg-command__empty" role="presentation">
                    {copy.empty}
                  </li>
                ) : (
                  <Fragment>{options}</Fragment>
                )}
              </ul>
            </div>
          </GlassSurface>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
}
