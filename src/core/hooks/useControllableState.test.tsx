import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useControllableState } from './useControllableState';

describe('useControllableState', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('updates internal state in uncontrolled mode', () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: 'initial', onChange }),
    );

    act(() => result.current[1]('next'));

    expect(result.current[0]).toBe('next');
    expect(onChange).toHaveBeenCalledWith('next');
  });

  it('reports changes without mutating a controlled value', () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) =>
        useControllableState({ value, defaultValue: 'initial', onChange }),
      { initialProps: { value: 'controlled' } },
    );

    act(() => result.current[1]('requested'));

    expect(result.current[0]).toBe('controlled');
    expect(onChange).toHaveBeenCalledWith('requested');

    rerender({ value: 'updated' });
    expect(result.current[0]).toBe('updated');
  });

  it('warns when switching between uncontrolled and controlled modes', async () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const initialProps: { value: string | undefined } = { value: undefined };
    const { rerender } = renderHook(
      ({ value }: { value: string | undefined }) =>
        useControllableState({ value, defaultValue: 'initial' }),
      { initialProps },
    );

    rerender({ value: 'controlled' });

    await waitFor(() => expect(warning).toHaveBeenCalledTimes(1));
  });
});
