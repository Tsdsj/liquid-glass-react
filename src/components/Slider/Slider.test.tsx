import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Slider } from './Slider';

describe('Slider', () => {
  it('renders defaults and forwards its ref to the native range input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Slider ref={ref} aria-label="Volume" />);

    const input = screen.getByRole('slider', { name: 'Volume' });
    expect(input).toHaveAttribute('type', 'range');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
    expect(input).toHaveAttribute('step', '1');
    expect(input).toHaveValue('0');
    expect(ref.current).toBe(input);
    expect(input.closest('.lg-slider')).toHaveAttribute('data-size', 'md');
  });

  it('updates itself and calls onChange in uncontrolled mode', () => {
    const onChange = vi.fn();
    render(<Slider defaultValue={25} onChange={onChange} aria-label="Volume" />);
    const input = screen.getByRole('slider', { name: 'Volume' });

    fireEvent.change(input, { target: { value: '60' } });

    expect(input).toHaveValue('60');
    expect(onChange).toHaveBeenCalledWith(60);
  });

  it('reports changes without changing itself in controlled mode', () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <Slider value={25} onChange={onChange} aria-label="Volume" />,
    );
    const input = screen.getByRole('slider', { name: 'Volume' });

    fireEvent.change(input, { target: { value: '60' } });

    expect(onChange).toHaveBeenCalledWith(60);
    expect(input).toHaveValue('25');

    rerender(<Slider value={60} onChange={onChange} aria-label="Volume" />);
    expect(input).toHaveValue('60');
  });

  it('calls onChangeEnd with the last drag value on pointer release', () => {
    const onChangeEnd = vi.fn();
    render(
      <Slider defaultValue={25} onChangeEnd={onChangeEnd} aria-label="Volume" />,
    );
    const input = screen.getByRole('slider', { name: 'Volume' });

    fireEvent.change(input, { target: { value: '70' } });
    fireEvent.pointerUp(input);

    expect(onChangeEnd).toHaveBeenCalledWith(70);
  });

  it('uses native keyboard interaction and ends changes on relevant key release', async () => {
    const user = userEvent.setup();
    const onChangeEnd = vi.fn();
    render(
      <Slider
        defaultValue={50}
        min={10}
        max={90}
        step={5}
        onChangeEnd={onChangeEnd}
        aria-label="Volume"
      />,
    );
    const input = screen.getByRole('slider', { name: 'Volume' });

    input.focus();
    await user.keyboard('{ArrowRight}');
    fireEvent.keyUp(input, { key: 'Home' });
    fireEvent.keyUp(input, { key: 'End' });

    expect(input).toHaveAttribute('min', '10');
    expect(input).toHaveAttribute('max', '90');
    expect(input).toHaveAttribute('step', '5');
    expect(onChangeEnd).toHaveBeenCalledTimes(3);
  });

  it('does not change or call back when disabled', () => {
    const onChange = vi.fn();
    const onChangeEnd = vi.fn();
    render(
      <Slider
        defaultValue={25}
        disabled
        onChange={onChange}
        onChangeEnd={onChangeEnd}
        aria-label="Volume"
      />,
    );
    const input = screen.getByRole('slider', { name: 'Volume' });

    fireEvent.change(input, { target: { value: '70' } });
    fireEvent.pointerUp(input);

    expect(input).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
    expect(onChangeEnd).not.toHaveBeenCalled();
  });

  it('uses a non-refracting glass thumb', () => {
    render(<Slider defaultValue={50} aria-label="Volume" />);
    const input = screen.getByRole('slider', { name: 'Volume' });
    const thumb = input.closest('.lg-slider')?.querySelector('.lg-slider__thumb');

    expect(thumb).toHaveAttribute('data-refraction', 'off');
  });
});
