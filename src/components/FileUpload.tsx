import React, { useTransition } from 'react';

import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

export const FileUpload = (props: React.ComponentPropsWithoutRef<'form'>) => {
  return (
    <form {...props}>
      <div className="flex w-full items-center justify-center">
        <label
          className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
          htmlFor="dropzone-file"
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <CloudArrowUpIcon height={40} width={40} />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
          <input id="dropzone-file" name="file" type="file" />
        </label>
      </div>
      <button>Submit</button>
    </form>
  );
};
