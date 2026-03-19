import type { $TabularDataset } from '@databank/core';
import { DropdownMenu, Table } from '@douglasneuroinformatics/libui/components';
import { useDestructiveAction, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { ChevronDownIcon, HelpCircleIcon, TrashIcon } from 'lucide-react';

import { useChangeColumnTypeMutation } from '@/hooks/mutations/useChangeColumnTypeMutation';
import { useDeleteColumnMutation } from '@/hooks/mutations/useDeleteColumnMutation';
import { useSetColumnDataPermissionMutation } from '@/hooks/mutations/useSetColumnDataPermissionMutation';
import { useSetColumnMetadataPermissionMutation } from '@/hooks/mutations/useSetColumnMetadataPermissionMutation';
import { useToggleColumnNullableMutation } from '@/hooks/mutations/useToggleColumnNullableMutation';

type DatasetTableProps = Omit<$TabularDataset, 'permission'> & { isManager: boolean; isProject: boolean };

const COLUMN_TYPES = ['INT', 'FLOAT', 'STRING', 'DATETIME', 'ENUM'] as const;
const PERMISSION_LEVELS = ['LOGIN', 'MANAGER', 'PUBLIC', 'VERIFIED'] as const;

export const DatasetTable = (tabularDataset: DatasetTableProps) => {
  const { t } = useTranslation('common');

  const setColumnMetadataPermission = useSetColumnMetadataPermissionMutation({ isProject: tabularDataset.isProject });
  const setColumnDataPermission = useSetColumnDataPermissionMutation({ isProject: tabularDataset.isProject });
  const toggleColumnNullable = useToggleColumnNullableMutation({ isProject: tabularDataset.isProject });
  const changeColumnType = useChangeColumnTypeMutation({ isProject: tabularDataset.isProject });
  const deleteColumn = useDeleteColumnMutation({ isProject: tabularDataset.isProject });

  const handleDeleteColumn = useDestructiveAction((columnId: string) => {
    deleteColumn.mutate({ columnId, datasetId: tabularDataset.id });
  });

  const getSummary = (columnName: string) => {
    if (!tabularDataset.metadata[columnName]) {
      return (
        <DropdownMenu.Portal>
          <DropdownMenu.SubContent>
            <div className="p-2 text-sm">No Permission</div>
          </DropdownMenu.SubContent>
        </DropdownMenu.Portal>
      );
    }

    const metadataObj = tabularDataset.metadata[columnName];
    const summary = (() => {
      switch (metadataObj.kind) {
        case 'DATETIME':
          return metadataObj.datetimeSummary;
        case 'ENUM':
          return Object.fromEntries(metadataObj.enumSummary.distribution.map((entry) => [entry[''], entry.count]));
        case 'FLOAT':
          return metadataObj.floatSummary;
        case 'INT':
          return metadataObj.intSummary;
        case 'STRING':
          return {};
      }
    })();

    return (
      <DropdownMenu.Portal>
        <DropdownMenu.SubContent>
          <div className="space-y-1 p-2 text-sm">
            <p className="font-medium">Type: {metadataObj.kind}</p>
            <p>Null Count: {metadataObj.nullCount}</p>
            <p>Count: {metadataObj.count}</p>
            {Object.keys(summary).length > 0 && (
              <>
                <hr className="my-1.5" />
                {Object.entries(summary).map(([key, value]) => (
                  <p key={key}>
                    {key}: {value}
                  </p>
                ))}
              </>
            )}
          </div>
        </DropdownMenu.SubContent>
      </DropdownMenu.Portal>
    );
  };

  return (
    <div className="overflow-auto">
      <Table>
        <Table.Header>
          <Table.Row>
            {tabularDataset.columns.map((column, i) => (
              <Table.Head className="text-foreground whitespace-nowrap" key={i}>
                <DropdownMenu>
                  <DropdownMenu.Trigger>
                    <div className="flex items-center gap-1">
                      <span>{column}</span>
                      <ChevronDownIcon className="size-3 opacity-50" />
                    </div>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content className="w-56">
                    {tabularDataset.isManager && (
                      <>
                        <DropdownMenu.Group>
                          {!tabularDataset.isProject ? (
                            <>
                              <DropdownMenu.Label>
                                {`Data Permission: ${tabularDataset.metadata[column]!.dataPermission}`}
                              </DropdownMenu.Label>
                              <DropdownMenu.Label>
                                {`Metadata Permission: ${tabularDataset.metadata[column]!.metadataPermission}`}
                              </DropdownMenu.Label>
                              <DropdownMenu.Separator />
                            </>
                          ) : null}
                          <DropdownMenu.Item
                            disabled={tabularDataset.primaryKeys.includes(column)}
                            onClick={() =>
                              toggleColumnNullable.mutate({
                                columnId: tabularDataset.columnIds[column]!,
                                datasetId: tabularDataset.id
                              })
                            }
                          >
                            {t('toggleColumnNullable')}
                            <DropdownMenu.Shortcut>
                              <HelpCircleIcon height={14} width={14} />
                            </DropdownMenu.Shortcut>
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            disabled={tabularDataset.primaryKeys.includes(column)}
                            onClick={() => handleDeleteColumn(tabularDataset.columnIds[column]!)}
                          >
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
                                {PERMISSION_LEVELS.map((option) => (
                                  <DropdownMenu.Item
                                    key={option}
                                    onClick={() =>
                                      setColumnDataPermission.mutate({
                                        columnId: tabularDataset.columnIds[column]!,
                                        datasetId: tabularDataset.id,
                                        permission: option
                                      })
                                    }
                                  >
                                    {option}
                                  </DropdownMenu.Item>
                                ))}
                              </DropdownMenu.SubContent>
                            </DropdownMenu.Portal>
                          </DropdownMenu.Sub>
                          <DropdownMenu.Sub>
                            <DropdownMenu.SubTrigger>{t('setColumnMetadataPermission')}</DropdownMenu.SubTrigger>
                            <DropdownMenu.Portal>
                              <DropdownMenu.SubContent>
                                {PERMISSION_LEVELS.map((option) => (
                                  <DropdownMenu.Item
                                    key={option}
                                    onClick={() =>
                                      setColumnMetadataPermission.mutate({
                                        columnId: tabularDataset.columnIds[column]!,
                                        datasetId: tabularDataset.id,
                                        permission: option
                                      })
                                    }
                                  >
                                    {option}
                                  </DropdownMenu.Item>
                                ))}
                              </DropdownMenu.SubContent>
                            </DropdownMenu.Portal>
                          </DropdownMenu.Sub>
                          <DropdownMenu.Sub>
                            {!tabularDataset.primaryKeys.includes(column) && (
                              <>
                                <DropdownMenu.SubTrigger>{t('changeColumnType')}</DropdownMenu.SubTrigger>
                                <DropdownMenu.Portal>
                                  <DropdownMenu.SubContent>
                                    {COLUMN_TYPES.filter((x) => x !== tabularDataset.metadata[column]?.kind).map(
                                      (option) => (
                                        <DropdownMenu.Item
                                          key={option}
                                          onClick={() =>
                                            changeColumnType.mutate({
                                              columnId: tabularDataset.columnIds[column]!,
                                              datasetId: tabularDataset.id,
                                              type: option
                                            })
                                          }
                                        >
                                          {option}
                                        </DropdownMenu.Item>
                                      )
                                    )}
                                  </DropdownMenu.SubContent>
                                </DropdownMenu.Portal>
                              </>
                            )}
                          </DropdownMenu.Sub>
                        </DropdownMenu.Group>
                      </>
                    )}
                    <DropdownMenu.Group>
                      <DropdownMenu.Sub>
                        <DropdownMenu.SubTrigger>Metadata</DropdownMenu.SubTrigger>
                        {getSummary(column)}
                      </DropdownMenu.Sub>
                    </DropdownMenu.Group>
                  </DropdownMenu.Content>
                </DropdownMenu>
              </Table.Head>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tabularDataset.rows.map((currRow, i) => (
            <Table.Row key={i}>
              {tabularDataset.columns.map((currCol, j) => (
                <Table.Cell className="whitespace-nowrap" key={j}>
                  {typeof currRow[currCol] === 'boolean' ? (currRow[currCol] ? 'TRUE' : 'FALSE') : currRow[currCol]}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
