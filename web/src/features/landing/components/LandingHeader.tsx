import { useState } from 'react';

import { LanguageToggle, ThemeToggle } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { cn } from '@douglasneuroinformatics/libui/utils';
import { Bars3Icon } from '@heroicons/react/24/solid';
import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';

import { Logo } from '@/components/Logo';

export const LandingHeader = () => {
  const { t } = useTranslation('common');
  const languageResolved = useTranslation('common').resolvedLanguage;

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <header className="text-muted-foreground bg-white shadow-sm dark:bg-slate-800">
      <motion.div
        animate={{ opacity: 1 }}
        className="bg-inherit"
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container flex flex-wrap items-center bg-inherit py-2">
          <Link className="flex items-center justify-center" to="/">
            <Logo className="m-1 mr-10 hidden h-10 w-auto md:block" />
          </Link>
          <button
            className="m-2 md:hidden"
            type="button"
            onClick={() => {
              setIsMobileNavOpen(!isMobileNavOpen);
            }}
          >
            <Bars3Icon height={32} width={32} />
          </button>
          <div className="flex grow justify-end gap-3 bg-inherit md:order-last">
            <ThemeToggle className="p-2" />
            <LanguageToggle align="end" options={{ en: 'English', fr: 'Français' }} triggerClassName="p-2" />
          </div>
          <nav
            className={cn(
              'flex max-h-0 w-full flex-col overflow-hidden transition-[max-height] duration-300 md:max-h-fit md:w-auto md:flex-row md:items-center md:space-x-6',
              {
                'max-h-40': isMobileNavOpen
              }
            )}
          >
            <Link
              className={cn(
                'hover:text-foreground block p-3 font-medium',

                languageResolved === 'en' ? 'capitalize' : 'first-letter:capitalize'
              )}
              to="/auth/login"
            >
              {t('login')}
            </Link>
            <Link
              className={cn(
                'hover:text-foreground block p-3 font-medium',
                languageResolved === 'en' ? 'capitalize' : 'first-letter:capitalize'
              )}
              to="/auth/create-account"
            >
              {t('createAccount')}
            </Link>
            <Link
              className={cn(
                'hover:text-foreground block p-3 font-medium',
                languageResolved === 'en' ? 'capitalize' : 'first-letter:capitalize'
              )}
              to="/public/datasets"
            >
              {t('viewPublicDatasets')}
            </Link>
          </nav>
        </div>
      </motion.div>
    </header>
  );
};
