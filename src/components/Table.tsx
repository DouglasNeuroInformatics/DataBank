import React from 'react';

import { clsx } from 'clsx';

/* This example requires Tailwind CSS v2.0+ */
const people = [
  { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' }
  // More people...
];

export const Table = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-slate-900">Users</h1>
          <p className="mt-2 text-sm text-slate-700">
            A list of all the users in your account including their name, title, email and role.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            type="button"
          >
            Add user
          </button>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="shadow-sm ring-1 ring-black ring-opacity-5">
              <table className="min-w-full border-separate" style={{ borderSpacing: 0 }}>
                <thead className="bg-slate-50">
                  <tr>
                    <th
                      className="sticky top-0 z-10 border-b border-slate-300 bg-slate-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
                      scope="col"
                    >
                      Name
                    </th>
                    <th
                      className="sticky top-0 z-10 hidden border-b border-slate-300 bg-slate-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-slate-900 backdrop-blur backdrop-filter sm:table-cell"
                      scope="col"
                    >
                      Title
                    </th>
                    <th
                      className="sticky top-0 z-10 hidden border-b border-slate-300 bg-slate-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-slate-900 backdrop-blur backdrop-filter lg:table-cell"
                      scope="col"
                    >
                      Email
                    </th>
                    <th
                      className="sticky top-0 z-10 border-b border-slate-300 bg-slate-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-slate-900 backdrop-blur backdrop-filter"
                      scope="col"
                    >
                      Role
                    </th>
                    <th
                      className="sticky top-0 z-10 border-b border-slate-300 bg-slate-50 bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                      scope="col"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {people.map((person, personIdx) => (
                    <tr key={person.email}>
                      <td
                        className={clsx(
                          'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6 lg:pl-8',
                          { 'border-b border-slate-200': personIdx !== people.length - 1 }
                        )}
                      >
                        {person.name}
                      </td>
                      <td
                        className={clsx('hidden whitespace-nowrap px-3 py-4 text-sm text-slate-500 sm:table-cell', {
                          'border-b border-slate-200': personIdx !== people.length - 1
                        })}
                      >
                        {person.title}
                      </td>
                      <td
                        className={clsx('hidden whitespace-nowrap px-3 py-4 text-sm text-slate-500 lg:table-cell', {
                          'border-b border-slate-200': personIdx !== people.length - 1
                        })}
                      >
                        {person.email}
                      </td>
                      <td
                        className={clsx('whitespace-nowrap px-3 py-4 text-sm text-slate-500', {
                          'border-b border-slate-200': personIdx !== people.length - 1
                        })}
                      >
                        {person.role}
                      </td>
                      <td
                        className={clsx(
                          'relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8',
                          { 'border-b border-slate-200': personIdx !== people.length - 1 }
                        )}
                      >
                        <a className="text-indigo-600 hover:text-indigo-900" href="#">
                          Edit<span className="sr-only">, {person.name}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
