import { createRef } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LiquidGlassConfig } from '../../core/config/LiquidGlassConfig';
import { __resetGlassSupportCache } from '../../core/hooks/useGlassSupport';
import { Select, type SelectOption } from './Select';

const OPTIONS: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana', disabled: true },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
];

async function waitForClose(): Promise<void> {
  await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
}

describe('Select', () => {
  it('defaults to a Chinese placeholder and forwards ref to the trigger', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Select ref={ref} options={OPTIONS} aria-label="Fruit" />);

    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    expect(trigger).toHaveTextContent('请选择');
    expect(ref.current).toBe(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('uses the English placeholder from configuration', () => {
    render(
      <LiquidGlassConfig locale="en-US">
        <Select options={OPTIONS} aria-label="Fruit" />
      </LiquidGlassConfig>,
    );

    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveTextContent('Select');
  });

  it('updates itself and calls onChange in uncontrolled mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Select options={OPTIONS} defaultValue="apple" onChange={onChange} aria-label="Fruit" />,
    );
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });

    await user.click(trigger);
    expect(trigger).toHaveAttribute('data-expanded');
    expect(screen.getByRole('listbox')).toHaveAttribute('data-placement', 'bottom-start');
    await user.click(screen.getByRole('option', { name: 'Cherry' }));

    expect(onChange).toHaveBeenCalledWith('cherry');
    expect(trigger).toHaveTextContent('Cherry');
    expect(trigger).not.toHaveAttribute('data-expanded');
    await waitForClose();
  });

  it('reports changes without changing itself in controlled mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <Select options={OPTIONS} value="apple" onChange={onChange} aria-label="Fruit" />,
    );
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });

    await user.click(trigger);
    await user.click(screen.getByRole('option', { name: 'Cherry' }));

    expect(onChange).toHaveBeenCalledWith('cherry');
    expect(trigger).toHaveTextContent('Apple');

    rerender(
      <Select options={OPTIONS} value="cherry" onChange={onChange} aria-label="Fruit" />,
    );
    expect(trigger).toHaveTextContent('Cherry');
  });

  it.each(['{Enter}', ' '])('opens with %s and focuses the selected option', async (key) => {
    const user = userEvent.setup();
    render(<Select options={OPTIONS} defaultValue="cherry" aria-label="Fruit" />);
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });

    trigger.focus();
    await user.keyboard(key);

    expect(screen.getByRole('option', { name: 'Cherry' })).toHaveFocus();
  });

  it('opens with ArrowDown, skips disabled options, and selects with Enter', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select options={OPTIONS} onChange={onChange} aria-label="Fruit" />);
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });

    trigger.focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Apple' })).toHaveFocus();

    await user.keyboard('{ArrowDown}{Enter}');

    expect(onChange).toHaveBeenCalledWith('cherry');
    await waitForClose();
  });

  it('selects the active option with Space', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select options={OPTIONS} onChange={onChange} aria-label="Fruit" />);
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });

    await user.click(trigger);
    await user.keyboard('{ArrowDown} ');

    expect(onChange).toHaveBeenCalledWith('cherry');
    await waitForClose();
  });

  it('closes with Escape without selecting', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select options={OPTIONS} onChange={onChange} aria-label="Fruit" />);

    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await user.keyboard('{Escape}');

    expect(onChange).not.toHaveBeenCalled();
    await waitForClose();
  });

  it('closes with Tab', async () => {
    const user = userEvent.setup();
    render(<Select options={OPTIONS} aria-label="Fruit" />);

    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await user.keyboard('{Tab}');

    await waitForClose();
  });

  it('supports typeahead selection', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select options={OPTIONS} onChange={onChange} aria-label="Fruit" />);

    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await user.keyboard('g{Enter}');

    expect(onChange).toHaveBeenCalledWith('grape');
    await waitForClose();
  });

  it('closes when pressing outside', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Select options={OPTIONS} aria-label="Fruit" />
        <button type="button">Outside</button>
      </>,
    );

    await user.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await user.click(screen.getByRole('button', { name: 'Outside' }));

    await waitForClose();
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select options={OPTIONS} disabled onChange={onChange} aria-label="Fruit" />);
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });

    await user.click(trigger);

    expect(trigger).toBeDisabled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('Select refraction gating', () => {
  beforeEach(() => {
    __resetGlassSupportCache();
    vi.stubGlobal('CSS', { supports: vi.fn(() => true) });
    vi.stubGlobal('navigator', {
      userAgent: 'Mozilla/5.0 Chrome/136.0.0.0 Safari/537.36',
      userAgentData: { brands: [{ brand: 'Chromium' }] },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    __resetGlassSupportCache();
  });

  it('gates only the floating panel, never the trigger, and always releases it', async () => {
    render(<Select options={OPTIONS} aria-label="Fruit" />);
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    expect(trigger).not.toHaveAttribute('data-refraction-pending');

    fireEvent.click(trigger);

    const panel = await screen.findByRole('listbox');
    expect(panel).toHaveClass('lg-select__panel', 'lg-surface');
    expect(panel).toHaveAttribute('data-status');
    expect(panel).toHaveAttribute('data-refraction-pending');
    expect(trigger).not.toHaveAttribute('data-refraction-pending');

    await waitFor(
      () => expect(panel).not.toHaveAttribute('data-refraction-pending'),
      { timeout: 2000 },
    );
  });

  describe('multiple + searchable (M30)', () => {
    const FRUITS = [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'cherry', label: 'Cherry', disabled: true },
      { value: 'date', label: 'Date' },
    ];

    it('toggles values without closing and reports arrays', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Select aria-label="fruit" options={FRUITS} multiple onChange={onChange} />);

      await user.click(screen.getByRole('combobox', { name: 'fruit' }));
      const listbox = await screen.findByRole('listbox');
      expect(listbox).toHaveAttribute('aria-multiselectable', 'true');

      await user.click(screen.getByRole('option', { name: 'Apple' }));
      expect(onChange).toHaveBeenLastCalledWith(['apple']);
      // Panel stays open in multiple mode.
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      await user.click(screen.getByRole('option', { name: 'Date' }));
      expect(onChange).toHaveBeenLastCalledWith(['apple', 'date']);

      await user.click(screen.getByRole('option', { name: 'Apple' }));
      expect(onChange).toHaveBeenLastCalledWith(['date']);
    });

    it('shows selected values as tags and removes the last one with Backspace', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <Select
          aria-label="fruit"
          options={FRUITS}
          multiple
          defaultValue={['apple', 'date']}
          onChange={onChange}
        />,
      );

      const trigger = screen.getByRole('combobox', { name: 'fruit' });
      expect(trigger).toHaveTextContent('Apple');
      expect(trigger).toHaveTextContent('Date');

      trigger.focus();
      await user.keyboard('{Backspace}');
      expect(onChange).toHaveBeenLastCalledWith(['apple']);
    });

    it('filters options through the search input and selects with keyboard', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<Select aria-label="fruit" options={FRUITS} searchable onChange={onChange} />);

      await user.click(screen.getByRole('button', { name: 'fruit' }));
      const input = await screen.findByRole('combobox');
      await waitFor(() => expect(input).toHaveFocus());

      await user.type(input, 'da');
      expect(screen.getAllByRole('option')).toHaveLength(1);
      expect(screen.getByRole('option', { name: 'Date' })).toBeInTheDocument();

      await user.keyboard('{Enter}');
      expect(onChange).toHaveBeenLastCalledWith('date');
      await waitFor(() => expect(screen.queryByRole('option')).not.toBeInTheDocument());
    });

    it('shows an empty hint when nothing matches', async () => {
      const user = userEvent.setup();
      render(<Select aria-label="fruit" options={FRUITS} searchable />);

      await user.click(screen.getByRole('button', { name: 'fruit' }));
      const input = await screen.findByRole('combobox');
      await user.type(input, 'zzz');
      expect(screen.queryAllByRole('option')).toHaveLength(0);
      expect(screen.getByText('无匹配选项')).toBeInTheDocument();
    });
  });
});
