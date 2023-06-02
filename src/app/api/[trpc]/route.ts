import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { createContext } from '@/server/context';
import { appRouter } from '@/server/routers/_app';

// this is the server RPC API handler
const handler = (request: Request) => {
  console.log(`incoming request ${request.url}`);
  return fetchRequestHandler({
    endpoint: '/api',
    req: request,
    router: appRouter,
    createContext,
    onError: (opts) => {
      console.log(opts.error);
    }
  });
};

export { handler as GET, handler as POST };
