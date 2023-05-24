'use client';

import React, { useState } from 'react';

import { signIn } from 'next-auth/react';

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
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="username">Username</label>
          <input name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button>Login</button>
      </form>
    </div>
  );
};
