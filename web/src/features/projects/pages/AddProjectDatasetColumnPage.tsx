import type { $ProjectDataset } from '@databank/core';
import { Button, Card, Heading } from '@douglasneuroinformatics/libui/components';
import { useNavigate, useParams } from '@tanstack/react-router';
import axios from 'axios';
import { useStore } from 'zustand';

import { LoadingFallback } from '@/components';

import { useProjectDatasetConfigStoreFactory } from '../store/useProjectDatasetConfigStoreFactory';
import { ConfigProjectDatasetColumnsPage } from './ConfigProjectDatasetColumnsPage';
import { ConfigProjectDatasetRowPage } from './ConfigProjectDatasetRowPage';
import { SelectProjectDatasetColumnsPage } from './SelectProjectDatasetColumnsPage';

const AddProjectDatasetColumnPage = () => {
  // need to get the projectID and datasetID from the route params
  // check projectID_datasetID combination in Zustand store, if not in store,
  // Init to the first step

  // The third page: config columns depends on the first page where we select or unselect columns
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

  const handlePreviousStep = (currentStep: 'configColumns' | 'configRows' | 'selectColumns') => {
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

  const handleNextStep = (currentStep: 'configColumns' | 'configRows' | 'selectColumns') => {
    switch (currentStep) {
      case 'configColumns':
        console.error('Unable to go to the next step');
        break;
      case 'configRows':
        setStep('configColumns');
        break;
      case 'selectColumns':
        setStep('configRows');
        break;
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

  const handleSubmitConfig = () => {
    // format the request body here and send to the backend
    const projectDatasetConfig: $ProjectDataset = {
      columnConfigs: columnsConfig,
      columnIds: Object.keys(selectedColumns),
      datasetId: params.datasetId!,
      rowConfig: rowConfig
    };
    void axios.post(`/v1/projects/add-dataset/${params.projectId}`, projectDatasetConfig);
    void navigate({ to: `/portal/project/${params.projectId}` });
  };

  const selectedColumnsIdArray = Object.keys(selectedColumns);

  return (
    <Card className="my-3 flex flex-col items-center">
      <Card.Header>
        <Heading variant="h1">Project Dataset Configuration</Heading>
      </Card.Header>

      <Card.Description>
        <Heading variant="h3">Current Configuration Step:</Heading>
        <Heading variant="h4">{currentStep}</Heading>
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
                    Previous Page
                  </Button>
                  <Button
                    disabled={currentColumnIdIndex === selectedColumnsIdArray.length}
                    variant={'secondary'}
                    onClick={() => handleNextConfigColumnsPage(currentColumnIdIndex)}
                  >
                    Next Page
                  </Button>
                </>
              );
            }
            case 'configRows':
              return <ConfigProjectDatasetRowPage setRowConfig={setRowConfig} />;
            case 'selectColumns':
              return (
                <SelectProjectDatasetColumnsPage
                  datasetId={params.datasetId!}
                  projectId={params.projectId!}
                  reset={reset}
                  setCurrentStep={setStep}
                  setSelectedColumns={setSelectedColumns}
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
            <Button
              disabled={currentStep === 'configColumns'}
              variant={'secondary'}
              onClick={() => handleNextStep(currentStep)}
            >
              Next Config Step
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
