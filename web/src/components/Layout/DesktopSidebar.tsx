import { LanguageToggle, ThemeToggle, Tooltip } from '@douglasneuroinformatics/libui/components';
import { Link, useNavigate } from '@tanstack/react-router';

import { Logo } from '@/components';

import { UserDropup } from './UserDropup';

import type { NavItem } from './types';

type DesktopSidebarProps = {
  isLogIn: boolean;
  navigation: NavItem[];
};

export const DesktopSidebar = ({ isLogIn, navigation }: DesktopSidebarProps) => {
  const navigate = useNavigate();
  return (
    <div className="hidden h-full w-20 flex-col bg-slate-800 p-2 text-slate-100 lg:flex">
      <div className="grow">
        <Link className="flex items-center justify-center" to="/">
          <Logo className="h-12 w-12 fill-slate-100" />
        </Link>
        <hr className="my-3" />
        <nav aria-label="sidebar" className="flex flex-col items-center space-y-3">
          {navigation.map((item) => (
            <div className="relative" key={item.href}>
              <Tooltip>
                <Tooltip.Trigger
                  className="flex h-14 w-14 items-center justify-center rounded-lg p-0 hover:bg-slate-700"
                  size="icon"
                  type="button"
                  variant="ghost"
                  onClick={() => void navigate({ to: item.href })}
                >
                  <item.icon className="h-6 w-6 stroke-slate-100" />
                </Tooltip.Trigger>
                <Tooltip.Content side="right">
                  <p>{item.label}</p>
                </Tooltip.Content>
              </Tooltip>
            </div>
          ))}
        </nav>
      </div>
      <div className="flex shrink flex-col items-center space-y-3">
        <ThemeToggle className="hover:text-slate-30 border border-slate-700 hover:bg-slate-700" variant="ghost" />
        <LanguageToggle
          contentClassName="bg-slate-800 border-slate-700 text-slate-300"
          itemClassName="bg-slate-800 hover:bg-slate-700 focus:bg-slate-700 focus:text-slate-100"
          options={{
            en: 'English',
            fr: 'Français'
          }}
          triggerClassName="border border-slate-700 hover:bg-slate-700 hover:text-slate-300 focus-visible:ring-0"
          variant="ghost"
        />
        {isLogIn && <UserDropup />}
      </div>
    </div>
  );
};
