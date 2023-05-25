'use client';

import React from 'react';

import { Form } from '@douglasneuroinformatics/react-components';
import { signIn } from 'next-auth/react';

import { useClientTranslations } from '@/hooks/useClientTranslations';

type LoginFormData = {
  username: string;
  password: string;
};

export const LoginForm = () => {
  const t = useClientTranslations();
  return (
    <div>
      <h3 className="">Login</h3>
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
          required: ['username', 'password'],
          errorMessage: {
            properties: {
              username: t['form.errors.required'],
              password: t['form.errors.required']
            }
          }
        }}
        onSubmit={(credentials) => {
          void signIn('credentials', {
            username: credentials.username,
            password: credentials.password,
            redirect: true,
            callbackUrl: '/home'
          });
        }}
      />
    </div>
  );
};
