import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LiquidGlassConfig } from '../../core/config/LiquidGlassConfig';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders a nav with the current page marked and forwards its ref', () => {
    const ref = createRef<HTMLElement>();
    render(<Pagination ref={ref} total={95} defaultCurrent={1} />);

    expect(ref.current).toBe(screen.getByRole('navigation'));
    expect(screen.getByRole('button', { name: '第 1 页' })).toHaveAttribute('aria-current', 'page');
    // 95 items / 10 per page => 10 pages, last page reachable.
    expect(screen.getByRole('button', { name: '第 10 页' })).toBeInTheDocument();
  });

  it('changes page and reports it in uncontrolled mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination total={95} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '第 3 页' }));
    expect(onChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole('button', { name: '第 3 页' })).toHaveAttribute('aria-current', 'page');
  });

  it('reports without self-updating in controlled mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<Pagination total={95} current={2} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '下一页' }));
    expect(onChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole('button', { name: '第 2 页' })).toHaveAttribute('aria-current', 'page');

    rerender(<Pagination total={95} current={3} onChange={onChange} />);
    expect(screen.getByRole('button', { name: '第 3 页' })).toHaveAttribute('aria-current', 'page');
  });

  it('disables previous on the first page and next on the last page', () => {
    const { rerender } = render(<Pagination total={95} current={1} />);
    expect(screen.getByRole('button', { name: '上一页' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '下一页' })).not.toBeDisabled();

    rerender(<Pagination total={95} current={10} />);
    expect(screen.getByRole('button', { name: '下一页' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '上一页' })).not.toBeDisabled();
  });

  it('does not fire changes when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination total={95} disabled onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: '第 2 页' }));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: '第 2 页' })).toBeDisabled();
  });

  it('renders ellipses as non-interactive text', () => {
    const { container } = render(<Pagination total={200} defaultCurrent={10} />);
    const ellipsis = container.querySelector('.lg-pagination__ellipsis');
    expect(ellipsis).toBeInTheDocument();
    expect(ellipsis?.tagName).not.toBe('BUTTON');
  });

  it('localizes control labels to English', () => {
    render(
      <LiquidGlassConfig locale="en-US">
        <Pagination total={95} defaultCurrent={2} />
      </LiquidGlassConfig>,
    );
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument();
  });
});
