import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import type { TDataset } from '@databank/types';
import { Button, Modal, useNotificationsStore } from '@douglasneuroinformatics/ui';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import { Slider } from '../Slider';
import { ColumnHeader } from './ColumnHeader';
import { EditColumnForm } from './EditColumnForm';

export const DataTable = <T extends TDataset>({ dataset, revalidate }: { dataset: T; revalidate: () => void }) => {
  const notifications = useNotificationsStore();
  const ref = useRef<HTMLDivElement>(null);
  const [columnWidth, setColumnWidth] = useState<number>();
  const [columnToDelete, setColumnToDelete] = useState<null | string>(null);
  const [columnToEdit, setColumnToEdit] = useState<null | string>(null);
  const { t } = useTranslation();

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
      columns: dataset.columns.map((column) => ({ field: column.name, label: column.name })),
      data: dataset.data
    }),
    [dataset]
  );

  useLayoutEffect(() => {
    if (ref.current) {
      setColumnWidth(ref.current.offsetWidth / Math.min(table.columns.length, 4));
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
            <ColumnHeader
              field={column.field}
              key={column.field}
              label={column.label}
              setColumnToDelete={setColumnToDelete}
              setColumnToEdit={setColumnToEdit}
              width={columnWidth!}
            />
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
        <Modal
          open={Boolean(columnToDelete)}
          title={t('deleteColumn')}
          onClose={() => {
            setColumnToDelete(null);
          }}
        >
          <h3 className="text-slate-900 dark:text-slate-100">
            {t('confirmDeleteColumn', { columnName: columnToDelete })}
          </h3>
          <div className="mt-3 flex gap-2">
            <Button
              label={t('delete')}
              type="button"
              variant="danger"
              onClick={() => {
                deleteColumn(columnToDelete!);
                setColumnToDelete(null);
              }}
            />
            <Button
              className="text-slate-900"
              label={t('cancel')}
              type="button"
              variant="secondary"
              onClick={() => {
                setColumnToDelete(null);
              }}
            />
          </div>
        </Modal>
        <Slider
          isOpen={Boolean(columnToEdit)}
          setIsOpen={(isOpen) => {
            if (isOpen) {
              throw new Error('Should only close');
            }
            setColumnToEdit(null);
          }}
          title={columnToEdit}
        >
          <EditColumnForm
            initialValues={dataset.columns.find((item) => item.name === columnToEdit)}
            onSubmit={(data) => {
              axios
                .patch(`/v1/datasets/${dataset._id}/${columnToEdit!}`, data)
                .then(() => {
                  notifications.addNotification({ type: 'success' });
                })
                .catch(console.error);
            }}
          />
        </Slider>
      </>
    </>
  );
};
