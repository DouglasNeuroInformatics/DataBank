# libcrypto

Wrappers for the Web Crypto API.

**Status in DataBank: not currently used — consider before writing equivalent logic.** If a task calls for hashing or encrypting data (in Node or the browser), reach for this instead of calling `crypto.subtle` directly or adding a third-party crypto dependency.

## When to reach for this

- Need a SHA-256 hex digest of a string.
- Need hybrid public-key encryption/decryption (asymmetric key exchange + symmetric payload encryption) between two parties.

## Key exports

- `sha256(source: string): Promise<string>` — returns a hex-encoded SHA-256 digest.
- `HybridCrypto` — static class wrapping HPKE (Hybrid Public Key Encryption):
  - `HybridCrypto.generateKeyPair()`
  - `HybridCrypto.encrypt({ plainText, publicKey }): Promise<EncryptResult>`
  - `HybridCrypto.decrypt({ cipherText, privateKey, symmetricKey }): Promise<string>`
  - `HybridCrypto.serializeKeyPair` / `deserializePublicKey` / `deserializePrivateKey`
- Types: `EncryptParams`, `EncryptResult`, `DecryptParams`.

Verify exact signatures in source before use, since this wraps an evolving HPKE suite (`@hpke/core`).

## Minimal usage

```ts
import { sha256 } from '@douglasneuroinformatics/libcrypto';

const digest = await sha256('some-input');
```

## Docs

No hosted docs site referenced in the package README. See source: `/Users/joshua/Developer/DouglasNeuroinformatics/libcrypto` (`src/hash.ts`, `src/encryption.ts`).
