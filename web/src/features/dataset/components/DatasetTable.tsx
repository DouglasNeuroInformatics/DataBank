/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react';

import type { DatasetInfo } from '@databank/types';
import { Button } from '@douglasneuroinformatics/libui/components';
import { Card } from '@douglasneuroinformatics/libui/components';
import { DropdownMenu } from '@douglasneuroinformatics/libui/components';
import { HoverCard } from '@douglasneuroinformatics/libui/components';
import { Table } from '@douglasneuroinformatics/libui/components';
import { useDownload } from '@douglasneuroinformatics/libui/hooks';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

// need a type for all columns metadata: an object with column names as keys and
// the value with types of a union of all summaries

export type TabularDataset = {
  columnIds: { [key: string]: string };
  columns: string[];
  metadata: {
    [key: string]: {
      nullable: boolean;
      summary: {
        count: number;
      };
      type: string;
    };
  };
  primaryKeys: string[];
  rows: { [key: string]: string }[];
} & DatasetInfo;

export type DatasetTableProps = { isManager: boolean } & TabularDataset;

const DatasetTable = (tabularDataset: DatasetTableProps) => {
  const download = useDownload();
  // useEffect to fetch the dataset from the server

  const removeManager = () => {
    return 555666;
  };

  const addManager = () => {
    return 555666;
  };

  const deleteDataset = () => {
    return 555666;
  };

  return (
    <>
      <Card>
        <Card.Header>
          <Card.Title>{tabularDataset.name}</Card.Title>
          <Card.Description>{tabularDataset.description}</Card.Description>
          {tabularDataset.isManager && (
            <>
              <Button className="m-2" variant={'secondary'} onClick={addManager}>
                Add Manager
              </Button>

              <Button className="m-2" variant={'secondary'} onClick={removeManager}>
                Remove Manager
              </Button>

              <Button className="m-2" variant={'danger'} onClick={deleteDataset}>
                Delete Dataset
              </Button>
            </>
          )}
        </Card.Header>
        <Card.Content>
          <ul>
            <li>Created at: {tabularDataset.createdAt.toDateString()}</li>
            <li>Updated at: {tabularDataset.updatedAt.toDateString()}</li>
            <li>Licence: {tabularDataset.license}</li>
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
                                      <h4 className="text-sm font-semibold">{`Type: ${tabularDataset.metadata[column]?.type}`}</h4>
                                      <h4 className="text-sm font-semibold">{`Nullable: ${tabularDataset.metadata[column]?.nullable}`}</h4>
                                      <h4 className="text-sm font-semibold">{`Count: ${tabularDataset.metadata[column]?.summary.count}`}</h4>
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
                      <Table.Cell key={j}>{currRow[currCol]}</Table.Cell>
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
