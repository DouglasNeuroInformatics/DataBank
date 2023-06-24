import { useCallback, useState } from 'react';

import { Button, useNotificationsStore } from '@douglasneuroinformatics/react-components';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

import { parseCSV } from '@/utils/parse-csv';

export interface DatasetDropzoneProps {
  onSubmit: () => void;
}

export const DatasetDropzone = () => {
  const [file, setFile] = useState<File>();
  const notifications = useNotificationsStore();
  const { t } = useTranslation();

  const handleDrop = useCallback((acceptedFiles: File[], rejections: FileRejection[]) => {
    for (const { file, errors } of rejections) {
      notifications.addNotification({ type: 'error', message: `Invalid File: ${file.name}` });
      console.error(errors);
    }
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.csv', '.tsv']
    },
    onDrop: handleDrop,
    maxFiles: 1
  });

  const handleSubmit = async (file: File) => {
    try {
      const results = await parseCSV(file);
      notifications.addNotification({ type: 'success' });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        notifications.addNotification({ type: 'error', message: error.message });
      } else {
        notifications.addNotification({ type: 'error', message: t('unexpectedError') });
      }
    }
  };

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
      <Button
        className="mt-2 w-full"
        disabled={!file}
        label={t('submit')}
        type="button"
        onClick={() => handleSubmit(file!)}
      />
    </div>
  );
};
