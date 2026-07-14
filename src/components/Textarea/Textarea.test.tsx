import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('forwards native attributes, ref, className, and style', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(
      <Textarea
        ref={ref}
        className="custom-textarea"
        style={{ marginTop: '12px' }}
        name="message"
        aria-label="Message"
      />,
    );

    const textarea = screen.getByRole('textbox', { name: 'Message' });
    const root = textarea.closest('.lg-textarea');
    expect(textarea).toHaveAttribute('name', 'message');
    expect(ref.current).toBe(textarea);
    expect(root).toHaveClass('custom-textarea');
    expect(root).toHaveStyle({ marginTop: '12px' });
  });

  it('preserves native controlled textarea behavior', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <Textarea value="old" onChange={onChange} aria-label="Message" />,
    );
    const textarea = screen.getByRole('textbox', { name: 'Message' });

    await user.type(textarea, 'x');

    expect(onChange).toHaveBeenCalled();
    expect(textarea).toHaveValue('old');

    rerender(<Textarea value="new" onChange={onChange} aria-label="Message" />);
    expect(textarea).toHaveValue('new');
  });

  it('preserves native uncontrolled textarea behavior', async () => {
    const user = userEvent.setup();
    render(<Textarea defaultValue="old" aria-label="Message" />);
    const textarea = screen.getByRole('textbox', { name: 'Message' });

    await user.clear(textarea);
    await user.type(textarea, 'new');

    expect(textarea).toHaveValue('new');
  });

  it('focuses the textarea when its container is clicked', () => {
    render(<Textarea aria-label="Message" />);
    const textarea = screen.getByRole('textbox', { name: 'Message' });

    fireEvent.click(textarea.closest('.lg-textarea') as Element);

    expect(textarea).toHaveFocus();
  });

  it('exposes invalid state through aria and data attributes', () => {
    render(<Textarea invalid aria-label="Message" />);
    const textarea = screen.getByRole('textbox', { name: 'Message' });

    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea.closest('.lg-textarea')).toHaveAttribute('data-invalid');
  });

  it('auto-resizes on input while preserving the native onInput callback', () => {
    const onInput = vi.fn();
    render(<Textarea autoResize onInput={onInput} aria-label="Message" />);
    const textarea = screen.getByRole<HTMLTextAreaElement>('textbox', { name: 'Message' });
    Object.defineProperty(textarea, 'scrollHeight', { configurable: true, value: 120 });

    fireEvent.input(textarea, { target: { value: 'More content' } });

    expect(textarea).toHaveStyle({ height: '120px' });
    expect(onInput).toHaveBeenCalledTimes(1);
  });

  it('syncs auto-resize when a controlled value changes externally', () => {
    let scrollHeight = 80;
    const { rerender } = render(
      <Textarea autoResize value="short" onChange={() => undefined} aria-label="Message" />,
    );
    const textarea = screen.getByRole<HTMLTextAreaElement>('textbox', { name: 'Message' });
    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      get: () => scrollHeight,
    });
    scrollHeight = 140;

    rerender(
      <Textarea autoResize value="long content" onChange={() => undefined} aria-label="Message" />,
    );

    expect(textarea).toHaveStyle({ height: '140px' });
  });

  it('uses native disabled behavior', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea disabled onChange={onChange} aria-label="Message" />);
    const textarea = screen.getByRole('textbox', { name: 'Message' });

    await user.type(textarea, 'test');

    expect(textarea).toBeDisabled();
    expect(textarea).toHaveValue('');
    expect(onChange).not.toHaveBeenCalled();
  });
});
