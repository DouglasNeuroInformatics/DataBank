import type { Locale } from '@databank/core';

declare module 'http' {
  interface IncomingMessage {
    locale?: Locale;
  }
}
