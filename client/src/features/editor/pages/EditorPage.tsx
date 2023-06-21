import { EmptyState } from '../components/EmptyState';

export const EditorPage = () => {
  return (
    <div className="grid h-full w-full grid-cols-4 gap-3">
      <div className="col-span-1 border p-2">
        <h1 className="text-lg font-medium">Your Datasets</h1>
      </div>
      <div className="col-span-3 border p-2">
        <EmptyState />
      </div>
    </div>
  );
};
