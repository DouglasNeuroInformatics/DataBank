# Internal DNP packages

DataBank depends on 9 `@douglasneuroinformatics/*` packages maintained in sibling repos under `/Users/joshua/Developer/DouglasNeuroinformatics/`. Consult this before adding a third-party dependency or writing utility/crypto/stats/form-typing/UI code from scratch — one of these may already solve it.

### Config-only

| Package       | Purpose                                           | Docs                                 |
| ------------- | ------------------------------------------------- | ------------------------------------ |
| eslint-config | ESLint flat-config factory for DNP TS/JS projects | [eslint-config.md](eslint-config.md) |
| tsconfig      | Shared `tsconfig.json` base                       | [tsconfig.md](tsconfig.md)           |

### Utilities & single-purpose libraries

| Package          | Purpose                                                      | Used here?                | Docs                                       |
| ---------------- | ------------------------------------------------------------ | ------------------------- | ------------------------------------------ |
| libjs            | Utility functions/types (arrays, dates, zod schemas, etc.)   | yes — light               | [libjs.md](libjs.md)                       |
| libcrypto        | Web Crypto API wrappers (hashing, hybrid encryption)         | no — available            | [libcrypto.md](libcrypto.md)               |
| libpasswd        | Password strength estimation (zxcvbn wrapper)                | yes — light               | [libpasswd.md](libpasswd.md)               |
| libstats         | Basic stats in Rust/NAPI (sum, mean, std, linear regression) | no — available            | [libstats.md](libstats.md)                 |
| libui-form-types | Type-only declarative form schema (`FormTypes`)              | no — transitive via libui | [libui-form-types.md](libui-form-types.md) |

### Framework/UI (heavily used)

| Package | Purpose                                                                                 | Used here?              | Docs                     |
| ------- | --------------------------------------------------------------------------------------- | ----------------------- | ------------------------ |
| libnest | NestJS decorators/pipes/modules (config, prisma, mail, logging, crypto, virtualization) | yes — heavy, `api` only | [libnest.md](libnest.md) |
| libui   | React/Tailwind UI components, hooks, providers                                          | yes — heavy, `web` only | [libui.md](libui.md)     |

### Maintenance note

These are hand-written snapshots, not auto-synced with upstream. Export lists for the larger packages (`libnest`, `libui`) are illustrative examples, not complete — if something looks missing or wrong, check the package's hosted docs (typedoc or Storybook, linked in each file) or its source repo under `/Users/joshua/Developer/DouglasNeuroinformatics/<name>` before assuming it doesn't exist.
