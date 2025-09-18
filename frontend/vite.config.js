import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss()],
  css: {
    postcss: {
      config: path.resolve(__dirname, 'postcss.config.cjs'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL ,
        changeOrigin: true,
        secure: false
      },
    },
  },
});
