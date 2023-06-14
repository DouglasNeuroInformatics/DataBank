import React from 'react';

import { HomeIcon } from '@heroicons/react/24/outline';

import { DesktopSidebar } from './DesktopSidebar';
import { MobileNavbar } from './MobileNavbar';

const navigation = [
  {
    label: 'Home',
    href: '#',
    icon: <HomeIcon />
  }
];

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <DesktopSidebar navigation={navigation} />
      <MobileNavbar navigation={navigation} />
      <main className="container flex-grow border">{children}</main>
    </div>
  );
};
