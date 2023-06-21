import { ArrowDownOnSquareIcon, ArrowUpOnSquareIcon, HomeIcon } from '@heroicons/react/24/outline';
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
    label: 'Editor',
    href: '/portal/editor',
    icon: ArrowUpOnSquareIcon
  },
  {
    label: 'Shared',
    href: '/portal/shared',
    icon: ArrowDownOnSquareIcon
  }
];

export const Layout = () => {
  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <DesktopSidebar navigation={navigation} />
      <MobileNavbar navigation={navigation} />
      <main className="container flex-grow">
        <Outlet />
      </main>
    </div>
  );
};
