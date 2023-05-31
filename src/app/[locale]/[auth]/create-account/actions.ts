'use server';

import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import prisma from '@/lib/prisma';

const createUserDataSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1)
});

type CreateUserData = z.infer<typeof createUserDataSchema>;

export async function createAccount(formData: FormData) {
  let data: CreateUserData;
  try {
    data = await createUserDataSchema.parseAsync(Object.fromEntries(formData.entries()));
  } catch (error) {
    throw new Error('Invalid input!', {
      cause: error
    });
  }
  return redirect('/');
}
