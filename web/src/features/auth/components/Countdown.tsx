import React from 'react';
import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

type CountdownProps = {
  seconds: number;
};

export const Countdown = ({ seconds }: CountdownProps) => {
  const [count, setCount] = useState(seconds);
  const { t } = useTranslation('common');

  useEffect(() => {
    if (count === 0) return;
    const timer = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [count]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={count === 0 ? 'text-red-600' : undefined}>
      <span>{t('timeRemaining')}: </span>
      {formatTime(count)}
    </div>
  );
};
