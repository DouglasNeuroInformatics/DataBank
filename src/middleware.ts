import { match as matchLocale } from '@formatjs/intl-localematcher';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import Negotiator from 'negotiator';
import { type NextRequest, NextResponse } from 'next/server';

import { Locale, i18n } from '@/i18n';

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

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
  for (const extension of STATIC_FILE_EXTENSIONS) {
    if (pathname.endsWith(`.${extension}`)) {
      return res;
    }
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale (e.g., /products -> /en/products)
  if (pathnameIsMissingLocale) {
    const locale = getLocale(req) || i18n.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/${pathname}`, req.url));
  }

  // AUTH
  const locale = pathname.split('/')[1];

  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();
  
  const auth = await supabase.auth.getUser();
  const isLoggedIn = Boolean(auth.data.user);

  // public routes
  if (pathname === `/${locale}`) {
    return res;
  } else if (pathname.startsWith(`/${locale}/auth`)) {
    return isLoggedIn ? NextResponse.redirect(new URL(`/${locale}/portal`, req.url)) : res;
  }

  // protected routes
  if (isLoggedIn) {
    return res;
  }
  return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url));
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
