import { useState } from 'react';

import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { P, match } from 'ts-pattern';

import { ConfirmDatasetStructure } from '../components/ConfirmDatasetStructure';
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
            <CreateDatasetStep key="upload" step="upload">
              <DatasetDropzone onSubmit={setState} />
            </CreateDatasetStep>
          ))
          .with({ columns: P.any, data: P.any }, (parsedData) => (
            <CreateDatasetStep key="form" step="form">
              <DatasetForm inferredColumns={parsedData.columns} onSubmit={setState} />
            </CreateDatasetStep>
          ))
          .with({ name: P.string, description: P.string, columns: P.any }, (data) => (
            <CreateDatasetStep key="confirm" step="confirm">
              <ConfirmDatasetStructure dataset={data} />
            </CreateDatasetStep>
          ))
          .exhaustive()}
        56
      </AnimatePresence>
    </div>
  );
};
