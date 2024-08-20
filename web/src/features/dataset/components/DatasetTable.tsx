import React from 'react';

import type { PermissionLevel, TabularDataset } from '@databank/types';
import { Button } from '@douglasneuroinformatics/libui/components';
import { DropdownMenu } from '@douglasneuroinformatics/libui/components';
import { HoverCard } from '@douglasneuroinformatics/libui/components';
import { Table } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export type DatasetTableProps = { isManager: boolean } & TabularDataset;

const DatasetTable = (tabularDataset: DatasetTableProps) => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const notifications = useNotificationsStore();

  const handleSetColumnMetadataPermissionLevel = (columnId: string, newPermissionLevel: PermissionLevel) => {
    axios
      .patch(`/v1/columns/${columnId}/${newPermissionLevel}`)
      .then(() => {
        notifications.addNotification({
          message: `Column with Id ${columnId} has been modified`,
          type: 'success'
        });
        navigate(`/portal/datasets`);
      })
      .catch(console.error);
  };

  const handleSetColumnDataPermissionLevel = (columnId: string, newPermissionLevel: PermissionLevel) => {
    axios
      .patch(`/v1/columns/${columnId}/${newPermissionLevel}`)
      .then(() => {
        notifications.addNotification({
          message: `Column with Id ${columnId} has been modified`,
          type: 'success'
        });
        navigate(`/portal/datasets`);
      })
      .catch(console.error);
  };

  const handleSetColumnNullable = (columnId: string) => {
    axios
      .patch(`/v1/columns/${columnId}`)
      .then(() => {
        notifications.addNotification({
          message: `Column with Id ${columnId} has been modified`,
          type: 'success'
        });
        navigate(`/portal/datasets`);
      })
      .catch(console.error);
  };

  const handleChangeColumnType = (columnId: string, type: string) => {
    axios
      .patch(`/v1/columns/${columnId}/${type}`)
      .then(() => {
        notifications.addNotification({
          message: `Column with Id ${columnId} has been modified`,
          type: 'success'
        });
        navigate(`/portal/datasets`);
      })
      .catch(console.error);
  };

  const handleDeleteColumn = (columnId: string) => {
    axios
      .delete(`/v1/columns/${columnId}`)
      .then(() => {
        notifications.addNotification({
          message: `Column with Id ${columnId} has been deleted`,
          type: 'success'
        });
        navigate(`/portal/datasets`);
      })
      .catch(console.error);
  };

  return (
    <div className="m-3 rounded-md border bg-card tracking-tight text-muted-foreground shadow-sm">
      <Table>
        <Table.Header>
          <Table.Row>
            {tabularDataset.columns.map((column, i) => (
              <Table.Head className="whitespace-nowrap text-foreground" key={i}>
                <DropdownMenu>
                  <DropdownMenu.Trigger className="flex items-center justify-between gap-3">
                    <span>{column}</span>
                    <ChevronDownIcon />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content className="w-56">
                    <DropdownMenu.Label>{column}</DropdownMenu.Label>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Group>
                      {tabularDataset.isManager && (
                        <>
                          <DropdownMenu.Item
                            onClick={() => {
                              handleSetColumnDataPermissionLevel;
                            }}
                          >
                            {t('setColumnPermissionLevel')}
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            onClick={() => {
                              handleSetColumnMetadataPermissionLevel;
                            }}
                          >
                            {t('setColumnMetadataPermissionLevel')}
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            onClick={() => {
                              handleSetColumnNullable;
                            }}
                          >
                            {t('setColumnNullable')}
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            onClick={() => {
                              handleChangeColumnType;
                            }}
                          >
                            {t('changeColumnType')}
                          </DropdownMenu.Item>
                          <DropdownMenu.Item onClick={() => handleDeleteColumn(tabularDataset.columnIds[column]!)}>
                            {t('deleteColumn')}
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator />
                        </>
                      )}

                      <DropdownMenu.Item>
                        <HoverCard>
                          <HoverCard.Trigger asChild>
                            <Button variant={'link'}>Metadata</Button>
                          </HoverCard.Trigger>
                          <HoverCard.Content className="w-80">
                            <div className="flex justify-between space-x-4">
                              <div className="space-y-1">
                                <h4 className="text-sm font-semibold">{`Data Type: ${tabularDataset.metadata[column]?.kind}`}</h4>
                                <h4 className="text-sm font-semibold">{`Null Count: ${tabularDataset.metadata[column]?.nullCount}`}</h4>
                                <h4 className="text-sm font-semibold">{`Count: ${tabularDataset.metadata[column]?.count}`}</h4>
                                {Boolean(tabularDataset.metadata[column]?.min) && (
                                  <h4 className="text-sm font-semibold">{`Min: ${tabularDataset.metadata[column]?.min}`}</h4>
                                )}
                                {Boolean(tabularDataset.metadata[column]?.max) && (
                                  <h4 className="text-sm font-semibold">{`Max: ${tabularDataset.metadata[column]?.max}`}</h4>
                                )}
                                {Boolean(tabularDataset.metadata[column]?.mean) && (
                                  <h4 className="text-sm font-semibold">{`Mean: ${tabularDataset.metadata[column]?.mean}`}</h4>
                                )}
                                {Boolean(tabularDataset.metadata[column]?.median) && (
                                  <h4 className="text-sm font-semibold">{`Median: ${tabularDataset.metadata[column]?.median}`}</h4>
                                )}
                                {Boolean(tabularDataset.metadata[column]?.mode) && (
                                  <h4 className="text-sm font-semibold">{`Mode: ${tabularDataset.metadata[column]?.mode}`}</h4>
                                )}
                                {Boolean(tabularDataset.metadata[column]?.std) && (
                                  <h4 className="text-sm font-semibold">{`Standard deviation: ${tabularDataset.metadata[column]?.std}`}</h4>
                                )}
                                {Boolean(tabularDataset.metadata[column]?.distribution) && (
                                  <h4 className="text-sm font-semibold">{`Distribution: ${JSON.stringify(tabularDataset.metadata[column]?.distribution)}`}</h4>
                                )}
                              </div>
                            </div>
                          </HoverCard.Content>
                        </HoverCard>
                      </DropdownMenu.Item>
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

export default DatasetTable;
