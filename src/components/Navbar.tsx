'use client';

import { Branding } from './Branding';
import { LanguageToggle } from './LanguageToggle';
import { Navigation, type NavLink } from './Navigation';
import { ThemeToggle } from './ThemeToggle';

interface NavbarProps {
  links: NavLink[];
}

export const Navbar = ({ links }: NavbarProps) => {
  return (
    <header className="container flex w-screen items-center justify-between border-b p-2">
      <Branding />
      <div className="flex items-center gap-5">
        <Navigation className="flex gap-5" links={links} />
        <div className="h-6 border-l" />
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </header>
  );
};
