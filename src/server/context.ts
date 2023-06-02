import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export function createContext(opts: FetchCreateContextFnOptions) {
  console.log(opts?.req.headers.get('cookie'));
  return {
    headers: opts && Object.fromEntries(opts.req.headers),
    setAccessToken: (accessToken: string) => {
      opts.resHeaders.set('Set-Cookie', `access-token=${accessToken}`);
    },
    user: {
      isAdmin: true
    }
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
