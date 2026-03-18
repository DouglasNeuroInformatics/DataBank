import { useEffect, useMemo, useState } from 'react';

import {
  Button,
  DropdownMenu,
  LanguageToggle,
  Separator,
  Sheet,
  ThemeToggle,
  Tooltip
} from '@douglasneuroinformatics/libui/components';
import { useMediaQuery, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { cn } from '@douglasneuroinformatics/libui/utils';
import { createFileRoute, Link, Outlet, redirect, useLocation } from '@tanstack/react-router';
import {
  CircleUserRoundIcon,
  DatabaseIcon,
  FolderOpenIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  SettingsIcon
} from 'lucide-react';

import { Logo } from '@/components/Logo';
import { useAppStore } from '@/store';

type NavItem = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

const UserDropup = () => {
  const logout = useAppStore((s) => s.auth.act.logout);
  const { t } = useTranslation('common');

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button className="p-2.5 hover:bg-slate-200 dark:hover:bg-slate-700" size="icon" type="button" variant="ghost">
          <CircleUserRoundIcon className="size-5!" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="start" className="w-48" side="top" sideOffset={4}>
        <DropdownMenu.Group>
          <DropdownMenu.Item asChild className="gap-2">
            <Link to="/portal/user">
              <SettingsIcon className="size-4" />
              {t('preferences')}
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild className="gap-2">
            <Link to="/" onClick={() => logout()}>
              <LogOutIcon className="size-4" />
              {t('logout')}
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};

const DesktopSidebar = ({ navigation }: { navigation: NavItem[] }) => {
  const navigate = Route.useNavigate();
  const location = useLocation();

  return (
    <div className="bg-card w-18 hidden h-full flex-col items-center border-r py-4 lg:flex">
      <Link className="mb-4 flex items-center justify-center" to="/">
        <Logo className="h-auto w-11" />
      </Link>
      <Separator className="mx-auto mb-4 w-8" />
      <nav aria-label="sidebar" className="flex flex-1 flex-col items-center gap-1">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Tooltip key={item.href}>
              <Tooltip.Trigger
                className={cn(
                  'rounded-md p-2.5 hover:bg-slate-200 dark:hover:bg-slate-700',
                  isActive && 'bg-slate-200 dark:bg-slate-700'
                )}
                size="icon"
                variant="ghost"
                onClick={() => void navigate({ to: item.href })}
              >
                <item.icon className="size-5!" />
              </Tooltip.Trigger>
              <Tooltip.Content side="right">
                <p>{item.label}</p>
              </Tooltip.Content>
            </Tooltip>
          );
        })}
      </nav>
      <div className="flex flex-col items-center gap-1">
        <ThemeToggle className="[&>svg]:size-5! p-2.5 hover:bg-slate-200 dark:hover:bg-slate-700" variant="ghost" />
        <LanguageToggle
          contentClassName="mb-1 translate-y-1"
          options={{ en: 'English', fr: 'Français' }}
          triggerClassName="[&>svg]:size-5! p-2.5 hover:bg-slate-200 dark:hover:bg-slate-700"
          variant="ghost"
        />
        <Separator className="mx-auto my-2 w-8" />
        <UserDropup />
      </div>
    </div>
  );
};

const MobileNavbar = ({ navigation }: { navigation: NavItem[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const location = useLocation();

  useEffect(() => {
    if (isDesktop) {
      setIsOpen(false);
    }
  }, [isDesktop]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-card flex w-full items-center justify-between border-b px-4 py-3 lg:hidden">
        <Link to="/">
          <Logo className="h-auto w-11" />
        </Link>
        <Sheet.Trigger>
          <MenuIcon className="text-muted-foreground hover:text-foreground size-7!" />
        </Sheet.Trigger>
      </div>
      <Sheet.Content className="flex h-full flex-col gap-0">
        <div className="flex items-center gap-3">
          <Logo className="h-auto w-11" />
        </div>
        <Separator className="my-4" />
        <nav className="flex grow flex-col gap-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                  isActive ? 'bg-slate-200 dark:bg-slate-700' : ''
                )}
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <Separator className="my-4" />
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <LanguageToggle
              options={{ en: 'English', fr: 'Français' }}
              triggerClassName="[&>svg]:size-4!"
              variant="outline"
            />
            <ThemeToggle className="[&>svg]:size-4!" variant="outline" />
          </div>
          <UserDropup />
        </div>
      </Sheet.Content>
    </Sheet>
  );
};

const RouteComponent = () => {
  const { t } = useTranslation('common');

  const navigation: NavItem[] = useMemo(
    () => [
      {
        href: '/portal/dashboard',
        icon: LayoutDashboardIcon,
        label: t('dashboard')
      },
      {
        href: '/portal/datasets',
        icon: DatabaseIcon,
        label: t('viewDatasets')
      },
      {
        href: '/portal/projects',
        icon: FolderOpenIcon,
        label: t('viewProjects')
      }
    ],
    [t]
  );

  return (
    <div className="flex h-screen flex-col overflow-hidden lg:flex-row">
      <DesktopSidebar navigation={navigation} />
      <MobileNavbar navigation={navigation} />
      <main className="flex grow flex-col overflow-hidden">
        <div className="overflow-auto pb-6">
          <div className="container">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export const Route = createFileRoute('/portal')({
  beforeLoad: () => {
    const accessToken = useAppStore.getState().auth.ctx.accessToken;
    if (!accessToken) {
      throw redirect({ to: '/auth/login' });
    }
  },
  component: RouteComponent
});
