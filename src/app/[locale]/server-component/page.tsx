import React from 'react';

import { appRouter } from '@/server/routers/_app';

/** This is a React Server Component */
export default async function Page() {
  const caller = appRouter.createCaller({});
  // call the tRPC endpoint
  const result = await caller.sayHello();

  if (!result) {
    return <h1>Loading...</h1>;
  }

  // we render this output on the server
  return (
    <div>
      <h1>{result}</h1>
    </div>
  );
}
