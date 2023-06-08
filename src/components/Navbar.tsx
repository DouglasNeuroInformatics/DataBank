'use client';

import React from 'react';

import Link from 'next/link';

import { Branding } from './Branding';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';

export interface NavLink {
  href: string;
  label: string;
  icon?: React.ReactElement;
}

interface NavbarProps {
  links: NavLink[];
}

export const Navbar = ({ links }: NavbarProps) => {
  return (
    <header className="container flex w-screen items-center justify-between border-b p-2">
      <Branding />
      <div className="flex items-center gap-5">
        <nav className="flex gap-5">
          {links.map((link) => (
            <Link className="flex items-center gap-2 p-2 [&>svg]:h-4" href={link.href} key={link.href + link.label}>
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="h-6 border-l" />
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </header>
  );
};
