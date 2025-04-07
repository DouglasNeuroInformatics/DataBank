import { Heading, Separator } from '@douglasneuroinformatics/libui/components';

export const PageHeading: React.FC<{ children: string }> = ({ children }) => {
  return (
    <div className="flex flex-col gap-8 py-8">
      <Heading className="text-center" variant="h1">
        {children}
      </Heading>
      <Separator />
    </div>
  );
};
