import { useCallback, useEffect, useRef, useState } from 'react';

export interface ControllableStateOptions<T> {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: ControllableStateOptions<T>): [T, (value: T) => void] {
  const isControlled = value !== undefined;
  const initialIsControlled = useRef(isControlled);
  const hasWarned = useRef(false);
  const [internalValue, setInternalValue] = useState(defaultValue);

  useEffect(() => {
    if (
      import.meta.env.DEV &&
      initialIsControlled.current !== isControlled &&
      !hasWarned.current
    ) {
      hasWarned.current = true;
      console.warn('Liquid Glass components must not switch between controlled and uncontrolled state.');
    }
  }, [isControlled]);

  const currentValue = isControlled ? (value as T) : internalValue;

  const setValue = useCallback(
    (nextValue: T) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onChange?.(nextValue);
    },
    [isControlled, onChange],
  );

  return [currentValue, setValue];
}
