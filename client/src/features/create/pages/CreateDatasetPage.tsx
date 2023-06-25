import { useState } from 'react';

import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { P, match } from 'ts-pattern';

import { CreateDatasetStep } from '../components/CreateDatasetStep';
import { DatasetDropzone, DropzoneResult } from '../components/DatasetDropzone';
import { DatasetForm, DatasetFormData } from '../components/DatasetForm';

import { Heading } from '@/components/Heading';

export const CreateDatasetPage = () => {
  const { t } = useTranslation();
  const [state, setState] = useState<DropzoneResult | DatasetFormData>();

  return (
    <div className="flex h-full flex-col">
      <Heading title={t('createDataset')} />
      <AnimatePresence initial={false} mode="wait">
        {match(state)
          .with(P.nullish, () => (
            <CreateDatasetStep step="upload">
              <DatasetDropzone onSubmit={setState} />
            </CreateDatasetStep>
          ))
          .with({ columns: P.any, data: P.any }, (parsedData) => (
            <CreateDatasetStep step="form">
              <DatasetForm inferredColumns={parsedData.columns} onSubmit={setState} />
            </CreateDatasetStep>
          ))
          .with({ name: P.string, description: P.string, columns: P.any }, (formData) => (
            <CreateDatasetStep step="confirm">
              <div>{JSON.stringify(formData)}</div>
            </CreateDatasetStep>
          ))
          .exhaustive()}
      </AnimatePresence>
    </div>
  );
};
