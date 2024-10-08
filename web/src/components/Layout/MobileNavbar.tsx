import { useState } from 'react';

import { LanguageToggle, ThemeToggle } from '@douglasneuroinformatics/libui/components';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

import { Logo } from '@/components';

import { Slider } from '../Slider';
import { type NavItem } from './types';
import { UserDropup } from './UserDropup';

export type MobileNavbarProps = {
  isLogIn: boolean;
  navigation: NavItem[];
};

export const MobileNavbar = ({ isLogIn, navigation }: MobileNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex w-full items-center justify-between bg-slate-900 p-4 lg:hidden dark:bg-slate-800">
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
        <div className="flex h-full flex-col">
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
          <div className="flex space-x-3 text-slate-600 dark:text-slate-300">
            <ThemeToggle className="hover:backdrop-brightness-150" />
            <LanguageToggle options={{ en: 'English', fr: 'Français' }} />
            {isLogIn && <UserDropup />}
          </div>
        </div>
      </Slider>
    </>
  );
};
