import React from 'react';

import Image from 'next/image';

import logo from '@/assets/logo.png';

export const Sidebar = () => {
  return (
    <div className="flex h-screen w-80 flex-col bg-slate-900 p-3 text-slate-300">
      <div className="flex items-center p-1 md:p-2">
        <Image alt="logo" className="mr-2 w-14 md:w-16" src={logo} />
        <span className="text-sm uppercase leading-tight antialiased md:text-base" style={{ maxWidth: '7.5em' }}>
          Data Bank
        </span>
      </div>
      <hr className="my-1" />
      <nav></nav>
      <hr className="my-1 mt-auto" />
    </div>
  );
};
