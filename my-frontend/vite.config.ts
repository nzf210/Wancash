import 'dotenv/config'; // Load .env files otomatis
import { fileURLToPath, URL } from 'node:url';
import http from 'node:http'; // Tambah ini buat http agent
import https from 'node:https';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => { // Ambil mode dari Vite (dev/build)
  // Tentuin target proxy dinamis berdasarkan environment
  const proxyTarget = process.env.VITE_CLOUDE_WORKER ?? 'http://localhost:8787'; // Default local buat dev

  // Pilih agent berdasarkan protocol target (http atau https)
  const isHttps = proxyTarget.startsWith('https://');
  const agent = isHttps
    ? new https.Agent({
        rejectUnauthorized: false, // Dev only, matiin kalau prod aman
        keepAlive: true,
        timeout: 120000,
      })
    : new http.Agent({
        keepAlive: true,
        timeout: 120000,
      });

  return {
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      __DEV__: JSON.stringify(mode === 'development'), // Dinamis berdasarkan mode
      // 'import.meta.env.PROD': JSON.stringify(mode === 'production'),
    },
    envDir: '.', // Root project
    envPrefix: 'VITE_',
    build: {
      minify: 'terser',
      terserOptions: {
        maxWorkers: 4,
      },
    },
    server: {
      proxy: {
        '/api': {
          target: proxyTarget, // Dinamis!
          changeOrigin: true,
          secure: isHttps, // Auto detect protocol buat secure
          ws: true,
          timeout: 120000, // 2 menit, cukup buat slow connect
          proxyTimeout: 120000,
          agent, // Pakai agent dinamis di atas
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('Connection', 'keep-alive');
              console.log(`Proxying request to: ${proxyTarget}`); // Logging buat debug
            });
            proxy.on('error', (err) => {
              console.error('Proxy error detail:', err.message); // Lebih detail
            });
          },
        },
      },
    },
  };
});
