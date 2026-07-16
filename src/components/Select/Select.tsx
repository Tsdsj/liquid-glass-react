import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  useTransitionStatus,
  useTypeahead,
} from '@floating-ui/react';
import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ForwardedRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { GlassSurface } from '../../core/GlassSurface';
import { ScrollEdge } from '../../core/scroll-edge';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { useControllableState } from '../../core/hooks/useControllableState';
import { fuzzyMatch } from '../../core/utils/fuzzy-match';
import { Tag } from '../Tag';

export interface SelectOption {
  label: ReactNode;
  value: string;
  disabled?: boolean;
}

interface SelectBaseProps {
  options: SelectOption[];
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Filter input at the top of the panel (M30); fuzzy-matches option labels. */
  searchable?: boolean;
  'aria-label'?: string;
}

export interface SelectSingleProps extends SelectBaseProps {
  multiple?: false;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export interface SelectMultipleProps extends SelectBaseProps {
  /** Multiple mode (M30): values are arrays and picking keeps the panel open. */
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
}

export type SelectProps = SelectSingleProps | SelectMultipleProps;

const SELECT_TRANSITION_DURATION = 350;
const SELECT_MIDDLEWARE = [
  offset(8),
  flip(),
  shift({ padding: 8 }),
  size({
    padding: 8,
    apply({ availableHeight, elements, rects }) {
      Object.assign(elements.floating.style, {
        minWidth: `${rects.reference.width}px`,
        maxHeight: `${Math.max(0, availableHeight)}px`,
      });
    },
  }),
];

const SEARCH_COPY = {
  'zh-CN': { filter: '筛选选项', empty: '无匹配选项' },
  'en-US': { filter: 'Filter options', empty: 'No matching options' },
} as const;

function assignRef(ref: ForwardedRef<HTMLButtonElement>, value: HTMLButtonElement | null): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

function getOptionText(label: ReactNode): string | null {
  if (typeof label === 'string' || typeof label === 'number') {
    return String(label);
  }
  return null;
}

function getFirstEnabledIndex(options: SelectOption[]): number | null {
  const index = options.findIndex((option) => !option.disabled);
  return index >= 0 ? index : null;
}

/** Normalize single/multiple public values to the internal array shape. */
function toValueArray(input: string | string[] | undefined): string[] | undefined {
  if (input === undefined) {
    return undefined;
  }
  if (Array.isArray(input)) {
    return input;
  }
  return input === '' ? [] : [input];
}

export const Select = /* @__PURE__ */ forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    options,
    value,
    defaultValue,
    onChange,
    placeholder,
    size: controlSize = 'md',
    disabled = false,
    multiple = false,
    searchable = false,
    'aria-label': ariaLabel,
  },
  forwardedRef,
) {
  const { locale } = useLiquidGlassContext();
  const isMultiple = multiple === true;
  const [values, setValues] = useControllableState<string[]>({
    value: toValueArray(value),
    defaultValue: toValueArray(defaultValue) ?? [],
    onChange: (next) => {
      if (isMultiple) {
        (onChange as ((next: string[]) => void) | undefined)?.(next);
      } else {
        (onChange as ((next: string) => void) | undefined)?.(next[0] ?? '');
      }
    },
  });
  const currentValue = isMultiple ? null : (values[0] ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const listRef = useRef<Array<HTMLElement | null>>([]);
  const labelsRef = useRef<Array<string | null>>([]);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const baseId = useId();
  const optionId = (index: number) => `${baseId}-option-${index}`;
  const listboxId = `${baseId}-listbox`;

  // Everything below (navigation indices, refs, rendering) speaks in terms of
  // the visible options, so the searchable filter stays index-consistent.
  const trimmedQuery = query.trim();
  const visibleOptions =
    searchable && trimmedQuery
      ? options.filter((option) => {
          const text = getOptionText(option.label);
          return text === null ? true : fuzzyMatch(trimmedQuery, text);
        })
      : options;

  const selectedIndex = isMultiple
    ? -1
    : visibleOptions.findIndex((option) => option.value === currentValue);
  const selectedOption = isMultiple
    ? undefined
    : options.find((option) => option.value === currentValue);
  const disabledIndices = visibleOptions.flatMap((option, index) =>
    option.disabled ? [index] : [],
  );
  listRef.current.length = visibleOptions.length;
  labelsRef.current = visibleOptions.map((option) => getOptionText(option.label));

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) {
      return;
    }

    if (nextOpen) {
      setQuery('');
    }
    setIsOpen(nextOpen);
    setActiveIndex(
      nextOpen
        ? selectedIndex >= 0 && !visibleOptions[selectedIndex]?.disabled
          ? selectedIndex
          : getFirstEnabledIndex(visibleOptions)
        : null,
    );
  };
  const { refs, floatingStyles, context, placement: resolvedPlacement } = useFloating({
    open: isOpen,
    onOpenChange: handleOpenChange,
    placement: 'bottom-start',
    middleware: SELECT_MIDDLEWARE,
    whileElementsMounted: autoUpdate,
    transform: false,
  });
  const click = useClick(context, { enabled: !disabled });
  const dismiss = useDismiss(context);
  // Searchable panels follow the combobox-in-dialog pattern (same as Command):
  // the floating element is a dialog and the inner list carries the listbox.
  const role = useRole(context, { role: searchable ? 'dialog' : 'listbox' });
  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    selectedIndex: selectedIndex >= 0 ? selectedIndex : null,
    onNavigate: setActiveIndex,
    disabledIndices,
    focusItemOnOpen: !searchable,
    loop: true,
    enabled: !searchable,
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    onMatch: setActiveIndex,
    enabled: isOpen && !searchable,
  });
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    role,
    listNavigation,
    typeahead,
  ]);
  const { isMounted, status } = useTransitionStatus(context, {
    duration: SELECT_TRANSITION_DURATION,
  });
  const setReference = useCallback(
    (element: HTMLButtonElement | null) => {
      refs.setReference(element);
      assignRef(forwardedRef, element);
    },
    [forwardedRef, refs],
  );
  const triggerProps = getReferenceProps({
    type: 'button',
    disabled,
    'aria-label': ariaLabel,
    // Multiple mode: Backspace on the trigger drops the last picked value.
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
      if (isMultiple && event.key === 'Backspace' && values.length > 0) {
        event.preventDefault();
        setValues(values.slice(0, -1));
      }
    },
  }) as ButtonHTMLAttributes<HTMLButtonElement>;
  const floatingProps = getFloatingProps(
    searchable ? {} : { 'aria-multiselectable': isMultiple || undefined },
  ) as HTMLAttributes<HTMLElement>;
  const displayPlaceholder = placeholder ?? (locale === 'en-US' ? 'Select' : '请选择');
  const searchCopy = SEARCH_COPY[locale];

  const selectOption = (index: number) => {
    const option = visibleOptions[index];
    if (!option || option.disabled) {
      return;
    }

    if (isMultiple) {
      setValues(
        values.includes(option.value)
          ? values.filter((candidate) => candidate !== option.value)
          : [...values, option.value],
      );
      // Stay open so several values can be picked in one visit.
      return;
    }

    if (option.value !== currentValue) {
      setValues([option.value]);
    }
    setIsOpen(false);
    setActiveIndex(null);
  };
  const handleOptionKeyDown = (event: KeyboardEvent<HTMLElement>, index: number) => {
    if (event.key === 'Tab') {
      setIsOpen(false);
      setActiveIndex(null);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectOption(index);
    }
  };

  const moveActive = (direction: 1 | -1) => {
    if (visibleOptions.length === 0) {
      return;
    }
    const start = activeIndex ?? (direction === 1 ? -1 : visibleOptions.length);
    for (let step = 1; step <= visibleOptions.length; step += 1) {
      const candidate =
        (start + direction * step + visibleOptions.length * step) % visibleOptions.length;
      if (!visibleOptions[candidate]?.disabled) {
        setActiveIndex(candidate);
        return;
      }
    }
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (activeIndex !== null) {
        selectOption(activeIndex);
      }
    }
    // Escape closes via useDismiss.
  };

  const selectedTags = isMultiple
    ? options.filter((option) => values.includes(option.value))
    : [];

  const renderOptions = visibleOptions.map((option, index) => {
    const isSelected = isMultiple ? values.includes(option.value) : selectedIndex === index;
    const itemProps = getItemProps({
      onClick: () => selectOption(index),
      onKeyDown: (event) => handleOptionKeyDown(event, index),
    }) as HTMLAttributes<HTMLDivElement>;

    return (
      <div
        {...itemProps}
        key={option.value}
        id={optionId(index)}
        ref={(element) => {
          listRef.current[index] = element;
        }}
        role="option"
        tabIndex={searchable ? -1 : activeIndex === index ? 0 : -1}
        aria-selected={isSelected}
        aria-disabled={option.disabled || undefined}
        className="lg-select__option"
        data-active={activeIndex === index ? '' : undefined}
        data-selected={isSelected ? '' : undefined}
        data-disabled={option.disabled ? '' : undefined}
      >
        <span className="lg-select__option-label">{option.label}</span>
        {isMultiple && isSelected ? (
          <span className="lg-select__check" aria-hidden="true">
            ✓
          </span>
        ) : null}
      </div>
    );
  });

  const listContent =
    visibleOptions.length === 0 ? (
      <div className="lg-select__empty">{searchCopy.empty}</div>
    ) : (
      renderOptions
    );

  return (
    <span
      className="lg-select"
      data-size={controlSize}
      data-open={isOpen ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
    >
      <GlassSurface
        {...triggerProps}
        as="button"
        ref={setReference as ForwardedRef<HTMLElement>}
        refraction="off"
        interactive={!disabled}
        className="lg-select__trigger"
        data-placeholder={selectedOption || selectedTags.length > 0 ? undefined : ''}
        data-expanded={isOpen ? '' : undefined}
      >
        {isMultiple ? (
          selectedTags.length > 0 ? (
            // Display-only tags (a nested close button inside the trigger would
            // be invalid markup); removal = Backspace or unpicking in the panel.
            <span className="lg-select__tags">
              {selectedTags.map((option) => (
                <Tag key={option.value} size="sm">
                  {option.label}
                </Tag>
              ))}
            </span>
          ) : (
            <span className="lg-select__value">{displayPlaceholder}</span>
          )
        ) : (
          <span className="lg-select__value">
            {selectedOption ? selectedOption.label : displayPlaceholder}
          </span>
        )}
        <span className="lg-select__arrow" aria-hidden="true" />
      </GlassSurface>

      {isMounted ? (
        <FloatingPortal>
          <FloatingFocusManager
            context={context}
            modal={false}
            initialFocus={searchable ? searchInputRef : -1}
          >
            <GlassSurface
              {...floatingProps}
              ref={refs.setFloating}
              refraction="auto"
              className="lg-select__panel"
              style={floatingStyles}
              data-status={status}
              data-placement={resolvedPlacement}
            >
              {searchable ? (
                <div className="lg-select__search">
                  <input
                    ref={searchInputRef}
                    type="text"
                    role="combobox"
                    className="lg-select__search-input"
                    aria-expanded
                    aria-autocomplete="list"
                    aria-controls={listboxId}
                    aria-activedescendant={
                      activeIndex !== null && visibleOptions[activeIndex]
                        ? optionId(activeIndex)
                        : undefined
                    }
                    aria-label={searchCopy.filter}
                    autoComplete="off"
                    spellCheck={false}
                    placeholder={searchCopy.filter}
                    value={query}
                    onChange={(event) => {
                      const nextQuery = event.target.value;
                      setQuery(nextQuery);
                      const nextVisible = nextQuery.trim()
                        ? options.filter((option) => {
                            const text = getOptionText(option.label);
                            return text === null ? true : fuzzyMatch(nextQuery.trim(), text);
                          })
                        : options;
                      setActiveIndex(getFirstEnabledIndex(nextVisible));
                    }}
                    onKeyDown={handleSearchKeyDown}
                  />
                </div>
              ) : null}
              {searchable ? (
                <div
                  id={listboxId}
                  role="listbox"
                  aria-label={ariaLabel}
                  aria-multiselectable={isMultiple || undefined}
                >
                  <ScrollEdge className="lg-select__scroll" viewportClassName="lg-select__viewport">
                    {listContent}
                  </ScrollEdge>
                </div>
              ) : (
                <ScrollEdge className="lg-select__scroll" viewportClassName="lg-select__viewport">
                  {listContent}
                </ScrollEdge>
              )}
            </GlassSurface>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </span>
  );
});
