import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = { title: 'Feedback/Alert', component: Alert };
export default meta;

type Story = StoryObj<typeof Alert>;

export const Kinds: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 360 }}>
      <Alert kind="info" title="提示">这是一条普通信息。</Alert>
      <Alert kind="success" title="成功">操作已完成。</Alert>
      <Alert kind="warning" title="注意">请确认后再继续。</Alert>
      <Alert kind="danger" title="错误" closable onClose={() => undefined}>
        出现了一个问题。
      </Alert>
    </div>
  ),
};
