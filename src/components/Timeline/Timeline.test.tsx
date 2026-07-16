import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Timeline, type TimelineItem } from './Timeline';

const ITEMS: TimelineItem[] = [
  { key: 'a', content: '创建项目', time: '09:00' },
  { key: 'b', content: '部署成功', time: '10:30', color: 'success' },
  { key: 'c', content: '构建失败', color: 'danger', dot: <span data-testid="custom-dot">!</span> },
];

describe('Timeline', () => {
  it('renders a semantic list with content and time', () => {
    render(<Timeline items={ITEMS} />);
    const listitems = screen.getAllByRole('listitem');
    expect(listitems).toHaveLength(3);
    expect(listitems[0]).toHaveTextContent('创建项目');
    expect(listitems[0]).toHaveTextContent('09:00');
  });

  it('exposes the semantic color and accepts a custom dot', () => {
    render(<Timeline items={ITEMS} />);
    const listitems = screen.getAllByRole('listitem');
    expect(listitems[1]).toHaveAttribute('data-color', 'success');
    expect(screen.getByTestId('custom-dot')).toBeInTheDocument();
  });
});
