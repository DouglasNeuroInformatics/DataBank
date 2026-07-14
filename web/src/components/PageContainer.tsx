import { cn } from '@douglasneuroinformatics/libui/utils';

/**
 * Sets the content width for a page. Every route should be wrapped in this so that
 * headings, forms, and lists line up consistently across the app.
 */
export const PageContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  width?: 'form' | 'wide';
}> = ({ children, className, width = 'wide' }) => {
  return <div className={cn('w-full', width === 'form' && 'mx-auto max-w-2xl', className)}>{children}</div>;
};
