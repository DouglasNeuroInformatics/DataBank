import { useReducer } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { DatasetDropzone, DropzoneResult } from '../components/DatasetDropzone';
import { DatasetForm } from '../components/DatasetForm';

import { Heading } from '@/components/Heading';

type State = {
  uploaded: DropzoneResult | null;
};

type Action = { type: 'set-uploaded'; value: DropzoneResult };

const reducer = (state: State, action: Action): State => {
  const updatedState = match(action)
    .with({ type: 'set-uploaded' }, (action) => {
      return { ...state, uploaded: action.value };
    })
    .exhaustive();
  return updatedState;
};

export const CreateDatasetPage = () => {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, { uploaded: null });

  console.log(state.uploaded);

  return (
    <div className="flex h-full flex-col">
      <Heading title={t('createDataset')} />
      <AnimatePresence mode="wait">
        {match(state)
          .with({ uploaded: null }, () => (
            <motion.div
              animate={{ opacity: 1 }}
              className="flex flex-grow items-center justify-center"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="dataset-dropzone"
            >
              <DatasetDropzone onSubmit={(value) => dispatch({ type: 'set-uploaded', value })} />
            </motion.div>
          ))
          .otherwise(() => (
            <motion.div
              animate={{ opacity: 1 }}
              className="flex flex-grow items-center justify-center"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="dataset-form"
            >
              <DatasetForm onSubmit={() => null} />
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
};
