import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { Modal } from './index';

async function flushDialogGone(): Promise<void> {
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(), {
    timeout: 2000,
  });
}

afterEach(async () => {
  // Any dialog left open resolves out through Escape-equivalent teardown between
  // tests; the suite asserts removal explicitly in each test instead.
  document.body.innerHTML = '';
});

describe('Modal.confirm (M30)', () => {
  it('resolves true when the ok button is pressed and tears the dialog down', async () => {
    const user = userEvent.setup();
    const result = Modal.confirm({ title: '删除记录', content: '删除后不可恢复。' });

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveTextContent('删除后不可恢复。');

    await user.click(screen.getByRole('button', { name: '确定' }));
    await expect(result).resolves.toBe(true);
    await flushDialogGone();
    // Host container is removed from the body, not leaked (after the exit delay).
    await waitFor(() =>
      expect(document.querySelectorAll('.lg-modal-confirm-host')).toHaveLength(0),
    );
  });

  it('resolves false from the cancel button', async () => {
    const user = userEvent.setup();
    const result = Modal.confirm({ title: '离开页面?' });

    await screen.findByRole('dialog');
    await user.click(screen.getByRole('button', { name: '取消' }));
    await expect(result).resolves.toBe(false);
    await flushDialogGone();
  });

  it('resolves false on Escape', async () => {
    const user = userEvent.setup();
    const result = Modal.confirm({ title: '继续?' });

    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    await expect(result).resolves.toBe(false);
    await flushDialogGone();
  });

  it('honours locale and custom button text', async () => {
    const user = userEvent.setup();
    const first = Modal.confirm({ title: 'Leave?', locale: 'en-US' });
    await screen.findByRole('dialog');
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await expect(first).resolves.toBe(false);
    await flushDialogGone();

    const second = Modal.confirm({ title: '发布?', okText: '发布', cancelText: '再想想', danger: true });
    await screen.findByRole('dialog');
    await user.click(screen.getByRole('button', { name: '发布' }));
    await expect(second).resolves.toBe(true);
    await flushDialogGone();
  });
});
