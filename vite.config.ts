import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// In development, /api is proxied to the backend so the browser sees one origin.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: Object.fromEntries(
      ['/api', '/sitemap.xml', '/robots.txt'].map((p) => [p, { target: process.env.VITE_API_PROXY || 'http://localhost:5000', changeOrigin: true }]),
    ),
  },
});
