import { FolderArrowDownIcon, FolderMinusIcon, FolderPlusIcon, HomeIcon } from '@heroicons/react/24/outline';
import { Outlet } from 'react-router-dom';

import { DesktopSidebar } from './DesktopSidebar';
import { MobileNavbar } from './MobileNavbar';
import { NavItem } from './types';

const navigation: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/portal/dashboard',
    icon: HomeIcon
  },
  {
    label: 'Create',
    href: '/portal/create',
    icon: FolderPlusIcon
  },
  {
    label: 'Manage',
    href: '/portal/manage',
    icon: FolderMinusIcon
  },
  {
    label: 'Shared',
    href: '/portal/shared',
    icon: FolderArrowDownIcon
  }
];

export const Layout = () => {
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
