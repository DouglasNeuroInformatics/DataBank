import { useMemo } from 'react';

import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { ArrowRightEndOnRectangleIcon, HomeIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Outlet } from 'react-router-dom';

import { DesktopSidebar } from './DesktopSidebar';
import { MobileNavbar } from './MobileNavbar';
import { type NavItem } from './types';

export const PublicLayout = () => {
  const { t } = useTranslation('common');
  const languageResolved = useTranslation('common').resolvedLanguage;

  const navigation: NavItem[] = useMemo(
    () => [
      {
        href: '/',
        icon: HomeIcon,
        label: t('home')
      },
      {
        href: '/auth/login',
        icon: ArrowRightEndOnRectangleIcon,
        label: t('login')
      },
      {
        href: '/auth/create-account',
        icon: UsersIcon,
        label: t('createAccount')
      }
    ],
    [languageResolved]
  );

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <DesktopSidebar isLogIn={false} navigation={navigation} />
      <MobileNavbar isLogIn={false} navigation={navigation} />
      <main className="h-full w-full flex-1 overflow-hidden">
        <div className="mu:px-12 mx-auto h-full w-full max-w-screen-2xl overflow-auto px-3 pb-3 sm:px-6 md:px-12 xl:px-24">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
