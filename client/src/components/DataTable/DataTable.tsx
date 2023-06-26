import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';

import { TDataset } from '@databank/types';
import { Button, Modal, useNotificationsStore } from '@douglasneuroinformatics/react-components';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export const DataTable = <T extends TDataset>({ dataset, revalidate }: { dataset: T; revalidate: () => void }) => {
  const notifications = useNotificationsStore();
  const ref = useRef<HTMLDivElement>(null);
  const [columnWidth, setColumnWidth] = useState<number>();
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null);

  const deleteColumn = (columnName: string) => {
    axios
      .delete(`/v1/datasets/${dataset._id}/${columnName}`)
      .then(() => {
        notifications.addNotification({ type: 'success' });
        revalidate();
      })
      .catch(console.error);
  };

  const table = useMemo(
    () => ({
      columns: dataset.columns.map((column) => ({ label: column.name, field: column.name })),
      data: dataset.data
    }),
    [dataset]
  );

  useLayoutEffect(() => {
    if (ref.current) {
      setColumnWidth(ref.current?.offsetWidth / Math.min(table.columns.length, 4));
    }
  }, [table]);

  return (
    <>
      <div
        className="h-full w-full border-separate overflow-scroll rounded-md shadow-md ring-1 ring-black ring-opacity-5"
        ref={ref}
      >
        <div className="sticky top-0 flex w-fit border-b border-slate-300 bg-slate-50 dark:border-0 dark:bg-slate-700">
          {table.columns.map((column) => (
            <Menu as="div" className="relative" key={column.field}>
              <Menu.Button
                className="flex flex-shrink-0 justify-between p-4 text-sm font-semibold text-slate-800 dark:text-slate-200"
                key={column.label}
                style={{ width: columnWidth }}
              >
                {column.label}
                <ChevronDownIcon height={16} width={16} />
              </Menu.Button>
              <Transition
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-4 mt-2 w-56 origin-top-right rounded-md bg-slate-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-700">
                  <Menu.Item
                    as="button"
                    className="flex w-full items-center p-2 hover:backdrop-brightness-95 dark:hover:backdrop-brightness-150"
                    type="button"
                  >
                    <PencilSquareIcon className="mr-2" height={16} width={16} />
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    as="button"
                    className="flex w-full items-center p-2 hover:backdrop-brightness-95 dark:hover:backdrop-brightness-150"
                    type="button"
                    onClick={() => setColumnToDelete(column.field)}
                  >
                    <TrashIcon className="mr-2 text-red-600" height={16} width={16} />
                    Delete
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          ))}
        </div>
        <div className="w-fit min-w-full divide-y divide-solid divide-slate-200 bg-white dark:divide-slate-600 dark:bg-slate-800">
          {table.data.map((entry, i) => (
            <div className="flex" key={i}>
              {table.columns.map(({ field }, i) => {
                const value = entry[field];
                return (
                  <div
                    className="flex-shrink-0 whitespace-nowrap p-4 text-sm text-slate-600 dark:text-slate-300"
                    key={i}
                    style={{ width: columnWidth }}
                  >
                    {typeof value === 'number' ? value.toFixed(2) : value}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <>
        <Modal open={Boolean(columnToDelete)} title="Delete Column" onClose={() => setColumnToDelete(null)}>
          <h3>Please confirm that you would like the delete the following column: {columnToDelete}</h3>
          <div className="mt-3 flex gap-2">
            <Button
              label="Delete"
              type="button"
              variant="danger"
              onClick={() => {
                deleteColumn(columnToDelete!);
                setColumnToDelete(null);
              }}
            />
            <Button label="Cancel" type="button" variant="secondary" onClick={() => setColumnToDelete(null)} />
          </div>
        </Modal>
      </>
    </>
  );
};
