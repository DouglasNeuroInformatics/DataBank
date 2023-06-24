import { useMemo } from 'react';

import { FolderArrowDownIcon, FolderMinusIcon, FolderPlusIcon, HomeIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import { DesktopSidebar } from './DesktopSidebar';
import { MobileNavbar } from './MobileNavbar';
import { NavItem } from './types';

export const Layout = () => {
  const { t, i18n } = useTranslation();

  const navigation: NavItem[] = useMemo(
    () => [
      {
        label: t('dashboard'),
        href: '/portal/dashboard',
        icon: HomeIcon
      },
      {
        label: t('createDataset'),
        href: '/portal/create',
        icon: FolderPlusIcon
      },
      {
        label: t('manageDatasets'),
        href: '/portal/manage',
        icon: FolderMinusIcon
      },
      {
        label: t('sharedDatasets'),
        href: '/portal/shared',
        icon: FolderArrowDownIcon
      }
    ],
    [i18n.resolvedLanguage]
  );

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <DesktopSidebar navigation={navigation} />
      <MobileNavbar navigation={navigation} />
      <main className="h-full w-full flex-1 overflow-hidden">
        <div className="mx-auto h-full w-full max-w-screen-2xl overflow-auto px-3 pb-3 md:px-6 xl:px-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
