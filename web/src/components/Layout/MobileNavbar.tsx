import { useState } from 'react';

import { ThemeToggle } from '@douglasneuroinformatics/ui';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Logo } from '@/components';

import { Slider } from '../Slider';
import { type NavItem } from './types';

export type MobileNavbarProps = {
  navigation: NavItem[];
};

export const MobileNavbar = ({ navigation }: MobileNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();

  return (
    <>
      <div className="flex w-full items-center justify-between bg-slate-900 p-4 dark:bg-slate-800 lg:hidden">
        <Link to="/">
          <Logo className="h-12 w-12 fill-slate-100" />
        </Link>
        <button
          className="text-slate-300 hover:text-slate-200"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <Bars3Icon height={32} width={32} />
        </button>
      </div>
      <Slider isOpen={isOpen} setIsOpen={setIsOpen} title={<Logo className="h-12 w-12" />}>
        <div className="flex flex-col h-full">
          <nav className="flex-grow">
            {navigation.map((item) => (
              <Link
                className="group flex items-center rounded-md p-2 text-base font-medium text-slate-600 dark:text-slate-300 dark:hover:text-slate-500 [&>svg]:h-6 [&>svg]:w-6"
                key={item.label}
                to={item.href}
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <item.icon className="h-6 w-6" />
                <span className="ml-2">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <button
              className="rounded-md p-2 font-medium hover:backdrop-brightness-95 dark:hover:backdrop-brightness-150"
              type="button"
              onClick={() => {
                void i18n.changeLanguage(i18n.resolvedLanguage === 'en' ? 'fr' : 'en');
              }}
            >
              {i18n.resolvedLanguage === 'en' ? 'Français' : 'English'}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </Slider>
    </>
  );
};
