import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { serialize } from 'cookie';

import { parseAccessToken } from './auth';
export function createContext({ req, resHeaders }: FetchCreateContextFnOptions) {
  return {
    accessToken: parseAccessToken(req),
    setAccessToken: (accessToken: string) => {
      resHeaders.set(
        'Set-Cookie',
        serialize('access_token', accessToken, {
          httpOnly: true,
          path: '/',
          sameSite: 'lax',
          secure: true
        })
      );
    },
    user: {
      isAdmin: true
    }
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
