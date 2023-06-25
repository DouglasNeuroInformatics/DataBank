import { useCallback, useState } from 'react';

import { Button, useNotificationsStore } from '@douglasneuroinformatics/react-components';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

import { AnimatedCheckIcon } from '@/components/AnimatedCheckIcon';
import { type ParsedCSV, parseCSV } from '@/utils/parse-csv';

export interface DatasetDropzoneProps {
  onSubmit: ({ data, fields }: ParsedCSV) => void;
}

export const DatasetDropzone = ({ onSubmit }: DatasetDropzoneProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ParsedCSV | null>(null);
  const notifications = useNotificationsStore();
  const { t } = useTranslation();

  const handleDrop = useCallback((acceptedFiles: File[], rejections: FileRejection[]) => {
    for (const { file, errors } of rejections) {
      notifications.addNotification({ type: 'error', message: `Invalid File: ${file.name}` });
      console.error(errors);
    }
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.csv', '.tsv']
    },
    onDrop: handleDrop,
    maxFiles: 1
  });

  const handleSubmit = async (file: File) => {
    try {
      const result = await parseCSV(file);
      setResult(result);
    } catch (error) {
      console.error(error);
      setFile(null);
      if (error instanceof Error) {
        notifications.addNotification({ type: 'error', message: error.message });
      } else {
        notifications.addNotification({ type: 'error', message: t('unexpectedError') });
      }
    }
  };

  return (
    <div className="w-full sm:max-w-md">
      <div
        className="h-64 cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-6 text-slate-600 dark:border-slate-600 dark:text-slate-300"
        {...getRootProps()}
      >
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex h-full items-center justify-center"
              initial={{ opacity: 0, y: -10 }}
              key={0}
            >
              <AnimatedCheckIcon
                className="h-12 w-12"
                onComplete={() => {
                  onSubmit(result);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex h-full flex-col items-center justify-center"
              exit={{ opacity: 0, y: 10 }}
              key={1}
            >
              <CloudArrowUpIcon height={40} width={40} />
              <p className="mt-1 text-center text-sm">
                {file ? file.name : isDragActive ? t('releaseToUpload') : t('dropHere')}
              </p>
              <input {...getInputProps()} />
            </motion.div>
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
          onClick={() => {
            setFile(null);
            setResult(null);
          }}
        />
      </div>
    </div>
  );
};
