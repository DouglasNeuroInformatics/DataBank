import React from 'react';

import { Branding } from './Branding';
import { type NavLink, Navigation } from './Navigation';
import { UserDropup } from './UserDropup';

export interface SidebarProps {
  title: string;
  links: NavLink[];
}

export const Sidebar = ({ links, title }: SidebarProps) => {
  return (
    <div className="flex h-screen w-80 flex-col bg-slate-900 p-3 text-slate-300">
      <Branding className="p-1 md:p-2" title={title} />
      <hr className="my-1" />
      <Navigation links={links} />
      <hr className="my-1 mt-auto" />
      <div className="flex items-center">
        <UserDropup />
      </div>
    </div>
  );
};
