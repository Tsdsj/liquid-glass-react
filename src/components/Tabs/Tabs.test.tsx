import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { __resetFilterRegistry, filterRegistry } from '../../core/filter/filter-registry';
import { Tabs } from './Tabs';

const ITEMS = [
  { key: 'overview', label: 'Overview', content: 'Overview panel' },
  { key: 'pricing', label: 'Pricing', content: 'Pricing panel' },
  { key: 'faq', label: 'FAQ', content: 'FAQ panel' },
];

describe('Tabs', () => {
  it('wires tablist/tab/tabpanel roles and forwards its ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Tabs ref={ref} aria-label="docs" items={ITEMS} defaultValue="overview" />);

    const list = screen.getByRole('tablist', { name: 'docs' });
    expect(ref.current).toHaveClass('lg-tabs');
    expect(list).toBeInTheDocument();

    const tab = screen.getByRole('tab', { name: 'Overview' });
    const panel = screen.getByRole('tabpanel');
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
    expect(panel).toHaveTextContent('Overview panel');
  });

  it('only renders the active panel in the DOM', () => {
    render(<Tabs aria-label="docs" items={ITEMS} defaultValue="overview" />);
    expect(screen.getByText('Overview panel')).toBeInTheDocument();
    expect(screen.queryByText('Pricing panel')).not.toBeInTheDocument();
    expect(screen.queryByText('FAQ panel')).not.toBeInTheDocument();
  });

  it('defaults to the first enabled tab', () => {
    render(
      <Tabs
        aria-label="docs"
        items={[
          { key: 'overview', label: 'Overview', disabled: true, content: 'Overview panel' },
          { key: 'pricing', label: 'Pricing', content: 'Pricing panel' },
        ]}
      />,
    );
    expect(screen.getByRole('tab', { name: 'Pricing' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Pricing panel')).toBeInTheDocument();
  });

  it('switches panels on click and reports the key in uncontrolled mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs aria-label="docs" items={ITEMS} defaultValue="overview" onChange={onChange} />);

    await user.click(screen.getByRole('tab', { name: 'Pricing' }));

    expect(onChange).toHaveBeenCalledWith('pricing');
    expect(screen.getByText('Pricing panel')).toBeInTheDocument();
    expect(screen.queryByText('Overview panel')).not.toBeInTheDocument();
  });

  it('reports without self-updating in controlled mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <Tabs aria-label="docs" items={ITEMS} value="overview" onChange={onChange} />,
    );

    await user.click(screen.getByRole('tab', { name: 'FAQ' }));
    expect(onChange).toHaveBeenCalledWith('faq');
    expect(screen.getByText('Overview panel')).toBeInTheDocument();

    rerender(<Tabs aria-label="docs" items={ITEMS} value="faq" onChange={onChange} />);
    expect(screen.getByText('FAQ panel')).toBeInTheDocument();
  });

  it('activates automatically as arrows and Home/End move focus, skipping disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Tabs
        aria-label="docs"
        defaultValue="overview"
        onChange={onChange}
        items={[
          { key: 'overview', label: 'Overview', content: 'Overview panel' },
          { key: 'pricing', label: 'Pricing', disabled: true, content: 'Pricing panel' },
          { key: 'faq', label: 'FAQ', content: 'FAQ panel' },
        ]}
      />,
    );

    screen.getByRole('tab', { name: 'Overview' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'FAQ' })).toHaveFocus();
    expect(onChange).toHaveBeenLastCalledWith('faq');
    expect(screen.getByText('FAQ panel')).toBeInTheDocument();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();

    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'FAQ' })).toHaveFocus();

    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
  });

  it('keeps a single tab stop via roving tabindex', () => {
    render(<Tabs aria-label="docs" items={ITEMS} defaultValue="pricing" />);
    expect(screen.getByRole('tab', { name: 'Pricing' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('tab', { name: 'FAQ' })).toHaveAttribute('tabindex', '-1');
  });

  it('does not activate a disabled tab on click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Tabs
        aria-label="docs"
        defaultValue="overview"
        onChange={onChange}
        items={[
          { key: 'overview', label: 'Overview', content: 'Overview panel' },
          { key: 'pricing', label: 'Pricing', disabled: true, content: 'Pricing panel' },
        ]}
      />,
    );

    await user.click(screen.getByRole('tab', { name: 'Pricing' }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText('Overview panel')).toBeInTheDocument();
  });

  it('does not rebuild any glass filter when the indicator slides', async () => {
    const user = userEvent.setup();
    __resetFilterRegistry();
    render(<Tabs aria-label="docs" items={ITEMS} defaultValue="overview" />);

    const before = filterRegistry.getSnapshot().length;
    await user.click(screen.getByRole('tab', { name: 'FAQ' }));
    await user.click(screen.getByRole('tab', { name: 'Pricing' }));

    expect(filterRegistry.getSnapshot().length).toBe(before);
  });

  it('reflects a controlled value driven by the parent', async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [value, setValue] = useState('overview');
      return <Tabs aria-label="docs" items={ITEMS} value={value} onChange={setValue} />;
    }

    render(<Controlled />);
    await user.click(screen.getByRole('tab', { name: 'FAQ' }));
    expect(screen.getByText('FAQ panel')).toBeInTheDocument();
  });
});
