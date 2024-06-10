import { useMemo } from 'react';
import React from 'react';

import { ArrowRightEndOnRectangleIcon, HomeIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import { DesktopSidebar } from './DesktopSidebar';
import { MobileNavbar } from './MobileNavbar';
import { type NavItem } from './types';

export const PublicLayout = () => {
  const { i18n, t } = useTranslation();

  const navigation: NavItem[] = useMemo(
    () => [
      {
        href: '/',
        icon: HomeIcon,
        label: t('Home')
      },
      {
        href: '/auth/login',
        icon: ArrowRightEndOnRectangleIcon,
        label: t('Login')
      },
      {
        href: '/auth/create-account',
        icon: UsersIcon,
        label: t('Create Account')
      }
    ],
    [i18n.resolvedLanguage]
  );

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <DesktopSidebar navigation={navigation} />
      <MobileNavbar navigation={navigation} />
      <main className="h-full w-full flex-1 overflow-hidden">
        <div className="mx-auto h-full w-full max-w-screen-2xl overflow-auto px-3 pb-3 sm:px-6 md:px-12 xl:px-24">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
