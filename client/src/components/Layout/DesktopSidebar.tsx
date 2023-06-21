import { UserIcon } from '@heroicons/react/24/solid';
import { NavLink } from 'react-router-dom';

import { type NavItem } from './types';

import { Logo } from '@/components';

export interface DesktopSidebarProps {
  navigation: NavItem[];
}

export const DesktopSidebar = ({ navigation }: DesktopSidebarProps) => {
  return (
    <div className="hidden h-full w-20 flex-col bg-slate-900 p-2 dark:bg-slate-800 lg:flex">
      <div className="flex-grow">
        <div className="flex items-center justify-center">
          <Logo className="h-12 w-12" />
        </div>
        <hr className="my-3" />
        <nav aria-label="sidebar" className="flex flex-col items-center space-y-3">
          {navigation.map((item) => (
            <NavLink className="flex items-center rounded-lg p-4" key={item.href} to={item.href}>
              <item.icon className="h-6 w-6" />
            </NavLink>
          ))}
        </nav>
      </div>
      <div>
        <UserIcon height={32} width={32} />
      </div>
    </div>
  );

  // return (
  //   <div className="hidden h-full w-20 flex-col bg-slate-900 p-2 lg:flex">
  //     <div className="flex-1">
  //       <div className="flex items-center justify-center p-2">
  //         <Logo className="h-12 w-12" />
  //       </div>
  //       <hr className="my-3" />
  //     </div>
  //     <div className="flex flex-shrink-0 pb-5">
  //       <a className="w-full flex-shrink-0" href="#">
  //         <div className="flex items-center justify-center">
  //           <div className="rounded-full border border-slate-600 p-2 text-slate-300">
  //             <UserIcon height={32} width={32} />
  //           </div>
  //         </div>
  //       </a>
  //     </div>
  //   </div>
  // );
};
