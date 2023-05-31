'use server';

import { redirect } from 'next/navigation';

export async function handleCreateAccount(formData: FormData) {
  console.log(formData);
  return redirect('/');
}
