import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

import { useClientTranslations } from '@/hooks/useClientTranslations';
import { Locale, i18n } from '@/i18n-config';
import { useRedirectedPathname } from '@/hooks/useRedirectedPathname';

export const LanguageSwitcher = () => {
  const t = useClientTranslations();
  const pathname = usePathname();

  const resolvedLanguage = pathname.split('/')[1] as Locale;

  const redirectedPathName = useRedirectedPathname();

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center font-medium">
        <span>{t[`languages.${resolvedLanguage}`]}</span>
        <ChevronDownIcon className="ml-1" height={16} width={16} />
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
        <Menu.Items className="absolute right-0 mt-2 flex min-w-full origin-top-right flex-col rounded-md border">
          {i18n.locales.map((locale) => (
            <Menu.Item key={locale}>
              <Link className="px-3 py-2 hover:bg-slate-100" href={redirectedPathName(locale)}>
                {t[`languages.${locale}`]}
              </Link>
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
