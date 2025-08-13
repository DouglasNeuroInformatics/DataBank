/* eslint-disable perfectionist/sort-objects */
import { useEffect, useState } from 'react';

import type { DatasetViewPagination, TabularDataset } from '@databank/core';
import { Button, Card, DropdownMenu } from '@douglasneuroinformatics/libui/components';
import {
  useDestructiveAction,
  useDownload,
  useNotificationsStore,
  useTranslation
} from '@douglasneuroinformatics/libui/hooks';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useNavigate, useParams } from '@tanstack/react-router';
import axios from 'axios';

import { LoadingFallback } from '@/components';
import { useAuthStore } from '@/stores/auth-store';

import { DatasetPagination } from '../../dataset/components/DatasetPagination';
import { DatasetTable } from '../../dataset/components/DatasetTable';

const ViewOneProjectDatasetPage = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const notifications = useNotificationsStore();
  const params = useParams({ strict: false });
  const [dataset, setDataset] = useState<null | TabularDataset>(null);
  const download = useDownload();
  const { currentUser } = useAuthStore();

  const [columnPaginationDto, setColumnPaginationDto] = useState<DatasetViewPagination>({
    currentPage: 1,
    itemsPerPage: 10
  });

  const [rowPaginationDto, setRowPaginationDto] = useState<DatasetViewPagination>({
    currentPage: 1,
    itemsPerPage: 10
  });

  useEffect(() => {
    const fetchDataset = () => {
      axios
        .post<TabularDataset>(`/v1/projects/dataset/${params.projectId}/${params.datasetId}`, {
          columnPaginationDto,
          rowPaginationDto
        })
        .then((response) => {
          setDataset(response.data);
        })
        .catch(console.error);
    };
    void fetchDataset();
  }, [columnPaginationDto, rowPaginationDto]);

  const isManager = Boolean(dataset?.managerIds.includes(currentUser!.id));

  const deleteDataset = useDestructiveAction(() => {
    axios
      .delete(`/v1/projects/remove-dataset/${params.projectId}/${params.datasetId}`)
      .then(() => {
        notifications.addNotification({
          type: 'success',
          message: `Dataset with Id ${params.datasetId} has been deleted`
        });
        void navigate({ to: `/portal/projects/${params.projectId}` });
      })
      .catch(console.error);
  });

  const handleDataDownload = async (format: 'CSV' | 'TSV', data: TabularDataset) => {
    const filename = data.name + '_' + new Date().toISOString() + '.' + format.toLowerCase();
    const response = await axios.get(`/v1/projects/download-data/${params.projectId}/${params.datasetId}/${format}`);
    void download(filename, response.data as string);
  };

  const handleMetaDataDownload = async (format: 'CSV' | 'TSV', data: TabularDataset) => {
    const filename = 'metadata_' + data.name + '_' + new Date().toISOString() + '.' + format.toLowerCase();
    const response = await axios.get(
      `/v1/projects/download-metadata/${params.projectId}/${params.datasetId}/${format}`
    );
    void download(filename, response.data as string);
  };

  return dataset ? (
    <>
      <Card>
        <Card.Header>
          <Card.Title>{`${t('datasetName')}: ${dataset.name}`}</Card.Title>
          <Card.Description>{`${t('datasetDescription')}: ${dataset.description}`}</Card.Description>
          {isManager && (
            <div className="flex justify-between">
              <Button className="m-2" variant={'danger'} onClick={() => deleteDataset()}>
                {t('deleteDataset')}
              </Button>
            </div>
          )}
        </Card.Header>
        <Card.Content>
          <ul>
            <li>
              {t('createdAt')}
              {`: ${dataset.createdAt.toString()}`}
            </li>
            <li>
              {t('updatedAt')}
              {`: ${dataset.updatedAt.toString()}`}
            </li>
            <li>{`${t('datasetLicense')}: ${dataset.license}`}</li>
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
            primaryKeys={dataset.primaryKeys}
            rows={dataset.rows}
            status={dataset.status}
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
          <>
            <Button className="m-2" variant={'secondary'}>
              <DropdownMenu>
                <DropdownMenu.Trigger className="flex items-center justify-between gap-3">
                  {t('downloadDataset')}
                  <ChevronDownIcon className="size-[1rem]" />
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
            </Button>

            <Button className="m-2" variant={'secondary'}>
              <DropdownMenu>
                <DropdownMenu.Trigger className="flex items-center justify-between gap-3">
                  {t('downloadMetadata')}
                  <ChevronDownIcon className="size-[1rem]" />
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
            </Button>
          </>
        </Card.Footer>
      </Card>
    </>
  ) : (
    <LoadingFallback />
  );
};

export { ViewOneProjectDatasetPage };
