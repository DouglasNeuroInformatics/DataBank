import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import importMetaEnv from '@import-meta-env/unplugin';
import tailwindcss from '@tailwindcss/vite';
import tanstackRouter from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

async function getAppVersion() {
  const { version } = await fs
    .readFile(path.resolve(import.meta.dirname, '../package.json'), 'utf-8')
    .then((content) => JSON.parse(content) as { version: string });
  return version;
}

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000,
    emptyOutDir: false,
    sourcemap: true,
    target: 'es2022'
  },
  define: {
    __APP_VERSION__: JSON.stringify(await getAppVersion())
  },
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      generatedRouteTree: './src/route-tree.ts',
      target: 'react'
    }),
    react(),
    tailwindcss(),
    importMetaEnv.vite({
      example: path.resolve(import.meta.dirname, '.env.public')
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src')
    }
  },
  server: {
    port: parseInt(process.env.WEB_DEV_SERVER_PORT ?? '3000'),
    proxy: {
      '/api/': {
        rewrite: (path: string) => path.replace(/^\/api/, ''),
        target: {
          host: 'localhost',
          port: parseInt(process.env.API_DEV_SERVER_PORT ?? '5500')
        }
      }
    },
    strictPort: true
  }
});
