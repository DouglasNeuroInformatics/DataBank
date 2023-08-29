import { useState } from 'react';

import { useNotificationsStore } from '@douglasneuroinformatics/ui';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { P, match } from 'ts-pattern';

import { ConfirmDatasetStructure, CreateDatasetData } from '../components/ConfirmDatasetStructure';
import { CreateDatasetStep } from '../components/CreateDatasetStep';
import { DatasetDropzone, DropzoneResult } from '../components/DatasetDropzone';
import { DatasetForm, DatasetFormData } from '../components/DatasetForm';

import { Heading } from '@/components/Heading';

export const CreateDatasetPage = () => {
  const notifications = useNotificationsStore();
  const { t } = useTranslation();
  const [state, setState] = useState<{
    uploadData?: DropzoneResult;
    formData?: DatasetFormData;
    status: 'UPLOAD' | 'FORM' | 'CONFIRM';
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
                onSubmit={(uploadData) => { setState((prevState) => ({ ...prevState, uploadData, status: 'FORM' })); }}
              />
            </CreateDatasetStep>
          ))
          .with({ status: 'FORM', uploadData: P.not(P.nullish) }, ({ uploadData }) => (
            <CreateDatasetStep key="form" step="form">
              <DatasetForm
                inferredColumns={uploadData.columns}
                onSubmit={(formData) => { setState((prevState) => ({ ...prevState, formData, status: 'CONFIRM' })); }}
              />
            </CreateDatasetStep>
          ))
          .with(
            { status: 'CONFIRM', uploadData: P.not(P.nullish), formData: P.not(P.nullish) },
            ({ uploadData, formData }) => (
              <CreateDatasetStep key="confirm" step="confirm">
                <ConfirmDatasetStructure dataset={{ ...uploadData, ...formData }} onSubmit={handleSubmit} />
              </CreateDatasetStep>
            )
          )
          .otherwise(() => null)}
      </AnimatePresence>
    </div>
  );
};
