import path from 'node:path';
import url from 'node:url';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: process.env.VITE_DEV_SERVER_PORT
  }
});
