import { useState } from 'react';

import type { ProjectColumnSummary } from '@databank/core';
import { Button, Checkbox } from '@douglasneuroinformatics/libui/components';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

const formatSummary = (column: ProjectColumnSummary): string => {
  switch (column.kind) {
    case 'DATETIME':
      return `
      min: ${column.datetimeSummary.min.toISOString()} \n
       max: ${column.datetimeSummary.max.toISOString()}
       `;
    case 'ENUM':
      return Object.entries(column.enumSummary.distribution)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
    case 'FLOAT':
      return `
            min: ${column.floatSummary.min.toFixed(2)} \n
            max: ${column.floatSummary.max.toFixed(2)} \n
            mean: ${column.floatSummary.mean.toFixed(2)} \n
            median: ${column.floatSummary.median.toFixed(2)} \n
            std: ${column.floatSummary.std.toFixed(2)}
            `;
    case 'INT':
      return `
            min: ${column.intSummary.min} \n
            max: ${column.intSummary.max} \n
            mean: ${column.intSummary.mean} \n
            median: ${column.intSummary.median} \n
            std: ${column.intSummary.std} \n
            mode: ${column.intSummary.mode}
            `;
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
      const [isToggleDown, setIsToggleDown] = useState(true);
      return (
        <div className="flex">
          <Button
            variant="ghost"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === 'asc');
              setIsToggleDown(!isToggleDown);
            }}
          >
            Column Name
            {isToggleDown ? (
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
