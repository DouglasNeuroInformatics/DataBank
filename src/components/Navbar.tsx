'use client';

import React from 'react';

import Link from 'next/link';

import { Branding } from './Branding';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

interface NavLink {
  href: string;
  label: string;
}

interface NavbarProps {
  links: NavLink[];
}

export const Navbar = ({ links }: NavbarProps) => {
  return (
    <header className="container flex w-screen items-center justify-between p-2">
      <Branding />
      <div className="flex items-center gap-5">
        <nav className="flex gap-5">
          {links.map((link) => (
            <Link href={link.href} key={link.href + link.label}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="h-6 border-l" />
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </header>
  );
};
