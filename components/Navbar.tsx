import React from 'react';

import Link from 'next/link';

import { Branding } from './Branding';
import { LanguageSwitcher } from './LanguageSwitcher';

type NavLink = {
  kind?: 'link';
  href: string;
  label: string;
};

type NavButton = {
  kind: 'btn';
  label: string;
  onClick: () => void;
};

export interface NavbarProps {
  /** The title to display on the top of the sidebar */
  title?: string;

  /** An array defining all pages in the application */
  items: Array<NavLink | NavButton>;
}

export const Navbar = ({ title, items }: NavbarProps) => {
  return (
    <header className="flex">
      <Branding title={title} />
      <nav className="flex flex-grow items-center justify-end gap-2">
        {items.map((item, i) =>
          item.kind === 'btn' ? (
            <button className="group p-2 font-medium transition duration-300" key={i} onClick={item.onClick}>
              {item.label}
              <span className="block h-0.5 max-w-0 translate-y-1 bg-slate-900 transition-all duration-500 group-hover:max-w-full" />
            </button>
          ) : (
            <Link className="p-2 font-medium" href={item.href} key={item.href}>
              {item.label}
            </Link>
          )
        )}
        <LanguageSwitcher />
      </nav>
    </header>
  );
};
