'use client';

import React from 'react';

import Image from 'next/image';

import { clsx } from 'clsx';

import { LocalizedLink } from './LocalizedLink';

export interface BrandingProps {
  /** Classes to be applied to the `Link` element */
  className?: string;

  /** The title to display next to the logo. If not defined, then no title will be displayed */
  title?: string;
}

/** Link to the landing page with the platform name and logo */
export const Branding = ({ className, title }: BrandingProps) => {
  return (
    <LocalizedLink className={clsx('flex items-center gap-2', className)} href={'/'}>
      <Image alt="logo" className="dark:brightness-150" height={64} src="/logo.png" width={64} />
      {title && (
        <span className="text-sm uppercase leading-tight antialiased md:text-base" style={{ maxWidth: '7.5em' }}>
          {title}
        </span>
      )}
    </LocalizedLink>
  );
};
