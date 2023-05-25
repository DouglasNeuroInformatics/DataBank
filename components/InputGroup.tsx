import React from 'react';

import { clsx } from 'clsx';

export interface InputGroupProps {
  name: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export const InputGroup = ({ name, label, type, value, onChange }: InputGroupProps) => {
  return (
    <div className="relative my-9 flex w-full">
      <div className="flex flex-grow flex-col">
        <input
          autoComplete="off"
          className="w-full bg-transparent py-2 text-left text-slate-900 hover:border-slate-300 focus:border-indigo-800 focus:outline-none border-b-2 peer min-h-[42px]"
          name={name}
          type={type}
          value={value ?? ''}
          onChange={onChange}
        />
        <label
          className={clsx(
            'pointer-events-none text-slate-600 field-label absolute left-0 transition-all peer-focus:-translate-y-5 peer-focus:text-sm peer-focus:text-indigo-800',
            {
              '-translate-y-5 text-sm text-indigo-800': value
            }
          )}
          htmlFor={name}
        >
          {label}
        </label>
      </div>
    </div>
  );
};
