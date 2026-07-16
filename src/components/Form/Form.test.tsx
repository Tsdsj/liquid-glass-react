import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from '../Checkbox';
import { Input } from '../Input';
import { Form } from './Form';
import { FormItem } from './FormItem';
import { useForm } from './useForm';

describe('Form', () => {
  it('associates the label with the control and submits collected values', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ email: '' }} onSubmit={onSubmit}>
        <FormItem name="email" label="邮箱">
          <Input />
        </FormItem>
        <button type="submit">提交</button>
      </Form>,
    );

    await user.type(screen.getByLabelText('邮箱'), 'a@b.com');
    await user.click(screen.getByRole('button', { name: '提交' }));

    expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.com' });
  });

  it('blocks submit and surfaces the error with a11y wiring when required fails', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ email: '' }} onSubmit={onSubmit}>
        <FormItem name="email" label="邮箱" required>
          <Input />
        </FormItem>
        <button type="submit">提交</button>
      </Form>,
    );

    await user.click(screen.getByRole('button', { name: '提交' }));

    expect(onSubmit).not.toHaveBeenCalled();
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('此项为必填');
    const input = screen.getByLabelText('邮箱');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', alert.id);
  });

  it('clears the error once fixed and then submits', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ email: '' }} onSubmit={onSubmit}>
        <FormItem name="email" label="邮箱" rules={[{ pattern: /@/, message: '邮箱格式不对' }]} required>
          <Input />
        </FormItem>
        <button type="submit">提交</button>
      </Form>,
    );

    await user.click(screen.getByRole('button', { name: '提交' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('此项为必填');

    await user.type(screen.getByLabelText('邮箱'), 'x@y.com');
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: '提交' }));
    expect(onSubmit).toHaveBeenCalledWith({ email: 'x@y.com' });
  });

  it('injects a boolean control through valuePropName / trigger', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ agree: false }} onSubmit={onSubmit}>
        <FormItem name="agree" valuePropName="checked" trigger="onCheckedChange">
          <Checkbox>同意条款</Checkbox>
        </FormItem>
        <button type="submit">提交</button>
      </Form>,
    );

    await user.click(screen.getByLabelText('同意条款'));
    await user.click(screen.getByRole('button', { name: '提交' }));

    expect(onSubmit).toHaveBeenCalledWith({ agree: true });
  });

  it('disables the injected control when the whole form is disabled', () => {
    render(
      <Form initialValues={{ email: '' }} disabled>
        <FormItem name="email" label="邮箱">
          <Input />
        </FormItem>
      </Form>,
    );

    expect(screen.getByLabelText('邮箱')).toBeDisabled();
  });

  it('drives values through an external useForm instance', async () => {
    const user = userEvent.setup();

    function Wrapper() {
      const form = useForm<{ name: string }>();
      return (
        <>
          <Form form={form} initialValues={{ name: '' }}>
            <FormItem name="name" label="昵称">
              <Input />
            </FormItem>
          </Form>
          <button type="button" onClick={() => form.setValue('name', '液态')}>
            外部赋值
          </button>
          <button type="button" onClick={() => form.reset()}>
            重置
          </button>
        </>
      );
    }

    render(<Wrapper />);
    const input = screen.getByLabelText<HTMLInputElement>('昵称');

    await user.click(screen.getByRole('button', { name: '外部赋值' }));
    expect(input).toHaveValue('液态');

    await user.click(screen.getByRole('button', { name: '重置' }));
    expect(input).toHaveValue('');
  });
});
