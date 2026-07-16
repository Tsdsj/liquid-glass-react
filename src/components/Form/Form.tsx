import { useEffect, useMemo, useRef, type FormEvent, type ReactNode } from 'react';
import { cx } from '../../core/utils/cx';
import { FormContext, type FormContextValue } from './FormContext';
import { FormStore } from './form-store';
import { getStore, type FormInstance } from './useForm';

export interface FormProps<T = Record<string, unknown>> {
  /** External handle from `useForm()`; omit to let the Form own its state. */
  form?: FormInstance<T>;
  initialValues?: Partial<T>;
  onSubmit?: (values: T) => void | Promise<void>;
  onValuesChange?: (changed: Partial<T>, all: T) => void;
  layout?: 'vertical' | 'horizontal';
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export function Form<T = Record<string, unknown>>({
  form,
  initialValues,
  onSubmit,
  onValuesChange,
  layout = 'vertical',
  disabled = false,
  className,
  children,
}: FormProps<T>) {
  const internalStore = useRef<FormStore | null>(null);
  const store = form ? getStore(form) ?? (internalStore.current ??= new FormStore()) : (internalStore.current ??= new FormStore());

  // Seed initial values once (FormStore.initialize is idempotent).
  store.initialize((initialValues ?? {}) as Record<string, unknown>);

  useEffect(() => {
    store.onValuesChange = onValuesChange as FormStore['onValuesChange'];
    return () => {
      store.onValuesChange = undefined;
    };
  }, [store, onValuesChange]);

  const contextValue = useMemo<FormContextValue>(
    () => ({ store, layout, disabled }),
    [store, layout, disabled],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (store.validate()) {
      onSubmit?.(store.getValues() as T);
    }
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form
        className={cx('lg-form', className)}
        data-layout={layout}
        noValidate
        onSubmit={handleSubmit}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}
