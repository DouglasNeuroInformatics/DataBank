import React, { useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { type NavItem } from './types';

import { Logo, ThemeToggle } from '@/components';

export interface MobileNavbarProps {
  navigation: NavItem[];
}

export const MobileNavbar = ({ navigation }: MobileNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();

  return (
    <>
      <div className="flex w-full items-center justify-between bg-slate-900 p-4 dark:bg-slate-800 lg:hidden">
        <Link to="/">
          <Logo className="h-12 w-12 fill-slate-100" />
        </Link>
        <button className="text-slate-300 hover:text-slate-200" onClick={() => setIsOpen(true)}>
          <Bars3Icon height={32} width={32} />
        </button>
      </div>
      <Transition as={React.Fragment} show={isOpen}>
        <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setIsOpen}>
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={React.Fragment}
              enter="transition-opacity ease-linear duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/30" />
            </Transition.Child>
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={React.Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-slate-50 py-6 shadow-xl dark:bg-slate-800">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-slate-900">
                          <Logo className="h-12 w-12" />
                        </Dialog.Title>
                        <button
                          className="text-slate-600 hover:text-slate-500 dark:text-slate-300"
                          type="button"
                          onClick={() => setIsOpen(false)}
                        >
                          <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                    <hr className="mx-4 my-4 border-slate-300" />
                    <div className="relative flex-1 px-4 sm:px-6">
                      <nav>
                        {navigation.map((item) => (
                          <Link
                            className="group flex items-center rounded-md p-2 text-base font-medium text-slate-600 dark:text-slate-300 dark:hover:text-slate-500 [&>svg]:h-6 [&>svg]:w-6"
                            key={item.label}
                            to={item.href}
                            onClick={() => setIsOpen(false)}
                          >
                            <item.icon className="h-6 w-6" />
                            <span className="ml-2">{item.label}</span>
                          </Link>
                        ))}
                      </nav>
                    </div>
                    <div className="flex items-center justify-between px-4 text-slate-600 dark:text-slate-300 sm:px-6">
                      <button
                        className="rounded-md p-2 font-medium hover:backdrop-brightness-95 dark:hover:backdrop-brightness-150"
                        type="button"
                        onClick={() => i18n.changeLanguage(i18n.resolvedLanguage === 'en' ? 'fr' : 'en')}
                      >
                        {i18n.resolvedLanguage === 'en' ? 'Français' : 'English'}
                      </button>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
