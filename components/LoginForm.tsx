'use client';

import React, { useState } from 'react';

import { signIn } from 'next-auth/react';

import { InputGroup } from './InputGroup';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    void signIn('credentials', {
      username,
      password,
      redirect: true,
      callbackUrl: 'http://localhost:3000/en/home'
    });
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-center font-medium text-2xl">Sign In</h1>
      <form onSubmit={handleSubmit}>
        <InputGroup label="Username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <InputGroup
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-slate-700 w-full text-slate-50 p-2 rounded-lg">Login</button>
      </form>
    </div>
  );
};
