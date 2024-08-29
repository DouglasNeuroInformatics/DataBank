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
        .post<TabularDataset>(`/v1/datasets/public/${params.id}`, {
          columnPaginationDto,
          rowPaginationDto
        })
        .then((response) => {
          setDataset(response.data);
        })
        .catch(console.error);
    };
    void fetchDataset();
  }, [params.id, rowPaginationDto, columnPaginationDto]);

  const handleDataDownload = (format: 'CSV' | 'TSV', data: TabularDataset) => {
    const delimiter = format === 'CSV' ? ',' : '\t';
    const filename = data.name + '_' + new Date().toISOString() + '.' + format.toLowerCase();
    let resultString = data.columns.join(delimiter) + '\n';
    for (let row of data.rows) {
      resultString += Object.values(row).join(delimiter) + '\n';
    }

    // axios request to get the data string for the entire dataset
    // once the request is resolved, send it to the download function
    void download(filename, resultString);
  };

  const handleMetaDataDownload = (format: 'CSV' | 'TSV', data: TabularDataset) => {
    const delimiter = format === 'CSV' ? ',' : '\t';
    const filename = 'metadata_' + data.name + '_' + new Date().toISOString() + '.' + format.toLowerCase();

    // axios request to get the meta data string for the entire dataset
    // once the request is resolved, send it to the download function

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

    let metadataRowsString = metaDataHeader.join(delimiter) + '\n';
    for (let columnName of Object.keys(data.metadata)) {
      metadataRowsString +=
        columnName +
        delimiter +
        data.metadata[columnName]?.kind +
        delimiter +
        data.metadata[columnName]?.nullable +
        delimiter +
        data.metadata[columnName]?.count +
        delimiter +
        data.metadata[columnName]?.nullCount +
        delimiter +
        data.metadata[columnName]?.max +
        delimiter +
        data.metadata[columnName]?.min +
        delimiter +
        data.metadata[columnName]?.mean +
        delimiter +
        data.metadata[columnName]?.median +
        delimiter +
        data.metadata[columnName]?.mode +
        delimiter +
        data.metadata[columnName]?.std +
        delimiter +
        JSON.stringify(data.metadata[columnName]?.distribution) +
        delimiter +
        '\n';
    }
    void download(filename, metadataRowsString);
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
            currentPage={columnPaginationDto.currentPage}
            itemsPerPage={columnPaginationDto.itemsPerPage}
            kind={'COLUMN'}
            setDatasetPagination={setColumnPaginationDto}
            totalNumberOfItems={dataset.totalNumberOfColumns}
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
            currentPage={rowPaginationDto.currentPage}
            itemsPerPage={rowPaginationDto.itemsPerPage}
            kind={'ROW'}
            setDatasetPagination={setRowPaginationDto}
            totalNumberOfItems={dataset.totalNumberOfRows}
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
  path: 'dataset/:id',
  element: <ViewOnePublicDatasetPage />
};
