import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import logo from '@/assets/logo.png';

export interface BrandingProps {
  /** The title to display next to the logo. If not defined, then no title will be displayed */
  title?: string;
}

/** Link to the landing page with the platform name and logo */
export const Branding = ({ title }: BrandingProps) => {
  return (
    <Link className="flex items-center p-1 md:p-2" href="/">
      <Image alt="logo" className="mr-2 w-14 md:w-16" src={logo} />
      {title && (
        <span className="font-semibold lg:text-lg whitespace-nowrap" style={{ maxWidth: '7.5em' }}>
          {title}
        </span>
      )}
    </Link>
  );
};
