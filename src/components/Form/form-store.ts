import { validateValue, type FormRule } from '../../core/utils/validate-rules';

export interface FieldRegistration {
  rules: FormRule[];
  required?: boolean;
  requiredMessage: string;
}

export interface FormSnapshot {
  values: Record<string, unknown>;
  errors: Record<string, string | null>;
}

type ValuesChangeListener = (
  changed: Record<string, unknown>,
  all: Record<string, unknown>,
) => void;

/**
 * The reactive heart of a Form. Holds field values + errors, drives validation
 * through the pure `validateValue`, and notifies subscribers (the Form and each
 * FormItem read it via useSyncExternalStore). A FormStore is created either
 * internally by `<Form>` or by `useForm()` for an external handle.
 */
export class FormStore {
  private values: Record<string, unknown> = {};
  private errors: Record<string, string | null> = {};
  private initialValues: Record<string, unknown> = {};
  private seeded = false;
  private readonly fields = new Map<string, FieldRegistration>();
  private readonly listeners = new Set<() => void>();
  private snapshot: FormSnapshot = { values: this.values, errors: this.errors };

  onValuesChange?: ValuesChangeListener;

  /** Seed initial values once (idempotent across re-renders / remounts). */
  initialize(initialValues: Record<string, unknown>): void {
    if (this.seeded) {
      return;
    }
    this.seeded = true;
    this.initialValues = { ...initialValues };
    this.values = { ...initialValues };
    this.commit();
  }

  private commit(): void {
    this.snapshot = { values: this.values, errors: this.errors };
    for (const listener of this.listeners) {
      listener();
    }
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): FormSnapshot => this.snapshot;

  registerField(name: string, registration: FieldRegistration): void {
    this.fields.set(name, registration);
  }

  unregisterField(name: string): void {
    this.fields.delete(name);
  }

  private rulesFor(name: string): FormRule[] {
    const registration = this.fields.get(name);
    if (!registration) {
      return [];
    }
    const rules = [...registration.rules];
    if (registration.required) {
      rules.unshift({ required: true, message: registration.requiredMessage });
    }
    return rules;
  }

  getValue(name: string): unknown {
    return this.values[name];
  }

  getValues(): Record<string, unknown> {
    return { ...this.values };
  }

  getError(name: string): string | null {
    return this.errors[name] ?? null;
  }

  setValue(name: string, value: unknown): void {
    this.values = { ...this.values, [name]: value };
    // Live-validate only fields already showing an error, so typing clears a
    // message but an untouched field isn't faulted before its first submit.
    if (this.errors[name]) {
      this.errors = { ...this.errors, [name]: validateValue(value, this.rulesFor(name), this.values) };
    }
    this.commit();
    this.onValuesChange?.({ [name]: value }, this.getValues());
  }

  validateField(name: string): boolean {
    const error = validateValue(this.values[name], this.rulesFor(name), this.values);
    this.errors = { ...this.errors, [name]: error };
    this.commit();
    return error === null;
  }

  validate(): boolean {
    const nextErrors: Record<string, string | null> = {};
    let valid = true;
    for (const name of this.fields.keys()) {
      const error = validateValue(this.values[name], this.rulesFor(name), this.values);
      nextErrors[name] = error;
      if (error) {
        valid = false;
      }
    }
    this.errors = nextErrors;
    this.commit();
    return valid;
  }

  reset(): void {
    this.values = { ...this.initialValues };
    this.errors = {};
    this.commit();
  }
}
