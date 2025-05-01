import { DropdownMenu } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useNavigate } from '@tanstack/react-router';
import { LogOutIcon, SettingsIcon } from 'lucide-react';

import { useAuthStore } from '@/stores/auth-store';

export const UserDropup = () => {
  const auth = useAuthStore();
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <UserCircleIcon className="m-2 mb-4 h-8 w-8" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        align="start"
        className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-lg"
        side="top"
        sideOffset={4}
      >
        <DropdownMenu.Group>
          <DropdownMenu.Item
            className="gap-2 hover:bg-slate-700 hover:text-slate-100 focus:bg-slate-700 focus:text-slate-100 focus:ring-0"
            onClick={() => {
              void navigate({ to: '/portal/user' });
            }}
          >
            <SettingsIcon />
            {t('preferences')}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="gap-2 hover:bg-slate-700 hover:text-slate-100 focus:bg-slate-700 focus:text-slate-100 focus:ring-0"
            onClick={() => {
              auth.logout();
              void navigate({ to: '/' });
            }}
          >
            <LogOutIcon />
            {t('logout')}
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
