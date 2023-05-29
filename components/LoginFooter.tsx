'use client';

import React from 'react';

import { useClientTranslations } from '@/hooks/useClientTranslations';
import { usePathname } from 'next/navigation';

import { Locale } from '@/i18n-config';
import { useRedirectedPathname } from '@/hooks/useRedirectedPathname';
import Link from 'next/link';

const CURRENT_YEAR = new Date().getFullYear();

export const LoginFooter = () => {
  const t = useClientTranslations();
  const pathname = usePathname();
  const redirectedPathName = useRedirectedPathname();

  const resolvedLanguage = pathname.split('/')[1] as Locale;
  const altLanguage = resolvedLanguage === 'en' ? 'fr' : 'en';

  return (
    <div className="mt-3 flex flex-col text-center text-sm">
      <div className="flex justify-center gap-1">
        <Link href={redirectedPathName(altLanguage)}>{t[`languages.${altLanguage}`]}</Link>
        <span>·</span>
        <Link href="#">{t.sourceCode}</Link>
      </div>
      <span>
        &copy; {CURRENT_YEAR} {t['meta.organization']}
      </span>
    </div>
  );
};
