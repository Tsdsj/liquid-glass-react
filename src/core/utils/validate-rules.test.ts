import { describe, expect, it } from 'vitest';
import { validateValue, type FormRule } from './validate-rules';

describe('validateValue', () => {
  it('passes when there are no rules', () => {
    expect(validateValue('anything', [])).toBeNull();
  });

  describe('required', () => {
    const rules: FormRule[] = [{ required: true, message: '必填' }];

    it.each<[unknown, string]>([
      ['', 'empty string'],
      [null, 'null'],
      [undefined, 'undefined'],
      [false, 'false'],
      [[], 'empty array'],
    ])('fails for %s (%s)', (value) => {
      expect(validateValue(value, rules)).toBe('必填');
    });

    it.each<[unknown]>([['a'], [0], [true], [['x']]])('passes for %s', (value) => {
      expect(validateValue(value, rules)).toBeNull();
    });
  });

  describe('min / max', () => {
    it('treats a number value as its magnitude', () => {
      expect(validateValue(3, [{ min: 5, message: '至少5' }])).toBe('至少5');
      expect(validateValue(5, [{ min: 5, message: '至少5' }])).toBeNull();
      expect(validateValue(9, [{ max: 8, message: '至多8' }])).toBe('至多8');
    });

    it('treats a string value as its length', () => {
      expect(validateValue('ab', [{ min: 3, message: '太短' }])).toBe('太短');
      expect(validateValue('abc', [{ min: 3, message: '太短' }])).toBeNull();
      expect(validateValue('abcd', [{ max: 3, message: '太长' }])).toBe('太长');
    });

    it('skips an empty value (required is what guards emptiness)', () => {
      expect(validateValue('', [{ min: 3, message: '太短' }])).toBeNull();
    });
  });

  describe('pattern', () => {
    it('fails a non-matching non-empty string', () => {
      expect(validateValue('abc', [{ pattern: /^\d+$/, message: '只能数字' }])).toBe('只能数字');
    });

    it('passes a matching string and skips empty', () => {
      expect(validateValue('123', [{ pattern: /^\d+$/, message: '只能数字' }])).toBeNull();
      expect(validateValue('', [{ pattern: /^\d+$/, message: '只能数字' }])).toBeNull();
    });
  });

  describe('validator', () => {
    it('runs even on empty values and receives all form values', () => {
      const rule: FormRule = {
        validator: (value, all) => (value === all.confirm ? null : '两次不一致'),
      };
      expect(validateValue('a', [rule], { confirm: 'b' })).toBe('两次不一致');
      expect(validateValue('a', [rule], { confirm: 'a' })).toBeNull();
    });
  });

  it('returns the first failing rule in order', () => {
    const rules: FormRule[] = [
      { required: true, message: '必填' },
      { min: 3, message: '太短' },
    ];
    expect(validateValue('', rules)).toBe('必填');
    expect(validateValue('ab', rules)).toBe('太短');
    expect(validateValue('abc', rules)).toBeNull();
  });
});
