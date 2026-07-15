# tsconfig

Shared `tsconfig.json` base for DNP TypeScript projects.

**Type:** config only — no runtime import, no source code; consumed via `extends`.

## Where it's used

`tsconfig.base.json` (repo root), which every workspace package's `tsconfig.json` extends:

```json
{
  "extends": ["@douglasneuroinformatics/tsconfig"]
}
```

## Source

`/Users/joshua/Developer/DouglasNeuroinformatics/tsconfig` (no hosted docs site — this package is a single `tsconfig.json`, nothing to generate docs from).
