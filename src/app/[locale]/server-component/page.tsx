import React from 'react';

import { appRouter } from '@/server/trpc-server';

/** This is a React Server Component */
export default async function Page() {
  const caller = appRouter.createCaller({});
  // call the tRPC endpoint
  const result = await caller.userById(2);

  if (!result) {
    return <h1>Loading...</h1>;
  }

  // we render this output on the server
  return <p>Hi, {result.name}, greetings from RSC land!</p>;
}
