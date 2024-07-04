/* eslint-disable perfectionist/sort-objects */
// fill a form with dataset information
// dropzone with file select to upload a file
// simply check the size of the file (max: 1GB) and the file extension: only tsv or csv is allowed
// submit function to send the file
// navigate to success page with options to view datasets or create more dataset?
// alternative option: navigate to view dataset page directly

import React, { useCallback, useState } from 'react';

import { Button, Form } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import type { RouteObject } from 'react-router-dom';
import { match } from 'ts-pattern';
import { z } from 'zod';

const $CreateDataformValidation = z.object({
  datasetDescription: z.string().optional(),
  datasetType: z.enum(['BASE', 'BINARY', 'TABULAR']),
  license: z.enum(['PUBLIC', 'OTHER']),
  name: z.string().min(1),
  primaryKeys: z.string().optional()
});

export type CreateDatasetFormData = z.infer<typeof $CreateDataformValidation>;

const CreateDatasetPage = () => {
  const MAX_UPLOAD_FILE_SIZE = 1024 * 1024 * 1024;
  const notifications = useNotificationsStore();
  const { t } = useTranslation('common');

  const [formData, setFormData] = useState<CreateDatasetFormData | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleCreateDataset = (data: CreateDatasetFormData) => {
    setFormData(data);
  };

  const postDataset = async () => {
    // important to add the header content type for posting file
    await axios.post(
      '/v1/datasets/create',
      {
        ...formData,
        file: file,
        isJSON: false
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    notifications.addNotification({ message: t('createDatasetSuccess'), type: 'success' });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles[0]) {
      throw console.error();
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
        <Form
          content={{
            name: {
              kind: 'string',
              label: 'Dataset Name',
              variant: 'input'
            },
            datasetDescription: {
              kind: 'string',
              label: 'Dataset Description (optional)',
              variant: 'textarea'
            },
            datasetType: {
              kind: 'string',
              label: 'Dataset Type',
              options: {
                BASE: 'Base',
                BINARY: 'Binary',
                TABULAR: 'Tabular'
              },
              variant: 'select'
            },
            license: {
              kind: 'string',
              label: 'Dataset Licence',
              options: {
                OTHER: 'Other',
                PUBLIC: 'Public'
              },
              variant: 'select'
            },
            primaryKeys: {
              kind: 'string',
              variant: 'input',
              label: 'Primary Keys (use , as delimiters)'
            }
          }}
          submitBtnLabel="Confirm Information"
          validationSchema={$CreateDataformValidation}
          onSubmit={(data) => {
            handleCreateDataset(data);
          }}
        />
      );
    })
    .otherwise(() => {
      return (
        <>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop the file here ...</p> : <p>Drag and drop the file here, or click to select file</p>}
          </div>
          <div className="flex gap-2">
            <Button
              className="mt-2 w-full"
              disabled={formData?.datasetType !== 'BASE' && !file}
              label={t('submit')}
              type="button"
              onClick={() => void postDataset()}
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
      <div className="w-full mt-6 sm:max-w-md space-y-40">
        <div className="h-auto cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-6 text-slate-600 dark:border-slate-600 dark:text-slate-300">
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
    </>
  );
};

export const CreateDatasetRoute: RouteObject = {
  element: <CreateDatasetPage />,
  path: 'createDataset'
};
