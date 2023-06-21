import type React from 'react';

export type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<Omit<React.SVGProps<SVGElement>, 'ref'>>;
};
