import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

import { parseAccessToken } from './auth';

export function createContext({ req, resHeaders }: FetchCreateContextFnOptions) {
  return {
    accessToken: parseAccessToken(req),
    setAccessToken: (accessToken: string) => {
      resHeaders.set('Set-Cookie', `access-token=${accessToken}`);
    },
    user: {
      isAdmin: true
    }
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
