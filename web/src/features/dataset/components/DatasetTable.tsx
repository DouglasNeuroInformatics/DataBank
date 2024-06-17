import React from 'react';

import type { DatasetInfo } from '@databank/types';
import { Button } from '@douglasneuroinformatics/libui/components';
import { Card } from '@douglasneuroinformatics/libui/components';
import { DropdownMenu } from '@douglasneuroinformatics/libui/components';
import { HoverCard } from '@douglasneuroinformatics/libui/components';
import { Table } from '@douglasneuroinformatics/libui/components';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

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
  // useEffect to fetch the dataset from the server

  return (
    <>
      <Card>
        <Card.Header>
          <Card.Title>{tabularDataset.name}</Card.Title>
          <Card.Description>{tabularDataset.description}</Card.Description>
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
                                    alert(
                                      `Send a request to the server to change the data permission level for column ${column} with columnId ${tabularDataset.columnIds[column]}`
                                    );
                                  }}
                                >
                                  Set Data Permission Level
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                  onClick={() => {
                                    alert(
                                      `Send a request to the server to change the metadata permission level for column ${column} with columnId ${tabularDataset.columnIds[column]}`
                                    );
                                  }}
                                >
                                  Set Matadata Permission Level
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                  onClick={() => {
                                    alert(
                                      `Send a request to the server to set nullable for column ${column} with columnId ${tabularDataset.columnIds[column]}`
                                    );
                                  }}
                                >
                                  Set Nullable
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                  onClick={() => {
                                    alert(
                                      `Send a request to the server to change the data type for column ${column} with columnId ${tabularDataset.columnIds[column]}`
                                    );
                                  }}
                                >
                                  Change Type
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                  onClick={() => {
                                    alert(
                                      `Send a request to the server to delete the column ${column} with columnId ${tabularDataset.columnIds[column]}`
                                    );
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
                                      <h4 className="text-sm font-semibold">{`Type: ${tabularDataset.metadata[column].type}`}</h4>
                                      <h4 className="text-sm font-semibold">{`Nullable: ${tabularDataset.metadata[column].nullable}`}</h4>
                                      <h4 className="text-sm font-semibold">{`Count: ${tabularDataset.metadata[column].summary.count}`}</h4>
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
                  alert(`Entering Edit dataset info page`);
                }}
              >
                Edit Dataset Information
              </Button>
              <Button
                className="m-2"
                variant={'primary'}
                onClick={() => {
                  alert(`Setting dataset to sharable`);
                }}
              >
                Set Dataset Sharable
              </Button>
            </>
          )}
          <Button
            className="m-2"
            variant={'secondary'}
            onClick={() => {
              alert(`Downloading Dataset ...`);
            }}
          >
            Download Dataset
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
};

export default DatasetTable;
