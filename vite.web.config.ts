import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  root: resolve('src/renderer'),
  plugins: [react()],
  resolve: { alias: { '@': resolve('src/renderer') } },
  css: { postcss: resolve('postcss.config.js') },
  build: { outDir: resolve('dist/web'), emptyOutDir: true },
});
