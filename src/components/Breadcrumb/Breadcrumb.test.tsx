import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LiquidGlassConfig } from '../../core/config/LiquidGlassConfig';
import { Breadcrumb } from './Breadcrumb';

const ITEMS = [
  { label: 'Home', href: '#/' },
  { label: 'Library', href: '#/library' },
  { label: 'Data' },
];

describe('Breadcrumb', () => {
  it('renders a localized navigation landmark and forwards its ref', () => {
    const ref = createRef<HTMLElement>();
    render(<Breadcrumb ref={ref} items={ITEMS} />);

    const nav = screen.getByRole('navigation', { name: '面包屑' });
    expect(ref.current).toBe(nav);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '#/');
  });

  it('renders the last item as current-page plain text, not a link', () => {
    render(<Breadcrumb items={ITEMS} />);

    const last = screen.getByText('Data');
    expect(last).toHaveAttribute('aria-current', 'page');
    expect(last.closest('a')).toBeNull();
    expect(last.closest('button')).toBeNull();
  });

  it('renders a button and fires onClick for items without href', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Breadcrumb
        items={[{ label: 'Root', onClick }, { label: 'Leaf' }]}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Root' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders decorative separators that are hidden from assistive tech', () => {
    const { container } = render(<Breadcrumb items={ITEMS} separator="›" />);
    const separators = container.querySelectorAll('.lg-breadcrumb__separator');
    expect(separators.length).toBe(2);
    separators.forEach((sep) => {
      expect(sep).toHaveAttribute('aria-hidden', 'true');
      expect(sep).toHaveTextContent('›');
    });
  });

  it('localizes the navigation label to English', () => {
    render(
      <LiquidGlassConfig locale="en-US">
        <Breadcrumb items={ITEMS} />
      </LiquidGlassConfig>,
    );
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });
});
