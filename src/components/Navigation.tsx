import React from 'react';

import Link from 'next/link';

export interface NavLink {
  href: string;
  label: string;
}

export interface NavigationProps {
  className?: string;
  links: NavLink[];
}

export const Navigation = ({ className, links }: NavigationProps) => {
  return (
    <nav className={className}>
      {links.map((link) => (
        <Link href={link.href} key={link.href + link.label}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
};
