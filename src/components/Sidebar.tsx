import React from 'react';

import { Branding } from './Branding';

export const Sidebar = () => {
  return (
    <div className="flex h-screen w-80 flex-col bg-slate-900 p-3 text-slate-300">
      <Branding />
      <hr className="my-1" />
      <span>NAVIGATION</span>
      <hr className="my-1 mt-auto" />
      <div className="flex items-center">
        <span>USER DROPUP</span>
      </div>
    </div>
  );
};
