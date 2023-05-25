'use client';

import React from 'react';

import { Form } from '@douglasneuroinformatics/react-components';
import { signIn } from 'next-auth/react';

type LoginFormData = {
  username: string;
  password: string;
};

export const LoginForm = () => {
  return (
    <Form<LoginFormData>
      content={{
        username: {
          kind: 'text',
          label: 'Username',
          variant: 'short'
        },
        password: {
          kind: 'text',
          label: 'Password',
          variant: 'password'
        }
      }}
      validationSchema={{
        type: 'object',
        properties: {
          username: {
            type: 'string',
            minLength: 1
          },
          password: {
            type: 'string',
            minLength: 1
          }
        },
        required: ['username', 'password']
      }}
      onSubmit={(credentials) => {
        void signIn('credentials', {
          username: credentials.username,
          password: credentials.password,
          redirect: true,
          callbackUrl: 'http://localhost:3000/en/home'
        });
      }}
    />
  );
};
