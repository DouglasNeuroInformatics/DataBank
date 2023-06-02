// middleware/withLogging.ts
import { type NextFetchEvent, type NextRequest } from 'next/server';

import { type MiddlewareFactory } from './types';

export const withLogging: MiddlewareFactory = (next) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    console.log('Log some data here', request.nextUrl.pathname);
    return next(request, _next);
  };
};
