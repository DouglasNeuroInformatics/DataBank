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

## Conventions

- Make small, incremental, easily reviewable changes — avoid sweeping refactors unless explicitly requested.
- Favor type safety over convenience; avoid type casting unless necessary. Never silently swallow errors.
- No new dependencies without approval.
- Prefer descriptive variable names over terse or cryptic ones.
- Avoid excessive comments; don't comment obvious behavior. Use comments only to explain non-obvious behavior or pitfalls.
- Once all changes are complete, run `pnpm lint` and `pnpm test` from the repo root to verify them.
- All frontend user-facing strings need to be translated using the `useTranslation` hook (prefer inline translations with `t({ en: '...', fr: '...' })` unless translation is used multiple times).
