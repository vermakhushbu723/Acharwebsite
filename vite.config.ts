import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// In development, /api is proxied to the backend so the browser sees one origin.
// Target comes from VITE_API_PROXY in .env.development (live or local backend).
export default defineConfig(({ mode }) => {
  const target = loadEnv(mode, process.cwd()).VITE_API_PROXY || process.env.VITE_API_PROXY || 'http://localhost:5000';
  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      proxy: Object.fromEntries(
        ['/api', '/sitemap.xml', '/robots.txt'].map((p) => [p, { target, changeOrigin: true }]),
      ),
    },
  };
});
