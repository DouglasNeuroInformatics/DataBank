import { useCallback, useState } from 'react';

import { Button, useNotificationsStore } from '@douglasneuroinformatics/react-components';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import Papa from 'papaparse';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { ZodError, z } from 'zod';

import { AnimatedCheckIcon } from '@/components/AnimatedCheckIcon';

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
function formatFileSize(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return bytes.toFixed(dp) + ' ' + units[u];
}

const dropzoneResultSchema = z.object({
  fields: z.string().array(),
  data: z.record(z.string()).array()
});

export type DropzoneResult = z.infer<typeof dropzoneResultSchema>;

export interface DatasetDropzoneProps {
  /** The maximum file size in bytes (default = 10MB) */
  maxFileSize?: number;

  /** Callback to be invoked when the file has been successfully parsed */
  onSubmit: (result: DropzoneResult) => void;
}

export const DatasetDropzone = ({ maxFileSize = 10485760, onSubmit }: DatasetDropzoneProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<DropzoneResult | null>(null);
  const notifications = useNotificationsStore();
  const { t } = useTranslation();

  const handleDrop = useCallback((acceptedFiles: File[], rejections: FileRejection[]) => {
    for (const { file, errors } of rejections) {
      notifications.addNotification({ type: 'error', message: t('invalidFileError', { filename: file.name }) });
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

  // If error, promise will reject with error containing internationalized message and details will be logged to stdout
  const parseCSV = useCallback(
    (file: File): Promise<DropzoneResult> =>
      new Promise((resolve, reject) => {
        if (!file) {
          console.error('File object must be defined');
          reject(new Error(t('unexpectedError')));
        } else if (file.size > maxFileSize) {
          reject(
            new Error(
              t('maxFileSizeError', { actualSize: formatFileSize(file.size), maxSize: formatFileSize(maxFileSize) })
            )
          );
        }
        Papa.parse(file, {
          complete(results) {
            if (results.errors.length > 0) {
              console.error(results.errors);
              reject(new Error(t('fileParseError')));
            } else if (!results.meta.fields) {
              console.error('Fields is undefined');
              reject(new Error(t('unexpectedError')));
            } else {
              // I don't believe this should ever throw, but to be safe
              try {
                const result = dropzoneResultSchema.parse({ fields: results.meta.fields, data: results.data });
                resolve(result);
              } catch (error) {
                if (error instanceof ZodError) {
                  console.error(error.format());
                } else {
                  console.error(error);
                }
                reject(error);
              }
            }
          },
          error: (error) => {
            console.error(error);
            reject(t('unexpectedError'));
          },
          header: true,
          skipEmptyLines: true
          // transformHeader(header, index) {
          //   if (header === '') {
          //     reject(new Error(`Invalid column name at index '${index}': must not be empty string`));
          //   } else if (!/^[\w.-]+$/.test(header)) {
          //     reject(new Error(`Invalid column name '${header}': must contain only letters, numbers, or underscores`));
          //   }
          //   return header.toUpperCase();
          // }
        });
      }),
    []
  );

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
