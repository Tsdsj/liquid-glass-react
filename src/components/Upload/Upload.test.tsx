import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Upload, type UploadFile } from './Upload';

function makeFile(name: string): File {
  return new File(['x'.repeat(8)], name, { type: 'text/plain' });
}

describe('Upload', () => {
  it('adds picked files to the list and hands the native File out through meta', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Upload aria-label="附件" onChange={onChange} />);

    const input = screen.getByTestId('lg-upload-input') as HTMLInputElement;
    await user.upload(input, makeFile('报告.txt'));

    expect(onChange).toHaveBeenCalledTimes(1);
    const [list, meta] = onChange.mock.calls[0] as [UploadFile[], { file: File | null; type: string }];
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ name: '报告.txt', status: 'ready' });
    expect(meta.type).toBe('add');
    expect(meta.file?.name).toBe('报告.txt');

    // Uncontrolled: the list renders the picked file.
    expect(screen.getByText('报告.txt')).toBeInTheDocument();
  });

  it('caps additions at maxCount', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Upload aria-label="附件" maxCount={1} onChange={onChange} />);

    const input = screen.getByTestId('lg-upload-input') as HTMLInputElement;
    await user.upload(input, makeFile('一.txt'));
    await user.upload(input, makeFile('二.txt'));

    // Second pick is ignored — still one file.
    const lastList = onChange.mock.calls.at(-1)?.[0] as UploadFile[];
    expect(lastList).toHaveLength(1);
    expect(screen.queryByText('二.txt')).not.toBeInTheDocument();
  });

  it('removes an item and reports the removal', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Upload
        aria-label="附件"
        defaultFileList={[{ key: 'k1', name: '既有.pdf', status: 'done' }]}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: '移除文件' }));
    const [list, meta] = onChange.mock.calls[0] as [UploadFile[], { file: File | null; type: string }];
    expect(list).toHaveLength(0);
    expect(meta.type).toBe('remove');
    expect(screen.queryByText('既有.pdf')).not.toBeInTheDocument();
  });

  it('renders progress for uploading items (controlled status)', () => {
    render(
      <Upload
        aria-label="附件"
        fileList={[{ key: 'k1', name: '大文件.zip', status: 'uploading', percent: 40 }]}
      />,
    );
    expect(screen.getByText('大文件.zip')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40');
  });

  it('disables picking when disabled', () => {
    render(<Upload aria-label="附件" disabled />);
    expect(screen.getByTestId('lg-upload-input')).toBeDisabled();
    // aria-label overrides the visible trigger text as the accessible name.
    expect(screen.getByRole('button', { name: '附件' })).toBeDisabled();
  });
});
