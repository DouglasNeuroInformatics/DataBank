import { useState } from 'react';

import { useNotificationsStore } from '@douglasneuroinformatics/ui';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { P, match } from 'ts-pattern';

import { Heading } from '@/components/Heading';

import { ConfirmDatasetStructure, type CreateDatasetData } from '../components/ConfirmDatasetStructure';
import { CreateDatasetStep } from '../components/CreateDatasetStep';
import { DatasetDropzone, type DropzoneResult } from '../components/DatasetDropzone';
import { DatasetForm, type DatasetFormData } from '../components/DatasetForm';

export const CreateDatasetPage = () => {
  const notifications = useNotificationsStore();
  const { t } = useTranslation();
  const [state, setState] = useState<{
    formData?: DatasetFormData;
    status: 'CONFIRM' | 'FORM' | 'UPLOAD';
    uploadData?: DropzoneResult;
  }>({
    status: 'UPLOAD'
  });

  const handleSubmit = async (dataset: CreateDatasetData) => {
    await axios.post('/v1/datasets', dataset);
    notifications.addNotification({ type: 'success' });
  };

  return (
    <div className="flex min-h-full flex-grow flex-col">
      <Heading title={t('createDataset')} />
      <AnimatePresence initial={false} mode="wait">
        {match(state)
          .with({ status: 'UPLOAD' }, () => (
            <CreateDatasetStep key="upload" step="upload">
              <DatasetDropzone
                onSubmit={(uploadData) => {
                  setState((prevState) => ({ ...prevState, status: 'FORM', uploadData }));
                }}
              />
            </CreateDatasetStep>
          ))
          .with({ status: 'FORM', uploadData: P.not(P.nullish) }, ({ uploadData }) => (
            <CreateDatasetStep key="form" step="form">
              <DatasetForm
                inferredColumns={uploadData.columns}
                onSubmit={(formData) => {
                  setState((prevState) => ({ ...prevState, formData, status: 'CONFIRM' }));
                }}
              />
            </CreateDatasetStep>
          ))
          .with(
            { formData: P.not(P.nullish), status: 'CONFIRM', uploadData: P.not(P.nullish) },
            ({ formData, uploadData }) => (
              <CreateDatasetStep key="confirm" step="confirm">
                <ConfirmDatasetStructure
                  dataset={{ ...uploadData, ...formData }}
                  onSubmit={(data) => void handleSubmit(data)}
                />
              </CreateDatasetStep>
            )
          )
          .otherwise(() => null)}
      </AnimatePresence>
    </div>
  );
};
