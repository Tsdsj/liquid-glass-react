import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Upload, type UploadFile } from './Upload';

const meta: Meta<typeof Upload> = { title: 'Data entry/Upload', component: Upload };
export default meta;
type Story = StoryObj<typeof Upload>;

export const Basic: Story = {
  render: () => {
    const [files, setFiles] = useState<UploadFile[]>([
      { key: 'seed', name: '设计稿.pdf', size: 128000, status: 'done' },
    ]);
    return <Upload fileList={files} onChange={(list) => setFiles(list)} multiple />;
  },
};
