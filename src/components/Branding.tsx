'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { clsx } from 'clsx';

import { useLocale } from '@/hooks/useLocale';

export interface BrandingProps {
  /** Classes to be applied to the `Link` element */
  className?: string;

  /** The title to display next to the logo. If not defined, then no title will be displayed */
  title?: string;
}

/** Link to the landing page with the platform name and logo */
export const Branding = ({ className, title }: BrandingProps) => {
  const locale = useLocale();
  return (
    <Link className={clsx('flex items-center', className)} href={`/${locale}`}>
      <Image alt="logo" className="dark:brightness-150" height={64} src="/logo.png" width={64} />
      {title && (
        <span className="whitespace-nowrap font-semibold lg:text-lg" style={{ maxWidth: '7.5em' }}>
          {title}
        </span>
      )}
    </Link>
  );
};
