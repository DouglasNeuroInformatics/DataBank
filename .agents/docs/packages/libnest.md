# libnest

Generic NestJS decorators, pipes, modules, and utilities used across DNP projects.

**Status in DataBank:** used extensively in `api/` — this is the foundation of the API's app bootstrap, config, database access, mail, logging, and auth.

## When to reach for this

- Bootstrapping a NestJS app, wiring middleware, or generating OpenAPI docs — use `AppFactory` instead of assembling `NestFactory` boilerplate by hand.
- Reading typed/validated env vars — use `ConfigService` instead of `process.env` access.
- Talking to Prisma — use `PrismaModule` / `InjectPrismaClient` / `InjectModel` instead of instantiating `PrismaClient` directly outside of the options factory.
- Sending mail, logging, or hashing/encrypting within a Nest app — use `MailModule`/`LoggingModule`/`CryptoModule` instead of a third-party Nest integration.
- Validating request bodies/params against a Zod schema — use `ValidationPipe`/`ParseSchemaPipe`/`ValidObjectIdPipe` instead of a custom pipe.

## Subpath exports

| Subpath            | Purpose                                   | Representative exports (not exhaustive — see hosted docs)                                                                                                                                                                                                                                                                                                                                               |
| ------------------ | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.` (root)         | App bootstrap, modules, pipes, decorators | `AppFactory`, `CurrentUser`, `acceptLanguage`, `ConfigModule`/`ConfigService`, `CryptoModule`/`CryptoService`, `LoggingModule`/`LoggingService`, `MailModule`/`MailService`, `PrismaModule`/`InjectModel`/`InjectPrismaClient`/`LibnestPrismaExtension`/`getModelToken`, `VirtualizationModule`/`VirtualizationService`, `ValidationPipe`/`ParseSchemaPipe`/`ValidObjectIdPipe`, `$BaseEnv`/`$MongoEnv` |
| `./testing`        | Test doubles for Nest providers           | `createMock` — exists for mocking libnest-provided services, **not yet actively used in this repo**; check hosted docs before hand-rolling manual test doubles for libnest services                                                                                                                                                                                                                     |
| `./testing/plugin` | Vitest/testing plugin integration         | (see hosted docs)                                                                                                                                                                                                                                                                                                                                                                                       |
| `./user-config`    | User-supplied app config typing           | `RequestUser` and related types                                                                                                                                                                                                                                                                                                                                                                         |

Also ships a `libnest` CLI (`bin`) for dev/build/example workflows — not currently invoked from DataBank's own scripts.

## Common patterns in this repo

App bootstrap via `AppFactory` (`api/src/app.ts`):

```ts
import { acceptLanguage, AppFactory, PrismaModule } from '@douglasneuroinformatics/libnest';

export default AppFactory.create({
  configureMiddleware: (consumer) => {
    consumer.apply(acceptLanguage({ fallbackLanguage: 'en', supportedLanguages: ['en', 'fr'] })).forRoutes('*');
  },
  envSchema: $Env,
  imports: [
    /* ...feature modules */
    PrismaModule.forRootAsync({ useClass: PrismaModuleOptionsFactory })
  ]
  // ...
});
```

Prisma client wiring via `LibnestPrismaExtension` and `ConfigService` (`api/src/core/prisma.ts`):

```ts
import { ConfigService, LibnestPrismaExtension } from '@douglasneuroinformatics/libnest';
import type { PrismaModuleOptions } from '@douglasneuroinformatics/libnest';

@Injectable()
export class PrismaModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  async create() {
    const client = new PrismaClient({ datasourceUrl: this.getConnectionUrl() }).$extends(LibnestPrismaExtension);
    await client.$connect();
    return { client } satisfies PrismaModuleOptions;
  }
}
```

See `api/src/auth/auth.guard.ts` and `api/src/auth/auth.module.ts` for `CurrentUser`/guard patterns.

## Docs

https://douglasneuroinformatics.github.io/libnest
