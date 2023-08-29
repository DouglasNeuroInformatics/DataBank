import path from 'node:path';
import url from 'node:url';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.WEB_DEV_SERVER_PORT ?? '3000'),
    proxy: {
      '/api/': {
        target: {
          host: 'localhost',
          port: parseInt(process.env.API_DEV_SERVER_PORT ?? '5500')
        },
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});
