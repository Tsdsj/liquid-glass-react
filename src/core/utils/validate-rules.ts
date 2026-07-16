export type FormRule =
  | { required: true; message: string }
  | { min: number; message: string }
  | { max: number; message: string }
  | { pattern: RegExp; message: string }
  | { validator: (value: unknown, all: Record<string, unknown>) => string | null };

/** Empty for validation purposes: also treats `false` (unchecked) as empty. */
function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined || value === '' || value === false) {
    return true;
  }
  return Array.isArray(value) && value.length === 0;
}

/** Numbers compare by magnitude; strings and arrays compare by length. */
function sizeOf(value: unknown): number | null {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length;
  }
  return null;
}

/**
 * Evaluate a value against an ordered rule list and return the first failing
 * rule's message, or `null` when every rule passes. Pure — the Form store and
 * FormItem both drive validation through this.
 *
 * `required` and `validator` always run; `min`/`max`/`pattern` skip an empty
 * value so a non-required field is not faulted for being blank.
 */
export function validateValue(
  value: unknown,
  rules: FormRule[],
  all: Record<string, unknown> = {},
): string | null {
  for (const rule of rules) {
    if ('required' in rule) {
      if (isEmpty(value)) {
        return rule.message;
      }
      continue;
    }
    if ('validator' in rule) {
      const result = rule.validator(value, all);
      if (result) {
        return result;
      }
      continue;
    }
    if (isEmpty(value)) {
      continue;
    }
    if ('min' in rule) {
      const size = sizeOf(value);
      if (size !== null && size < rule.min) {
        return rule.message;
      }
    } else if ('max' in rule) {
      const size = sizeOf(value);
      if (size !== null && size > rule.max) {
        return rule.message;
      }
    } else if ('pattern' in rule) {
      if (typeof value === 'string' && !rule.pattern.test(value)) {
        return rule.message;
      }
    }
  }
  return null;
}
