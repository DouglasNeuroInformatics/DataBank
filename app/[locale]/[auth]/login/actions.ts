'use server';

import { redirect } from 'next/navigation';

export async function handleLogin(formData: FormData) {
  console.log(formData);
  return redirect('/');
}
