import { useState } from 'react';

import { Button, SearchBar, Table } from '@douglasneuroinformatics/libui/components';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/react-table';

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
};

export const ProjectColumnsTable = <TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const handleSubmitSelection = () => {
    const selectedColumnIds: TData[] = [];
    table.getFilteredSelectedRowModel().rows.map((row) => {
      selectedColumnIds.push(row.original);
    });
    console.error(selectedColumnIds);
    // send the selected columnIds to the backend
  };

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      rowSelection,
      sorting
    }
  });

  return (
    <div>
      <div className="flex-col-2 flex items-center py-4">
        <SearchBar
          placeholder="Filter column names..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onValueChange={(inputString) => table.getColumn('name')?.setFilterValue(inputString)}
        />
        <div className="m-4">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
      </div>

      <div className="rounded-md border">
        <Table className="w-full">
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Table.Head key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </Table.Head>
                  );
                })}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body>
            {table.getRowModel().rows.map((row) => (
              <Table.Row data-state={row.getIsSelected() && 'selected'} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.Cell>
                <Button size="sm" variant="primary" onClick={() => handleSubmitSelection()}>
                  Finish Selection
                </Button>
              </Table.Cell>

              <Table.Cell>
                <Button
                  disabled={!table.getCanPreviousPage()}
                  size="sm"
                  variant="outline"
                  onClick={() => table.previousPage()}
                >
                  Previous
                </Button>
              </Table.Cell>

              <Table.Cell>
                <Button disabled={!table.getCanNextPage()} size="sm" variant="outline" onClick={() => table.nextPage()}>
                  Next
                </Button>
              </Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    </div>
  );
};
