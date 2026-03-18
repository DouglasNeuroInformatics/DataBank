import { Button, Spinner } from '@douglasneuroinformatics/libui/components';
import { MailIcon, TrashIcon, UserCircleIcon } from 'lucide-react';

import { useUserQuery } from '@/hooks/queries/useUserQuery';

type UserInfoCardProps = {
  actionLabel: string;
  canRemove: boolean;
  onRemove: () => void;
  userId: string;
};

export const UserInfoCard = ({ actionLabel, canRemove, onRemove, userId }: UserInfoCardProps) => {
  const { data: user, isLoading } = useUserQuery(userId);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center rounded-lg border p-4">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div className="bg-muted flex size-10 items-center justify-center rounded-full">
          <UserCircleIcon className="text-muted-foreground size-6" />
        </div>
        <div>
          <p className="text-sm font-medium">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            <MailIcon className="size-3" />
            {user.email}
          </p>
        </div>
      </div>
      {canRemove && (
        <Button size="sm" variant="danger" onClick={onRemove}>
          <TrashIcon className="mr-1.5 size-3.5" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
