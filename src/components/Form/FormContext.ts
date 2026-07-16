import { createContext, useContext } from 'react';
import type { FormStore } from './form-store';

export interface FormContextValue {
  store: FormStore;
  layout: 'vertical' | 'horizontal';
  disabled: boolean;
}

export const FormContext = createContext<FormContextValue | null>(null);

/** FormItem must live inside a Form. */
export function useFormContext(): FormContextValue {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('FormItem must be used within a <Form>.');
  }
  return context;
}
