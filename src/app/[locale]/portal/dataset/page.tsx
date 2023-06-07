'use client';

import React, { useCallback, useState } from 'react';

import { Button, useNotificationsStore } from '@douglasneuroinformatics/react-components';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { type FileRejection, useDropzone } from 'react-dropzone';

import { PageHeading } from '@/components/PageHeading';
import { useClientTranslations } from '@/hooks/useClientTranslations';
import { trpc } from '@/utils/trpc';

const DatasetPage = () => {
  const t = useClientTranslations();
  const { addNotification } = useNotificationsStore();
  const [file, setFile] = useState<File | null>(null);
  const createDataset = trpc.dataset.create.useMutation();

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 0) {
      for (const rejectedFile of rejectedFiles) {
        for (const error of rejectedFile.errors) {
          addNotification({ title: rejectedFile.file.name, type: 'error', message: `${error.code}: ${error.message}` });
        }
        return;
      }
    } else if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    onDrop
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const content = await file?.text();
    if (!content) {
      console.error('File is null!');
      return;
    }
    try {
      const rows = content.split('\n');
      const columnNames = rows.shift()?.split(',');
      if (!columnNames) {
        throw new Error('First newline delineated string is undefined. The file is likely empty.');
      }
      for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].split(',');
        if (cells.length !== columnNames.length) {
          throw new Error(`Unexpected length of row ${i + 1}: must be ${columnNames.length}, not ${cells.length}`);
        }
      }
      await createDataset.mutateAsync(null);
      addNotification({ type: 'info', message: 'Success' });
    } catch (error) {
      console.error(error);
      addNotification({
        type: 'error',
        message: 'Failed to parse dataset. Please see the browser console for more details.'
      });
    } finally {
      setFile(null);
    }
  };

  const textContent = isDragActive
    ? 'Release your cursor to upload your dataset'
    : 'Please upload your dataset by either dragging and dropping it into this area or clicking to select a file';

  return (
    <div className="flex h-full flex-col">
      <PageHeading text="Manage Datasets" />
      <div className="flex flex-grow items-center justify-center">
        <form className="max-w-md" onSubmit={handleSubmit}>
          <div
            className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-6 text-slate-600 dark:border-slate-600"
            {...getRootProps()}
          >
            <CloudArrowUpIcon height={40} width={40} />
            <p className="text-center text-sm">{textContent}</p>
            <p className="text-xs">{file?.name}</p>
            <input {...getInputProps()} />
          </div>
          <Button className="mt-2 w-full" disabled={file === null} label={t.submit} />
        </form>
      </div>
    </div>
  );
};

export default DatasetPage;
