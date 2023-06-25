import { useReducer } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { match } from 'ts-pattern';

import { DatasetDropzone } from '../components/DatasetDropzone';
import { DatasetForm } from '../components/DatasetForm';

import { Heading } from '@/components/Heading';
import { ParsedCSV } from '@/utils/parse-csv';

type State = {
  parsed: ParsedCSV | null;
};

type Action = { type: 'set-parsed'; value: ParsedCSV };

const reducer = (state: State, action: Action): State => {
  const updatedState = match(action)
    .with({ type: 'set-parsed' }, (action) => {
      return { ...state, parsed: action.value };
    })
    .exhaustive();
  return updatedState;
};

export const CreateDatasetPage = () => {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, { parsed: null });

  return (
    <div className="flex h-full flex-col">
      <Heading title={t('createDataset')} />
      <AnimatePresence mode="wait">
        {match(state)
          .with({ parsed: null }, () => (
            <motion.div
              animate={{ opacity: 1 }}
              className="flex flex-grow items-center justify-center"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              key="dataset-dropzone"
            >
              <DatasetDropzone onSubmit={(parsed) => dispatch({ type: 'set-parsed', value: parsed })} />
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
