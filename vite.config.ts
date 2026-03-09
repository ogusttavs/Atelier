import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    // Pode ser desligado por variável de ambiente em ambientes controlados.
    hmr: process.env.DISABLE_HMR !== 'true',
    proxy: {
      // Redireciona /api/* para o backend Express em desenvolvimento
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
