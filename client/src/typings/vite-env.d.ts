/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_HOST: string;
  readonly VITE_DEV_EMAIL: string;
  readonly VITE_DEV_PASSWORD: string;
  readonly VITE_DEV_BYPASS_AUTH: 'true' | 'false' | string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
