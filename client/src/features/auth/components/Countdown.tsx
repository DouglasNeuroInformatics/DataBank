import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

interface CountdownProps {
  seconds: number;
}

export const Countdown = ({ seconds }: CountdownProps) => {
  const [count, setCount] = useState(seconds);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <span>{t('timeRemaining')}: </span>
      {formatTime(count)}
    </div>
  );
};
