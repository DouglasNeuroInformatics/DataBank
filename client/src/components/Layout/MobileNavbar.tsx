import React, { useState } from 'react';

import { Dialog, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

import { type NavLink } from './types';

import { Logo } from '@/components';

export interface MobileNavbarProps {
  navigation: NavLink[];
}

export const MobileNavbar = ({ navigation }: MobileNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="flex w-full items-center justify-between bg-slate-900 p-4 lg:hidden">
        <Logo />
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
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-slate-900">
                          <Logo />
                        </Dialog.Title>
                        <button
                          className="text-slate-400 hover:text-slate-500"
                          type="button"
                          onClick={() => setIsOpen(false)}
                        >
                          <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <nav>
                        {navigation.map((item) => (
                          <a
                            className="group flex items-center rounded-md p-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 [&>svg]:h-6 [&>svg]:w-6"
                            href={item.href}
                            key={item.label}
                          >
                            {item.icon}
                            <span className="ml-2">{item.label}</span>
                          </a>
                        ))}
                      </nav>
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
