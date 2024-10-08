/* eslint-disable perfectionist/sort-objects */
import { useCallback, useState } from 'react';

import { Button, Form, Heading } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { type RouteObject, useNavigate } from 'react-router-dom';
import { match } from 'ts-pattern';
import { z } from 'zod';

import { LoadingFallback } from '@/components';

const $CreateDatasetFormValidation = z.object({
  description: z.string().optional(),
  datasetType: z.enum(['BASE', 'TABULAR']),
  license: z.enum(['PUBLIC', 'OTHER']),
  name: z.string().min(1),
  primaryKeys: z.string().optional()
});

export type CreateDatasetFormData = z.infer<typeof $CreateDatasetFormValidation>;

const CreateDatasetPage = () => {
  const MAX_UPLOAD_FILE_SIZE = 1024 * 1024 * 1024;
  const notifications = useNotificationsStore();
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreateDatasetFormData | null>(null);
  const [processingFile, setProcessingFile] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const createDataset = async () => {
    setProcessingFile(true);
    // important to add the header content type for posting file
    try {
      await axios.post(
        '/v1/datasets/create',
        {
          ...formData,
          file: file,
          isJSON: false,
          isReadyToShare: false,
          permission: 'MANAGER'
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      notifications.addNotification({ message: t('createDatasetSuccess'), type: 'success' });
    } catch {
      notifications.addNotification({ type: 'error', message: t('createDatasetFailure') });
    }

    navigate('/portal/datasets');
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles[0]) {
      notifications.addNotification({ type: 'error', message: 'Unexpected file error' });
    } else if (!acceptedFiles[0].name.includes('.csv') && !acceptedFiles[0].name.includes('.tsv')) {
      notifications.addNotification({ type: 'error', message: 'Only CSV or TSV files are allowed!' });
    } else if (acceptedFiles[0].size > MAX_UPLOAD_FILE_SIZE) {
      notifications.addNotification({ type: 'error', message: 'File size larger than 1 GB' });
    } else {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.csv', '.tsv']
    },
    maxFiles: 1,
    maxSize: MAX_UPLOAD_FILE_SIZE,
    onDrop
  });

  let element = match(formData)
    .with(null, () => {
      return (
        <>
          <Form
            content={{
              name: {
                kind: 'string',
                label: t('datasetName'),
                variant: 'input'
              },
              description: {
                kind: 'string',
                label: t('datasetDescription'),
                variant: 'textarea'
              },
              datasetType: {
                kind: 'string',
                label: t('datasetType'),
                options: {
                  BASE: 'Base',
                  // BINARY: 'Binary',
                  TABULAR: 'Tabular'
                },
                variant: 'select'
              },
              license: {
                kind: 'string',
                label: t('datasetLicense'),
                options: {
                  OTHER: 'Other',
                  PUBLIC: 'Public'
                },
                variant: 'select'
              },
              primaryKeys: {
                kind: 'dynamic',
                deps: ['datasetType'],
                render: (data) => {
                  return data.datasetType === 'TABULAR'
                    ? {
                        kind: 'string',
                        variant: 'input',
                        label: t('primaryKeys')
                      }
                    : null;
                }
              }
            }}
            submitBtnLabel="Confirm"
            validationSchema={$CreateDatasetFormValidation}
            onSubmit={(data) => {
              setFormData(data);
            }}
          />
        </>
      );
    })
    .with({ datasetType: 'BASE' }, () => {
      return (
        <>
          <h1 className="m-3 text-lg">{t('confirmCreateBaseDataset')}</h1>
          <div className="flex gap-2">
            <Button className="mt-2 w-full" label={t('confirm')} type="button" onClick={() => void createDataset()} />
            <Button
              className="mt-2 w-full"
              label={t('back')}
              type="button"
              variant="secondary"
              onClick={() => {
                setFormData(null);
              }}
            />
          </div>
        </>
      );
    })
    .otherwise(() => {
      return processingFile ? (
        <LoadingFallback />
      ) : (
        <>
          <div {...getRootProps()} className="flex-col justify-center text-center">
            <input {...getInputProps()} />
            {isDragActive ? (
              <Heading variant="h3">Drop the file here ...</Heading>
            ) : (
              <>
                <Heading variant="h3">Drag and drop the file here, or click to select file</Heading>
                <br />
                <br />
                <Heading variant="h5">Only CSV or TSV file is allowed.</Heading>
                <Heading variant="h5">Maximun file size: 1 GB</Heading>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              className="mt-2 w-full"
              disabled={file ? false : formData?.datasetType !== 'BASE'}
              label={t('submit')}
              type="button"
              onClick={() => void createDataset()}
            />
            <Button
              className="mt-2 w-full"
              disabled={!file}
              label={t('reset')}
              type="button"
              variant="secondary"
              onClick={() => {
                setFile(null);
              }}
            />
          </div>
        </>
      );
    });

  return (
    <>
      <motion.div
        animate={{ opacity: 1 }}
        className="flex h-full flex-grow flex-col items-center justify-center"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mt-6 w-full space-y-40 sm:max-w-md">
          <div className="h-auto rounded-lg border-2 border-dashed border-slate-300 p-6 text-slate-600 dark:border-slate-600 dark:text-slate-300">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                animate={{ opacity: 1 }}
                className="flex h-full flex-col items-center justify-center"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key={'test'}
                transition={{ duration: 1 }}
              >
                {element}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export const CreateDatasetRoute: RouteObject = {
  element: <CreateDatasetPage />,
  path: 'createDataset'
};
