/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React from 'react';

import type { TabularDataset } from '@databank/types';
import { ActionDropdown, Button } from '@douglasneuroinformatics/libui/components';
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

  const handleSetColumnMetadataPermissionLevel = (
    columnId: string,
    newPermissionLevel: 'LOGIN' | 'MANAGER' | 'PUBLIC' | 'VERIFIED'
  ) => {
    axios
      .patch(`/v1/columns/metadata-permission/${columnId}`, {
        newPermissionLevel
      })
      .then(() => {
        notifications.addNotification({
          message: `Column with Id ${columnId} has been modified`,
          type: 'success'
        });
        navigate(0);
      })
      .catch(console.error);
  };

  const handleSetColumnDataPermissionLevel = (
    columnId: string,
    newPermissionLevel: 'LOGIN' | 'MANAGER' | 'PUBLIC' | 'VERIFIED'
  ) => {
    axios
      .patch(`/v1/columns/data-permission/${columnId}`, {
        newPermissionLevel
      })
      .then(() => {
        notifications.addNotification({
          message: `Column with Id ${columnId} has been modified`,
          type: 'success'
        });
        navigate(0);
      })
      .catch(console.error);
  };

  const handleToggleColumnNullable = (columnId: string) => {
    axios
      .patch(`/v1/columns/nullable/${columnId}`)
      .then(() => {
        notifications.addNotification({
          message: `Column with Id ${columnId} has been modified`,
          type: 'success'
        });
        navigate(-1);
      })
      .catch(console.error);
  };

  const handleChangeColumnType = (columnId: string, type: string) => {
    axios
      .patch(`/v1/columns/type/${columnId}`, {
        type
      })
      .then(() => {
        notifications.addNotification({
          message: `Column with Id ${columnId} has been modified`,
          type: 'success'
        });
        navigate(0);
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
                          <DropdownMenu.Item>
                            <ActionDropdown
                              options={['LOGIN', 'MANAGER', 'PUBLIC', 'VERIFIED']}
                              title={t('setColumnPermission')}
                              widthFull={true}
                              onSelection={(options) =>
                                handleSetColumnDataPermissionLevel(tabularDataset.columnIds[column]!, options)
                              }
                            />
                          </DropdownMenu.Item>
                          <DropdownMenu.Item>
                            <ActionDropdown
                              options={['LOGIN', 'MANAGER', 'PUBLIC', 'VERIFIED']}
                              title={t('setColumnMetadataPermission')}
                              widthFull={true}
                              onSelection={(options) =>
                                handleSetColumnMetadataPermissionLevel(tabularDataset.columnIds[column]!, options)
                              }
                            />
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            onClick={() => handleToggleColumnNullable(tabularDataset.columnIds[column]!)}
                          >
                            {t('toggleColumnNullable')}
                          </DropdownMenu.Item>
                          <DropdownMenu.Item>
                            <ActionDropdown
                              options={['INT', 'FLOAT', 'String', 'BOOLEAN', 'DATETIME', 'ENUM'].filter(
                                (x) => x !== tabularDataset.metadata[column]?.kind
                              )}
                              title={t('changeColumnType')}
                              widthFull={true}
                              onSelection={(options) =>
                                handleChangeColumnType(tabularDataset.columnIds[column]!, options)
                              }
                            />
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
                                {(tabularDataset.metadata[column]?.min ||
                                  tabularDataset.metadata[column]?.min === 0) && (
                                  <h4 className="text-sm font-semibold">{`Min: ${tabularDataset.metadata[column]?.min}`}</h4>
                                )}
                                {(tabularDataset.metadata[column]?.max ||
                                  tabularDataset.metadata[column]?.max === 0) && (
                                  <h4 className="text-sm font-semibold">{`Max: ${tabularDataset.metadata[column]?.max}`}</h4>
                                )}
                                {(tabularDataset.metadata[column]?.mean ||
                                  tabularDataset.metadata[column]?.mean === 0) && (
                                  <h4 className="text-sm font-semibold">{`Mean: ${tabularDataset.metadata[column]?.mean}`}</h4>
                                )}
                                {(tabularDataset.metadata[column]?.median ||
                                  tabularDataset.metadata[column]?.median === 0) && (
                                  <h4 className="text-sm font-semibold">{`Median: ${tabularDataset.metadata[column]?.median}`}</h4>
                                )}
                                {(tabularDataset.metadata[column]?.mode ||
                                  tabularDataset.metadata[column]?.mode === 0) && (
                                  <h4 className="text-sm font-semibold">{`Mode: ${tabularDataset.metadata[column]?.mode}`}</h4>
                                )}
                                {(tabularDataset.metadata[column]?.std ||
                                  tabularDataset.metadata[column]?.std === 0) && (
                                  <h4 className="text-sm font-semibold">{`Standard deviation: ${tabularDataset.metadata[column]?.std}`}</h4>
                                )}
                                {tabularDataset.metadata[column]?.distribution && (
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
