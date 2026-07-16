import { useRef } from 'react';
import { FormStore } from './form-store';

export interface FormInstance<T = Record<string, unknown>> {
  getValues(): T;
  setValue(name: keyof T & string, value: unknown): void;
  validate(): Promise<boolean>;
  reset(): void;
}

// The store backing each instance is kept off the public type so consumers only
// see the four documented methods; <Form> retrieves it via getStore().
const STORE_BY_INSTANCE = new WeakMap<object, FormStore>();

export function getStore(instance: FormInstance<unknown>): FormStore | undefined {
  return STORE_BY_INSTANCE.get(instance);
}

/**
 * Create a stable external Form handle. Pass it to `<Form form={form}>` to read
 * and drive the form imperatively (`getValues` / `setValue` / `validate` /
 * `reset`) from outside the tree.
 */
export function useForm<T = Record<string, unknown>>(): FormInstance<T> {
  const ref = useRef<FormInstance<T> | null>(null);
  if (!ref.current) {
    const store = new FormStore();
    const instance: FormInstance<T> = {
      getValues: () => store.getValues() as T,
      setValue: (name, value) => store.setValue(name, value),
      validate: async () => store.validate(),
      reset: () => store.reset(),
    };
    STORE_BY_INSTANCE.set(instance, store);
    ref.current = instance;
  }
  return ref.current;
}
