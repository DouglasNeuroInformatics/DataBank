import { useCallback, useState } from 'react';

import { $ProjectDatasetConfigStep, $ProjectDatasetSelectedColumn } from '@databank/core';
import { Button, SearchBar, Table } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/react-table';

import type { SelectedColumnsRecord } from '../store/useProjectDatasetConfigStoreFactory';

type DataTableProps<TData extends $ProjectDatasetSelectedColumn & { id: string }, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setSelectedColumns: (selectedColumns: SelectedColumnsRecord) => void;
  setStep: (step: $ProjectDatasetConfigStep) => void;
};

export const ProjectColumnsTable = <TData extends $ProjectDatasetSelectedColumn & { id: string }, TValue>({
  columns,
  data,
  setSelectedColumns,
  setStep
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const { t } = useTranslation('common');

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

  const handleSubmitSelection = useCallback(() => {
    const selectedColumns: SelectedColumnsRecord = {};
    table.getFilteredSelectedRowModel().rows.forEach((row) => {
      const { id, kind, name } = row.original;
      if (typeof id === 'string' && kind && typeof name === 'string') {
        selectedColumns[id] = {
          kind: kind,
          name
        };
      }
    });
    setSelectedColumns(selectedColumns);
    setStep('configRows');
  }, []);

  return (
    <div className="w-full">
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

      <div className="w-full rounded-md border">
        <Table className="w-full">
          <Table.Header className="w-full">
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
          <Table.Body className="w-full">
            {table.getRowModel().rows.map((row) => (
              <Table.Row data-state={row.getIsSelected() && 'selected'} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer className="w-full">
            <Table.Row className="w-full">
              <Table.Cell>
                <Button size="sm" variant="primary" onClick={() => handleSubmitSelection()}>
                  {t('finishColumnSelection')}
                </Button>
              </Table.Cell>

              <Table.Cell>
                <Button
                  disabled={!table.getCanPreviousPage()}
                  size="sm"
                  variant="outline"
                  onClick={() => table.previousPage()}
                >
                  {t('paginationPrevious')}
                </Button>
              </Table.Cell>

              <Table.Cell>
                <Button disabled={!table.getCanNextPage()} size="sm" variant="outline" onClick={() => table.nextPage()}>
                  {t('paginationNext')}
                </Button>
              </Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    </div>
  );
};
