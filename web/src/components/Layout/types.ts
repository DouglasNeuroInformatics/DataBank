import type React from 'react';

export type NavItem = {
  href: string;
  icon: React.ComponentType<Omit<React.SVGProps<SVGElement>, 'ref'>>;
  label: string;
};
