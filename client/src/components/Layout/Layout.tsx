import { FolderArrowDownIcon, HomeIcon, TableCellsIcon } from '@heroicons/react/24/outline';
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
    label: 'Manage',
    href: '/portal/manage',
    icon: TableCellsIcon
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
      <main className="container mb-3 flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};
