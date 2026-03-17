/* eslint-disable perfectionist/sort-objects */
import { useCallback, useEffect, useMemo, useState } from 'react';

import type {
  $ProjectColumnSummary,
  $ProjectDataset,
  $ProjectDatasetColumnConfig,
  $ProjectDatasetConfigStep,
  $ProjectDatasetRowConfig,
  $ProjectDatasetSelectedColumn
} from '@databank/core';
import {
  Button,
  Card,
  Checkbox,
  Form,
  Heading,
  SearchBar,
  Spinner,
  Table
} from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/react-table';
import axios from 'axios';
import { produce } from 'immer';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { z } from 'zod/v4';
import { useStore } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

// --- Store ---

type SelectedColumnsRecord = { [key: string]: $ProjectDatasetSelectedColumn };

type ProjectDatasetConfigState = {
  columnsConfig: { [key: string]: $ProjectDatasetColumnConfig };
  currentColumnIdIndex: number;
  currentStep: $ProjectDatasetConfigStep;
  pageSize: number;
  rowConfig: $ProjectDatasetRowConfig;
  selectedColumns: SelectedColumnsRecord;
};

type ProjectDatasetConfigStore = ProjectDatasetConfigState & {
  reset: () => void;
  setColumnsConfig: (id: string, config: $ProjectDatasetColumnConfig) => void;
  setCurrentColumnIdIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  setRowConfig: (rowConfig: $ProjectDatasetRowConfig) => void;
  setSelectedColumns: (selectedColumns: SelectedColumnsRecord) => void;
  setStep: (step: $ProjectDatasetConfigStep) => void;
};

const createProjectDatasetConfigStore = (projectId: string, datasetId: string) => {
  const emptyState: ProjectDatasetConfigState = {
    columnsConfig: {},
    currentColumnIdIndex: 0,
    currentStep: 'selectColumns',
    pageSize: 10,
    rowConfig: { rowMax: null, rowMin: 0 },
    selectedColumns: {}
  };

  return createStore(
    persist<ProjectDatasetConfigStore>(
      (set) => ({
        ...emptyState,
        reset: () => set(emptyState),
        setColumnsConfig: (id, colConfig) =>
          set((state) =>
            produce(state, (draft) => {
              draft.columnsConfig[id] = colConfig;
            })
          ),
        setCurrentColumnIdIndex: (ind) =>
          set((state) =>
            produce(state, (draft) => {
              draft.currentColumnIdIndex = ind;
            })
          ),
        setPageSize: (size) =>
          set((state) =>
            produce(state, (draft) => {
              draft.pageSize = size;
            })
          ),
        setRowConfig: (newRowConfig) =>
          set((state) =>
            produce(state, (draft) => {
              draft.rowConfig = newRowConfig;
            })
          ),
        setSelectedColumns: (newSelectedCols) =>
          set((state) =>
            produce(state, (draft) => {
              draft.selectedColumns = newSelectedCols;
            })
          ),
        setStep: (step) =>
          set((state) =>
            produce(state, (draft) => {
              draft.currentStep = step;
            })
          )
      }),
      { name: `project-dataset-config-${projectId}-${datasetId}` }
    )
  );
};

// --- Column Definitions ---

const formatSummary = (column: $ProjectColumnSummary): string => {
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

const projectColumnDefs: ColumnDef<$ProjectColumnSummary>[] = [
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
    header: ({ column }) => (
      <div className="flex">
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Column Name
          {column.getIsSorted() === 'desc' ? (
            <ChevronDownIcon className="transform-gpu transition-transform" />
          ) : (
            <ChevronUpIcon className="transform-gpu transition-transform" />
          )}
        </Button>
      </div>
    )
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

// --- Select Columns Step ---

const SelectColumnsStep = ({
  datasetId,
  setSelectedColumns,
  setStep
}: {
  datasetId: string;
  setSelectedColumns: (selectedColumns: SelectedColumnsRecord) => void;
  setStep: (step: $ProjectDatasetConfigStep) => void;
}) => {
  const [data, setData] = useState<$ProjectColumnSummary[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const { t } = useTranslation('common');

  useEffect(() => {
    axios
      .get<$ProjectColumnSummary[]>(`/v1/datasets/columns/${datasetId}`)
      .then((response) => setData(response.data))
      .catch(console.error);
  }, [datasetId]);

  const table = useReactTable({
    columns: projectColumnDefs,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: { columnFilters, rowSelection, sorting }
  });

  const handleSubmitSelection = useCallback(() => {
    const selected: SelectedColumnsRecord = {};
    table.getFilteredSelectedRowModel().rows.forEach((row) => {
      const { id, kind, name } = row.original;
      if (typeof id === 'string' && kind && typeof name === 'string') {
        selected[id] = { kind, name };
      }
    });
    setSelectedColumns(selected);
    setStep('configRows');
  }, [table, setSelectedColumns, setStep]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 py-4">
        <SearchBar
          placeholder="Filter column names..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onValueChange={(inputString) => table.getColumn('name')?.setFilterValue(inputString)}
        />
        <div className="text-muted-foreground text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
      </div>
      <div className="w-full rounded-md border">
        <Table className="w-full">
          <Table.Header className="w-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.Head key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </Table.Head>
                ))}
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
                <Button size="sm" variant="primary" onClick={handleSubmitSelection}>
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

// --- Config Rows Step ---

const ConfigRowsStep = ({
  setRowConfig,
  setStep
}: {
  setRowConfig: (rowConfig: $ProjectDatasetRowConfig) => void;
  setStep: (step: $ProjectDatasetConfigStep) => void;
}) => {
  return (
    <Form
      content={{
        rowMin: {
          kind: 'number',
          label: 'Row filter minimum',
          variant: 'input'
        },
        rowMax: {
          kind: 'number',
          label: 'Row filter maximum',
          variant: 'input'
        }
      }}
      validationSchema={z
        .object({
          rowMin: z.int().gte(0),
          rowMax: z.int().gte(0).optional()
        })
        .refine((data) => data.rowMax === undefined || data.rowMax >= data.rowMin, {
          error: 'rowMax must be greater than or equal to rowMin'
        })}
      onSubmit={(data) => {
        setRowConfig({ rowMin: data.rowMin, rowMax: data.rowMax ?? null });
        setStep('configColumns');
      }}
    />
  );
};

// --- Config Columns Step ---

const ConfigColumnsStep = ({
  selectedColumns,
  setColumnsConfig
}: {
  selectedColumns: SelectedColumnsRecord;
  setColumnsConfig: (colId: string, colConfig: $ProjectDatasetColumnConfig) => void;
}) => {
  const formValidation = useMemo(() => {
    const obj: { [key: string]: z.ZodTypeAny } = {};
    for (const columnId in selectedColumns) {
      obj[columnId] = z.boolean().default(false);
      obj[columnId + 'HashLength'] = z.int().gte(0).optional();
      obj[columnId + 'HashSalt'] = z.string().optional();
      obj[columnId + 'TrimStart'] = z.int().gte(0).optional();
      obj[columnId + 'TrimEnd'] = z.int().gte(0).optional();
    }
    return z.object(obj) as z.ZodType<{ [key: string]: any }>;
  }, [selectedColumns]);

  const formContent = useMemo(() => {
    const content: any[] = [];
    for (const columnId in selectedColumns) {
      const col = selectedColumns[columnId]!;
      const fields: { [key: string]: any } = {};

      fields[columnId] = {
        kind: 'boolean',
        label: `Add configuration for column "${col.name}"?`,
        variant: 'checkbox'
      };

      const dynamicFields = [
        { suffix: 'HashLength', label: 'Hash Length', kind: 'number' as const },
        { suffix: 'HashSalt', label: 'Hash Salt', kind: 'string' as const },
        { suffix: 'TrimStart', label: 'Trim Start', kind: 'number' as const },
        { suffix: 'TrimEnd', label: 'Trim End', kind: 'number' as const }
      ];

      for (const field of dynamicFields) {
        fields[columnId + field.suffix] = {
          deps: [columnId],
          kind: 'dynamic',
          render(data: { [key: string]: any }) {
            if (!data[columnId]) return null;
            return { kind: field.kind, label: field.label, variant: 'input' };
          }
        };
      }

      content.push({
        description: col.description ?? `Configuration for column "${col.name}"`,
        fields,
        title: col.name
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return content;
  }, [selectedColumns]);

  const handleSubmit = useCallback(
    (data: z.infer<typeof formValidation>) => {
      for (const columnId in selectedColumns) {
        if (data[columnId]) {
          const config: $ProjectDatasetColumnConfig = { hash: null, trim: null };
          if (data[columnId + 'HashLength'] === 0 || data[columnId + 'HashLength']) {
            config.hash = {
              length: data[columnId + 'HashLength'] as number,
              salt: (data[columnId + 'HashSalt'] as string) ?? null
            };
          }
          if (data[columnId + 'TrimStart'] === 0 || data[columnId + 'TrimStart']) {
            config.trim = {
              end: (data[columnId + 'TrimEnd'] as number) ?? null,
              start: data[columnId + 'TrimStart'] as number
            };
          }
          setColumnsConfig(columnId, config);
        }
      }
    },
    [selectedColumns, setColumnsConfig]
  );

  return <Form className="w-full" content={formContent} validationSchema={formValidation} onSubmit={handleSubmit} />;
};

// --- Main Route Component ---

const RouteComponent = () => {
  const { projectId, datasetId } = Route.useParams();
  const navigate = useNavigate();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { t } = useTranslation('common');

  const [store] = useState(() => createProjectDatasetConfigStore(projectId, datasetId));
  const {
    columnsConfig,
    currentColumnIdIndex,
    currentStep,
    pageSize,
    reset,
    rowConfig,
    selectedColumns,
    setColumnsConfig,
    setCurrentColumnIdIndex,
    setRowConfig,
    setSelectedColumns,
    setStep
  } = useStore(store);

  const selectedColumnsIdArray = Object.keys(selectedColumns);

  const handlePreviousStep = (step: $ProjectDatasetConfigStep) => {
    switch (step) {
      case 'configColumns':
        setStep('configRows');
        break;
      case 'configRows':
        setStep('selectColumns');
        break;
      case 'selectColumns':
        break;
    }
  };

  const handlePreviousConfigColumnsPage = () => {
    if (currentStep !== 'configColumns') return;
    setCurrentColumnIdIndex(currentColumnIdIndex - pageSize > 0 ? currentColumnIdIndex - pageSize : 0);
  };

  const handleNextConfigColumnsPage = () => {
    if (currentStep !== 'configColumns') return;
    setCurrentColumnIdIndex(
      currentColumnIdIndex + pageSize < selectedColumnsIdArray.length
        ? currentColumnIdIndex + pageSize
        : selectedColumnsIdArray.length
    );
  };

  const getCurrentStepLabel = (step: $ProjectDatasetConfigStep): string => {
    const prefix = 'Current Configuration Step: ';
    switch (step) {
      case 'configColumns':
        return prefix + 'Set Column Transformations';
      case 'configRows':
        return prefix + 'Set Row Configurations';
      case 'selectColumns':
        return prefix + 'Select Project Dataset Columns';
    }
  };

  const handleSubmitConfig = () => {
    if (selectedColumnsIdArray.length === 0) {
      addNotification({
        message: 'Please select at least one column before finishing.',
        type: 'error'
      });
      return;
    }

    const projectDatasetConfig: $ProjectDataset = {
      columnConfigs: columnsConfig,
      columnIds: Object.keys(selectedColumns),
      datasetId,
      rowConfig
    };

    axios
      .post(`/v1/projects/add-dataset/${projectId}`, { projectDatasetDto: projectDatasetConfig })
      .then(() => {
        addNotification({
          message: `Added dataset ${datasetId} to project ${projectId}`,
          type: 'success'
        });
        void navigate({ to: '/portal/projects/$projectId', params: { projectId } });
      })
      .catch((error) => {
        addNotification({
          message: `Failed to add dataset to project: ${error}`,
          type: 'error'
        });
      });
  };

  return (
    <Card className="my-3 flex flex-col items-center">
      <Card.Header>
        <Heading variant="h1">Project Dataset Configuration</Heading>
      </Card.Header>

      <Card.Description>
        <Heading variant="h3">{getCurrentStepLabel(currentStep)}</Heading>
      </Card.Description>

      <Card.Content className="w-full">
        {(() => {
          switch (currentStep) {
            case 'configColumns': {
              const selectedColumnsForPage: SelectedColumnsRecord = {};
              selectedColumnsIdArray.slice(currentColumnIdIndex, currentColumnIdIndex + pageSize).forEach((colId) => {
                selectedColumnsForPage[colId] = selectedColumns[colId]!;
              });

              return (
                <>
                  <ConfigColumnsStep selectedColumns={selectedColumnsForPage} setColumnsConfig={setColumnsConfig} />
                  <div className="flex gap-2 py-2">
                    <Button
                      disabled={currentColumnIdIndex === 0}
                      variant="secondary"
                      onClick={handlePreviousConfigColumnsPage}
                    >
                      {t('paginationPrevious')}
                    </Button>
                    <Button
                      disabled={currentColumnIdIndex === Math.floor(selectedColumnsIdArray.length / (pageSize + 1))}
                      variant="secondary"
                      onClick={handleNextConfigColumnsPage}
                    >
                      {t('paginationNext')}
                    </Button>
                  </div>
                </>
              );
            }
            case 'configRows':
              return <ConfigRowsStep setRowConfig={setRowConfig} setStep={setStep} />;
            case 'selectColumns':
              return (
                <SelectColumnsStep datasetId={datasetId} setSelectedColumns={setSelectedColumns} setStep={setStep} />
              );
            default:
              return (
                <div className="flex items-center justify-center py-10">
                  <Spinner />
                </div>
              );
          }
        })()}
      </Card.Content>

      <Card.Footer className="flex w-full justify-between">
        <div className="flex w-full flex-col">
          <div className="flex w-full justify-between p-1">
            <Button
              disabled={currentStep === 'selectColumns'}
              variant="secondary"
              onClick={() => handlePreviousStep(currentStep)}
            >
              {t('previousConfigStep')}
            </Button>
          </div>
          <div className="flex w-full justify-between p-1">
            <Button variant="primary" onClick={handleSubmitConfig}>
              {t('finishConfig')}
            </Button>
            <Button variant="danger" onClick={reset}>
              {t('restart')}
            </Button>
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
};

export const Route = createFileRoute('/portal/projects/$projectId/datasets/$datasetId/add-columns')({
  component: RouteComponent
});
