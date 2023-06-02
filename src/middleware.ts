import { NextResponse } from 'next/server';

import { withAuth } from './middlewares/withAuth';
import { withLocalization } from './middlewares/withLocalization';

export const middleware = withLocalization(
  withAuth(() => {
    return NextResponse.next();
  })
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
