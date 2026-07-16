import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Empty } from './Empty';

describe('Empty', () => {
  it('renders title, description and an action slot', () => {
    render(
      <Empty title="空空如也" description="还没有数据">
        <button type="button">新建</button>
      </Empty>,
    );

    expect(screen.getByText('空空如也')).toBeInTheDocument();
    expect(screen.getByText('还没有数据')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '新建' })).toBeInTheDocument();
  });

  it('uses a custom image when provided', () => {
    render(<Empty image={<span data-testid="art">🗂️</span>} />);
    expect(screen.getByTestId('art')).toBeInTheDocument();
  });
});
