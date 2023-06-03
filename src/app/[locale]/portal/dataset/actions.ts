'use server';

export async function uploadDataset(formData: FormData) {
  const file = formData.get('file') as File;
  console.log('Attempting to parse file');
  const content = await file.text();
  console.log(content);
}
