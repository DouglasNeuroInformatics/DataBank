import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import logo from '@/assets/logo.png';

export interface SidebarProps {
  /** The title to display on the top of the sidebar */
  title: string;

  /** An array defining all pages in the application */
  links: Array<{
    href: string;
    icon: React.ReactElement;
    label: string;
  }>;
}

export const Sidebar = ({ title, links }: SidebarProps) => {
  return (
    <div className="flex h-screen w-80 flex-col bg-slate-900 p-3 text-slate-300">
      <div className="flex items-center p-1 md:p-2">
        <Image alt="logo" className="mr-2 w-14 md:w-16" src={logo} />
        <span className="text-sm uppercase leading-tight antialiased md:text-base" style={{ maxWidth: '7.5em' }}>
          {title}
        </span>
      </div>
      <hr className="my-1" />
      <nav>
        {links.map((link) => (
          <Link className="flex items-center p-2 text-sm hover:bg-slate-800 md:text-base" href={link} key={link.href}>
            <div className="h-6 flex justify-center items-center [&>svg]:h-5">{link.icon}</div>
            <span className="ml-2">{link.label}</span>
          </Link>
        ))}
      </nav>
      <hr className="my-1 mt-auto" />
    </div>
  );
};
