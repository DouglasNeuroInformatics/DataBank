'use client';

import React, { useState } from 'react';

import { useClientTranslations } from '@/hooks/useClientTranslations';

export const Counter = () => {
  const [count, setCount] = useState(0);
  const t = useClientTranslations();

  return (
    <p>
      This component is rendered on client:{' '}
      <button onClick={() => setCount((n) => n - 1)}>{t.counter.decrement}</button> {count}{' '}
      <button onClick={() => setCount((n) => n + 1)}>{t.counter.increment}</button>
    </p>
  );
};
