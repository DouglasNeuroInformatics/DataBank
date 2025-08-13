import type { $ProjectDataset } from '@databank/core';
import { Button, Card, Heading } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { useNavigate, useParams } from '@tanstack/react-router';
import axios from 'axios';
import { useStore } from 'zustand';

import { LoadingFallback } from '@/components';

import { useProjectDatasetConfigStoreFactory } from '../store/useProjectDatasetConfigStoreFactory';
import { ConfigProjectDatasetColumnsPage } from './ConfigProjectDatasetColumnsPage';
import { ConfigProjectDatasetRowPage } from './ConfigProjectDatasetRowPage';
import { SelectProjectDatasetColumnsPage } from './SelectProjectDatasetColumnsPage';

const AddProjectDatasetColumnPage = () => {
  const params = useParams({ strict: false });
  const projectDatasetStore = useProjectDatasetConfigStoreFactory(params.projectId!, params.datasetId!);
  const {
    columnsConfig,
    currentColumnIdIndex,
    currentStep,
    pageSize,
    reset,
    rowConfig,
    selectedColumns,
    setColumnsConfig,
    setCurrentColumnIdIndex,
    setPageSize,
    setRowConfig,
    setSelectedColumns,
    setStep
  } = useStore(projectDatasetStore);

  const navigate = useNavigate();
  const notifications = useNotificationsStore();
  const { t } = useTranslation('common');

  type CurrentStep = 'configColumns' | 'configRows' | 'selectColumns';

  const handlePreviousStep = (currentStep: CurrentStep) => {
    switch (currentStep) {
      case 'configColumns':
        setStep('configRows');
        break;
      case 'configRows':
        setStep('selectColumns');
        break;
      case 'selectColumns':
        console.error('Unable to go to the previous step');
    }
  };

  const handlePreviousConfigColumnsPage = (currentColumnIdIndex: number) => {
    if (currentStep !== 'configColumns') {
      return;
    }
    setCurrentColumnIdIndex(currentColumnIdIndex - pageSize > 0 ? currentColumnIdIndex - pageSize : 0);
  };

  const handleNextConfigColumnsPage = (currentColumnIdIndex: number) => {
    if (currentStep !== 'configColumns') {
      return;
    }
    setCurrentColumnIdIndex(
      currentColumnIdIndex + pageSize < Object.keys(selectedColumns).length
        ? currentColumnIdIndex + pageSize
        : Object.keys(selectedColumns).length
    );
  };

  const getCurrentStep = (currentStep: CurrentStep): string => {
    const prefix = 'Current Configuration Step: ';
    switch (currentStep) {
      case 'configColumns':
        return prefix + 'Set Column Transformations';
      case 'configRows':
        return prefix + 'Set Row Configurations';
      case 'selectColumns':
        return prefix + 'Select Project Dataset Columns';
    }
  };

  const handleSubmitConfig = () => {
    // format the request body here and send to the backend
    const projectDatasetConfig: $ProjectDataset = {
      columnConfigs: columnsConfig,
      columnIds: Object.keys(selectedColumns),
      datasetId: params.datasetId!,
      rowConfig: rowConfig
    };

    axios
      .post(`/v1/projects/add-dataset/${params.projectId}`, { projectDatasetDto: projectDatasetConfig })
      .then(() => {
        notifications.addNotification({
          message: `Added dataset ${params.datasetId} to project ${params.projectId}`,
          type: 'success'
        });
        void navigate({ to: `/portal/projects/${params.projectId}` });
      })
      .catch((error) => {
        notifications.addNotification({
          message: `Failed to add dataset to project: ${error}`,
          type: 'error'
        });
      });
  };

  const selectedColumnsIdArray = Object.keys(selectedColumns);

  return (
    <Card className="my-3 flex flex-col items-center">
      <Card.Header>
        <Heading variant="h1">Project Dataset Configuration</Heading>
      </Card.Header>

      <Card.Description>
        <Heading variant="h3">{getCurrentStep(currentStep)}</Heading>
      </Card.Description>

      <Card.Content className="w-full">
        {(() => {
          switch (currentStep) {
            case 'configColumns': {
              // prepare the selected columns object for the config columns page
              // the object should be based on the "current column index" and the "page size"
              const selectedColumnsForPage: { [key: string]: any } = {};
              selectedColumnsIdArray
                .slice(currentColumnIdIndex, currentColumnIdIndex + pageSize)
                .forEach((currColId) => {
                  selectedColumnsForPage[currColId] = selectedColumns[currColId];
                });

              return (
                <>
                  <ConfigProjectDatasetColumnsPage
                    pageSize={pageSize}
                    projectId={params.projectId!}
                    selectedColumns={selectedColumnsForPage}
                    setColumnsConfig={setColumnsConfig}
                    setPageSize={setPageSize}
                  />
                  <Button
                    disabled={currentColumnIdIndex === 0}
                    variant={'secondary'}
                    onClick={() => handlePreviousConfigColumnsPage(currentColumnIdIndex)}
                  >
                    {t('paginationPrevious')}
                  </Button>
                  <Button
                    disabled={currentColumnIdIndex === Math.floor(selectedColumnsIdArray.length / (pageSize + 1))}
                    variant={'secondary'}
                    onClick={() => handleNextConfigColumnsPage(currentColumnIdIndex)}
                  >
                    {t('paginationNext')}
                  </Button>
                </>
              );
            }
            case 'configRows':
              return <ConfigProjectDatasetRowPage setRowConfig={setRowConfig} setStep={setStep} />;
            case 'selectColumns':
              return (
                <SelectProjectDatasetColumnsPage
                  datasetId={params.datasetId!}
                  projectId={params.projectId!}
                  reset={reset}
                  setSelectedColumns={setSelectedColumns}
                  setStep={setStep}
                />
              );
            default:
              return <LoadingFallback />;
          }
        })()}
      </Card.Content>

      <Card.Footer className="flex w-full justify-between">
        <div className="flex w-full flex-col">
          <div className="flex w-full justify-between p-1">
            <Button
              disabled={currentStep === 'selectColumns'}
              variant={'secondary'}
              onClick={() => handlePreviousStep(currentStep)}
            >
              Previous Config Step
            </Button>
          </div>

          <div className="flex w-full justify-between p-1">
            <Button variant={'primary'} onClick={() => handleSubmitConfig()}>
              Finish All Configs
            </Button>
            <Button variant={'danger'} onClick={reset}>
              Restart
            </Button>
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default AddProjectDatasetColumnPage;
