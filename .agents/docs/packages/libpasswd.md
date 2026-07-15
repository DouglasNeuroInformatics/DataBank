# libpasswd

A library for estimating the strength of passwords (wraps `zxcvbn-ts` with EN/FR feedback translation).

**Status in DataBank:** used in `web/src/routes/auth/create-account.tsx`.

## When to reach for this

- Need to score password strength or show strength feedback in a form — use this instead of calling `zxcvbn-ts` directly, since it standardizes the score/feedback shape and handles EN/FR translation for you.

## Key exports

- `estimatePasswordStrength(password: string, options?: PasswordStrengthOptions): PasswordStrengthResult` — the only function. `options.feedbackLanguage` is `'en' | 'fr'` (defaults to `'en'`). Result has `score` (0-4), `success` (`score > 2`), and translated `feedback`.
- Types: `PasswordFeedbackLanguage`, `PasswordStrengthOptions`, `PasswordStrengthResult`.

## Minimal usage

```ts
import { estimatePasswordStrength } from '@douglasneuroinformatics/libpasswd';

const { score, success, feedback } = estimatePasswordStrength(password, { feedbackLanguage: 'fr' });
```

## Docs

No hosted docs site referenced in the package README. See source: `/Users/joshua/Developer/DouglasNeuroinformatics/libpasswd/src/index.ts` (single file, ~44 lines).
