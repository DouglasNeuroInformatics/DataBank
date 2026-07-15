## Project

## Commands

Package manager is pnpm (>=10). Node >= v24.15.0 (see `.nvmrc`, currently `lts/krypton`).

```sh
pnpm install                # install deps
pnpm dev                    # run app via turbo
pnpm build                  # turbo build (all packages/apps)
pnpm lint                   # turbo lint (tsc + eslint per package)
pnpm format                 # turbo format (prettier per package)
pnpm test                   # run vitest across the whole workspace
```

Per-package scripts (run from repo root via turbo filters, or `cd` into the package): `build`, `dev`, `lint` (`tsc && eslint --fix src`), `format`, `test`. Use `pnpm --filter @databank/<pkg> <script>` or turbo's `--filter=<pkg>` to target one workspace package.

`web` uses TanStack Router with a generated `src/route-tree.ts`. **Do not run the route-tree generator yourself** — the user runs it manually after route changes.

## Internal Packages

DataBank depends on 9 `@douglasneuroinformatics/*` packages maintained in sibling repos. Check `.agents/docs/packages/index.md` before writing code that duplicates one of these.

| Package          | Purpose                                                                                 | Used here?                |
| ---------------- | --------------------------------------------------------------------------------------- | ------------------------- |
| eslint-config    | ESLint flat-config factory for DNP TS/JS projects                                       | yes — root config         |
| tsconfig         | Shared `tsconfig.json` base                                                             | yes — root config         |
| libjs            | Utility functions/types (arrays, dates, zod schemas, etc.)                              | yes — light               |
| libcrypto        | Web Crypto API wrappers (hashing, hybrid encryption)                                    | no — available            |
| libnest          | NestJS decorators/pipes/modules (config, prisma, mail, logging, crypto, virtualization) | yes — heavy, `api` only   |
| libpasswd        | Password strength estimation (zxcvbn wrapper)                                           | yes — light               |
| libstats         | Basic stats in Rust/NAPI (sum, mean, std, linear regression)                            | no — available            |
| libui-form-types | Type-only declarative form schema (`FormTypes`)                                         | no — transitive via libui |
| libui            | React/Tailwind UI components, hooks, providers                                          | yes — heavy, `web` only   |

See `.agents/docs/packages/<name>.md` for exports and usage snippets.

## Conventions

- Make small, incremental, easily reviewable changes — avoid sweeping refactors unless explicitly requested.
- Favor type safety over convenience; avoid type casting unless necessary. Never silently swallow errors.
- No new dependencies without approval. Before reaching for a third-party library, check `.agents/docs/packages/index.md` — an internal DNP package may already solve it.
- Prefer descriptive variable names over terse or cryptic ones.
- Avoid excessive comments; don't comment obvious behavior. Use comments only to explain non-obvious behavior or pitfalls.
- Once all changes are complete, run `pnpm lint` and `pnpm test` from the repo root to verify them.
- All frontend user-facing strings need to be translated using the `useTranslation` hook (prefer inline translations with `t({ en: '...', fr: '...' })` unless translation is used multiple times).
