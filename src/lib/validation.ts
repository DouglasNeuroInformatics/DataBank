import { type ZodType } from 'zod';

type ServerAction<T> = (data: T) => Promise<void>;

export function withValidate<T>(action: ServerAction<T>, schema: ZodType<T>) {
  return async (formData: FormData) => {
    'use server';

    console.log(schema);

    const result = await schema.safeParseAsync(formData);

    if (result.success) {
      return await action(result.data);
    }
    throw new Error('Invalid input!');
  };
}
