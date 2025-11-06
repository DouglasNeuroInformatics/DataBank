import { $ColumnType, $PermissionLevel } from '@databank/core';
import type { $TabularDataset } from '@databank/core';
import { DropdownMenu, Table } from '@douglasneuroinformatics/libui/components';
import { useDestructiveAction, useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { ChevronDownIcon, QuestionMarkCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type DatasetTableProps = Omit<$TabularDataset, 'permission'> & {
  isManager: boolean;
  isProject: boolean;
  queryKey: string;
};

export const DatasetTable = (tabularDataset: DatasetTableProps) => {
  const { t } = useTranslation('common');
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const queryClient = useQueryClient();

  const handleSetColumnMetadataPermissionLevel = useDestructiveAction(
    async (columnId: string, newPermissionLevel: $PermissionLevel) => {
      await axios
        .patch(`/v1/datasets/column-metadata-permission/${tabularDataset.id}/${columnId}`, {
          permission: newPermissionLevel
        })
        .then(() => {
          addNotification({
            message: `The metadata permission level of column with Id ${columnId} has been modified`,
            type: 'success'
          });
          void queryClient.invalidateQueries({
            queryKey: [tabularDataset.queryKey]
          });
        })
        .catch((error) => {
          console.error(error);
          addNotification({
            message: t('setColumnMetadataPermissionFailure'),
            type: 'error'
          });
        });
    }
  );

  const handleSetColumnDataPermissionLevel = useDestructiveAction(
    async (columnId: string, newPermissionLevel: $PermissionLevel) => {
      await axios
        .patch(`/v1/datasets/column-data-permission/${tabularDataset.id}/${columnId}`, {
          permission: newPermissionLevel
        })
        .then(() => {
          addNotification({
            message: `The data permission level of column with Id ${columnId} has been modified`,
            type: 'success'
          });
          void queryClient.invalidateQueries({ queryKey: [tabularDataset.queryKey] });
        })
        .catch((error) => {
          console.error(error);
          addNotification({
            message: t('setColumnDataPermissionFailure'),
            type: 'error'
          });
        });
    }
  );

  const handleToggleColumnNullable = async (columnId: string) => {
    await axios
      .patch(`/v1/datasets/column-nullable/${tabularDataset.id}/${columnId}`)
      .then(() => {
        addNotification({
          message: `The nullability of column with Id ${columnId} has been modified`,
          type: 'success'
        });
        void queryClient.invalidateQueries({ queryKey: [tabularDataset.queryKey] });
      })
      .catch((error) => {
        console.error(error);
        addNotification({
          message: t('toggleColumnNullableFailure'),
          type: 'error'
        });
      });
  };

  const handleChangeColumnType = useDestructiveAction(async (columnId: string, type: $ColumnType) => {
    await axios
      .patch(`/v1/datasets/column-type/${tabularDataset.id}/${columnId}`, { kind: type })
      .then(() => {
        addNotification({
          message: `The data type of column with Id ${columnId} has been modified`,
          type: 'success'
        });
        void queryClient.invalidateQueries({ queryKey: [tabularDataset.queryKey] });
      })
      .catch((error) => {
        console.error(error);
        addNotification({
          message: t('changeColumnDataTypeFailure'),
          type: 'error'
        });
      });
  });

  const handleDeleteColumn = useDestructiveAction(async (columnId: string) => {
    await axios
      .delete(`/v1/datasets/column/${tabularDataset.id}/${columnId}`)
      .then(() => {
        addNotification({
          message: `The column with Id ${columnId} has been deleted.`,
          type: 'success'
        });
        void queryClient.invalidateQueries({ queryKey: [tabularDataset.queryKey] });
      })
      .catch((error) => {
        console.error(error);
        addNotification({
          message: t('deleteColumnFailure'),
          type: 'error'
        });
      });
  });

  const getSummary = (columnName: string) => {
    if (!tabularDataset.metadata[columnName]) {
      return (
        <DropdownMenu.Portal>
          <DropdownMenu.SubContent>
            <div className="flex justify-between space-x-4 p-2">
              <div className="space-y-2 text-sm font-medium">
                <h4>{`No Permission`}</h4>
              </div>
            </div>
          </DropdownMenu.SubContent>
        </DropdownMenu.Portal>
      );
    }

    const metadataObj = tabularDataset.metadata[columnName];
    let summary;
    switch (metadataObj.kind) {
      case 'DATETIME':
        summary = metadataObj.datetimeSummary;
        break;
      case 'ENUM': {
        const enumSummaryObj: { [key: string]: number } = {};
        metadataObj.enumSummary.distribution.map((entry) => {
          enumSummaryObj[entry['']] = entry.count;
        });
        summary = enumSummaryObj;
        break;
      }
      case 'FLOAT':
        summary = metadataObj.floatSummary;
        break;
      case 'INT':
        summary = metadataObj.intSummary;
        break;
      case 'STRING':
        summary = {};
        break;
    }

    return (
      <DropdownMenu.Portal>
        <DropdownMenu.SubContent>
          <div className="flex justify-between space-x-4 p-2">
            <div className="space-y-2 text-sm font-medium">
              <h4>{`Data Type: ${metadataObj.kind}`}</h4>
              <h4>{`Null Count: ${metadataObj.nullCount}`}</h4>
              <h4>{`Count: ${metadataObj.count}`}</h4>
              <hr />
              {Object.entries(summary).map(([key, value]) => {
                return <h4 key={key}>{`${key}: ${value}`}</h4>;
              })}
            </div>
          </div>
        </DropdownMenu.SubContent>
      </DropdownMenu.Portal>
    );
  };

  return (
    <div className="bg-card text-muted-foreground shadow-xs m-3 rounded-md border tracking-tight">
      <Table>
        <Table.Header>
          <Table.Row>
            {tabularDataset.columns.map((column, i) => (
              <Table.Head className="text-foreground whitespace-nowrap" key={i}>
                <DropdownMenu>
                  <DropdownMenu.Trigger>
                    <div className="flex justify-around gap-0.5">
                      {column}
                      <ChevronDownIcon className="w-3" />
                    </div>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content className="w-64">
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
                              <hr />
                            </>
                          ) : null}
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
