import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const ManagePage = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <MagnifyingGlassIcon className="text-slate-700 dark:text-slate-200" height={64} width={64} />
        <h3 className="mt-2 font-medium text-slate-700 dark:text-slate-200">No Dataset Selected</h3>
        <p className="text-sm text-slate-500">Please select a dataset, or add a new dataset using the button above</p>
      </div>
    </div>
  );
};
