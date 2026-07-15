# eslint-config

ESLint flat-config factory for DNP TypeScript/JavaScript projects.

**Type:** config only — no runtime import in application code.

## Where it's used

`eslint.config.js` (repo root):

```js
import { config } from '@douglasneuroinformatics/eslint-config';

export default config();
```

The `config()` factory conditionally assembles flat-config blocks (base, import, react, typescript, jsdoc, json, perfectionist, astro, svelte) based on options passed in. Finer-grained composition is available via the `./configs/*` subpath exports and the `Config`/`ConfigDef`/`Options` types — check the source if you need to override or extend a specific rule set rather than writing new ESLint config from scratch.

## Source

`/Users/joshua/Developer/DouglasNeuroinformatics/eslint-config` (no hosted docs site — this package has no runtime API beyond the config factory).
