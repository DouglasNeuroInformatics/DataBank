import { ThemeToggle } from '@douglasneuroinformatics/ui';
import { Link, NavLink } from 'react-router-dom';

import { Logo } from '@/components';

import { UserDropup } from './UserDropup';
import { type NavItem } from './types';

export type DesktopSidebarProps = {
  navigation: NavItem[];
};

export const DesktopSidebar = ({ navigation }: DesktopSidebarProps) => {
  return (
    <div className="hidden h-full w-20 flex-col bg-slate-800 p-2 text-slate-100 lg:flex">
      <div className="flex-grow">
        <Link className="flex items-center justify-center" to="/">
          <Logo className="h-12 w-12 fill-slate-100" />
        </Link>
        <hr className="my-3" />
        <nav aria-label="sidebar" className="flex flex-col items-center space-y-3">
          {navigation.map((item) => (
            <NavLink
              className="flex items-center rounded-lg p-4 hover:backdrop-brightness-150"
              key={item.href}
              to={item.href}
            >
              <item.icon className="h-6 w-6" />
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex flex-shrink flex-col items-center space-y-3">
        <ThemeToggle className="hover:backdrop-brightness-150" />
        <UserDropup />
      </div>
    </div>
  );
};
