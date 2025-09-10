/* eslint-disable @typescript-eslint/consistent-type-definitions */
/// <reference types="vite/client" />

const __APP_VERSION__: string;

interface ImportMetaEnv {
  readonly VITE_DEV_BYPASS_AUTH?: string;
  readonly VITE_DEV_EMAIL?: string;
  readonly VITE_DEV_PASSWORD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
