'use client';

import React, { useRef } from 'react';

import Link from 'next/link';

import { clsx } from 'clsx';
import { ArrowToggle } from '@douglasneuroinformatics/react-components';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

import { useClientTranslations } from '@/hooks/useClientTranslations';
import { Locale, i18n } from '@/lib/i18n';
import { useRedirectedPathname } from '@/hooks/useRedirectedPathname';
import { useLocale } from '@/hooks/useLocale';

interface LanguageSwitcherProps {
  dropdownDirection?: 'up' | 'down';
}

export const LanguageSwitcher = ({ dropdownDirection }: LanguageSwitcherProps) => {
  const ref = useRef<HTMLElement>(null);
  const t = useClientTranslations();
  const locale = useLocale();

  const redirectedPathName = useRedirectedPathname();

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center">
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
        <Menu.Items className="absolute bottom-6 flex min-w-full flex-col rounded-md border bg-slate-100">
          {i18n.locales.map((locale) => (
            <Menu.Item key={locale}>
              <Link className="px-3 py-2 uppercase hover:bg-slate-100" href={redirectedPathName(locale)}>
                {locale}
              </Link>
            </Menu.Item>
          ))}
        </Menu.Items>
        {/* <Menu.Items className="absolute right-0 mt-2 flex min-w-full flex-col rounded-md border">
          {i18n.locales.map((locale) => (
            <Menu.Item key={locale}>
              <Link className="px-3 py-2 uppercase hover:bg-slate-100" href={redirectedPathName(locale)}>
                {locale}
              </Link>
            </Menu.Item>
          ))}
        </Menu.Items> */}
      </Transition>
    </Menu>
  );
};
