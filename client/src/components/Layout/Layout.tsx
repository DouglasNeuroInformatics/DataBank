import { HomeIcon } from '@heroicons/react/24/outline';
import { Outlet } from 'react-router-dom';

import { DesktopSidebar } from './DesktopSidebar';
import { MobileNavbar } from './MobileNavbar';

const navigation = [
  {
    label: 'Home',
    href: '/overview',
    icon: HomeIcon
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
