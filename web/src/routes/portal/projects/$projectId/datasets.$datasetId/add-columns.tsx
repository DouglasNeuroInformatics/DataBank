/* eslint-disable perfectionist/sort-objects */
import { useCallback, useState } from 'react';

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
  Input,
  Label,
  SearchBar,
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
import { produce } from 'immer';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
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
import { useAddDatasetToProjectMutation } from '@/hooks/mutations/useAddDatasetToProjectMutation';
import { columnSummariesQueryOptions, useColumnSummariesQuery } from '@/hooks/queries/useColumnSummariesQuery';

// --- Store ---

type SelectedColumnsRecord = { [key: string]: $ProjectDatasetSelectedColumn };

type ProjectDatasetConfigState = {
  columnsConfig: { [key: string]: $ProjectDatasetColumnConfig };
  currentStep: $ProjectDatasetConfigStep;
  rowConfig: $ProjectDatasetRowConfig;
  selectedColumns: SelectedColumnsRecord;
};

type ProjectDatasetConfigStore = ProjectDatasetConfigState & {
  reset: () => void;
  setColumnsConfig: (id: string, config: $ProjectDatasetColumnConfig) => void;
  setRowConfig: (rowConfig: $ProjectDatasetRowConfig) => void;
  setSelectedColumns: (selectedColumns: SelectedColumnsRecord) => void;
  setStep: (step: $ProjectDatasetConfigStep) => void;
};

const createProjectDatasetConfigStore = (projectId: string, datasetId: string) => {
  const emptyState: ProjectDatasetConfigState = {
    columnsConfig: {},
    currentStep: 'selectColumns',
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
  { icon: RowsIcon, key: 'configRows', label: 'Row Range' },
  { icon: SlidersHorizontalIcon, key: 'configColumns', label: 'Transformations' }
];

const StepIndicator = ({ currentStep }: { currentStep: $ProjectDatasetConfigStep }) => {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="mb-8 flex items-center justify-center">
      {STEPS.map((step, i) => {
        const isComplete = i < currentIndex;
        const isCurrent = i === currentIndex;
        const Icon = step.icon;

        return (
          <div className="flex items-center" key={step.key}>
            {i > 0 && <div className={cn('h-px w-12 sm:w-20', isComplete ? 'bg-primary' : 'bg-border')} />}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex size-9 items-center justify-center rounded-full transition-colors',
                  isComplete && 'bg-primary text-primary-foreground',
                  isCurrent && 'bg-primary text-primary-foreground ring-primary/20 ring-4',
                  !isComplete && !isCurrent && 'bg-muted text-muted-foreground'
                )}
              >
                {isComplete ? <CheckIcon className="size-4" /> : <Icon className="size-4" />}
              </div>
              <span className={cn('text-xs font-medium', isCurrent ? 'text-foreground' : 'text-muted-foreground')}>
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Column Summary Formatting ---

const formatSummary = (column: $ProjectColumnSummary): string => {
  switch (column.kind) {
    case 'DATETIME':
      return Object.entries(column.datetimeSummary)
        .map(([key, value]) => `${key}: ${value instanceof Date ? value.toISOString() : String(value)}`)
        .join(', ');
    case 'ENUM':
      return column.enumSummary.distribution.map((entry) => `${entry['']}: ${entry.count}`).join(', ');
    case 'FLOAT':
      return Object.entries(column.floatSummary)
        .map(([key, value]) => `${key}: ${value?.toFixed(2) ?? 'N/A'}`)
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

// --- Column Definitions ---

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
    cell: ({ row }) => <span className="text-muted-foreground text-xs font-medium uppercase">{row.original.kind}</span>,
    header: 'Type'
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
    header: 'Nulls'
  },
  {
    accessorKey: 'summary',
    cell: ({ row }) => (
      <span className="text-muted-foreground line-clamp-1 max-w-48 text-xs" title={formatSummary(row.original)}>
        {formatSummary(row.original)}
      </span>
    ),
    header: 'Summary'
  }
];

// --- Step 1: Select Columns ---

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

  const handleContinue = useCallback(() => {
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
          placeholder="Search columns..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onValueChange={(value) => table.getColumn('name')?.setFilterValue(value)}
        />
        <p className="text-muted-foreground shrink-0 text-sm tabular-nums">
          {selectedCount} of {totalCount} selected
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
            {table.getRowModel().rows.length === 0 ? (
              <Table.Row>
                <Table.Cell className="text-muted-foreground py-8 text-center" colSpan={projectColumnDefs.length}>
                  No columns found.
                </Table.Cell>
              </Table.Row>
            ) : (
              table.getRowModel().rows.map((row) => (
                <Table.Row data-state={row.getIsSelected() && 'selected'} key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Cell>
                  ))}
                </Table.Row>
              ))
            )}
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
            Previous
          </Button>
          <Button disabled={!table.getCanNextPage()} size="sm" variant="outline" onClick={() => table.nextPage()}>
            Next
            <ChevronRightIcon className="ml-1 size-3.5" />
          </Button>
        </div>
        <Button disabled={selectedCount === 0} size="sm" onClick={handleContinue}>
          Continue
          <ArrowRightIcon className="ml-1.5 size-3.5" />
        </Button>
      </div>
    </div>
  );
};

// --- Step 2: Configure Rows ---

const ConfigRowsStep = ({
  setRowConfig,
  setStep
}: {
  setRowConfig: (rowConfig: $ProjectDatasetRowConfig) => void;
  setStep: (step: $ProjectDatasetConfigStep) => void;
}) => {
  return (
    <Card>
      <Card.Content className="pt-6">
        <p className="text-muted-foreground mb-6 text-sm">
          Optionally limit which rows are included. Leave maximum empty to include all rows from the starting index.
        </p>
        <Form
          content={{
            rowMin: {
              kind: 'number',
              label: 'Starting row index',
              variant: 'input'
            },
            rowMax: {
              kind: 'number',
              label: 'Maximum row index (optional)',
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
              error: 'Maximum must be greater than or equal to minimum'
            })}
          onSubmit={(data) => {
            setRowConfig({ rowMin: data.rowMin, rowMax: data.rowMax ?? null });
            setStep('configColumns');
          }}
        />
      </Card.Content>
    </Card>
  );
};

// --- Step 3: Configure Column Transformations ---

const ColumnConfigCard = ({
  column,
  columnId,
  config,
  onConfigChange
}: {
  column: $ProjectDatasetSelectedColumn;
  columnId: string;
  config: $ProjectDatasetColumnConfig | undefined;
  onConfigChange: (columnId: string, config: $ProjectDatasetColumnConfig | null) => void;
}) => {
  const isEnabled = config !== undefined;
  const [hashLength, setHashLength] = useState(config?.hash?.length?.toString() ?? '10');
  const [hashSalt, setHashSalt] = useState(config?.hash?.salt ?? '');
  const [trimStart, setTrimStart] = useState(config?.trim?.start?.toString() ?? '0');
  const [trimEnd, setTrimEnd] = useState(config?.trim?.end?.toString() ?? '');
  const [hashEnabled, setHashEnabled] = useState(config?.hash !== null && config?.hash !== undefined);
  const [trimEnabled, setTrimEnabled] = useState(config?.trim !== null && config?.trim !== undefined);

  const handleToggle = (enabled: boolean) => {
    if (!enabled) {
      onConfigChange(columnId, null);
    } else {
      onConfigChange(columnId, { hash: null, trim: null });
    }
  };

  const updateConfig = (newHash: boolean, newTrim: boolean) => {
    const newConfig: $ProjectDatasetColumnConfig = {
      hash: newHash ? { length: parseInt(hashLength) || 10, salt: hashSalt || null } : null,
      trim: newTrim ? { start: parseInt(trimStart) || 0, end: trimEnd ? parseInt(trimEnd) : null } : null
    };
    onConfigChange(columnId, newConfig);
  };

  return (
    <Card>
      <Card.Content className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{column.name}</p>
            <p className="text-muted-foreground text-xs uppercase">{column.kind}</p>
          </div>
          <Checkbox checked={isEnabled} onCheckedChange={(checked: boolean) => handleToggle(checked)} />
        </div>

        {isEnabled && (
          <div className="mt-4 space-y-4">
            {/* Hash Config */}
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Hash</p>
                  <p className="text-muted-foreground text-xs">
                    Apply a hash transformation to this column&apos;s values
                  </p>
                </div>
                <Checkbox
                  checked={hashEnabled}
                  onCheckedChange={(checked: boolean) => {
                    setHashEnabled(checked);
                    updateConfig(checked, trimEnabled);
                  }}
                />
              </div>
              {hashEnabled && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor={`${columnId}-hash-length`}>Length</Label>
                    <Input
                      id={`${columnId}-hash-length`}
                      type="number"
                      value={hashLength}
                      onChange={(e) => {
                        setHashLength(e.target.value);
                        updateConfig(true, trimEnabled);
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`${columnId}-hash-salt`}>Salt (optional)</Label>
                    <Input
                      id={`${columnId}-hash-salt`}
                      placeholder="Enter salt..."
                      type="text"
                      value={hashSalt}
                      onChange={(e) => {
                        setHashSalt(e.target.value);
                        updateConfig(true, trimEnabled);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Trim Config */}
            <div className="rounded-md border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Trim</p>
                  <p className="text-muted-foreground text-xs">Trim values to a character range</p>
                </div>
                <Checkbox
                  checked={trimEnabled}
                  onCheckedChange={(checked: boolean) => {
                    setTrimEnabled(checked);
                    updateConfig(hashEnabled, checked);
                  }}
                />
              </div>
              {trimEnabled && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor={`${columnId}-trim-start`}>Start index</Label>
                    <Input
                      id={`${columnId}-trim-start`}
                      type="number"
                      value={trimStart}
                      onChange={(e) => {
                        setTrimStart(e.target.value);
                        updateConfig(hashEnabled, true);
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`${columnId}-trim-end`}>End index (optional)</Label>
                    <Input
                      id={`${columnId}-trim-end`}
                      placeholder="Leave empty for no limit"
                      type="number"
                      value={trimEnd}
                      onChange={(e) => {
                        setTrimEnd(e.target.value);
                        updateConfig(hashEnabled, true);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

const ConfigColumnsStep = ({
  columnsConfig,
  selectedColumns,
  setColumnsConfig
}: {
  columnsConfig: { [key: string]: $ProjectDatasetColumnConfig };
  selectedColumns: SelectedColumnsRecord;
  setColumnsConfig: (colId: string, config: $ProjectDatasetColumnConfig) => void;
}) => {
  const entries = Object.entries(selectedColumns);
  const configuredCount = Object.keys(columnsConfig).length;

  const handleConfigChange = useCallback(
    (columnId: string, config: $ProjectDatasetColumnConfig | null) => {
      if (config === null) {
        // Remove from config by setting to empty
        setColumnsConfig(columnId, undefined as unknown as $ProjectDatasetColumnConfig);
      } else {
        setColumnsConfig(columnId, config);
      }
    },
    [setColumnsConfig]
  );

  return (
    <div className="space-y-4">
      <Card>
        <Card.Content className="pt-6">
          <p className="text-muted-foreground text-sm">
            Optionally apply transformations to your selected columns. Toggle on any column to configure hashing or
            trimming. Columns without transformations will be included as-is.
          </p>
          <p className="text-muted-foreground mt-2 text-sm tabular-nums">
            {configuredCount} of {entries.length} columns have transformations
          </p>
        </Card.Content>
      </Card>

      {entries.map(([columnId, column]) => (
        <ColumnConfigCard
          column={column}
          columnId={columnId}
          config={columnsConfig[columnId]}
          key={columnId}
          onConfigChange={handleConfigChange}
        />
      ))}
    </div>
  );
};

// --- Main Route Component ---

const RouteComponent = () => {
  const { projectId, datasetId } = Route.useParams();
  const navigate = useNavigate();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { t } = useTranslation('common');
  const addDatasetToProjectMutation = useAddDatasetToProjectMutation();

  const [store] = useState(() => createProjectDatasetConfigStore(projectId, datasetId));
  const {
    columnsConfig,
    currentStep,
    reset,
    rowConfig,
    selectedColumns,
    setColumnsConfig,
    setRowConfig,
    setSelectedColumns,
    setStep
  } = useStore(store);

  const selectedColumnsIdArray = Object.keys(selectedColumns);

  const handlePreviousStep = () => {
    switch (currentStep) {
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

    addDatasetToProjectMutation.mutate(
      { projectDatasetDto: projectDatasetConfig, projectId },
      {
        onError(error) {
          addNotification({
            message: `Failed to add dataset to project: ${error}`,
            type: 'error'
          });
        },
        onSuccess() {
          reset();
          void navigate({ to: '/portal/projects/$projectId', params: { projectId } });
        }
      }
    );
  };

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

      {currentStep === 'selectColumns' && (
        <SelectColumnsStep datasetId={datasetId} setSelectedColumns={setSelectedColumns} setStep={setStep} />
      )}

      {currentStep === 'configRows' && <ConfigRowsStep setRowConfig={setRowConfig} setStep={setStep} />}

      {currentStep === 'configColumns' && (
        <ConfigColumnsStep
          columnsConfig={columnsConfig}
          selectedColumns={selectedColumns}
          setColumnsConfig={setColumnsConfig}
        />
      )}

      {/* Footer navigation — shown on steps 2 and 3 */}
      {currentStep !== 'selectColumns' && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handlePreviousStep}>
              <ArrowLeftIcon className="mr-1.5 size-3.5" />
              {t({ en: 'Back', fr: 'Retour' })}
            </Button>
            <Button size="sm" variant="outline" onClick={reset}>
              <RotateCcwIcon className="mr-1.5 size-3.5" />
              {t({ en: 'Start Over', fr: 'Recommencer' })}
            </Button>
          </div>
          {currentStep === 'configColumns' && (
            <Button disabled={selectedColumnsIdArray.length === 0} size="sm" onClick={handleSubmitConfig}>
              <SendIcon className="mr-1.5 size-3.5" />
              {t({
                en: 'Add to Project',
                fr: 'Ajouter au projet'
              })}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute('/portal/projects/$projectId/datasets/$datasetId/add-columns')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(columnSummariesQueryOptions(params.datasetId));
  }
});
