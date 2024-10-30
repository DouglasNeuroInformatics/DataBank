import { cn } from '@douglasneuroinformatics/libui/utils';

export type HeadingProps = {
  border?: boolean;
  children?: React.ReactNode;
  subtitle?: string;
  title: string;
};

export const Heading = ({ border = true, children, subtitle, title }: HeadingProps) => {
  return (
    <div
      className={cn(
        'mb-3 flex flex-col gap-5 border-slate-300 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-600',
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
