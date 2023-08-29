import { useCallback } from 'react';

import { useNotificationsStore } from '@douglasneuroinformatics/ui';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { FileRejection, useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

export type DropzoneProps = {
  file: File | null;
  setFile: (file: File) => void;
}

export const Dropzone = ({ file, setFile }: DropzoneProps) => {
  const notifications = useNotificationsStore();
  const { t } = useTranslation();

  const handleDrop = useCallback(
    (acceptedFiles: File[], rejections: FileRejection[]) => {
      for (const { file, errors } of rejections) {
        notifications.addNotification({ type: 'error', message: t('invalidFileError', { filename: file.name }) });
        console.error(errors);
      }
      setFile(acceptedFiles[0]);
    },
    [notifications, setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.csv', '.tsv']
    },
    onDrop: handleDrop,
    maxFiles: 1
  });

  return (
    <div className="flex h-full flex-col items-center justify-center" {...getRootProps()}>
      <CloudArrowUpIcon height={40} width={40} />
      <p className="mt-1 text-center text-sm">
        {file ? file.name : isDragActive ? t('releaseToUpload') : t('dropHere')}
      </p>
      <input {...getInputProps()} />
    </div>
  );
};
