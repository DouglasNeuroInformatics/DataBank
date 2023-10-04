import React from 'react';

import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

export type ColumnHeaderProps = {
  field: string;
  label: string;
  setColumnToDelete: (column: string) => void;
  setColumnToEdit: (column: string) => void;
  width: number;
};

export const ColumnHeader = (props: ColumnHeaderProps) => {
  const { t } = useTranslation();
  return (
    <Menu as="div" className="relative">
      <Menu.Button
        className="flex flex-shrink-0 justify-between p-4 text-sm font-semibold text-slate-800 dark:text-slate-200"
        style={{ width: props.width }}
      >
        {props.label}
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
            onClick={() => {
              props.setColumnToEdit(props.field);
            }}
          >
            <PencilSquareIcon className="mr-2" height={16} width={16} />
            {t('edit')}
          </Menu.Item>
          <Menu.Item
            as="button"
            className="flex w-full items-center p-2 hover:backdrop-brightness-95 dark:hover:backdrop-brightness-150"
            type="button"
            onClick={() => {
              props.setColumnToDelete(props.field);
            }}
          >
            <TrashIcon className="mr-2 text-red-600" height={16} width={16} />
            {t('delete')}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
