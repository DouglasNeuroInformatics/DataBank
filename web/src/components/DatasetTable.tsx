import { useMemo } from 'react';

import type { $DatasetViewPagination, $TabularDataset } from '@databank/core';
import { DataTable, DropdownMenu } from '@douglasneuroinformatics/libui/components';
import { useDestructiveAction, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronDownIcon, HelpCircleIcon, TrashIcon } from 'lucide-react';

import { useChangeColumnTypeMutation } from '@/hooks/mutations/useChangeColumnTypeMutation';
import { useDeleteColumnMutation } from '@/hooks/mutations/useDeleteColumnMutation';
import { useSetColumnDataPermissionMutation } from '@/hooks/mutations/useSetColumnDataPermissionMutation';
import { useSetColumnMetadataPermissionMutation } from '@/hooks/mutations/useSetColumnMetadataPermissionMutation';
import { useToggleColumnNullableMutation } from '@/hooks/mutations/useToggleColumnNullableMutation';

type DatasetRow = $TabularDataset['rows'][number];

type DatasetTableProps = Omit<$TabularDataset, 'permission' | 'status'> & {
  isManager: boolean;
  isProject: boolean;
  rowPagination: $DatasetViewPagination;
  setRowPagination: (pagination: $DatasetViewPagination) => void;
};

const COLUMN_TYPES = ['INT', 'FLOAT', 'STRING', 'DATETIME', 'ENUM'] as const;
const PERMISSION_LEVELS = ['LOGIN', 'MANAGER', 'PUBLIC', 'VERIFIED'] as const;

/**
 * The header of every column doubles as the menu through which a manager edits that column,
 * so the chevron is the only affordance signalling that the header is interactive.
 */
const ColumnHeader = ({
  column,
  dataset,
  onDeleteColumn
}: {
  column: string;
  dataset: DatasetTableProps;
  onDeleteColumn: (columnId: string) => void;
}) => {
  const { t } = useTranslation('common');

  const setColumnMetadataPermission = useSetColumnMetadataPermissionMutation({ isProject: dataset.isProject });
  const setColumnDataPermission = useSetColumnDataPermissionMutation({ isProject: dataset.isProject });
  const toggleColumnNullable = useToggleColumnNullableMutation({ isProject: dataset.isProject });
  const changeColumnType = useChangeColumnTypeMutation({ isProject: dataset.isProject });

  const metadata = dataset.metadata[column];
  const columnId = dataset.columnIds[column]!;
  const isPrimaryKey = dataset.primaryKeys.includes(column);

  const summary = useMemo(() => {
    if (!metadata) {
      return null;
    }
    switch (metadata.kind) {
      case 'DATETIME':
        return metadata.datetimeSummary;
      case 'ENUM':
        return Object.fromEntries(metadata.enumSummary.distribution.map((entry) => [entry[''], entry.count]));
      case 'FLOAT':
        return metadata.floatSummary;
      case 'INT':
        return metadata.intSummary;
      case 'STRING':
        return {};
    }
  }, [metadata]);

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger className="flex min-w-0 items-center gap-1">
        <span className="truncate font-medium">{column}</span>
        <ChevronDownIcon className="size-3 shrink-0 opacity-50" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start" className="w-56">
        {dataset.isManager && (
          <>
            <DropdownMenu.Group>
              {!dataset.isProject && metadata && (
                <>
                  <DropdownMenu.Label>
                    {`${t({ en: 'Data Permission', fr: 'Permission des données' })}: ${metadata.dataPermission}`}
                  </DropdownMenu.Label>
                  <DropdownMenu.Label>
                    {`${t({ en: 'Metadata Permission', fr: 'Permission des métadonnées' })}: ${metadata.metadataPermission}`}
                  </DropdownMenu.Label>
                  <DropdownMenu.Separator />
                </>
              )}
              <DropdownMenu.Item
                disabled={isPrimaryKey}
                onClick={() => toggleColumnNullable.mutate({ columnId, datasetId: dataset.id })}
              >
                {t('toggleColumnNullable')}
                <DropdownMenu.Shortcut>
                  <HelpCircleIcon height={14} width={14} />
                </DropdownMenu.Shortcut>
              </DropdownMenu.Item>
              <DropdownMenu.Item disabled={isPrimaryKey} onClick={() => onDeleteColumn(columnId)}>
                {t('deleteColumn')}
                <DropdownMenu.Shortcut>
                  <TrashIcon height={14} width={14} />
                </DropdownMenu.Shortcut>
              </DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>{t('setColumnPermission')}</DropdownMenu.SubTrigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.SubContent>
                    {PERMISSION_LEVELS.map((permission) => (
                      <DropdownMenu.Item
                        key={permission}
                        onClick={() => setColumnDataPermission.mutate({ columnId, datasetId: dataset.id, permission })}
                      >
                        {permission}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.SubContent>
                </DropdownMenu.Portal>
              </DropdownMenu.Sub>
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>{t('setColumnMetadataPermission')}</DropdownMenu.SubTrigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.SubContent>
                    {PERMISSION_LEVELS.map((permission) => (
                      <DropdownMenu.Item
                        key={permission}
                        onClick={() =>
                          setColumnMetadataPermission.mutate({ columnId, datasetId: dataset.id, permission })
                        }
                      >
                        {permission}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.SubContent>
                </DropdownMenu.Portal>
              </DropdownMenu.Sub>
              {!isPrimaryKey && (
                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger>{t('changeColumnType')}</DropdownMenu.SubTrigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.SubContent>
                      {COLUMN_TYPES.filter((type) => type !== metadata?.kind).map((type) => (
                        <DropdownMenu.Item
                          key={type}
                          onClick={() => changeColumnType.mutate({ columnId, datasetId: dataset.id, type })}
                        >
                          {type}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.SubContent>
                  </DropdownMenu.Portal>
                </DropdownMenu.Sub>
              )}
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
          </>
        )}
        <DropdownMenu.Group>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{t({ en: 'Metadata', fr: 'Métadonnées' })}</DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent>
                {metadata && summary ? (
                  <div className="space-y-1 p-2 text-sm">
                    <p className="font-medium">
                      {t({ en: 'Type', fr: 'Type' })}: {metadata.kind}
                    </p>
                    <p>
                      {t({ en: 'Null Count', fr: 'Compte nul' })}: {metadata.nullCount}
                    </p>
                    <p>
                      {t({ en: 'Count', fr: 'Compte' })}: {metadata.count}
                    </p>
                    {Object.keys(summary).length > 0 && (
                      <>
                        <DropdownMenu.Separator />
                        {Object.entries(summary).map(([key, value]) => (
                          <p key={key}>
                            {key}: {value}
                          </p>
                        ))}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="p-2 text-sm">{t({ en: 'No Permission', fr: 'Pas de permission' })}</div>
                )}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

export const DatasetTable = (dataset: DatasetTableProps) => {
  const { t } = useTranslation('common');
  const deleteColumn = useDeleteColumnMutation({ isProject: dataset.isProject });

  const handleDeleteColumn = useDestructiveAction((columnId: string) => {
    deleteColumn.mutate({ columnId, datasetId: dataset.id });
  });

  const columns = useMemo<ColumnDef<DatasetRow>[]>(() => {
    return dataset.columns.map((column, index) => ({
      accessorFn: (row) => row[column],
      cell: ({ getValue }) => {
        const value = getValue();
        if (typeof value === 'boolean') {
          return value ? t({ en: 'TRUE', fr: 'VRAI' }) : t({ en: 'FALSE', fr: 'FAUX' });
        }
        return value as React.ReactNode;
      },
      enableSorting: false,
      header: () => <ColumnHeader column={column} dataset={dataset} onDeleteColumn={handleDeleteColumn} />,
      id: `column-${index}`
    }));
  }, [dataset, handleDeleteColumn, t]);

  return (
    <DataTable
      disableSearch
      columns={columns}
      data={dataset.rows}
      emptyStateProps={{
        title: t({ en: 'No Data', fr: 'Aucune donnée' })
      }}
      mode="server"
      pageCount={Math.ceil(dataset.totalNumberOfRows / dataset.rowPagination.itemsPerPage)}
      onPaginationChange={({ pageIndex, pageSize }) => {
        dataset.setRowPagination({ currentPage: pageIndex + 1, itemsPerPage: pageSize });
      }}
    />
  );
};
