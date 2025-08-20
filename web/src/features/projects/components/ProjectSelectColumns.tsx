import type { ProjectColumnSummary } from '@databank/core';
import { Button, Checkbox } from '@douglasneuroinformatics/libui/components';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

const formatSummary = (column: ProjectColumnSummary): string => {
  switch (column.kind) {
    case 'DATETIME':
      return Object.entries(column.datetimeSummary)
        .map(([key, value]) => `${key}: ${value.toISOString()}`)
        .join(', ');
    case 'ENUM':
      return column.enumSummary.distribution.map((entry) => `${entry['']}: ${entry.count}`).join(', ');
    case 'FLOAT':
      return Object.entries(column.floatSummary)
        .map(([key, value]) => `${key}: ${value.toFixed(2)}`)
        .join(', ');
    case 'INT':
      return Object.entries(column.intSummary)
        .map(([key, value]) => `${key}: ${value.toFixed(2)}`)
        .join(', ');
    case 'STRING':
      return 'N/A';
    default:
      return '';
  }
};

export const projectColumnDefs: ColumnDef<ProjectColumnSummary>[] = [
  {
    accessorKey: 'select',
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    id: 'select'
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <div className="flex">
          <Button
            variant="ghost"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === 'asc');
            }}
          >
            Column Name
            {column.getIsSorted() === 'desc' ? (
              <ChevronDownIcon className="transform-gpu transition-transform" data-testid="arrow-down-icon" />
            ) : (
              <ChevronUpIcon className="transform-gpu transition-transform" data-testid="arrow-up-icon" />
            )}
          </Button>
        </div>
      );
    }
  },
  {
    accessorKey: 'kind',
    header: 'Data Type'
  },
  {
    accessorKey: 'count',
    header: 'Count'
  },
  {
    accessorKey: 'nullable',
    cell: ({ row }) => (row.original.nullable ? 'Yes' : 'No'),
    header: 'Nullable'
  },
  {
    accessorKey: 'nullCount',
    header: 'Null Count'
  },
  {
    accessorKey: 'summary',
    cell: ({ row }) => formatSummary(row.original),
    header: 'Summary'
  }
];
