/* eslint-disable perfectionist/sort-objects */
import React, { useEffect, useState } from 'react';

import type { DatasetViewPaginationDto, TabularDataset } from '@databank/types';
import { Button, Card, DropdownMenu } from '@douglasneuroinformatics/libui/components';
import { useDownload } from '@douglasneuroinformatics/libui/hooks';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { type RouteObject, useParams } from 'react-router-dom';

import { LoadingFallback } from '@/components';

import { DatasetPagination } from '../components/DatasetPagination';
import DatasetTable from '../components/DatasetTable';

const ViewOnePublicDatasetPage = () => {
  const params = useParams();
  const [dataset, setDataset] = useState<TabularDataset | null>(null);
  const download = useDownload();

  const [columnPaginationDto, setColumnPaginationDto] = useState<DatasetViewPaginationDto>({
    currentPage: 1,
    itemsPerPage: 10
  });

  const [rowPaginationDto, setRowPaginationDto] = useState<DatasetViewPaginationDto>({
    currentPage: 1,
    itemsPerPage: 10
  });

  useEffect(() => {
    const fetchDataset = () => {
      axios
        .get<TabularDataset>(`/v1/datasets/${params.id}`)
        .then((response) => {
          setDataset(response.data);
        })
        .catch(console.error);
    };
    void fetchDataset();
  }, [params.id, rowPaginationDto, columnPaginationDto]);

  const handleDataDownload = (format: 'CSV' | 'TSV', data: TabularDataset) => {
    const delimiter = format === 'CSV' ? ',' : '\t';
    const filename = data.name + '_' + new Date().toISOString() + format === 'CSV' ? '.csv' : '.tsv';

    let resultString = ''.concat(
      data.columns.join(delimiter),
      '\n',
      data.rows
        .map((row) => {
          Object.values(row).join(delimiter);
        })
        .join('\n')
    );

    void download(filename, resultString);
  };

  const handleMetaDataDownload = (format: 'CSV' | 'TSV', data: TabularDataset) => {
    const delimiter = format === 'CSV' ? ',' : '\t';
    const filename = 'metadata_' + data.name + '_' + new Date().toISOString() + format === 'CSV' ? '.csv' : '.tsv';

    const metaDataHeader = [
      'column_name',
      'column_type',
      'nullable',
      'count',
      'nullCount',
      'max',
      'min',
      'mean',
      'median',
      'mode',
      'std',
      'distribution'
    ];

    const metadataRowsString = data.columns
      .map((columnName) => {
        [
          columnName,
          data.metadata[columnName]?.kind,
          data.metadata[columnName]?.nullable,
          data.metadata[columnName]?.count,
          data.metadata[columnName]?.nullCount,
          data.metadata[columnName]?.max,
          data.metadata[columnName]?.min,
          data.metadata[columnName]?.mean,
          data.metadata[columnName]?.median,
          data.metadata[columnName]?.mode,
          data.metadata[columnName]?.std,
          data.metadata[columnName]?.distribution
        ].join(delimiter);
      })
      .join('\n');

    let resultString = ''.concat(metaDataHeader.join(delimiter), '\n', metadataRowsString);

    void download(filename, resultString);
  };

  return dataset ? (
    <>
      <Card>
        <Card.Header>
          <Card.Title>{dataset.name}</Card.Title>
          <Card.Description>{dataset.description}</Card.Description>
        </Card.Header>
        <Card.Content>
          <DatasetPagination
            currentPage={0}
            itemsPerPage={0}
            kind={'COLUMN'}
            setDatasetPagination={setColumnPaginationDto}
            totalNumberOfItems={0}
          />

          <DatasetTable
            columnIds={dataset.columnIds}
            columns={dataset.columns}
            createdAt={dataset.createdAt}
            datasetType={dataset.datasetType}
            description={dataset.description}
            id={dataset.id}
            isManager={false}
            isReadyToShare={dataset.isReadyToShare}
            license={dataset.license}
            managerIds={dataset.managerIds}
            metadata={dataset.metadata}
            name={dataset.name}
            permission={dataset.permission}
            primaryKeys={dataset.primaryKeys}
            rows={dataset.rows}
            totalNumberOfColumns={0}
            totalNumberOfRows={0}
            updatedAt={dataset.updatedAt}
          />

          <DatasetPagination
            currentPage={0}
            itemsPerPage={0}
            kind={'ROW'}
            setDatasetPagination={setRowPaginationDto}
            totalNumberOfItems={0}
          />
        </Card.Content>
        <Card.Footer>
          <Button className="m-2" variant={'secondary'}>
            <DropdownMenu>
              <DropdownMenu.Trigger className="flex items-center justify-between gap-3">
                Download Dataset
                <ChevronDownIcon className="size-[1rem]" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="w-48">
                <DropdownMenu.Item onClick={() => handleDataDownload('TSV', dataset)}>Download TSV</DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => handleDataDownload('CSV', dataset)}>Download CSV</DropdownMenu.Item>
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
                <DropdownMenu.Item onClick={() => handleMetaDataDownload('TSV', dataset)}>
                  Download TSV
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => handleMetaDataDownload('CSV', dataset)}>
                  Download CSV
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </Button>
        </Card.Footer>
      </Card>
    </>
  ) : (
    <LoadingFallback />
  );
};

export const viewOnePublicDatasetRoute: RouteObject = {
  path: 'dataset/:datasetId',
  element: <ViewOnePublicDatasetPage />
};
