'use client';

import React from 'react';

import { trpc } from '@/server/trpc';

const Page = () => {
  const name = trpc.userById.useQuery(1);

  if (name.data == undefined) {
    // eslint-disable-next-line no-console
    console.log('name.data undefined');
    return <p>Loading...</p>;
  }
  
  // eslint-disable-next-line no-console
  console.log(`result.data is ${JSON.stringify(name.data)}`);

  return <p>Hello, {name.data.name}, greetings from client component land!</p>;
};

export default Page;
