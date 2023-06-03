'use client';

import React, { useRef, useState } from 'react';

import Link from 'next/link';

import { ArrowToggle, useOnClickOutside } from '@douglasneuroinformatics/react-components';
import { Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/solid';

import { useClientTranslations } from '@/hooks/useClientTranslations';

export const UserDropup = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const t = useClientTranslations();

  const closeDropup = () => setIsOpen(false);

  useOnClickOutside(ref, () => {
    if (isOpen) {
      closeDropup();
    }
  });

  return (
    <div className="relative w-full" ref={ref}>
      <div className="absolute top-0 w-full">
        <Transition
          as={React.Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
          show={isOpen}
        >
          <div className="absolute bottom-3 w-40 bg-slate-800 shadow-lg">
            <button className="w-full p-2 hover:bg-slate-700" onClick={() => null}>
              {t.logout}
            </button>
            {/* <LanguageToggle className="w-full p-2 hover:bg-slate-700" onClick={closeDropup} /> */}
            <Link className="block w-full p-2 text-center hover:bg-slate-700" href="#" onClick={closeDropup}>
              {t.preferences}
            </Link>
          </div>
        </Transition>
      </div>
      <ArrowToggle
        className="p-2"
        content={
          <div className="flex items-center">
            <UserCircleIcon className="mr-2" height={32} width={32} />
            <span>User</span>
          </div>
        }
        contentPosition="left"
        position="right"
        rotation={-90}
        onClick={() => setIsOpen(!isOpen)}
      />
    </div>
  );
};
