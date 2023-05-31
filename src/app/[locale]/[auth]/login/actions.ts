'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

const loginCredentialsSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1)
});

type LoginCredentials = z.infer<typeof loginCredentialsSchema>;

export async function login(formData: FormData) {
  let credentials: LoginCredentials;
  try {
    credentials = await loginCredentialsSchema.parseAsync(Object.fromEntries(formData.entries()));
  } catch (error) {
    throw new Error('Invalid input!', {
      cause: error
    });
  }
  return redirect('/');
}
