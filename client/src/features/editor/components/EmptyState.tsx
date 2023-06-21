import { Button } from '@douglasneuroinformatics/react-components';
import { ArrowUpOnSquareIcon, PlusIcon } from '@heroicons/react/24/outline';

export const EmptyState = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <ArrowUpOnSquareIcon className="mx-auto h-12 w-12" />
      <h3 className="mt-2 text-sm font-medium">No datasets</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Get started by adding a new dataset</p>
      <div className="mt-6 flex justify-center">
        <Button icon={<PlusIcon className="h-5 w-5 stroke-2" />} iconPosition="left" label="New Dataset" size="sm" />
      </div>
    </div>
  );
};
