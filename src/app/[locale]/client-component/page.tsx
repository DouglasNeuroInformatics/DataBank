'use client';

import React from 'react';

import { trpc } from '@/utils/trpc';

const Page = () => {
  const greeting = trpc.sayHello.useQuery();

  if (greeting.data == undefined) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{greeting.data}</h1>
    </div>
  );
};

export default Page;
