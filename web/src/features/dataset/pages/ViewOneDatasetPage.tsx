/* eslint-disable perfectionist/sort-objects */
import { useState } from 'react';

import type { DatasetViewPagination, TabularDataset } from '@databank/core';
import { capitalize } from '@douglasneuroinformatics/libjs';
import { Button, Card, DropdownMenu } from '@douglasneuroinformatics/libui/components';
import { useDownload, useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from '@tanstack/react-router';
import axios from 'axios';

import { LoadingFallback } from '@/components';
import { PageHeading } from '@/components/PageHeading';
import { useAuthStore } from '@/stores/auth-store';

import { DatasetPagination } from '../components/DatasetPagination';
import { DatasetTable } from '../components/DatasetTable';
import { useDeleteDataset } from '../hooks/useDeleteDataset';

type ViewOneDatasetPageProps = {
  isPublic: boolean;
};

const ViewOneDatasetPage = ({ isPublic }: ViewOneDatasetPageProps) => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const notifications = useNotificationsStore();
  const params = useParams({ strict: false });
  const download = useDownload();
  const deleteDataset = useDeleteDataset();
  const { currentUser } = useAuthStore();
  const dataQueryUrl = isPublic ? `/v1/datasets/public/${params.datasetId}` : `/v1/datasets/${params.datasetId}`;
  const downloadDataUrl = isPublic ? `/v1/datasets/public/download-data/` : `/v1/datasets/download-data/`;
  const downloadMetaDataUrl = isPublic ? `/v1/datasets/public/download-metadata/` : `/v1/datasets/download-metadata/`;

  const [columnPaginationDto, setColumnPaginationDto] = useState<DatasetViewPagination>({
    currentPage: 1,
    itemsPerPage: 10
  });

  const [rowPaginationDto, setRowPaginationDto] = useState<DatasetViewPagination>({
    currentPage: 1,
    itemsPerPage: 10
  });

  const datasetQuery = useQuery({
    queryFn: async () => {
      const response = await axios.post<TabularDataset>(dataQueryUrl, {
        columnPaginationDto,
        rowPaginationDto
      });
      return response.data;
    },
    queryKey: ['dataset-query', params.datasetId, columnPaginationDto, rowPaginationDto]
  });

  const dataset = datasetQuery.data;
  const isManager = currentUser ? Boolean(dataset?.managerIds.includes(currentUser.id)) : false;

  const handleDataDownload = (format: 'CSV' | 'TSV', data: TabularDataset) => {
    const filename = data.name + '_' + new Date().toISOString() + '.' + format.toLowerCase();
    axios
      .get<string>(downloadDataUrl + `${data.id}/${format}`)
      .then((response) => {
        void download(filename, response.data);
      })
      .catch(console.error);
  };

  const handleMetaDataDownload = (format: 'CSV' | 'TSV', data: TabularDataset) => {
    const filename = 'metadata_' + data.name + '_' + new Date().toISOString() + '.' + format.toLowerCase();
    axios
      .get<string>(downloadMetaDataUrl + `${data.id}/${format}`)
      .then((response) => {
        void download(filename, response.data);
      })
      .catch(console.error);
  };

  const handleSetReadyToShare = (datasetId: string) => {
    axios
      .patch(`/v1/datasets/share/${datasetId}`)
      .then(() => {
        notifications.addNotification({
          type: 'success',
          message: `Dataset with Id ${datasetId} is now ready to share!`
        });
        void navigate({ to: '/portal/datasets' });
      })
      .catch(console.error);
  };

  if (!dataset) {
    return <LoadingFallback />;
  }

  const datasetName = capitalize(dataset.name);

  return (
    <>
      <PageHeading>{datasetName}</PageHeading>
      <Card>
        <Card.Header>
          <Card.Title>{`${t('datasetName')}: ${datasetName}`}</Card.Title>
          <Card.Description>{`${t('datasetDescription')}: ${dataset.description}`}</Card.Description>
          <Card.Description>{`${t('createdAt')} : ${dataset.createdAt.toString()}`}</Card.Description>
          <Card.Description>{`${t('updatedAt')} : ${dataset.updatedAt.toString()}`}</Card.Description>
          {isManager && (
            <div className="flex justify-between">
              <Button
                className="m-2"
                variant={'secondary'}
                onClick={() =>
                  void navigate({
                    to: `/portal/datasets/manage-managers`,
                    search: {
                      datasetId: dataset.id,
                      managerIds: dataset.managerIds,
                      isManager
                    }
                  })
                }
              >
                {t('manageDatasetManagers')}
              </Button>

              <Button className="m-2" variant={'danger'} onClick={() => deleteDataset(dataset.id)}>
                {t('deleteDataset')}
              </Button>
            </div>
          )}
        </Card.Header>
        {dataset.datasetType === 'TABULAR' && (
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
              isManager={isManager}
              isReadyToShare={dataset.isReadyToShare}
              license={dataset.license}
              managerIds={dataset.managerIds}
              metadata={dataset.metadata}
              name={dataset.name}
              permission={dataset.permission}
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
        )}

        <Card.Footer>
          {isManager && (
            <>
              <Button
                className="m-2"
                variant={'primary'}
                onClick={() => void navigate({ to: `/portal/datasets/edit-info/${dataset.id}` })}
              >
                {t('editDatasetInfo')}
              </Button>

              {!dataset.isReadyToShare && (
                <Button className="m-2" variant={'primary'} onClick={() => handleSetReadyToShare(dataset.id)}>
                  {t('setDatasetSharable')}
                </Button>
              )}
            </>
          )}
          {dataset.datasetType === 'TABULAR' && (
            <>
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
            </>
          )}
        </Card.Footer>
      </Card>
    </>
  );
};

export { ViewOneDatasetPage };
