import { Heading, Separator } from '@douglasneuroinformatics/libui/components';

/**
 * Heading for a section nested within a page, one level below `PageHeading`.
 */
export const SectionHeading: React.FC<{
  actions?: React.ReactNode;
  children: string;
  description?: null | string;
}> = ({ actions, children, description }) => {
  return (
    <div className="flex flex-col gap-3 pb-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Heading variant="h4">{children}</Heading>
          {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      <Separator />
    </div>
  );
};
