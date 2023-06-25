import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { P, match } from 'ts-pattern';

import { DatasetDropzone, DropzoneResult } from '../components/DatasetDropzone';
import { DatasetForm } from '../components/DatasetForm';

import { Heading } from '@/components/Heading';

export const CreateDatasetPage = () => {
  const { t } = useTranslation();
  const [state, setState] = useState<DropzoneResult>();

  return (
    <div className="flex h-full flex-col">
      <Heading title={t('createDataset')} />
      <AnimatePresence mode="wait">
        {match(state)
          .with(P.nullish, () => (
            <motion.div
              animate={{ opacity: 1 }}
              className="flex flex-grow items-center justify-center"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="dataset-dropzone"
            >
              <DatasetDropzone onSubmit={setState} />
            </motion.div>
          ))
          .with({ columns: P.any, data: P.any }, () => (
            <motion.div
              animate={{ opacity: 1 }}
              className="flex flex-grow items-center justify-center"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="dataset-form"
            >
              <DatasetForm onSubmit={() => null} />
            </motion.div>
          ))
          .exhaustive()}
      </AnimatePresence>
    </div>
  );
};
