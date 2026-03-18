/* eslint-disable perfectionist/sort-objects */
import { useCallback, useMemo, useState } from 'react';

import type {
  $ProjectColumnSummary,
  $ProjectDataset,
  $ProjectDatasetColumnConfig,
  $ProjectDatasetConfigStep,
  $ProjectDatasetRowConfig,
  $ProjectDatasetSelectedColumn
} from '@databank/core';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Form,
  SearchBar,
  Separator,
  Table
} from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { cn } from '@douglasneuroinformatics/libui/utils';
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
import {
  ArrowLeftIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ColumnsIcon,
  RotateCcwIcon,
  RowsIcon,
  SendIcon,
  SlidersHorizontalIcon
} from 'lucide-react';
import { z } from 'zod/v4';
import { useStore } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

import { PageHeading } from '@/components/PageHeading';
import { columnSummariesQueryOptions, useColumnSummariesQuery } from '@/hooks/queries/useColumnSummariesQuery';

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

// --- Step Indicator ---

const STEPS: { icon: React.FC<{ className?: string }>; key: $ProjectDatasetConfigStep; label: string }[] = [
  { icon: ColumnsIcon, key: 'selectColumns', label: 'Select Columns' },
  { icon: RowsIcon, key: 'configRows', label: 'Configure Rows' },
  { icon: SlidersHorizontalIcon, key: 'configColumns', label: 'Configure Columns' }
];

const StepIndicator = ({ currentStep }: { currentStep: $ProjectDatasetConfigStep }) => {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="mb-6 flex items-center justify-center gap-2">
      {STEPS.map((step, i) => {
        const isComplete = i < currentIndex;
        const isCurrent = i === currentIndex;
        const Icon = step.icon;

        return (
          <div className="flex items-center gap-2" key={step.key}>
            {i > 0 && <div className={cn('h-px w-8 sm:w-12', isComplete ? 'bg-primary' : 'bg-border')} />}
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  'flex size-7 items-center justify-center rounded-full text-xs font-medium transition-colors',
                  isComplete && 'bg-primary text-primary-foreground',
                  isCurrent && 'bg-primary text-primary-foreground ring-primary/25 ring-4',
                  !isComplete && !isCurrent && 'bg-muted text-muted-foreground'
                )}
              >
                {isComplete ? <CheckIcon className="size-3.5" /> : <Icon className="size-3.5" />}
              </div>
              <span
                className={cn(
                  'hidden text-xs font-medium sm:inline',
                  isCurrent ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
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
      <Button className="px-0" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Column Name
        {column.getIsSorted() === 'desc' ? (
          <ChevronDownIcon className="ml-1 size-3.5" />
        ) : (
          <ChevronUpIcon className="ml-1 size-3.5" />
        )}
      </Button>
    )
  },
  {
    accessorKey: 'kind',
    cell: ({ row }) => <Badge variant="outline">{row.original.kind}</Badge>,
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
    cell: ({ row }) => (
      <span className="line-clamp-1 max-w-48" title={formatSummary(row.original)}>
        {formatSummary(row.original)}
      </span>
    ),
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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const { t } = useTranslation('common');
  const { data } = useColumnSummariesQuery(datasetId);

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

  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount = table.getFilteredRowModel().rows.length;

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          placeholder="Filter column names..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onValueChange={(inputString) => table.getColumn('name')?.setFilterValue(inputString)}
        />
        <p className="text-muted-foreground shrink-0 text-sm tabular-nums">
          {selectedCount} of {totalCount} column(s) selected
        </p>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <Table.Header>
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
          <Table.Body>
            {table.getRowModel().rows.map((row) => (
              <Table.Row data-state={row.getIsSelected() && 'selected'} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            disabled={!table.getCanPreviousPage()}
            size="sm"
            variant="outline"
            onClick={() => table.previousPage()}
          >
            <ChevronLeftIcon className="mr-1 size-3.5" />
            {t('paginationPrevious')}
          </Button>
          <Button disabled={!table.getCanNextPage()} size="sm" variant="outline" onClick={() => table.nextPage()}>
            {t('paginationNext')}
            <ChevronRightIcon className="ml-1 size-3.5" />
          </Button>
        </div>
        <Button disabled={selectedCount === 0} size="sm" onClick={handleSubmitSelection}>
          {t('finishColumnSelection')}
          <ChevronRightIcon className="ml-1 size-3.5" />
        </Button>
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
    <div className="mx-auto max-w-md">
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
        submitBtnLabel="Continue"
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
    </div>
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

  return (
    <Form
      content={formContent}
      submitBtnLabel="Save Column Config"
      validationSchema={formValidation}
      onSubmit={handleSubmit}
    />
  );
};

// --- Main Route Component ---

const STEP_META: { [K in $ProjectDatasetConfigStep]: { description: string; title: string } } = {
  selectColumns: {
    title: 'Select Columns',
    description: 'Choose which columns from this dataset to include in the project.'
  },
  configRows: {
    title: 'Configure Rows',
    description: 'Set row range filters to limit the data included.'
  },
  configColumns: {
    title: 'Configure Columns',
    description: 'Optionally apply hash or trim transformations to selected columns.'
  }
};

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

  const meta = STEP_META[currentStep];

  return (
    <div>
      <PageHeading
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              void navigate({
                params: { projectId },
                to: '/portal/projects/$projectId'
              })
            }
          >
            <ArrowLeftIcon className="mr-1.5 size-3.5" />
            {t({
              en: 'Back to Project',
              fr: 'Retour au projet'
            })}
          </Button>
        }
        description={t({
          en: 'Configure how this dataset is shared within the project.',
          fr: 'Configurez la manière dont ce jeu de données est partagé dans le projet.'
        })}
      >
        {t({
          en: 'Dataset Configuration',
          fr: 'Configuration du jeu de données'
        })}
      </PageHeading>

      <StepIndicator currentStep={currentStep} />

      <Card>
        <Card.Header>
          <Card.Title className="text-base">{meta.title}</Card.Title>
          <Card.Description>{meta.description}</Card.Description>
        </Card.Header>
        <Separator />
        <Card.Content className="pt-4">
          {(() => {
            switch (currentStep) {
              case 'configColumns': {
                const selectedColumnsForPage: SelectedColumnsRecord = {};
                selectedColumnsIdArray.slice(currentColumnIdIndex, currentColumnIdIndex + pageSize).forEach((colId) => {
                  selectedColumnsForPage[colId] = selectedColumns[colId]!;
                });

                return (
                  <div className="space-y-4">
                    <ConfigColumnsStep selectedColumns={selectedColumnsForPage} setColumnsConfig={setColumnsConfig} />
                    {selectedColumnsIdArray.length > pageSize && (
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          disabled={currentColumnIdIndex === 0}
                          size="sm"
                          variant="outline"
                          onClick={handlePreviousConfigColumnsPage}
                        >
                          <ChevronLeftIcon className="mr-1 size-3.5" />
                          {t('paginationPrevious')}
                        </Button>
                        <p className="text-muted-foreground text-xs tabular-nums">
                          {Math.floor(currentColumnIdIndex / pageSize) + 1} /{' '}
                          {Math.ceil(selectedColumnsIdArray.length / pageSize)}
                        </p>
                        <Button
                          disabled={currentColumnIdIndex + pageSize >= selectedColumnsIdArray.length}
                          size="sm"
                          variant="outline"
                          onClick={handleNextConfigColumnsPage}
                        >
                          {t('paginationNext')}
                          <ChevronRightIcon className="ml-1 size-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              }
              case 'configRows':
                return <ConfigRowsStep setRowConfig={setRowConfig} setStep={setStep} />;
              case 'selectColumns':
                return (
                  <SelectColumnsStep datasetId={datasetId} setSelectedColumns={setSelectedColumns} setStep={setStep} />
                );
              default:
                return null;
            }
          })()}
        </Card.Content>
        <Separator />
        <Card.Footer className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <Button
              disabled={currentStep === 'selectColumns'}
              size="sm"
              variant="outline"
              onClick={() => handlePreviousStep(currentStep)}
            >
              <ArrowLeftIcon className="mr-1.5 size-3.5" />
              {t('previousConfigStep')}
            </Button>
            <Button size="sm" variant="outline" onClick={reset}>
              <RotateCcwIcon className="mr-1.5 size-3.5" />
              {t('restart')}
            </Button>
          </div>
          <Button disabled={selectedColumnsIdArray.length === 0} size="sm" onClick={handleSubmitConfig}>
            <SendIcon className="mr-1.5 size-3.5" />
            {t('finishConfig')}
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export const Route = createFileRoute('/portal/projects/$projectId/datasets/$datasetId/add-columns')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(columnSummariesQueryOptions(params.datasetId));
  }
});
