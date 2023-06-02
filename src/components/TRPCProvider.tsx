'use client';

import React, { useState } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';

import { trpc } from '@/utils/trpc';

export const TRPCProvider: React.FC<{ children: React.ReactNode }> = (p) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/api/trpc'
        })
      ]
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{p.children}</QueryClientProvider>
    </trpc.Provider>
  );
};
