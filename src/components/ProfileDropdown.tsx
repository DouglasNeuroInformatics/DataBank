'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { Menu, Transition } from '@headlessui/react';
import { clsx } from 'clsx';

import { useClientTranslations } from '@/hooks/useClientTranslations';

export const ProfileDropdown = () => {
  const t = useClientTranslations();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST'
    });
    router.refresh();
  };

  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <Menu.Button className="flex rounded-full bg-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800">
          <img
            alt=""
            className="h-8 w-8 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          />
        </Menu.Button>
      </div>
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {({ active }) => (
              <a
                className={clsx('block px-4 py-2 text-sm text-slate-700', {
                  'bg-slate-100': active
                })}
                href="#"
              >
                Your Profile
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <a
                className={clsx('block px-4 py-2 text-sm text-slate-700', {
                  'bg-slate-100': active
                })}
                href="#"
              >
                Settings
              </a>
            )}
          </Menu.Item>
          <Menu.Item>
            <button className="block px-4 py-2 text-sm text-slate-700" type="button" onClick={handleLogout}>
              {t.logout}
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};