# libjs

A collection of utility functions and types for Node.js and the browser.

**Status in DataBank:** used lightly, e.g. `api/src/core/env.schema.ts` (`$BooleanLike`, `$NumberLike`), `core/src/demo.ts` (`deepFreeze`), `web/src/router.tsx` (`errorToJSON`) — examples, not exhaustive.

## When to reach for this

- Need a generic array/object/string/date helper (uniqueness checks, deep freeze, range utilities, etc.) — check here before writing one or adding a micro-dependency (e.g. lodash) for it.
- Need a Zod schema for coercing env-style string values (`$BooleanLike`, `$NumberLike`) instead of writing custom coercion.
- Need to serialize an `Error` for logging/transport (`errorToJSON`) instead of a one-off `JSON.stringify` workaround.

## Key exports

Re-exported from per-domain modules — `array`, `datetime`, `exception`, `http`, `json`, `number`, `object`, `random`, `range`, `result`, `string`, `types`, `zod`:

- `isUnique`, `hasDuplicates` — array helpers
- `deepFreeze` — recursively freeze an object
- `errorToJSON` — serialize an `Error` into a plain object
- `$BooleanLike`, `$NumberLike` — Zod schemas that coerce string/number-like input (e.g. env vars)

This is a grab-bag utility library — browse `src/*.ts` in the source repo for the full surface; the above are just what's already used in this repo.

## Minimal usage

```ts
import { deepFreeze } from '@douglasneuroinformatics/libjs';

const config = deepFreeze({ retries: 3 });
```

## Docs

https://douglasneuroinformatics.github.io/libjs
