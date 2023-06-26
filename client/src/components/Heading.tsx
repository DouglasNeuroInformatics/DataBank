import { twMerge } from 'tailwind-merge';

export interface HeadingProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  border?: boolean;
}

export const Heading = ({ title, subtitle, children, border = true }: HeadingProps) => {
  return (
    <div
      className={twMerge(
        'mb-3 flex flex-col gap-5 border-slate-300 py-5 dark:border-slate-600 sm:flex-row sm:items-center sm:justify-between',
        border && 'border-b'
      )}
    >
      <div>
        <h3 className="whitespace-nowrap text-xl font-semibold">{title}</h3>
        {subtitle && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
};
