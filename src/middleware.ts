import { NextResponse } from 'next/server';

import { withLocalization } from './middlewares/withLocalization';

export const middleware = withLocalization(() => {
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
