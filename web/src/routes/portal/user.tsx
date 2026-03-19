import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute } from '@tanstack/react-router';
import { MailIcon, UserIcon } from 'lucide-react';

import { PageHeading } from '@/components/PageHeading';
import { useAppStore } from '@/store';

const RouteComponent = () => {
  const currentUser = useAppStore((s) => s.auth.ctx.currentUser);
  const { t } = useTranslation('common');

  let fullName: string;
  if (currentUser?.firstName && currentUser.lastName) {
    fullName = `${currentUser.firstName} ${currentUser.lastName}`;
  } else if (currentUser?.firstName) {
    fullName = currentUser.firstName;
  } else {
    fullName = 'Unnamed User';
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <PageHeading>{t('preferences')}</PageHeading>
      <div className="flex items-center gap-4">
        <div className="bg-muted flex size-14 items-center justify-center rounded-full">
          <UserIcon className="text-muted-foreground size-8!" />
        </div>
        <div>
          <p className="text-lg font-medium">{fullName}</p>
          <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <MailIcon className="size-3.5" />
            {currentUser?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/portal/user')({
  component: RouteComponent
});
