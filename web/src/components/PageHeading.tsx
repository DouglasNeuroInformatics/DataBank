import { Heading, Separator } from '@douglasneuroinformatics/libui/components';
import { cn } from '@douglasneuroinformatics/libui/utils';

export const PageHeading: React.FC<{
  actions?: React.ReactNode;
  centered?: boolean;
  children: string;
  className?: string;
  description?: null | string;
}> = ({ actions, centered, children, className, description }) => {
  return (
    <div className={cn('flex flex-col gap-2 py-6', className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className={cn('w-full', centered && 'text-center')}>
          <Heading variant="h2">{children}</Heading>
          {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      <Separator className="mt-2" />
    </div>
  );
};
