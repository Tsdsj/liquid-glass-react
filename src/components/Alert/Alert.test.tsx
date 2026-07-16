import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Alert } from './Alert';

describe('Alert', () => {
  it('uses status role for info/success and alert role for warning/danger', () => {
    const { rerender } = render(<Alert kind="info">提示</Alert>);
    expect(screen.getByRole('status')).toHaveTextContent('提示');

    rerender(<Alert kind="danger">危险</Alert>);
    expect(screen.getByRole('alert')).toHaveTextContent('危险');
  });

  it('renders a close button that fires onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Alert kind="warning" closable onClose={onClose}>
        注意
      </Alert>,
    );

    await user.click(screen.getByRole('button', { name: '关闭' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('omits the icon when icon is false', () => {
    const { container } = render(
      <Alert kind="info" icon={false}>
        无图标
      </Alert>,
    );
    expect(container.querySelector('.lg-alert__icon')).toBeNull();
  });
});
