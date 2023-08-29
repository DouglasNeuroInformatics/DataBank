import { clsx } from 'clsx';

export type SuspenseFallbackProps = {
  className?: string;
}

export const SuspenseFallback = ({ className }: SuspenseFallbackProps) => (
  <div className={clsx('flex h-full w-full items-center justify-center', className)}>
    <span className="spinner"></span>
  </div>
);
