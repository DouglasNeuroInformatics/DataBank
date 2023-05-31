import React from 'react';

const Header = (props: { children: React.ReactNode }) => (
  <div className="mb-3 text-center text-2xl font-medium tracking-tight text-slate-900 dark:text-white">
    {props.children}
  </div>
);

const TextField = (props: { name: string; label: string; type: 'text' | 'password' }) => (
  <div>
    <label className="mb-2 inline-block text-sm" htmlFor={props.name}>
      {props.label}
    </label>
    <input
      className="w-full rounded border bg-slate-50 px-3 py-2 outline-none ring-sky-600 focus:ring dark:border-slate-600 dark:bg-inherit"
      name={props.name}
      type={props.type}
    />
  </div>
);

const SubmitButton = (props: { label: string }) => (
  <button
    className="rounded-md bg-slate-900 px-8 py-3 font-semibold text-white dark:bg-sky-700 dark:hover:bg-sky-600"
    type="submit"
  >
    {props.label}
  </button>
);

const Footer = ({ children, ...props }: React.ComponentPropsWithoutRef<'div'>) => {
  return <div {...props}>{children}</div>;
};

const FormComponent = (props: { action: (data: FormData) => Promise<void>; children: React.ReactNode }) => (
  <form
    action={props.action}
    className="flex flex-col gap-4 rounded-lg bg-white px-6 py-8 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-800 md:p-8"
  >
    {props.children}
  </form>
);

export const Form = Object.assign(FormComponent, {
  Header,
  TextField,
  SubmitButton,
  Footer
});
