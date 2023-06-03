import { type NextFetchEvent, type NextRequest, NextResponse } from 'next/server';

import { type MiddlewareFactory } from './types';

export const withAuth: MiddlewareFactory = (next) => {
  return async (req: NextRequest, _next: NextFetchEvent) => {
    const accessToken = req.cookies.get('access_token');
    const pathname = req.nextUrl.pathname;
    // assumes this is invoked after `withLocalization`
    const locale = req.nextUrl.pathname.split('/')[1];
    if (pathname.endsWith('/auth/login') && accessToken?.value) {
      return NextResponse.redirect(new URL(`/${locale}/portal`, req.url));
    }
    return next(req, _next);
  };
};
