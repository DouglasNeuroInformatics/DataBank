import { useCallback, useState } from 'react';

import { type DatasetColumnType } from '@databank/types';
import { Button, useNotificationsStore } from '@douglasneuroinformatics/ui';
import { AnimatePresence, motion } from 'framer-motion';
import Papa from 'papaparse';
import { useTranslation } from 'react-i18next';
import { P, match } from 'ts-pattern';
import { type Simplify } from 'type-fest';
import { ZodError, z } from 'zod';

import { AnimatedCheckIcon } from '@/components/AnimatedCheckIcon';

import { Dropzone } from './Dropzone';

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

const parsedDataSchema = z.object({
  data: z.record(z.union([z.coerce.number(), z.string()])).array(),
  fields: z.string().array()
});

export type InferredColumn = { name: string; type: DatasetColumnType | null };

export type DropzoneResult = Simplify<{
  columns: InferredColumn[];
  data: Record<string, number | string>[];
}>;

export type DatasetDropzoneProps = {
  /** The maximum file size in bytes (default = 10MB) */
  maxFileSize?: number;

  /** Callback to be invoked when the file has been successfully parsed */
  onSubmit: (result: DropzoneResult) => void;
};

export const DatasetDropzone = ({ maxFileSize = 10485760, onSubmit }: DatasetDropzoneProps) => {
  const [file, setFile] = useState<File | null>(null);
  // const [result, setResult] = useState<DropzoneResult | { isProcessing: boolean } | null>(null);
  const [result, setResult] = useState<DropzoneResult | null>(null);
  const notifications = useNotificationsStore();
  const { t } = useTranslation();

  /** Function to validate the structure of the parsed data and infer types */
  const validate = useCallback(async (parsedData: unknown) => {
    const inferType = (currentType: DatasetColumnType | null, value: number | string): DatasetColumnType => {
      if (typeof value === 'string' || currentType === 'STRING') {
        return 'STRING';
      } else if (Number.isInteger(value)) {
        return currentType === 'FLOAT' ? 'FLOAT' : 'INTEGER';
      } else if (Number.isFinite(value)) {
        return 'FLOAT';
      }
      throw new Error(t('unexpectedValue', { value }));
    };

    const { data, fields } = await parsedDataSchema.parseAsync(parsedData);
    const columns: InferredColumn[] = fields.map((name) => ({ name, type: null }));
    for (const columnName of fields) {
      const column = columns.find(({ name }) => name === columnName)!;
      for (const item of data) {
        const value = item[columnName]!;
        column.type = inferType(column.type, value);
        if (column.type === 'STRING') {
          break;
        }
      }
    }
    return { columns, data };
  }, []);

  // If error, promise will reject with error containing internationalized message and details will be logged to stdout
  const parseCSV = useCallback(
    (file?: File): Promise<{ data: unknown[]; fields: string[] }> =>
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
        Papa.parse(file!, {
          complete(results) {
            if (results.errors.length > 0) {
              console.error(results.errors);
              reject(new Error(t('fileParseError')));
            } else if (!results.meta.fields) {
              console.error('Fields is undefined');
              reject(new Error(t('unexpectedError')));
            } else {
              resolve({ data: results.data, fields: results.meta.fields });
            }
          },
          error: (error) => {
            console.error(error);
            reject(t('unexpectedError'));
          },
          header: true,
          skipEmptyLines: true,
          transformHeader(header, index) {
            if (header === '') {
              reject(new Error(t('invalidEmptyColumnError', { index })));
            } else if (!/^[\w.-]+$/.test(header)) {
              reject(new Error(t('invalidColumnNameError', { columnName: header })));
            }
            return header.toUpperCase();
          }
        });
      }),
    [notifications]
  );

  const handleSubmit = useCallback(async (file: File) => {
    try {
      // setResult({ isProcessing: true });
      const parsedData = await parseCSV(file);
      const result = await validate(parsedData);
      setResult(result);
    } catch (error) {
      console.error(error);
      setFile(null);
      setResult(null);
      if (error instanceof ZodError) {
        console.error(error.format());
        notifications.addNotification({ message: t('unexpectedError'), type: 'error' });
      } else if (error instanceof Error) {
        notifications.addNotification({ message: error.message, type: 'error' });
      } else {
        notifications.addNotification({ message: t('unexpectedError'), type: 'error' });
      }
    }
  }, []);

  const [element, key] = match(result)
    .with(P.nullish, () => [<Dropzone file={file} key="upload" setFile={setFile} />, 'upload'] as const)
    // .with({ isProcessing: P.boolean }, () => [<SuspenseFallback key="loading" />, 'loading'] as const)
    .with(
      { columns: P.any, data: P.any },
      (result) =>
        [
          <AnimatedCheckIcon
            className="h-12 w-12"
            key="loading"
            onComplete={() => {
              onSubmit(result);
            }}
          />,
          'complete'
        ] as const
    )
    .exhaustive();

  return (
    <div className="w-full sm:max-w-md">
      <div className="h-64 cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-6 text-slate-600 dark:border-slate-600 dark:text-slate-300">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            animate={{ opacity: 1 }}
            className="flex h-full flex-col items-center justify-center"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key={key}
            transition={{ duration: 1 }}
          >
            {element}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-2">
        <Button
          className="mt-2 w-full"
          disabled={!file}
          label={t('submit')}
          type="button"
          onClick={() => void handleSubmit(file!)}
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
