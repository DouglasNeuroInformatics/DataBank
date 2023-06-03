import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { type CookieSerializeOptions, serialize } from 'cookie';

import { parseAccessToken } from './auth';

export const ACCESS_TOKEN_COOKIE_NAME = 'access_token';

export const ACCESS_TOKEN_COOKIE_OPTIONS: CookieSerializeOptions = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  secure: true
};

export function createContext({ req, resHeaders }: FetchCreateContextFnOptions) {
  return {
    accessToken: parseAccessToken(req),
    removeAccessToken: () => {
      resHeaders.set('Set-Cookie', serialize(ACCESS_TOKEN_COOKIE_NAME, '', ACCESS_TOKEN_COOKIE_OPTIONS));
    },
    setAccessToken: (accessToken: string) => {
      resHeaders.set('Set-Cookie', serialize(ACCESS_TOKEN_COOKIE_NAME, accessToken, ACCESS_TOKEN_COOKIE_OPTIONS));
    },
    user: {
      isAdmin: true
    }
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
