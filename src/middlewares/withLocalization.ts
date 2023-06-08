import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { type NextFetchEvent, type NextRequest, NextResponse } from 'next/server';

import { type MiddlewareFactory } from './types';

import { i18n } from '@/i18n';

const STATIC_FILE_EXTENSIONS = ['jpg', 'png', 'svg'];

function getLocale(req: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  req.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locales = [...i18n.locales];
  return matchLocale(languages, locales, i18n.defaultLocale);
}

/** Redirect requests without a locale (e.g., `/home`) to the appropriate locale (e.g., `/en/home`) */
export const withLocalization: MiddlewareFactory = (next) => {
  return async (req: NextRequest, _next: NextFetchEvent) => {
    const pathname = req.nextUrl.pathname;

    // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
    for (const extension of STATIC_FILE_EXTENSIONS) {
      if (pathname.endsWith(`.${extension}`)) {
        return;
      }
    }

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = i18n.locales.every(
      (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
      const locale = getLocale(req);

      // See if this will ever happen
      if (!locale) {
        throw new Error();
      }

      // e.g. incoming request is /products
      // The new URL is now /en-US/products
      return NextResponse.redirect(new URL(`/${locale}/${pathname}`, req.url));
    }
    return next(req, _next);
  };
};
