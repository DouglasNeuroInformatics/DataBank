'use client';

import React from 'react';

import Link from 'next/link';

import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { clsx } from 'clsx';

import { useLocale } from '@/hooks/useLocale';
import { useRedirectedPathname } from '@/hooks/useRedirectedPathname';
import { i18n } from '@/lib/i18n';

interface LanguageSwitcherProps {
  dropdownDirection?: 'up' | 'down';
}

export const LanguageSwitcher = ({ dropdownDirection }: LanguageSwitcherProps) => {
  const locale = useLocale();

  const redirectedPathName = useRedirectedPathname();

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center justify-center border p-2 dark:border-slate-600">
        <span className="uppercase">{locale}</span>
        <ChevronDownIcon
          className={clsx('ml-1', { 'rotate-180': dropdownDirection === 'up' })}
          height={16}
          width={16}
        />
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
        <Menu.Items
          className={clsx('absolute flex min-w-full flex-col rounded-md border bg-slate-100 dark:bg-slate-900', {
            'bottom-12': dropdownDirection === 'up',
            'right-0 mt-2 origin-right': dropdownDirection !== 'up'
          })}
        >
          {i18n.locales.map((locale) => (
            <Menu.Item key={locale}>
              <Link
                className="px-3 py-2 uppercase first:rounded-t-md last:rounded-b-md hover:bg-slate-200 dark:hover:bg-slate-800"
                href={redirectedPathName(locale)}
              >
                {locale}
              </Link>
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
