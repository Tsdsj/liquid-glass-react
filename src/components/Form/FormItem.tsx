import {
  cloneElement,
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  type FocusEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { useLiquidGlassContext } from '../../core/config/LiquidGlassConfig';
import { cx } from '../../core/utils/cx';
import type { FormRule } from '../../core/utils/validate-rules';
import { useFormContext } from './FormContext';

export interface FormItemProps {
  name: string;
  label?: ReactNode;
  required?: boolean;
  rules?: FormRule[];
  help?: ReactNode;
  /** Prop the control reads its value from. Default 'value'; use 'checked' for Checkbox/Switch. */
  valuePropName?: string;
  /** Handler the control fires on change. Default 'onChange'; e.g. 'onCheckedChange'. */
  trigger?: string;
  /** Map the trigger's arguments to the stored value. Defaults to unwrapping a DOM event. */
  getValueFromEvent?: (...args: unknown[]) => unknown;
  children: ReactElement;
}

const REQUIRED_MESSAGE = {
  'zh-CN': '此项为必填',
  'en-US': 'This field is required',
} as const;

// Input/Textarea fire a DOM event → read target.value; Select/Slider/Radio fire
// the value directly; Checkbox/Switch fire a boolean via onCheckedChange.
function defaultGetValueFromEvent(raw: unknown): unknown {
  if (raw && typeof raw === 'object' && 'target' in raw) {
    const target = (raw as { target?: { value?: unknown } }).target;
    if (target && typeof target === 'object' && 'value' in target) {
      return target.value;
    }
  }
  return raw;
}

export function FormItem({
  name,
  label,
  required = false,
  rules,
  help,
  valuePropName = 'value',
  trigger = 'onChange',
  getValueFromEvent,
  children,
}: FormItemProps) {
  const { store, layout, disabled: formDisabled } = useFormContext();
  const { locale } = useLiquidGlassContext();
  const reactId = useId();
  const controlId = `${reactId}-control`;
  const errorId = `${reactId}-error`;
  const helpId = `${reactId}-help`;

  const requiredMessage = REQUIRED_MESSAGE[locale];
  const registrationRef = useRef({ rules: rules ?? [], required, requiredMessage });
  registrationRef.current = { rules: rules ?? [], required, requiredMessage };

  // Re-register on every commit so rule/required changes stay current; drop the
  // field on unmount so a removed field is not validated on submit.
  useEffect(() => {
    store.registerField(name, registrationRef.current);
  });
  useEffect(() => () => store.unregisterField(name), [store, name]);

  // Third arg (server snapshot) keeps renderToString from throwing; the store is
  // seeded synchronously by <Form> so the same snapshot is valid on the server.
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  const rawValue = snapshot.values[name];
  const error = snapshot.errors[name] ?? null;

  const childProps = children.props as Record<string, unknown>;

  const handleTrigger = (...args: unknown[]) => {
    const nextValue = getValueFromEvent
      ? getValueFromEvent(...args)
      : defaultGetValueFromEvent(args[0]);
    store.setValue(name, nextValue);
    const original = childProps[trigger];
    if (typeof original === 'function') {
      (original as (...a: unknown[]) => void)(...args);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    store.validateField(name);
    const original = childProps.onBlur;
    if (typeof original === 'function') {
      (original as (e: FocusEvent<HTMLElement>) => void)(event);
    }
  };

  const injectedValue = rawValue === undefined ? (valuePropName === 'checked' ? false : '') : rawValue;
  const describedBy = error ? errorId : help ? helpId : (childProps['aria-describedby'] as string | undefined);

  const injectedProps: Record<string, unknown> = {
    [valuePropName]: injectedValue,
    [trigger]: handleTrigger,
    onBlur: handleBlur,
    id: controlId,
    disabled: formDisabled || (childProps.disabled as boolean | undefined),
    'aria-invalid': error ? 'true' : undefined,
    'aria-required': required ? 'true' : undefined,
    'aria-describedby': describedBy,
  };
  const control = cloneElement(children as ReactElement<Record<string, unknown>>, injectedProps);

  return (
    <div
      className={cx('lg-form-item')}
      data-layout={layout}
      data-required={required ? '' : undefined}
      data-invalid={error ? '' : undefined}
    >
      {label ? (
        // The required marker is a CSS ::after '*', so it never enters the
        // label's text (keeps the control's accessible name clean) and screen
        // readers rely on the injected aria-required instead.
        <label className="lg-form-item__label" htmlFor={controlId}>
          {label}
        </label>
      ) : null}
      <div className="lg-form-item__control">{control}</div>
      {error ? (
        <p className="lg-form-item__error" id={errorId} role="alert">
          {error}
        </p>
      ) : help ? (
        <p className="lg-form-item__help" id={helpId}>
          {help}
        </p>
      ) : null}
    </div>
  );
}
