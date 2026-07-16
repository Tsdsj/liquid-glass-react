import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Table, type TableColumn } from './Table';

interface Row {
  id: string;
  name: string;
  age: number;
}

const DATA: Row[] = [
  { id: '1', name: 'Bob', age: 30 },
  { id: '2', name: 'Alice', age: 25 },
  { id: '3', name: 'Carol', age: 35 },
];

const COLUMNS: TableColumn<Row>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
];

function nameColumn(): string[] {
  return screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0].textContent);
}

describe('Table', () => {
  it('renders a semantic table with column headers and rows', () => {
    render(<Table aria-label="用户" columns={COLUMNS} data={DATA} rowKey="id" />);

    expect(screen.getByRole('table', { name: '用户' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(screen.getAllByRole('row')).toHaveLength(1 + DATA.length);
  });

  it('cycles a sortable header asc → desc → none and reflects aria-sort', async () => {
    const user = userEvent.setup();
    render(<Table columns={COLUMNS} data={DATA} rowKey="id" />);

    const header = screen.getByRole('columnheader', { name: /Name/ });
    const button = within(header).getByRole('button');
    expect(nameColumn()).toEqual(['Bob', 'Alice', 'Carol']);

    await user.click(button);
    expect(nameColumn()).toEqual(['Alice', 'Bob', 'Carol']);
    expect(header).toHaveAttribute('aria-sort', 'ascending');

    await user.click(button);
    expect(nameColumn()).toEqual(['Carol', 'Bob', 'Alice']);
    expect(header).toHaveAttribute('aria-sort', 'descending');

    await user.click(button);
    expect(nameColumn()).toEqual(['Bob', 'Alice', 'Carol']);
    expect(header).toHaveAttribute('aria-sort', 'none');
  });

  it('uses a custom sorter and a controlled sort prop', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        rowKey="id"
        sort={{ key: 'age', order: 'asc' }}
        onSortChange={onSortChange}
      />,
    );

    // Controlled by age asc regardless of interaction.
    expect(nameColumn()).toEqual(['Alice', 'Bob', 'Carol']);
    await user.click(within(screen.getByRole('columnheader', { name: /Age/ })).getByRole('button'));
    expect(onSortChange).toHaveBeenCalledWith({ key: 'age', order: 'desc' });
    // Still age asc — controlled value did not change.
    expect(nameColumn()).toEqual(['Alice', 'Bob', 'Carol']);
  });

  it('selects rows and drives the header checkbox indeterminate/all states', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <Table
        columns={COLUMNS}
        data={DATA}
        rowKey="id"
        selectable
        onSelectionChange={onSelectionChange}
      />,
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(1 + DATA.length);
    const [headerBox] = checkboxes;

    await user.click(checkboxes[1]); // Bob (id 1)
    expect(onSelectionChange).toHaveBeenCalledWith(['1']);
    expect(headerBox).toBePartiallyChecked();

    await user.click(headerBox); // select all
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      expect.arrayContaining(['1', '2', '3']),
    );
    expect(headerBox).toBeChecked();
  });

  it('paginates and keeps sort across page changes', async () => {
    const user = userEvent.setup();
    render(<Table columns={COLUMNS} data={DATA} rowKey="id" pagination={{ pageSize: 2 }} />);

    expect(screen.getAllByRole('row')).toHaveLength(1 + 2);
    await user.click(within(screen.getByRole('columnheader', { name: /Name/ })).getByRole('button'));
    // Sorted asc: Alice, Bob | Carol → page 1 shows Alice, Bob.
    expect(nameColumn()).toEqual(['Alice', 'Bob']);

    await user.click(screen.getByRole('button', { name: '第 2 页' }));
    expect(nameColumn()).toEqual(['Carol']);
  });

  it('shows the empty placeholder when there is no data', () => {
    render(<Table columns={COLUMNS} data={[]} rowKey="id" emptyText="暂无数据" />);
    expect(screen.getByText('暂无数据')).toBeInTheDocument();
  });
});
