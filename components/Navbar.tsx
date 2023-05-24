import React from 'react';

import Link from 'next/link';

import { Branding } from './Branding';

export interface NavbarProps {
  /** The title to display on the top of the sidebar */
  title?: string;

  /** An array defining all pages in the application */
  links: Array<{
    href: string;
    label: string;
  }>;
}

export const Navbar = ({ title, links }: NavbarProps) => {
  return (
    <header className="flex">
      <Branding title={title} />
      <nav className="flex-grow flex justify-end items-center">
        {links.map((link) => (
          <Link className="font-medium p-2" href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
};
