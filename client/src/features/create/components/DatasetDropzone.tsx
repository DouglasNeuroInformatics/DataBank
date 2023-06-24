import { useCallback, useState } from 'react';

import { Button, useNotificationsStore } from '@douglasneuroinformatics/react-components';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { parse } from 'papaparse';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

import { formatFileSize } from '@/utils/formatFileSize';

// 10 MB
const MAX_FILE_SIZE = 10485760;

export interface DatasetDropzoneProps {
  onSubmit: () => void;
}

export const DatasetDropzone = () => {
  const notifications = useNotificationsStore();
  const { t } = useTranslation();

  const handleDrop = useCallback(<T extends File>(acceptedFiles: T[], rejections: FileRejection[]) => {
    rejections.forEach(({ file, errors }) => {
      notifications.addNotification({ type: 'error', message: `Invalid File: ${file.name}` });
      console.error(errors);
    });
    const file = acceptedFiles[0];
    if (!file) {
      return;
    } else if (file.size > MAX_FILE_SIZE) {
      notifications.addNotification({
        type: 'error',
        message: `The maximum file size is ${formatFileSize(MAX_FILE_SIZE)}`
      });
    }
    parse(file, {
      header: true,
      complete(results, file) {
        if (results.errors.length > 0) {
          notifications.addNotification({
            type: 'error',
            message: 'An error occurred. Please refer to the browser console for more details.'
          });
          console.error(results.errors);
          return;
        }
        // eslint-disable-next-line no-console
        console.log(results, file);
      },
      error: (error) => {
        notifications.addNotification({ type: 'error', message: error.message });
        return;
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.csv', '.tsv']
    },
    onDrop: handleDrop,
    maxFiles: 1
  });

  const textContent = isDragActive
    ? 'Release your cursor to upload your dataset'
    : 'Please upload your dataset by either dragging and dropping it into this area or clicking to select a file';

  return (
    <div className="max-w-md">
      <div
        className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-6 text-slate-600 dark:border-slate-600 dark:text-slate-300"
        {...getRootProps()}
      >
        <CloudArrowUpIcon height={40} width={40} />
        <p className="text-center text-sm">{textContent}</p>
        <p className="text-xs">{acceptedFiles[0]?.name}</p>
        <input {...getInputProps()} />
      </div>
      <Button className="mt-2 w-full" disabled={acceptedFiles.length === 0} label={t('submit')} />
    </div>
  );
};
