import { $BooleanLike, $NumberLike, $UrlLike } from '@douglasneuroinformatics/libjs';
import { $BaseEnv } from '@douglasneuroinformatics/libnest';
import { z } from 'zod';

export const $Env = $BaseEnv
  .omit({ API_PORT: true })
  .extend({
    API_DEV_SERVER_PORT: $NumberLike.pipe(z.number().positive().int()),
    FILE_UPLOAD_QUEUE_NAME: z.string().min(1),
    MAX_VALIDATION_ATTEMPTS: $NumberLike.pipe(z.number().positive().int()),
    MONGO_PORT: $NumberLike.pipe(z.number().positive().int()),
    MONGO_URI: $UrlLike,
    MONGO_VERSION: z.string().min(1),
    SMTP_AUTH_PASSWORD: z.string().min(1),
    SMTP_AUTH_USERNAME: z.string().min(1),
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: $NumberLike.pipe(z.union([z.literal(25), z.literal(465), z.literal(587)])),
    SMTP_SECURE: $BooleanLike,
    SMTP_SENDER: z.string().min(1).email(),
    VALIDATION_TIMEOUT: $NumberLike.pipe(z.number().positive().int()),
    VALKEY_HOST: z.string().min(1),
    VALKEY_PORT: $NumberLike.pipe(z.number().positive().int()),
    VALKEY_VERSION: z.string().min(1)
  })
  .transform((env, ctx) => {
    if (env.NODE_ENV === 'development' && !env.API_DEV_SERVER_PORT) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'API_DEV_SERVER_PORT must be defined in development'
      });
    }
    return { ...env, API_PORT: env.API_DEV_SERVER_PORT ?? 80 };
  });
