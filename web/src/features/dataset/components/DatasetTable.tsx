/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react';

import type { TabularDataset } from '@databank/types';
import { Button } from '@douglasneuroinformatics/libui/components';
import { Card } from '@douglasneuroinformatics/libui/components';
import { DropdownMenu } from '@douglasneuroinformatics/libui/components';
import { HoverCard } from '@douglasneuroinformatics/libui/components';
import { Table } from '@douglasneuroinformatics/libui/components';
import { useDownload, useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

// need a type for all columns metadata: an object with column names as keys and
// the value with types of a union of all summaries

export type DatasetTableProps = { isManager: boolean } & TabularDataset;

const DatasetTable = (tabularDataset: DatasetTableProps) => {
  const download = useDownload();
  const notifications = useNotificationsStore();
  // useEffect to fetch the dataset from the server

  const removeManager = () => {
    //
  };

  const addManager = () => {
    //
  };

  const deleteDataset = (datasetId: string) => {
    axios
      .delete(`v1/datasets/${datasetId}`)
      .then(() => {
        notifications.addNotification({
          message: `Successfully deleted the dataset with ID ${datasetId}`,
          type: 'info'
        });
      })
      .catch(() => {
        notifications.addNotification({
          message: `Fail to delete the dataset with ID ${datasetId}`,
          type: 'error'
        });
      });
  };

  // move this part one level above into a page, this component should just be
  // the table
  return (
    <>
      <Card>
        <Card.Header>
          {/* <Card.Title>{tabularDataset.name}</Card.Title>
          <Card.Description>{tabularDataset.description}</Card.Description> */}
          {tabularDataset.isManager && (
            <>
              <Button className="m-2" variant={'secondary'} onClick={addManager}>
                Add Manager
              </Button>

              <Button className="m-2" variant={'secondary'} onClick={removeManager}>
                Remove Manager
              </Button>

              <Button className="m-2" variant={'danger'} onClick={() => deleteDataset(tabularDataset.id)}>
                Delete Dataset
              </Button>
            </>
          )}
        </Card.Header>
        <Card.Content>
          <ul>
            {/* <li>Created at: {tabularDataset.createdAt}</li>
            <li>Updated at: {tabularDataset.updatedAt}</li> */}
            {/* <li>Licence: {tabularDataset.}</li> */}
            <li>
              Primary keys:{' '}
              {tabularDataset.primaryKeys.map((pk, i) => {
                return (
                  <span className="m-2" key={i}>
                    {pk}
                  </span>
                );
              })}
            </li>
          </ul>
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
                                    return 'TODO';
                                  }}
                                >
                                  Set Data Permission Level
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                  onClick={() => {
                                    return 'TODO';
                                  }}
                                >
                                  Set Metadata Permission Level
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                  onClick={() => {
                                    return 'TODO';
                                  }}
                                >
                                  Set Nullable
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                  onClick={() => {
                                    return 'TODO';
                                  }}
                                >
                                  Change Type
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                  onClick={() => {
                                    return 'TODO';
                                  }}
                                >
                                  Delete
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
                                      <h4 className="text-sm font-semibold">{`Null Count: ${tabularDataset.metadata[column]?.summary.nullCount}`}</h4>
                                      <h4 className="text-sm font-semibold">{`Count: ${tabularDataset.metadata[column]?.summary.count}`}</h4>
                                      {Boolean(tabularDataset.metadata[column]?.summary.min) && (
                                        <h4 className="text-sm font-semibold">{`Min: ${tabularDataset.metadata[column]?.summary.min}`}</h4>
                                      )}
                                      {Boolean(tabularDataset.metadata[column]?.summary.max) && (
                                        <h4 className="text-sm font-semibold">{`Max: ${tabularDataset.metadata[column]?.summary.max}`}</h4>
                                      )}
                                      {Boolean(tabularDataset.metadata[column]?.summary.mean) && (
                                        <h4 className="text-sm font-semibold">{`Mean: ${tabularDataset.metadata[column]?.summary.mean}`}</h4>
                                      )}
                                      {Boolean(tabularDataset.metadata[column]?.summary.median) && (
                                        <h4 className="text-sm font-semibold">{`Median: ${tabularDataset.metadata[column]?.summary.median}`}</h4>
                                      )}
                                      {Boolean(tabularDataset.metadata[column]?.summary.mode) && (
                                        <h4 className="text-sm font-semibold">{`Mode: ${tabularDataset.metadata[column]?.summary.mode}`}</h4>
                                      )}
                                      {Boolean(tabularDataset.metadata[column]?.summary.std) && (
                                        <h4 className="text-sm font-semibold">{`Standard deviation: ${tabularDataset.metadata[column]?.summary.std}`}</h4>
                                      )}
                                      {Boolean(tabularDataset.metadata[column]?.summary.distribution) && (
                                        <h4 className="text-sm font-semibold">{`Distribution: ${JSON.stringify(tabularDataset.metadata[column]?.summary.distribution)}`}</h4>
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
                        {typeof currRow[currCol] === 'boolean'
                          ? currRow[currCol]
                            ? 'TRUE'
                            : 'FALSE'
                          : currRow[currCol]}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </Card.Content>
        <Card.Footer>
          {tabularDataset.isManager && (
            <>
              <Button
                className="m-2"
                variant={'primary'}
                onClick={() => {
                  return 'TODO';
                }}
              >
                Edit Dataset Information
              </Button>

              <Button
                className="m-2"
                variant={'primary'}
                onClick={() => {
                  return 'TODO';
                }}
              >
                Set Dataset Sharable
              </Button>

              <Button className="m-2" variant={'secondary'}>
                <DropdownMenu>
                  <DropdownMenu.Trigger className="flex items-center justify-between gap-3">
                    Download Dataset
                    <ChevronDownIcon className="size-[1rem]" />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content className="w-48">
                    <DropdownMenu.Item
                      onClick={async () => {
                        await download('hello' + '.tsv', 'wowowowo\there\tis\ta\thello');
                      }}
                    >
                      Download TSV
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onClick={async () => {
                        await download('hello' + '.csv', 'wowowowo,here,is,a,hello');
                      }}
                    >
                      Download CSV
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu>
              </Button>

              <Button className="m-2" variant={'secondary'}>
                <DropdownMenu>
                  <DropdownMenu.Trigger className="flex items-center justify-between gap-3">
                    Download Metadata
                    <ChevronDownIcon className="size-[1rem]" />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content className="w-48">
                    <DropdownMenu.Item
                      onClick={async () => {
                        await download('hello' + '_dictionary_' + '.tsv', 'wowowowo\there\tis\ta\thello');
                      }}
                    >
                      Download TSV
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onClick={async () => {
                        await download('hello' + '_dictionary_' + '.csv', 'wowowowo,here,is,a,hello');
                      }}
                    >
                      Download CSV
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu>
              </Button>
            </>
          )}
        </Card.Footer>
      </Card>
    </>
  );
};

export default DatasetTable;
