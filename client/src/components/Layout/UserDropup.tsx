import React, { useRef, useState } from 'react';

import { ArrowToggle, useOnClickOutside } from '@douglasneuroinformatics/react-components';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth-store';

export const UserDropup = () => {
  const auth = useAuthStore();
  const { t } = useTranslation();
  return (
    <Menu as="div" className="relative m-2 flex items-center justify-center">
      <Menu.Button>
        <UserCircleIcon className="h-8 w-8" />
      </Menu.Button>
      <Menu.Items className="absolute bottom-12 left-0 whitespace-nowrap rounded-sm border shadow-lg dark:border-slate-700 dark:bg-slate-800">
        <Menu.Item>
          <button className="block p-2 first-letter:capitalize hover:bg-slate-700" onClick={() => auth.logout()}>
            {t('logout')}
          </button>
        </Menu.Item>
        <Menu.Item>
          <Link className="block p-2 first-letter:capitalize hover:bg-slate-700" to="/user">
            {t('preferences')}
          </Link>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
};
