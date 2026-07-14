import { createContext, useContext } from 'react';

export interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  /** The single radio that should be reachable with Tab (roving tabindex). */
  rovingValue: string | undefined;
  onSelect: (value: string) => void;
  /** Registers a radio's value + disabled state; returns an unregister cleanup. */
  register: (value: string, disabled: boolean) => () => void;
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function useRadioGroupContext(): RadioGroupContextValue {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error('Radio must be rendered inside a RadioGroup.');
  }
  return context;
}
