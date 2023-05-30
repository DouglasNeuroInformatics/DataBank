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
    <Link className="flex items-center" href="/">
      <Image alt="logo" height={64} src={logo} width={64} />
      {title && (
        <span className="whitespace-nowrap font-semibold lg:text-lg" style={{ maxWidth: '7.5em' }}>
          {title}
        </span>
      )}
    </Link>
  );
};
