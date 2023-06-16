import { useState } from 'react';

import { Bars3Icon } from '@heroicons/react/24/solid';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { LanguageToggle, ThemeToggle } from '@/components';
import { Logo } from '@/components/Logo';

export const LandingHeader = () => {
  const { i18n, t } = useTranslation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <header className="bg-white text-slate-700 shadow dark:bg-slate-800 dark:text-slate-300">
      <div className="container flex flex-wrap items-center bg-inherit py-2">
        <Logo className="m-2 mr-10 hidden h-10 w-auto md:block" />
        <button className="m-2 md:hidden" type="button" onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}>
          <Bars3Icon height={32} width={32} />
        </button>
        <div className="flex flex-grow justify-end gap-3 bg-inherit md:order-last">
          <ThemeToggle />
          <LanguageToggle />
        </div>
        <nav
          className={clsx(
            'flex max-h-0 w-full flex-col overflow-hidden transition-[max-height] duration-300 md:max-h-fit md:w-auto md:flex-row md:items-center md:space-x-6',
            {
              'max-h-20': isMobileNavOpen
            }
          )}
        >
          <Link
            className={clsx(
              'block px-3 py-2 font-medium',
              i18n.resolvedLanguage === 'en' ? 'capitalize' : 'first-letter:capitalize'
            )}
            to="/auth/login"
          >
            {t('login')}
          </Link>
          <Link
            className={clsx(
              'block px-3 py-2 font-medium',
              i18n.resolvedLanguage === 'en' ? 'capitalize' : 'first-letter:capitalize'
            )}
            to="/auth/create-account"
          >
            {t('createAccount')}
          </Link>
        </nav>
      </div>
    </header>
  );
};
