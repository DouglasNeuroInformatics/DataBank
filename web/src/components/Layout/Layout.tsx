import { useMemo } from 'react';

import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { CircleStackIcon, ClipboardDocumentListIcon, HomeIcon } from '@heroicons/react/24/outline';
import { Outlet } from 'react-router-dom';

import { DesktopSidebar } from './DesktopSidebar';
import { MobileNavbar } from './MobileNavbar';
import { type NavItem } from './types';

export const Layout = () => {
  const { t } = useTranslation('common');
  const languageResolved = useTranslation('common').resolvedLanguage;
  const navigation: NavItem[] = useMemo(
    () => [
      {
        href: '/portal/dashboard',
        icon: HomeIcon,
        label: t('dashboard')
      },
      {
        href: '/portal/datasets',
        icon: CircleStackIcon,
        label: t('viewDatasets')
      },
      {
        href: '/portal/projects',
        icon: ClipboardDocumentListIcon,
        label: t('viewProjects')
      }
    ],
    [languageResolved]
  );

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <DesktopSidebar isLogIn={true} navigation={navigation} />
      <MobileNavbar isLogIn={true} navigation={navigation} />
      <main className="h-full w-full flex-1 overflow-hidden">
        <div className="mx-auto h-full w-full max-w-screen-2xl overflow-auto px-3 pb-3 sm:px-6 md:px-12 xl:px-24">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
