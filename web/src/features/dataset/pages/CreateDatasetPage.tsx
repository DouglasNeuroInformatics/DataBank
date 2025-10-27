/* eslint-disable perfectionist/sort-objects */
import { useCallback, useState } from 'react';

import { $DatasetLicenses } from '@databank/core';
import { Button, Form, Heading } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { match } from 'ts-pattern';
import { z } from 'zod/v4';

import { LoadingFallback } from '@/components';
import { useDebounceLicensesFilter } from '@/hooks/useDebounceLicensesFilter';

const $CreateDatasetFormValidation = z
  .object({
    description: z.string().optional(),
    datasetType: z.enum(['BASE', 'TABULAR']),
    license: $DatasetLicenses,
    name: z.string().min(1),
    hasPrimaryKeys: z.boolean().optional(),
    primaryKeys: z
      .array(
        z.object({
          key: z.string()
        })
      )
      .optional(),
    isOpenSource: z.boolean().optional(),
    searchLicenseString: z.string().optional()
  })
  .check((ctx) => {
    if (ctx.value.datasetType === 'TABULAR' && ctx.value.hasPrimaryKeys === undefined) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value.hasPrimaryKeys,
        message: 'hasPrimaryKeys cannot be undefined for tabular dataset.'
      });
    }

    if (
      ctx.value.datasetType === 'TABULAR' &&
      ctx.value.hasPrimaryKeys === true &&
      ctx.value.primaryKeys === undefined
    ) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value.primaryKeys,
        message: 'Must enter at least 1 primary key because hasPrimaryKeys is set to true.'
      });
    }
  });
// .refine((val)=> val.datasetType === "TABULAR" && val.hasPrimaryKeys === false && val.primaryKeys === undefined, {error: "Must enter at least 1 primary key because hasPrimaryKeys is set to true."});

type CreateDatasetFormData = z.infer<typeof $CreateDatasetFormValidation>;

const CreateDatasetPage = () => {
  const MAX_UPLOAD_FILE_SIZE = 1024 * 1024 * 1024;
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreateDatasetFormData | null>(null);
  const [processingFile, setProcessingFile] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const { licenseOptions, subscribe } = useDebounceLicensesFilter();

  const createDataset = async () => {
    setProcessingFile(true);
    if (!formData) {
      return;
    }
    // important to add the header content type for posting file
    try {
      const requestFormData = new FormData();

      requestFormData.append('datasetType', String(formData?.datasetType));
      requestFormData.append('license', String(formData?.license));
      requestFormData.append('name', formData.name);
      requestFormData.append('description', formData.description ?? '');
      formData.primaryKeys?.forEach((entry) => requestFormData.append('primaryKeys', entry.key));
      requestFormData.append('isJSON', 'false');
      requestFormData.append('isReadyToShare', 'false');
      requestFormData.append('permission', 'MANAGER');

      if (file) {
        requestFormData.append('file', file);
      }

      await axios.post('/v1/datasets/create', requestFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      addNotification({ message: t('createDatasetSuccess'), type: 'success' });
    } catch {
      addNotification({ type: 'error', message: t('createDatasetFailure') });
    }

    void navigate({
      to: '/portal/datasets'
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles[0]) {
      addNotification({ type: 'error', message: 'Unexpected file error' });
    } else if (!acceptedFiles[0].name.includes('.csv') && !acceptedFiles[0].name.includes('.tsv')) {
      addNotification({ type: 'error', message: 'Only CSV or TSV files are allowed!' });
    } else if (acceptedFiles[0].size > MAX_UPLOAD_FILE_SIZE) {
      addNotification({ type: 'error', message: 'File size larger than 1 GB' });
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

  const element = match(formData)
    .with(null, () => {
      return (
        <>
          <Form
            content={[
              {
                title: 'Basic Dataset Information',
                description: 'Basic dataset information details',
                fields: {
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
                  hasPrimaryKeys: {
                    kind: 'dynamic',
                    deps: ['datasetType'],
                    render: (data) => {
                      return data.datasetType === 'TABULAR'
                        ? {
                            kind: 'boolean',
                            label: 'Do you want to add primary keys to your dataset?',
                            // description: "A set of primary keys can uniquely identify an entry of your dataset. If you skip this step, an automatically generated id column will be added to the beginning of your tabular dataset.",
                            variant: 'radio'
                          }
                        : null;
                    }
                  },
                  primaryKeys: {
                    kind: 'dynamic',
                    deps: ['hasPrimaryKeys'],
                    render: (data) => {
                      return data.hasPrimaryKeys
                        ? {
                            kind: 'record-array',
                            label: 'Primary Keys',
                            fieldset: {
                              key: {
                                kind: 'string',
                                variant: 'input',
                                label: 'Variable/Column Name as a key'
                              }
                            }
                          }
                        : null;
                    }
                  }
                }
              },
              {
                title: 'Dataset License',
                description: 'Select a license for your dataset',
                fields: {
                  isOpenSource: {
                    kind: 'boolean',
                    label: 'Is License Open Source',
                    variant: 'radio'
                  },
                  searchLicenseString: {
                    kind: 'string',
                    label: 'Search for licenses',
                    variant: 'input'
                  },
                  license: {
                    kind: 'string',
                    label: 'Select License',
                    options: licenseOptions,
                    variant: 'select'
                  }
                }
              }
            ]}
            submitBtnLabel="Confirm"
            subscribe={subscribe}
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
              <Heading variant="h3">{t('dropFile')}</Heading>
            ) : (
              <>
                <Heading variant="h3">{t('dropOrSelectFile')}</Heading>
                <br />
                <br />
                <Heading variant="h5">{t('onlyCsvTsv')}</Heading>
                <Heading variant="h5">{t('maxFileSize')}</Heading>
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
        className="flex grow flex-col items-center justify-center"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mt-6 w-full space-y-40 sm:max-w-md">
          <div className="h-auto rounded-lg border-2 border-dashed border-slate-300 p-6 text-slate-600 dark:border-slate-600 dark:text-slate-300">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key={'test'}
                transition={{ duration: 1 }}
              >
                <Heading className="mb-4" variant="h2">
                  {t('createDataset')}
                </Heading>
                {element}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export { CreateDatasetPage };
