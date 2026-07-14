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
import { Button, Checkbox, Form, Input, Label, SearchBar, Table } from '@douglasneuroinformatics/libui/components';
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

import { PageContainer } from '@/components/PageContainer';
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

const STEPS = [
  { icon: ColumnsIcon, key: 'selectColumns' },
  { icon: RowsIcon, key: 'configRows' },
  { icon: SlidersHorizontalIcon, key: 'configColumns' }
] as const;

const StepIndicator = ({ currentStep }: { currentStep: $ProjectDatasetConfigStep }) => {
  const { t } = useTranslation('common');
  const stepLabels = {
    configColumns: t({ en: 'Transformations', fr: 'Transformations' }),
    configRows: t({ en: 'Row Range', fr: 'Plage de lignes' }),
    selectColumns: t({ en: 'Select Columns', fr: 'Sélectionner les colonnes' })
  };
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
                {stepLabels[step.key]}
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

const createProjectColumnDefs = (t: any): ColumnDef<$ProjectColumnSummary>[] => [
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
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-call */}
        {t({ en: 'Column Name', fr: 'Nom de colonne' })}
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    header: t({ en: 'Type', fr: 'Type' })
  },
  {
    accessorKey: 'count',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    header: t({ en: 'Count', fr: 'Compte' })
  },
  {
    accessorKey: 'nullable',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
    cell: ({ row }) => (row.original.nullable ? t({ en: 'Yes', fr: 'Oui' }) : t({ en: 'No', fr: 'Non' })),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    header: t({ en: 'Nullable', fr: 'Nullable' })
  },
  {
    accessorKey: 'nullCount',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    header: t({ en: 'Nulls', fr: 'Valeurs nulles' })
  },
  {
    accessorKey: 'summary',

    cell: ({ row }) => (
      <span className="text-muted-foreground line-clamp-1 max-w-48 text-xs" title={formatSummary(row.original)}>
        {formatSummary(row.original)}
      </span>
    ),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    header: t({ en: 'Summary', fr: 'Résumé' })
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
  const { t } = useTranslation('common');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const { data } = useColumnSummariesQuery(datasetId);

  const projectColumnDefs = createProjectColumnDefs(t);

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
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <SearchBar
            placeholder={t({ en: 'Search columns...', fr: 'Rechercher les colonnes...' })}
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onValueChange={(value) => table.getColumn('name')?.setFilterValue(value)}
          />
        </div>
        <p className="text-muted-foreground shrink-0 text-sm tabular-nums">
          {selectedCount} {t({ en: 'of', fr: 'de' })} {totalCount} {t({ en: 'selected', fr: 'sélectionné' })}
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
                  {t({ en: 'No columns found.', fr: 'Aucune colonne trouvée.' })}
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
            {t({ en: 'Previous', fr: 'Précédent' })}
          </Button>
          <Button disabled={!table.getCanNextPage()} size="sm" variant="outline" onClick={() => table.nextPage()}>
            {t({ en: 'Next', fr: 'Suivant' })}
            <ChevronRightIcon className="ml-1 size-3.5" />
          </Button>
        </div>
        <Button disabled={selectedCount === 0} size="sm" onClick={handleContinue}>
          {t({ en: 'Continue', fr: 'Continuer' })}
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
  const { t } = useTranslation('common');
  return (
    <div className="overflow-hidden rounded-md border">
      <div className="border-b px-6 py-5">
        <h3 className="text-sm font-medium">{t({ en: 'Row Range', fr: 'Plage de lignes' })}</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          {t({
            en: 'Optionally limit which rows are included. Leave maximum empty to include all rows.',
            fr: 'Limitez éventuellement les lignes incluses. Laissez le maximum vide pour inclure toutes les lignes.'
          })}
        </p>
      </div>
      <div className="px-6 py-5">
        <Form
          content={[
            {
              fields: {
                rowMin: {
                  kind: 'number',
                  label: t({ en: 'Starting row index', fr: 'Index de ligne de départ' }),
                  variant: 'input'
                },
                rowMax: {
                  kind: 'number',
                  label: t({ en: 'Maximum row index (optional)', fr: 'Index de ligne maximum (optionnel)' }),
                  variant: 'input'
                }
              }
            }
          ]}
          submitBtnLabel={t({ en: 'Continue', fr: 'Continuer' })}
          validationSchema={z
            .object({
              rowMin: z.int().gte(0),
              rowMax: z.int().gte(0).optional()
            })
            .refine((data) => data.rowMax === undefined || data.rowMax >= data.rowMin, {
              error: t({
                en: 'Maximum must be greater than or equal to minimum',
                fr: 'Maximum doit être supérieur ou égal au minimum'
              })
            })}
          onSubmit={(data) => {
            setRowConfig({ rowMin: data.rowMin, rowMax: data.rowMax ?? null });
            setStep('configColumns');
          }}
        />
      </div>
    </div>
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
  const { t } = useTranslation('common');
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
    <div className="border-b px-6 py-5 last:border-b-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{column.name}</p>
          <p className="text-muted-foreground text-xs uppercase">{column.kind}</p>
        </div>
        <Checkbox checked={isEnabled} onCheckedChange={(checked: boolean) => handleToggle(checked)} />
      </div>

      {isEnabled && (
        <div className="mt-4 space-y-3">
          <div className="border-l-2 pl-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t({ en: 'Hash', fr: 'Hachage' })}</p>
                <p className="text-muted-foreground text-xs">
                  {t({
                    en: "Apply a hash transformation to this column's values",
                    fr: 'Appliquer une transformation de hachage aux valeurs de cette colonne'
                  })}
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
                  <Label htmlFor={`${columnId}-hash-length`}>{t({ en: 'Length', fr: 'Longueur' })}</Label>
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
                  <Label htmlFor={`${columnId}-hash-salt`}>{t({ en: 'Salt (optional)', fr: 'Sel (optionnel)' })}</Label>
                  <Input
                    id={`${columnId}-hash-salt`}
                    placeholder={t({ en: 'Enter salt...', fr: 'Entrez le sel...' })}
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

          <div className="border-l-2 pl-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t({ en: 'Trim', fr: 'Découper' })}</p>
                <p className="text-muted-foreground text-xs">
                  {t({
                    en: 'Trim values to a character range',
                    fr: 'Découper les valeurs dans une plage de caractères'
                  })}
                </p>
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
                  <Label htmlFor={`${columnId}-trim-start`}>{t({ en: 'Start index', fr: 'Index de départ' })}</Label>
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
                  <Label htmlFor={`${columnId}-trim-end`}>
                    {t({ en: 'End index (optional)', fr: 'Index de fin (optionnel)' })}
                  </Label>
                  <Input
                    id={`${columnId}-trim-end`}
                    placeholder={t({ en: 'Leave empty for no limit', fr: 'Laissez vide pour aucune limite' })}
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
    </div>
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
  const { t } = useTranslation('common');
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
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {t({
            en: 'Toggle columns to apply hash or trim transformations. Columns left off will be included as-is.',
            fr: 'Basculez les colonnes pour appliquer des transformations de hachage ou de découpage. Les colonnes laissées de côté seront incluses telles quelles.'
          })}
        </p>
        <p className="text-muted-foreground shrink-0 text-sm tabular-nums">
          {configuredCount} {t({ en: 'of', fr: 'de' })} {entries.length} {t({ en: 'configured', fr: 'configuré' })}
        </p>
      </div>

      <div className="overflow-hidden rounded-md border">
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
        message: t({
          en: 'Please select at least one column before finishing.',
          fr: 'Veuillez sélectionner au moins une colonne avant de terminer.'
        }),
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
            message: `${t({ en: 'Failed to add dataset to project:', fr: "Échec de l'ajout du jeu de données au projet:" })} ${error}`,
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
    <PageContainer>
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
    </PageContainer>
  );
};

export const Route = createFileRoute('/portal/projects/$projectId/datasets/$datasetId/add-columns')({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(columnSummariesQueryOptions(params.datasetId));
  }
});
