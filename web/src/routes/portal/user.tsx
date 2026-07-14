import { Card } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute } from '@tanstack/react-router';
import { MailIcon, UserIcon } from 'lucide-react';

import { PageContainer } from '@/components/PageContainer';
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
    fullName = t({ en: 'Unnamed User', fr: 'Utilisateur sans nom' });
  }

  return (
    <PageContainer width="form">
      <PageHeading>{t('preferences')}</PageHeading>
      <Card>
        <Card.Content className="flex items-center gap-4 pt-6">
          <div className="bg-muted flex size-14 shrink-0 items-center justify-center rounded-full">
            <UserIcon className="text-muted-foreground size-7!" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-medium">{fullName}</p>
            <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <MailIcon className="size-3.5 shrink-0" />
              <span className="truncate">{currentUser?.email}</span>
            </p>
          </div>
        </Card.Content>
      </Card>
    </PageContainer>
  );
};

export const Route = createFileRoute('/portal/user')({
  component: RouteComponent
});
