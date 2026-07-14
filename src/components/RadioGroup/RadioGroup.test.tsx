import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

function Group(props: Partial<React.ComponentProps<typeof RadioGroup>>) {
  return (
    <RadioGroup aria-label="fruit" {...props}>
      <Radio value="apple">Apple</Radio>
      <Radio value="banana">Banana</Radio>
      <Radio value="cherry">Cherry</Radio>
    </RadioGroup>
  );
}

describe('RadioGroup', () => {
  it('exposes a radiogroup with named radios and forwards its ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Group ref={ref} defaultValue="apple" />);

    const group = screen.getByRole('radiogroup', { name: 'fruit' });
    expect(group).toHaveClass('lg-radio-group');
    expect(ref.current).toBe(group);
    expect(screen.getByRole('radio', { name: 'Apple' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Banana' })).not.toBeChecked();
  });

  it('selects on click and reports the value in uncontrolled mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Group defaultValue="apple" onChange={onChange} />);

    await user.click(screen.getByRole('radio', { name: 'Banana' }));

    expect(onChange).toHaveBeenCalledWith('banana');
    expect(screen.getByRole('radio', { name: 'Banana' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Apple' })).not.toBeChecked();
  });

  it('reports without self-updating in controlled mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<Group value="apple" onChange={onChange} />);

    await user.click(screen.getByRole('radio', { name: 'Cherry' }));

    expect(onChange).toHaveBeenCalledWith('cherry');
    expect(screen.getByRole('radio', { name: 'Apple' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Cherry' })).not.toBeChecked();

    rerender(<Group value="cherry" onChange={onChange} />);
    expect(screen.getByRole('radio', { name: 'Cherry' })).toBeChecked();
  });

  it('moves and selects with horizontal arrow keys, wrapping around', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Group defaultValue="apple" onChange={onChange} />);

    screen.getByRole('radio', { name: 'Apple' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Banana' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Banana' })).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith('banana');

    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('radio', { name: 'Apple' })).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith('apple');

    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('radio', { name: 'Cherry' })).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith('cherry');
  });

  it('uses up/down arrows when vertical', async () => {
    const user = userEvent.setup();
    render(<Group orientation="vertical" defaultValue="apple" />);

    screen.getByRole('radio', { name: 'Apple' }).focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Banana' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Banana' })).toBeChecked();

    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('radio', { name: 'Apple' })).toHaveFocus();
  });

  it('keeps a single tab stop via roving tabindex', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type="button">before</button>
        <Group defaultValue="banana" />
        <button type="button">after</button>
      </>,
    );

    const before = screen.getByRole('button', { name: 'before' });
    before.focus();
    await user.tab();
    expect(screen.getByRole('radio', { name: 'Banana' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'after' })).toHaveFocus();
  });

  it('makes the first enabled radio tabbable when nothing is selected', () => {
    render(<Group />);
    expect(screen.getByRole('radio', { name: 'Apple' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('radio', { name: 'Banana' })).toHaveAttribute('tabindex', '-1');
  });

  it('skips disabled radios during keyboard navigation', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RadioGroup aria-label="fruit" defaultValue="apple" onChange={onChange}>
        <Radio value="apple">Apple</Radio>
        <Radio value="banana" disabled>
          Banana
        </Radio>
        <Radio value="cherry">Cherry</Radio>
      </RadioGroup>,
    );

    screen.getByRole('radio', { name: 'Apple' }).focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('radio', { name: 'Cherry' })).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith('cherry');
    expect(screen.getByRole('radio', { name: 'Banana' })).toBeDisabled();
  });

  it('disables every radio and blocks selection when the group is disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Group defaultValue="apple" disabled onChange={onChange} />);

    const banana = screen.getByRole('radio', { name: 'Banana' });
    expect(banana).toBeDisabled();
    await user.click(banana);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('links every radio to a shared generated name', () => {
    render(<Group defaultValue="apple" />);
    const apple = screen.getByRole<HTMLInputElement>('radio', { name: 'Apple' });
    const banana = screen.getByRole<HTMLInputElement>('radio', { name: 'Banana' });
    expect(apple.name).toBeTruthy();
    expect(apple.name).toBe(banana.name);
  });

  it('honours a controlled value updated by the parent through arrow keys', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [value, setValue] = useState('apple');
      return (
        <RadioGroup aria-label="fruit" value={value} onChange={setValue}>
          <Radio value="apple">Apple</Radio>
          <Radio value="banana">Banana</Radio>
        </RadioGroup>
      );
    }

    render(<Controlled />);
    screen.getByRole('radio', { name: 'Apple' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Banana' })).toBeChecked();
  });
});
