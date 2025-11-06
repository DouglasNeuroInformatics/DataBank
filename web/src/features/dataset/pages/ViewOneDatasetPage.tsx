/* eslint-disable perfectionist/sort-objects */
import { $DatasetViewPagination, $TabularDataset, licensesObjects } from '@databank/core';
import { capitalize } from '@douglasneuroinformatics/libjs';
import { Button, Card, DropdownMenu, Heading, HoverCard } from '@douglasneuroinformatics/libui/components';
import {
  useDestructiveAction,
  useDownload,
  useNotificationsStore,
  useTranslation
} from '@douglasneuroinformatics/libui/hooks';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useNavigate, useParams } from '@tanstack/react-router';
import axios from 'axios';

import { PageHeading } from '@/components/PageHeading';
import { useAuthStore } from '@/stores/auth-store';

import { DatasetPagination } from '../components/DatasetPagination';
import { DatasetTable } from '../components/DatasetTable';
import { useDeleteDataset } from '../hooks/useDeleteDataset';

type ViewOneDatasetPageProps = {
  columnPagination: $DatasetViewPagination;
  dataset: $TabularDataset;
  downloadDataUrl: string;
  downloadMetaDataUrl: string;
  queryKey: string;
  rowPagination: $DatasetViewPagination;
};

const ViewOneDatasetPage = ({
  dataset,
  downloadDataUrl,
  downloadMetaDataUrl,
  columnPagination,
  rowPagination,
  queryKey
}: ViewOneDatasetPageProps) => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const params = useParams({ strict: false });
  const download = useDownload();
  const deleteDataset = useDeleteDataset();
  const { currentUser } = useAuthStore();

  const isManager = currentUser ? Boolean(dataset?.managerIds.includes(currentUser.id)) : false;

  const setColumnPagination = (newPagination: $DatasetViewPagination) => {
    void navigate({
      to: '.',
      search: (prev) => ({ ...prev, columnPagination: newPagination })
    });
  };

  const setRowPagination = (newPagination: $DatasetViewPagination) => {
    void navigate({
      to: '.',
      search: (prev) => ({ ...prev, rowPagination: newPagination })
    });
  };

  const handleDataDownload = (format: 'CSV' | 'TSV', data: $TabularDataset) => {
    const filename = data.name + '_' + new Date().toISOString() + '.' + format.toLowerCase();
    axios
      .get<string>(downloadDataUrl + `${data.id}/${format}`)
      .then((response) => {
        void download(filename, response.data);
      })
      .catch((error) => {
        console.error(error);
        addNotification({
          message: t('downloadDatasetDataFailure'),
          type: 'error'
        });
      });
  };

  const handleMetaDataDownload = (format: 'CSV' | 'TSV', data: $TabularDataset) => {
    const filename = 'metadata_' + data.name + '_' + new Date().toISOString() + '.' + format.toLowerCase();
    axios
      .get<string>(downloadMetaDataUrl + `${data.id}/${format}`)
      .then((response) => {
        void download(filename, response.data);
      })
      .catch((error) => {
        console.error(error);
        addNotification({
          message: t('downloadDatasetMetadataFailure'),
          type: 'error'
        });
      });
  };

  const handleSetReadyToShare = useDestructiveAction((datasetId: string) => {
    axios
      .patch(`/v1/datasets/share/${datasetId}`)
      .then(() => {
        addNotification({
          type: 'success',
          message: `Dataset with Id ${datasetId} is now ready to share!`
        });
        void navigate({ to: '/portal/datasets' });
      })
      .catch((error) => {
        console.error(error);
        addNotification({
          message: t('setDatasetSharableFailure'),
          type: 'error'
        });
      });
  });

  // if (!dataset) {
  //   return <LoadingFallback />;
  // }

  const datasetName = capitalize(dataset.name);

  return (
    <>
      <PageHeading>{datasetName}</PageHeading>
      <Card>
        <Card.Header>
          <Card.Title>{`${t('datasetName')}: ${datasetName}`}</Card.Title>
          <Card.Description>{`${t('datasetDescription')}: ${dataset.description}`}</Card.Description>
          <Card.Description>{`${t('currentDatasetPermission')}: ${dataset.permission}`}</Card.Description>
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

              <div
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  dataset.isReadyToShare
                    ? 'border border-green-200 bg-green-100 text-green-800'
                    : 'border border-orange-200 bg-orange-100 text-orange-800'
                }`}
              >
                {dataset.isReadyToShare ? t('datasetReadyToShare') : t('datasetNotReadyToShare')}
              </div>

              <Button className="m-2" variant={'danger'} onClick={() => deleteDataset(params.datasetId!)}>
                {t('deleteDataset')}
              </Button>
            </div>
          )}
        </Card.Header>
        {dataset.datasetType === 'TABULAR' && (
          <>
            <Card.Content>
              {`${t('datasetLicense')}: `}
              <HoverCard>
                <HoverCard.Trigger asChild>
                  <Button variant="link">{`${dataset.license}`}</Button>
                </HoverCard.Trigger>
                <HoverCard.Content className="max-w-160 w-80">
                  <div className="my-2">
                    <Heading variant="h5">{`${t('datasetLicenseName')}: `}</Heading>
                    {`${licensesObjects[dataset.license]!.name}`}
                  </div>

                  <div className="my-2">
                    <Heading variant="h5">{`${t('datasetLicenseReference')}: `}</Heading>
                    {`${licensesObjects[dataset.license]!.reference}`}
                  </div>
                </HoverCard.Content>
              </HoverCard>
            </Card.Content>

            <Card.Content>
              <ul>
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
                currentPage={columnPagination.currentPage}
                itemsPerPage={columnPagination.itemsPerPage}
                kind={'COLUMN'}
                setDatasetPagination={setColumnPagination}
                totalNumberOfItems={dataset.totalNumberOfColumns}
              />

              <DatasetTable isManager={isManager} isProject={false} queryKey={queryKey} {...dataset} />

              <DatasetPagination
                currentPage={rowPagination.currentPage}
                itemsPerPage={rowPagination.itemsPerPage}
                kind={'ROW'}
                setDatasetPagination={setRowPagination}
                totalNumberOfItems={dataset.totalNumberOfRows}
              />
            </Card.Content>
          </>
        )}

        <Card.Footer>
          {isManager && (
            <>
              <Button
                className="m-2"
                variant={'primary'}
                onClick={() =>
                  void navigate({
                    to: `/portal/datasets/edit-info/${dataset.id}`,
                    search: {
                      name: dataset.name,
                      description: dataset.description ?? undefined,
                      license: dataset.license,
                      permission: dataset.permission
                    }
                  })
                }
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
