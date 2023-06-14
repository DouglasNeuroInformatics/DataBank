import React from 'react';

import Image from 'next/image';

import { UserIcon } from '@heroicons/react/24/solid';

import { type NavLink } from './types';

export interface DesktopSidebarProps {
  navigation: NavLink[];
}

export const DesktopSidebar = ({ navigation }: DesktopSidebarProps) => {
  return (
    <div className="hidden h-full w-20 flex-col bg-slate-900 p-2 lg:flex">
      <div className="flex-1">
        <div className="flex items-center justify-center p-2">
          <Image alt="logo" className="brightness-125" height={48} quality={100} src="/logo.png" width={48} />
        </div>
        <hr className="my-3" />
        <nav aria-label="sidebar" className="flex flex-col items-center space-y-3">
          {navigation.map((item) => (
            <a
              className="flex items-center rounded-lg p-4 text-slate-300 hover:bg-slate-800"
              href={item.href}
              key={item.href}
            >
              {item.icon}
            </a>
          ))}
        </nav>
      </div>
      <div className="flex flex-shrink-0 pb-5">
        <a className="w-full flex-shrink-0" href="#">
          <div className="flex items-center justify-center">
            <div className="rounded-full border border-slate-600 p-2 text-slate-300">
              <UserIcon height={32} width={32} />
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};
