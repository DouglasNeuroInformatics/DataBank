import { useCallback, useState } from 'react';

import { Button, useNotificationsStore } from '@douglasneuroinformatics/react-components';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { AnimatePresence } from 'framer-motion';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

import { type ParsedCSV, parseCSV } from '@/utils/parse-csv';

export interface DatasetDropzoneProps {
  onSubmit: ({ data, fields }: ParsedCSV) => void;
}

export const DatasetDropzone = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
      console.log(results);
      setIsSubmitted(true);
    } catch (error) {
      if (error instanceof Error) {
        notifications.addNotification({ type: 'error', message: error.message });
      } else {
        notifications.addNotification({ type: 'error', message: t('unexpectedError') });
      }
      console.error(error);
      setFile(null);
    }
  };

  return (
    <div className="w-full sm:max-w-md">
      <div
        className="h-64 cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-6 text-slate-600 dark:border-slate-600 dark:text-slate-300"
        {...getRootProps()}
      >
        <AnimatePresence>
          {isSubmitted ? (
            <div>
              <h1>Yay!</h1>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center" key={1}>
              <CloudArrowUpIcon height={40} width={40} />
              <p className="mt-1 text-center text-sm">
                {file ? file.name : isDragActive ? t('releaseToUpload') : t('dropHere')}
              </p>
              <input {...getInputProps()} />
            </div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex gap-2">
        <Button
          className="mt-2 w-full"
          disabled={!file}
          label={t('submit')}
          type="button"
          onClick={() => handleSubmit(file!)}
        />
        <Button
          className="mt-2 w-full"
          disabled={!file}
          label={t('reset')}
          type="button"
          variant="secondary"
          onClick={() => setFile(null)}
        />
      </div>
    </div>
  );
};
