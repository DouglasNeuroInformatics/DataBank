import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react';

import { useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { cn } from '@douglasneuroinformatics/libui/utils';

const CODE_LENGTH = 6;

const EMPTY_CODE = Object.freeze(Array<null>(CODE_LENGTH).fill(null));

type ConfirmEmailCodeInputProps = {
  className?: string;
  onComplete: (code: number) => Promise<void>;
};

function getUpdatedDigits(digits: (null | number)[], index: number, value: null | number) {
  const updatedDigits = [...digits];
  updatedDigits[index] = value;
  return updatedDigits;
}

export const ConfirmEmailCodeInput = ({ className, onComplete }: ConfirmEmailCodeInputProps) => {
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { t } = useTranslation('common');
  const [digits, setDigits] = useState<(null | number)[]>([...EMPTY_CODE]);
  const inputRefs = digits.map(() => useRef<HTMLInputElement>(null));

  useEffect(() => {
    const isComplete = digits.every((value) => Number.isInteger(value));
    if (isComplete) {
      void onComplete(parseInt(digits.join('')));
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
      addNotification({
        message: t('invalidCodeFormat'),
        type: 'warning'
      });
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
