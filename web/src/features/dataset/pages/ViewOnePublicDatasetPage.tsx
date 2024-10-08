/* eslint-disable perfectionist/sort-objects */
import { useState } from 'react';

import type { DatasetViewPaginationDto, TabularDataset } from '@databank/types';
import { Button, Card, DropdownMenu } from '@douglasneuroinformatics/libui/components';
import { useDownload } from '@douglasneuroinformatics/libui/hooks';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type RouteObject, useParams } from 'react-router-dom';

import { LoadingFallback } from '@/components';

import { DatasetPagination } from '../components/DatasetPagination';
import DatasetTable from '../components/DatasetTable';

const ViewOnePublicDatasetPage = () => {
  const { t } = useTranslation('common');
  const params = useParams<'datasetId'>();
  const download = useDownload();

  const [columnPaginationDto, setColumnPaginationDto] = useState<DatasetViewPaginationDto>({
    currentPage: 1,
    itemsPerPage: 10
  });

  const [rowPaginationDto, setRowPaginationDto] = useState<DatasetViewPaginationDto>({
    currentPage: 1,
    itemsPerPage: 10
  });

  const datasetQuery = useQuery({
    queryFn: async () => {
      const response = await axios.post<TabularDataset>(`/v1/datasets/public/${params.datasetId}`, {
        columnPaginationDto,
        rowPaginationDto
      });
      return response.data;
    },
    queryKey: ['dataset-query', params.datasetId, columnPaginationDto, rowPaginationDto]
  });

  const dataset = datasetQuery.data;

  const handleDataDownload = (format: 'CSV' | 'TSV', data: TabularDataset) => {
    const filename = data.name + '_' + new Date().toISOString() + '.' + format.toLowerCase();
    axios
      .get<string>(`/v1/datasets/public/download-data/${data.id}/${format}`)
      .then((response) => {
        void download(filename, response.data);
      })
      .catch(console.error);
  };

  const handleMetaDataDownload = (format: 'CSV' | 'TSV', data: TabularDataset) => {
    const filename = 'metadata_' + data.name + '_' + new Date().toISOString() + '.' + format.toLowerCase();
    axios
      .get<string>(`/v1/datasets/public/download-metadata/${data.id}/${format}`)
      .then((response) => {
        void download(filename, response.data);
      })
      .catch(console.error);
  };

  return dataset ? (
    <>
      <Card>
        <Card.Header>
          <Card.Title>{`${t('datasetName')}: ${dataset.name}`}</Card.Title>
          <Card.Description>{`${t('datasetDescription')}: ${dataset.description}`}</Card.Description>
          <Card.Description>{`${t('createdAt')} : ${dataset.createdAt.toString()}`}</Card.Description>
          <Card.Description>{`${t('updatedAt')} : ${dataset.updatedAt.toString()}`}</Card.Description>
        </Card.Header>

        {dataset.datasetType === 'TABULAR' && (
          <>
            <Card.Content>
              <ul>
                <li>{`${t('datasetLicense')}: ${dataset.license}`}</li>
                <li>
                  {t('datasetPrimaryKeys')}
                  {': '}
                  {dataset.primaryKeys.map((pk, i) => {
                    return (
                      <span className="m-2" key={i}>
                        {pk}
                      </span>
                    );
                  })}
                </li>
              </ul>

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
                totalNumberOfColumns={dataset.columns.length}
                totalNumberOfRows={dataset.totalNumberOfRows}
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
              <DropdownMenu>
                <DropdownMenu.Trigger asChild className="m-2 flex items-center justify-between gap-3">
                  <Button variant="secondary">
                    {t('downloadDataset')}
                    <ChevronDownIcon className="size-[1rem]" />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="w-48">
                  <DropdownMenu.Item onClick={() => void handleDataDownload('TSV', dataset)}>
                    {t('downloadTsv')}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => void handleDataDownload('CSV', dataset)}>
                    {t('downloadCsv')}
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenu.Trigger asChild className="m-2 flex items-center justify-between gap-3">
                  <Button variant="secondary">
                    {t('downloadMetadata')}
                    <ChevronDownIcon className="size-[1rem]" />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="w-48">
                  <DropdownMenu.Item onClick={() => void handleMetaDataDownload('TSV', dataset)}>
                    {t('downloadTsv')}
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onClick={() => void handleMetaDataDownload('CSV', dataset)}>
                    {t('downloadCsv')}
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            </Card.Footer>
          </>
        )}
      </Card>
    </>
  ) : (
    <LoadingFallback />
  );
};

export const ViewOnePublicDatasetRoute: RouteObject = {
  path: 'dataset/:datasetId',
  element: <ViewOnePublicDatasetPage />
};
