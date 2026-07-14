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

export interface SelectOption {
  label: ReactNode;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  'aria-label'?: string;
}

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

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    options,
    value,
    defaultValue = '',
    onChange,
    placeholder,
    size: controlSize = 'md',
    disabled = false,
    'aria-label': ariaLabel,
  },
  forwardedRef,
) {
  const { locale } = useLiquidGlassContext();
  const [currentValue, setCurrentValue] = useControllableState({
    value,
    defaultValue,
    onChange,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const listRef = useRef<Array<HTMLElement | null>>([]);
  const labelsRef = useRef<Array<string | null>>([]);
  const selectedIndex = options.findIndex((option) => option.value === currentValue);
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;
  const disabledIndices = options.flatMap((option, index) => (option.disabled ? [index] : []));
  listRef.current.length = options.length;
  labelsRef.current = options.map((option) => getOptionText(option.label));

  const handleOpenChange = (nextOpen: boolean) => {
    if (disabled) {
      return;
    }

    setIsOpen(nextOpen);
    setActiveIndex(
      nextOpen
        ? selectedIndex >= 0 && !options[selectedIndex]?.disabled
          ? selectedIndex
          : getFirstEnabledIndex(options)
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
  const role = useRole(context, { role: 'listbox' });
  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    selectedIndex: selectedIndex >= 0 ? selectedIndex : null,
    onNavigate: setActiveIndex,
    disabledIndices,
    focusItemOnOpen: true,
    loop: true,
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    onMatch: setActiveIndex,
    enabled: isOpen,
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
  }) as ButtonHTMLAttributes<HTMLButtonElement>;
  const floatingProps = getFloatingProps() as HTMLAttributes<HTMLElement>;
  const displayPlaceholder = placeholder ?? (locale === 'en-US' ? 'Select' : '请选择');

  const selectOption = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) {
      return;
    }

    if (option.value !== currentValue) {
      setCurrentValue(option.value);
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
        data-placeholder={selectedOption ? undefined : ''}
        data-expanded={isOpen ? '' : undefined}
      >
        <span className="lg-select__value">
          {selectedOption ? selectedOption.label : displayPlaceholder}
        </span>
        <span className="lg-select__arrow" aria-hidden="true" />
      </GlassSurface>

      {isMounted ? (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
            <GlassSurface
              {...floatingProps}
              ref={refs.setFloating}
              refraction="auto"
              className="lg-select__panel"
              style={floatingStyles}
              data-status={status}
              data-placement={resolvedPlacement}
            >
              <ScrollEdge className="lg-select__scroll" viewportClassName="lg-select__viewport">
                {options.map((option, index) => {
                  const itemProps = getItemProps({
                    onClick: () => selectOption(index),
                    onKeyDown: (event) => handleOptionKeyDown(event, index),
                  }) as HTMLAttributes<HTMLDivElement>;

                  return (
                    <div
                      {...itemProps}
                      key={option.value}
                      ref={(element) => {
                        listRef.current[index] = element;
                      }}
                      role="option"
                      tabIndex={activeIndex === index ? 0 : -1}
                      aria-selected={selectedIndex === index}
                      aria-disabled={option.disabled || undefined}
                      className="lg-select__option"
                      data-active={activeIndex === index ? '' : undefined}
                      data-selected={selectedIndex === index ? '' : undefined}
                      data-disabled={option.disabled ? '' : undefined}
                    >
                      {option.label}
                    </div>
                  );
                })}
              </ScrollEdge>
            </GlassSurface>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </span>
  );
});
