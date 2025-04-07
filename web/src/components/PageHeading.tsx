import { Heading, Separator } from '@douglasneuroinformatics/libui/components';
import { cn } from '@douglasneuroinformatics/libui/utils';

export const PageHeading: React.FC<{ children: string; className?: string }> = ({ children, className }) => {
  return (
    <div className={cn('flex flex-col gap-8 py-8', className)}>
      <Heading className="text-center" variant="h1">
        {children}
      </Heading>
      <Separator />
    </div>
  );
};
