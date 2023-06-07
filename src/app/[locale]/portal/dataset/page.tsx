'use client';

import React, { useMemo } from 'react';

import { Button, useNotificationsStore } from '@douglasneuroinformatics/react-components';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useDropzone } from 'react-dropzone';

import { PageHeading } from '@/components/PageHeading';
import { useClientTranslations } from '@/hooks/useClientTranslations';

const DatasetPage = () => {
  const t = useClientTranslations();
  const { addNotification } = useNotificationsStore();

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    maxFiles: 1
  });

  // const fileContent = useMemo(() => {
  //   addNotification({ type: 'info', message: 'Success' });
  //   console.log(acceptedFiles);
  // }, [acceptedFiles]);

  const textContent = isDragActive
    ? 'Release your cursor to upload your dataset'
    : 'Please upload your dataset by either dragging and dropping it into this area or clicking to select a file';

  return (
    <div className="flex h-full flex-col">
      <PageHeading text="Manage Datasets" />
      <div className="flex flex-grow items-center justify-center">
        <div className="max-w-md">
          <div
            className="flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-6 text-slate-600 dark:border-slate-600"
            {...getRootProps()}
          >
            <CloudArrowUpIcon height={40} width={40} />
            <p className="text-center text-sm">{textContent}</p>
            <p className="text-xs"></p>
            <input {...getInputProps()} />
          </div>
          <Button className="mt-2 w-full" disabled={false} label={t.submit} />
        </div>
      </div>
    </div>
  );
};

export default DatasetPage;
