'use client';

import React from 'react';

import Link, { type LinkProps } from 'next/link';

import { useLocale } from '@/hooks/useLocale';

type LocalizedLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps & {
    children?: React.ReactNode;
  };

export const LocalizedLink = ({ children, href, ...props }: LocalizedLinkProps) => {
  const locale = useLocale();
  return (
    <Link href={`/${locale + href}`} {...props}>
      {children}
    </Link>
  );
};
