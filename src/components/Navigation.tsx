import React from 'react';

import Link from 'next/link';

export interface NavLink {
  href: string;
  label: string;
  icon?: React.ReactElement;
}

export interface NavigationProps {
  className?: string;
  links: NavLink[];
}

export const Navigation = ({ className, links }: NavigationProps) => {
  return (
    <nav className={className}>
      {links.map((link) => (
        <Link className="flex items-center p-2 [&>svg]:h-4 gap-2" href={link.href} key={link.href + link.label}>
          {link.icon}
          {link.label}
        </Link>
      ))}
    </nav>
  );
};
