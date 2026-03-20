/* eslint-disable perfectionist/sort-objects */
import { useCallback, useState } from 'react';

import { $DatasetLicenses } from '@databank/core';
import { Button, Form, Spinner } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon, FileUpIcon, UploadIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { match } from 'ts-pattern';
import { z } from 'zod/v4';

import { PageHeading } from '@/components/PageHeading';
import { useCreateDatasetMutation } from '@/hooks/mutations/useCreateDatasetMutation';
import { useDebounceLicensesFilter } from '@/hooks/useDebounceLicensesFilter';

const $CreateDatasetFormValidation = z.object({
  description: z.string().optional(),
  datasetType: z.enum(['BASE', 'TABULAR']),
  license: $DatasetLicenses,
  name: z.string().min(1),
  hasPrimaryKeys: z.boolean().optional().default(false),
  primaryKeys: z
    .array(z.object({ key: z.string() }))
    .optional()
    .default([]),
  isOpenSource: z.boolean().optional(),
  searchLicenseString: z.string().optional()
});

type CreateDatasetFormData = z.infer<typeof $CreateDatasetFormValidation>;

const RouteComponent = () => {
  const MAX_UPLOAD_FILE_SIZE = 1024 * 1024 * 1024;
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const createDatasetMutation = useCreateDatasetMutation();

  const [formData, setFormData] = useState<CreateDatasetFormData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { licenseOptions, subscribe } = useDebounceLicensesFilter();

  const createDataset = () => {
    if (!formData) return;

    const requestFormData = new FormData();
    requestFormData.append('datasetType', String(formData.datasetType));
    requestFormData.append('license', String(formData.license));
    requestFormData.append('name', formData.name);
    requestFormData.append('description', formData.description ?? '');
    formData.primaryKeys?.forEach((entry) => requestFormData.append('primaryKeys', entry.key));
    requestFormData.append('isJSON', 'false');
    requestFormData.append('isReadyToShare', 'false');
    requestFormData.append('permission', 'MANAGER');

    if (file) {
      requestFormData.append('file', file);
    }

    createDatasetMutation.mutate(requestFormData, {
      onError() {
        addNotification({ type: 'error', message: t('createDatasetFailure') });
      },
      onSettled() {
        void navigate({ to: '/portal/datasets' });
      },
      onSuccess() {
        addNotification({ message: t('createDatasetSuccess'), type: 'success' });
      }
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
    accept: { 'text/csv': ['.csv'], 'text/plain': ['.csv', '.tsv'] },
    maxFiles: 1,
    maxSize: MAX_UPLOAD_FILE_SIZE,
    onDrop
  });

  const element = match(formData)
    .with(null, () => (
      <Form
        content={[
          {
            title: 'Basic Dataset Information',
            fields: {
              name: { kind: 'string', label: t('datasetName'), variant: 'input' },
              description: { kind: 'string', label: t('datasetDescription'), variant: 'textarea' },
              datasetType: {
                kind: 'string',
                label: t('datasetType'),
                options: { BASE: 'Base', TABULAR: 'Tabular' },
                variant: 'select'
              },
              hasPrimaryKeys: {
                kind: 'dynamic',
                deps: ['datasetType'],
                render: (data) =>
                  data.datasetType === 'TABULAR'
                    ? { kind: 'boolean', label: 'Do you want to add primary keys to your dataset?', variant: 'radio' }
                    : null
              },
              primaryKeys: {
                kind: 'dynamic',
                deps: ['hasPrimaryKeys'],
                render: (data) =>
                  data.hasPrimaryKeys
                    ? {
                        kind: 'record-array',
                        label: 'Primary Keys',
                        fieldset: { key: { kind: 'string', variant: 'input', label: 'Variable/Column Name as a key' } }
                      }
                    : null
              }
            }
          },
          {
            title: 'Dataset License',
            description: 'Select a license for your dataset',
            fields: {
              isOpenSource: { kind: 'boolean', label: 'Is License Open Source', variant: 'radio' },
              searchLicenseString: { kind: 'string', label: 'Search for licenses', variant: 'input' },
              license: { kind: 'string', label: 'Select License', options: licenseOptions, variant: 'select' }
            }
          }
        ]}
        submitBtnLabel="Confirm"
        subscribe={subscribe}
        validationSchema={$CreateDatasetFormValidation}
        onSubmit={(data) => setFormData(data)}
      />
    ))
    .with({ datasetType: 'BASE' }, () => (
      <div className="space-y-4 text-center">
        <p className="text-muted-foreground">{t('confirmCreateBaseDataset')}</p>
        <div className="flex gap-3">
          <Button className="flex-1" variant="secondary" onClick={() => setFormData(null)}>
            <ArrowLeftIcon className="mr-1.5 size-4" />
            {t('back')}
          </Button>
          <Button className="flex-1" onClick={() => createDataset()}>
            {t('confirm')}
          </Button>
        </div>
      </div>
    ))
    .otherwise(() =>
      createDatasetMutation.isPending ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner />
          <p className="text-muted-foreground mt-4 text-sm">Uploading dataset...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className="border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 transition-colors"
          >
            <input {...getInputProps()} />
            {file ? (
              <>
                <FileUpIcon className="text-primary size-10" />
                <p className="mt-3 text-sm font-medium">{file.name}</p>
                <p className="text-muted-foreground mt-1 text-xs">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
              </>
            ) : isDragActive ? (
              <>
                <UploadIcon className="text-primary size-10 animate-bounce" />
                <p className="mt-3 text-sm font-medium">{t('dropFile')}</p>
              </>
            ) : (
              <>
                <UploadIcon className="text-muted-foreground size-10" />
                <p className="mt-3 text-sm font-medium">{t('dropOrSelectFile')}</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {t('onlyCsvTsv')} &middot; {t('maxFileSize')}
                </p>
              </>
            )}
          </div>
          <div className="flex gap-3">
            <Button className="flex-1" disabled={!file} variant="outline" onClick={() => setFile(null)}>
              {t('reset')}
            </Button>
            <Button
              className="flex-1"
              disabled={!file && formData?.datasetType !== 'BASE'}
              onClick={() => createDataset()}
            >
              <UploadIcon className="mr-1.5 size-4" />
              {t('submit')}
            </Button>
          </div>
        </div>
      )
    );

  return (
    <div className="mx-auto w-full max-w-xl">
      <PageHeading centered>{t('createDataset')}</PageHeading>
      {element}
    </div>
  );
};

export const Route = createFileRoute('/portal/datasets/create')({
  component: RouteComponent
});
