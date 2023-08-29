import React from 'react';

import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth-store';

export const UserDropup = () => {
  const auth = useAuthStore();
  const { i18n, t } = useTranslation();
  return (
    <Menu as="div" className="relative p-2">
      <Menu.Button>
        <UserCircleIcon className="h-8 w-8" />
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
        <Menu.Items className="absolute z-50 bottom-14 left-0 origin-bottom-left whitespace-nowrap rounded-sm border shadow-lg border-slate-700 bg-slate-800">
          <Menu.Item>
            <Link className="block w-full p-2 first-letter:capitalize hover:bg-slate-700" to="/portal/user">
              {t('preferences')}
            </Link>
          </Menu.Item>
          <Menu.Item>
            <button
              className="block w-full p-2 text-left first-letter:capitalize hover:bg-slate-700"
              type="button"
              onClick={() => {
                void i18n.changeLanguage(i18n.resolvedLanguage === 'en' ? 'fr' : 'en');
              }}
            >
              {i18n.resolvedLanguage === 'en' ? 'Français' : 'English'}
            </button>
          </Menu.Item>
          <Menu.Item>
            <button
              className="block w-full p-2 text-left first-letter:capitalize hover:bg-slate-700"
              type="button"
              onClick={() => { auth.logout(); }}
            >
              {t('logout')}
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
