import React from 'react';

interface TextFieldProps {
  name: string;
  label: string;
  type: 'text' | 'password';
}

const TextField = ({ name, label, type }: TextFieldProps) => (
  <div className="flex flex-col" key={name}>
    <label htmlFor={name}>{label}</label>
    <input className="appearance-none rounded-md border px-3 py-2 shadow" name={name} type={type} />
  </div>
);

interface SubmitButtonProps {
  label: string;
}

const SubmitButton = ({ label }: SubmitButtonProps) => (
  <button className="border" type="submit">
    {label}
  </button>
);

interface FormProps {
  action: (data: FormData) => Promise<void>;
  children: React.ReactElement<TextFieldProps> | React.ReactElement<TextFieldProps>[];
}

const FormComponent = ({ action, children }: FormProps) => (
  <form action={action} className="flex max-w-md flex-col gap-3 border p-5">
    {children}
  </form>
);

export const Form = Object.assign(FormComponent, { TextField, SubmitButton });
