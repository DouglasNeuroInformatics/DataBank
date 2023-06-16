import React, { useState } from 'react';

import { Greeting } from '@app/types';

import './styles.css';

export const App = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = new URL(`${import.meta.env.VITE_API_HOST}/v1`);
    if (name) {
      url.searchParams.set('name', name);
    }
    const response = await fetch(url);
    const data: Greeting = await response.json();
    alert(data.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <button>Submit</button>
    </form>
  );
};
