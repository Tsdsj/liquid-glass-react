import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useReducer,
  useRef,
  type ForwardedRef,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { useControllableState } from '../../core/hooks/useControllableState';
import { RadioGroupContext, type RadioGroupContextValue } from './RadioGroupContext';

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  children: ReactNode;
  'aria-label'?: string;
}

function assignRef(ref: ForwardedRef<HTMLDivElement>, value: HTMLDivElement | null): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

export const RadioGroup = /* @__PURE__ */ forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    value,
    defaultValue,
    onChange,
    name,
    size = 'md',
    disabled = false,
    orientation = 'horizontal',
    children,
    'aria-label': ariaLabel,
  },
  forwardedRef,
) {
  const generatedName = useId();
  const groupName = name ?? generatedName;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [currentValue, setCurrentValue] = useControllableState<string | undefined>({
    value,
    defaultValue,
    onChange: onChange as ((value: string | undefined) => void) | undefined,
  });

  // Radios register (in mount order) so the group can pick the roving tab stop:
  // the selected radio, or the first enabled one when nothing is selected.
  const itemsRef = useRef<Map<string, boolean>>(new Map());
  const [, forceRender] = useReducer((tick: number) => tick + 1, 0);
  const register = useCallback((itemValue: string, itemDisabled: boolean) => {
    itemsRef.current.set(itemValue, itemDisabled);
    forceRender();
    return () => {
      itemsRef.current.delete(itemValue);
      forceRender();
    };
  }, []);

  // Recomputed every render: registrations mutate itemsRef and trigger a
  // forceRender, so reading the ref here always reflects the current members.
  const registeredItems = Array.from(itemsRef.current.entries());
  const selectedItem = registeredItems.find(
    ([itemValue, itemDisabled]) => itemValue === currentValue && !itemDisabled,
  );
  const rovingValue = selectedItem
    ? selectedItem[0]
    : registeredItems.find(([, itemDisabled]) => !itemDisabled)?.[0];

  const handleSelect = useCallback(
    (nextValue: string) => {
      if (disabled) {
        return;
      }
      if (nextValue !== currentValue) {
        setCurrentValue(nextValue);
      }
    },
    [disabled, currentValue, setCurrentValue],
  );

  const contextValue = useMemo<RadioGroupContextValue>(
    () => ({
      name: groupName,
      value: currentValue,
      size,
      disabled,
      rovingValue,
      onSelect: handleSelect,
      register,
    }),
    [groupName, currentValue, size, disabled, rovingValue, handleSelect, register],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    let direction = 0;
    if (event.key === nextKey) {
      direction = 1;
    } else if (event.key === prevKey) {
      direction = -1;
    } else {
      return;
    }

    const root = rootRef.current;
    if (!root) {
      return;
    }
    const inputs = Array.from(
      root.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
    ).filter((input) => !input.disabled);
    if (inputs.length === 0) {
      return;
    }

    event.preventDefault();
    const currentIndex = inputs.findIndex((input) => input === event.target);
    const startIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (startIndex + direction + inputs.length) % inputs.length;
    const nextInput = inputs[nextIndex];
    nextInput.focus();
    handleSelect(nextInput.value);
  };

  const setRootRef = useCallback(
    (element: HTMLDivElement | null) => {
      rootRef.current = element;
      assignRef(forwardedRef, element);
    },
    [forwardedRef],
  );

  return (
    <div
      ref={setRootRef}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-orientation={orientation}
      aria-disabled={disabled ? true : undefined}
      className="lg-radio-group"
      data-size={size}
      data-orientation={orientation}
      data-disabled={disabled ? '' : undefined}
      onKeyDown={handleKeyDown}
    >
      <RadioGroupContext.Provider value={contextValue}>{children}</RadioGroupContext.Provider>
    </div>
  );
});
