import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Input } from '../Input';
import { Form } from './Form';
import { FormItem } from './FormItem';

const meta: Meta<typeof Form> = {
  title: 'Data entry/Form',
  component: Form,
};
export default meta;

type Story = StoryObj<typeof Form>;

function LoginForm({ layout }: { layout?: 'vertical' | 'horizontal' }) {
  const [result, setResult] = useState<string | null>(null);
  return (
    <div style={{ minWidth: 340, maxWidth: 440 }}>
      <Form
        layout={layout}
        initialValues={{ email: '', password: '', agree: false }}
        onSubmit={(values) => setResult(JSON.stringify(values))}
      >
        <FormItem
          name="email"
          label="邮箱"
          required
          rules={[{ pattern: /.+@.+\..+/, message: '邮箱格式不正确' }]}
        >
          <Input placeholder="you@example.com" />
        </FormItem>
        <FormItem
          name="password"
          label="密码"
          required
          rules={[{ min: 6, message: '至少 6 位' }]}
          help="至少 6 位"
        >
          <Input type="password" />
        </FormItem>
        <FormItem name="agree" valuePropName="checked" trigger="onCheckedChange" required>
          <Checkbox>我已阅读并同意服务条款</Checkbox>
        </FormItem>
        <Button variant="accent" type="submit">
          登录
        </Button>
      </Form>
      {result ? <p style={{ marginTop: 12 }}>提交:{result}</p> : null}
    </div>
  );
}

export const Vertical: Story = {
  render: () => <LoginForm />,
};

export const Horizontal: Story = {
  render: () => <LoginForm layout="horizontal" />,
};
