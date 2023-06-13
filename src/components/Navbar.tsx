'use client';

import React from 'react';

import { Disclosure } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { Branding } from './Branding';
import { NavLink } from './NavLink';
import { ProfileDropdown } from './ProfileDropdown';
import { ThemeToggle } from './ThemeToggle';

import { useClientTranslations } from '@/hooks/useClientTranslations';
import { useLocale } from '@/hooks/useLocale';

export const Navbar = () => {
  const locale = useLocale();
  const t = useClientTranslations();

  return (
    <Disclosure as="nav" className="bg-slate-900">
      {({ open }) => (
        <>
          <div className="container">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Branding />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    <NavLink href={`/${locale}`} label={t.nav.home} />
                    <NavLink href={`/${locale}/portal`} label={t.nav.dashboard} />
                    <NavLink href={`/${locale}/portal/dataset`} label={t.nav.dataset} />
                  </div>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex items-center">
                  <ThemeToggle className="bg-slate-800 text-slate-300 hover:text-white focus:outline-none focus:ring-1 focus:ring-slate-300 focus:ring-offset-2 focus:ring-offset-slate-800" />
                  <ProfileDropdown />
                </div>
              </div>
              <div className="-mr-2 flex sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-1 focus:ring-inset focus:ring-white">
                  {open ? (
                    <XMarkIcon aria-hidden="true" className="block h-6 w-6" />
                  ) : (
                    <Bars3Icon aria-hidden="true" className="block h-6 w-6" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Disclosure.Button as={NavLink} href={`/${locale}`} label={t.nav.home} />
              <Disclosure.Button as={NavLink} href={`/${locale}/portal`} label={t.nav.dashboard} />
              <Disclosure.Button as={NavLink} href={`/${locale}/portal/dataset`} label={t.nav.dataset} />
            </div>
            <div className="border-t border-slate-700 pb-3 pt-4">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img
                    alt=""
                    className="h-10 w-10 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">Tom Cook</div>
                  <div className="text-sm font-medium text-slate-400">tom@example.com</div>
                </div>
                <button
                  className="ml-auto flex-shrink-0 rounded-full bg-slate-800 p-1 text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
                  type="button"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <Disclosure.Button
                  as="a"
                  className="block rounded-md px-3 py-2 text-base font-medium text-slate-400 hover:bg-slate-700 hover:text-white"
                  href="#"
                >
                  Your Profile
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  className="block rounded-md px-3 py-2 text-base font-medium text-slate-400 hover:bg-slate-700 hover:text-white"
                  href="#"
                >
                  Settings
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  className="block rounded-md px-3 py-2 text-base font-medium text-slate-400 hover:bg-slate-700 hover:text-white"
                  href="#"
                >
                  Sign out
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
