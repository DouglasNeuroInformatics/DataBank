import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export function createContext(opts?: FetchCreateContextFnOptions) {
  return {
    headers: opts && Object.fromEntries(opts.req.headers),
    user: {
      isAdmin: false
    }
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
