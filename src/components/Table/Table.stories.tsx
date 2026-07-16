import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table, type TableColumn } from './Table';

interface Person {
  id: string;
  name: string;
  role: string;
  score: number;
}

const DATA: Person[] = [
  { id: '1', name: '林清', role: '设计', score: 92 },
  { id: '2', name: '陈默', role: '前端', score: 88 },
  { id: '3', name: '苏岚', role: '产品', score: 95 },
  { id: '4', name: '周野', role: '前端', score: 79 },
  { id: '5', name: '吴回', role: '设计', score: 84 },
];

const COLUMNS: TableColumn<Person>[] = [
  { key: 'name', title: '姓名', dataIndex: 'name', sortable: true },
  { key: 'role', title: '角色', dataIndex: 'role' },
  { key: 'score', title: '评分', dataIndex: 'score', sortable: true, align: 'right' },
];

const meta: Meta<typeof Table<Person>> = {
  title: 'Display/Table',
  component: Table,
};
export default meta;

type Story = StoryObj<typeof Table<Person>>;

export const Basic: Story = {
  render: () => <Table aria-label="成员" columns={COLUMNS} data={DATA} rowKey="id" />,
};

export const SortableSelectablePaged: Story = {
  render: () => (
    <Table
      aria-label="成员"
      columns={COLUMNS}
      data={DATA}
      rowKey="id"
      selectable
      defaultSort={{ key: 'score', order: 'desc' }}
      pagination={{ pageSize: 3 }}
    />
  ),
};
