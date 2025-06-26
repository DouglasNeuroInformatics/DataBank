import type { ProjectColumnSummary } from '@databank/core';
import { ArrowToggle, Button, Checkbox } from '@douglasneuroinformatics/libui/components';
import type { ColumnDef } from '@tanstack/react-table';

const formatSummary = (column: ProjectColumnSummary): string => {
  switch (column.kind) {
    case 'DATETIME':
      return `min: ${column.datetimeSummary.min.toISOString()}, max: ${column.datetimeSummary.max.toISOString()}`;
    case 'ENUM':
      return Object.entries(column.enumSummary.distribution)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
    case 'FLOAT':
      return `
            min: ${column.floatSummary.min.toFixed(2)}, 
            max: ${column.floatSummary.max.toFixed(2)},
            mean: ${column.floatSummary.mean.toFixed(2)},
            median: ${column.floatSummary.median.toFixed(2)},
            std: ${column.floatSummary.std.toFixed(2)},
            `;
    case 'INT':
      return `
            min: ${column.intSummary.min}, 
            max: ${column.intSummary.max},
            mean: ${column.intSummary.mean},
            median: ${column.intSummary.median},
            std: ${column.intSummary.std},
            mode: ${column.intSummary.mode},
            `;
    case 'STRING':
      return 'N/A';
    default:
      return '';
  }
};

export const projectColumnDefs: ColumnDef<ProjectColumnSummary>[] = [
  {
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
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Column Name
          <ArrowToggle position={'down'} />
        </Button>
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
    cell: ({ row }) => formatSummary(row.original),
    header: 'Summary'
  }
];
