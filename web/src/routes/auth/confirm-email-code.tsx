import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react';

import { Spinner } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { cn } from '@douglasneuroinformatics/libui/utils';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

import { AuthLayout } from '@/components/AuthLayout';
import { useSendConfirmEmailCodeMutation } from '@/hooks/mutations/useSendConfirmEmailCodeMutation';
import { useVerifyAccountMutation } from '@/hooks/mutations/useVerifyAccountMutation';
import { useAppStore } from '@/store';

const CODE_LENGTH = 6;
const EMPTY_CODE = Object.freeze(Array<null>(CODE_LENGTH).fill(null));

function getUpdatedDigits(digits: (null | number)[], index: number, value: null | number) {
  const updatedDigits = [...digits];
  updatedDigits[index] = value;
  return updatedDigits;
}

const ConfirmEmailCodeInput = ({
  className,
  onComplete
}: {
  className?: string;
  onComplete: (code: number) => void;
}) => {
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { t } = useTranslation('common');
  const [digits, setDigits] = useState<(null | number)[]>([...EMPTY_CODE]);
  const inputRefs = digits.map(() => useRef<HTMLInputElement>(null));

  useEffect(() => {
    const isComplete = digits.every((value) => Number.isInteger(value));
    if (isComplete) {
      onComplete(parseInt(digits.join('')));
      setDigits([...EMPTY_CODE]);
    }
  }, [digits]);

  const focusNext = (index: number) => inputRefs[index + 1 === digits.length ? 0 : index + 1]?.current?.focus();
  const focusPrev = (index: number) => inputRefs[index - 1 >= 0 ? index - 1 : digits.length - 1]?.current?.focus();

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    let value: null | number;
    if (e.target.value === '') {
      value = null;
    } else if (Number.isInteger(parseInt(e.target.value))) {
      value = parseInt(e.target.value);
    } else {
      return;
    }
    setDigits((prevDigits) => getUpdatedDigits(prevDigits, index, value));
    focusNext(index);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    switch (e.key) {
      case 'ArrowLeft':
        focusPrev(index);
        break;
      case 'ArrowRight':
        focusNext(index);
        break;
      case 'Backspace':
        setDigits((prevDigits) => getUpdatedDigits(prevDigits, index - 1, null));
        focusPrev(index);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedDigits = e.clipboardData
      .getData('text/plain')
      .split('')
      .slice(0, CODE_LENGTH)
      .map((value) => parseInt(value));
    const isValid = pastedDigits.length === CODE_LENGTH && pastedDigits.every((value) => Number.isInteger(value));
    if (isValid) {
      setDigits(pastedDigits);
    } else {
      addNotification({ message: t('invalidCodeFormat'), type: 'warning' });
    }
  };

  return (
    <div className={cn('flex gap-2', className)}>
      {digits.map((_, index) => (
        <input
          className="shadow-xs focus:outline-hidden w-1/6 rounded-md border border-slate-300 bg-transparent p-2 hover:border-slate-300 focus:border-sky-800 dark:border-slate-600 dark:hover:border-slate-400 dark:focus:border-sky-500"
          key={index}
          maxLength={1}
          ref={inputRefs[index]}
          type="text"
          value={digits[index] ?? ''}
          onChange={(e) => {
            handleChange(e, index);
          }}
          onKeyDown={(e) => {
            handleKeyDown(e, index);
          }}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};

const Countdown = ({ seconds }: { seconds: number }) => {
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
    const secs = time % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={count === 0 ? 'text-red-600' : undefined}>
      <span>{t('timeRemaining')}: </span>
      {formatTime(count)}
    </div>
  );
};

const RouteComponent = () => {
  const login = useAppStore((s) => s.auth.act.login);
  const currentUser = useAppStore((s) => s.auth.ctx.currentUser);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const [seconds, setSeconds] = useState<number>();
  const hasSentEmail = useRef(false);
  const sendConfirmEmailCode = useSendConfirmEmailCodeMutation();
  const verifyAccount = useVerifyAccountMutation();

  useEffect(() => {
    if (!hasSentEmail.current) {
      sendConfirmEmailCode.mutate(undefined, {
        onSuccess(response) {
          setSeconds(Math.floor((new Date(response.data.expiry).getTime() - Date.now()) / 60000) * 60);
        }
      });
      hasSentEmail.current = true;
    }
  }, []);

  useEffect(() => {
    if (currentUser?.confirmedAt) {
      void navigate({ to: '/portal/dashboard' });
    }
  }, [currentUser]);

  const handleVerifyCode = (code: number) => {
    verifyAccount.mutate(code, {
      onSuccess(response) {
        addNotification({ type: 'success' });
        login(response.data.accessToken);
        void navigate({ to: '/portal/dashboard' });
      }
    });
  };

  return seconds ? (
    <AuthLayout maxWidth="sm" title={t('verifyAccount')}>
      <ConfirmEmailCodeInput className="my-5" onComplete={handleVerifyCode} />
      <Countdown seconds={seconds} />
    </AuthLayout>
  ) : (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner />
    </div>
  );
};

export const Route = createFileRoute('/auth/confirm-email-code')({
  component: RouteComponent
});
