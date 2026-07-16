import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Steps, type StepItem } from './Steps';

const ITEMS: StepItem[] = [
  { key: 'a', title: '第一步' },
  { key: 'b', title: '第二步', description: '进行中' },
  { key: 'c', title: '第三步' },
];

describe('Steps', () => {
  it('marks finished, current and waiting steps and flags the current one', () => {
    render(<Steps items={ITEMS} current={1} />);

    const listitems = screen.getAllByRole('listitem');
    expect(listitems[0]).toHaveAttribute('data-status', 'finish');
    expect(listitems[1]).toHaveAttribute('data-status', 'process');
    expect(listitems[1]).toHaveAttribute('aria-current', 'step');
    expect(listitems[2]).toHaveAttribute('data-status', 'wait');
    expect(listitems[2]).not.toHaveAttribute('aria-current');
  });

  it('reflects direction and size', () => {
    const { container } = render(
      <Steps items={ITEMS} current={0} direction="vertical" size="lg" />,
    );
    expect(container.querySelector('.lg-steps')).toHaveAttribute('data-direction', 'vertical');
    expect(container.querySelector('.lg-steps')).toHaveAttribute('data-size', 'lg');
  });
});
