export interface HeadingProps {
  title: string;
  children?: React.ReactNode;
}

export const Heading = ({ title, children }: HeadingProps) => {
  return (
    <div className="mb-3 gap-5 border-b border-slate-300 py-5 sm:flex sm:items-center sm:justify-between">
      <h3 className="whitespace-nowrap text-lg font-medium">{title}</h3>
      {children}
    </div>
  );
};
