'use client';

import React from 'react';

import { trpc } from '@/utils/trpc';

const Page = () => {
  const user = trpc.user.get.useQuery({ email: 'me@example.com' });

  if (!user.data) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Email: {user.data.email}</h1>
    </div>
  );
};

export default Page;
