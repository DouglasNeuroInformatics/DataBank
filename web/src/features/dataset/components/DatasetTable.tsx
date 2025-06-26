/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

import type { ColumnType, PermissionLevel, TabularDataset } from '@databank/core';
import { DropdownMenu, Table } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { ChevronDownIcon, QuestionMarkCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type DatasetTableProps = TabularDataset & { isManager: boolean };

export const DatasetTable = (tabularDataset: DatasetTableProps) => {
  const { t } = useTranslation('common');
  const notifications = useNotificationsStore();
  const queryClient = useQueryClient();

  const handleSetColumnMetadataPermissionLevel = async (columnId: string, newPermissionLevel: PermissionLevel) => {
    await axios.patch(`/v1/datasets/column-metadata-permission/${tabularDataset.id}/${columnId}`, {
      newPermissionLevel
    });
    await queryClient.invalidateQueries({ queryKey: ['dataset-query'] });
    notifications.addNotification({
      message: `Column with Id ${columnId} has been modified`,
      type: 'success'
    });
  };

  const handleSetColumnDataPermissionLevel = async (columnId: string, newPermissionLevel: PermissionLevel) => {
    await axios.patch(`/v1/datasets/column-data-permission/${tabularDataset.id}/${columnId}`, {
      newPermissionLevel
    });
    await queryClient.invalidateQueries({ queryKey: ['dataset-query'] });
    notifications.addNotification({
      message: `Column with Id ${columnId} has been modified`,
      type: 'success'
    });
  };

  const handleToggleColumnNullable = async (columnId: string) => {
    await axios.patch(`/v1/datasets/column-nullable/${tabularDataset.id}/${columnId}`);
    await queryClient.invalidateQueries({ queryKey: ['dataset-query'] });
    notifications.addNotification({
      message: `Column with Id ${columnId} has been modified`,
      type: 'success'
    });
  };

  const handleChangeColumnType = async (columnId: string, type: ColumnType) => {
    await axios.patch(`/v1/datasets/column-type/${tabularDataset.id}/${columnId}`, { type });
    await queryClient.invalidateQueries({ queryKey: ['dataset-query'] });
    notifications.addNotification({
      message: `Column with Id ${columnId} has been modified`,
      type: 'success'
    });
  };

  const handleDeleteColumn = async (columnId: string) => {
    await axios.delete(`/v1/datasets/column/${tabularDataset.id}/${columnId}`);
    await queryClient.invalidateQueries({ queryKey: ['dataset-query'] });
    notifications.addNotification({
      message: `Column with Id ${columnId} has been deleted`,
      type: 'success'
    });
  };

  return (
    <div className="bg-card text-muted-foreground shadow-xs m-3 rounded-md border tracking-tight">
      <Table>
        <Table.Header>
          <Table.Row>
            {tabularDataset.columns.map((column, i) => (
              <Table.Head className="text-foreground whitespace-nowrap" key={i}>
                <DropdownMenu>
                  <DropdownMenu.Trigger className="flex items-center justify-between gap-3">
                    <span>{column}</span>
                    <ChevronDownIcon />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content className="w-56">
                    <DropdownMenu.Label>{column}</DropdownMenu.Label>
                    {tabularDataset.isManager && (
                      <>
                        <DropdownMenu.Group>
                          <DropdownMenu.Item
                            disabled={tabularDataset.primaryKeys.includes(column)}
                            onClick={() => void handleToggleColumnNullable(tabularDataset.columnIds[column]!)}
                          >
                            {t('toggleColumnNullable')}
                            <DropdownMenu.Shortcut>
                              <QuestionMarkCircleIcon height={14} width={14} />
                            </DropdownMenu.Shortcut>
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            disabled={tabularDataset.primaryKeys.includes(column)}
                            onClick={() => void handleDeleteColumn(tabularDataset.columnIds[column]!)}
                          >
                            {t('deleteColumn')}
                            <DropdownMenu.Shortcut>
                              <TrashIcon height={14} width={14} />
                            </DropdownMenu.Shortcut>
                          </DropdownMenu.Item>
                        </DropdownMenu.Group>
                        <DropdownMenu.Group>
                          <DropdownMenu.Sub>
                            <DropdownMenu.SubTrigger>{t('setColumnPermission')}</DropdownMenu.SubTrigger>
                            <DropdownMenu.Portal>
                              <DropdownMenu.SubContent>
                                {(['LOGIN', 'MANAGER', 'PUBLIC', 'VERIFIED'] as const).map((option) => (
                                  <DropdownMenu.Item
                                    key={option}
                                    onClick={() =>
                                      void handleSetColumnDataPermissionLevel(tabularDataset.columnIds[column]!, option)
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
                                {(['LOGIN', 'MANAGER', 'PUBLIC', 'VERIFIED'] as const).map((option) => (
                                  <DropdownMenu.Item
                                    key={option}
                                    onClick={() =>
                                      void handleSetColumnMetadataPermissionLevel(
                                        tabularDataset.columnIds[column]!,
                                        option
                                      )
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
                                    {(['INT', 'FLOAT', 'STRING', 'DATETIME', 'ENUM'] as const)
                                      .filter((x) => x !== tabularDataset.metadata[column]?.kind)
                                      .map((option) => (
                                        <DropdownMenu.Item
                                          key={option}
                                          onClick={() =>
                                            void handleChangeColumnType(tabularDataset.columnIds[column]!, option)
                                          }
                                        >
                                          {option}
                                        </DropdownMenu.Item>
                                      ))}
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
                        <DropdownMenu.Portal>
                          <DropdownMenu.SubContent>
                            <div className="flex justify-between space-x-4 p-2">
                              <div className="space-y-2 text-sm font-medium">
                                <h4>{`Data Type: ${tabularDataset.metadata[column]?.kind}`}</h4>
                                <h4>{`Null Count: ${tabularDataset.metadata[column]?.nullCount}`}</h4>
                                <h4>{`Count: ${tabularDataset.metadata[column]?.count}`}</h4>
                                {(tabularDataset.metadata[column]?.min ||
                                  tabularDataset.metadata[column]?.min === 0) && (
                                  <h4>{`Min: ${tabularDataset.metadata[column]?.min}`}</h4>
                                )}
                                {(tabularDataset.metadata[column]?.max ||
                                  tabularDataset.metadata[column]?.max === 0) && (
                                  <h4>{`Max: ${tabularDataset.metadata[column]?.max}`}</h4>
                                )}
                                {(tabularDataset.metadata[column]?.mean ||
                                  tabularDataset.metadata[column]?.mean === 0) && (
                                  <h4>{`Mean: ${tabularDataset.metadata[column]?.mean}`}</h4>
                                )}
                                {(tabularDataset.metadata[column]?.median ||
                                  tabularDataset.metadata[column]?.median === 0) && (
                                  <h4>{`Median: ${tabularDataset.metadata[column]?.median}`}</h4>
                                )}
                                {(tabularDataset.metadata[column]?.mode ||
                                  tabularDataset.metadata[column]?.mode === 0) && (
                                  <h4>{`Mode: ${tabularDataset.metadata[column]?.mode}`}</h4>
                                )}
                                {(tabularDataset.metadata[column]?.std ||
                                  tabularDataset.metadata[column]?.std === 0) && (
                                  <h4>{`Standard deviation: ${tabularDataset.metadata[column]?.std}`}</h4>
                                )}
                                {tabularDataset.metadata[column]?.distribution && (
                                  <h4>{`Distribution: ${JSON.stringify(tabularDataset.metadata[column]?.distribution)}`}</h4>
                                )}
                              </div>
                            </div>
                          </DropdownMenu.SubContent>
                        </DropdownMenu.Portal>
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
                <Table.Cell key={j}>
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
